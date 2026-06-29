import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Trash2, Search, CheckCircle, XCircle, Clock,
  MessageSquare, User, Calendar, ExternalLink, ChevronRight, X
} from 'lucide-react';
import { ShoppingRequest } from '../../types';
import { dbService } from '../../services/dbService';
import ConfirmDialog from './ConfirmDialog';

interface ShoppingTabProps {
  activityLogged: (details: string, action?: any) => void;
}

export default function ShoppingTab({ activityLogged }: ShoppingTabProps) {
  const [requests, setRequests] = useState<ShoppingRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  // Delete confirm modal state
  const [deleteConfirmState, setDeleteConfirmState] = useState<{
    isOpen: boolean;
    request: ShoppingRequest | null;
  }>({ isOpen: false, request: null });

  // Load orders
  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await dbService.getShoppingRequests();
      setRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // Update Status
  const handleStatusChange = async (id: string, status: ShoppingRequest['status']) => {
    try {
      await dbService.updateShoppingStatus(id, status);
      activityLogged(`Status do pedido #${id.substring(5, 10)} colocado em "${status}".`, 'edit');
      await loadRequests();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete Shopping Request
  const handleDelete = (req: ShoppingRequest) => {
    setDeleteConfirmState({
      isOpen: true,
      request: req
    });
  };

  const executeDelete = async () => {
    const req = deleteConfirmState.request;
    if (!req) return;
    try {
      await dbService.deleteShoppingRequest(req.id);
      activityLogged(`Ficha de pedido de "${req.customerName}" removida do histórico.`, 'delete');
      await loadRequests();
    } catch (e) {
      console.error(e);
    } finally {
      setDeleteConfirmState({ isOpen: false, request: null });
    }
  };

  // Direct contact
  const handleDirectWhatsApp = (req: ShoppingRequest) => {
    const cleanPhone = req.phone.replace(/[^0-9]/g, '');
    const clientNumber = cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`;
    const textMsg = encodeURIComponent(req.generatedMessage || `Olá ${req.customerName}, recebemos o seu pedido na loja MIRCA.`);
    window.open(`https://wa.me/${clientNumber}?text=${textMsg}`, '_blank');
  };

  const filtered = requests.filter(r => {
    const matchesSearch = r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Solicitações de Compra (Carrinho)</h2>
        <p className="text-gray-500 text-xs text-slate-400">Gerencie os pedidos de equipamentos recebidos diretamente das sacolas de orçamento do catálogo online</p>
      </div>

      {/* Input panel filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar por cliente ou telefone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 py-1.5 px-3 rounded-lg text-xs font-semibold text-gray-700"
          >
            <option value="all">Ver Todos os Status</option>
            <option value="pending">Aguardando Contato (Pendente)</option>
            <option value="contacted">Cliente Contactado</option>
            <option value="completed">Venda Concluída</option>
            <option value="cancelled">Cancelado</option>
          </select>
          <span className="text-xs text-slate-400 font-semibold">{filtered.length} Fichas de Carrinho</span>
        </div>

      </div>

      {/* Grid mapping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4 hover:shadow-md transition-shadow"
          >
            
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                    <ShoppingBag className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm text-[#202A50]">{item.customerName}</h3>
                    <span className="text-[9px] font-mono text-gray-400">ID: {item.id.substring(5, 12)}</span>
                  </div>
                </div>

                {/* Status Switcher pill */}
                <select 
                  value={item.status}
                  onChange={(e) => handleStatusChange(item.id, e.target.value as any)}
                  className={`text-[10px] font-bold border rounded-lg px-2 py-0.5 focus:outline-none ${
                    item.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                    item.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                    item.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-150' :
                    'bg-amber-50 text-amber-700 border-amber-150'
                  }`}
                >
                  <option value="pending">Pendente</option>
                  <option value="contacted">Contactado</option>
                  <option value="completed">Concluído</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              {/* Dynamic products list inside */}
              <div className="bg-slate-50 p-3 rounded-xl border border-gray-150/40 space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 tracking-wider block uppercase">Produtos na Sacola ({item.products.reduce((acc, curr) => acc + curr.quantity, 0)} itens):</span>
                <div className="divide-y divide-gray-100 max-h-[100px] overflow-y-auto">
                  {item.products.map((prod, pIdx) => (
                    <div key={pIdx} className="py-1.5 flex justify-between text-xs text-gray-700">
                      <span className="font-medium shrink-0 truncate max-w-[200px]">{prod.name}</span>
                      <span className="font-mono text-gray-400 text-right">x{prod.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timestamp operational details */}
              <div className="flex items-center gap-4 text-[10px] text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(item.timestamp).toLocaleString('pt-AO')}</span>
                <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {item.phone}</span>
              </div>

              {/* preformed message preview text */}
              <div className="text-[11px] text-gray-500 bg-emerald-50/20 border border-emerald-100/35 p-2.5 rounded-xl italic">
                "{item.generatedMessage}"
              </div>
            </div>

            {/* Actions button footer */}
            <div className="pt-3 border-t border-gray-50 flex items-center justify-between">
              
              <button 
                onClick={() => handleDirectWhatsApp(item)}
                className="bg-emerald-600 hover:bg-[#25D366] text-white font-semibold text-xs py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chamar WhatsApp
              </button>

              <button 
                onClick={() => handleDelete(item)}
                className="p-1 px-3 bg-slate-50 text-gray-500 hover:text-red-500 hover:bg-red-50 text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remover
              </button>

            </div>

          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-2 text-center py-12 text-gray-400 font-medium bg-white border border-gray-100 rounded-2xl italic text-xs">
            Nenhuma solicitação de compra por sacola identificada no momento.
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirmState.isOpen}
        title="Remover Ficha de Pedido"
        message={`Remover permanentemente a ficha de pedido de "${deleteConfirmState.request?.customerName}"?`}
        confirmText="Confirmar Exclusão"
        cancelText="Cancelar"
        type="danger"
        onConfirm={executeDelete}
        onCancel={() => setDeleteConfirmState({ isOpen: false, request: null })}
      />

    </div>
  );
}
