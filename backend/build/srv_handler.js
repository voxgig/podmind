const Path = require('path')

const { EnvLambda } = require('@voxgig/build')

const folder = Path.join(__dirname,'..','src','handler')
const envFolder = Path.join('..','..','env')

module.exports = async function(model, build) {
  EnvLambda.srv_handler(model, {
    folder: Path.join(folder,'lambda'),
    start: 'lambda',
    env: {
      folder: Path.join(envFolder,'lambda'),
    },
    lang: 'ts',
  })
}
