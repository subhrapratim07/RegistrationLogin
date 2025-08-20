import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import About from './About';
import Contact from './Contact';
import BookTable from './BookTable';
import Footer from './Footer';
import Nav from './Nav';
import Menu from './Menu';
import Order from './Order';
import Item from './Item';
import Reports from './Reports';
import DeliveryPersonForm from './DeliveryPersonForm';
import AssignDeliveryPerson from './AssignDeliveryPerson'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/nav" element={<Nav />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order"element={<Order/>}/>
        <Route path="/item"element={<Item/>}/>
        <Route path="/reports" element={<Reports />} />
        <Route path="/AssignDeliveryPerson" element={<AssignDeliveryPerson />} />
        <Route path="/DeliveryPersonForm" element={<DeliveryPersonForm/>}/>
        <Route path="/book-table" element={<BookTable />} />
        <Route path="/BookTable" element={<Navigate to="/book-table" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
