import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import Navbar from './Navbar'
import SearchBar from './SearchBar';
import { categories } from '../data';
import { Link } from 'react-router-dom';

const BackGround = styled.div` 
 //background-image: url("https://www.hollywoodreporter.com/wp-content/uploads/2022/10/Online-Shopping-Cart-Laptop-AdobeStock_241431868-H-MAIN-2022.jpg?w=2000&h=1126&crop=1&resize=1440%2C810");
//background-image:url("https://preview.colorlib.com/theme/auction/images/hero_1.jpg.webp");
background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.1)), url('https://preview.colorlib.com/theme/auction/images/hero_1.jpg.webp');
 min-height: 520px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: fit;
  position: relative;
`;
const Container = styled.div` 
color:white;
position: absolute;
width: 100%;
text-align:center;
// margin: 20px;
`;

const Categories = styled.div`
margin-top:5px;
display: flex;
flex-wrap: wrap;
align-items: center;
justify-content:center;
`;


const MenuItem = styled.div`
font-size: 15px;
cursor: pointer;
margin-left: 10px;
&:hover {
    cursor: pointer;
  }
`;
const Title = styled.div`
font-size: 30px;
font-weight: 200;
 justify-content: center;
 text-align: center;
`;
export default function HomeBg() {
    const [sticky, setSticky] = useState(false);

    useEffect(() => {
      const handleScroll = () => {
        if (window.pageYOffset > 500) {
          setSticky(true);
        } else {
          setSticky(false);
        }
      };
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);
    return (
        <>
            <BackGround>
                <Container>
                    <Navbar color="white" bg={`${sticky ? "dark" : "none"}`}/>
                    <SearchBar />
                </Container>
            </BackGround>
           <Title>Explore Our Categories</Title>
            <Categories>
                {categories.map(category => (
                    <Link key={category.id} to={category.path} style={{ "color": "black" }}>
                        <MenuItem>{category.cat}</MenuItem>
                    </Link>
                ))}
            </Categories>
            <hr />
        </>

    )
}
