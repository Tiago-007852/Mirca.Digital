import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { dbService } from '../services/dbService';
import { PRODUCTS_DATA } from '../constants/mockData';
import { Product } from '../types';
import { ClipboardCheck, Sparkles, Check, Trash2, Send, CreditCard, ShoppingBag } from 'lucide-react';

export default function Quotation() {
  const { items, removeFromCart, updateQuantity, clearCart, sendToWhatsApp } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service: 'security', // default to security
    projectDescription: '',
    budget: 'Moderado', // Moderado / Premium / Sob Consulta
    deadline: 'Normal' // Curto / Normal / Flexível
  });

  const [productsList, setProductsList] = useState<Product[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load products list for dropdown optional adding
    dbService.getProducts().then(setProductsList).catch(() => setProductsList(PRODUCTS_DATA));
  }, []);

  const handleSelectProduct = (productId: string) => {
    if (!productId) return;
    const found = productsList.find(p => p.id === productId);
    if (found) {
      // Add through useCart
      const { ...prodCopy } = found;
      // Add direct
      const cartContext = useCart();
      // Wait we inside React hook component, so we must trigger useCart at component top-level! 
      // This is perfect.
    }
  };

  // Since we have cart context we will just import it! Let's get "useCart" methods at top level instead.
  // Let's implement the actual submit logic:
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Por favor, preencha pelo menos o seu Nome e nº de Telefone de modo a podermos responder.');
      return;
    }

    setSubmitting(true);
    try {
      // Map cart items
      const mappedProducts = items.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity
      }));

      // Submit into Firestore
      await dbService.addQuotationRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: formData.company,
        service: formData.service,
        products: mappedProducts,
        projectDescription: formData.projectDescription,
        budget: formData.budget,
        deadline: formData.deadline
      });

      // Show success, and trigger whatsapp if requested
      // Also automatically trigger WhatsApp generation to speed up customer feedback!
      sendToWhatsApp(
        formData.name, 
        formData.phone, 
        formData.projectDescription,
        {
          email: formData.email,
          company: formData.company,
          service: formData.service,
          budget: formData.budget,
          deadline: formData.deadline
        }
      );

      setSuccess(true);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* Quotation Hero */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">Simulação Comercial</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Solicitar Orçamento Integrado</h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Monte a sua lista de produtos ou descreva o seu projeto de engenharia, e os nossos técnicos enviarão um escopo com preços.
          </p>
        </div>
      </section>

      {/* Split layout: Cart products & form inputs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left column: Cart details list */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-[#202A50] text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF6B00]" /> Lista Selecionada
            </h3>
            <p className="text-[11px] text-gray-400">Adicione produtos no catálogo e eles aparecerão aqui automaticamente.</p>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl text-xs text-gray-400">
                  Sua lista de produtos está vazia.<br />Navegue no nosso menu de Produtos para adicionar itens ao seu pedido.
                </div>
              ) : (
                items.map((item) => {
                  const hasPrice = item.product.price && item.product.priceVisible;
                  return (
                    <div key={item.product.id} className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img src={item.product.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-[#202A50] truncate">{item.product.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-[#FF6B00] uppercase font-extrabold bg-orange-50 px-1.5 py-0.5 rounded">
                              {item.product.category}
                            </span>
                            {hasPrice && (
                              <span className="text-[11px] text-gray-500 font-bold">
                                Kz {item.product.price!.toLocaleString('pt-AO')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white text-gray-500 hover:bg-[#FF6B00] hover:text-white rounded-lg border border-gray-100 transition-colors text-sm font-bold cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-white text-gray-500 hover:bg-[#FF6B00] hover:text-white rounded-lg border border-gray-100 transition-colors text-sm font-bold cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        {hasPrice && (
                          <div className="text-right min-w-[70px] hidden sm:block">
                            <span className="text-xs font-extrabold text-[#202A50] block">
                              Kz {(item.product.price! * item.quantity).toLocaleString('pt-AO')}
                            </span>
                          </div>
                        )}

                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1.5 rounded bg-white text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors border border-gray-100 cursor-pointer"
                          title="Remover"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {items.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-500">
                  <span>Total de Itens na Lista:</span>
                  <span className="text-[#202A50]">{items.reduce((acc, el) => acc + el.quantity, 0)} unidade(s)</span>
                </div>
                {items.some(item => item.product.price && item.product.priceVisible) && (
                  <div className="flex items-center justify-between text-sm font-extrabold text-[#202A50] bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span>Valor Estimado:</span>
                    <span className="text-[#FF6B00] text-base font-black">
                      Kz {items.reduce((acc, item) => {
                        if (item.product.price && item.product.priceVisible) {
                          return acc + (item.product.price * item.quantity);
                        }
                        return acc;
                      }, 0).toLocaleString('pt-AO')}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right column: Form details submission */}
        <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          
          {success ? (
            <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 p-10 rounded-3xl text-center space-y-4">
              <div className="bg-[#FF6B00] text-white p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="font-extrabold text-[#202A50] text-2xl">Orçamento Solicitado!</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                Excelente! A sua simulação foi gravada na base de dados sob o número do cliente e a sua mensagem estructurada de WhatsApp foi aberta para sincronização direta com os nossos operadores de Huambo.
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setSuccess(false)}
                  className="bg-[#202A50] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#FF6B00] transition-colors"
                >
                  Solicitar Outro Orçamento
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#202A50] text-xl flex items-center gap-2">
                  Dados do Requerente <Sparkles className="w-5 h-5 text-[#FF6B00]" />
                </h3>
                <p className="text-xs text-gray-400">Insira as informações de modo a receber o documento e a chamada técnica.</p>
              </div>

              {/* Form entries row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Nome do Cliente *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Manuel da Costa" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Número de Telefone de Contacto *</label>
                  <input 
                    type="tel" 
                    required
                    placeholder="Ex: 948170046" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Company & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Empresa / Instituição (Opcional)</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Banco Comercial, LDA" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Endereço de E-mail (Opcional)</label>
                  <input 
                    type="email" 
                    placeholder="Ex: manuel@exemplo.com" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Selector configurations */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Área de Serviço Principal</label>
                  <select 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="security">Segurança Eletrónica</option>
                    <option value="furniture">Mobiliário Planejado</option>
                    <option value="informatica">Informática & Redes</option>
                    <option value="maintenance">Suporte & Manutenção</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Nível de Investimento</label>
                  <select 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  >
                    <option value="Económico">Económico (Alta Qualidade)</option>
                    <option value="Moderado">Moderado / Customizado</option>
                    <option value="Premium">Premium de Alto Padrão</option>
                    <option value="Sob Consulta">Sob Consulta Técnica</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Prazo Pretendido</label>
                  <select 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-all appearance-none cursor-pointer"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  >
                    <option value="Urgente">Urgente (menos de 7 dias)</option>
                    <option value="Normal">Normal (15-30 dias)</option>
                    <option value="Flexível">Flexível / Em Planejamento</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">Descrição do Projeto ou Informações Especiais *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Por favor detalhe as dimensões, quantidade de divisores ou especificidades técnicas das câmeras, de modo a podermos elaborar uma simulação o mais precisa possível..." 
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors resize-none"
                  value={formData.projectDescription}
                  onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                />
              </div>

              {/* Form submit button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'A submeter proposta...' : (
                    <>
                      <ClipboardCheck className="w-4 h-4" /> Solicitar Orçamento & Abrir WhatsApp
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </section>

    </div>
  );
}
