
import { test, describe } from 'node:test'
import { expect } from '@hapi/code'

import { makeSeneca } from './auth.integ.setup'


describe('integ:auth_srv', () => {
  test('get:info', async () => {
    const seneca = await makeSeneca()

    const res0 = await seneca.post('aim:auth,get:info')
    expect(res0).contains({ ok: true, srv: 'auth' })

    await seneca.close()
  })
})
