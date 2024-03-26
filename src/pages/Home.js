import React from 'react'
import HomeBg from '../components/HomeBg'
import styled from 'styled-components'
import Products from '../components/Products';
import AuctionProducts from '../components/currentacution'
import Footer from '../components/Footer';
const Title = styled.div`
font-size: 30px;
font-weight: 200; 
 justify-content: center;
 text-align: center;
`;
export default function Home() {
  return (
    <div>
      <HomeBg/>
      {/* <Title>
        Recommended Products
      </Title> */}
      <Products/>
      <Title>
        Current Auction 
      </Title>
      <AuctionProducts/>

      <Footer/>
    </div>
  )
}