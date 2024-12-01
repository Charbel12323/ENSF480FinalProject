import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesList from './pages/MovieListPage';
import SignUpPage from './pages/SignupPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import PaymentPage from './pages/PaymentPage';
import LoginPage from './components/SignUp/LoginPage';
import axios from 'axios';


axios.defaults.withCredentials = true;

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MoviePage" element={<MoviesList />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/SeatSelection" element={<SeatSelectionPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>

  );
}

export default App;
