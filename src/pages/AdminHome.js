import React, { useState, useEffect } from 'react'
import DataTable from "react-data-table-component"
import axios from 'axios'
import { Link } from 'react-router-dom';



export default function AdminHome() {

    const [users, setUsers] = useState([]);

    const [filterData, setFilterData] = useState([]);

    function formatDateTime(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    }

    const columns = [
        {
            name: "Reporter Name",
            selector: row => row.sender.name,
            sortable: true,
        },
        {
            name: "Time of Reporting",
            selector: row => formatDateTime(row.updatedAt),
            sortable: true,
        },
        {
            name: "Profile Name",
            selector: row => row.profile.name,
            sortable: true,
        },
        {
            name: "Message",
            selector: (row) => row.message,
            sortable: true,
            cell: (row) => <div style={{ whiteSpace: "pre-wrap" }}>{row.message}</div>,
        },
        {
            name: 'Actions',
            width: '200px',
            cell: row => (
                row.profile.isSuspended ? <Link to={"/suspendaccount/" + row.profile._id} className="btn btn-primary">Unsuspend</Link> : <Link to={"/suspendaccount/" + row.profile._id} className="btn btn-danger">Suspend</Link>
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
        getAllReports()

    }, []);


    const getAllReports = async () => {

        try {
            const allUsersData = await axios.get("http://localhost:5000/api/admin/allreports/")
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
                <h2 style={{ color: '#7272ff', marginBottom: '40px' }}>
                    All Reports
                    <span style={{ float: 'right' }}>
                        <span style={{ color: '#afafaf' }}>Pak</span>
                        <span style={{ color: '#07bf07' }}> Auction</span>
                    </span>
                </h2>


                <Link to={"/admin/allusers"} className="btn btn-primary" style={{ padding: '10px', borderRadius: '30px' }}>View all Users</Link>
                <br />
                <div style={{ float: 'right' }}><input type="text" placeholder='Search by Reporter name' onChange={handleSearch}></input></div>
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
