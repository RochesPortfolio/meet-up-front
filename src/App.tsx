import './App.css';
import Home from './components/Home';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import Guest from '././pages/Guest'
import Event from '././pages/Events'
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import LoginScreen from './Screens/Login.screen';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingComponent from './components/Common/LoadingComponent';
import { Button, Layout, theme } from 'antd';
import Logo from './components/Logo';
import MenuList from './components/MenuList';
import { useState } from 'react';
import ToogleThemeButton from './components/ToggleThemeButton';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft,  faAnglesRight} from '@fortawesome/free-solid-svg-icons';
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

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  }

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
          <Header className='header'>
            <Content style={{height: '100vh', width: '100vw', overflowY: 'auto', marginLeft:'-55px', backgroundColor: colorBgContainer, marginTop: '70px'}}>
              <LoadingComponent>
                <Routes>
                  {/* <FunctionalApp/> */}
                  <Route path="/" element={<LoginScreen />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/guest" element={<Guest />} />
                  <Route path="/event" element={<Event />} />
                </Routes>
              </LoadingComponent>
            </Content>
          </Header>
        </Layout>
      </Layout>
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