import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import './App.css'
import { RecvProvider } from './lib/recv';

function App() {
  return (
    <RecvProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </RecvProvider>
  );
}

export default App;
