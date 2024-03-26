import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
const Container = styled.div`
margin: 20px;
margin-left: 50px;
`;
const Wrapper = styled.div`
flex:1;
height: 200px;
display:flex;
align-items: center;
justify-content: center;
position: relative;
`;
const Image = styled.img`
width: 280px;
height: 100%;
object-fit: contain;
`;
const Price = styled.div`
padding-top: 30px;
width: 90px;
height:90px;
position: absolute;
border-radius: 50%;
background-color: #FF8C00;
top: -18px;
left: -9px;
`;
const Text = styled.p`
align-items: center;
justify-content: center;
text-align:center;
color:white;
`;
const Title = styled.span`
text-align: center;
font-weight: 400;
font-size: 20px;
`;
const Info = styled.div`
display:flex;
flex-direction: column;
`
const Category = styled.p`
text-align: center;
opacity: 0.5;
margin:0.15rem;
`;
const Time = styled.p`
margin:0;
padding:0;
text-align: center;
color: red;
`;
const Button = styled.button`
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  font-size: 16px; /* Increase font size */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 2px 2px 2px rgba(0,0,0,0.2); /* Add a subtle shadow */
  transition: background-color 0.3s ease; /* Add a smooth transition */

  &:hover {
    background-color: #FF8C00; /* Dark green on hover */
  }
`;

export default function Product(props) {
  var sdate = props.item.sdate;
  var date = new Date(sdate);
  let text = date.toLocaleString();
  var edate = props.item.edate;
  var date2 = new Date(edate);
  let text2 = date2.toLocaleString();
  const [remainingTime, setRemainingTime] = useState('');
  const [navigation, setNavigation] = useState(false);

  function formatDateTime(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleString('en-US', options);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      const startDate = date
      const endDate = date2;

      if (startDate <= currentDate && currentDate <= endDate) {
        setNavigation(true);
        // Auction is ongoing, calculate remaining time
        const difference = endDate - currentDate;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        var remainingTimeString;
        if (days < 1) {
          remainingTimeString = `${hours}h ${minutes}m ${seconds}s`;
        }
        setRemainingTime(remainingTimeString);
      } else {
        // Auction has not started or has ended
        setRemainingTime('');
        clearInterval(timer);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [sdate, edate]);
  function handleBidSubmission() {
    const currentDate = new Date();
    if (date < currentDate && currentDate < date2) {
    } else if (currentDate > date && currentDate >= date2) {
      alert('Cannot submit bid. The auction has ended.');
    }
    else {
      alert('Cannot submit bid. The auction has not started yet.');
    }
  }
  return (
    <Container>
      <Wrapper>
        {props.item.image.length > 0 ? (
          <Image src={"http://localhost:5000/routes/images/" + props.item.image[0].filename} alt="product" />
        ) : (
          <p>
            {props.item.title}
          </p>
        )}
        <Price><Text>{props.item.price}</Text></Price>
      </Wrapper>
      <Info>
        <Title>{props.item.title}</Title>
        <Category>{props.item.categories}</Category>
        {remainingTime && (
          <Time>
            HURRY UP!!! : {remainingTime}
          </Time>
        )}
        <Category><b>Start at: </b>{formatDateTime(text)} <br></br> <b>End At: </b> {formatDateTime(text2)}</Category>


        {(props.chat === false && navigation) &&
          <Link to={`/product/${props.item._id}`} >
            <Button>Submit a bid</Button>
          </Link>
        }
        {(props.chat === false && !navigation) &&
          <Button onClick={handleBidSubmission}>Submit a bid</Button>
        }
        {props.chat === true &&
          <Link to={`/allchats/${props.item._id}`}>
            <Button>View product and messages</Button>
          </Link>
        }


      </Info>
    </Container>
  )
}
