import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginScreen from './Screens/Login.screen';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoadingComponent from './components/Common/LoadingComponent';

function App() {
  return (
    <GoogleOAuthProvider clientId= '142594241138-8m6t09o3doa18e5n7tmbk8b2d2kvc7va.apps.googleusercontent.com'>

    <div className="App">
      <LoadingComponent>
        <Router>
          {/* <Header /> */}
          <Routes>
            {/* <FunctionalApp/> */}
            <Route path="/" element={<LoginScreen />} />
          </Routes>
          {/* <Footer /> */}
        </Router>
      </LoadingComponent>
    </div>
    </GoogleOAuthProvider>
  );
}

function FunctionalApp() {
  return (
    <>
    <Route path="/search" element={<SearchPage />} />
    <Route path="/Home" element={<Home />} />
    </>
  );
} 

export default App;