import React from 'react'

import Container from '@mui/material/Container'

import { getMain } from '../setup'

console.log('SEARCH 1')

const main = getMain()


function Search (props: any) {

  return (
    <Container>
      <h1>SEARCH</h1>
    </Container>
  )
}

export {
  Search
}
