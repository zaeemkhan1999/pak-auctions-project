import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from "axios";
import HighestBids from '../components/HighestBids';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import SubmitBid from '../components/SubmitBid';
import Navbar from '../components/Navbar';
import Carousel from 'react-bootstrap/Carousel';
import Recommend from '../components/recomend';


const Wrapper = styled.div`
display: flex;
margin-left:55px;
`;

const Title = styled.div`
font-size: 40px;
font-weight: 350; 
 justify-content: center;
 text-align: center;
`;

const Scrollable = styled.div`
overflow-y: scroll;
  height: 300px;
`;

const Button = styled.button`
  border: none;
  padding: 10px;
  width: 100%;
  cursor: pointer;
  background-color: #6b9bff;
  color: white; /* White text */
  font-size: 16px; /* Increase font size */
  border-radius: 10px; /* Rounded corners */
  transition: background-color 0.5s ease; /* Add a smooth transition */

  &:hover {
    background-color: #1e59d1; /* Dark green on hover */
  }
`;



export default function ProductDescription() {
  
  let prd_id = ""
  const currentDateTime = new Date();
  const location = useLocation();
  const [categor, setcategory] = useState('')
  const [prdd, setprdd] = useState('')
  const id = location.pathname.split('/')[2];
  const [product, setProduct] = useState({});
  const [imgPath, setImgPath] = useState('');
  const [user, setUser] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  function formatDateTime(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    return new Date(date).toLocaleString('en-US', options);
  }


  const Text = {
    fontWeight: '100',
    fontSize: '16px'
  };

const recomended_products = async(ids)=> {
    
    let rd_prd =""
    const r_products = await axios.get('http://localhost:5000/api/products/getrecomendations',{ params: { ids }})
    // .then(rsp =>{
    //   rd_prd = rsp
    //   })
    return r_products
}  


  const profileInfoBorder = {
    width: '250px',
    fontSize: '18px',
    textAlign: 'center',
    boxShadow: '5px 5px 5px 5px #cce0ff'
  }
  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/products/find/' + id
        );
        
        const uid = res.data.userId;
        const result = await axios.get("http://localhost:5000/api/users/find/" + uid)
        const data = await result.data;
        setImgPath("http://localhost:5000/routes/images/" + data.profile);
        setUser(data.name);
        setProduct(res.data);
        setcategory(res.data.categories);
        setprdd(res.data._id);
        console.log(res.data);
        
        console.log({categor});

        // const recomendations = await axios.get(`http://127.0.0.1:4000/products/` + res.data.title + " " + res.data.categories )        
        // const rcd = recomendations.data;
        // const prd = await recomended_products(rcd)
        


      } catch (err) {
        console.log(err);
      }
    };
    getProduct();
  }, [id]);

  const handleChange = (e) => { setMessage(e.target.value) };


  const handleSubmit = (e) => {


    if (localStorage.getItem("userId") == null) {
      window.alert("Please login first in order to send message");
      return;
    }

    if (message == '') {
      window.alert("Please enter a message");
      return;
    }


    e.preventDefault();

    sendRequest().then(() => {
      // window.alert("Comment added");
    });
    window.alert("Message sent");
    setMessage('');
    fetchMessages();

  }

  const sendRequest = async () => {

    let data = {};
    data = {
      sender: localStorage.getItem("userId"),
      product: id,
      message: message,
      date: currentDateTime.toLocaleDateString()
    };

    const res = await axios.post("http://localhost:5000/api/users/addmessage", data).catch((err) =>
      console.log(err))
    const responseData = await res.data;

    return;
  }

  const fetchMessages = async () => {
    const productID = id;
    const userID = localStorage.getItem("userId");
    const url = `http://localhost:5000/api/users/getmessages/?id=${productID}&userID=${userID}`;
    const response = await axios.get(url);
    const messagesResponse = response.data;
    console.log("Respnse is : ", response.data);
    setMessages(messagesResponse);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {

  }, [messages]);

  return (
    <>
      <Navbar />
      <div className='container'>
        <Title>{product.title}</Title>
        <Wrapper>
          <div className='row'>
            <div className='col-9'>
            <Carousel style={{ height: '500px', width: '700px' }}>
                {product.image &&
                  product.image.map((img) => (
                    <Carousel.Item key={img._id}>
                      <img
                        className='d-block w-100'
                        style={{ height: '500px', width: '700px' }}
                        src={'http://localhost:5000/routes/images/' + img.filename}
                        alt='product'
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
           <br />
              <span style={{ fontSize: '25px', fontWeight: '450' }}>
                Product Description
              </span>{' '}
              <br />
              <span>{product.desc}</span>
              <br />
              <br />
              <HighestBids id={id} />

              <div style={{ padding: '20px' }}>
                <span style={{ fontSize: '30px', color: '#8eb3ff' }}>Chat With Auctioneer&nbsp;&nbsp;</span>
                <img src={require("../icons/chat.png")} alt="Icon" width="35" height="35" />

                <div style={{ backgroundColor: 'rgb(242 239 239)' }}>
                  {messages.length > 0 && (
                    <Scrollable>
                    {messages.map((message, index) => (
                        <div key={message._id} style={{ paddingLeft: '10px', paddingTop: '10px' }}>
                            {message.sender == localStorage.getItem("userId") ? (
                                <>
                                    <img src={require("../icons/avatar.png")} alt="Icon" width="30" height="30" />
                                    <span style={{ backgroundColor: '#8eb3ff', borderRadius: '10px', padding: '5px 10px' }}>{message.message}</span>
                                    <br />
                                    <span style={{ fontSize: '12px', fontStyle: 'italic' }}>{formatDateTime(message.createdAt)} </span> <br />
                                    <hr />

                                </>
                            ) : (
                                <>
                                    <span style={{ float: 'right' }}><img src={require("../icons/avatar.png")} alt="Icon" width="30" height="30" /></span>
                                    <span style={{ float: 'right', backgroundColor: 'rgb(153 255 125)', borderRadius: '10px', padding: '5px 10px' }}>{message.message}</span>

                                    <br /><br />
                                    <span style={{ float: 'right', fontSize: '12px', fontStyle: 'italic' }}>{formatDateTime(message.createdAt)} </span> <br />
                                    <hr />

                                </>
                            )}
                        </div>
                    ))}
                </Scrollable>
                  )}
                </div>

                     
                <br />
                <div className="input-group input-group-md">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-lg">Type your message</span>
                  </div>
                  <input type="text" className="form-control" value={message} onChange={handleChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                  <div className="input-group-append">
                    <button className="btn btn-outline-secondary" onClick={handleSubmit} type="button">Send &nbsp;
                      <img src={require("../icons/send.png")} alt="Icon" width="25" height="25" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
            <div className='col-3 animatedbox'>

              <SubmitBid id={id} item={product} />
              
              <br />
              <div className='border border-info rounded  p-2' style={profileInfoBorder}>
                {imgPath && (
                  <img
                    className="rounded-circle mt-4"
                    style={{ height: "100px", width: "100px" }}
                    alt="Profile Pic"
                    src={imgPath}
                  />
                )}
                {user && (
                  <>
                    <br />
                    <span>{user}</span>
                  </>
                )}
                <br />
                <span style={Text}>
                  Product Owner
                  <br />Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil repudiandae recusandae, incidunt possimus provident vel facilis!
                </span>
                <br />
                <Link to={`/viewprofile/${product.userId}`} className="btn btn-block btn-lg">
                  <Button>Give Review</Button>
                </Link>
              </div>
            </div>
          </div>
        </Wrapper>
        <br/>
        {/* <Title>
        Recommended Products
      </Title> */}
        {/* <Recommend title = {product.title} category = {categor} /> */}
      </div>
    </>
  );
}