import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { CartProvider } from '@/components/store/CartProvider'
import StoreSubnav from '@/components/store/StoreSubnav'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <main className="public-site cms-section-surface min-h-screen">
        <Navbar />
        <StoreSubnav />
        {children}
        <Footer />
      </main>
    </CartProvider>
  )
}
