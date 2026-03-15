import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import Products from '../pages/Products';
import ProductDetail from '../pages/Products/ProductDetail';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
