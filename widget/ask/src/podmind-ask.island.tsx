import './reset.css'

import { createIslandWebComponent } from 'preact-island'
import { useState } from 'preact/hooks'
import { useWebComponentEvents } from './hooks/useWebComponentEvents'

const islandName = 'voxgig-podmind-ask'

console.log(islandName, 'LOAD')

export const Foo = () => {
  useWebComponentEvents(islandName)

  let [answer, setAnswer] = useState('')
  
  const submitQuery = async (event:any) => {
    event.preventDefault()
    const data = new FormData(event.target)
    const query = data.get('query')
    let res = await fetch('http://localhost:50401/api/web/public/widget',{
      method: 'POST',
      body: JSON.stringify({"aim":"req","on":"widget","chat":"query","query":query}),
      headers: {
        'content-type': 'application/json'
      }
    })
    // console.log('RES', res)
    let json:any = await res.json()
    console.log(islandName, 'json',json)
    setAnswer(json.answer)
  }

  console.log(islandName, 'RENDER')
  
  return (
    <div>
      <h3>Question:</h3>

      <form onSubmit={submitQuery}>
        <input name="query" />
        <button>submit</button>
      </form>
      
      <p>{answer}</p>
    </div>
  )
}

createIslandWebComponent(islandName, Foo).render({
  selector: islandName,
  initialProps: {},
})
