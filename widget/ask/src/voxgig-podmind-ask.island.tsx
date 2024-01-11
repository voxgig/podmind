/*
import './reset.css'

import { createIslandWebComponent } from 'preact-island'
import { useState } from 'preact/hooks'
import { useWebComponentEvents } from './hooks/useWebComponentEvents'

const islandName = 'voxgig-podmind-ask'

console.log(islandName, 'LOAD1')

export const VoxgigPodmindAsk = () => {
  useWebComponentEvents(islandName)
  /*

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

createIslandWebComponent(islandName, VoxgigPodmindAsk).render({
  selector: islandName,
  initialProps: {},
})
*/


import './reset.css'

import './voxgig-podmind-ask.css'

import { createIslandWebComponent } from 'preact-island'
// import { Box, Button, Input, Text, Form } from './components'
import { useState } from 'preact/hooks'
// import axios from 'redaxios'
// import { API_URL } from './config/env'
// import { JSXInternal } from 'preact/src/jsx'
import { useWebComponentEvents } from './hooks/useWebComponentEvents'

const islandName = 'voxgig-podmind-ask-island'

export const Pokemon = () => {
  useWebComponentEvents(islandName)

  let [answer, setAnswer] = useState('')
  let [thinking, setThinking] = useState(false)
  
  const submitQuery = async (event:any) => {
    const formElem = event.target
  
    try {
      console.log('SUBMIT', event)
      if(thinking) return;
      
      event.preventDefault()
      const formElem = event.target
      const data = new FormData(formElem)
      const query = data.get('query')
    
      setThinking(true)
      formElem.querySelector('input').classList.add('thinking')
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
    finally {
      setThinking(false)
      formElem && formElem.querySelector('input').classList.remove('thinking')
    }
  }

  console.log(islandName, 'RENDER')

  //           onKeyUp={(event)=>'Enter'===event.key&&submitQuery({target:event?.target?.parentElement})}

  
  return (
    <div className="container">
      <h3>Ask the podcast hivemind a question!</h3>

      <form onSubmit={submitQuery}>
        <input
          name="query"
          type="text"
        />
        <button
          disabled={thinking}
        >Ask</button>
      </form>
      
      { answer && <p>{answer}</p> }
    </div>
  )
}

createIslandWebComponent(islandName, Pokemon).render({
  selector: islandName,
  initialProps: {},
})

