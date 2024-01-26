import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.listen({type:'sqs',pin:'aim:ingest,handle:episode'})
  seneca.listen({type:'sqs',pin:'aim:ingest,transcribe:episode'})
  seneca.listen({type:'sqs',pin:'aim:ingest,embed:chunk'})
  seneca.listen({type:'sqs',pin:'aim:ingest,store:embed'})
  seneca.client({type:'sqs',pin:'aim:ingest,handle:episode'})
  seneca.client({type:'sqs',pin:'aim:ingest,transcribe:episode'})
  seneca.client({type:'sqs',pin:'aim:ingest,embed:chunk'})
  seneca.client({type:'sqs',pin:'aim:ingest,store:embed'})

  const makeGatewayHandler = seneca.export('s3-store/makeGatewayHandler')
  seneca
    .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
       handler: makeGatewayHandler('aim:ingest,transcribe:episode') })
  seneca
    .act('sys:gateway,kind:lambda,add:hook,hook:handler', {
       handler: makeGatewayHandler('aim:ingest,handle:transcript') })
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('ingest', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
