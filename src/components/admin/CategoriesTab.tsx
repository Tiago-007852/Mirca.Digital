import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Shield, Armchair, HardHat, Paintbrush, 
  Search, X, Sparkles, LayoutGrid, Award, Info, Laptop, Zap
} from 'lucide-react';
import { CategoryItem, SubcategoryItem } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';
import ImageUpload from '../ImageUpload';

interface CategoriesTabProps {
  activityLogged: (details: string, action?: any) => void;
}

export default function CategoriesTab({ activityLogged }: CategoriesTabProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
 
  // Subcategory Modal states
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryItem | null>(null);
  const [subFormData, setSubFormData] = useState<SubcategoryItem>({
    id: '',
    categoryId: '',
    name: '',
    slug: '',
    icon: '',
    displayOrder: 1
  });

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    category: CategoryItem | null;
  }>({ isOpen: false, category: null });

  const [deleteSubConfirmState, setDeleteSubConfirmState] = useState<{
    isOpen: boolean;
    subcategory: SubcategoryItem | null;
  }>({ isOpen: false, subcategory: null });

  // Form inputs
  const [formData, setFormData] = useState<CategoryItem>({
    id: '',
    name: '',
    slug: '',
    icon: 'Shield',
    banner: '',
    description: '',
    displayOrder: 1
  });

  // Pre-selected Icons catalog for easy visual matching
  const iconOptions = [
    { name: 'Shield', label: 'Segurança (Shield)', icon: Shield },
    { name: 'Laptop', label: 'Informática (Laptop)', icon: Laptop },
    { name: 'Zap', label: 'Eletricidade (Zap)', icon: Zap },
    { name: 'Armchair', label: 'Modulados (Armchair)', icon: Armchair },
    { name: 'LayoutGrid', label: 'Menu Grid (LayoutGrid)', icon: LayoutGrid },
    { name: 'Award', label: 'Qualidade (Award)', icon: Award }
  ];

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await dbService.getCategories();
      setCategories(data);
      const subData = await dbService.getSubcategories();
      setSubcategories(subData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubNameChange = (nameStr: string) => {
    const slugified = nameStr
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    
    setSubFormData({
      ...subFormData,
      name: nameStr,
      slug: slugified
    });
  };

  const openAddSubcategory = (catId: string) => {
    setEditingSubcategory(null);
    const categorySubcategories = subcategories.filter(sc => sc.categoryId === catId);
    setSubFormData({
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      categoryId: catId,
      name: '',
      slug: '',
      icon: '',
      displayOrder: categorySubcategories.length + 1
    });
    setIsSubcategoryModalOpen(true);
  };

  const openEditSubcategory = (item: SubcategoryItem) => {
    setEditingSubcategory(item);
    setSubFormData({ ...item });
    setIsSubcategoryModalOpen(true);
  };

  const handleSubcategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormData.name.trim() || !subFormData.slug.trim()) {
      alert('Por favor preencha todos os campos obrigatórios.');
      return;
    }

    try {
      await dbService.saveSubcategory(subFormData);
      const acts = editingSubcategory ? 'editou' : 'adicionou';
      activityLogged(`O usuário ${acts} a subcategoria "${subFormData.name}" no catálogo.`, editingSubcategory ? 'edit' : 'create');
      setIsSubcategoryModalOpen(false);
      const subData = await dbService.getSubcategories();
      setSubcategories(subData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubcategory = (sub: SubcategoryItem) => {
    setDeleteSubConfirmState({
      isOpen: true,
      subcategory: sub
    });
  };

  const executeDeleteSubcategory = async () => {
    const sub = deleteSubConfirmState.subcategory;
    if (!sub) return;
    try {
      await dbService.deleteSubcategory(sub.id);
      activityLogged(`O usuário apagou a subcategoria "${sub.name}" do sistema.`, 'delete');
      const subData = await dbService.getSubcategories();
      setSubcategories(subData);
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteSubConfirmState({ isOpen: false, subcategory: null });
    }
  };

  // auto slugify helper
  const handleNameChange = (nameStr: string) => {
    const slugified = nameStr
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    
    setFormData({
      ...formData,
      name: nameStr,
      slug: slugified
    });
  };

  // Open add Modal
  const openAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      id: 'cat_' + Math.random().toString(36).substr(2, 9),
      name: '',
      slug: '',
      icon: 'Shield',
      banner: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      description: '',
      displayOrder: categories.length + 1
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditCategory = (item: CategoryItem) => {
    setEditingCategory(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim() || !formData.description.trim()) {
      alert('Por favor complete todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      await dbService.saveCategory(formData);
      const acts = editingCategory ? 'editou' : 'adicionou';
      activityLogged(`O usuário ${acts} a divisão de negócios "${formData.name}" no catálogo.`, editingCategory ? 'edit' : 'create');
      setIsModalOpen(false);
      await loadCategories();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Delete Category handler
  const handleDelete = (category: CategoryItem) => {
    setDeleteConfirmState({
      isOpen: true,
      category
    });
  };

  const executeDelete = async () => {
    const category = deleteConfirmState.category;
    if (!category) return;
    try {
      await dbService.deleteCategory(category.id);
      activityLogged(`O usuário apagou a categoria "${category.name}" do sistema.`, 'delete');
      await loadCategories();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, category: null });
    }
  };

  const filtered = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Head section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Divisões &amp; Categorias</h2>
          <p className="text-gray-500 text-xs">Administre as ramificações de serviços, ícones representativos, e as banners estruturais do catálogo</p>
        </div>
        <button 
          onClick={openAddCategory}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Criar Categoria
        </button>
      </div>

      {/* Mini search filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar categoria..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>
        <span className="text-[11px] text-gray-500 font-semibold text-right">
          Atualmente gerenciando <strong>{categories.length}</strong> divisões institucionais
        </span>
      </div>

      {/* Grid of categories cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          // Find matching design icon and render it
          const MatchedIcon = iconOptions.find(o => o.name === item.icon)?.icon || Shield;
          
          return (
            <div 
              key={item.id} 
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-slate-50 rounded-bl-full pointer-events-none -mr-8 -mt-8 flex items-center justify-center">
                <MatchedIcon className="w-5 h-5 text-gray-300 transform -translate-x-3 translate-y-3" />
              </div>

              <div className="space-y-2 relative z-10">
                <div className="flex items-center gap-2.5">
                  <span className="p-2.5 bg-orange-50 text-[#FF6B00] rounded-xl">
                    <MatchedIcon className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm leading-none">{item.name}</h3>
                    <span className="text-[10px] text-gray-405 font-mono">slug: {item.slug}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
              </div>

              {/* Card Footer controls */}
              <div className="pt-3 border-t border-gray-50 flex items-center justify-between mt-2">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                  Ordem no Menu: <strong className="text-gray-800 font-extrabold">{item.displayOrder}º</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openEditCategory(item)}
                    className="p-1.5 px-3 bg-slate-50 text-gray-650 hover:text-orange-600 hover:bg-orange-50 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit className="w-3 h-3" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-1.5 bg-slate-50 text-gray-650 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                    title="Remover"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-12 text-gray-400 bg-white border border-gray-100 rounded-2xl italic text-xs">
            Nenhuma classificação cadastrada no momento.
          </div>
        )}
      </div>

      {/* Modal for Addition/Modification */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Modal Heading */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingCategory ? `Configurar Divisão: ${editingCategory.name}` : 'Registrar Nova Divisão'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Category Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome da Divisão <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: CCTV e Videovigilância"
                />
              </div>

              {/* Slug Auto generated */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Slug Url (Auto-Gerada)</label>
                <input 
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-gray-500 outline-none select-all"
                  placeholder="cctv-e-videovigilancia"
                />
              </div>

              {/* Icon dropdown matcher */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Ícone Representativo Visual</label>
                <select 
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800 font-semibold"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.name} value={opt.name}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Display Order */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Ordem de Listagem</label>
                  <input 
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    min="1"
                  />
                </div>

                {/* Banner link preview reference decoration */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Métrica do Catálogo</label>
                  <div className="py-2.5 px-3 bg-slate-50 border border-slate-150 rounded-xl text-center text-xs text-slate-400 font-bold select-none cursor-not-allowed">
                    Ativa Integrada
                  </div>
                </div>

              </div>

              {/* Category Image */}
              <div className="space-y-1">
                <ImageUpload 
                  value={formData.banner || ''}
                  onChange={(url) => setFormData({ ...formData, banner: url })}
                  folder="categories"
                  label="Imagem / Banner da Categoria"
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Breve Descrição Divisão <span className="text-rose-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Nossa unidade dedicada ao monitoramento integral..."
                />
              </div>

              {/* Info panel */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-2 text-[10px] text-amber-800 leading-normal">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Atenção:</strong> Alterações de nome ou slug atualizarão o menu principal de navegação corporativo em tempo real para todos os clientes públicos.
                </div>
              </div>

              {/* Subcategories section (only when editing existing category) */}
              {editingCategory && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-950 text-xs uppercase tracking-wider">Subcategorias desta divisão</h4>
                      <p className="text-[10px] text-gray-500">Subdivisões do catálogo para organização secundária</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAddSubcategory(editingCategory.id)}
                      className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold text-[10px] rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-orange-100"
                    >
                      <Plus className="w-3.5 h-3.5" /> Adicionar Subcategoria
                    </button>
                  </div>

                  <div className="space-y-2">
                    {subcategories.filter(sc => sc.categoryId === editingCategory.id).length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        Nenhuma subcategoria criada para esta divisão.
                      </p>
                    ) : (
                      <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-slate-50/50">
                        {subcategories.filter(sc => sc.categoryId === editingCategory.id).map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2.5">
                              {sub.icon ? (
                                <img src={sub.icon} alt={sub.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-150 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                                  S/I
                                </div>
                              )}
                              <div>
                                <h5 className="text-xs font-bold text-gray-850 leading-tight">{sub.name}</h5>
                                <p className="text-[10px] text-gray-405 font-mono">slug: {sub.slug} | ordem: {sub.displayOrder}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditSubcategory(sub)}
                                className="p-1 hover:bg-slate-100 text-slate-650 hover:text-orange-600 rounded-md transition-colors cursor-pointer"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubcategory(sub)}
                                className="p-1 hover:bg-slate-100 text-slate-650 hover:text-red-600 rounded-md transition-colors cursor-pointer"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Modal controls */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  {saving ? 'Gravando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Modal for Subcategory Addition/Modification */}
      {isSubcategoryModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Modal Heading */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingSubcategory ? `Configurar Subcategoria: ${editingSubcategory.name}` : 'Registrar Nova Subcategoria'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setIsSubcategoryModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubcategorySubmit} className="p-6 space-y-4">
              
              {/* Subcategory Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome da Subcategoria <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={subFormData.name}
                  onChange={(e) => handleSubNameChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Câmaras IP Dome"
                />
              </div>

              {/* Slug Auto generated */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Slug Url (Auto-Gerada)</label>
                <input 
                  type="text"
                  required
                  value={subFormData.slug}
                  onChange={(e) => setSubFormData({ ...subFormData, slug: e.target.value })}
                  className="w-full bg-slate-50/50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-gray-500 outline-none select-all"
                  placeholder="camaras-ip-dome"
                />
              </div>

              {/* Display Order */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Ordem de Listagem</label>
                <input 
                  type="number"
                  value={subFormData.displayOrder}
                  onChange={(e) => setSubFormData({ ...subFormData, displayOrder: parseInt(e.target.value) || 1 })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  min="1"
                />
              </div>

              {/* Subcategory Image */}
              <div className="space-y-1">
                <ImageUpload 
                  value={subFormData.icon || ''}
                  onChange={(url) => setSubFormData({ ...subFormData, icon: url })}
                  folder="subcategories"
                  label="Imagem / Ícone da Subcategoria"
                  aspectRatio="aspect-square"
                />
              </div>

              {/* Modal controls */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsSubcategoryModalOpen(false)}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl font-semibold text-xs cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Salvar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Remover Categoria"
        message={`Deseja remover definitivamente a categoria "${deleteConfirmState.category?.name}"? Isso pode impactar os produtos associados a ela.`}
        confirmText="Confirmar Remoção"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmState({ isOpen: false, category: null })}
      />

      <ConfirmDialog
        isOpen={deleteSubConfirmState.isOpen}
        title="Remover Subcategoria"
        message={`Deseja remover definitivamente a subcategoria "${deleteSubConfirmState.subcategory?.name}"? Isso pode impactar os produtos associados a ela.`}
        confirmText="Confirmar Remoção"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDeleteSubcategory}
        onCancel={() => setDeleteSubConfirmState({ isOpen: false, subcategory: null })}
      />

    </div>
  );
}
