import Seneca from 'seneca-browser'
import SenecaRedux from '@seneca/redux'


// TODO: only version in public
import Pkg from '../package.json'

// TODO: only pull in a subset, private/public
import Model from '../model/model.json'

let main: any = null

function getMain() {
  if (null != main) {
    return main
  }

  main = {
    model: Model,
    info: {
      version: Pkg.version
    },
  }

  let endpoint = (msg: any) => {
    let suffix =
      '/api/web' + ('auth' === msg.on ? '/public/auth' : '/private/' + msg.on)
    let url = document.location.origin + suffix

    return url
  }


  const seneca = Seneca({
    legacy: false,
    log: { logger: 'flat', level: 'warn' },
    plugin: {
      browser: {
        endpoint,
        headers: {},
        fetch: {
          credentials: 'include'
        }
      }
    },
    timeout: 98765
  })
    // .test('print')
    .test()

  seneca.context.model = Model

  seneca
    // .quiet()
    .use(SenecaRedux, {
      debug: true,
      name: 'main',
      state: {
        auth: {
          state: 'none',
          user: null,
        }
      },

      // TODO: move to BasicLed setup
      slot: {
        'track': {},
      }
    })

    .client({
      type: 'browser',
      pin: ['aim:req']
    })


    .use(function publicResponseHandlers(this: any) {
      const seneca = this

      seneca
        .add('aim:res,on:auth,load:auth', function(msg: any) {
          let { state, res } = msg.res()
          if (res.ok) {
            state.auth.state = res.state
            state.auth.user = res.user
          }
        })
    })

  main.seneca = seneca
    // main.store = store

    ; (window as any).main = main

  return main
}


export {
  getMain
}

