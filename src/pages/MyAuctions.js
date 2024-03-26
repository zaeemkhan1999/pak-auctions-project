import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from "axios";
import Product from '../components/Product';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Title = styled.div`
font-size: 40px;
font-weight: 500; 
 justify-content: center;
 text-align: center;
`;

const Container = styled.div`
display:flex;
flex-wrap: wrap;
`;

export default function Home() {

  var userId = localStorage.getItem('userId')
  const [products, setProducts] = useState([]);




  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/products/myauctions/" + userId);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getProduct()
  }, []);

  // Log the user state after it has been set
  useEffect(() => {
  }, [products]);

  return (
    <div>
      <Navbar />
      <Title>
        My Auctions
      </Title>

      <Container>
     {products.map(item => (
        <Product item={item} key={item._id} chat = {true} />
      ))}
    </Container>



      <Footer />
    </div>
  )
}