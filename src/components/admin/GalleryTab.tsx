import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Camera, PenTool, Hammer, Paintbrush,
  Search, X, Sparkles, CheckCircle2, Image as ImageIcon
} from 'lucide-react';
import { GalleryItem, Category } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';
import ImageUpload from '../ImageUpload';

interface GalleryTabProps {
  activityLogged: (details: string, action?: any) => void;
}

export default function GalleryTab({ activityLogged }: GalleryTabProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modals controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    item: GalleryItem | null;
  }>({ isOpen: false, item: null });

  // Form parameters
  const [formData, setFormData] = useState<GalleryItem>({
    id: '',
    title: '',
    category: 'security',
    image: '',
    description: ''
  });

  // Allowed categories
  const categoryOptions: { value: Category; label: string }[] = [
    { value: 'security', label: 'Segurança Eletrónica' },
    { value: 'furniture', label: 'Mobiliário Planejado' },
    { value: 'informatica', label: 'Informática & Redes' },
    { value: 'cozinha', label: 'Cozinhas de Luxo' },
    { value: 'mobiliario', label: 'Marcenaria Geral' }
  ];

  const loadGallery = async () => {
    setLoading(true);
    try {
      const data = await dbService.getGallery();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery();
  }, []);

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      id: 'gal_' + Math.random().toString(36).substr(2, 9),
      title: '',
      category: 'security',
      image: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Por favor, informe o título da imagem.');
      return;
    }
    if (!formData.image) {
      alert('Por favor, envie uma imagem para a galeria.');
      return;
    }

    setSaving(true);
    try {
      await dbService.saveGalleryItem(formData);
      activityLogged(
        `${editingItem ? 'Editou' : 'Criou'} item da galeria: "${formData.title}"`,
        editingItem ? 'edit' : 'create'
      );
      setIsModalOpen(false);
      loadGallery();
    } catch (err) {
      console.error(err);
      alert('Ocorreu um erro ao gravar o item.');
    } finally {
      setSaving(false);
    }
  };

  const triggerDelete = (item: GalleryItem) => {
    setDeleteConfirmState({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    const item = deleteConfirmState.item;
    if (!item) return;

    try {
      await dbService.deleteGalleryItem(item.id);
      activityLogged(`Removeu item da galeria: "${item.title}"`, 'delete');
      setDeleteConfirmState({ isOpen: false, item: null });
      loadGallery();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir item da galeria.');
    }
  };

  // Filter logic
  const filteredItems = items.filter(it => {
    const matchSearch = it.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        it.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || it.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Galeria Multimédia</h2>
          <p className="text-gray-500 text-xs">Adicione fotos, mídias e projetos que ilustram a maestria técnica da MIRCA LDA no website.</p>
        </div>
        
        <button
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-xs py-3 px-5 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Adicionar Nova Foto
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por título ou descrição..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-orange-500"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="w-full md:w-56">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="all">Todas as Categorias</option>
            {categoryOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Gallery Items Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-400 text-xs">
          A carregar itens da galeria...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-16 text-center text-gray-400 text-xs">
          Nenhum item encontrado com os critérios de busca atuais.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((it) => {
            const catLabel = categoryOptions.find(opt => opt.value === it.category)?.label || it.category;
            return (
              <div key={it.id} className="bg-white rounded-2xl border border-gray-150/60 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                <div className="relative aspect-video bg-slate-100 group">
                  <img src={it.image} alt={it.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-2.5 left-2.5 bg-[#202A50] text-white text-[9px] font-extrabold uppercase px-2 py-1 rounded-md tracking-wider">
                    {catLabel}
                  </span>
                </div>

                <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs text-gray-900 line-clamp-1">{it.title}</h4>
                    <p className="text-gray-500 text-[10.5px] line-clamp-2 leading-relaxed">{it.description}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-50">
                    <button
                      onClick={() => openEditModal(it)}
                      className="p-1.5 bg-slate-50 hover:bg-slate-100 text-[#202A50] hover:text-[#FF6B00] rounded-lg transition-colors cursor-pointer"
                      title="Editar"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => triggerDelete(it)}
                      className="p-1.5 bg-slate-50 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-colors cursor-pointer"
                      title="Excluir"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          
          <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-extrabold text-xs text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                {editingItem ? 'Editar Item da Galeria' : 'Adicionar Novo Item'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Título da Obra / Foto</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Armário Marítimo Cozinha Premium"
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Categoria</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                >
                  {categoryOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Auxiliar</label>
                <textarea 
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva detalhes como acabamentos, materiais ou sistemas utilizados..."
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                />
              </div>

              <div>
                <ImageUpload 
                  value={formData.image}
                  onChange={(url) => setFormData({ ...formData, image: url })}
                  folder="gallery"
                  label="Imagem da Galeria"
                  aspectRatio="aspect-video"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:bg-slate-50 font-bold text-[11px] uppercase tracking-wider"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer"
                >
                  {saving ? 'Gravando...' : 'Confirmar e Gravar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm deletion dialog */}
      <ConfirmDialog 
        isOpen={deleteConfirmState.isOpen}
        title="Excluir Foto da Galeria?"
        message={`Esta ação irá remover permanentemente a imagem "${deleteConfirmState.item?.title}" do portfólio público. Esta operação não pode ser desfeita.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmState({ isOpen: false, item: null })}
      />

    </div>
  );
}
