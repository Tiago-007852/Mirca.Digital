import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Search, X, Sparkles, Image, Check, Info, ArrowRight, Eye
} from 'lucide-react';
import { BannerItem } from '../../types';
import { dbService } from '../../services/dbService';
import ImageUpload from '../ImageUpload';
import ConfirmDialog from './ConfirmDialog';

interface BannersTabProps {
  activityLogged: (details: string, action?: any) => void;
}

export default function BannersTab({ activityLogged }: BannersTabProps) {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modals controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    banner: BannerItem | null;
  }>({ isOpen: false, banner: null });

  // Form states matching BannerItem schema
  const [formData, setFormData] = useState<BannerItem>({
    id: '',
    headline: '',
    subtitle: '',
    bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Ver Soluções',
    buttonLink: '/catalog',
    priority: 1,
    active: true
  });

  const loadBanners = async () => {
    setLoading(true);
    try {
      const data = await dbService.getBanners();
      setBanners(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      id: 'bnr_' + Math.random().toString(36).substr(2, 9),
      headline: '',
      subtitle: '',
      bgImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      buttonText: 'Solicitar Orçamento',
      buttonLink: '/orcamento',
      priority: banners.length + 1,
      active: true
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerItem) => {
    setEditingBanner(b);
    setFormData({ ...b });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.headline.trim() || !formData.bgImage.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      await dbService.saveBanner(formData);
      
      const verbs = editingBanner ? 'editou o slider' : 'adicionou slider';
      activityLogged(`O usuário ${verbs} "${formData.headline}" na homepage slide rotativo.`, editingBanner ? 'edit' : 'create');

      setIsModalOpen(false);
      await loadBanners();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (b: BannerItem) => {
    setDeleteConfirmState({
      isOpen: true,
      banner: b
    });
  };

  const executeDelete = async () => {
    const b = deleteConfirmState.banner;
    if (!b) return;
    try {
      await dbService.deleteBanner(b.id);
      activityLogged(`O usuário desativou o slider rotativo "${b.headline}".`, 'delete');
      await loadBanners();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, banner: null });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sliders do Banner Rotativo</h2>
          <p className="text-gray-500 text-xs text-slate-400">Insira imagens promocionais, slogans de campanhas de marcenaria ou segurança eletrônica no cabeçalho rotativo</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Novo Slider Banner
        </button>
      </div>

      {/* Grid mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {banners.map((slide) => (
          <div 
            key={slide.id}
            className={`bg-white rounded-2xl border ${slide.active ? 'border-gray-150' : 'border-dashed border-red-200'} overflow-hidden shadow-sm flex flex-col justify-between`}
          >
            
            {/* Visual preview */}
            <div className="relative h-44 bg-slate-900">
              <img src={slide.bgImage} className="w-full h-full object-cover opacity-60" alt="" referrerPolicy="no-referrer" />
              
              <div className="absolute inset-x-6 top-8 text-white space-y-1">
                <span className="text-[10px] uppercase font-bold text-orange-400">Slogan / Subtítulo</span>
                <h3 className="font-extrabold text-sm drop-shadow-md">{slide.headline}</h3>
                <p className="text-[11px] text-gray-200 line-clamp-2 leading-relaxed">{slide.subtitle}</p>
              </div>

              {/* Status pill decoration */}
              <span className={`absolute bottom-4 left-6 inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                slide.active ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                {slide.active ? 'Ativo no Site' : 'Inativo'}
              </span>

              {/* Call to action element decoration */}
              {slide.buttonText && (
                <span className="absolute bottom-4 right-6 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-[10px] font-bold py-1 px-3 rounded flex items-center gap-1 transition-all">
                  {slide.buttonText} <ArrowRight className="w-3 h-3" />
                </span>
              )}
            </div>

            {/* Banner footer layout details */}
            <div className="p-4 flex items-center justify-between border-t border-gray-50 bg-slate-50/20">
              <span className="text-[10px] text-gray-400 font-mono">Posição no carrossel: <strong className="text-[#202A50] font-extrabold">Slide #{slide.priority}</strong></span>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(slide)}
                  className="p-1.5 px-3 bg-white border border-gray-150 text-gray-650 hover:text-orange-600 hover:bg-orange-50 font-semibold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Edit className="w-3 h-3" /> Configuração
                </button>
                <button 
                  onClick={() => handleDelete(slide)}
                  className="p-1.5 bg-white border border-gray-150 text-gray-500 hover:text-red-650 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
        {banners.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-gray-400 font-medium bg-white border border-gray-100 rounded-2xl italic text-xs">
            Nenhum slider cadastrado no banner inicial rotativo.
          </div>
        )}
      </div>

      {/* Slide Modal overlay settings */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingBanner ? `Configurações de Slider` : 'Novo Slider de Destaque'}
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
              
              {/* Title heading */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Impacto (Chamada) <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Inteligência e Alta Performance em Segurança"
                />
              </div>

              {/* Subtitle / desc */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Auxiliar / Slogan</label>
                <textarea 
                  rows={2}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Monitoramento remoto Inteligente 24h por dia para proteger sua residência ou fazenda."
                />
              </div>

              {/* Image background URL */}
              <div className="space-y-1">
                <ImageUpload 
                  value={formData.bgImage}
                  onChange={(url) => setFormData({ ...formData, bgImage: url })}
                  folder="banners"
                  label="Fundo Promocional (Wallpaper) *"
                  aspectRatio="aspect-video"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* buttonText Text */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Texto do Botão CTA</label>
                  <input 
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Ver Preços"
                  />
                </div>

                {/* buttonLink Path Link */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Destino do Botão (Link)</label>
                  <input 
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: /catalog ou /quote"
                  />
                </div>

              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* priority priority slider */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Ordem de Prioridade</label>
                  <input 
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    min="1"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3 pl-1 select-none cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.checked ? true : false })}
                    className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                    id="checkbox-slides"
                  />
                  <label htmlFor="checkbox-slides" className="text-xs font-semibold text-gray-700 cursor-pointer">Colocar no carrossel</label>
                </div>

              </div>

              {/* Informative panel */}
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-1.5 text-[10px] text-amber-805 leading-normal">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>As dimensões ideais de slide rotativo são superiores a <strong>1920x800px</strong> para assegurar elegância e nitidez em monitores UltraWide desktop.</span>
              </div>

              {/* Modal buttons */}
              <div className="pt-4 border-t border-gray-150 flex items-center justify-end gap-3">
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
                  {saving ? 'Gravando...' : 'Guardar Alterações'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Excluir Banner"
        message={`Deseja remover definitivamente o slider banner "${deleteConfirmState.banner?.headline}"?`}
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmState({ isOpen: false, banner: null })}
      />

    </div>
  );
}
