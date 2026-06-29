import React, { useState } from 'react';
import { 
  ClipboardList, CheckCircle, XCircle, Clock, Search, Filter, 
  MessageSquare, User, Calendar, DollarSign, PenTool, Edit2, AlertCircle, Info, ChevronRight, X
} from 'lucide-react';
import { QuotationRequest } from '../../types';
import { dbService } from '../../services/dbService';

interface QuotationsTabProps {
  quotations: QuotationRequest[];
  onRefresh: () => Promise<void>;
  activityLogged: (details: string, action?: any) => void;
}

export default function QuotationsTab({ quotations, onRefresh, activityLogged }: QuotationsTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Detail sidebar state
  const [selectedQuote, setSelectedQuote] = useState<QuotationRequest | null>(null);
  
  // Edit states inside selected detail
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [budgetVal, setBudgetVal] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  // Filter list
  const filtered = quotations.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (q.company || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          q.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || (q.priority || 'medium') === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Open detailing card
  const handleSelectQuote = (q: QuotationRequest) => {
    setSelectedQuote(q);
    setNotes(q.notes || '');
    setPriority(q.priority || 'medium');
    setAssignedEmployee(q.assignedEmployee || '');
    setBudgetVal(q.budget || '');
  };

  // Quick state update
  const handleStatusChange = async (id: string, status: QuotationRequest['status']) => {
    try {
      await dbService.updateQuotationStatus(id, status);
      activityLogged(`Status do orçamento #${id.substring(6, 11)} alterado para "${status}".`, 'edit');
      
      // Update local detailed state if open
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote({ ...selectedQuote, status });
      }
      await onRefresh();
    } catch (e) {
      console.error(e);
    }
  };

  // Full Details Update (Priority, assignment, notes)
  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    setSavingNote(true);
    try {
      const updates: Partial<QuotationRequest> = {
        notes,
        priority,
        assignedEmployee,
        budget: budgetVal
      };

      await dbService.updateQuotationDetails(selectedQuote.id, updates);
      activityLogged(`Atualização de notas e atribuição do orçamento de "${selectedQuote.name}".`, 'edit');
      
      setSelectedQuote({
        ...selectedQuote,
        ...updates
      });
      alert('Sincronização com o Firestore concluída com sucesso!');
      await onRefresh();
    } catch (e) {
      console.error(e);
    } finally {
      setSavingNote(false);
    }
  };

  // Build clean preformed WhatsApp text
  const openWhatsAppContact = (q: QuotationRequest) => {
    const cleanPhone = q.phone.replace(/[^0-9]/g, '');
    const clientNumber = cleanPhone.startsWith('244') ? cleanPhone : `244${cleanPhone}`;
    const textMsg = encodeURIComponent(
      `Olá ${q.name}, aqui é da MIRCA LDA. Recebemos sua solicitação de orçamento pelo nosso aplicativo para o serviço de "${q.service}". Gostaríamos de conversar sobre os prazos e condições.`
    );
    window.open(`https://wa.me/${clientNumber}?text=${textMsg}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Tab Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">CRM &amp; Painel de Orçamentos</h2>
        <p className="text-gray-500 text-xs text-slate-400">Atenda chamados, atribua equipes de engenharia de campo, elabore faturas e ordene prioridades</p>
      </div>

      {/* CRM Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
        
        {/* Term filter */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input 
            type="text" 
            placeholder="Pesquisar cliente ou serviço..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-2 pl-9 pr-4 text-xs font-semibold focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
          />
        </div>

        {/* Status */}
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">Ver Todos os Status</option>
            <option value="pending">Aguardando Triagem</option>
            <option value="approved">Proposta Aprovada</option>
            <option value="completed">Resolvido / Finalizado</option>
            <option value="rejected">Negado / Recusado</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 py-2 px-3 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none"
          >
            <option value="all">Ver Todas as Prioridades</option>
            <option value="high">Urgência Alta</option>
            <option value="medium">Urgência Média</option>
            <option value="low">Urgência Baixa</option>
          </select>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-semibold">{filtered.length} Fichas de Atendimento</span>
        </div>

      </div>

      {/* Master Detail Split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Master Tickets List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[600px] overflow-y-auto">
          <div className="divide-y divide-gray-50">
            {filtered.map((quote) => {
              const displayPriority = quote.priority || 'medium';
              return (
                <div 
                  key={quote.id}
                  onClick={() => handleSelectQuote(quote)}
                  className={`p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 cursor-pointer transition-colors ${
                    selectedQuote?.id === quote.id ? 'bg-[#FF6B00]/5 border-l-4 border-[#FF6B00]' : ''
                  }`}
                >
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-sm text-[#202A50]">{quote.name}</h4>
                      {quote.company && (
                        <span className="text-[10px] bg-slate-100 text-slate-650 font-bold px-1.5 py-0.5 rounded">
                          {quote.company}
                        </span>
                      )}
                      
                      {/* Priority pill */}
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                        displayPriority === 'high' ? 'bg-red-50 text-red-600 border border-red-150' :
                        displayPriority === 'medium' ? 'bg-amber-50 text-amber-600 border border-amber-150' :
                        'bg-blue-50 text-blue-600 border border-blue-150'
                      }`}>
                        {displayPriority === 'high' ? 'Alta' : displayPriority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500 leading-normal line-clamp-1">
                      Serviço: <strong className="text-gray-700">{quote.service}</strong>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-gray-400">
                      <span>Prazo: {quote.deadline || 'Imediato'}</span>
                      <span>•</span>
                      <span>Orçamento: {quote.budget || 'Sob Consulta'}</span>
                    </div>
                  </div>

                  {/* Status column + WhatsApp redirects */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    
                    {/* Status Pill dropdown */}
                    <select 
                      value={quote.status}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleStatusChange(quote.id, e.target.value as any)}
                      className={`text-[11px] font-bold rounded-lg border px-2 py-1 focus:outline-none ${
                        quote.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                        quote.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-150' :
                        quote.status === 'rejected' ? 'bg-rose-50 text-rose-700 border-rose-150' :
                        'bg-amber-50 text-amber-700 border border-amber-150'
                      }`}
                    >
                      <option value="pending">Pendente</option>
                      <option value="approved">Aprovado</option>
                      <option value="completed">Resolvido</option>
                      <option value="rejected">Negado</option>
                    </select>

                    {/* WhatsApp Action */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        openWhatsAppContact(quote);
                      }}
                      className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-[#25D366] hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Chamar Cliente no WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>

                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-gray-450 italic text-xs">
                Nenhum pedido de orçamento pendente de triagem de acordo com os filtros.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Detailed interactive card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[480px]">
          {selectedQuote ? (
            <div className="space-y-5 flex flex-col justify-between h-full">
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono">Ficha #{selectedQuote.id.substring(6, 11)}</span>
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{selectedQuote.name}</h3>
                  </div>
                  <button 
                    onClick={() => setSelectedQuote(null)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Core request info details */}
                <div className="space-y-2 text-xs">
                  <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Especificações do Projeto</span>
                    <p className="text-gray-700 italic">"{selectedQuote.projectDescription}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] py-1">
                    <div>
                      <span className="text-gray-400 block">Email de Contato:</span>
                      <strong className="text-gray-800 break-words">{selectedQuote.email}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Contacto Móvel:</span>
                      <strong className="text-gray-800">{selectedQuote.phone}</strong>
                    </div>
                  </div>

                  {/* Render linked products from Cart if available */}
                  {selectedQuote.products && selectedQuote.products.length > 0 && (
                    <div className="border border-indigo-100/50 bg-indigo-50/20 p-3 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-bold text-indigo-800 uppercase flex items-center gap-1">Produtos Vinculados</span>
                      <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                        {selectedQuote.products.map((prod, pIdx) => (
                          <div key={pIdx} className="flex justify-between items-center text-[11px] text-[#202A50] font-medium leading-tight">
                            <span>• {prod.name}</span>
                            <span className="bg-indigo-100/60 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded font-mono font-extrabold">Qtd: {prod.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <hr className="border-gray-100" />

                {/* Assignment & Internal Management Fields */}
                <form onSubmit={handleSaveDetails} className="space-y-4">
                  
                  {/* Priority selector */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Prioridade Operacional</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        type="button"
                        onClick={() => setPriority('low')}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority === 'low' ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-50' : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'}`}
                      >
                        Baixa
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPriority('medium')}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority === 'medium' ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-50' : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'}`}
                      >
                        Média
                      </button>
                      <button 
                        type="button"
                        onClick={() => setPriority('high')}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${priority === 'high' ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-50' : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-650'}`}
                      >
                        Alta
                      </button>
                    </div>
                  </div>

                  {/* Pricing / Budget estimation */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Valor Orçado (Kwanza - AO)</label>
                    <div className="relative">
                      <DollarSign className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                      <input 
                        type="text"
                        value={budgetVal}
                        onChange={(e) => setBudgetVal(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl py-1.5 pl-7 pr-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] font-mono"
                        placeholder="ex: 1.250.000 AOA"
                      />
                    </div>
                  </div>

                  {/* Assignee employee field */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Funcionário Encarregue</label>
                    <input 
                      type="text"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      placeholder="ex: Engenheiro Carlos Costa"
                      value={assignedEmployee}
                      onChange={(e) => setAssignedEmployee(e.target.value)}
                    />
                  </div>

                  {/* Followup internal Notes */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Notas Internas de Acompanhamento</label>
                    <textarea 
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      placeholder="Anote detalhes de ligações, modificações no projeto de marcenaria ou visitas técnicas agendadas..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* Sync Submit */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      disabled={savingNote}
                      className="w-full bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white font-bold text-xs py-2 rounded-xl transition-colors shadow-md shadow-orange-500/10 cursor-pointer text-center"
                    >
                      {savingNote ? 'Guardando...' : 'Atualizar Ficha no Firestore'}
                    </button>
                  </div>

                </form>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 gap-3 border border-dashed border-gray-250 rounded-2xl bg-slate-50/50">
              <ClipboardList className="w-10 h-10 text-gray-300" />
              <div>
                <h4 className="font-semibold text-gray-800 text-xs">Aguardando Seleção</h4>
                <p className="text-[10px] max-w-xs mt-1">Selecione qualquer ficha de atendimento e orçamento na coluna à esquerda para analisar especificações e gerenciar a equipe de campo.</p>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
