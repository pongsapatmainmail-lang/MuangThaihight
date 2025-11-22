import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* เพิ่ม routes อื่นๆ ในอนาคต */}
        {/* <Route path="/product/:id" element={<ProductDetail />} /> */}
        {/* <Route path="/cart" element={<Cart />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </Router>
  );
}

export default App;