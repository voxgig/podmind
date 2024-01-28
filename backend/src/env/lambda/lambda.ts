
import Seneca from 'seneca'
import { Live } from '@voxgig/system'
import { dive, camelify, pinify } from '@voxgig/model'

import { basic, setup, base } from '../shared/basic'

import Pkg from '../../../package.json'
import Model from '../../../model/model.json'


import type { Srv } from '../shared/basic'

const NODE_ENV = process.env.NODE_ENV || 'development'
const STAGE = process.env.PODCASTIC_STAGE || 'local'

const domain = `podmin${'prd' === STAGE ? '' : '-' + STAGE}.voxgig.com`


let seneca: any = null

async function getSeneca(srvname: string, complete: Function): Promise<any> {
  const mark = Seneca.util.Nid()

  console.log(
    'SRV-getSeneca',
    'init ',
    mark,
    srvname,
    'VERSION',
    Pkg.version,
    'options',
  )

  const Main = Model.main as any

  if (null == seneca) {
    let srv: Srv = Main.srv[srvname]

    let baseOptions = {
      tag: srvname + '-pdm01-' + STAGE + '@' + Pkg.version,
      ...base.seneca,
      timeout: srv.env.lambda.timeout * 60 * 1000
    }

    seneca = await Seneca(baseOptions).test()
    // seneca.test('print')

    seneca.context.model = Model
    seneca.context.srvname = srvname
    seneca.context.stage = STAGE
    seneca.context.where = 'lambda'
    seneca.context.getGlobal = () => global

    basic(seneca, {
      reload: {
        active: false
      }
    })

    // TODO: move to model
    /*
    let authNeeded = !(
      'monitor' === srvname ||
      'ingest' === srvname ||
      'store' === srvname ||
      (srv.api.web &&
        srv.api.web.path &&
        srv.api.web.path.area &&
        'public/' === srv.api.web.path.area)
    )
    */

    const gateway_allow = srv.api.web?.active ?
      dive(srv.in, 128, (path: any, meta: any) => [
        pinify(path),
        !!meta.allow
      ]).reduce((a: any, n: any) => ((n[1] ? a[n[0]] = true : false), a), {}) :
      undefined

    console.log('GATEWAY-ALLOW', srvname, gateway_allow)

    seneca
      .use('gateway', {
        // TODO move to model
        // NOTE: monitor is private and does not expose a HTTP end point
        allow: gateway_allow
        /*
          'monitor' === srvname
            ? undefined
            : 'ingest' === srvname
              ? undefined
              : 'store' === srvname
                ? undefined
                : { ['aim:req,on:' + srvname]: true }
                */
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
      })

    const dynamo_entity = dive(Model.main.ent, (path: any, _leaf: any) => [
      path.join('/'),
      {
        table: {
          name: `${camelify(path)}.${STAGE}`
        }
      }
    ])

    // dynamo_entity['foo/bar'].table.index = [
    //   { name: 'foobar-index', key: { partition: 'foo', sort: 'bar' } }
    // ]

    seneca
      .use('dynamo-store', {
        entity: dynamo_entity
      })
      .use('s3-store', {
        map: {
          '-/pdm/audio': '*',
          '-/pdm/transcript': '*',
          '-/pdm/rss': '*',
        },
        suffix: '',
        prefix: '',

        // TODO: bug in s3-store: local and s3 folder hanlding should the same 
        // TODO: empty string value is significant - make actual folder used well-defined
        folder: '',

        shared: {
          Bucket: `podmind01-backend01-file01-${STAGE}`
        },
        s3: {
          Region: 'us-east-1'
        },
      })

    setup(seneca)

    setupLambda(seneca, srv)

    seneca.use(Live, {
      srv: {
        name: srvname,
        folder: __dirname + '/../../srv'
      },
      options: {
      }
    })

    if (complete) {
      await seneca.ready()
      await complete(seneca)
    }

    await seneca.ready()
  }

  return seneca
}


async function setupLambda(seneca: any, srv: Srv) {
  seneca
    .use('sqs-transport', {
      suffix: '-' + STAGE
    })

  if (srv.repl?.active) {
    seneca.use('repl', { listen: false })
    await seneca.ready()
    await seneca.post('sys:repl,use:repl,id:invoke')
  }

}


export {
  getSeneca
}


