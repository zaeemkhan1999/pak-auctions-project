import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';



export default function SuspendAccount() {
    const navigate = useNavigate();


    const location = useLocation();
    //saving id from query send from product component
    const userId = location.pathname.split("/")[2];

    const [user, setUser] = useState({});
    const [suspendedUser, setSuspendedUser] = useState('');

    const [selectedOption, setSelectedOption] = useState('');
    const [inputs, setInputs] = useState({});
    const [textBoxValue, setTextBoxValue] = useState('');
    const [alreadySuspended, setAlreadySuspended] = useState({});
    const [auctionCount, setAuctionCount] = useState(0);


    function formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    }

    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }


    const getAuctionCount = async () => {


        try {

            const res = await axios.get("http://localhost:5000/api/users/countauctions/" + userId)
            setAuctionCount(res.data);

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }

    useEffect(() => {
        getAuctionCount();
    }, []);

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const sendRequest = async () => {
        if (window.confirm("Please confirm that you are suspending an account")) {
            let data = {};
            if (selectedOption === 'lifetime') {
                data = {
                    user: userId,
                    reason: textBoxValue,
                    lifetime: true
                };
            }
            else {
                data = {
                    user: userId,
                    reason: textBoxValue,
                    sdate: inputs.StartDate,
                    edate: inputs.EndDate,
                    lifetime: false
                };
            }

            const res = await axios.post("http://localhost:5000/api/admin/addaccount/", data).catch((err) =>
                console.log(err))
            const responseData = await res.data;
            window.alert(responseData)
            return responseData;
        }
    }

    const handleSubmit = (e) => {

        console.log("Start Date : ", inputs.StartDate);
        if (selectedOption === 'timeperiod' && inputs.StartDate == null) {
            window.alert("Please enter a start date");
            return;
        }
        else if (selectedOption === 'timeperiod' && inputs.EndDate == null) {
            window.alert("Please enter end date");
            return;
        }
        else if (selectedOption === 'timeperiod' && inputs.StartDate >= inputs.EndDate) {
            window.alert("Please enter a valid or start date and end date should not matched");
            return;
        }
        else if (textBoxValue == "") {
            window.alert("Please enter a reason")
            return;
        }

        e.preventDefault();

        sendRequest().then((data) => {
            console.log(data);
            navigate('/admin');
        });
    }


    const sendUnsuspendRequest = async () => {

        if (window.confirm("Please confirm that you are activating account")) {
            let data = { user: userId };


            const res = await axios.delete("http://localhost:5000/api/admin/removeaccount/", { data }).catch((err) =>
                console.log(err))
            const responseData = await res.data;
            window.alert(responseData);
            return responseData;
        }

    }


    const handleUnsuspendSubmit = (e) => {

        e.preventDefault();
        sendUnsuspendRequest().then((data) => {
            console.log(data);
            navigate('/admin');
        });
    }


    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/users/finduser/" + userId);
                setUser(res.data);
                console.log("Already suspended : ", res.data.isSuspended);
                setSuspendedUser(res.data.isSuspended);

            } catch (err) {
                console.log(err);
            }
        };
        getProduct()
    }, [userId]);

    // Log the user state after it has been set
    useEffect(() => {

    }, [user]);

    useEffect(() => {
        // console.log("Suspended User : ", suspendedUser);
        const getSuspendedUserDetail = async () => {
            try {
                const newRes = await axios.get("http://localhost:5000/api/admin/findsuspendeduser/" + userId);
                setAlreadySuspended(newRes.data[0]);

            } catch (err) {
                console.log(err);
            }
        };
        if (suspendedUser) {
            getSuspendedUserDetail()
        }

    }, [suspendedUser]);

    const handleTextBoxChange = (event) => {
        setTextBoxValue(event.target.value);
    };

    return (
        <>
            <div className="container mt-4">

                <h2 style={{ color: '#ef4252', marginBottom: '40px' }}>Suspend Account
                    <span style={{ float: 'right' }}>
                        <span style={{ color: '#afafaf' }}>Pak</span>
                        <span style={{ color: '#07bf07' }}> Auction</span>
                    </span>

                </h2>

                <div className="border border-primary rounded p-3"><h2 style={{ textAlign: "center" }}>User Detail</h2>
                    <h5><span style={{ fontWeight: 'bold' }}>Name : &nbsp;</span>{user.name}</h5>
                    <h5><span style={{ fontWeight: 'bold' }}>Email : &nbsp;</span> {user.email} </h5>
                    <h5><span style={{ fontWeight: 'bold' }}>CNIC : &nbsp;</span> {user.cnic} </h5>
                    <hr />
                    <h5><span style={{ fontWeight: 'bold' }}>Total Auctions Conducted : &nbsp;</span> {auctionCount} </h5>
                    <Link to={"/viewprofile/" + userId} className="btn btn-info mt-2">View more detail</Link>

                </div>
            </div>
            <br />
            {!suspendedUser && <div className="container mt-4 suspendDetails">
                <div className="border border-primary rounded p-3"><h2 style={{ textAlign: "center" }}>Suspend Detail</h2>


                    <div className="form-check">
                        <label className="form-check-label">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="optradio"
                                value="lifetime"
                                checked={selectedOption === 'lifetime'}
                                onChange={handleOptionChange}
                            />Suspend For Lifetime
                        </label>
                    </div>
                    <div className="form-check">
                        <label className="form-check-label">
                            <input
                                type="radio"
                                className="form-check-input"
                                name="optradio"
                                value="timeperiod"
                                checked={selectedOption === 'timeperiod'}
                                onChange={handleOptionChange}
                            />Suspend for certain time period
                        </label>
                    </div>

                    {selectedOption === 'timeperiod' &&
                        <div>
                            <div className="form-group row mt-2">
                                <label htmlFor="Description" className="col-md-3 col-form-label">Enter Reason for Suspending Account</label>
                                <div className="col-5">
                                    <textarea id="Reason1" className="form-control" name="txtarea" value={textBoxValue} onChange={handleTextBoxChange} placeholder="Enter Reason for suspending..." />
                                </div>
                            </div>
                            <div className="form-group row mt-2">
                                <label htmlFor="StartDate" className="col-md-3 col-form-label">Enter Start Date*</label>
                                <div className="col-lg-6">
                                    <input type="date" id="StartDate" name="StartDate" value={inputs.StartDate} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group row mt-2">
                                <label htmlFor="EndDate" className="col-md-3 col-form-label">Enter End Date*</label>
                                <div className="col-lg-6">
                                    <input type="date" id="EndDate" value={inputs.EndDate} onChange={handleChange} name="EndDate" />
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button type="button" onClick={handleSubmit} className="btn btn-danger btn-lg">
                                    Suspend
                                </button>
                            </div>
                        </div>}

                    {selectedOption === 'lifetime' &&
                        <div>
                            <div className="form-group row mt-2">
                                <label htmlFor="Description" className="col-md-3 col-form-label">Enter Reason for Suspending Account</label>
                                <div className="col-5">
                                    <textarea className="form-control" name="txtarea" value={textBoxValue} onChange={handleTextBoxChange} placeholder="Enter Reason for suspending..." />
                                </div>
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button type="button" onClick={handleSubmit} className="btn btn-danger btn-lg">
                                    Suspend
                                </button>
                            </div>
                        </div>}


                </div>
            </div>}

            {suspendedUser && <div className="container mt-4">

                <div className=" mt-4">
                    <div className="border border-primary rounded p-3"><h2 style={{ textAlign: "center" }}>Detail of Suspend</h2>
                        <h5><span style={{ fontWeight: 'bold' }}>Reason : &nbsp;</span>{alreadySuspended.reason}</h5>
                        {alreadySuspended.lifetime &&
                            <div>
                                <h5><span style={{ fontWeight: 'bold' }}>Account is suspended for lifetime</span></h5>
                            </div>
                        }
                        {!alreadySuspended.lifetime &&
                            <div>
                                <h5><span style={{ fontWeight: 'bold' }}>Start Date : &nbsp;</span>{formatDate(alreadySuspended.sdate)}</h5>
                                <h5><span style={{ fontWeight: 'bold' }}>End Date : &nbsp;</span>{formatDate(alreadySuspended.edate)}</h5>

                            </div>
                        }

                        <div style={{ textAlign: 'center' }}>
                            <button type="button" onClick={handleUnsuspendSubmit} className="btn btn-primary btn-lg">
                                Unsuspend
                            </button>
                        </div>

                    </div>
                </div>
            </div>}

        </>
    )
}
