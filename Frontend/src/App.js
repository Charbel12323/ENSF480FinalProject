import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesList from './pages/MovieListPage';
import SignUpPage from './pages/SignupPage';
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MoviePage" element={<MoviesList />} />
        <Route path="/SignUp" element={<SignUpPage />} />

      </Routes>
    </Router>

  );
}

export default App;
