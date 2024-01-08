
import Express from 'express'
const CookieParser = require('cookie-parser')

const Seneca = require('seneca')
const { Local, /* Concern */ } = require('@voxgig/system')

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
    tag: 'pdc-local',
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
      // TODO: should be shared
      allow: {
        'aim:req,on:auth': true,
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
      map: {
        '-/pdc/archive': '*'
      },
      folder: 'archive01',
      local: {
        active: true,
        folder: __dirname + '/../../../data/storage',
      },
    })


    // NOTE: load after store plugins
    .use('entity-util', base.options.entity_util)

    // .use(Concern, {
    //   folder: __dirname + '/../../../dist/concern'
    // })

    .use(Local, {
      srv: {
        folder: __dirname + '/../../../dist/srv'
      },
      options: {
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
