import React, { useEffect } from 'react';
import './Inter.css'
import v2 from "./v2.mp4"
import v3 from "./v3.mp4"
import v4 from "./v4.mp4"

const IntersectionDemo = () => {

    let conditionObject = {
        root:null,
        threshold:"0.8"
    };
    
    useEffect(() => {
        let elements = document.querySelectorAll('.video-container');
        let observerObject = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                let child = entry.target.children[0];
                child.play().then(() => {
                    if(entry.isIntersecting == false) {
                        child.pause();
                    }
                })
            })
        }, conditionObject);
        elements.forEach(element => {
            observerObject.observe(element);
        })
    }, [])
    
    return ( 
    <div>
        <div className="video-container">
            <Video src={v2} id="b"></Video>
        </div>
        <div className="video-container">
            <Video src={v3} id="c"></Video>
        </div>
        <div className="video-container">
            <Video src={v4} id="d"></Video>
        </div>
    </div> );
}
 

function Video(props) {
    return (
        <video className="video-styles" controls muted={true} id={props.id} loop={true}>
            <source src={props.src} type="video/mp4"></source>
        </video>
    )
}

export default IntersectionDemo;
