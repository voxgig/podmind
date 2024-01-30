import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.client({type:'sqs',pin:'aim:store,download:audio'})
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
