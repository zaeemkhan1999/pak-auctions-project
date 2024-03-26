import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios';


export default function ProfileInfo(props) {

    const [imgPath, setImgPath] = useState('');
    const [user, setUser] = useState('');

    const Text = {
        fontWeight: '100',
        fontSize: '16px'
    };

    const profileInfoBorder = {
        width: '250px',
        fontSize: '18px',
        textAlign: 'center',
        boxShadow: '5px 5px 5px 5px #cce0ff'
    }
    const fetchDetails = async () => {
        var id = props.user;
        const res = await axios.get("http://localhost:5000/api/users/find/" + id).catch((err) => console.log(err));
        const data = await res.data;
        setImgPath("http://localhost:5000/routes/images/" + data.profile);
        setUser(data.name);
        return data;
    }

    useEffect(() => {

        fetchDetails().then((data) => {
        })
    }, [])

    return (
        <>
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
                <Link to="/viewprofile/63b1c9ebcd81e91c84d6bf0e" style={{ backgroundColor: '#cce0ff' }} className="btn btn-block btn-lg">Give Review</Link>
            </div>
        </>
    )
}