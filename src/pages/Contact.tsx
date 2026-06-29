import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Check, Sparkles, Send } from 'lucide-react';
import { dbService } from '../services/dbService';
import { WebsiteContent } from '../types';

export default function Contact() {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dbService.getWebsiteContent();
        setContent(data);
      } catch (err) {
        console.error('Erro ao ler dados do CMS para Contactos', err);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Por favor preencha os campos obrigatórios (Nome, Telefone e Mensagem).');
      return;
    }
    setSubmitting(true);
    try {
      // Write message to DB under quotations
      await dbService.addQuotationRequest({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        company: 'Contacto Direto - ' + formData.subject,
        service: 'Contacto Direto',
        products: [],
        projectDescription: formData.message,
        budget: 'Sem Orçamento',
        deadline: 'Imediato'
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const cleanPhone = (content?.phone || '+244948170046').replace(/\s+/g, '');

  const contactInfos = [
    { 
      title: 'Telefone Principal', 
      desc: content?.phone || '+244 948170046', 
      icon: <Phone className="w-5 h-5 text-[#FF6B00]" />, 
      link: `tel:${cleanPhone}` 
    },
    { 
      title: 'WhatsApp Directo', 
      desc: content?.phone || '+244 948170046', 
      icon: <MessageSquare className="w-5 h-5 text-emerald-500" />, 
      link: `https://wa.me/${cleanPhone.replace('+', '')}` 
    },
    { 
      title: 'Correio Eletrónico', 
      desc: content?.email || 'mirca_prestacaodeservico@outlook.com', 
      icon: <Mail className="w-5 h-5 text-[#FF6B00]" />, 
      link: `mailto:${content?.email || 'mirca_prestacaodeservico@outlook.com'}` 
    },
    { 
      title: 'Escritório Geral', 
      desc: content?.address || 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola', 
      icon: <MapPin className="w-5 h-5 text-[#FF6B00]" /> 
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* Contact Header */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">
            {content?.contactHeroSubtitle || 'Fale Connosco'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            {content?.contactHeroTitle || 'Contacte os Nossos Escritórios'}
          </h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {content?.contactHeroDesc || 'Estamos prontos para elaborar orçamentos e agendar vistorias gratuitas à sua residência, loja ou indústria.'}
          </p>
        </div>
      </section>

      {/* Main Details and Form Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left column: Contact Info Details & business hours */}
        <div className="space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
              {content?.contactIntroSubtitle || 'Atendimento Dedicado'}
            </span>
            <h2 className="text-3xl font-extrabold text-[#202A50] tracking-tight">
              {content?.contactIntroTitle || 'Canais de Ajuda Rápida'}
            </h2>
            <p className="text-xs text-gray-500 max-w-md leading-relaxed">
              {content?.contactIntroDesc || 'Damos preferência aos contactos de WhatsApp para cotações instantâneas de alarmes e orçamentos, mas respondemos a mails em até 24 horas úteis.'}
            </p>
          </div>

          <div className="space-y-6">
            {contactInfos.map((info) => (
              <div key={info.title} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm animate-fade-in">
                <div className="bg-gray-50 p-3.5 rounded-xl h-fit">
                  {info.icon}
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-widest">{info.title}</h4>
                  {info.link ? (
                    <a href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-bold text-sm text-[#202A50] hover:text-[#FF6B00] transition-colors break-all">
                      {info.desc}
                    </a>
                  ) : (
                    <span className="font-bold text-sm text-[#202A50] break-all">{info.desc}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100/80 flex items-center gap-4">
            <Clock className="w-6 h-6 text-[#FF6B00]" />
            <div>
              <span className="font-bold text-xs text-[#202A50] block">Horário de Operação</span>
              <span className="text-xs text-gray-500">
                {content?.contactWorkingHours || 'Segunda a Sábado: 08:00h - 18:00h | Domingo: Encerrado'}
              </span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive contact submission form */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-extrabold text-[#202A50] text-xl flex items-center gap-2">
              Mensagem Directa <Sparkles className="w-5 h-5 text-[#FF6B00]" />
            </h3>
            <p className="text-xs text-gray-400">Preencha o formulário abaixo e receba retorno da administração da MIRCA.</p>
          </div>

          {success ? (
            <div className="bg-orange-50/50 border border-[#FF6B00]/20 p-8 rounded-2xl text-center space-y-4">
              <div className="bg-[#FF6B00] text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-[#202A50] text-lg">Mensagem Enviada!</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Agradecemos o seu contacto. Um dos técnicos comerciais da MIRCA irá analisar os seus dados e responder via telefone ou e-mail o mais rápido possível.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-[#FF6B00] text-xs font-bold hover:underline"
              >
                Enviar nova mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Nome Completo *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Mateus da Silva" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Número de Telefone *</label>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">E-mail para contacto (Opcional)</label>
                  <input 
                    type="email" 
                    placeholder="Ex: mateus@exemplo.com" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400 block">Assunto de interesse</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Orçamento de Câmeras" 
                    className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400 block">Mensagem ou Detalhes da Solicitação *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Escreva aqui detalhes sobre o serviço de engenharia, marcenaria ou segurança que gostaria de solicitar..." 
                  className="w-full text-xs font-semibold px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/50 outline-none focus:border-[#FF6B00] focus:bg-white transition-colors resize-none"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#FF6B00] hover:bg-[#202A50] text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? 'A Enviar Mensagem...' : (
                    <>
                      <Send className="w-4 h-4" /> Enviar Mensagem Directa
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </section>

      {/* Embedded Map mockup illustrating absolute professionalism */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden border border-gray-100 h-96 relative shadow-lg">
          <div className="absolute inset-0 bg-[#0F172A] text-white flex flex-col justify-between p-8 sm:p-12">
            <div className="space-y-2">
              <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase">Escritório Central MIRCA</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Estamos no Coração de Huambo</h3>
              <p className="text-xs text-gray-400 max-w-md">
                Localizado na {content?.address || 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola'}. Encontre-nos facilmente.
              </p>
            </div>

            <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-gray-300">
                <span className="font-semibold text-white block">Endereço Postal</span>
                {content?.address || 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola'}
              </div>
              <a 
                href={`https://maps.google.com/?q=${encodeURIComponent(content?.address || 'Cidade Alta, Edifício dos Correios, Huambo, Angola')}`} 
                target="_blank" 
                rel="noreferrer"
                className="bg-[#FF6B00] hover:bg-white hover:text-[#202A50] text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors shrink-0 text-center"
              >
                Abrir direções no Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
