import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Header } from '../components/layout/Header';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Cart from '../pages/Cart';
import { CategoryPage } from '../pages/Category';
import { PaymentPage } from '../pages/Checkout';
import { HomePage } from '../pages/Home';
import NotFound from '../pages/NotFound';
import Products from '../pages/Products';
import { ProductDetail } from '../pages/Products/ProductDetail';

const MainLayout = () => (
  <div className="flex flex-col w-full min-h-screen">
    <Header />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PaymentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
