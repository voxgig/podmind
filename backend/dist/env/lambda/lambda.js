"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSeneca = void 0;
const seneca_1 = __importDefault(require("seneca"));
const system_1 = require("@voxgig/system");
const model_1 = require("@voxgig/model");
const basic_1 = require("../shared/basic");
const PodmindUtility_1 = __importDefault(require("../../concern/PodmindUtility/PodmindUtility"));
const package_json_1 = __importDefault(require("../../../package.json"));
const model_json_1 = __importDefault(require("../../../model/model.json"));
const NODE_ENV = process.env.NODE_ENV || 'development';
const STAGE = process.env.PODCASTIC_STAGE || 'local';
const domain = `podmin${'prd' === STAGE ? '' : '-' + STAGE}.voxgig.com`;
let seneca = null;
async function getSeneca(srvname, complete) {
    const mark = seneca_1.default.util.Nid();
    console.log('SRV-getSeneca', 'init ', mark, srvname, 'VERSION', package_json_1.default.version, 'options');
    const Main = model_json_1.default.main;
    if (null == seneca) {
        let srv = Main.srv[srvname];
        let baseOptions = {
            tag: srvname + '-pdm01-' + STAGE + '@' + package_json_1.default.version,
            ...basic_1.base.seneca,
            timeout: srv.env.lambda.timeout * 60 * 1000
        };
        seneca = await (0, seneca_1.default)(baseOptions).test();
        // seneca.test('print')
        seneca.context.model = model_json_1.default;
        seneca.context.srvname = srvname;
        seneca.context.stage = STAGE;
        seneca.context.where = 'lambda';
        seneca.context.getGlobal = () => global;
        (0, basic_1.basic)(seneca, {
            reload: {
                active: false
            }
        });
        const gateway_allow = srv.api.web?.active ?
            (0, model_1.dive)(srv.in, 128, (path, meta) => [
                meta.allow ? (0, model_1.pinify)(path) : null,
                !!meta.allow
            ])
            : undefined;
        console.log('GATEWAY-ALLOW', srvname, gateway_allow);
        seneca
            .use('gateway', {
            allow: gateway_allow
        })
            .use('gateway-lambda', {
            auth: {
                token: {
                    // TOOD: move to model
                    name: 'podmind-auth'
                },
                cookie: {
                    domain,
                    SameSite: 'Lax'
                }
            },
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'OPTIONS,POST'
            }
        })
            .use('gateway-auth', {
            spec: {
                lambda_cookie: {
                    active: true,
                    token: {
                        // TOOD: move to model
                        name: 'podmind-auth'
                    },
                    user: {
                        auth: true,
                        // require: authNeeded
                        require: srv.user?.required ?? true
                    }
                }
            }
        });
        const dynamo_entity = (0, model_1.dive)(model_json_1.default.main.ent, (path, _leaf) => [
            path.join('/'),
            {
                table: {
                    name: `${(0, model_1.camelify)(path)}.${STAGE}`
                }
            }
        ]);
        // dynamo_entity['foo/bar'].table.index = [
        //   { name: 'foobar-index', key: { partition: 'foo', sort: 'bar' } }
        // ]
        seneca
            .use('dynamo-store', {
            entity: dynamo_entity
        });
        (0, basic_1.setup)(seneca);
        setupLambda(seneca, srv);
        // TODO: load as Concern
        seneca.use(PodmindUtility_1.default);
        // Load Concerns
        seneca.use(system_1.Live, {
            srv: {
                name: srvname,
                folder: __dirname + '/../../srv'
            },
            options: {}
        });
        (0, basic_1.finalSetup)(seneca);
        if (complete) {
            await seneca.ready();
            await complete(seneca);
        }
        await seneca.ready();
    }
    return seneca;
}
exports.getSeneca = getSeneca;
async function setupLambda(seneca, srv) {
    seneca
        .use('sqs-transport', {
        suffix: '-' + STAGE
    });
    if (srv.repl?.active) {
        seneca.use('repl', { listen: false });
        await seneca.ready();
        await seneca.post('sys:repl,use:repl,id:invoke');
    }
}
//# sourceMappingURL=lambda.js.map