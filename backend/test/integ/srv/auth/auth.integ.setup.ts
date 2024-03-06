

import Seneca from 'seneca'



async function makeSeneca() {
  const seneca = Seneca({ legacy: false, timeout: 1111, debug: { undead: true } })

  return seneca
    .test()
    .use('promisify')
    .client({ host: 'localhost', port: 50400, path: '/integ' })
    .ready()
}


if (require.main === module) {
  makeSeneca()
    .then((seneca: any) => {
      console.log(seneca)
    })
}

export {
  makeSeneca,
}
