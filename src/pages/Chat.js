import { useState, useEffect } from "react";
import styled from 'styled-components'
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Scrollable = styled.div`
overflow-y: scroll;
  height: 300px;
`;


export default function AllChats() {

    const currentDateTime = new Date();

    const location = useLocation();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    function formatDateTime(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    }

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
            receiver: location.pathname.split('/')[4],
            sender: localStorage.getItem("userId"),
            product: location.pathname.split('/')[2],
            message: message,
            date: currentDateTime.toLocaleDateString()
        };

        const res = await axios.post("http://localhost:5000/api/users/addmessage", data).catch((err) =>
            console.log(err))

        return;
    }


    const fetchMessages = async () => {
        const productID = location.pathname.split('/')[2];
        const userID = location.pathname.split('/')[4];
        //const userID = localStorage.getItem("userId");
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

            <div style={{ padding: '20px', width : '700px' }} className="container">
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

            <Footer />

        </>
    )

}
