import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import styled from 'styled-components'
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Modal, Button } from 'react-bootstrap';
import Sentiment from 'sentiment';



export default function Profile() {
    const currentDateTime = new Date();

    const location = useLocation();
    //saving id from query send from product component
    const id = location.pathname.split("/")[2];
    const [imgPath, setImgPath] = useState('');
    const [user, setUser] = useState({});
    const [comments, setComments] = useState([]);
    const [inputs, setInputs] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState('');
    const [auctionCount, setAuctionCount] = useState(0);
    const [totalComments, setTotalComments] = useState(0);
    const [positiveComments, setPositiveComments] = useState(0);
    const [negativeComments, setNegativeComments] = useState(0);
    const [averageRating, setAverageComments] = useState(0);


    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    }

    const analyzeSentiment = (text) => {
        const sentiment = new Sentiment();
        const result = sentiment.analyze(text);
        const score = result.score;
        const mappedScore = (score + 5) * (5 / 10); // Map the score from -5 to 5 to 0 to 5 range
        return mappedScore;
    };

    const findSentiments = (comments) => {
        // console.log("Total No of commments : ", comments.length);
        let positiveCount = 0
        let negativeCount = 0
        let totalSum = 0

        for (let i = 0; i < comments.length; i++) {
            if (analyzeSentiment(comments[i].comment) > 2.2) {
                positiveCount += 1
            }
            else {
                negativeCount += 1
            }
            totalSum = totalSum + analyzeSentiment(comments[i].comment);
        }

        setPositiveComments(positiveCount);
        setNegativeComments(negativeCount);
        totalSum = totalSum / comments.length;
        setAverageComments(totalSum);
    };

    const handleChange = (e) => { setInputs(e.target.value) };

    const sendRequest = async () => {

        let data = {};
        data = {
            receiver: id,
            sender: localStorage.getItem("userId"),
            comment: inputs,
            date: currentDateTime.toLocaleDateString()
        };

        console.log("Data is ", data)
        const res = await axios.post("http://localhost:5000/api/users/addcomment", data).catch((err) =>
            console.log(err))
        const responseData = await res.data;
        return;
    }


    const getAuctionCount = async () => {


        try {

            const res = await axios.get("http://localhost:5000/api/users/countauctions/" + id)


            // console.log("Total Bids placed is : ")
            // console.log(res.data);
            setAuctionCount(res.data);

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }

    const handleReportChange = (e) => { setMessage(e.target.value) };

    const handleReport = (e) => {


        if (localStorage.getItem("userId") == null) {
            window.alert("Please login first in order to report a person");
            return;
        }

        if (message == '') {
            window.alert("Please enter your message");
            return;
        }

        e.preventDefault();

        sendReport().then(() => {
            // window.alert("Comment added");
        });
        window.alert("Your message has been sent to Admin");

        setShowModal(false);
        setMessage("");

    }

    const sendReport = async () => {

        console.log("Inside sendReport");

        let data = {};
        data = {
            sender: localStorage.getItem("userId"),
            profile: id,
            message: message,
        };

        const res = await axios.post("http://localhost:5000/api/admin/addreportmessage", data).catch((err) =>
            console.log(err))
        const responseData = await res.data;

        return;
    }


    const handleSubmit = (e) => {


        if (localStorage.getItem("userId") == null) {
            window.alert("Please login first in order to comment");
            return;
        }

        if (inputs == '') {
            window.alert("Please enter a comment");
            return;
        }


        e.preventDefault();

        sendRequest().then(() => {
            // window.alert("Comment added");
        });
        window.alert("Comment added");
    }

    const fetchComments = async () => {
        const response = await axios.get("http://localhost:5000/api/users/getcomments/" + id);
        const comments = response.data;
        setTotalComments(response.data.length);
        setComments(comments);
        findSentiments(comments);
    };

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users/finduser/" + id);
                setImgPath("http://localhost:5000/routes/images/" + res.data.profile);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getProduct()
    }, [id]);

    // Log the user state after it has been set
    useEffect(() => {


    }, [user]);

    useEffect(() => {
        getAuctionCount();
        fetchComments();
    }, []);

    useEffect(() => {

        console.log("Comments are : ", comments);
    }, [comments]);


    return (
        <>
            <Navbar />
            <div className='container'>

                <div className="row mt-4">
                    <div className="col" style={{ textAlign: 'center' }}>
                        {imgPath && (
                            <img
                                className="rounded-circle mt-4"
                                style={{ height: "300px", width: "300px" }}
                                alt="Profile Pic"
                                src={imgPath}
                            />
                        )}
                        <h2>{user.name}</h2>

                        <h3 style={{ textAlign: 'left' }}>About Me</h3>
                        <p style={{ textAlign: 'left' }}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. </p>

                    </div>
                    <div className="col-4">
                        <div className="border border-primary rounded p-3"><h2 style={{ textAlign: "center", color: "black" }}>Contact Details</h2>
                            <img src={require("../icons/email.png")} alt="Icon" width="35" height="35" /> &nbsp;{user.email}
                            <br /><br />
                            <img src={require("../icons/phone.png")} alt="Icon" width="35" height="35" /> &nbsp;{user.phone}
                        </div>
                        <br />
                        <div className="border border-success rounded p-3"><h2 style={{ textAlign: "center", color: 'green' }}>Past Auctions</h2>
                            <span style={{ fontWeight: 'bold' }}>Total Auctions Conducted : &nbsp;</span>{auctionCount}<br />
                            <span style={{ fontWeight: 'bold' }}>Total Comments : &nbsp;</span> {totalComments} <br />
                        </div>
                        <br />
                        <div className="border border-warning rounded p-3"><h2 style={{ textAlign: "center", color: '#d9b034' }}>Sentiment Score</h2>
                            <span style={{ fontWeight: 'bold' }}>Positive Comments : &nbsp;</span> {positiveComments} <br />
                            <span style={{ fontWeight: 'bold' }}>Negative Comments : &nbsp;</span> {negativeComments} <br />
                            <span style={{ fontWeight: 'bold' }}>Average Ratings : &nbsp;</span> {averageRating} <br />
                            <p style={{fontSize : '13px',  color:'#bd2130'}}>**These are not actual rating given by users. These are calculated using our 
                                sentiment analysis models</p>
                        </div>
                        <br />
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-block btn-lg"
                            onClick={() => setShowModal(true)}
                        >
                            <img src={require("../icons/report.png")} alt="Icon" width="35" height="35" /> &nbsp;
                            Report this person
                        </button>

                    </div>
                </div>

                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Report this person</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" className="form-control" value={message} onChange={handleReportChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleReport}>
                            Submit Report
                        </Button>
                    </Modal.Footer>
                </Modal>

                <hr style={{ border: '3px solid #f1f1f1' }} />
                <h3>Comments About {user.name}</h3>

                <div class="input-group input-group-md">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="inputGroup-sizing-lg">Add your comment</span>
                    </div>
                    <input type="text" class="form-control" value={inputs} onChange={handleChange} aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" onClick={handleSubmit} type="button">Comment</button>
                    </div>
                </div>

                <hr style={{ border: '3px solid #f1f1f1' }} />




                {comments.map((comment, index) => (
                    <>

                        <div className="row" key={comment._id}>
                            <div className="col-3">
                                {index + 1}) &nbsp;
                                <span style={{ marginRight: '50px', fontWeight: 'bold', fontSize: '20px', fontFamily: 'cursive' }}> {comment.sender.name}</span>
                            </div>
                            <div className="col-9">
                                <span style={{ fontWeight: 'bold' }}>{formatDate(comment.createdAt)}</span><br />
                                {comment.comment}
                            </div>

                        </div>
                        <hr style={{ border: '3px solid #f1f1f1' }} />
                    </>
                ))}



            </div>
            <Footer />

        </>
    )

}
