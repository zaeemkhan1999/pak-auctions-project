import React, { useState, useEffect } from 'react'
import DataTable from "react-data-table-component"
import axios from 'axios'
import { Link } from 'react-router-dom';



export default function AllUsers() {

    const [users, setUsers] = useState([]);

    const [filterData, setFilterData] = useState([]);


    const columns = [
        {
            name: "Name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: row => row.email,
            sortable: true,
        },
        {
            name: "Phone",
            selector: row => row.phone
        },
        {
            name: "CNIC",
            selector: row => row.cnic
        },
        {
            name: "Current Status",
            selector: row => row.isSuspended ? "Suspended" : "Active",
        },
        {
            name: 'Actions',
            width: '200px',
            cell: row => (
                row.isSuspended ? <Link to={"/suspendaccount/" + row._id} className="btn btn-primary">Unsuspend</Link> : <Link to={"/suspendaccount/" + row._id} className="btn btn-danger">Suspend</Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const customStyles = {
        rows: {
            style: {
                fontSize: '16px', // Change this value to increase or decrease the font size
            },
        },
    };

    useEffect(() => {
        getAllUsers()

    }, []);


    const getAllUsers = async () => {

        try {
            const allUsersData = await axios.get("http://localhost:5000/api/admin/allusers/")
            // console.log("All users are : ", allUsersData.data)
            setUsers(allUsersData.data);

            // console.log("All users : ", users);
            setFilterData(allUsersData.data);

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }


    function handleSearch(event) {
        const newData = users.filter(row => {
            return row.name.toLowerCase().includes(event.target.value.toLowerCase())

        })
        setFilterData(newData)
    }

    return (
        <>
            <div className='container mt-4'>
                <h2 style={{ color: '#7272ff', marginBottom: '40px' }}>All Users
                    <span style={{ float: 'right' }}>
                        <span style={{ color: '#afafaf' }}>Pak</span>
                        <span style={{ color: '#07bf07' }}> Auction</span>
                    </span>
                </h2>


                <Link to={"/admin"} className="btn btn-primary" style={{ padding: '10px', borderRadius: '30px' }}>
                    <img src={require("../icons/BackArrow.png")} alt="Icon" width="30" height="30" /> &nbsp;
                    Go Back
                </Link>
                <br />

                <div style={{ float: 'right' }}><input type="text" placeholder='Search by name' onChange={handleSearch}></input></div>
                <DataTable
                    columns={columns}
                    data={filterData}
                    customStyles={customStyles}
                    fixedHeader
                    pagination
                />
            </div>
        </>
    )

}
