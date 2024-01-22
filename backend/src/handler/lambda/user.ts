import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('user', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
