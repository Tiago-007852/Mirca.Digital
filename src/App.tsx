import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import Projects from './pages/Projects';
import Gallery from './pages/Gallery';
import Quotation from './pages/Quotation';
import Contact from './pages/Contact';
import PrivacyAndTerms from './pages/PrivacyAndTerms';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';

// Nice custom fallback 404 page
function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
      <h1 className="text-6xl font-black text-[#202A50]">404</h1>
      <h2 className="text-xl font-bold text-gray-700">Página Não Encontrada</h2>
      <p className="text-xs text-gray-400 max-w-sm">O link acedido pode ter sido movido ou excluído dos servidores oficiais da MIRCA Digital.</p>
      <a 
        href="/" 
        className="bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm"
      >
        Voltar à Página Inicial
      </a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <MainLayout>
            <Routes>
              {/* Public entries */}
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Navigate to="/" replace />} />
              <Route path="/sobre" element={<About />} />
              <Route path="/servicos" element={<Services />} />
              
              {/* Product catalog subpath routing */}
              <Route path="/categorias" element={<Categories />} />
              <Route path="/categorias/:slug" element={<Subcategories />} />
              <Route path="/produtos" element={<Products />} />
              <Route path="/produtos/:id" element={<Products />} />

              <Route path="/portfolio" element={<Projects />} />
              <Route path="/galeria" element={<Gallery />} />
              <Route path="/orcamento" element={<Quotation />} />
              <Route path="/contacto" element={<Contact />} />
              
              <Route path="/privacidade" element={<PrivacyAndTerms />} />
              <Route path="/termos" element={<PrivacyAndTerms />} />

              {/* Admin entries */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Mismatch 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
