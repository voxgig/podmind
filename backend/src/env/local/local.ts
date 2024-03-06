
import Fs from 'node:fs'

import Express from 'express'
import CookieParser from 'cookie-parser'

import Seneca from 'seneca'
import { Local, /* Concern */ } from '@voxgig/system'
import { dive, get, pinify } from '@voxgig/model'

import { basic, setup, base, finalSetup } from '../shared/basic'
import PodmindUtility from '../../concern/PodmindUtility/PodmindUtility'

import Pkg from '../../../package.json'
import Model from '../../../model/model.json'

const NODE_ENV = process.env.NODE_ENV || 'development'
const STAGE = process.env.PODCASTIC_STAGE || 'local'

const port = Model.main.conf.port
const pluginConf = Model.main.conf.plugin


run({
  version: Pkg.version,
  port,
})


async function run(info: any) {
  let seneca = await runSeneca(info)
  let app = await runExpress(info, seneca)

  console.log('STARTED', info)
}


async function runSeneca(info: any) {

  const { deep } = Seneca.util

  const seneca = Seneca(deep(base.seneca, {
    tag: 'pdm-local',
    plugin: pluginConf,
  }))

  seneca.context.model = Model
  seneca.context.env = 'local'
  seneca.context.stage = STAGE
  seneca.context.srvname = 'all'
  seneca.context.getGlobal = () => global

  info.seneca = seneca.id

  seneca
    .test()

  basic(seneca)

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
    .use('gateway$integ')

    .use('gateway-express$public')
    .use('gateway-express$private')
    .use('gateway-express$integ')

    .use('gateway-auth$public')
    .use('gateway-auth$private')

    .use(function setup_data(this: any) {
      this.prepare(async function(this: any) {
        this
          .act('role:mem-store,cmd:import', {
            merge: true,
            json: JSON.stringify(require(__dirname + '/data.js'))
          })
      })
    })

  setup(seneca)

  setupLocal(seneca)


  // TODO: load as Concern
  seneca.use(PodmindUtility)

  // .use(Concern, {
  //   folder: __dirname + '/../../../dist/concern'
  // })

  seneca
    .use(Local, {
      srv: {
        folder: __dirname + '/../../../dist/srv'
      },
      options: {
        ingest: { debug: true }
      }
    })

  await seneca.ready()

  setupServices(seneca)

  finalSetup(seneca)

  return seneca
}


async function runExpress(info: any, seneca: any) {
  const app = Express()

  app
    .use(Express.json())
    .use(new (CookieParser as any)())
    .post('/api/web/public/:end', seneca.export('gateway-express$public/handler'))
    .post('/api/web/private/:end', seneca.export('gateway-express$private/handler'))
    .post('/integ', seneca.export('gateway-express$integ/handler'))
    .listen(port.backend)

  return app
}



async function setupServices(seneca: any) {
  await seneca.post('aim:prompt,add:prompt,name:ingest.episode.meta01,kind:ingest,tag:v0', {
    text: Fs.readFileSync(
      __dirname + '/../../../data/config/prompt/ingest.episode.meta01-v0.txt').toString()
  })

  await seneca.post('aim:prompt,add:prompt,name:chat.query.hive01,kind:chat,tag:v0', {
    text: Fs.readFileSync(
      __dirname + '/../../../data/config/prompt/chat.query.hive01-v0.txt').toString()
  })

}



// TODO: @voxgig/system local should handle this
async function setupLocal(seneca: any) {
  const model = seneca.context.model


  seneca
    .use('localque-transport')

  Object.entries(model.main.srv).map((entry: any[]) => {
    const name = entry[0]

    dive(model.main.msg.aim[name], 128).map((entry: any) => {
      let path = ['aim', name, ...entry[0]]
      let msgMeta = entry[1]
      let pin = pinify(path)
      if (msgMeta.transport?.queue?.active) {
        seneca.listen({ type: 'localque', pin })
        console.log('LISTEN localque', pin)
      }
    })

    dive(model.main.srv[name].out, 128).map((entry: any) => {
      let path = entry[0]
      let msgMetaMaybe = get(model.main.msg, path)
      if (msgMetaMaybe?.$) {
        let msgMeta = msgMetaMaybe.$
        let pin = pinify(path)

        if (msgMeta.transport?.queue?.active) {
          seneca.client({ type: 'localque', pin })
          console.log('CLIENT localque', pin)
        }
      }
    })

  })
}
