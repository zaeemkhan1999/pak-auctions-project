import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import styled from 'styled-components';
import CurrentAuction from '../components/currentacution';
import { categories } from '../data';
import "./ProductList.css"
const Container = styled.div`
position: fixed;
top: 0;
left: 0;
bottom: 0;
overflow: auto;
overflow-y: auto;
width: 300px;
background-color: light;
margin-left: 10px;
margin-top: 100px;
//z-index: 1;
/* Hide scrollbar */
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`
const Title = styled.h1`
margin-top: 20px;
font-weight:300;
margin-left: 50px;
`;
const SubTitle = styled.div`
font-size:20px;
font-weight:400;
`;

export default function ProductList() {

    const location = useLocation();
    //saving category from query
    const cat = location.pathname.split("/")[2].trim().replaceAll("%20", " ");
    const [sort, setSort] = useState("newest");
    // const [search, setSearch] = useState("");
    const handleChange = (event) => { 
        const category = event.target.name;
        const categoryUrl = `/products/${category}`;
        window.location.href = categoryUrl;
        
      }; 
    return (
        <>
            <Navbar />
            <div className="wrapper">
                <Container>
                    <div>
                        <SubTitle>Sort Products:</SubTitle>
                        <select onChange={e => setSort(e.target.value)}>
                            <option value="newest">
                                Newest
                            </option>
                            <option value="low-to-high">Low to High</option>
                            <option value="high-to-low">High to Low</option>
                        </select>
                    </div>
                    <div>
                        <SubTitle>Categories</SubTitle>
                            {categories.map(category => (
                                <>
                                <input type="checkbox" key={category.id} name={category.cat} id={category.cat} onChange={handleChange}/>
                                <label htmlFor={category.cat} style={{marginLeft:"5px"}}>{category.cat}</label><br></br>
                                </>
                            ))}
                     
                    </div>
                   
                </Container>
                <div className="content">
                    <Title>{cat}</Title>
                    <CurrentAuction cat={cat} sort={sort} />
                </div>
            </div>
        </>
    )
}