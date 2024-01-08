
const Path = require('path')

const { EnvLambda } = require('@voxgig/build')

const folder = Path.join(__dirname, '..','gen','serverless')
// const custom = Path.join(__dirname, ....)

module.exports = async function(model, build) {
  EnvLambda.resources_yml(model, {
    folder,
    filename: 'res.yml',
    custom: null,
  })
}
