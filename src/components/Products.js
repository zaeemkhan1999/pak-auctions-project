import React, { useState, useEffect } from 'react'
import Product from './Product';
import axios from "axios"
import styled from 'styled-components';
// import { products } from '../data';
const Container = styled.div`
display:flex;
flex-wrap: wrap;
`;
const Title = styled.div`
font-size: 30px;
font-weight: 200; 
 justify-content: center;
 text-align: center;
`;

export default function Products(props) {

  const recomended_products = async (ids) => {

    let rd_prd = ""
    const r_products = await axios.get('http://localhost:5000/api/products/getrecomendations', { params: { ids } })
    // .then(rsp =>{
    //   rd_prd = rsp
    //   })
    return r_products
  }

  const [products, setProducts] = useState([]);
  var id = localStorage.getItem('userId');
  useEffect(() => {
    const getProducts = async () => {
      try {
        // const res = await axios.get(props.cat ? `http://localhost:5000/api/products?category=${props.cat}`
        //   : "http://localhost:5000/api/products"
        // );
        const sender = localStorage.getItem("userId")
        const product_ids = await axios.get("http://localhost:5000/api/users/user/bids/" + sender)

        const temp_len = product_ids.data.length

        let query = ""
        for (let i = 0; i < temp_len; i++) {
          query = query + product_ids.data[i].title + " " + product_ids.data[i].categories;
        }

        try {
          const response = await axios.get(`http://127.0.0.1:4000/products/` + query);
          const recomendations = response.data;
          const prd = await recomended_products(recomendations)

          // console.log(prd.data)
          setProducts(prd.data);

        }
        catch (error) {
          console.log(error);
        }

        // setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts()
  }, [props.cat]);
  useEffect(() => {
    if (props.sort === "newest") {
      setProducts(prev =>
        [...prev].sort((a, b) => a.createdAt - b.createdAt)
      );
    } else if (props.sort === "low-to-high") {
      setProducts(prev =>
        [...prev].sort((a, b) => a.price - b.price)
      );
    }
    else {
      setProducts(prev =>
        [...prev].sort((a, b) => b.price - a.price)
      );
    }
  }, [props.sort])

  return (
    <>
      {products.length > 0 && (
    <Title>
      Recommended Products
    </Title>
  )}

      <Container>
        {products
          .filter(item => item.userId !== id)
          .map(item => (
            <Product item={item} key={item._id} chat={false} />
          ))}

      </Container>
    </>
  )
}
