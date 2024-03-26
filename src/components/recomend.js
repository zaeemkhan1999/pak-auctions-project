import React,{ useState,useEffect } from 'react'
import Product from './Product';
import axios from "axios"
import styled from 'styled-components';
// import { products } from '../data';
const Container = styled.div`
display:flex;
flex-wrap: wrap;
`;
export default function Recommend(props) {

  const recomended_products = async(ids)=> {
    
    let rd_prd =""
    const r_products = await axios.get('http://localhost:5000/api/products/getrecomendations',{ params: { ids }})
    // .then(rsp =>{
    //   rd_prd = rsp
    //   })
    return r_products
  }

  const [products, setProducts] = useState([]);
  useEffect(() => {
    const getProducts = async () => {
      try {

        try {
          console.log(props.title)
          console.log(props.category)
          const response = await axios.get(`http://127.0.0.1:4000/products/` + props.title + " " + props.category);
          const recomendations = response.data;
          console.log(recomendations)
          const prd = await recomended_products(recomendations)
          
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
    <Container>
     {products.map(item => (
        <Product item={item} key={item._id} chat = {false} />
      ))}
    </Container>
  )
}
