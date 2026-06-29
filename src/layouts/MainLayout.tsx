import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Phone, ShoppingCart, Search, Lock, 
  MapPin, Mail, Clock, MessageSquare, ChevronRight,
  ExternalLink, Sparkles
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { Product, Project, SystemSettings, WebsiteContent } from '../types';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ products: Product[]; projects: Project[] }>({ products: [], projects: [] });

  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);

  const { cartCount, items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/' || location.pathname === '/home';

  // Load layout configurations dynamically
  useEffect(() => {
    let active = true;
    const loadLayoutDetails = async () => {
      try {
        const [s, c] = await Promise.all([
          dbService.getSystemSettings(),
          dbService.getWebsiteContent()
        ]);
        if (active) {
          setSettings(s);
          setContent(c);
        }
      } catch (err) {
        console.error('Error fetching layout configurations', err);
      }
    };
    loadLayoutDetails();
    return () => {
      active = false;
    };
  }, [location.pathname]); // Reload when pathname changes to sync updates

  // Handle sticky scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search indexing and filter on trigger
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], projects: [] });
      return;
    }
    const delayDebounce = setTimeout(async () => {
      try {
        const query = searchQuery.toLowerCase();
        const allProducts = await dbService.getProducts();
        const allProjects = await dbService.getProjects();

        const filteredProducts = allProducts.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
        );

        const filteredProjects = allProjects.filter(p => 
          p.title.toLowerCase().includes(query) || 
          p.description.toLowerCase().includes(query) ||
          p.location.toLowerCase().includes(query)
        );

        setSearchResults({ products: filteredProducts.slice(0, 5), projects: filteredProjects.slice(0, 5) });
      } catch (err) {
        console.error('Search query failed', err);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  const navLinks = [
    { label: 'Início', path: '/' },
    { label: 'Categorias', path: '/categorias' },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Contacto', path: '/contacto' },
    { label: 'Minha Conta', path: '/admin' },
  ];

  const handleSearchSelect = (path: string) => {
    setSearchOpen(false);
    navigate(path);
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
        {children}
      </div>
    );
  }

  // Dynamic Contact info resolving
  const displayPhone = content?.phone || settings?.phoneNumber || '+244 948 170 046';
  const displayEmail = content?.email || settings?.businessEmail || 'mirca_prestacaodeservico@outlook.com';
  const displayAddress = content?.address || settings?.businessAddress || 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola';
  const displayHours = content?.hours || 'Segunda - Sábado: 08:00 - 18:00';
  const whatsappRaw = settings?.whatsappNumber || '244948170046';

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#000000] font-sans antialiased flex flex-col justify-between">
      
      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          >
            <motion.div 
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100"
            >
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Search className="w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Pesquise por produtos, câmeras, móveis..." 
                    className="w-full text-base bg-transparent border-none outline-none text-[#000000] focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Live search results dropdown */}
              <div className="p-4 max-h-96 overflow-y-auto divide-y divide-gray-50">
                {searchResults.products.length === 0 && searchResults.projects.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    Digite algo para pesquisar...
                  </div>
                ) : (
                  <>
                    {/* Products search items */}
                    {searchResults.products.length > 0 && (
                      <div className="py-2 space-y-2">
                        <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest block px-2">Produtos</span>
                        {searchResults.products.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handleSearchSelect(`/produtos`)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <img src={p.image} className="w-10 h-10 object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-xs font-bold text-gray-800">{p.name}</h4>
                              <p className="text-[10px] text-gray-450 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects search items */}
                    {searchResults.projects.length > 0 && (
                      <div className="py-2 space-y-2">
                        <span className="text-[10px] font-bold text-[#202A50] uppercase tracking-widest block px-2">Projetos</span>
                        {searchResults.projects.map(p => (
                          <div 
                            key={p.id}
                            onClick={() => handleSearchSelect(`/portfolio`)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
                          >
                            <img src={p.afterImage} className="w-10 h-10 object-cover rounded-lg" alt="" referrerPolicy="no-referrer" />
                            <div>
                              <h4 className="text-xs font-bold text-gray-800">{p.title}</h4>
                              <p className="text-[10px] text-gray-450 line-clamp-1">{p.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <header 
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#202A50] shadow-lg py-3 border-b border-white/5' 
            : isHome 
              ? 'bg-[#202A50]/90 backdrop-blur-sm py-5' 
              : 'bg-[#202A50] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* DYNAMIC LOGO BRANDING */}
          <Link to="/" className="flex items-center gap-2 group">
            {settings?.whiteLogoUrl || settings?.logoUrl ? (
              <img 
                src={settings.whiteLogoUrl || settings.logoUrl} 
                className="h-9 sm:h-10 object-contain rounded-xl" 
                alt="Mirca Prestações de Serviços" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="bg-[#FF6B00] text-white p-2.5 rounded-xl font-bold text-lg leading-none shadow-md shadow-orange-500/10 group-hover:scale-105 transition-transform flex items-center justify-center">
                M
              </span>
            )}
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-wide text-white leading-none uppercase">
                Mirca
              </span>
              <span className="text-[8px] sm:text-[9px] font-semibold text-gray-300 tracking-wider uppercase mt-1">
                Prestações de Serviços
              </span>
            </div>
          </Link>

          {/* DESKTOP MENU WITH CONTRAST HIGHLIGHTS */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || 
                (link.path !== '/' && location.pathname.startsWith(link.path));
              return (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`relative font-semibold text-sm transition-colors py-1 ${
                    isActive 
                      ? 'text-[#FF6B00]' 
                      : 'text-gray-100 hover:text-[#FF6B00]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6B00] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA & CART BUTTONS */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-100 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Pesquisar"
            >
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-gray-100 hover:text-[#FF6B00] hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
              title="Lista de Orçamento"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B00] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#202A50]">
                  {cartCount}
                </span>
              )}
            </button>

            <Link 
              to="/contacto" 
              className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all shadow-md shadow-orange-500/15"
            >
              Pedir Cotação
            </Link>

            {/* Admin entry point */}
            <Link 
              to="/admin/login" 
              className="p-2 text-white/50 hover:text-[#FF6B00] transition-colors" 
              title="Portal Admin"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* MOBILE TOGGLERS */}
          <div className="flex items-center gap-2 lg:hidden">
            <button 
              onClick={() => setSearchOpen(true)}
              className="p-2 text-white hover:text-[#FF6B00]"
            >
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setCartOpen(true)}
              className="p-2 text-white hover:text-[#FF6B00] relative cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#FF6B00] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-[#FF6B00]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* MOBILE MENU SLIDEOUT */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden bg-[#202A50] border-t border-white/5 overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path}
                    className="block text-gray-200 hover:text-[#FF6B00] text-base font-semibold py-1.5"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                  <Link 
                    to="/contacto"
                    className="bg-[#FF6B00] text-white text-center font-bold text-sm py-3 rounded-xl block"
                  >
                    Pedir Cotação de Orçamento
                  </Link>
                  <Link 
                    to="/admin/login"
                    className="text-white/50 hover:text-[#FF6B00] text-center text-xs py-1.5 block"
                  >
                    Portal do Administrador
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* PUBLIC MAIN CONTENT STAGE */}
      <main className="flex-grow pt-24 sm:pt-28">
        {children}
      </main>

      {/* CORPORATE FOOTER WITH CMS DYNAMIC CONTENT */}
      <footer className="bg-[#202A50] text-[#FFFFFF] border-t border-white/5 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Info & Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {settings?.whiteLogoUrl || settings?.logoUrl ? (
                <img 
                  src={settings.whiteLogoUrl || settings.logoUrl} 
                  className="h-8 object-contain rounded-xl" 
                  alt="Mirca Prestações de Serviços" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="bg-[#FF6B00] text-white p-2 rounded-lg font-bold text-md shadow-md">
                  M
                </span>
              )}
              <div className="flex flex-col">
                <span className="font-extrabold text-sm sm:text-base tracking-wide text-white leading-none uppercase">
                  Mirca
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold text-gray-300 tracking-wider uppercase mt-1">
                  Prestações de Serviços
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 leading-relaxed">
              O ecossistema líder no mercado angolano de infraestruturas técnicas integradas, segurança patrimonial ativa de alta marcenaria artesanal.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <a href={`https://wa.me/${whatsappRaw}`} target="_blank" rel="noreferrer" className="w-10 h-10 bg-white/5 hover:bg-[#FF6B00] hover:text-[#202A50] rounded-xl flex items-center justify-center text-white transition-all">
                <MessageSquare className="w-5 h-5" />
              </a>
              <Link to="/contacto" className="w-10 h-10 bg-white/5 hover:bg-[#FF6B00] hover:text-[#202A50] rounded-xl flex items-center justify-center text-white transition-all">
                <Phone className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-bold text-md text-white border-b-2 border-[#FF6B00] w-12 pb-1.5 mb-6">Empresa</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link to="/sobre" className="hover:text-[#FF6B00] flex items-center gap-2 transition-colors"><ChevronRight className="w-4 h-4 text-[#FF6B00]" /> Sobre Nós</Link></li>
              <li><Link to="/servicos" className="hover:text-[#FF6B00] flex items-center gap-2 transition-colors"><ChevronRight className="w-4 h-4 text-[#FF6B00]" /> Nossos Serviços</Link></li>
              <li><Link to="/produtos" className="hover:text-[#FF6B00] flex items-center gap-2 transition-colors"><ChevronRight className="w-4 h-4 text-[#FF6B00]" /> Catálogo de Produtos</Link></li>
              <li><Link to="/portfolio" className="hover:text-[#FF6B00] flex items-center gap-2 transition-colors"><ChevronRight className="w-4 h-4 text-[#FF6B00]" /> Portfólio / Projetos</Link></li>
              <li><Link to="/galeria" className="hover:text-[#FF6B00] flex items-center gap-2 transition-colors"><ChevronRight className="w-4 h-4 text-[#FF6B00]" /> Galeria Multimédia</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Details */}
          <div>
            <h4 className="font-bold text-md text-white border-b-2 border-[#FF6B00] w-12 pb-1.5 mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
                <span className="text-xs leading-normal">
                  {displayAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-[#FF6B00] shrink-0" />
                <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="hover:text-[#FF6B00] transition-colors">{displayPhone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-[#FF6B00] shrink-0" />
                <a href={`mailto:${displayEmail}`} className="hover:text-[#FF6B00] transition-colors break-all">{displayEmail}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#FF6B00] shrink-0" />
                <span>{displayHours}</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Interactive Mini Map */}
          <div>
            <h4 className="font-bold text-md text-white border-b-2 border-[#FF6B00] w-12 pb-1.5 mb-6">Localização</h4>
            <div className="rounded-xl overflow-hidden border border-white/5 h-36 bg-white/5 relative">
              <div className="w-full h-full bg-slate-900 text-xs p-4 flex flex-col justify-between">
                <div>
                  <div className="font-semibold text-white flex items-center gap-1">
                    Cidade Alta <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-gray-400 text-[10px] truncate max-w-[200px]">{displayAddress.split(',')[1] || displayAddress}</div>
                </div>
                <div className="border-t border-white/10 pt-2 flex items-center justify-between">
                  <span className="text-gray-300">Huambo, Angola</span>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(displayAddress)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#FF6B00] hover:underline flex items-center gap-1 text-[10px]"
                  >
                    Ver Mapa <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <Link to="/privacidade" className="text-xs text-gray-400 hover:text-white mr-4 transition-colors">Política de Privacidade</Link>
              <Link to="/termos" className="text-xs text-gray-400 hover:text-white transition-colors">Termos e Condições</Link>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
          <p>{settings?.footerCopyright || `© ${new Date().getFullYear()} MIRCA LDA. Todos os direitos reservados.`}</p>
          <div className="flex flex-col items-center sm:items-end gap-1.5 text-center sm:text-right">
            <p>Rigor, Proteção e Inovação sob Medida.</p>
            <p className="text-gray-500 text-[11px] flex items-center gap-2">
              feito por 
              <motion.a 
                href="https://portofolio007.vercel.app/" 
                target="_blank" 
                rel="noreferrer"
                className="inline-block relative text-white bg-gradient-to-r from-orange-500 to-[#FF6B00] px-3.5 py-1.5 text-xs font-extrabold rounded-lg border-b-4 border-orange-700 hover:brightness-110 shadow-lg cursor-pointer select-none"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  y: [0, -6, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ 
                  scale: 1.15,
                  y: -8,
                  rotateX: 10,
                  rotateY: -10,
                  boxShadow: '0 15px 25px rgba(255, 107, 0, 0.45)',
                }}
                whileTap={{ 
                  scale: 0.95, 
                  y: 0,
                  boxShadow: '0 4px 10px rgba(255, 107, 0, 0.25)',
                }}
              >
                António Miguel
              </motion.a>
            </p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP ACTION BUTTON */}
      <a 
        href={`https://wa.me/${whatsappRaw}`} 
        target="_blank" 
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#128C7E] text-white p-4.5 rounded-full shadow-2xl transition-all scale-100 hover:scale-110 flex items-center justify-center"
        style={{ boxShadow: '0 8px 30px rgba(37, 211, 102, 0.4)' }}
        title="Fale no WhatsApp"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
      </a>

      {/* SHOPPING CART DRAWER */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-[#202A50]/60 backdrop-blur-sm z-50 cursor-pointer animate-fade"
              style={{ zIndex: 100 }}
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
              style={{ zIndex: 101 }}
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#FF6B00]" />
                  <h3 className="font-extrabold text-[#202A50] text-lg">A minha Lista</h3>
                  <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {cartCount} {cartCount === 1 ? 'item' : 'itens'}
                  </span>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="bg-gray-200 hover:bg-[#FF6B00] hover:text-white text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
                  title="Fechar"
                >
                  ✕
                </button>
              </div>

              {/* Drawer Body - Scrollable Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="bg-gray-50 p-4 rounded-full text-gray-400">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-700 text-sm">Lista de orçamento vazia</h4>
                      <p className="text-xs text-gray-400 max-w-xs mx-auto">
                        Explore o nosso catálogo de produtos e adicione os itens que deseja orçamentar.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        navigate('/produtos');
                      }}
                      className="bg-[#202A50] hover:bg-[#FF6B00] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Ver Produtos
                    </button>
                  </div>
                ) : (
                  items.map((item) => {
                    const hasPrice = item.product.price && item.product.priceVisible;
                    return (
                      <div
                        key={item.product.id}
                        className="flex gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-white"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-[#202A50] truncate">
                              {item.product.name}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[8px] text-[#FF6B00] uppercase font-extrabold bg-orange-50 px-1.5 py-0.5 rounded">
                                {item.product.category}
                              </span>
                              {hasPrice && (
                                <span className="text-[10px] text-gray-500 font-bold">
                                  Kz {item.product.price!.toLocaleString('pt-AO')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-100">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-[#FF6B00] font-bold cursor-pointer"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-xs font-bold text-gray-700">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-[#FF6B00] font-bold cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 rounded text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                            title="Remover"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-gray-100 bg-gray-50 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-gray-500">
                      <span>Total de itens:</span>
                      <span className="text-[#202A50] font-bold">
                        {items.reduce((sum, i) => sum + i.quantity, 0)} un.
                      </span>
                    </div>

                    {items.some((i) => i.product.price && i.product.priceVisible) && (
                      <div className="flex justify-between text-sm font-extrabold text-[#202A50] bg-white p-3 rounded-xl border border-gray-100">
                        <span>Orçamento estimado:</span>
                        <span className="text-[#FF6B00] font-black text-base">
                          Kz{' '}
                          {items
                            .reduce((sum, item) => {
                              if (item.product.price && item.product.priceVisible) {
                                return sum + item.product.price * item.quantity;
                              }
                              return sum;
                            }, 0)
                            .toLocaleString('pt-AO')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        if (confirm('Deseja limpar todos os itens da sua lista?')) {
                          clearCart();
                        }
                      }}
                      className="w-full border border-gray-200 hover:bg-red-50 hover:text-red-600 font-bold text-xs py-3 rounded-xl text-gray-500 transition-all cursor-pointer"
                    >
                      Limpar Tudo
                    </button>
                    <button
                      onClick={() => {
                        setCartOpen(false);
                        navigate('/orcamento');
                      }}
                      className="w-full bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md shadow-orange-500/10 text-center cursor-pointer"
                    >
                      Finalizar Pedido
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
