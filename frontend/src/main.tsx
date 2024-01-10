
import React from 'react'
import ReactDOM from 'react-dom/client'

import { getMain } from './setup'
import App from './App'

import '@voxgig/model-react/style.css'
import './index.css'


const main = getMain()
console.log('INFO', main.info, main)

// const AppStart = <React.StrictMode><App /></React.StrictMode>
const AppStart = <App />

const rootElem = document.getElementById('root') as HTMLElement

ReactDOM.createRoot(rootElem).render(AppStart)

