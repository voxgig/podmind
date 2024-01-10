import React from 'react'

import { BasicAdmin } from '@voxgig/model-react'


import { Search } from './Search'

import { getMain } from '../setup'
// import { ThemeProvider, createTheme } from '@mui/material'
// import { orange, green, blue, red, purple, cyan } from '@mui/material/colors'


console.log('PRIVATE 1')

const main = getMain()

/*
const lightTheme = createTheme({
  components: {
    MuiDrawer: {
      defaultProps: {
        variant: 'persistent'
      },
      styleOverrides: {
        root: {
          // persistent sidebar
          width: '16rem',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: '16rem',
            boxSizing: 'border-box'
          },
          anchor: 'left'
        },
        // permanent sidebar
        paper: {
          width: '16rem',
          boxSizing: 'border-box'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          '& .MuiToolbar-root': {
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiTable: {
      styleOverrides: {
        root: {
          color: 'red',
          backgroundColor: 'white',
          '& .MuiTableRow-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          },
          '& .MuiToolbar-root': {
            color: 'red',
            backgroundColor: '#ffffff'
          }
        }
      }
    },
    MuiAutocomplete: {
      defaultProps: {
        popupIcon: true
      },
      styleOverrides: {
        root: {
          marginLeft: '1em',
          width: '20rem'
        }
      }
    }
  },
  palette: {
    mode: 'light',
    background: {
      default: '#eee',
      paper: '#ffffff'
    }
  },
  typography: {
    h6: {
      color: 'black'
    }
  }
})
*/

// Provided as a function to prevent deep inspection.
const ctx = () => ({
  model: main.model,
  seneca: main.seneca,
  store: main.store,
  theme: main.theme,
  cmp: {
    Search
  },
  custom: {
    // BasicLed: {
    //   query: (view: any, cmpstate: any) => {}
    // }
  }
})

const spec = {
  frame: main.model.app.web.frame.private
}

function Private (props: any) {
  //     
  // <h1>PRIVATE</h1>
  return (
    <BasicAdmin ctx={ctx} spec={spec} />
  )
}

export default Private
