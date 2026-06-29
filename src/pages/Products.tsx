import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS_DATA } from '../constants/mockData';
import { Product, Category, CategoryItem, SubcategoryItem } from '../types';
import { useCart } from '../contexts/CartContext';
import { dbService } from '../services/dbService';
import { Search, SlidersHorizontal, ShoppingCart, Eye, Sparkles, Check, ArrowRight, ArrowLeft, Heart } from 'lucide-react';

const CATEGORY_TRANSLATIONS: Record<string, string> = {
  cozinha: 'Cozinha (Montagem de Peças)',
  transporte: 'Transporte de Material',
  mobiliario: 'Aplicação de Mobiliário',
  security: 'Segurança Eletrónica',
  'seguranca-eletronica': 'Segurança Eletrónica',
  furniture: 'Mobiliário Planejado',
  informatica: 'Informática & Redes',
  eletricidade: 'Eletricidade'
};

export default function Products() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Category>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<'all' | string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'category'>('name');
  
  // Favorites local visual state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected details modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search');
    const categoryParam = params.get('category');
    const subcategoryParam = params.get('subcategory');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (subcategoryParam) {
      setSelectedSubcategory(subcategoryParam);
    }

    dbService.getProducts().then((list) => {
      setProductsList(list);
      if (id) {
        const found = list.find(p => p.id === id);
        if (found) setSelectedProduct(found);
      }
    }).catch(() => {
      setProductsList(PRODUCTS_DATA);
      if (id) {
        const found = PRODUCTS_DATA.find(p => p.id === id);
        if (found) setSelectedProduct(found);
      }
    });

    dbService.getCategories().then((list) => {
      setCategories(list);
    }).catch(err => {
      console.error('Error fetching categories:', err);
    });

    dbService.getSubcategories().then((list) => {
      setSubcategories(list);
    }).catch(err => {
      console.error('Error fetching subcategories:', err);
    });
  }, [id]);

  const getCategoryLabel = (catSlug: string) => {
    const found = categories.find(c => c.slug === catSlug);
    if (found) return found.name;
    return CATEGORY_TRANSLATIONS[catSlug] || catSlug;
  };

  const toggleFavorite = (prodId: string) => {
    setFavorites(prev => ({ ...prev, [prodId]: !prev[prodId] }));
  };

  // Find subcategories of selected category
  const selectedCategoryItem = categories.find(cat => cat.slug === selectedCategory);
  const activeSubcategories = selectedCategoryItem
    ? subcategories.filter(sub => sub.categoryId === selectedCategoryItem.id)
    : [];

  // Filtering and sorting logic
  const filteredProducts = productsList.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || p.subcategoryId === selectedSubcategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else {
      return a.category.localeCompare(b.category);
    }
  });

  // Paginated chunk
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Catalog Hero Banner */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4 font-sans">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">Catálogo Oficial</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Nossas Peças & Equipamentos</h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Selecione dispositivos de monitoramento de elite, fechaduras inteligentes ou revestimentos luxuosos para cotarmos sem compromisso.
          </p>
        </div>
      </section>

      {/* Catalog Grid View layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
        
        {/* Left Side: Filter Settings sidebar */}
        <div className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-150">
            <SlidersHorizontal className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="font-extrabold text-[#202A50] text-sm uppercase tracking-wider">Filtros de Pesquisa</h3>
          </div>

          {/* Search input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Procurar Termo</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                className="w-full text-xs font-semibold px-4 py-3 pl-10 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-all text-[#000000]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Categories select checklist */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Categoria</label>
            <div className="flex flex-col gap-1.5 text-xs text-gray-500 font-medium font-sans">
              {[
                { id: 'all', label: 'Todos os Produtos' },
                ...categories.map((c) => ({ id: c.slug, label: c.name }))
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as any);
                    setSelectedSubcategory('all');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg transition-all ${
                    selectedCategory === cat.id 
                      ? 'bg-orange-50 text-[#FF6B00] font-bold' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories checklist */}
          {selectedCategory !== 'all' && activeSubcategories.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-gray-50 animate-fade-in">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Subcategoria</label>
              <div className="flex flex-col gap-1.5 text-xs text-gray-500 font-medium font-sans">
                {[
                  { id: 'all', name: 'Todas as Subcategorias' },
                  ...activeSubcategories
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubcategory(sub.id)}
                    className={`w-full text-left py-2 px-3 rounded-lg transition-all ${
                      selectedSubcategory === sub.id 
                        ? 'bg-orange-55 text-[#FF6B00] font-bold' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {sub.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sorting configurations */}
          <div className="space-y-1.5 pt-2 border-t border-gray-50">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Ordenar Por</label>
            <select 
              className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Alfabética (A-Z)</option>
              <option value="category">Classificação Técnico</option>
            </select>
          </div>

        </div>

        {/* Right Side: Paginated Product Grid */}
        <div className="lg:col-span-3 space-y-12">
          
          <div className="flex justify-between items-center text-xs text-gray-400 font-semibold border-b border-gray-100 pb-3">
            <span>Foram encontrados {sortedProducts.length} produto(s)</span>
            <span>Página {currentPage} de {totalPages || 1}</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {paginatedProducts.map((p) => {
              const insideCart = items.some(item => item.product.id === p.id);
              const isFavorite = !!favorites[p.id];
              return (
                <div 
                  key={p.id}
                  className="bg-white rounded-2xl border border-gray-150 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square bg-gray-50 relative overflow-hidden">
                      <img 
                        src={p.image} 
                        className="w-full h-full object-cover cursor-pointer" 
                        alt={p.name}
                        onClick={() => setSelectedProduct(p)}
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

                    <div className="p-3 sm:p-4 space-y-1.5 text-left">
                      <span className="text-[9px] text-[#FF6B00] uppercase font-extrabold tracking-wider block">
                        {getCategoryLabel(p.category)}
                      </span>
                      <h4 
                        onClick={() => setSelectedProduct(p)}
                        className="font-extrabold text-xs sm:text-sm text-[#202A50] hover:text-[#FF6B00] cursor-pointer transition-colors line-clamp-2"
                      >
                        {p.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#FF6B00] font-black">
                        {p.price ? `Kz ${p.price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })}` : 'Sob Consulta'}
                      </p>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="p-3 sm:p-4 pt-0">
                    <button
                      onClick={() => addToCart(p, 1)}
                      className={`w-full text-white text-[10px] sm:text-xs font-bold py-2 sm:py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
                        insideCart 
                          ? 'bg-emerald-600 hover:bg-emerald-700' 
                          : 'bg-[#FF6B00] hover:bg-orange-600'
                      }`}
                    >
                      {insideCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                      {insideCart ? 'Adicionado' : 'Pedir Orçamento'}
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {paginatedProducts.length === 0 && (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl text-gray-400">
              Nenhum produto corresponde aos filtros aplicados. Tente outras palavras-passe ou categorias.
            </div>
          )}

          {/* Pagination triggers */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-6 border-t border-gray-100">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="p-2 border border-gray-150 rounded-xl disabled:opacity-40 hover:bg-gray-50 shrink-0 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#202A50]" />
              </button>
              <span className="text-xs font-bold text-gray-400">Página {currentPage} de {totalPages}</span>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="p-2 border border-gray-150 rounded-xl disabled:opacity-40 hover:bg-gray-50 shrink-0 transition-colors"
              >
                <ArrowRight className="w-4 h-4 text-[#202A50]" />
              </button>
            </div>
          )}

        </div>

      </section>

      {/* IMMERSIVE MODAL VIEW DETAILS POPUP FOR EACH DYNAMIC PRODUCT */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-[#202A50]/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <div>
                <span className="text-xs font-bold text-[#FF6B00] uppercase block tracking-wider">
                  {getCategoryLabel(selectedProduct.category)}
                </span>
                <h4 className="font-extrabold text-[#202A50] text-xl flex items-center gap-2">
                  {selectedProduct.name} <Sparkles className="w-4.5 h-4.5 text-[#FF6B00]" />
                </h4>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="bg-gray-200 hover:bg-[#FF6B00] hover:text-white text-gray-700 font-bold rounded-full w-8 h-8 flex items-center justify-center transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden h-72 bg-gray-100">
                  <img src={selectedProduct.image} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="space-y-1 text-center bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Origem / Fabricante Certificado</span>
                  <span className="font-extrabold text-sm text-[#202A50]">{selectedProduct.brand || 'MIRCA Atelier'}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-400 uppercase font-extrabold block">Sobre o Equipamento / Peça</span>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {selectedProduct.description}
                  </p>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] text-gray-400 uppercase font-extrabold block">Especificações Técnicas de Fábrica</span>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedProduct.technicalSpecs.map((spec, i) => (
                      <span key={i} className="text-[10.5px] text-gray-500 bg-gray-50 px-3 py-2 border border-gray-100/40 rounded-lg block font-semibold leading-relaxed">
                        • {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    Adicionar à Lista de Opções
                  </button>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-6 py-3.5 border border-gray-200 text-[#202A50] font-bold text-xs rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
