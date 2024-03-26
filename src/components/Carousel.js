import React from 'react'
import './Carousel.css'

export default function Carousel(props) {
    return (
        <>
            <div className="container mt-1">
                <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
                    <ol className="carousel-indicators">
                        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                        {/* <li data-target="#carouselExampleIndicators" data-slide-to="2"></li> */}
                    </ol>
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="d-block w-100" src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Mercedes-Benz_W111_Ilmenau.jpg/800px-Mercedes-Benz_W111_Ilmenau.jpg" alt="First slide" />
                        </div>
                        <div className="carousel-item">
                            <img className="d-block w-100" src="https://jbclassiccars.com/wp-content/uploads/2020/03/JB-Classic-Cars-Mercedes-280-SE-43.jpg" alt="Second slide" />
                            <div className="carousel-item active">
                            </div>
                        </div>
                    </div>
                    <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="sr-only">Previous</span>
                    </a>
                    <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="sr-only" >Next</span>
                    </a>
                </div>
            </div>
        </>
    )
}