import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Copy, Search, Check, Filter, 
  ChevronRight, X, Sparkles, Image, CheckCircle, AlertCircle
} from 'lucide-react';
import { Product, Category, CategoryItem, SubcategoryItem } from '../../types';
import { dbService } from '../../services/dbService';
import ImageUpload from '../ImageUpload';
import ConfirmDialog from './ConfirmDialog';

interface ProductsTabProps {
  products: Product[];
  onRefresh: () => Promise<void>;
  activityLogged: (details: string, action?: any) => void;
}

export default function ProductsTab({ products, onRefresh, activityLogged }: ProductsTabProps) {
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: 'cozinha',
    subcategoryId: '',
    description: '',
    technicalSpecs: [''],
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: '',
    price: 0,
    priceVisible: false,
    featured: false,
    isNew: false,
    onSale: false,
    displayOrder: 1,
    seoTitle: '',
    seoDescription: ''
  });

  useEffect(() => {
    dbService.getCategories().then(setCategories).catch(err => console.error(err));
    dbService.getSubcategories().then(setSubcategories).catch(err => console.error(err));
  }, []);

  const [saving, setSaving] = useState(false);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    product: Product | null;
  }>({ isOpen: false, product: null });

  // Helper categories options computed dynamically
  const categoryOptions = categories.length > 0 
    ? categories.map(cat => ({ value: cat.slug as Category, label: cat.name }))
    : [
        { value: 'cozinha' as Category, label: 'Cozinha (Montagem de Peças)' },
        { value: 'transporte' as Category, label: 'Transporte de Material' },
        { value: 'mobiliario' as Category, label: 'Aplicação de Mobiliário' }
      ];

  // Find category item based on currently selected category slug in form
  const selectedCategoryItem = categories.find(cat => cat.slug === formData.category);
  const relevantSubcategories = selectedCategoryItem 
    ? subcategories.filter(sub => sub.categoryId === selectedCategoryItem.id)
    : [];

  // Filters logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || 
                         (stockFilter === 'instock' && product.inStock) || 
                         (stockFilter === 'outofstock' && !product.inStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Open Add Product Modal
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: categoryOptions[0]?.value || 'cozinha',
      subcategoryId: '',
      description: '',
      technicalSpecs: [''],
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      inStock: true,
      brand: '',
      price: 0,
      priceVisible: false,
      featured: false,
      isNew: false,
      onSale: false,
      displayOrder: 1,
      seoTitle: '',
      seoDescription: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Product Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      subcategoryId: product.subcategoryId || '',
      description: product.description,
      technicalSpecs: product.technicalSpecs && product.technicalSpecs.length > 0 ? [...product.technicalSpecs] : [''],
      image: product.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
      inStock: product.inStock,
      brand: product.brand || '',
      price: product.price || 0,
      priceVisible: product.priceVisible || false,
      featured: product.featured || false,
      isNew: product.isNew || false,
      onSale: product.onSale || false,
      displayOrder: product.displayOrder || 1,
      seoTitle: product.seoTitle || '',
      seoDescription: product.seoDescription || ''
    });
    setIsModalOpen(true);
  };

  // handle Spec item modification
  const handleSpecChange = (index: number, val: string) => {
    const specs = [...formData.technicalSpecs];
    specs[index] = val;
    setFormData({ ...formData, technicalSpecs: specs });
  };

  const addSpecRow = () => {
    setFormData({ ...formData, technicalSpecs: [...formData.technicalSpecs, ''] });
  };

  const removeSpecRow = (index: number) => {
    const specs = [...formData.technicalSpecs];
    if (specs.length > 1) {
      specs.splice(index, 1);
      setFormData({ ...formData, technicalSpecs: specs });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.description.trim()) {
      alert('Por favor preencha os campos obrigatórios (Nome e Descrição).');
      return;
    }

    setSaving(true);
    try {
      const activeId = editingProduct ? editingProduct.id : 'prod_' + Math.random().toString(36).substr(2, 9);
      const cleanedSpecs = formData.technicalSpecs.filter(s => s.trim() !== '');
      
      const selectedCategoryItem = categories.find(cat => cat.slug === formData.category);
      const payload: Product = {
        ...formData,
        id: activeId,
        categoryId: selectedCategoryItem?.id || '',
        technicalSpecs: cleanedSpecs.length > 0 ? cleanedSpecs : ['Especificação técnica geral']
      };

      await dbService.saveProduct(payload);
      
      const actionLabel = editingProduct ? 'editou' : 'criou';
      activityLogged(`O usuário ${actionLabel} o produto "${payload.name}" no catálogo.`, editingProduct ? 'edit' : 'create');

      setIsModalOpen(false);
      await onRefresh();
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao guardar o produto.');
    } finally {
      setSaving(false);
    }
  };

  // Duplicate / Rapid Variant cloner
  const handleCloneProduct = async (product: Product) => {
    try {
      const clonedId = 'prod_' + Math.random().toString(36).substr(2, 9);
      const cloned: Product = {
        ...product,
        id: clonedId,
        name: `${product.name} (Cópia)`,
        featured: false
      };
      await dbService.saveProduct(cloned);
      activityLogged(`O usuário duplicou o produto "${product.name}" criando o clone "${cloned.name}".`, 'create');
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete product action
  const handleDeleteProduct = (product: Product) => {
    setDeleteConfirmState({
      isOpen: true,
      product
    });
  };

  const executeDeleteProduct = async () => {
    const product = deleteConfirmState.product;
    if (!product) return;
    try {
      await dbService.deleteProduct(product.id);
      activityLogged(`O usuário removeu o produto "${product.name}" do catálogo.`, 'delete');
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, product: null });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper header action area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Catálogo de Produtos</h2>
          <p className="text-gray-500 text-xs text-slate-400">Gerencie câmeras IP, kits de automação, fechaduras inteligentes e linhas de marcenaria da MIRCA</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Adicionar Produto
        </button>
      </div>

      {/* Advanced Filter panel */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar por nome ou marca..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-medium focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>

        {/* Action Controls filters group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-150 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">Todas as Categorias</option>
              {categoryOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          {/* Stock Dropdown */}
          <div className="flex items-center gap-1.5 text-xs">
            <select 
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="bg-slate-50 border border-slate-150 py-1.5 px-2.5 rounded-lg text-[11px] font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">Filtro de Inventário</option>
              <option value="instock">Disponível em Stock</option>
              <option value="outofstock">Fora de Stock / Sob Encomenda</option>
            </select>
          </div>

          <span className="text-gray-400 text-xs hidden md:inline">|</span>

          <span className="text-[11px] text-gray-500 font-medium ml-1">
            Exibindo <strong>{filteredProducts.length}</strong> de {products.length} itens
          </span>

        </div>

      </div>

      {/* Catalog Table Area */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-55/40 text-gray-400 text-[10px] font-bold tracking-wider uppercase">
                <th className="py-3 px-4">Produto</th>
                <th className="py-3 px-4">Marca</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Preço (AO)</th>
                <th className="py-3 px-4">Disponibilidade</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs">
              {filteredProducts.map((p) => {
                const categoryLabel = categoryOptions.find(o => o.value === p.category)?.label || p.category;
                return (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    
                    {/* Thumbnail + Name details */}
                    <td className="py-3.5 px-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-gray-100 overflow-hidden shrink-0">
                        <img 
                          src={p.image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=120&q=80'} 
                          className="w-full h-full object-cover" 
                          alt="" 
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="leading-snug">
                        <h4 className="font-bold text-[#202A50] hover:text-[#FF6B00] transition-colors">{p.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate max-w-xs">{p.description}</p>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {p.brand || 'MIRCA Design'}
                    </td>

                    {/* App Category tag */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium text-[10px] ${
                        p.category === 'cozinha' ? 'bg-[#FF6B00]/10 text-[#FF6B00]' :
                        p.category === 'transporte' ? 'bg-blue-100 text-blue-800' :
                        p.category === 'mobiliario' ? 'bg-amber-100 text-amber-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {categoryLabel}
                      </span>
                    </td>

                    {/* Computed Price */}
                    <td className="py-3.5 px-4 text-gray-700 font-mono">
                      {p.priceVisible && p.price ? (
                        new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA', maximumFractionDigits: 0 }).format(p.price)
                      ) : (
                        <span className="text-gray-450 italic text-[10px]">Sob Consulta</span>
                      )}
                    </td>

                    {/* Stock Status indicator */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold ${p.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {p.inStock ? 'Disponível' : 'Fora de Stock'}
                      </span>
                    </td>

                    {/* Fast Action Row */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        
                        {/* Edit */}
                        <button 
                          onClick={() => openEditModal(p)}
                          className="p-1.5 bg-gray-50 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Fast Duplicate cloner */}
                        <button 
                          onClick={() => handleCloneProduct(p)}
                          className="p-1.5 bg-gray-50 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
                          title="Duplicar item (variante)"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Definite Delete */}
                        <button 
                          onClick={() => handleDeleteProduct(p)}
                          className="p-1.5 bg-gray-50 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>

                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-450 italic">
                    Nenhum produto correspondente aos filtros foi localizado no catálogo da MIRCA.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* COMPREHENSIVE MODAL FOR ADDING / EDITING PRODUCTS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Modal Head */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-md">
                  {editingProduct ? `Editar Item: ${editingProduct.name}` : 'Registrar Novo Produto no Catálogo'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Nome do Produto <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Câmera Smart Lente Dupla Ajax"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Marca / Fabricante</label>
                  <input 
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Ajax Systems, Hikvision ou MIRCA Design"
                  />
                </div>

                {/* Category Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Categoria</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category, subcategoryId: '' })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800 font-medium"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Subcategoria</label>
                  <select 
                    value={formData.subcategoryId || ''}
                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800 font-medium"
                  >
                    <option value="">Sem subcategoria</option>
                    {relevantSubcategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                {/* Display Order inside lists */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Prioridade de Exibição</label>
                  <input 
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="1"
                    min="1"
                  />
                </div>

              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Descrição Pública <span className="text-rose-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="Forneça uma descrição cativante, cobrindo os aspectos de uso prático e benefícios desse produto."
                />
              </div>

              {/* Cover Image Input / Preview */}
              <div className="sm:col-span-2">
                <ImageUpload 
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="products"
                  label="Imagem do Produto"
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Prices Configs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-3 rounded-xl border border-gray-100/50">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Preço em Kwanza (AOA)</label>
                  <input 
                    type="number"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: 85000"
                  />
                  <span className="text-[9px] text-gray-400 block">Deixe 0 para sob-proposta</span>
                </div>
                
                {/* Checkboxes variables */}
                <div className="flex flex-col gap-2.5 justify-center pt-2 pl-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={formData.priceVisible}
                      onChange={(e) => setFormData({ ...formData, priceVisible: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    Preço visível nesta página
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    Destaque na página principal
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    Marcar como "Novidade"
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={formData.onSale}
                      onChange={(e) => setFormData({ ...formData, onSale: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    Marcar como "Oferta Especial"
                  </label>
                </div>
              </div>

              {/* Technical Specifications Rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-500 uppercase">Especificações Técnicas (Métrica)</label>
                  <button 
                    type="button"
                    onClick={addSpecRow}
                    className="text-[10px] text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5"
                  >
                    + Linha
                  </button>
                </div>
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {formData.technicalSpecs.map((spec, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        value={spec}
                        onChange={(e) => handleSpecChange(idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        placeholder="ex: Resolução: 4MP 150m Visão Noturna"
                      />
                      <button 
                        type="button"
                        onClick={() => removeSpecRow(idx)}
                        disabled={formData.technicalSpecs.length <= 1}
                        className="p-1 px-2.5 bg-slate-50 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 rounded-lg text-xs"
                      >
                        Excluir
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stock switch availability */}
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-150/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Status de Disponibilidade</h4>
                  <p className="text-[10px] text-gray-400">Determina se o cliente pode agendar orçamento deste item diretamente para o WhatsApp</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, inStock: !formData.inStock })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.inStock ? 'bg-emerald-500' : 'bg-gray-300'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.inStock ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* SEO Fields Accordion info */}
              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50 space-y-2">
                <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">SEO &amp; Indexação Google</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full bg-white border border-indigo-150/30 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400 outline-none text-[#000000]"
                    placeholder="Título SEO Opcional"
                  />
                  <input 
                    type="text"
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full bg-white border border-indigo-150/30 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-indigo-400 outline-none text-[#000000]"
                    placeholder="Descrição SEO Opcional"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex items-center justify-end gap-3 z-10">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-xl font-bold text-xs shadow-md shadow-orange-500/10 cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  {saving ? 'Guardando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Remover Produto"
        message={`Tem certeza de que deseja remover permanentemente o produto "${deleteConfirmState.product?.name}" do catálogo público?`}
        confirmText="Excluir Definitivamente"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDeleteProduct}
        onCancel={() => setDeleteConfirmState({ isOpen: false, product: null })}
      />

    </div>
  );
}
