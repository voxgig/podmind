import { getSeneca } from '../../env/lambda/lambda'

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('entity')
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
