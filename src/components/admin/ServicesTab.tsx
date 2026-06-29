import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Camera, PenTool, Hammer, Paintbrush,
  Shield, Check, Search, X, Sparkles, PlusCircle, CheckCircle2, ChevronRight,
  Laptop, Zap
} from 'lucide-react';
import { ServiceItem } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';

interface ServicesTabProps {
  activityLogged: (details: string, action?: any) => void;
}

export default function ServicesTab({ activityLogged }: ServicesTabProps) {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Modals controllers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    service: ServiceItem | null;
  }>({ isOpen: false, service: null });

  // Form parameters
  const [formData, setFormData] = useState<ServiceItem>({
    id: '',
    title: '',
    tag: 'Segurança Eletrónica',
    description: '',
    benefits: [''],
    icon: 'Camera',
    displayOrder: 1,
    archived: false
  });

  // Allowed icons list
  const iconOptions = [
    { name: 'Camera', icon: Camera, label: 'Câmera/CCTV' },
    { name: 'PenTool', icon: PenTool, label: 'Marcenaria/Design' },
    { name: 'Laptop', icon: Laptop, label: 'Informática/Redes' },
    { name: 'Zap', icon: Zap, label: 'Eletricidade' },
    { name: 'Shield', icon: Shield, label: 'Cerca de Segurança' }
  ];

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await dbService.getServices();
      setServices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      id: 'srv_' + Math.random().toString(36).substr(2, 9),
      title: '',
      tag: 'Segurança Eletrónica',
      description: '',
      benefits: [''],
      icon: 'Camera',
      displayOrder: services.length + 1,
      archived: false
    });
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormData({
      ...service,
      benefits: service.benefits && service.benefits.length > 0 ? [...service.benefits] : ['']
    });
    setIsModalOpen(true);
  };

  // modify benefit row
  const handleBenefitChange = (idx: number, text: string) => {
    const list = [...formData.benefits];
    list[idx] = text;
    setFormData({ ...formData, benefits: list });
  };

  const addBenefitRow = () => {
    setFormData({ ...formData, benefits: [...formData.benefits, ''] });
  };

  const removeBenefitRow = (idx: number) => {
    const list = [...formData.benefits];
    if (list.length > 1) {
      list.splice(idx, 1);
      setFormData({ ...formData, benefits: list });
    }
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('Preencha os campos de Título e Descrição do serviço.');
      return;
    }

    setSaving(true);
    try {
      const cleanedBenefits = formData.benefits.filter(b => b.trim() !== '');
      const payload: ServiceItem = {
        ...formData,
        benefits: cleanedBenefits.length > 0 ? cleanedBenefits : ['Atendimento rápido e qualificado']
      };

      await dbService.saveService(payload);
      
      const verbs = editingService ? 'modificou o serviço' : 'adicionou o novo serviço';
      activityLogged(`O usuário ${verbs} de "${payload.title}" para o portfólio de atividades.`, editingService ? 'edit' : 'create');
      
      setIsModalOpen(false);
      await loadServices();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = (service: ServiceItem) => {
    setDeleteConfirmState({
      isOpen: true,
      service
    });
  };

  const executeDelete = async () => {
    const service = deleteConfirmState.service;
    if (!service) return;
    try {
      await dbService.deleteService(service.id);
      activityLogged(`O usuário apagou o serviço "${service.title}" das atividades operacionais.`, 'delete');
      await loadServices();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, service: null });
    }
  };

  const filtered = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Services Title and Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Serviços Institucionais</h2>
          <p className="text-gray-500 text-xs">Insira, publique, arquive e altere os pacotes de serviços oferecidos na matriz de soluções da empresa</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Adicionar Serviço
        </button>
      </div>

      {/* Inputs Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar serviços públicos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>
        <span className="text-[11px] text-gray-500 font-semibold">
          Gerenciando <strong>{services.length}</strong> serviços técnicos prestados
        </span>
      </div>

      {/* Services dynamic layout mapping */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {filtered.map((item) => {
          // Identify associated layout icon
          const AssociatedIcon = iconOptions.find(o => o.name === item.icon)?.icon || Camera;
          
          return (
            <div 
              key={item.id} 
              className={`bg-white rounded-2xl border ${item.archived ? 'border-dashed border-gray-200' : 'border-gray-100'} p-6 shadow-sm flex flex-col justify-between gap-5 relative group hover:shadow-md transition-shadow`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 bg-orange-50 text-[#FF6B00] rounded-xl group-hover:scale-105 transition-transform">
                    <AssociatedIcon className="w-5 h-5" />
                  </span>
                  
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    item.archived ? 'bg-zinc-100 text-zinc-600' : 'bg-[#FF6B00]/10 text-[#FF6B00]'
                  }`}>
                    {item.archived ? 'Arquivado' : item.tag}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-gray-900 group-hover:text-[#FF6B00] transition-colors">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed text-justify line-clamp-3">{item.description}</p>
                </div>

                {/* Benefits List */}
                {item.benefits && item.benefits.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vantagens / Benefícios</h4>
                    <ul className="space-y-1">
                      {item.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="text-xs text-gray-600 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Admin service actions */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono font-medium text-gray-400">prioridade: {item.displayOrder}</span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="p-1 px-3 bg-slate-50 text-gray-650 hover:text-orange-600 hover:bg-orange-50 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Edit className="w-3 h-3" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(item)}
                    className="p-1 bg-slate-50 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="lg:col-span-3 text-center py-12 text-gray-400 font-medium bg-white border border-gray-100 rounded-2xl italic text-xs">
            Nenhum serviço correspondente encontrado para seletor de filtros.
          </div>
        )}
      </div>

      {/* Service Edit / Create overlay model */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Modal Heading */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingService ? `Editar Serviço: ${editingService.title}` : 'Registrar Novo Serviço'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Título do Serviço <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: CCTV Avançado Integrado em Angola"
                />
              </div>

              {/* Tag / Sector selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Classificação Geral (Tag)</label>
                <select 
                  value={formData.tag}
                  onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-800 font-semibold"
                >
                  <option value="Segurança Eletrónica">Segurança Eletrónica</option>
                  <option value="Mobiliário Planejado">Mobiliário Planejado</option>
                  <option value="Informática">Informática & Redes</option>
                  <option value="Eletricidade">Eletricidade</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Icon option */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Ícone SVG</label>
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

                {/* Display Priority */}
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

              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Detalhes Técnicos / Corpo <span className="text-rose-500">*</span></label>
                <textarea 
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Oferecemos a concepção integral..."
                />
              </div>

              {/* Dynamic Benefits Bullet Points */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Benefícios do Serviço (Pontos)</label>
                  <button 
                    type="button"
                    onClick={addBenefitRow}
                    className="text-[10px] text-[#FF6B00] font-bold hover:underline flex items-center gap-0.5"
                  >
                    + Linha
                  </button>
                </div>
                
                <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                  {formData.benefits.map((ben, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input 
                        type="text"
                        value={ben}
                        onChange={(e) => handleBenefitChange(idx, e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        placeholder="ex: Centralização IP automatizada"
                      />
                      <button 
                        type="button"
                        onClick={() => removeBenefitRow(idx)}
                        disabled={formData.benefits.length <= 1}
                        className="px-2 bg-slate-50 text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 rounded-lg text-xs"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Archived Status */}
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-150/50 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Arquivar Serviço</h4>
                  <p className="text-[10px] text-gray-450">Serviços arquivados serão salvos nas base de dados mas não constarão na homepage.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, archived: !formData.archived })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.archived ? 'bg-orange-500' : 'bg-gray-300'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.archived ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Modal controls footer */}
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
                  {saving ? 'Gravando...' : 'Salvar Alterações'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Excluir Serviço"
        message={`Tem certeza que gostaria de excluir o serviço "${deleteConfirmState.service?.title}"?`}
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmState({ isOpen: false, service: null })}
      />

    </div>
  );
}
