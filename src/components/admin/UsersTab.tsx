import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit, Trash2, Search, X, Sparkles, Key, 
  ShieldAlert, UserCheck, Shield, CheckCircle, Info, Lock
} from 'lucide-react';
import { UserProfile } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';

interface UsersTabProps {
  activityLogged: (details: string, action?: any) => void;
  currentUser: UserProfile | null;
}

export default function UsersTab({ activityLogged, currentUser }: UsersTabProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal active
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Custom alert/confirm modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'success';
    showCancel: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    showCancel: true,
    onConfirm: () => {}
  });

  // Form states
  const [formData, setFormData] = useState<Omit<UserProfile, 'uid'>>({
    email: '',
    name: '',
    phone: '',
    photo: '',
    role: 'employee',
    status: 'active',
    permissions: ['read_catalog', 'manage_quotes', 'manage_shopping'],
    lastLogin: '',
    createdAt: ''
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await dbService.getUserProfiles();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      email: '',
      name: '',
      phone: '',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      role: 'employee',
      status: 'active',
      permissions: ['read_catalog', 'manage_quotes', 'manage_shopping'],
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString()
    });
    setIsModalOpen(true);
  };

  const openEditModal = (usr: UserProfile) => {
    setEditingUser(usr);
    setFormData({
      email: usr.email,
      name: usr.name,
      phone: usr.phone || '',
      photo: usr.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      role: usr.role,
      status: usr.status || 'active',
      permissions: usr.permissions || ['read_catalog'],
      lastLogin: usr.lastLogin || '',
      createdAt: usr.createdAt || ''
    });
    setIsModalOpen(true);
  };

  const handlePermissionToggle = (permKey: string) => {
    const list = [...formData.permissions!];
    const idx = list.indexOf(permKey);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(permKey);
    }
    setFormData({ ...formData, permissions: list });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const activeUid = editingUser ? editingUser.uid : 'usr_' + Math.random().toString(36).substr(2, 9);
      const payload: UserProfile = {
        ...formData,
        uid: activeUid,
        updatedAt: new Date().toISOString()
      };

      await dbService.saveUserProfile(payload);
      
      const actions = editingUser ? 'modificou cargo e permissões' : 'cadastrou novo colega';
      activityLogged(`O usuário ${actions} de "${payload.name}" na equipe administrativa.`, editingUser ? 'edit' : 'create');

      setIsModalOpen(false);
      await loadUsers();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (usr: UserProfile) => {
    if (currentUser?.uid === usr.uid) {
      setConfirmState({
        isOpen: true,
        title: 'Ação Não Permitida',
        message: 'Você não tem permissão para remover seu próprio cadastro logado do servidor.',
        type: 'danger',
        showCancel: false,
        onConfirm: () => setConfirmState(prev => ({ ...prev, isOpen: false }))
      });
      return;
    }
    setConfirmState({
      isOpen: true,
      title: 'Remover Funcionário',
      message: `Remover definitivamente o funcionário "${usr.name}"? Ele perderá acesso imediato.`,
      type: 'danger',
      showCancel: true,
      onConfirm: async () => {
        try {
          await dbService.deleteUserProfile(usr.uid);
          activityLogged(`O usuário apagou o cadastro administrativo de "${usr.name}".`, 'delete');
          await loadUsers();
        } catch (e) {
          console.error(e);
        } finally {
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Portaria de Funcionários &amp; Equipe</h2>
          <p className="text-gray-500 text-xs">Atribua cargos de Administrador e Consultor Técnico. Gerencie privilégios granulares de atendimento ao cliente</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-orange-500/10 shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Registrar Funcionário
        </button>
      </div>

      {/* Filter panel */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar funcionário..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">Total equipe cadastrada: {users.length} colegas</span>
      </div>

      {/* Grid listing mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((usr) => {
          const isMe = currentUser?.uid === usr.uid;
          const displayStatus = usr.status || 'active';
          
          return (
            <div 
              key={usr.uid}
              className={`bg-white rounded-2xl border ${displayStatus === 'inactive' ? 'border-dashed border-red-200 bg-red-50/10' : 'border-gray-100'} p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between`}
            >
              
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={usr.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                      className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100 shadow-sm"
                      alt=""
                    />
                    <div className="leading-snug">
                      <h4 className="font-extrabold text-sm text-[#202A50] flex items-center gap-1.5">
                        {usr.name}
                        {isMe && <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.2 rounded">Você</span>}
                      </h4>
                      <p className="text-[11px] text-gray-400">{usr.email}</p>
                    </div>
                  </div>

                  {/* Status pill */}
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    displayStatus === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-150' : 'bg-rose-50 text-rose-700 border border-rose-150'
                  }`}>
                    {displayStatus === 'active' ? 'Ativo' : 'Bloqueado'}
                  </span>
                </div>

                {/* Permissions details review */}
                <div className="space-y-1.5 p-3 rounded-xl bg-slate-50 border border-gray-150/50">
                  <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wide">Função &amp; Licenças: {usr.role.toUpperCase()}</span>
                  
                  <div className="flex flex-wrap gap-1.5">
                    {usr.permissions && usr.permissions.map((perm, pIdx) => (
                      <span key={pIdx} className="bg-white border border-gray-100 text-gray-700 text-[10px] py-0.5 px-2 rounded-md font-semibold flex items-center gap-1 shadow-sm">
                        <CheckCircle className="w-3 h-3 text-emerald-500" /> {perm.replace('_', ' ')}
                      </span>
                    ))}
                    {(!usr.permissions || usr.permissions.length === 0) && (
                      <span className="text-[10px] text-zinc-400 italic">Nenhum privilégio especial cadastrado.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions controls footer */}
              <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-4">
                <span className="text-[10px] text-gray-400">Logado em: {usr.lastLogin ? new Date(usr.lastLogin).toLocaleDateString('pt-AO') : 'Nunca'}</span>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => openEditModal(usr)}
                    className="p-1 px-3.5 bg-slate-50 text-gray-650 hover:text-[#FF6B00] hover:bg-orange-50 font-semibold text-xs rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Editar
                  </button>
                  <button 
                    onClick={() => handleDelete(usr)}
                    disabled={isMe}
                    className="p-1 bg-slate-50 text-gray-650 hover:text-red-650 hover:bg-red-50 disabled:opacity-30 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-16 text-gray-450 italic text-xs">
            Nenhum colega de equipe encontrado para o termo pesquisado.
          </div>
        )}
      </div>

      {/* Overlay Modal for Adding / Editing staff */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            
            {/* Heading */}
            <div className="sticky top-0 bg-white p-5 border-b border-gray-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="font-bold text-gray-900 text-sm">
                  {editingUser ? `Editar Funcionário: ${editingUser.name}` : 'Cadastrar Funcionário'}
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Form list body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome Completo <span className="text-rose-500">*</span></label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="ex: Carlos Alberto Costa"
                />
              </div>

              {/* Email login address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">E-mail Corporativo <span className="text-rose-500">*</span></label>
                <input 
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="carlos@mirca.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                {/* Phone contact */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Telemóvel</label>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="+244 9..."
                  />
                </div>

                {/* Profile photo option */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Avatar Photo URL</label>
                  <input 
                    type="url"
                    value={formData.photo}
                    onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

              </div>

              {/* Hierarchy cargo classification */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Hierarquia (Cargo)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'employee' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${formData.role === 'employee' ? 'bg-orange-50 border-orange-200 text-[#FF6B00]' : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'}`}
                  >
                    Consultor (Funcionário)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${formData.role === 'admin' ? 'bg-indigo-50 border-indigo-250 text-indigo-700' : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'}`}
                  >
                    Super-Administrador
                  </button>
                </div>
              </div>

              {/* Granular security permissions switches */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Licenças e Privilégios Granulares</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-gray-150/50 rounded-xl">
                  {[
                    { key: 'read_catalog', label: 'Ver Catálogo' },
                    { key: 'manage_quotes', label: 'Atender Orçamentos' },
                    { key: 'manage_shopping', label: 'Filar Pedidos Carrinho' },
                    { key: 'administer_cms', label: 'Modificar Textos CMS' },
                    { key: 'manage_users', label: 'Controle Equipe' }
                  ].map((perm) => {
                    const hasP = formData.permissions!.includes(perm.key);
                    return (
                      <label key={perm.key} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer select-none font-medium">
                        <input 
                          type="checkbox"
                          checked={hasP}
                          onChange={() => handlePermissionToggle(perm.key)}
                          className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        {perm.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Inactivation Toggle */}
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-150 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-800">Liberar Acesso</h4>
                  <p className="text-[10px] text-gray-450">Ao suspender, o funcionário será banido imediatamente sem excluir o histórico.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, status: formData.status === 'active' ? 'inactive' : 'active' })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                >
                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.status === 'active' ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Footer controls */}
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
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Confirmar"
        cancelText="Voltar"
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
