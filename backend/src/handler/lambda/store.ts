import { getSeneca } from '../../env/lambda/lambda'

function complete(seneca: any) {
  seneca.listen({type:'sqs',pin:'aim:store,handle:audio'})
}

exports.handler = async (
  event:any,
  context:any
) => {
  
  let seneca = await getSeneca('store', complete)
  
  let handler = seneca.export('gateway-lambda/handler')
  let res = await handler(event, context)
  return res
}
