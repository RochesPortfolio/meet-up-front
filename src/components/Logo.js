import React from "react";
import whiteLogo from '../assets/icons/whiteLogo.png'
import blueLogo from '../assets/icons/blueLogo.png'

const Logo = ({darkTheme}) => {
    return (
        <div className="logo">
            <div className="logo-icon">
                {darkTheme ? <img src={whiteLogo} /> :
                    <img src={blueLogo}/>} 
            </div>
        </div>
    );
};

export default Logo;
