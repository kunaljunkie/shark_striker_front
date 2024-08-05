import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import LoginForm from './components/login/login';
import Home from './components/home/home';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<LoginForm />} />
        <Route exact path="/home" element={<Home />} />
        <Route exact path="/" element={<Home />} />
      </Routes>
    </Router>
   
  );
}

export default App;
