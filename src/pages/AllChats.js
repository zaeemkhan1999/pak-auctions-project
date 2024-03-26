import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HighestBids from '../components/HighestBids';
import DataTable from "react-data-table-component"
import { Link } from 'react-router-dom';


export default function AllChats() {
    const location = useLocation();
    const id = location.pathname.split('/')[2];
    const [messages, setMessages] = useState([]);


    const [product, setProduct] = useState({});
    const [bidCount, setBidCOunt] = useState([]);

    function formatDateTime(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(date).toLocaleString('en-US', options);
    }

    const columns = [
        {
            name: "Name",
            selector: row => row.sender.name,
            sortable: true,
        },
        {
            name: "Last Message",
            selector: row => row.message,
            sortable: true,
        },
        {
            name: "Date & Time",
            selector: row => formatDateTime(row.createdAt),
            sortable: true,
        },
        {
            name: 'Actions',
            width: '200px',
            cell: (row) => (
                <Link to={"/allchats/" + id + "/chat/" + row.sender._id} className="btn btn-primary">Open Chat</Link>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
        
    ];

    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:5000/api/products/find/' + id
                );

                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getProduct();
    }, [id]);

    useEffect(() => {
        const getBidCount = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:5000/api/products/productinfo/' + id
                );

                setBidCOunt(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getBidCount();
    }, [id]);


    const fetchAllMessages = async () => {
        const productID = id;
        console.log("Product ID : ", productID);
        const url = `http://localhost:5000/api/users/getallmessages/?id=${productID}`;
        const response = await axios.get(url);
        const messagesResponse = response.data;
        console.log("Response is : ", response.data);
        console.log("Message Response is : ", messagesResponse);
        setMessages(messagesResponse);
    };

    useEffect(() => {
        fetchAllMessages();
    }, []);

    useEffect(() => {

    }, [messages]);

    const productDescBorder = {
        width: '450px',
        fontSize: '18px',
        boxShadow: '5px 5px 5px 5px #fff0e6'
    }


    return (
        <>
            <Navbar />
            <br />
            <div className="container">

                <div className='row'>


                    <div className='col'>
                        <div className="border border-danger rounded p-2" style={productDescBorder}>
                            <p style={{ color: '#b47575', fontSize: '22px', textDecoration: 'underline', textAlign: 'center' }}>Product Details</p>

                            <p><span style={{ fontWeight: 'bold' }}>Title : </span>{product.title}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Category : </span>{product.categories}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Reserve Price : </span>Rs. {product.price}</p>
                        </div>

                        <br />

                    </div>
                    <div className="col">

                        <div className="border border-danger rounded p-2" style={productDescBorder}>
                            <p style={{ color: '#b47575', fontSize: '22px', textDecoration: 'underline', textAlign: 'center' }}>Auction Details</p>
                            <p><span style={{ fontWeight: 'bold' }}>Start Date : </span>{formatDateTime(product.sdate)}</p>
                            <p><span style={{ fontWeight: 'bold' }}>End Date: </span>{formatDateTime(product.edate)}</p>
                            <p><span style={{ fontWeight: 'bold' }}>Total bids placed : </span>{bidCount}</p>
                        </div>

                        <br />
                    </div>
                </div>

                <div className="col">
                    <HighestBids id={id} />
                    <br />
                </div>

                <h3>Messages : </h3>
                <DataTable
                    columns={columns}
                    data={messages}
                    fixedHeader
                    pagination
                />

            </div>

            <Footer />

        </>
    )

}
