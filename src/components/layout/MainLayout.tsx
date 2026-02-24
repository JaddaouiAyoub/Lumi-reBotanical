import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WishlistDrawer } from '@/components/cart/WishlistDrawer';
import { QuickViewModal } from '@/components/product/QuickViewModal';

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 top-160">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global drawers and modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
    </div>
  );
}
