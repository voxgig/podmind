
import { test, describe } from 'node:test'
import { expect } from '@hapi/code'

import { makeSeneca } from './auth.setup'


describe('auth_srv', () => {
  test('happy', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('srv_auth')).exist()
    await seneca.close()
  })
})

