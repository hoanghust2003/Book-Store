import React from 'react'
import Banner from './Banner'

import Recommened from './Recommened'
import News from './News'
import TopSellers from './TopSellers'

const Home = () => {
  return (
    <>
        <Banner/>
        <TopSellers/>
        <Recommened/>
        <News/>

    </>
  )
}

export default Home
