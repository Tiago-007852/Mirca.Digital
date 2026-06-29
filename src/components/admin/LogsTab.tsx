import React, { useState } from 'react';
import { 
  History, Search, Trash2, AlertTriangle, Key, Edit, Plus, User
} from 'lucide-react';
import { ActivityLog } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';

interface LogsTabProps {
  logs: ActivityLog[];
  onRefresh: () => Promise<void>;
  activityLogged: (details: string, action?: any) => void;
}

export default function LogsTab({ logs, onRefresh, activityLogged }: LogsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');

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

  // Filter logs safely
  const filtered = logs.filter(log => {
    const detailsMatch = (log.details || '').toLowerCase().includes(searchTerm.toLowerCase());
    const operatorMatch = (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = detailsMatch || operatorMatch;
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleClearLogs = () => {
    setConfirmState({
      isOpen: true,
      title: 'Expurgar Logs Administrativos',
      message: 'Atenção: Tem certeza de que deseja expurgar a visualização dos logs administrativos? Esta ação registrará um log de sistema com carimbo permanente.',
      type: 'danger',
      showCancel: true,
      onConfirm: async () => {
        try {
          await dbService.addActivityLog({
            action: 'delete',
            details: 'O operador limpou localmente/expurgou a visualização do painel de monitoramento de logs.',
            user: 'Super-Administrador',
            role: 'admin'
          });
          activityLogged('O usuário expurgou a tela e recalculou os logs de auditoria.', 'delete');
          await onRefresh();
          setConfirmState({
            isOpen: true,
            title: 'Logs Expurgados',
            message: 'Tabela de controle limpa com sucesso.',
            type: 'success',
            showCancel: false,
            onConfirm: () => setConfirmState(prev => ({ ...prev, isOpen: false }))
          });
        } catch (e) {
          console.error(e);
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Logs de Atividades &amp; Auditoria</h2>
          <p className="text-gray-500 text-xs text-slate-400 font-medium">Monitore a linha do tempo de manipulações no banco por operadores com registro de selos de carimbos de data/hora</p>
        </div>
        
        <button 
          onClick={handleClearLogs}
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-semibold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Limpar Histórico de Visualização
        </button>
      </div>

      {/* Inputs Filter dashboard */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar por operador ou descrição..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-lg text-xs font-semibold text-gray-700 cursor-pointer"
          >
            <option value="all">Todas as Ações</option>
            <option value="login">Sessões (Login)</option>
            <option value="create">Criação (Create)</option>
            <option value="edit">Modificação (Edit)</option>
            <option value="delete">Remoções (Delete)</option>
            <option value="restore">Restaurações (Restore)</option>
          </select>
          <span className="text-xs text-slate-400 font-bold">{filtered.length} Atividades Registradas</span>
        </div>

      </div>

      {/* Logs timeline list */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm max-h-[500px] overflow-y-auto">
        <div className="relative pl-6 border-l border-gray-100 space-y-6 py-2">
          {filtered.map((log) => {
            const dateStr = log.timestamp ? new Date(log.timestamp).toLocaleString('pt-AO') : 'Recente';
            
            return (
              <div key={log.id} className="relative group">
                
                {/* Timeline node */}
                <span className={`absolute -left-[30px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${
                  log.action === 'delete' ? 'bg-rose-500' :
                  log.action === 'create' ? 'bg-emerald-500' :
                  log.action === 'edit' ? 'bg-blue-500' :
                  log.action === 'login' ? 'bg-amber-500' : 'bg-gray-500'
                }`} />

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <strong className="text-gray-800 font-extrabold">{log.user || 'Desconhecido'}</strong>
                    
                    <span className="text-[#A3A6B4] text-[9.5px] uppercase font-bold font-mono">({log.role})</span>

                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                      log.action === 'delete' ? 'bg-rose-100 text-rose-800' :
                      log.action === 'create' ? 'bg-emerald-100 text-emerald-800' :
                      log.action === 'edit' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'login' ? 'bg-amber-100 text-amber-805' : 'bg-zinc-100 text-zinc-650'
                    }`}>
                      {log.action}
                    </span>

                    <span className="text-[10px] text-gray-400 font-mono ml-auto">{dateStr}</span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-semibold">{log.details}</p>
                </div>

              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="py-12 text-center text-gray-450 italic text-xs border border-dashed border-gray-100 rounded-2xl bg-slate-50/50">
              Histórico de auditoria vazio para os filtros selecionados.
            </div>
          )}
        </div>
      </div>

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
