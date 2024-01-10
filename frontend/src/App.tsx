
import React, {
  Suspense,
  useEffect,
  useState,
} from 'react'

import { Provider } from 'react-redux'

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'


import { SenecaProvider } from '@seneca/redux'

import { getMain } from './setup'

import './App.css'


const Public = React.lazy(() => import('./public/Public'))
const Private = React.lazy(() => import('./private/Private'))

const main = getMain()


function Loading() {
  return (<img src="/podmind.png" />)
}


function buildRouter(user?: any) {
  // build from model and user
  const routes = [
    {
      path: '*',
      element: <Suspense fallback={<Loading />}><Public /></Suspense>,
    },
    user && {
      path: '/view/:view',
      element: <Suspense fallback={<Loading />}><Private /></Suspense>,
    },
  ].filter(r=>null!=r)

  console.log('ROUTES', routes)
  
  const router = createBrowserRouter(routes)
  return router
}


function buildTheme(user?: any) {
  // build from model and user
  const theme = createTheme({

  })
  return theme
}


function App() {
  const { seneca, theme, router } = main
  const [ready, setReady] = useState('init')

  useEffect(()=>{
    if('init' !== ready) {
      return
    }
    init()
    
    async function init() {
      await seneca.ready()
      const auth = await seneca.post('aim:req,on:auth,load:auth,debounce$:true')

      if(null != auth.ok) {
        // These may have dependencies on the user.
        main.theme = buildTheme(auth.user)
        main.router = buildRouter(auth.user)

        setReady('done')
      }
    }
  },[])

  
  return (
    'done' === ready ?
    <Provider store={seneca.export('Redux/store')}>
      <SenecaProvider seneca={seneca}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </SenecaProvider>
    </Provider>
      :
    <Loading />
  )
}



export default App
