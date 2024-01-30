import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.listen({type:'sqs',pin:'aim:embed,handle:chunk'})
  seneca.listen({type:'sqs',pin:'aim:embed,store:embed'})
  seneca.client({type:'sqs',pin:'aim:embed,store:embed'})
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('embed', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
