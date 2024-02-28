"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const seneca_1 = __importDefault(require("seneca"));
const system_1 = require("@voxgig/system");
const model_1 = require("@voxgig/model");
const basic_1 = require("../shared/basic");
const PodmindUtility_1 = __importDefault(require("../../concern/PodmindUtility/PodmindUtility"));
const package_json_1 = __importDefault(require("../../../package.json"));
const model_json_1 = __importDefault(require("../../../model/model.json"));
const NODE_ENV = process.env.NODE_ENV || 'development';
const STAGE = process.env.PODCASTIC_STAGE || 'local';
const port = model_json_1.default.main.conf.port;
const pluginConf = model_json_1.default.main.conf.plugin;
run({
    version: package_json_1.default.version,
    port,
});
async function run(info) {
    let seneca = await runSeneca(info);
    let app = await runExpress(info, seneca);
    console.log('STARTED', info);
}
async function runSeneca(info) {
    const { deep } = seneca_1.default.util;
    const seneca = (0, seneca_1.default)(deep(basic_1.base.seneca, {
        tag: 'pdm-local',
        plugin: pluginConf,
    }));
    seneca.context.model = model_json_1.default;
    seneca.context.env = 'local';
    seneca.context.stage = STAGE;
    seneca.context.srvname = 'all';
    seneca.context.getGlobal = () => global;
    info.seneca = seneca.id;
    seneca
        .test();
    (0, basic_1.basic)(seneca);
    seneca
        .use('repl', { port: port.repl })
        .use('gateway$public', {
        debug: {
            log: true,
            response: true,
        },
        // TODO: should be shared
        allow: {
            'aim:req,on:auth': true,
            'aim:req,on:widget,chat:query': true,
        }
    })
        .use('gateway$private', {
    // allow: Object.keys(Model.main.srv)
    //   .reduce(((a,n)=>(a['aim:web,on:'+n]=true,a)),{})
    })
        .use('gateway-express$public')
        .use('gateway-express$private')
        .use('gateway-auth$public')
        .use('gateway-auth$private')
        .use(function setup_data() {
        this.prepare(async function () {
            this
                .act('role:mem-store,cmd:import', {
                merge: true,
                json: JSON.stringify(require(__dirname + '/data.js'))
            });
        });
    });
    // TODO: unify with lambda
    /*
      .use('s3-store', {
        debug: true,
        map: {
          '-/pdm/transcript': '*',
          '-/pdm/rss': '*',
          '-/pdm/audio': '*',
        },
        folder: 'transcript-bucket01',
        local: {
          active: true,
          folder: __dirname + '/../../../data/storage',
        },
      })
    */
    (0, basic_1.setup)(seneca);
    setupLocal(seneca);
    // TODO: load as Concern
    seneca.use(PodmindUtility_1.default);
    // .use(Concern, {
    //   folder: __dirname + '/../../../dist/concern'
    // })
    seneca
        .use(system_1.Local, {
        srv: {
            folder: __dirname + '/../../../dist/srv'
        },
        options: {
            ingest: { debug: true }
        }
    });
    await seneca.ready();
    setupServices(seneca);
    (0, basic_1.finalSetup)(seneca);
    return seneca;
}
async function runExpress(info, seneca) {
    const app = (0, express_1.default)();
    app
        .use(express_1.default.json())
        .use(new cookie_parser_1.default())
        .post('/api/web/public/:end', seneca.export('gateway-express$public/handler'))
        .post('/api/web/private/:end', seneca.export('gateway-express$private/handler'))
        .listen(port.backend);
    return app;
}
async function setupServices(seneca) {
    await seneca.post('aim:prompt,add:prompt,name:ingest.episode.meta01,kind:ingest,tag:v0', {
        text: node_fs_1.default.readFileSync(__dirname + '/../../../data/config/prompt/ingest.episode.meta01-v0.txt').toString()
    });
}
// TODO: @voxgig/system local should handle this
async function setupLocal(seneca) {
    const model = seneca.context.model;
    seneca
        .use('localque-transport');
    Object.entries(model.main.srv).map((entry) => {
        const name = entry[0];
        (0, model_1.dive)(model.main.msg.aim[name], 128).map((entry) => {
            let path = ['aim', name, ...entry[0]];
            let msgMeta = entry[1];
            let pin = (0, model_1.pinify)(path);
            if (msgMeta.transport?.queue?.active) {
                seneca.listen({ type: 'localque', pin });
                console.log('LISTEN localque', pin);
            }
        });
        (0, model_1.dive)(model.main.srv[name].out, 128).map((entry) => {
            let path = entry[0];
            let msgMetaMaybe = (0, model_1.get)(model.main.msg, path);
            if (msgMetaMaybe?.$) {
                let msgMeta = msgMetaMaybe.$;
                let pin = (0, model_1.pinify)(path);
                if (msgMeta.transport?.queue?.active) {
                    seneca.client({ type: 'localque', pin });
                    console.log('CLIENT localque', pin);
                }
            }
        });
    });
}
//# sourceMappingURL=local.js.map