import { useEffect, useState,Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import React from 'react';
import success from "../components/success/success.png";
import styles from "./styles.module.css";
// import { Fragment } from "react/cjs/react.production.min";

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState(false);
	const param = useParams();
	
	const verifyEmailUrl = async (id,token) => {		
		try {
			
			const url = `http://localhost:5000/api/auth/${id}/verify/${token}`;
			console.log("Email Verify")
			const res  = await axios.get(`http://localhost:5000/api/auth/${id}/verify/${token}`)
			console.log(res)
			setValidUrl(true);
		} catch (error) {
			// console.log(error);
			setValidUrl(false);
		}
	};


	useEffect(() => {
		
    const id = param.id
	const token = param.token
	// console.log(id,token)
	verifyEmailUrl(id,token);
	}, []);

	return (
		<Fragment>
			{validUrl ? (
				<div className={styles.container}>
					<img src={success} alt="success_img" className={styles.success_img} />
					<h1>Email verified successfully</h1>
					<Link to="/login">
						<button className={styles.green_btn}>Login</button>
					</Link>
				</div>
			) : (
				<h1>404 Not Found</h1>
			)}
		</Fragment>
	);
};

export default EmailVerify;
