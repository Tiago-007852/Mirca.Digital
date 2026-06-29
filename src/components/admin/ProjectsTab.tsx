import React, { useState } from 'react';
import { 
  Plus, Edit, Trash2, Search, X, Sparkles, MapPin, 
  Calendar, Check, User, Link, Image as ImageIcon, Info
} from 'lucide-react';
import { Project, Category } from '../../types';
import { dbService } from '../../services/dbService';
import ImageUpload from '../ImageUpload';
import ConfirmDialog from './ConfirmDialog';

interface ProjectsTabProps {
  projects: Project[];
  onRefresh: () => Promise<void>;
  activityLogged: (details: string, action?: any) => void;
}

export default function ProjectsTab({ projects, onRefresh, activityLogged }: ProjectsTabProps) {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | Category>('all');

  // Modals controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<Project, 'id'>>({
    title: '',
    category: 'security',
    description: '',
    client: '',
    location: '',
    date: '',
    completionDate: '',
    servicesUsed: [''],
    beforeImage: '',
    afterImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    images: [],
    videoLink: '',
    featured: false,
    seoTitle: '',
    seoDescription: ''
  });

  const [saving, setSaving] = useState(false);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    project: Project | null;
  }>({ isOpen: false, project: null });

  // Categories translation Map
  const categoryLabels: Record<Category, string> = {
    security: 'Segurança Eletrónica',
    furniture: 'Mobiliário Planejado',
    informatica: 'Informática & Redes',
    cozinha: 'Cozinha (Montagem de Peças)',
    transporte: 'Transporte de Material',
    mobiliario: 'Aplicação de Mobiliário'
  };

  const filtered = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.client || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'security',
      description: '',
      client: '',
      location: '',
      date: new Date().toISOString().substring(0, 10),
      completionDate: '',
      servicesUsed: [''],
      beforeImage: '',
      afterImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
      images: [],
      videoLink: '',
      featured: false,
      seoTitle: '',
      seoDescription: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      client: project.client || '',
      location: project.location,
      date: project.date,
      completionDate: project.completionDate || '',
      servicesUsed: project.servicesUsed && project.servicesUsed.length > 0 ? [...project.servicesUsed] : [''],
      beforeImage: project.beforeImage || '',
      afterImage: project.afterImage,
      images: project.images || [],
      videoLink: project.videoLink || '',
      featured: project.featured || false,
      seoTitle: project.seoTitle || '',
      seoDescription: project.seoDescription || ''
    });
    setIsModalOpen(true);
  };

  // Modify dynamic nested service item
  const handleServiceChange = (idx: number, val: string) => {
    const servicesList = [...formData.servicesUsed];
    servicesList[idx] = val;
    setFormData({ ...formData, servicesUsed: servicesList });
  };

  const addServiceRow = () => {
    setFormData({ ...formData, servicesUsed: [...formData.servicesUsed, ''] });
  };

  const removeServiceRow = (idx: number) => {
    const servicesList = [...formData.servicesUsed];
    if (servicesList.length > 1) {
      servicesList.splice(idx, 1);
      setFormData({ ...formData, servicesUsed: servicesList });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim() || !formData.date.trim()) {
      alert('Preencha os campos de Título, Localização e Data.');
      return;
    }

    setSaving(true);
    try {
      const activeId = editingProject ? editingProject.id : 'proj_' + Math.random().toString(36).substr(2, 9);
      const cleanedServices = formData.servicesUsed.filter(s => s.trim() !== '');

      const payload: Project = {
        ...formData,
        id: activeId,
        servicesUsed: cleanedServices.length > 0 ? cleanedServices : ['Assessoria Mirca Especializada'],
        images: [formData.afterImage, ...(formData.beforeImage ? [formData.beforeImage] : [])]
      };

      await dbService.saveProject(payload);

      const action = editingProject ? 'editou' : 'postou';
      activityLogged(`O usuário ${action} o projeto de obra "${payload.title}" no portfólio.`, editingProject ? 'edit' : 'create');

      setIsModalOpen(false);
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (project: Project) => {
    setDeleteConfirmState({
      isOpen: true,
      project
    });
  };

  const executeDelete = async () => {
    const project = deleteConfirmState.project;
    if (!project) return;
    try {
      await dbService.deleteProject(project.id);
      activityLogged(`O usuário apagou o projeto "${project.title}" do portfólio.`, 'delete');
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, project: null });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Portfólio de Obras &amp; Projetos</h2>
          <p className="text-gray-500 text-xs">Exiba as transformações de antes/depois, obras de engenharia concluídas, automações ou marcenarias finalizadas</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Postar Novo Projeto
        </button>
      </div>

      {/* Advanced Filter and stats bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar por título, cliente, cidade..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>

        {/* Division select dropdown */}
        <div className="flex items-center gap-3">
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-150 py-1.5 px-3 rounded-xl text-xs font-semibold text-gray-750 focus:outline-none"
          >
            <option value="all">Todas as Divisões de Obra</option>
            <option value="security">Segurança Eletrónica</option>
            <option value="furniture">Mobiliário Planejado</option>
            <option value="informatica">Informática & Redes</option>
          </select>
          <span className="text-xs text-slate-400 font-semibold">{filtered.length} Projetos localizados</span>
        </div>

      </div>

      {/* Grid of Projects items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((p) => (
          <div 
            key={p.id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            
            {/* Project Image + cover badge overlay */}
            <div className="relative h-48 bg-slate-100">
              <img src={p.afterImage} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
              
              {/* Category tag */}
              <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold py-1 px-2.5 rounded-full uppercase tracking-wider">
                {categoryLabels[p.category] || p.category}
              </span>

              {p.featured && (
                <span className="absolute top-4 right-4 bg-[#FF6B00] text-white text-[10px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 shadow-md shadow-orange-600/20">
                  <Sparkles className="w-3.5 h-3.5" /> Destaque
                </span>
              )}
            </div>

            {/* Project description body */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="space-y-2">
                <h3 className="text-sm font-extrabold text-[#202A50]">{p.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed text-justify">{p.description}</p>
              </div>

              {/* Dynamic details icons */}
              <div className="grid grid-cols-2 gap-3 text-[11px] text-gray-500 font-medium py-3 border-y border-gray-50 bg-slate-50/50 -mx-6 px-6">
                <div className="flex items-center gap-1.5 truncate">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">Cliente: {p.client || 'Particular'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{p.location || 'Huambo'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span>{p.date}</span>
                </div>
                {p.beforeImage && (
                  <div className="flex items-center gap-1.5 text-orange-600 font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Antes/Depois Ativo</span>
                  </div>
                )}
              </div>

              {/* Action row controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-1.5 flex-wrap">
                  {p.servicesUsed.map((sUsed, sIdx) => (
                    <span key={sIdx} className="bg-slate-100 text-gray-650 text-[10px] py-0.5 px-2 rounded-md font-medium">
                      {sUsed}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-4">
                  <button 
                    onClick={() => openEditModal(p)}
                    className="p-1.5 bg-slate-50 text-gray-650 hover:text-orange-600 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(p)}
                    className="p-1.5 bg-slate-50 text-gray-650 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-12 text-gray-400 font-medium bg-white border border-gray-100 rounded-2xl italic text-xs">
            Nenhum projeto postado sob estes filtros no portfólio.
          </div>
        )}
      </div>

      {/* Complete modal for creating or editing projects */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Header */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingProject ? `Editar Obras: ${editingProject.title}` : 'Registrar Obra / Projeto Concluído'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título da Obra / Projeto <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Cozinha Moderna Residencial Jardim"
                  />
                </div>

                {/* Division tag */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Categoria Principal</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800 font-semibold"
                  >
                    <option value="security">Segurança Eletrónica</option>
                    <option value="furniture">Mobiliário Planejado</option>
                    <option value="informatica">Informática & Redes</option>
                  </select>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Localização / Província <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Cidade Alta, Huambo"
                  />
                </div>

                {/* Client name reference */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Cliente / Empresa Contratatante</label>
                  <input 
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Dr. Manuel Augusto ou Cliente Particular"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Data de Início do Serviço <span className="text-rose-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Outubro de 2025"
                  />
                </div>

                {/* completionDate */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Data de Entrega / Término</label>
                  <input 
                    type="text"
                    value={formData.completionDate}
                    onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="ex: Concluído em 5 semanas"
                  />
                </div>

              </div>

              {/* Description body context */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Contexto / Detalhes do Projeto <span className="text-rose-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="Descreva o escopo da obra, as dificuldades superadas pela MIRCA e o feedback gerado ao cliente"
                />
              </div>

              {/* Images uploads comparisons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-150/50">
                <ImageUpload 
                  value={formData.afterImage}
                  onChange={(url) => setFormData({ ...formData, afterImage: url })}
                  folder="projects"
                  label="Imagem do Depois (Concluído) *"
                  aspectRatio="aspect-video"
                />
                <ImageUpload 
                  value={formData.beforeImage || ''}
                  onChange={(url) => setFormData({ ...formData, beforeImage: url })}
                  folder="projects"
                  label="Imagem do Antes (Início - Opcional)"
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Video links & items */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Link de Vídeo do Projeto / Obra (YouTube / MP4)</label>
                <input 
                  type="url"
                  value={formData.videoLink}
                  onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>

              {/* servicesUsed dynamic additions */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Serviços e Atividades Utilizadas</label>
                  <button 
                    type="button"
                    onClick={addServiceRow}
                    className="text-[10px] text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5"
                  >
                    + Atividade
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {formData.servicesUsed.map((su, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        value={su}
                        onChange={(e) => handleServiceChange(idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        placeholder="ex: Pintura Naval ou Cerca Elétrica"
                      />
                      <button 
                        type="button"
                        onClick={() => removeServiceRow(idx)}
                        disabled={formData.servicesUsed.length <= 1}
                        className="px-2 bg-slate-50 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 rounded-lg text-xs"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* featured checkbox */}
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Colocar Projeto em Destaque
                  </h4>
                  <p className="text-[10px] text-gray-500">Ao habilitar, este projeto aparecerá no grid principal de apresentação do site corporativo publicamente.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.featured ? 'bg-[#FF6B00]' : 'bg-gray-300'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* SEO configuration for the project */}
              <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/50 grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-indigo-700 uppercase">SEO Meta Título</label>
                  <input 
                    type="text"
                    value={formData.seoTitle || ''}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full bg-white border border-indigo-100 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-400 text-[#000000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-indigo-700 uppercase">SEO Meta Descrição</label>
                  <input 
                    type="text"
                    value={formData.seoDescription || ''}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full bg-white border border-indigo-100 rounded-lg px-2.5 py-1 text-xs outline-none focus:ring-1 focus:ring-indigo-400 text-[#000000]"
                  />
                </div>
              </div>

              {/* Modal controls */}
              <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-150 flex items-center justify-end gap-3 z-10">
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

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Excluir Projeto"
        message={`Deseja realmente remover o projeto "${deleteConfirmState.project?.title}" do portfólio?`}
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmState({ isOpen: false, project: null })}
      />

    </div>
  );
}
