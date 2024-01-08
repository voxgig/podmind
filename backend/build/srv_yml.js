// Copyright (c) Nodezoo Ltd. USED UNDER LICENSE.

const Path = require('path')

const { EnvLambda } = require('@voxgig/build')

const folder = Path.join(__dirname,'..','gen','serverless')

module.exports = async function(model, build) {
  EnvLambda.srv_yml(model, {
    folder
  })
}
