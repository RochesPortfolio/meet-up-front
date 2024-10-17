import { Button } from "antd";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from '@fortawesome/free-regular-svg-icons';

const ToogleThemeButton = ({darkTheme, toggleTheme}) => {
    return (
        <div>
            <Button className="toggle-theme-btn" type="text" onClick={toggleTheme}>
                {darkTheme ? <FontAwesomeIcon style={{color: darkTheme ? 'white' : 'black'}} icon={faSun} /> :
                <FontAwesomeIcon style={{color: darkTheme ? 'white' : 'black'}} icon={faMoon} />}
            </Button>
        </div>
    )
}

export default ToogleThemeButton;