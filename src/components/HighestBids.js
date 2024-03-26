import { PromiseProvider } from 'mongoose';
import React, { useEffect, useState } from 'react'
import axios from 'axios';


export default function HighestBids(props) {
    const bidAmount = {
        fontWeight: 'bold',
        float: 'right'
    };

    const [count, setCount] = useState(0);
    useEffect(() => {
        setTimeout(() => {
            gettopuser()
            setCount((count) => count + 1);

        }, 1000);
    }, [count]);


    const [bid1, setBid1] = useState("")
    const [bid2, setBid2] = useState("")
    const [bid3, setBid3] = useState("")

    const [a1, seta1] = useState("")
    const [a2, seta2] = useState("")
    const [a3, seta3] = useState("")

    let topuser;
    const gettopuser = async () => {

        try {
            const res = await axios.get("http://localhost:5000/api/users/topbidder/" + props.id)

            let size = res.data.length

            if (size == 1) {
                setBid1(res.data[0].user.name)
                seta1(res.data[0].amount)
            }
            if (size == 2) {
                setBid1(res.data[0].user.name)
                setBid2(res.data[1].user.name)
                seta1(res.data[0].amount)
                seta2(res.data[1].amount)

            }
            if (size == 3) {
                setBid1(res.data[0].user.name)
                setBid2(res.data[1].user.name)
                setBid3(res.data[2].user.name)

                seta1(res.data[0].amount)
                seta2(res.data[1].amount)
                seta3(res.data[2].amount)

            }

        } catch (err) {
            console.log(err);
            // setError1(true);
        }

    }




    return (
        <div>
            <span style={{ fontSize: '30px', color: '#FF8C00' }}>Top Three Highest Bids</span>

            <ul class=" list-group list-group-flush">

                <li class="list-group-item">1. &nbsp;
                    <img src="https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
                        class="rounded-circle" alt="Cinque Terre" width="35" height="35" /> &nbsp;
                    {bid1} <span style={bidAmount}>{a1}</span>
                </li>

                <li class="list-group-item">2. &nbsp;
                    <img src="https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
                        class="rounded-circle" alt="Cinque Terre" width="35" height="35" /> &nbsp;
                    {bid2} <span style={bidAmount}>{a2}</span></li>

                <li class="list-group-item">3. &nbsp;
                    <img src="https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg"
                        class="rounded-circle" alt="Cinque Terre" width="35" height="35" /> &nbsp;
                    {bid3} <span style={bidAmount}>{a3}</span></li>

            </ul>
        </div>
    )
}
