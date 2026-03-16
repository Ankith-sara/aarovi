import React, { lazy, Suspense } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './ErrorBoundary';

// Lazy-loaded pages for better performance
const Index = lazy(() => import('./pages/Index'));
const Collection = lazy(() => import('./pages/Collection'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Product = lazy(() => import('./pages/Product'));
const Cart = lazy(() => import('./pages/Cart'));
const Login = lazy(() => import('./pages/Login'));
const PlaceOrder = lazy(() => import('./pages/PlaceOrder'));
const Orders = lazy(() => import('./pages/Orders'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Verify = lazy(() => import('./pages/Verify'));
const TrackOrder = lazy(() => import('./pages/TrackOrder'));
const CancellationRefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const ShippingDeliveryPolicy = lazy(() => import('./pages/DeliveryPolicy'));
const TermsConditions = lazy(() => import('./pages/TermsConditions'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const FAQs = lazy(() => import('./pages/FAQs'));
const Support = lazy(() => import('./pages/Support'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Customize = lazy(() => import('./pages/Customize'));

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-10 h-10 border-[3px] border-background border-t-secondary rounded-full animate-spin" />
    <p className="text-xs text-text/40 font-light tracking-wider">Loading…</p>
  </div>
);

const App = () => {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/login';

  return (
    <div>
      <ToastContainer />
      {!hideNavAndFooter && <Navbar />}
      <SearchBar />
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/shop/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/shop/:subcategory' element={<ProductPage />} />
            <Route path='/customize' element={<Customize />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/wishlist' element={<Wishlist />} />
            <Route path='/login' element={<Login />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/status/:orderId' element={<TrackOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/profile/:id' element={<MyProfile />} />
            <Route path='/refundpolicy' element={<CancellationRefundPolicy />} />
            <Route path='/shippingpolicy' element={<ShippingDeliveryPolicy />} />
            <Route path='/termsconditions' element={<TermsConditions />} />
            <Route path='/privacypolicy' element={<PrivacyPolicy />} />
            <Route path='/faqs' element={<FAQs />} />
            <Route path='/support' element={<Support />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

export default App;
