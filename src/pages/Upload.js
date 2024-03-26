import React from 'react'
import Footer from '../components/Footer';
import UploadImg from '../components/UploadImg';
// import HomeBg from '../components/HomeBg';
import { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Upload() {

    const [inputs, setInputs] = useState({});
    const [files, setFiles] = useState([]);
    const [addrtype, setAddrtype] = useState(["Choose", "Art & Collectibles", "Automobiles", "Clothing & Accessories","Electronics & Computers","Jewelry & Watches","Sports & Outdoors","Travel & Tourism","Real Estate","Business & Industrial Equipment","Food & Beverages","Miscallaneous"])
    const Add = addrtype.map(Add => Add)

    const handleAddrTypeChange = (e) => {
        console.clear();
        console.log((addrtype[e.target.value]));
        setRole(addrtype[e.target.value])
    }
    const [role, setRole] = useState('Choose')
    const updateFiles = (obj) => {
        setFiles(obj);
    }
    const sendRequest = async () => {
        // console.log(files);
        const formdata = new FormData();
        formdata.append('title', inputs.title);
        formdata.append('desc', inputs.textarea);
        formdata.append('category', role);
        formdata.append('price', inputs.price);
        formdata.append('sdate', inputs.StartDate);
        formdata.append('edate', inputs.EndDate);
        formdata.append('userId', localStorage.getItem("userId"));
        for (let i = 0; i < files.length; i++) {
            formdata.append("uploadedImages", files[i],files[i].name);
          }
        // console.log(...formdata);
        const res = await axios.post("http://localhost:5000/api/users/upload", formdata).catch((err) =>
            console.log(err))
        const data = await res.data;
        return data;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        sendRequest().then((data) => console.log(data))
    }

    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };


    const Title = {
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '35px',
        color: '#FF8C00',
        backgroundColor: 'white',
        padding: '20px',
    };
    const Details = {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '20px'
    }
    const heading = {
        textAlign: 'center',
        fontWeight: 600,
        fontSize: '30px',
      
    }
    const steps = {
        textAlign: 'center',
        fontWeight: 400,
        fontSize: '18px',
        color: 'black',
     
    }
    const length = {
        width: "535px"

    }
    const link = "https://azstemcop.org/wp-content/uploads/2021/12/1.jpg"
    return (
        <div>
            <Navbar />
            <div style={{ backgroundImage: `url(${link})`, backgroundPosition: "center" }}>
                <br />
                <div className='container' style={Title}>
                    Auction Your Product In Easy Way
                    <div style={steps}>
                        <img src={require("../icons/ProductIcon.png")} alt="Icon" width="35" height="35" /> &nbsp;
                        Enter Product Details &nbsp;
                        <img src={require("../icons/RightArrow.png")} alt="Icon" width="35" height="35" /> &nbsp;

                        <img src={require("../icons/Auction.png")} alt="Icon" width="35" height="35" /> &nbsp;
                        Enter Auction Details &nbsp;
                        <img src={require("../icons/RightArrow.png")} alt="Icon" width="35" height="35" /> &nbsp;

                        <img src={require("../icons/ImgIcon.png")} alt="Icon" width="35" height="35" /> &nbsp;
                        Upload Images &nbsp;
                    </div>
                </div>

                <br />
                <div className='container border border-warning rounded shadow' style={Details}>
                    <span style={heading}>Product Information</span>
                    <div className="form-group row mt-2">
                        <label htmlFor="Title" className="col-md-3 col-form-label">Enter Product Title*</label>
                        <div className="col-lg-6">
                            <input type="text" name="title" value={inputs.title} onChange={handleChange} className="form-control" id="Title" placeholder="Product Title" />
                        </div>
                    </div>
                    <div className="form-group row mt-2">
                        <label htmlFor="Description" className="col-md-3 col-form-label">Enter Product Description*</label>
                        <div className="col-2">
                            <input type="text" name="txtarea" className="form-control" style={length} value={inputs.textarea} onChange={handleChange} placeholder="Enter product description" />
                        </div>
                    </div>
                    <div className="form-group row mt-2">
                        <label htmlFor="category" className="col-md-3 col-form-label" >Select Category:</label>

                        <div className="col-lg-6">
                            <select onChange={e => handleAddrTypeChange(e)} className="form-control browser-default custom-select" id="category">
                                { /* <option selected>Choose...</option>
                                    <option>Vehicles</option>
                                    <option>Bikes</option>
                                    <option>Paintings</option> */
                                    Add.map((address, key) => <option key={key} value={key}>{address} </option>)
                                }
                            </select>
                        </div>

                    </div>
                    <div className="form-group row mt-2">
                        <label htmlFor="ReservePrice" className="col-md-3 col-form-label">Enter Reserve Price (Optional) : </label>
                        <div className="col-lg-6">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroup-sizing-sm">PKR</span>
                                </div>
                                <input type="number" id='ReservePrice' name="price" value={inputs.price} onChange={handleChange} className="form-control" placeholder='0' aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
                            </div>
                        </div>
                    </div>


                </div>

                <br />

                <div className='container border border-warning rounded shadow' style={Details}>
                    <span style={heading}>Auction Details</span>
                    <div className="form-group row mt-2">
                        <label htmlFor="StartDate" className="col-md-3 col-form-label">Enter Start Date and Time*</label>
                        <div className="col-lg-6">
                            <input type="datetime-local" name="StartDate" value={inputs.StartDate} onChange={handleChange} id="StartDate" />
                        </div>
                    </div>
                    <div className="form-group row mt-2">
                        <label htmlFor="EndDate" className="col-md-3 col-form-label">Enter End Date and Time*</label>
                        <div className="col-lg-6">
                            <input type="datetime-local" id="EndDate" name="EndDate" value={inputs.EndDate} onChange={handleChange} />
                        </div>
                    </div>
                </div>

                <br />

                <div className='container border border-warning rounded shadow' style={Details}>
                    <span style={heading}>Upload Images </span>
                    <UploadImg files={updateFiles} />
                </div>

                <br />


                <div style={{ textAlign: 'center' }}>
                    <button type="button" onClick={handleSubmit} className="btn btn-success btn-lg">
                        Submit & Continue
                    </button>
                </div>

                <br />

            </div>

            <Footer />
        </div>
    )

}