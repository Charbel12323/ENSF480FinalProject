import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviesList from './pages/MovieListPage';
function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/MoviePage" element={<MoviesList />} />

      </Routes>
    </Router>

  );
}

export default App;
