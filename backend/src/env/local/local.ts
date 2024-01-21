
import Express from 'express'
const CookieParser = require('cookie-parser')

const Seneca = require('seneca')
const { Local, /* Concern */ } = require('@voxgig/system')
import { dive, get, pinify } from '@voxgig/model'

import { basic, base } from '../shared/basic'

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
    .use('gateway-express$public')
    .use('gateway-express$private')
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


    // NOTE: load after store plugins
    .use('entity-util', base.options.entity_util)

    .use('localque-transport')

  setupLocal(seneca)

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

  return seneca
}


async function runExpress(info: any, seneca: any) {
  const app = Express()

  app
    .use(Express.json())
    .use(new CookieParser())
    .post('/api/web/public/:end', seneca.export('gateway-express$public/handler'))
    .post('/api/web/private/:end', seneca.export('gateway-express$private/handler'))
    .listen(port.backend)

  return app
}


// TODO: @voxgig/system local should handle this
function setupLocal(seneca: any) {
  const model = seneca.context.model

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
