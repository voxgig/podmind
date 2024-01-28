import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.listen({type:'sqs',pin:'aim:ingest,embed:chunk'})
  seneca.listen({type:'sqs',pin:'aim:ingest,store:embed'})
  seneca.client({type:'sqs',pin:'aim:store,handle:audio'})
  seneca.client({type:'sqs',pin:'aim:ingest,embed:chunk'})
  seneca.client({type:'sqs',pin:'aim:ingest,store:embed'})
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
