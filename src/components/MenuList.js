import React from "react";
import { Menu } from "antd";
import { HomeOutlined } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarMinus } from '@fortawesome/free-regular-svg-icons';
import { faHouse, faPeopleGroup, faGaugeHigh, faListCheck } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const MenuList = ({darkTheme}) => {
    const location = useLocation();

    const optionsMenu = {
        '/home': 'home',
        '/guest': 'guests',
        '/event': 'events',
        '/calendar': 'calendar',
    }

    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar" selectedKeys={[optionsMenu[location.pathname] || 'home']}>
            <Menu.Item key="home" icon={<FontAwesomeIcon icon={faGaugeHigh} />}>
                Dashboard
                <Link to="/dashboard"></Link>
            </Menu.Item>
            <Menu.Item key="guests" icon={<FontAwesomeIcon icon={faPeopleGroup} />}>
                Invitados
                <Link to="/guest"></Link>
            </Menu.Item>
            <Menu.Item key="events" icon={<FontAwesomeIcon icon={faListCheck} />}>
                Lista de Eventos
                <Link to="/event"></Link>
            </Menu.Item>
            <Menu.Item key="calendar" icon={<FontAwesomeIcon icon={faCalendarMinus} />}>
                Calendario
                <Link to="/calendar"></Link>
            </Menu.Item>
            {/* <Menu.SubMenu key="subtasks" icon={<HomeOutlined/>} title="Tasks">
                <Menu.Item key="events" icon={<HomeOutlined/>}>
                    Ejemplo
                </Menu.Item>
            </Menu.SubMenu> */}
        </Menu>
    );
};

export default MenuList;
