import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, Laptop, Zap, Armchair, HardHat, Paintbrush, 
  LayoutGrid, Award, ChevronRight, Sparkles, ArrowLeft,
  Search, SlidersHorizontal, ShoppingCart, Eye, Check, Heart
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { CategoryItem, SubcategoryItem, Product } from '../types';
import { useCart } from '../contexts/CartContext';

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

export default function Subcategories() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<CategoryItem | null>(null);

  // Favorites visual toggle local state (as requested for Screen C)
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cats, subs, prods] = await Promise.all([
          dbService.getCategories(),
          dbService.getSubcategories(),
          dbService.getProducts()
        ]);
        
        const sortedCats = [...cats].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
        setCategories(sortedCats);
        setSubcategories(subs);
        setProductsList(prods);
        
        // Resolve active category
        const found = sortedCats.find(c => c.slug === slug);
        if (found) {
          setActiveCategory(found);
        } else if (sortedCats.length > 0) {
          setActiveCategory(sortedCats[0]);
        }
      } catch (e) {
        console.error('Error loading catalog data:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [slug]);

  const handleCategoryChange = (cat: CategoryItem) => {
    setActiveCategory(cat);
    navigate(`/categorias/${cat.slug}`, { replace: true });
  };

  const toggleFavorite = (prodId: string) => {
    setFavorites(prev => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Carregando catálogo...</p>
      </div>
    );
  }

  if (!activeCategory) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-lg font-bold text-gray-800">Categoria não encontrada</h2>
        <Link to="/categorias" className="text-sm font-bold text-[#FF6B00] hover:underline flex items-center justify-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar para Categorias
        </Link>
      </div>
    );
  }

  // Filter subcategories under this active category
  const relevantSubcategories = subcategories.filter(sub => sub.categoryId === activeCategory.id);
  const categoryProducts = productsList.filter(p => p.category === activeCategory.slug);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Horizontal categories scroll bar (Pills) */}
      <div className="sticky top-16 z-20 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto scrollbar-none flex items-center gap-2.5">
          {categories.map((cat) => {
            const MatchedIcon = ICON_MAP[cat.icon || 'Shield'] || Shield;
            const isSelected = cat.id === activeCategory.id;
            
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  isSelected 
                    ? 'bg-[#FF6B00] text-white shadow-md' 
                    : 'bg-slate-50 hover:bg-slate-100 text-[#202A50] border border-slate-150'
                }`}
              >
                <MatchedIcon className="w-3.5 h-3.5" />
                {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Breadcrumb & Title */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="space-y-1">
            <Link to="/categorias" className="text-[10px] font-bold text-gray-400 hover:text-[#FF6B00] flex items-center gap-1 uppercase tracking-wider">
              <ArrowLeft className="w-3.5 h-3.5" /> Categorias
            </Link>
            <h1 className="text-2xl font-black text-[#202A50]">{activeCategory.name}</h1>
          </div>
          <span className="text-[10px] font-bold text-gray-400 font-mono">
            {relevantSubcategories.length} subcategorias | {categoryProducts.length} produtos
          </span>
        </div>

        {/* If there are no subcategories, render ECRÃ C (Products Grid of this category) */}
        {relevantSubcategories.length === 0 ? (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
              <p className="text-xs text-gray-500 font-semibold italic">Exibindo todos os produtos da categoria direta "{activeCategory.name}".</p>
            </div>
            
            {/* Products Grid - Screen C style (2 columns on mobile, responsive on desktop) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {categoryProducts.map((p) => {
                const insideCart = items.some(item => item.product.id === p.id);
                const isFavorite = !!favorites[p.id];
                return (
                  <div 
                    key={p.id}
                    className="bg-white rounded-2xl border border-gray-150/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        <img 
                          src={p.image} 
                          className="w-full h-full object-cover" 
                          alt={p.name} 
                        />
                        
                        {/* Visual heart favorite toggle */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(p.id)}
                          className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white rounded-full shadow-sm text-gray-400 hover:text-rose-500 transition-colors cursor-pointer z-10"
                        >
                          <Heart className={`w-4 h-4 transition-all ${isFavorite ? 'text-rose-500 fill-rose-500' : ''}`} />
                        </button>

                        <span className="absolute top-2.5 left-2.5 bg-white/95 text-gray-500 text-[8px] sm:text-[9px] uppercase font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                          {p.brand || 'MIRCA'}
                        </span>
                      </div>

                      <div className="p-3 sm:p-4 space-y-1.5">
                        <h4 className="font-extrabold text-xs sm:text-sm text-[#202A50] line-clamp-2">
                          {p.name}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-[#FF6B00] font-black">
                          {p.price ? `Kz ${p.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}` : 'Sob Consulta'}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 pt-0">
                      <button
                        onClick={() => addToCart(p, 1)}
                        className={`w-full text-white text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                          insideCart 
                            ? 'bg-emerald-600 hover:bg-emerald-700' 
                            : 'bg-[#FF6B00] hover:bg-orange-600'
                        }`}
                      >
                        {insideCart ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                        {insideCart ? 'Adicionado' : 'Pedir Orçamento'}
                      </button>
                    </div>
                  </div>
                );
              })}

              {categoryProducts.length === 0 && (
                <div className="col-span-full text-center py-16 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-gray-400 text-xs">
                  Nenhum produto cadastrado nesta categoria.
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ECRÃ B — Lista Vertical de Subcategorias */
          <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm max-w-2xl mx-auto divide-y divide-gray-100">
            {/* Opção "Ver Todos" no topo para listar todos os produtos da categoria */}
            <div
              onClick={() => navigate(`/produtos?category=${activeCategory.slug}`)}
              className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer group bg-orange-50/10"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FF6B00]">
                  <LayoutGrid className="w-5 h-5" />
                </div>
                <div className="text-left space-y-0.5">
                  <h4 className="font-extrabold text-[#202A50] text-sm group-hover:text-[#FF6B00] transition-colors">Ver Todos</h4>
                  <p className="text-[10px] text-gray-450 font-semibold">Exibir todos os {categoryProducts.filter(p => p.inStock).length} produtos desta divisão</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-450 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
            </div>

            {relevantSubcategories.map((sub) => {
              const subProducts = productsList.filter(p => p.inStock && p.subcategoryId === sub.id);
              
              return (
                <div
                  key={sub.id}
                  onClick={() => navigate(`/produtos?category=${activeCategory.slug}&subcategory=${sub.id}`)}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {sub.icon ? (
                      <img 
                        src={sub.icon} 
                        alt={sub.name} 
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-50" 
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center font-bold text-orange-500 text-xs">
                        {sub.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="text-left space-y-0.5">
                      <h4 className="font-extrabold text-[#202A50] text-sm group-hover:text-[#FF6B00] transition-colors">{sub.name}</h4>
                      <p className="text-[10px] text-gray-400 font-semibold">{subProducts.length} produtos disponíveis</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-450 group-hover:text-[#FF6B00] group-hover:translate-x-0.5 transition-all" />
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
