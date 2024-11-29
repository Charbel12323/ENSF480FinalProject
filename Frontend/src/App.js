import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesList from './pages/MovieListPage';
import SignUpPage from './pages/SignupPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import axios from 'axios';

axios.defaults.withCredentials = true;

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MoviePage" element={<MoviesList />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path= "/SeatSelection" element={<SeatSelectionPage />} />

      </Routes>
    </Router>

  );
}

export default App;
