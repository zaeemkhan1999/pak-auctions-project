import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const Search = styled.div`
display: inline-block;
margin: 200px auto;
padding: 3px;
`;

const Text = styled.p`
font-size: 36px;
font-weight: 450;
text-align: center;
margin-bottom: 5px;`;
export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showAlertOptions, setShowAlertOptions] = useState(false);
    const [selectedOption, setSelectedOption] = useState('category');
    useEffect(() => {
        if (searchQuery.length > 0) {
            axios
                .get(`http://localhost:5000/api/products/search?query=${searchQuery}`)
                .then((response) => setSearchResults(response.data))
                .catch((error) => console.error(error));
        }
    }, [searchQuery]);


    const handleCreateAlert = async (option) => {
        if (option === 'product') {
            const confirmation = window.confirm(`Are you sure you want to create an alert for ${searchQuery}?`);
            if (confirmation) {
                var id = localStorage.getItem('userId')
                if (!id) {
                    setShowAlertOptions(false);
                    window.alert("You must login to continue");
                }
                else {
                    const res = await axios.get("http://localhost:5000/api/users/find/" + id).catch((err) => console.log(err));
                    const data = await res.data.email;
                    try {
                        await axios.post("http://localhost:5000/api/products/alert", {
                            email: data,
                            product: searchQuery,
                        });
                        window.alert("Alert Created Successfully!!!");
                    } catch (err) {

                        console.log(err);

                    }
                }
            }
        } else {
            // User canceled or selected an invalid option
            console.log('Invalid option or user canceled');
        }

        // Reset the selected option
        setSelectedOption('');

        // Hide the alert options after selection
        setShowAlertOptions(false);
    };
    const handleCategoryConfirmation = async () => {
        const confirmation = window.confirm(`Are you sure you want to create an alert for ${selectedOption}?`);
        if (confirmation) {
            var id = localStorage.getItem('userId')
            if (!id) {
                setShowAlertOptions(false);
                window.alert("You must login to continue");
            }
            else {
                const res = await axios.get("http://localhost:5000/api/users/find/" + id).catch((err) => console.log(err));
                const data = await res.data.email;
                try {
                    await axios.post("http://localhost:5000/api/products/alert", {
                        email: data,
                        categories: selectedOption,
                    });
                    window.alert("Alert Created Successfully!!!");
                } catch (err) {
                    console.log(err);

                }
            }
            setSelectedOption('');
        }
        // if (confirmation) {
        //   // Send request using Axios or your preferred HTTP library
        // //   axios.post('/api/create-alert', {
        // //     category: 'Automobiles',
        //   })
        //     .then(response => {
        //       console.log('Alert created successfully');
        //     })
        //     .catch(error => {
        //       console.error('Error creating alert:', error);
        //     });
        // }
    };
    return (
        <>
            <Search>
                <Text>WHAT ARE YOU LOOKING FOR?</Text>
                <div class="input-group rounded" >
                    <input type="search" class="form-control rounded" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    <span class="input-group-text border-0" id="search-addon">
                        {/* <i class="fa fa-search" aria-hidden="true"></i> */}
                        <FontAwesomeIcon icon={faSearch} />
                    </span>

                </div>
                {searchQuery && searchResults.length > 0 ? (
                    <ul style={{ margin: 0, padding: 0, }}>
                        {searchResults.map((product) => (
                            <li key={product._id} style={{ listStyle: "none", fontWeight: 500, color: "blue" }}>
                                <a style={{ color: 'black' }} href={`/product/${product._id}`}>{product.title}</a>
                            </li>
                        ))}
                    </ul>
                ) : searchQuery ? (
                    <p>
                        No results found &nbsp;
                        <span style={{ color: 'black', fontWeight: 500, fontSize: "20px" }}>
                            <Link to="#" onClick={() => setShowAlertOptions(true)}>
                                Want to set an alert?
                            </Link>
                        </span>
                    </p>
                ) : null}
                {showAlertOptions && (
                    <div>
                        <p>Choose an alert option:</p>
                        {/* <button onClick={() => handleCreateAlert('category')}>Create alert on category</button> */}
                        <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} >
                            <option value="category">Create alert on Category</option>
                            <option value="Art & Collectibles">Art & Collectibles</option>
                            <option value="Automobiles">Automobiles</option>
                            <option value="Clothing & Accessories">Clothing & Accessories</option>
                            <option value="Electronics & Computers">Electronics & Computers</option>
                            <option value="Jewelry & Watches">Jewelry & Watches</option>
                            <option value="Sports & Outdoors">Sports & Outdoors</option>
                            <option value="Travel & Tourism">Travel & Tourism</option>
                            <option value="Real Estate">Real Estate</option>
                            <option value="Business & Industrial Equipment">Business & Industrial Equipment</option>
                            <option value="Food & Beverages">Food & Beverages</option>
                        </select>
                        {selectedOption !== 'category' && (
                            <button onClick={handleCategoryConfirmation}>Create alert on {selectedOption}</button>
                        )}
                        <button onClick={() => handleCreateAlert('product')}>Create alert on product</button>

                        <button onClick={() => setShowAlertOptions(false)}>Cancel</button>
                    </div>
                )}
            </Search>


        </>
    )
}
