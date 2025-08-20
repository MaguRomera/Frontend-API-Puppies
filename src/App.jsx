import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import { Preferencias } from './pages/preferencias';
import './App.css'
import { RecvProvider } from './lib/recv';

function App() {
  return (
    <RecvProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferencias" element={<Preferencias />} />
        </Routes>
      </Router>
    </RecvProvider>
  );
}

export default App;
