import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.client({type:'sqs',pin:'aim:embed,handle:chunk'})

  const makeGatewayHandler = seneca.export('s3-store/makeGatewayHandler')
  seneca
    .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
       handler: makeGatewayHandler('aim:chunk,handle:transcript') })
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('chunk', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
