import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="public-site cms-section-surface min-h-screen">
      <Navbar />
      {/* The fixed header is taller than its spacer; this clears it. */}
      <div className="pt-20 sm:pt-24">{children}</div>
      <Footer />
    </main>
  )
}
