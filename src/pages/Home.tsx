import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, Laptop, Zap, Armchair, HardHat, Paintbrush, LayoutGrid, Award,
  ArrowRight, Eye, ChevronRight, Flame, Star, ShoppingCart, Search,
  Tag, Sparkles, Clock, Compass, Box, BadgePercent, CheckCircle2 
} from 'lucide-react';
import { PRODUCTS_DATA, BRANDS } from '../constants/mockData';
import { useCart } from '../contexts/CartContext';
import { Product, WebsiteContent, SystemSettings, CategoryItem } from '../types';
import { dbService } from '../services/dbService';

// Pre-selected Icons catalog for visual matching
const ICON_MAP: Record<string, any> = {
  Shield: Shield,
  Laptop: Laptop,
  Zap: Zap,
  Armchair: Armchair,
  HardHat: HardHat,
  Paintbrush: Paintbrush,
  LayoutGrid: LayoutGrid,
  Award: Award
};

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');

  // CMS, settings & catalog items
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'cat-1', name: 'Segurança Eletrónica', slug: 'seguranca-eletronica', icon: 'Shield', banner: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80', description: 'Vigilância inteligente, câmaras de CCTV profissionais, controle de acesso e alarmes contra intrusões.', displayOrder: 1 },
    { id: 'cat-2', name: 'Informática', slug: 'informatica', icon: 'Laptop', banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', description: 'Equipamentos de redes, servidores de alta performance, computadores empresariais e assessoria técnica.', displayOrder: 2 },
    { id: 'cat-3', name: 'Eletricidade', slug: 'eletricidade', icon: 'Zap', banner: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80', description: 'Projetos e montagem elétrica industrial ou residencial, quadros elétricos e cablagens estruturadas.', displayOrder: 3 }
  ]);

  // Statistics counters
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    clientsSatisfied: 0,
    supportHours: '24/7'
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        productsCount: products.length || 6,
        categoriesCount: categories.length || 3,
        clientsSatisfied: 120,
        supportHours: '24/7'
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [products, categories]);

  // Fetch Firestore CMS & Product resources
  useEffect(() => {
    let active = true;
    const fetchHomeCatalogData = async () => {
      try {
        const [c, s, dbProducts, cats] = await Promise.all([
          dbService.getWebsiteContent(),
          dbService.getSystemSettings(),
          dbService.getProducts(),
          dbService.getCategories()
        ]);
        if (active) {
          setContent(c);
          setSettings(s);
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts);
          } else {
            setProducts(PRODUCTS_DATA);
          }
          if (cats && cats.length > 0) {
            // Sort categories by displayOrder
            const sorted = [...cats].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
            setCategories(sorted);
          }
        }
      } catch (err) {
        console.error('Error fetching Home catalog resources:', err);
        // Fallback to mock products on error
        if (active) {
          setProducts(PRODUCTS_DATA);
        }
      }
    };
    fetchHomeCatalogData();
    return () => {
      active = false;
    };
  }, []);

  // Filtered Products for different Homepage Sections
  const featuredProducts = products.filter(p => p.featured);
  const newProducts = products.filter(p => p.isNew);
  const onSaleProducts = products.filter(p => p.onSale);
  const recentProducts = [...products].slice(0, 4); // Shows the top 4 products in order

  // Handle Search trigger
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Helper currency formatter
  const formatCurrency = (val?: number) => {
    if (val === undefined || val === null || val === 0) return 'Sob Consulta';
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* SECTION 1: DYNAMIC HERO BANNER WITH SEARCH BAR */}
      <section className="relative min-h-[75vh] flex flex-col justify-center bg-[#202A50] text-white overflow-hidden py-16">
        {/* Abstract design overlays */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay transition-opacity duration-1000"
          style={{ backgroundImage: `url("${content?.heroBgImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80'}")` }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF6B00] rounded-full filter blur-[150px] opacity-10 -mr-60 -mt-60 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-sky-500 rounded-full filter blur-[120px] opacity-10 -ml-40 -mb-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 text-center space-y-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FF6B00]/15 text-[#FF6B00] border border-[#FF6B00]/20 tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" /> {content?.heroSubtitle || 'O Maior Catálogo de Tecnologia & Infraestrutura do Huambo'}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              {content?.heroTitle ? (
                content.heroTitle
              ) : (
                <>O que procura hoje para <span className="text-[#FF6B00] underline decoration-[#FF6B00]/30 underline-offset-8">proteger</span> ou equipar?</>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {content?.heroDescription || 'Pesquise o produto ou navegue pelas nossas divisões oficiais de Segurança Eletrónica, Informática e Eletricidade Comercial.'}
            </p>
          </motion.div>

          {/* Interactive Search Bar */}
          <motion.form 
            onSubmit={handleSearchSubmit}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl border border-gray-150 flex items-center gap-2"
          >
            <div className="relative flex-grow">
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Pesquise por câmaras, roteadores, alarmes, quadros elétricos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none outline-none py-3.5 pl-12 pr-4 text-xs font-semibold text-gray-800 placeholder-gray-400 focus:ring-0"
              />
            </div>
            <button 
              type="submit"
              className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              Procurar
            </button>
          </motion.form>

          {/* Grid of Categories (Buitanda Inspired) */}
          <div className="pt-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Categorias Principais</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {categories.map((cat, idx) => {
                const MatchedIcon = ICON_MAP[cat.icon || 'Shield'] || Shield;
                return (
                  <motion.div
                    key={cat.id || cat.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1), duration: 0.5 }}
                    onClick={() => navigate(`/categorias/${cat.slug}`)}
                    className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-5 flex items-center gap-4 cursor-pointer text-left transition-all hover:-translate-y-1"
                  >
                    <span className="p-3 bg-[#FF6B00]/10 text-[#FF6B00] rounded-xl group-hover:bg-[#FF6B00] group-hover:text-white transition-all">
                      <MatchedIcon className="w-5 h-5" />
                    </span>
                    <div>
                      <h3 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#FF6B00] transition-colors leading-tight">
                        {cat.name}
                      </h3>
                      <span className="text-[9px] text-gray-400 font-semibold block mt-1">Ver Produtos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: CATEGORIES SHOWCASE / CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 text-left">
            <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Navegação Rápida
            </h2>
            <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Explorar por Divisões</p>
            <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
          </div>
          <Link 
            to="/categorias" 
            className="text-xs font-bold text-[#FF6B00] hover:text-[#202A50] transition-colors flex items-center gap-1"
          >
            Ver Todas as Categorias <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
          {categories.map((cat, i) => {
            const defaultBanner = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
            
            return (
              <motion.div
                key={cat.id || cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                onClick={() => navigate(`/categorias/${cat.slug}`)}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 cursor-pointer flex flex-col p-2"
              >
                <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative">
                  <img 
                    src={cat.banner || defaultBanner} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    alt={cat.name} 
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="py-3 px-1 text-center">
                  <h3 className="font-extrabold text-[11px] sm:text-xs text-[#202A50] group-hover:text-[#FF6B00] transition-colors leading-tight line-clamp-2">
                    {cat.name}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: PRODUTOS EM DESTAQUE (FEATURED) */}
      {featuredProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Escolha dos Especialistas
              </h2>
              <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Produtos em Destaque</p>
              <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
            </div>
            <Link 
              to="/produtos" 
              className="text-xs font-bold text-[#FF6B00] hover:text-[#202A50] transition-colors flex items-center gap-1"
            >
              Ver Tudo no Catálogo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-gray-50 relative overflow-hidden group">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    <span className="absolute top-4 left-4 bg-orange-500 text-white text-[9px] font-extrabold py-1 px-3.5 rounded-full shadow-sm">
                      DESTAQUE
                    </span>
                    <span className="absolute top-4 right-4 bg-white/95 text-[#202A50] text-[9px] font-bold py-1 px-2.5 rounded-full shadow-sm">
                      {p.brand || 'MIRCA'}
                    </span>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h4 className="font-bold text-sm text-[#202A50] hover:text-[#FF6B00] cursor-pointer transition-colors line-clamp-1" onClick={() => navigate(`/produtos/${p.id}`)}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                    <span className="text-xs font-black text-gray-800 block pt-1">
                      {p.priceVisible ? formatCurrency(p.price) : 'Sob Proposta'}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <button 
                    onClick={() => navigate(`/produtos/${p.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#202A50] transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Ver
                  </button>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="bg-[#202A50] hover:bg-[#FF6B00] text-white hover:text-[#202A50] text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    + Adicionar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: NOVIDADES (NEW ARRIVALS) */}
      {newProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#FF6B00]" /> Lançamentos de Elite
              </h2>
              <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Novidades Recentes</p>
              <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
            </div>
            <Link 
              to="/produtos" 
              className="text-xs font-bold text-[#FF6B00] hover:text-[#202A50] transition-colors flex items-center gap-1"
            >
              Ver Todas as Novidades <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {newProducts.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-gray-50 relative overflow-hidden group">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    <span className="absolute top-4 left-4 bg-teal-500 text-white text-[9px] font-extrabold py-1 px-3.5 rounded-full shadow-sm">
                      NOVO
                    </span>
                    <span className="absolute top-4 right-4 bg-white/95 text-[#202A50] text-[9px] font-bold py-1 px-2.5 rounded-full shadow-sm">
                      {p.brand || 'MIRCA'}
                    </span>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h4 className="font-bold text-sm text-[#202A50] hover:text-[#FF6B00] cursor-pointer transition-colors line-clamp-1" onClick={() => navigate(`/produtos/${p.id}`)}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                    <span className="text-xs font-black text-gray-800 block pt-1">
                      {p.priceVisible ? formatCurrency(p.price) : 'Sob Proposta'}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <button 
                    onClick={() => navigate(`/produtos/${p.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#202A50] transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Ver
                  </button>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="bg-[#202A50] hover:bg-[#FF6B00] text-white hover:text-[#202A50] text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    + Adicionar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: OFERTAS (ON SALE) */}
      {onSaleProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
            <div className="space-y-2 text-left">
              <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5">
                <BadgePercent className="w-5 h-5 text-rose-500" /> Ofertas Limitadas
              </h2>
              <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Oportunidades & Campanhas</p>
              <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
            </div>
            <Link 
              to="/produtos" 
              className="text-xs font-bold text-[#FF6B00] hover:text-[#202A50] transition-colors flex items-center gap-1"
            >
              Ver Todas as Ofertas <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {onSaleProducts.slice(0, 4).map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 bg-gray-50 relative overflow-hidden group">
                    <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                    <span className="absolute top-4 left-4 bg-rose-500 text-white text-[9px] font-extrabold py-1 px-3.5 rounded-full shadow-sm">
                      PROMOÇÃO
                    </span>
                    <span className="absolute top-4 right-4 bg-white/95 text-[#202A50] text-[9px] font-bold py-1 px-2.5 rounded-full shadow-sm">
                      {p.brand || 'MIRCA'}
                    </span>
                  </div>
                  <div className="p-5 space-y-2 text-left">
                    <h4 className="font-bold text-sm text-[#202A50] hover:text-[#FF6B00] cursor-pointer transition-colors line-clamp-1" onClick={() => navigate(`/produtos/${p.id}`)}>
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                      {p.description}
                    </p>
                    <span className="text-xs font-black text-rose-600 block pt-1">
                      {p.priceVisible ? formatCurrency(p.price) : 'Sob Proposta'}
                    </span>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                  <button 
                    onClick={() => navigate(`/produtos/${p.id}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#202A50] transition-colors cursor-pointer"
                  >
                    <Eye className="w-4 h-4" /> Ver
                  </button>
                  <button
                    onClick={() => addToCart(p, 1)}
                    className="bg-[#202A50] hover:bg-[#FF6B00] text-white hover:text-[#202A50] text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                  >
                    + Adicionar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 6: PRODUTOS RECENTES (RECENT ADDITIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div className="space-y-2 text-left">
            <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-500" /> Adicionados Recentemente
            </h2>
            <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Produtos Recentes</p>
            <div className="w-12 h-1 bg-[#FF6B00] rounded-full" />
          </div>
          <Link 
            to="/produtos" 
            className="text-xs font-bold text-[#FF6B00] hover:text-[#202A50] transition-colors flex items-center gap-1"
          >
            Explorar Todo o Catálogo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recentProducts.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-48 bg-gray-50 relative overflow-hidden group">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.name} />
                  <span className="absolute top-4 right-4 bg-white/95 text-[#202A50] text-[9px] font-bold py-1 px-2.5 rounded-full shadow-sm">
                    {p.brand || 'MIRCA'}
                  </span>
                </div>
                <div className="p-5 space-y-2 text-left">
                  <h4 className="font-bold text-sm text-[#202A50] hover:text-[#FF6B00] cursor-pointer transition-colors line-clamp-1" onClick={() => navigate(`/produtos/${p.id}`)}>
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                  <span className="text-xs font-black text-gray-800 block pt-1">
                    {p.priceVisible ? formatCurrency(p.price) : 'Sob Proposta'}
                  </span>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center justify-between border-t border-gray-50 mt-2">
                <button 
                  onClick={() => navigate(`/produtos/${p.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-[#202A50] transition-colors cursor-pointer"
                >
                  <Eye className="w-4 h-4" /> Ver
                </button>
                <button
                  onClick={() => addToCart(p, 1)}
                  className="bg-[#202A50] hover:bg-[#FF6B00] text-white hover:text-[#202A50] text-[10px] font-bold px-3 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  + Adicionar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 7: SUMMARY COUNTERS & ADVANTAGES */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          
          <div className="space-y-1">
            <span className="text-[#FF6B00] text-3xl sm:text-4xl font-extrabold tracking-tight block">+{stats.productsCount}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Equipamentos no Catálogo</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#202A50] text-3xl sm:text-4xl font-extrabold tracking-tight block">+{stats.categoriesCount}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Divisões de Venda</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#202A50] text-3xl sm:text-4xl font-extrabold tracking-tight block">+{stats.clientsSatisfied}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Parcerias e Clientes</span>
          </div>

          <div className="space-y-1">
            <span className="text-[#FF6B00] text-3xl sm:text-4xl font-extrabold tracking-tight block">{stats.supportHours}</span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Assistência Emergencial</span>
          </div>

        </div>
      </section>

      {/* SECTION 8: WHY MIRCA CATALOG */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase">Segurança e Conectividade</h2>
          <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Vantagens do Nosso Ecossistema</p>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {[
            { title: 'Garantia de Autenticidade', desc: 'Sistemas e aparelhos 100% originais das marcas líderes mundiais de videovigilância, redes e potência.', icon: <CheckCircle2 className="w-5 h-5 text-white" /> },
            { title: 'Suporte Técnico Dedicado', desc: 'Oferecemos total consultoria técnica e planeamento antes e após a entrega das peças no estaleiro ou empresa.', icon: <Box className="w-5 h-5 text-white" /> },
            { title: 'Sistemas de Alta Integração', desc: 'Asseguramos que todos os componentes de redes, CCTV ou energia possam dialogar entre si com redundância ativa.', icon: <Tag className="w-5 h-5 text-white" /> }
          ].map((item) => (
            <div key={item.title} className="bg-slate-50 p-8 rounded-2xl border border-gray-150/50 flex gap-4 shadow-sm hover:shadow-md transition-all">
              <div className="bg-[#202A50] p-3 rounded-xl w-11 h-11 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="space-y-2">
                <h4 className="font-extrabold text-base text-[#202A50]">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: BRANDS CAROUSEL */}
      <section className="bg-slate-50 py-16 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Equipamentos e Peças Oficiais Certificados de Marcas Líderes</p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-75">
            {BRANDS.map((brand) => (
              <div key={brand.name} className="flex flex-col items-center gap-1.5">
                <span className="font-bold text-xs text-gray-600 bg-white border border-gray-100/80 px-4 py-2 rounded-lg shadow-sm">{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
