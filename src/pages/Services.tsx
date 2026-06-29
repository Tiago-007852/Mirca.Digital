import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Hammer, Paintbrush, Activity, ClipboardCheck, Info,
  Cylinder, Lock, Monitor, Laptop, Power, Server, Wrench, CheckCircle
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { WebsiteContent } from '../types';

export default function Services() {
  const [content, setContent] = useState<WebsiteContent | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await dbService.getWebsiteContent();
        setContent(data);
      } catch (err) {
        console.error('Erro ao carregar dados do CMS para Serviços', err);
      }
    };
    loadData();
  }, []);

  const categories = [
    {
      id: 'security',
      title: content?.service1Title || 'Segurança Eletrónica Inteligente',
      icon: <ShieldCheck className="w-8 h-8 text-white" />,
      tag: 'PROTEÇÃO TOTAL',
      bgImg: content?.service1Image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      description: content?.service1Desc || 'Sistemas inteligentes integrados por rádio e IP para cobrir condomínios, agências financeiras e vivendas com segurança de redundância militar.',
      benefits: [
        content?.service1Benefit1 || 'CCTV IP inteligente de 4MP com alertas em canais de rádio dedicados',
        content?.service1Benefit2 || 'Controle de acessos com biometria facial anti-spoofing e cartões UHF',
        content?.service1Benefit3 || 'Dispositivos de alarmes anti-sabotagem sem fios com baterias auxiliares de 16h',
        content?.service1Benefit4 || 'Criação de Centrais de Operação integradas de segurança sob medida'
      ],
      brands: content?.service1Brands || 'Hikvision, Intelbras, Ajax Systems, Yale, Ajax Pro'
    },
    {
      id: 'furniture',
      title: content?.service2Title || 'Mobiliário Planejado & Marcenaria',
      icon: <Hammer className="w-8 h-8 text-white" />,
      tag: 'DESIGN PREMIUM',
      bgImg: content?.service2Image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      description: content?.service2Desc || 'Fabricação artesanal associada a cortes mecânicos de alta fidelidade para originar móveis perfeitamente ajustados à sua planta.',
      benefits: [
        content?.service2Benefit1 || 'MDF naval de 18mm tratado contra fungos e humidade com laca resistente',
        content?.service2Benefit2 || 'Amortecedores inteligentes de trilhos invisíveis de patente alemã',
        content?.service2Benefit3 || 'Projetos elaborados em modelagem 3D antes da validação de fabricação',
        content?.service2Benefit4 || 'Ajustabilidade total de nichos práticos e closets com iluminação'
      ],
      brands: content?.service2Brands || 'Blum, Häfele, MIRCA Atelier Design'
    },
    {
      id: 'informatica',
      title: content?.service3Title || 'Informática, Redes & Servidores',
      icon: <Laptop className="w-8 h-8 text-white" />,
      tag: 'INFRAESTRUTURA DE REDES',
      bgImg: content?.service3Image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      description: content?.service3Desc || 'Desenho, montagem e certificação de redes corporativas estruturadas, configuração de roteadores Wi-Fi de alta performance e servidores empresariais.',
      benefits: [
        content?.service3Benefit1 || 'Certificação profissional de cabeamento UTP/FTP de Categoria 6/6A',
        content?.service3Benefit2 || 'Redes Wi-Fi Mesh inteligentes de alta densidade sem quebras de sinal',
        content?.service3Benefit3 || 'Instalação e organização de racks e bastidores de telecomunicação',
        content?.service3Benefit4 || 'Segurança perimetral informática com firewalls de última geração'
      ],
      brands: content?.service3Brands || 'Ubiquiti, Cisco, TP-Link, Huawei, Mikrotik'
    },
    {
      id: 'maintenance',
      title: content?.service4Title || 'Suporte & Manutenção Preventiva',
      icon: <Wrench className="w-8 h-8 text-white" />,
      tag: 'SUPORTE COMERCIAL',
      bgImg: content?.service4Image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      description: content?.service4Desc || 'Planos corporativos anuais para certificar o bom funcionamento e redundância de fechaduras, alarmes, bombas de água e elétricas prediais.',
      benefits: [
        content?.service4Benefit1 || 'Visitas regulares de aferição técnica de cabeamento estruturado e lentes de câmeras',
        content?.service4Benefit2 || 'Substituição imediata de componentes com defeito inclusa nos pacotes de suporte',
        content?.service4Benefit3 || 'Limpeza profunda e recalibração de trilhos de gavetas e portas de correr de marcenaria',
        content?.service4Benefit4 || 'Monitorização de software e bases de dados de acessos biométricos prediais'
      ],
      brands: content?.service4Brands || 'MIRCA Pro Support'
    }
  ];

  const workflowSteps = [
    { 
      num: '01', 
      title: content?.step1Title || 'Visita & Levantamento', 
      desc: content?.step1Desc || 'Realizamos medições a laser gratuitas no local de obra ou recolhemos a planta civil.' 
    },
    { 
      num: '02', 
      title: content?.step2Title || 'Projeto 3D & Orçamento', 
      desc: content?.step2Desc || 'Nossos projetistas geram simulações estéticas ou de câmeras para análise detalhada de custos.' 
    },
    { 
      num: '03', 
      title: content?.step3Title || 'Execução de Elite', 
      desc: content?.step3Desc || 'Técnicos certificados instalam ou fabricam os materiais com acabamentos nivelados limpos.' 
    },
    { 
      num: '04', 
      title: content?.step4Title || 'Entrega & Assistência', 
      desc: content?.step4Desc || 'Formalizamos termo de aprovação do cliente com instruções de uso e suporte contínuo.' 
    }
  ];

  return (
    <div className="space-y-24 pb-16">
      
      {/* SERVICES HERO */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">
            {content?.servicesHeroSubtitle || 'Serviços Profissionais'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            {content?.servicesHeroTitle || 'Nossas Áreas de Competência'}
          </h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {content?.servicesHeroDesc || 'Desenvolvemos engenharia sofisticada, marcenaria sob medida e segurança para projetos comerciais, residenciais e institucionais com máxima garantia.'}
          </p>
        </div>
      </section>

      {/* DETAILED CATEGORY SECTIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {categories.map((cat, idx) => (
          <div 
            key={cat.id} 
            id={cat.id}
            className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-center ${idx % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
          >
            {/* Left/Right image part */}
            <div className={`space-y-4 lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-last' : ''}`}>
              <div className="relative rounded-2xl overflow-hidden shadow-lg h-[340px]">
                <img src={cat.bgImg} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-[#202A50]/40 mix-blend-multiply" />
                <div className="absolute bottom-6 left-6 flex items-center gap-3">
                  <div className="bg-[#FF6B00] p-3 rounded-xl">
                    {cat.icon}
                  </div>
                  <div>
                    <span className="text-[10px] text-[#FF6B00] font-bold tracking-widest uppercase">{cat.tag}</span>
                    <h4 className="font-extrabold text-white text-lg">{cat.title}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Details part */}
            <div className="space-y-6 lg:col-span-7">
              <span className="text-xs font-semibold text-[#FF6B00] tracking-widest uppercase">{cat.tag}</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#202A50] tracking-tight">{cat.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{cat.description}</p>
              
              <div className="space-y-2">
                <h5 className="font-bold text-xs text-[#202A50] uppercase tracking-wider">Vantagens de Escolher a MIRCA:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {cat.benefits.map((benefit, bIdx) => (
                    <div key={bIdx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                      <span className="text-xs text-gray-500">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4.5 rounded-xl border border-gray-100 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-gray-400 block uppercase font-bold text-[9px] tracking-wide">Marcas Parceiras</span>
                  <span className="font-semibold text-gray-600">{cat.brands}</span>
                </div>
                <Link 
                  to="/orcamento" 
                  className="bg-[#FF6B00] hover:bg-[#202A50] hover:text-[#FF6B00] border border-transparent hover:border-[#FF6B00]/10 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors"
                >
                  Solicitar Consulta
                </Link>
              </div>
            </div>

          </div>
        ))}
      </section>

      {/* DETAILED WORKING PROCESS METHOD */}
      <section className="bg-[#202A50] text-[#FFFFFF] py-20 border-t border-b border-gray-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-sm font-semibold text-[#FF6B00] tracking-widest uppercase">
              {content?.servicesWorkflowSubtitle || 'Etapas Mirca'}
            </h2>
            <p className="text-3xl font-extrabold tracking-tight">
              {content?.servicesWorkflowTitle || 'Nosso Fluxo de Trabalho Garantido'}
            </p>
            <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {workflowSteps.map((step) => (
              <div key={step.num} className="bg-white/5 p-6 rounded-2xl relative border border-white/5 space-y-3 hover:translate-y-[-4px] transition-transform">
                <span className="text-4xl font-extrabold text-[#FF6B00]/40 block">{step.num}</span>
                <h4 className="font-bold text-md text-white">{step.title}</h4>
                <p className="text-[11px] text-gray-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT TESTIMONIAL PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FF6B00]/5 p-12 rounded-3xl border border-[#FF6B00]/10 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="space-y-2">
          <span className="text-xs font-bold text-[#FF6B00] uppercase tracking-wider block">
            {content?.servicesTestimonialSubtitle || 'Garantia Comprovada'}
          </span>
          <h3 className="text-2xl font-extrabold text-[#202A50]">
            {content?.servicesTestimonialTitle || 'O que dizem as empresas clientes da MIRCA?'}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            {content?.servicesTestimonialDesc || 'Nossas parcerias de monitorização e engenharia com empresas angolanas estendem confiança no mercado local.'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100/80 shadow-sm space-y-3 col-span-2">
          <p className="text-xs text-gray-500 italic leading-relaxed">
            "A equipa técnica da MIRCA instalou toda a infraestrutura de CCTV IP e controlo de entrada biométrico nos escritórios do nosso edifício. O serviço foi executado no prazo exato acordado, com acabamento estético em canaletas invisíveis impecável e o suporte tem sido rápido."
          </p>
          <div>
            <span className="font-extrabold text-xs text-[#202A50] block">Eng. Mateus da Costa</span>
            <span className="text-[10px] text-gray-400">Responsável de Infraestruturas, BFA Huambo</span>
          </div>
        </div>
      </section>

    </div>
  );
}
