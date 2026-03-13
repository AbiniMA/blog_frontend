import React from 'react'
import HomeBanner from '../../sections/HomeSection/HomeBanner/HomeBanner'
import Count from '../../sections/HomeSection/Count/Count'
import Blogs from '../../sections/HomeSection/blog/Blogs'
import Community from '../../sections/HomeSection/community/Community'

const Home = () => (
    <>
        <HomeBanner />
        <Count/>
        <Blogs/>
        <Community/>
    </>
)

export default Home
