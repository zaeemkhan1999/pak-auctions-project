import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import "./Navbar.css";
const Container = styled.div` 
 height:60px;
 position: ${props => props.pos};
 width:100%;
 padding-left: 120px;
 padding-right: 120px;
 z-index: 1000;
`;
const Wrapper = styled.div` 
 padding: 10px 20px;
 display: flex;
 justify-content: space-between;
 align-items: center;
`;
const Left = styled.div`
flex:1;
display: flex;
align-items: center;
`;

const Right = styled.div`
flex:1;
display: flex;
justify-content: flex-end;
`;
const Center = styled.div`
flex:1;
`;
const Logo = styled.h1`
font-size:40px;
font-weight: 550;
text-align: center;
`;
const MenuItem = styled.div`
font-size: 20px;
font-weight: 370;
cursor: pointer;
color:${props => props.col};
margin-left: 10px;
&:hover {
    text-decoration:underline;
    font-weight: bold;
    color: ${props => props.col};
  }
`;

export default function Navbar(props) {
    const isLoggedIn = useSelector((state) => state.isLoggedIn);
    const dispath = useDispatch();
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
        <div>
            <Container className={`bg-${props.bg}`} pos={`${sticky ? "fixed" : ""}`}>
                <Wrapper>
                    <Left>
                        <Link to="/" style={{ "color": props.color }}>
                            <MenuItem col={props.color}>Buy</MenuItem>
                        </Link>
                        <Link to="/upload" style={{ "color": props.color }}>
                            <MenuItem col={props.color}>Sell</MenuItem>
                        </Link>
                        <MenuItem col={props.color}>About</MenuItem>
                        <MenuItem col={props.color}>Contact</MenuItem>
                    </Left>
                    <Center>
                        <Link to="/">
                            <Logo style={{ "color": props.color }}>
                        <span style={{ color: 'rgb(237 227 227)' }}>Pak</span>
                        <span style={{ color: 'rgb(33 245 33)' }}> Auction</span>
                                
                                </Logo>
                        </Link>
                    </Center>
                    <Right>
                        {isLoggedIn && (<>
                            <Link to='/myauctions' style={{ "color": props.color }}>
                                <MenuItem>My Auctions&nbsp;</MenuItem>
                            </Link>
                        </>
                        )}
                        {!isLoggedIn && (<>
                            <Link to="/signup" style={{ "color": props.color }}>
                                <MenuItem>Sign up</MenuItem>
                            </Link>
                            <Link to='/login' style={{ "color": props.color }}>
                                <MenuItem>Log in</MenuItem>
                            </Link>
                        </>
                        )}
                        {isLoggedIn && (<>
                            {/* <button onClick={()=>dispath(authActions.logout())} LinkComponent={Link} to="/auth" variant="contained" sx={{margin: 1,borderRadius:5}} color="warning">Logout</button> */}
                            {/* <Link to="/signup" style={{"color":props.color}}>
                            <MenuItem>Log Out</MenuItem>
                        </Link> */}
                            <Link to='/editprofile' style={{ "color": props.color }}>
                                <MenuItem>Edit Profile</MenuItem>
                            </Link>
                            <MenuItem style={{ "color": props.color }} onClick={() => dispath(authActions.logout())} LinkComponent={Link} to="/auth">Log Out</MenuItem>
                        </>
                        )}
                    </Right>
                </Wrapper>
            </Container>
        </div>
    )
}
Navbar.defaultProps = {
    color: "white",
    bg: "dark"
}