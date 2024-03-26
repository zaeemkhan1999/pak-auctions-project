import React from 'react'
import styled from "styled-components"
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";

const Container = styled.div`
display: flex;
background-color:#80808014;
`;
const Left = styled.div`
flex:1;
display: flex;
flex-direction: column;
padding: 20px;
`;
const Logo = styled.h1`
color: #FF8C00;
`;
const Desc = styled.p`
margin: 20px 0px;
font-style : italic;
`;
const Center = styled.div`
flex:1;
padding: 20px;
`;
const Title = styled.h3`
margin-bottom: 30px;
`;
const List = styled.ul`
margin:0;
padding:0;
list-style: none;
display: flex;
flex-wrap: wrap;
`;
const ListItem = styled.li`
width: 50%;
margin-bottom: 10px;
`;
const Right = styled.div`
flex:1;
padding: 20px;
`;
const List2 = styled.ul`
margin:0;
padding:0;
list-style: none;
`;


export default function Footer() {
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  return (
    <Container>
      <Left>
        <Logo>
          <span style={{ color: '#8b8b8b' }}>Pak</span>
          <span style={{ color: 'rgb(33 245 33)' }}> Auction</span>
        </Logo>
        <Desc>Simplify the process of Auction</Desc>
      </Left>
      <Center>
        <Title>Useful Links</Title>
        <List>
          <ListItem>Home</ListItem>
          <ListItem>Property</ListItem>
          <ListItem>Cars</ListItem>
          <ListItem>Electronics</ListItem>
          <ListItem>Furniture</ListItem>
          <ListItem>Clothes</ListItem>
          <ListItem>Browse Auction</ListItem>
          <ListItem>Pricing</ListItem>
        </List>
      </Center>
      <Right>
        {isLoggedIn && (<>
          <Title>My Account</Title>
        </>
        )}
        <List2>
          {isLoggedIn && (<>
            <Link to="/editprofile" style={{ color: "black" }}>
              <ListItem>Edit Profile</ListItem>
            </Link>
            <Link to="/myauctions" style={{ color: "black" }}>
              <ListItem>My Ads</ListItem>
            </Link>
          </>
          )}

        </List2>
      </Right>
    </Container>
  )
}