import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';

// Layouts
import { MainLayout } from '@/components/layout/MainLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';

// Pages - Public
import Home from '@/pages/public/Home';
const Catalog = lazy(() => import('@/pages/public/Catalog'));
const ProductDetail = lazy(() => import('@/pages/public/ProductDetail'));
const Categories = lazy(() => import('@/pages/public/Categories'));
const Cart = lazy(() => import('@/pages/public/Cart'));
const Checkout = lazy(() => import('@/pages/public/Checkout'));
const Wishlist = lazy(() => import('@/pages/public/Wishlist'));
const Search = lazy(() => import('@/pages/public/Search'));

// Pages - Admin
const AdminLogin = lazy(() => import('@/pages/admin/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AdminCustomers = lazy(() => import('@/pages/admin/Customers'));

// Components
import { PageLoader } from '@/components/ui/PageLoader';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

// Page transition wrapper
function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

// Animated routes for public pages
function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<MainLayout />}>
          <Route 
            path="/" 
            element={
              <PageTransition>
                <Home />
              </PageTransition>
            } 
          />
          <Route 
            path="/catalog" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Catalog />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/catalog/:category" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Catalog />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/product/:slug" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <ProductDetail />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Categories />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/cart" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Cart />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Checkout />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/wishlist" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Wishlist />
                </Suspense>
              </PageTransition>
            } 
          />
          <Route 
            path="/search" 
            element={
              <PageTransition>
                <Suspense fallback={<PageLoader />}>
                  <Search />
                </Suspense>
              </PageTransition>
            } 
          />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        } />
        
        <Route element={<ProtectedRoute requireAdmin />}>
          <Route element={<AdminLayout />}>
            <Route 
              path="/admin" 
              element={
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <AdminDashboard />
                  </Suspense>
                </PageTransition>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <AdminProducts />
                  </Suspense>
                </PageTransition>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <AdminOrders />
                  </Suspense>
                </PageTransition>
              } 
            />
            <Route 
              path="/admin/customers" 
              element={
                <PageTransition>
                  <Suspense fallback={<PageLoader />}>
                    <AdminCustomers />
                  </Suspense>
                </PageTransition>
              } 
            />
          </Route>
        </Route>
        
        {/* 404 */}
        <Route 
          path="*" 
          element={
            <PageTransition>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-display font-bold text-botanical-600 mb-4">404</h1>
                  <p className="text-xl text-muted-foreground mb-8">Page non trouvée</p>
                  <a 
                    href="/" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-botanical-600 text-white rounded-full hover:bg-botanical-700 transition-colors"
                  >
                    Retour à l'accueil
                  </a>
                </div>
              </div>
            </PageTransition>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            color: 'hsl(var(--foreground))',
          },
        }}
      />
    </Router>
  );
}

export default App;
