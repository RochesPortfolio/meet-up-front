import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import Guest from '././pages/Guest'
import Event from '././pages/Events'
import Dashboard from '././pages/Dashboard'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import LoginScreen from './Screens/Login.screen';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingComponent from './components/Common/LoadingComponent';
import { Avatar, Button, Layout, Menu, Modal, Popover, Spin, theme } from 'antd';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import { useEffect, useState } from 'react';
import ToogleThemeButton from './components/ToggleThemeButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft,  faAnglesRight, faArrowRightFromBracket} from '@fortawesome/free-solid-svg-icons';
import { Content } from 'antd/es/layout/layout';

const {Header, Sider} = Layout;

function App() {
  return (
    <GoogleOAuthProvider clientId= '142594241138-8m6t09o3doa18e5n7tmbk8b2d2kvc7va.apps.googleusercontent.com'>
      <Router>
        <AppContent />
      </Router>
    </GoogleOAuthProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const savedPhoto = localStorage.getItem('userPhoto');
    const username = localStorage.getItem('userName');
    console.log(savedPhoto, 'foto')
    if(savedPhoto && userName !== '') {
      setUserPhoto(savedPhoto);
      setUserName(username);
    };
  })

  const showLogoutModal = () => {
    setIsModalVisible(true);
  };

  const userMenu = (
    <Menu>
      <Menu.Item onClick={showLogoutModal} icon={<FontAwesomeIcon icon={faArrowRightFromBracket} />}>
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  const handleLogoutConfirm = () => {
    // cerrar sesión de google
    setIsLoading(true);
    setIsModalVisible(false);

    setTimeout(() => {
      localStorage.removeItem('userPhoto'); 
      localStorage.removeItem('userName'); 
      setIsLoading(false);
      navigate('/'); 
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return(
    <div className="App">
      <Layout style={{height: '100vh', overflow: 'hidden'}}>
        {location.pathname !== '/' && 
          <Sider collapsed={collapsed} collapsible trigger={null} className='sidebar' theme={darkTheme ? 'dark' : 'light'}>
            <Logo darkTheme={darkTheme} />
            <ToogleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme}/>
            <MenuList darkTheme={darkTheme} />
            <Button type='text' className='toggle' onClick={() => setCollapsed(!collapsed)} 
              icon={collapsed ? <FontAwesomeIcon style={{color: darkTheme ? 'white' : 'black'}} icon={faAnglesRight} /> : 
                                <FontAwesomeIcon style={{color: darkTheme ? 'white' : 'black'}} icon={faAnglesLeft} /> }/>
          </Sider>
        }
        <Layout>
        {location.pathname !== '/' && ( // Condición para mostrar el Header
            <Header className='header' style={!darkTheme ? { 'background': '#fff' } : { 'background': '#001529' }}>
              <div style={{float: 'right', paddingRight: '30px'}}>
                <Popover content={userMenu} trigger="click">
                  <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                    <Avatar src={userPhoto} style={{marginRight: '8px'}} />
                    <span style={{color: darkTheme ? '#FFFFFF' : '#001529'}}>{userName}</span>
                  </div>
                </Popover>
              </div>
            </Header>
          )}
            <Content style={{ width: '100vw', overflowY: 'auto', marginLeft:'-55px', overflowX: 'hidden'}}>
              <LoadingComponent>
                <Routes>
                  {/* <FunctionalApp/> */}
                  <Route path="/" element={<LoginScreen />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/guest" element={<Guest />} />
                  <Route path="/event" element={<Event />} />
                  <Route path="/dashboard" element={<Dashboard/>}/>
                </Routes>
              </LoadingComponent>
            </Content>
          {/* <Header className='header' style={!darkTheme ? {'background': '#fff'} : {'background': '#001529'}}>
          </Header> */}
        </Layout>
      </Layout>

      <Modal visible={isModalVisible} onOk={handleLogoutConfirm} onCancel={handleCancel} okText="Aceptar" cancelText="Cancelar" centered>
        <p>¿Estás seguro que deseas cerrar sesión?</p>
      </Modal>

      {isLoading && (
        <div>
          <Spin size="large" tip="Cerrando Sesión..." fullscreen/>
        </div>
      )}
    </div>
  );
  //   {/* <div className="App">
  //   <Router>
  //     <Header />
  //     <Routes>
  //       <Route path="/search" element={<SearchPage />} />
  //       <Route path="/guest" element={<Guest />} />
  //       <Route path="/" element={<Home />} />
  //     </Routes>
  //     <Footer />
  //   </Router>
  // </div>*/}
} 

export default App;