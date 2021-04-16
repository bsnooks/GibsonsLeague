import React from 'react';
import { Carousel } from 'react-bootstrap';

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {

    return (
        <Carousel fade>
            <Carousel.Item>
                <div style={{ height: "400px", backgroundColor: "#ff0" }} />
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div style={{ height: "400px", backgroundColor: "#0ff" }} />
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <div style={{ height: "400px", backgroundColor: "#f0f" }} />
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}

export default Home;