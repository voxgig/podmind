

function basic(seneca: any, options?: any) {
  options = options || {}
  const deep = seneca.util.deep

  seneca
    .use('promisify', deep(base.options.promisify, options.promisify))
    .use('telemetry', deep(base.options.telemetry, options.telemetry))
    .use('env', deep(base.options.env, options.env))
    .use('entity', deep(base.options.entity, options.entity))
    .use('capture', deep(base.options.capture, options.capture))
    .use('user', deep(base.options.user, options.user))
    .use('owner', deep(base.options.owner, options.owner))
    .use('reload', deep(base.options.reload, options.reload))

  return seneca
}

// After store plugins
function setup(seneca: any, options?: any) {
  options = options || {}
  const deep = seneca.util.deep

  seneca
    .use('entity-util', deep(base.options.entity_util, options.entity_util))
    .use('env', {
      file: [__dirname + '/../local/local-env.js;?'],
      var: {
        DEEPGRAM_APIKEY: String,
      }
    })
    .use('provider', {
      provider: {
        deepgram: {
          keys: {
            apikey: { value: '$DEEPGRAM_APIKEY' },
          }
        },
      }
    })



  return seneca
}




const base = {
  seneca: {
    timeout: 5 * 60 * 1000,// 98765,
    legacy: false,
    log: {
      logger: 'flat',
      level: 'warn'
    }
  },
  options: {
    promisify: {},
    telemetry: {
      active: true,
    },
    env: {
      file: [__dirname + '/../local/local-env.js;?'],
      var: {
      }
    },
    entity: {},
    capture: {},
    user: {
      fields: {
        standard: ['id', 'handle', 'email', 'name', 'active'],
      },
    },
    entity_util: {
      when: {
        active: true,
        human: 'y',
      }
    },
    owner: {
      ownerprop: 'principal.user',
      fields: ['id:owner_id'],
      annotate: [
        'sys:entity',
      ]
    },
    reload: {},
  }
}

export {
  basic,
  setup,
  base,
}
