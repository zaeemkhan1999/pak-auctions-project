import React, { useEffect, useRef, useState } from "react";
import axios from 'axios'
import Navbar from "../components/Navbar";

export default function Editprofile() {

     const [profile, setprofile] = useState();
    const [imgPath, setImgPath] = useState('');
    const [inputs, setInputs] = useState({});
    const [formErrors, setFormErrors] = useState({});
    // const [checkpoint, setCheckpoint] = useState(true);
    // const [checkpoint1, setCheckpoint1] = useState(true);
    // const [checkpoint2, setCheckpoint2] = useState(true);
    const [flag, setFlag] = useState(false)
    const myerror = useRef({});


    const handleChange = (e) => {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };


    const fetchDetails = async () => {
        var id = localStorage.getItem('userId')
        console.log(id);
        const res = await axios.get("http://localhost:5000/api/users/find/" + id).catch((err) => console.log(err));
        const data = await res.data;
        return data;
    }
    const sendRequest = async () => {

        if (Object.keys(myerror.current).length === 0) {

            var id = localStorage.getItem('userId');
            const res = await axios.put("http://localhost:5000/api/users/profile/" + id, {
                name: inputs.uname,
                cnic: inputs.ucnic,
                email: inputs.uemail,
                phone: inputs.phone
            }).catch((err) =>
                console.log(err))
            setFlag(true)
            const data = await res.data;
            return data;
        } else {
            setFlag(false)
        }

    }

    const validate = (email, name, cnic) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regName = /^[a-zA-Z]+(?: [a-zA-Z]+)?$/;
        const regCnic = /^[0-9]{5}-[0-9]{7}-[0-9]$/i;


        if (!email) {
            errors.email = "Email is required!";
            // setCheckpoint(false)
        } else if (!regex.test(email)) {
            errors.email = "This is not a valid email format!";
            // setCheckpoint(false)
        }

        if (!name) {
            errors.name = "Name is required!";
            // setCheckpoint1(false)
        } else if (!regName.test(name)) {
            errors.name = "Name is Required";
            // setCheckpoint1(false)
        }
        else {
            // setCheckpoint1(true)
        }



        // if(!cnic) {
        //     errors.cnic = "CNIC is required!";
        //     setCheckpoint2(false)
        // }
        // else if (!regCnic.test(cnic)){
        //     errors.cnic = "Enter 13 digits CNIC";
        //     setCheckpoint2(false)
        // }  
        // else {
        //     setCheckpoint2(true)
        // }
        setFormErrors(errors);
        myerror.current = errors;
        // console.log(errors)
        return errors;
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        // setFormErrors(validate(inputs.uemail,inputs.uname,inputs.ucnic));
        validate(inputs.uemail, inputs.uname, inputs.ucnic);
        // if ( (checkpoint == true) && (checkpoint1 == true) && (checkpoint2 == true) ){        
        setFlag(false)
        sendRequest().then((data) => console.log(data))

    }


    useEffect(() => {

        fetchDetails().then((data) => {
            setImgPath("http://localhost:5000/routes/images/" + data.profile);
            setprofile(data.user);
            setInputs({
                uname: data.name,
                uemail: data.email,
                ucnic: data.cnic,
                phone: data.phone
            });

        })
    }, [])




    return (
        <>
        <Navbar/>
            <div class="container rounded border border-dark bg-light mt-5 mb-5">


                <br />
                {flag &&
                    <div class="row">
                        <div class="col-3">
                        </div>

                        <div class="col-6">
                            <div class="alert alert-success " role="alert">
                                <h3 class="text-center font-weight-bold">Profile Updated successfully</h3>
                            </div>
                        </div>

                        <div class="col-3">
                        </div>

                    </div>
                }

                <br />
                <form>
                    <div class="row">

                        <div class="col-md-5 border-right">

                            <div class="d-flex flex-column align-items-center text-center p-3 py-5">
                                <img class="rounded-circle mt-4" style={{ height: "270px", width: "300px" }} alt="Profile Pic" src={imgPath} />


                                <span class="font-weight-bold">{inputs.uname}</span>
                                <span class="text-black-50">{inputs.uemail}</span>

                            </div>

                        </div>


                        <div class="col-md-5 border-right">
                            <div class="p-3 py-5">

                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <h4 class="text-right">Profile Settings</h4>
                                </div>

                                <div class="row mt-2">

                                    <div class="col-md-6"><label class="labels">Name</label><input type="text" name="uname" onChange={handleChange} class="form-control" placeholder="First name" value={inputs.uname} required /></div>

                                    <div class="col-md-6"><label for="disabledTextInput" class="labels">CNIC</label><input maxLength="13" type="text" id="disabledTextInput" class="form-control" name="ucnic" onChange={handleChange} placeholder="cnic" value={inputs.ucnic} disabled required /></div>

                                    <p style={{ color: "red", marginLeft: "14px" }}>{formErrors.name}</p>


                                </div>

                                <div class="row mt-3"> <div class="col-md-12"><label class="labels">PhoneNumber</label><input type="text" name="phone" onChange={handleChange} class="form-control" placeholder="phone number" value={inputs.phone} required /></div>
                                    <div class="col-md-12"><label class="labels">Email ID</label><input type="email" class="form-control" name="uemail" onChange={handleChange} placeholder="enter email id" value={inputs.uemail} required /></div>
                                    <p style={{ color: "red", marginLeft: "14px" }}>{formErrors.email}</p>
                                </div>

                                <div class="mt-5 text-center">
                                    <button class="btn btn-primary profile-button" type="button" onClick={handleSubmit}>Save Profile</button>
                                </div>

                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </>
    )
}