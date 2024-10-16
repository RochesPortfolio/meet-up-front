import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchPage from './components/SearchPage';
import Guest from '././pages/Guest'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
      <div className="App">
        <Router>
          <Header />
          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/" element={<Home />} />
          </Routes>
          <Footer />
        </Router>
      </div>
  );
}

export default App;