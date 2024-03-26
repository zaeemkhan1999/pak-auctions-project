import React, { useRef, useState } from 'react';
import "./Login.css";
import axios from "axios"
import { useDispatch } from "react-redux";
import { authActions } from "../store";
import { useNavigate } from "react-router-dom";

export default function Login() {



    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispath = useDispatch();
    const navigate = useNavigate();


    const [formErrors, setFormErrors] = useState({});
    const myerror = useRef({});

    const post = async () => {
        if (Object.keys(myerror.current).length === 0) {
            // try {
            //     const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            //     console.log(res);
            //     window.location.replace("http://localhost:3000")
            // } catch (err) {
            //     console.log(err);
            //     // setError1(true);
            // }
            try{
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password }).catch(err => console.log(err));
            const data = await res.data;
            console.log(data)
            return data;
            } catch (err){
                const errors = {};
                errors.password="Incorrect email or Password";
                setFormErrors(errors);
            }
        }
    }

 
    const handleClick = (e) => {
        e.preventDefault();
        validate(email, password);
        // post();
        post().then((data) => {
            if (!data.isAdmin && !data.isSuspended) {
                localStorage.setItem("userId", data._id);
                dispath(authActions.login());
                //console.log(data);
            }
            else if(data.isAdmin){ 
                window.location.href = "http://localhost:3000/admin";
            }
            if(data.isSuspended){
                alert("Your account has been suspended. Please contact the admin for more details.");
            }
        });
    };


    const validate = (email, password) => {
        const errors = {};
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        if (!email) {
            errors.email = "Email is required!";
        } else if (!regex.test(email)) {
            errors.email = "This is not a valid email format!";
        }
        if (!password) {
            errors.password = "Password is required";
        } else if (password.length < 6) {
            errors.password = "Password must be more than 5 characters";
        } else if (password.length > 10) {
            errors.password = "Password cannot exceed more than 10 characters";
        }
        setFormErrors(errors);
        myerror.current = errors;
        // console.log(formErrors);
        // console.log(myerror)
    }

    return (
        <>
            <div className='back'></div>
            <section className="background-radial-gradient overflow-hidden">
                <div className="container px-4 py-5 px-md-5 text-center text-lg-start my-5">
                    <div className="row gx-lg-5 align-items-center mb-5">
                        <div className="col-lg-6 mb-5 mb-lg-0 position-relative">
                            <div className="card ">
                                <div className="card-body px-4 py-5 px-md-5">
                                    <form>
                                        <div className="form-outline mb-4">
                                            <input type="email" id="form3Example3" className="form-control" placeholder='Email' onChange={(e) => { setEmail(e.target.value) }} />
                                        </div>
                                        <p style={{ color: "red" }}>{formErrors.email}</p>
                                        {/* Password input */}
                                        <div className="form-outline mb-4">
                                            <input type="password" id="form3Example4" className="form-control" placeholder='Password' autoComplete="on" onChange={(e) => { setPassword(e.target.value) }} />
                                        </div>
                                        <p style={{ color: "red" }}>{formErrors.password}</p>
                                        {/* {error1 && <p style={{ color: "red" }}>Wrong Credentials</p>} */}
                                        {/* <!-- Submit button --> */}
                                        <button type="submit" onClick={handleClick} className="btn btn-warning btn-block mb-4">
                                            LOG IN
                                        </button>
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