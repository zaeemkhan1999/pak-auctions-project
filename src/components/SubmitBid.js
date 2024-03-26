import React, { useEffect, useState } from 'react'
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';


export default function SubmitBid(props) {
    const [bidAmount, setBidAmount] = useState("");
    const [autobidAmount, setAutoBidAmount] = useState("");
    const [maxBid, setMaxBid] = useState(0);
    const [count, setCount] = useState(0);
    const [bidCount, setBidCount] = useState(0);
    const [showInput, setShowInput] = useState(false);
    const [stripeToken, setStripeToken] = useState(null);
    const [isRegistered, setIsRegistered] = useState(2);
    const KEY = "pk_test_51N8l2PFJI3njdmhg5HxczaK9uateK2XQq1qoES0d04DqUV1gQ5Ixb29Uhf6Z7XBcUhJWkYHDH28XzFalRMylMNXF00e0y5oOPy";

    useEffect(() => {
        getBidCount();
        setTimeout(() => {
            getMaxBid();

            setCount((count) => count + 1);

        }, 1000);
    }, [count]);

    const getMaxBid = async () => {


        try {

            const res = await axios.get("http://localhost:5000/api/users/bid/" + props.id)


            // console.log("Max Value is")
            // console.log(res.data[0].amount);
            setMaxBid(res.data[0].amount);

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }

    const getBidCount = async () => {


        try {

            const res = await axios.get("http://localhost:5000/api/users/countbid/" + props.id)


            // console.log("Total Bids placed is : ")
            // console.log(res.data);
            setBidCount(res.data);

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }

    const post = async () => {
        const currentDate = new Date();
        const loggedInUser = localStorage.getItem("userId");
        const productID = props.id;
        try {

            const res = await axios.post("http://localhost:5000/api/users/bid", {
                amount: bidAmount,
                date: currentDate,
                user: loggedInUser,
                product: productID,
                maxAutoBid: autobidAmount
            });

            console.log(res);


        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }
    const autoPost = async () => {
        const currentDate = new Date();
        const loggedInUser = localStorage.getItem("userId");
        const productID = props.id;
        var bid;

        if (maxBid) {
            bid = maxBid + 1;
        }
        else {
            bid = props.item.price + 1;
        }


        try {

            const res = await axios.post("http://localhost:5000/api/users/bid", {
                amount: bid,
                date: currentDate,
                user: loggedInUser,
                product: productID,
                maxAutoBid: autobidAmount
            });

            console.log(res);


        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }


    const handleClick = (e) => {
        e.preventDefault();

        console.log("User id is : ");
        console.log(localStorage.getItem("userId"));

        if (localStorage.getItem("userId") === null) {
            window.alert("Please log in first in order to submit bid");
            return;
        }

        if ((props.item.price) > (bidAmount)) {
            window.alert("Enter an amount greater than reserve price");
            return;
        }

        if (bidAmount === "") {
            window.alert("Please enter an amount before submitting");
            return;
        }

        if (bidAmount < maxBid) {
            window.alert("Enter amount greater than " + maxBid);
            return;
        }

        if (window.confirm("Please confirm before submitting bid")) {
            post();
            window.alert("Bid submitted");
        }

    };
    const handleAutoBid = () => {
        setShowInput(!showInput);
        let flag = false;

        if (showInput) {
            // console.log("User id is : ");
            console.log(localStorage.getItem("userId"));

            if (localStorage.getItem("userId") === null) {
                flag = true;
                window.alert("Please log in first in order to submit bid");
                return;
            }

            if (props.item.price > (autobidAmount)) {
                window.alert("Enter an amount greater than reserve price");
                flag = true;
                return;
            }
            if (autobidAmount === "") {
                window.alert("Please enter an amount before submitting");
                flag = true;
                return;
            }

            if (autobidAmount < maxBid) {
                window.alert("Enter amount greater than " + maxBid);
                flag = true;
                return;
            }
            if (!flag) {
                autoPost();
                window.alert("Auto Bid submitted");
            }
        }
    }


    // const Text = {
    //     fontWeight: '100',
    //     fontSize: '16px'
    // };

    const submitBidBorder = {
        width: '250px',
        fontSize: '18px',
        boxShadow: '5px 5px 5px 5px #fff0e6'
    }



    const getIsRegistered = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/checkout/getpayments/" + localStorage.getItem("userId") + "/" + props.id);
            console.log("Response from stripe : ", res.data);
            setIsRegistered(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {

        getIsRegistered()
    }, []);

    useEffect(() => {
        console.log("Is Registered : ", isRegistered);

    }, [isRegistered]);


    const onToken = (token) => {

        setStripeToken(token);
        console.log("Use state of stripe is set");
    }
    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await axios.post(
                    "http://localhost:5000/api/checkout/payment",
                    {
                        tokenId: stripeToken.id,
                        amount: 50000,
                        userId: localStorage.getItem("userId"),
                        productID: props.id,
                    }
                );
                console.log(res.data);

            } catch (err) {
                console.log(err);
            }
        };
        // eslint-disable-next-line no-unused-expressions
        stripeToken && makeRequest().then(() => {
            setTimeout(() => {
                window.location.reload();
            }, 20000);
        });
    }, [stripeToken])


    return (
        <>
            <div className='border border-warning rounded p-2' style={submitBidBorder}>
                <span style={{ fontWeight: 'bold' }}>Reserve Price :</span>   Rs {props.item.price}<br />
                <span style={{ fontWeight: 'bold' }}>Total Bids Placed : </span> {bidCount} <br />
                <span style={{ fontWeight: 'bold' }}>Max Bid Offered :</span>   Rs {maxBid} <br />

                {
                    isRegistered === 1 && localStorage.getItem("userId") && (
                        <div className="form-group mt-3">
                            <label for="bidInput" className="sr-only">Bid</label>
                            <input type="number" className="form-control" id="bidInput" placeholder="Rs 100" onChange={(e) => { setBidAmount(e.target.value) }} />
                        </div>

                    )
                }

                <div style={{ textAlign: 'center' }}>

                    {
                        isRegistered === 1 && localStorage.getItem("userId") && (
                            <>
                                <button type="button" style={{ backgroundColor: '#FF8C00' }} className="btn btn-block " onClick={handleClick}>Submit Bid</button>
                                or
                                <br />
                                <button type="button" style={{ backgroundColor: '#FF8C00' }} className="btn btn-block " onClick={handleAutoBid}>{showInput ? 'Submit AutoBid' : 'AutoBid'}</button>
                            </>
                        )
                    }

                    {showInput && (
                        <div className="form-group mt-3">
                            <input type="number" className="form-control" id="autobidInput" onChange={(e) => { setAutoBidAmount(e.target.value) }} />
                        </div>
                    )}

                    {
                        stripeToken ? (<span style={{ color: '#ff6262', fontWeight: 'bold' }}><br />Processing Payment... Please wait<br />Try reloading the page incase bid option is not visible</span>) : (


                            isRegistered === 0 && localStorage.getItem("userId") && (
                                <div>
                                    <hr />
                                    <p style={{ fontSize: '14px' }}>Please register first in order to place your bid !</p>
                                    <StripeCheckout
                                        name="Pak Auction"
                                        image='https://i.pinimg.com/originals/8f/c6/a2/8fc6a20dd42803d99e5f782d03916991.gif'
                                        billingAddress
                                        shippingAddress
                                        description='Registration fee is Rs 500 (PKR)'
                                        amount={50000} // Amount in paise (e.g., 50000 = PKR 500.00)
                                        currency="PKR" // Currency code for Pakistani Rupees
                                        token={onToken}
                                        stripeKey={KEY}
                                    >
                                        <button type="button" className="btn btn-secondary btn-block btn-lg">Register</button>

                                    </StripeCheckout>
                                </div>

                            )


                        )
                    }

                    {
                        localStorage.getItem("userId") === null && (
                            <div style={{ color: '#ff6262', fontWeight: 'bold' }}>
                                <hr style={{ border: '3px solid #f1f1f1' }} />

                                Please Login First in order to register or place bid !!!
                            </div>

                        )
                    }


                </div>

            </div>
        </>
    )
}
