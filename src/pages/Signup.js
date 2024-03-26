import React, { useState, useRef } from 'react'
import axios from 'axios';
import styled from "styled-components"
import "./Login.css"
const P = styled.p`
color:red;
font-size:13px;
`;
export default function Signup() {
    const initialValues = { username: "", email: "", cnic: "", phone: "", password: "", confirm: "", profilePic: '' };
    const [formValues, setFormValues] = useState(initialValues);
    const [formErrors, setFormErrors] = useState({});
    const [error, setError] = useState("");
    const [flag, setFlag] = useState(false);
    const myerror = useRef({});
    const post = async () => {
        if (Object.keys(myerror.current).length === 0) {
            // var email = formValues.email;
            // var username = formValues.username;
            // var cnic = formValues.cnic;
            // var phone = formValues.phone;
            // var password = formValues.password;
            const formdata = new FormData();
            formdata.append('myFile', formValues.profilePic, formValues.profilePic.name);
            formdata.append('username', formValues.username);
            formdata.append('email', formValues.email);
            formdata.append('cnic', formValues.cnic);
            formdata.append('phone', formValues.phone);
            formdata.append('password', formValues.password);
            try {
                const res = await axios.post("http://localhost:5000/api/auth/register", formdata);
              //  console.log(res);
                setFlag(false);
                window.location.replace("http://localhost:3000");
            } catch (err) {
                setFlag(true);
                setError(err.response.data.message);
                console.log(err);
                // setError1(true);
            }
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validate(formValues));
        post();
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const validate = (values) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        const regCnic = /^[0-9]{5}[0-9]{7}[0-9]$/i;
        const regPhone = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm;
        if (!values.username) {
            errors.username = "Name is required!";
        }
        if (!values.email) {
            errors.email = "Email is required!";
        } else if (!regex.test(values.email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!values.cnic) {
            errors.cnic = "CNIC is required!";
        } else if (!regCnic.test(values.cnic)) {
            errors.cnic = "This is not a valid cnic format!";
        }
        if (!values.phone) {
            errors.phone = "Phone is required!";
        } else if (!regPhone.test(values.phone)) {
            errors.phone = "This is not a valid phone format!";
        }
        if (!values.password) {
            errors.password = "Password is required";
        } else if (values.password.length < 6) {
            errors.password = "Password must be more than 5 characters";
        } else if (values.password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }
        if (!values.confirm) {
            errors.confirm = "Confirm Password is required!";
        } else if (values.confirm !== values.password) {
            errors.confirm = "Password does not match"
        }
        myerror.current = errors;
        return errors;
    };
    const imageUpload = (event) => {
        //  console.log(event.target.files[0]);
        setFormValues({ ...formValues, profilePic: event.target.files[0] });
    };
    return (
        <>
            <div className='back'></div>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                    {flag &&
                        <div class="row">
                            <div class="col-3">
                            </div>

                            <div class="col-6">
                                <div class="alert alert-danger " role="alert">
                                    <h3 class="text-center font-weight-bold">{error}</h3>
                                </div>
                            </div>

                            <div class="col-3">
                            </div>

                        </div>
                    }
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div className="card ">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <form>
                                        <div className="form-outline mb-4">
                                            <input type="username" name="username" id="form3Example3" className="form-control" placeholder='Name' value={formValues.username} onChange={handleChange} />
                                            <P>{formErrors.username}</P>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input type="email" name="email" id="form3Example3" className="form-control" placeholder='Email' value={formValues.email} onChange={handleChange} />
                                            <P>{formErrors.email}</P>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <input type="text" name="cnic" id="form3Example3" className="form-control" placeholder='CNIC' value={formValues.cnic} onChange={handleChange} />
                                            <P>{formErrors.cnic}</P>
                                        </div>

                                        <div className="form-outline mb-4">
                                            <input type="text" name="phone" id="form3Example3" className="form-control" placeholder='Phone No.' value={formValues.phone} onChange={handleChange} />
                                            <P>{formErrors.phone}</P>
                                        </div>

                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <input type="password" name="password" id="form3Example1" className="form-control" placeholder='Password' value={formValues.password} onChange={handleChange} />
                                                </div>
                                                <P>{formErrors.password}</P>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <input type="password" name="confirm" id="form3Example2" className="form-control" placeholder='Confirm Password' value={formValues.confirm} onChange={handleChange} />
                                                </div>
                                                <P>{formErrors.confirm}</P>
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Upload Profile Image</label>
                                            <input className="form-control form-control-sm" name="myFile" onChange={imageUpload} type="file" />
                                        </div>
                                        {/* <!-- Submit button --> */}
                                        <button type="submit" className="btn btn-warning btn-block mb-4" onClick={handleSubmit}>
                                            SIGN UP
                                        </button>
                                        <p><a href='/'>Already have an account?</a>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-6 mb-5 mb-lg-0" >
                            <h1 className="my-5 display-5 fw-bold ls-tight" style={{ color: "black" }}>
                                Get the best offer <br />
                                <span >for your Product</span>
                            </h1>
                            <p className="mb-4 " style={{ color: "black" }}>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                                Temporibus, expedita iusto veniam atque, magni tempora mollitia
                                dolorum consequatur nulla, neque debitis eos reprehenderit quasi
                                ab ipsum nisi dolorem modi. Quos?
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}