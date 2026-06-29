import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Target, Eye, Award, CheckCircle2, Building, Calendar, MapPin } from 'lucide-react';
import { dbService } from '../services/dbService';
import { WebsiteContent } from '../types';

export default function About() {
  const [content, setContent] = useState<WebsiteContent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dbService.getWebsiteContent();
        setContent(data);
      } catch (err) {
        console.error('Erro ao ler conteúdos do CMS', err);
      }
    };
    loadData();
  }, []);

  const timeline = [
    { 
      year: content?.timeline1Year || '2021', 
      title: content?.timeline1Title || 'Fundação da MIRCA no Huambo', 
      desc: content?.timeline1Desc || 'A MIRCA iniciou suas atividades com foco em instalações hidráulicas e infraestrutura civil e rede de segurança fundamental.' 
    },
    { 
      year: content?.timeline2Year || '2022', 
      title: content?.timeline2Title || 'Abertura do Atelier de Marcenaria', 
      desc: content?.timeline2Desc || 'Expandimos nossos serviços criando uma divisão dedicada ao mobiliário planejado e projetos customizados em 3D.' 
    },
    { 
      year: content?.timeline3Year || '2023', 
      title: content?.timeline3Title || 'Parcerias Internacionais', 
      desc: content?.timeline3Desc || 'Consolidação de parcerias técnicas com marcas de renome de segurança eletrónica como Hikvision, Yale e Ajax Systems.' 
    },
    { 
      year: content?.timeline4Year || '2025', 
      title: content?.timeline4Title || 'Liderança no Setor Regional', 
      desc: content?.timeline4Desc || 'Consolidação como uma das referências principais de soluções estruturais integradas na província do Huambo.' 
    }
  ];

  const coreValues = [
    { 
      title: content?.diff1Title || 'Qualidade Extrema', 
      desc: content?.diff1Desc || 'Seleção minuciosa de madeira naval certificada e hardware de topo europeu.' 
    },
    { 
      title: content?.diff2Title || 'Tecnologia Conectada', 
      desc: content?.diff2Desc || 'Alarmes e CCTV perfeitamente integrados com interfaces móveis robustas.' 
    },
    { 
      title: content?.diff3Title || 'Sustentabilidade', 
      desc: content?.diff3Desc || 'Gerenciamento inteligente de resíduos de obras e uso de tintas ecológicas.' 
    },
    { 
      title: content?.diff4Title || 'Compromisso com o Cliente', 
      desc: content?.diff4Desc || 'Atendimento corporativo e residencial prestativo, do projeto à assistência pós-entrega.' 
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* HERO BANNER SECTION */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">
            {content?.aboutHeroSubtitle || 'Sobre a MIRCA'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {content?.aboutHeroTitle || 'Nossa História, Valores e Compromisso'}
          </h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {content?.aboutHeroDesc || 'Conheça mais sobre a trajetória da MIRCA LDA e as metas que pautam nossa entrega no mercado angolano.'}
          </p>
        </div>
      </section>

      {/* DETAILED COMPANY STORY & LEADERSHIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img 
            src={content?.aboutStoryImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'} 
            className="rounded-2xl shadow-xl object-cover h-[450px] w-full"
            alt="MIRCA Showroom" 
          />
          <div className="absolute -bottom-6 -right-6 bg-[#202A50] text-[#FF6B00] p-6 rounded-2xl shadow-xl hidden sm:block border-l-4 border-[#FF6B00]">
            <span className="text-3xl font-extrabold block">
              {content?.aboutYearsText || '5+ Anos'}
            </span>
            <span className="text-[10px] uppercase font-bold text-white tracking-widest block">
              {content?.aboutYearsSub || 'No Coração de Huambo'}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
            {content?.aboutStorySubtitle || 'Soluções Corporativas'}
          </span>
          <h2 className="text-3xl font-extrabold text-[#202A50] tracking-tight">
            {content?.aboutStoryTitle || 'Comprometimento com Engenharia e Design de Alto Nível'}
          </h2>
          
          <p className="text-sm text-gray-500 leading-relaxed">
            {content?.aboutStoryText1 || 'A MIRCA – Comércio e Prestação de Serviços, LDA foi fundada em 2021 com foco ambicioso: suprir a necessidade de integrações técnicas refinadas na província do Huambo e províncias vizinhas.'}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {content?.aboutStoryText2 || 'Entendemos que uma residência ou escritório necessita de segurança absoluta de dados eletrónicos e monitoramento, mas também de harmonia estética e móveis práticos. Unificamos essas três forças (Construção, Marcenaria e Segurança) num único parceiro de confiança absoluta, reduzindo cansaço mecânico de múltiplos fornecedores.'}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-6">
            <div className="flex gap-3">
              <div className="text-[#FF6B00] mt-1"><Building className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-sm text-[#202A50]">Escritório Próprio</h4>
                <p className="text-[11px] text-gray-500">
                  {content?.address || 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="text-[#FF6B00] mt-1"><MapPin className="w-5 h-5" /></div>
              <div>
                <h4 className="font-bold text-sm text-[#202A50]">Atendimento Integral</h4>
                <p className="text-[11px] text-gray-500">Cobertura técnica ao domicílio e consultorias rápidas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VISION AND MISSION FOR INSTITUTION */}
      <section className="bg-gray-50 border-y border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-[#202A50]/5 p-3 rounded-xl w-fit">
              <Target className="w-6 h-6 text-[#202A50]" />
            </div>
            <h3 className="font-extrabold text-xl text-[#202A50]">Nossa Missão</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {content?.mission || 'Prover inovação, durabilidade extrema e proteção insustentável ao património dos nossos clientes através de engenharia ética e artesanato refinado.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-[#FF6B00]/5 p-3 rounded-xl w-fit">
              <Eye className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <h3 className="font-extrabold text-xl text-[#202A50]">Nossa Visão</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {content?.vision || 'Ser a empresa líder indiscutível de soluções integradas de infraestrutura residencial e corporativa em Angola até 2030.'}
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div className="bg-[#202A50]/5 p-3 rounded-xl w-fit">
              <Award className="w-6 h-6 text-[#202A50]" />
            </div>
            <h3 className="font-extrabold text-xl text-[#202A50]">Nossos Pilares</h3>
            <div className="flex flex-wrap gap-1.5">
              {(content?.values && content.values.length > 0 ? content.values : ['Profissionalismo Estrito', 'Proteção e Confiabilidade', 'Inovação Tecnológica', 'Acabamento Sem Gaps']).map((val, i) => (
                <span key={i} className="bg-slate-50 text-[#202A50] text-[10px] font-extrabold px-2.5 py-1 rounded border border-gray-100">
                  {val}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* TIMELINE SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase">Nossa Jornada</h2>
          <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">Histórico de Conquistas</p>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
        </div>

        <div className="relative border-l border-gray-200 ml-4 md:ml-32 space-y-12">
          {timeline.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-12">
              {/* Year badge side aligned */}
              <div className="absolute -left-3 md:-left-24 top-0 bg-[#FF6B00] text-white text-xs font-bold py-1 px-3.5 rounded-full md:text-center shadow-sm w-fit">
                {item.year}
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                <h4 className="font-extrabold text-base text-[#202A50] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CORE DIFFERENTIALS */}
      <section className="bg-gray-50 py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase">Garantias MIRCA</h2>
            <p className="text-3xl font-extrabold text-[#202A50] tracking-tight">O Que Nos Torna Diferentes</p>
            <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((val) => (
              <div key={val.title} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                <div className="text-[#FF6B00]"><CheckCircle2 className="w-5 h-5" /></div>
                <h4 className="font-bold text-sm text-[#202A50]">{val.title}</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-br from-[#202A50] to-[#1E293B] p-12 rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#FF6B00] rounded-full filter blur-[100px] opacity-10" />
        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Pronto para Elevar o Padrão do seu Projeto?</h3>
        <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
          Temos consultores técnicos prontos para avaliar sua planta baixa de construção, planejar móveis na marcenaria ou realizar a auditoria completa de vulnerabilidade em monitoramento.
        </p>
        <div className="pt-2">
          <Link 
            to="/orcamento" 
            className="bg-[#FF6B00] hover:bg-[#FF6B00]/95 text-white font-bold text-xs py-3.5 px-8 rounded-xl transition-all shadow-md block sm:inline-block cursor-pointer"
          >
            Fazer Simulação de Orçamento Gratuito
          </Link>
        </div>
      </section>

    </div>
  );
}
