
import Seneca from 'seneca'
import Model from '../../../../model/model.json'


async function makeSeneca() {
  const seneca = Seneca({ legacy: false, timeout: 1111, debug: { undead: true } })
  seneca.context.model = Model


  seneca.context.env = 'local'

  return seneca
    .test()
    .use('promisify')
    .use('entity')
    .use('reload')
    .use('../../../../dist/concern/PodmindUtility/PodmindUtility')
    .use('../../../../dist/srv/auth/auth-srv')
    .ready()
}


if (require.main === module) {
  makeSeneca()
}

export {
  makeSeneca,
  Model,
}
