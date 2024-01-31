import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {

  const makeGatewayHandler = seneca.export('s3-store/makeGatewayHandler')
  seneca
    .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
       handler: makeGatewayHandler('aim:audio,transcribe:episode') })
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('audio', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
