import React from 'react'

import { useSelector } from 'react-redux'
import { Link } from "react-router-dom"


import { getMain } from '../setup'

import { BasicAuth } from '@voxgig/model-react'

console.log('PUBLIC 1')

const main = getMain()

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca
})


function Public (props: any) {
  const publicFrame = main.model.app.web.frame.public
  const spec = publicFrame.page.auth

  // Define in model
  let privateViewDefault = '/view/'+publicFrame.part.main.view.default
  
  let user = useSelector((state:any)=>state.main.auth.user)
  
  return (
    <div className='Public'>
      <div>
        { user && <Link to={privateViewDefault}>Account</Link> }
      </div>
      <BasicAuth ctx={ctx} spec={spec} />
    </div>
  )
}

export default Public
