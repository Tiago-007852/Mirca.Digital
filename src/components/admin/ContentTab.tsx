import React, { useState, useEffect } from 'react';
import { 
  Save, Sparkles, BookOpen, Clock, Phone, MapPin, 
  ShieldCheck, Mail, Facebook, Instagram, Linkedin, Eye,
  Home, Hammer, Image as ImageIcon, Contact, Info
} from 'lucide-react';
import { WebsiteContent } from '../../types';
import { dbService } from '../../services/dbService';
import ImageUpload from '../ImageUpload';

interface ContentTabProps {
  activityLogged: (details: string, action?: any) => void;
}

type SubTab = 'home' | 'about' | 'services' | 'gallery' | 'contact';

export default function ContentTab({ activityLogged }: ContentTabProps) {
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('home');

  // Contact & Globals States
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [mapEmbed, setMapEmbed] = useState('');

  // HOME Section States
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [heroBgImage, setHeroBgImage] = useState('');
  const [heroCtaText, setHeroCtaText] = useState('');
  const [heroCtaLink, setHeroCtaLink] = useState('');

  const [specSectionSubtitle, setSpecSectionSubtitle] = useState('');
  const [specSectionTitle, setSpecSectionTitle] = useState('');
  const [specSectionDesc, setSpecSectionDesc] = useState('');
  const [specArea1Title, setSpecArea1Title] = useState('');
  const [specArea1Desc, setSpecArea1Desc] = useState('');
  const [specArea2Title, setSpecArea2Title] = useState('');
  const [specArea2Desc, setSpecArea2Desc] = useState('');
  const [specArea3Title, setSpecArea3Title] = useState('');
  const [specArea3Desc, setSpecArea3Desc] = useState('');

  // ABOUT Page States
  const [aboutHeroSubtitle, setAboutHeroSubtitle] = useState('');
  const [aboutHeroTitle, setAboutHeroTitle] = useState('');
  const [aboutHeroDesc, setAboutHeroDesc] = useState('');
  const [aboutStorySubtitle, setAboutStorySubtitle] = useState('');
  const [aboutStoryTitle, setAboutStoryTitle] = useState('');
  const [aboutStoryText1, setAboutStoryText1] = useState('');
  const [aboutStoryText2, setAboutStoryText2] = useState('');
  const [aboutStoryImage, setAboutStoryImage] = useState('');
  const [aboutYearsText, setAboutYearsText] = useState('');
  const [aboutYearsSub, setAboutYearsSub] = useState('');
  const [history, setHistory] = useState('');
  const [mission, setMission] = useState('');
  const [vision, setVision] = useState('');
  const [values, setValues] = useState<string[]>([]);
  const [newValueItem, setNewValueItem] = useState('');

  const [timeline1Year, setTimeline1Year] = useState('');
  const [timeline1Title, setTimeline1Title] = useState('');
  const [timeline1Desc, setTimeline1Desc] = useState('');
  const [timeline2Year, setTimeline2Year] = useState('');
  const [timeline2Title, setTimeline2Title] = useState('');
  const [timeline2Desc, setTimeline2Desc] = useState('');
  const [timeline3Year, setTimeline3Year] = useState('');
  const [timeline3Title, setTimeline3Title] = useState('');
  const [timeline3Desc, setTimeline3Desc] = useState('');
  const [timeline4Year, setTimeline4Year] = useState('');
  const [timeline4Title, setTimeline4Title] = useState('');
  const [timeline4Desc, setTimeline4Desc] = useState('');

  const [diff1Title, setDiff1Title] = useState('');
  const [diff1Desc, setDiff1Desc] = useState('');
  const [diff2Title, setDiff2Title] = useState('');
  const [diff2Desc, setDiff2Desc] = useState('');
  const [diff3Title, setDiff3Title] = useState('');
  const [diff3Desc, setDiff3Desc] = useState('');
  const [diff4Title, setDiff4Title] = useState('');
  const [diff4Desc, setDiff4Desc] = useState('');

  // SERVICES Page States
  const [servicesHeroSubtitle, setServicesHeroSubtitle] = useState('');
  const [servicesHeroTitle, setServicesHeroTitle] = useState('');
  const [servicesHeroDesc, setServicesHeroDesc] = useState('');
  const [servicesWorkflowSubtitle, setServicesWorkflowSubtitle] = useState('');
  const [servicesWorkflowTitle, setServicesWorkflowTitle] = useState('');
  const [step1Title, setStep1Title] = useState('');
  const [step1Desc, setStep1Desc] = useState('');
  const [step2Title, setStep2Title] = useState('');
  const [step2Desc, setStep2Desc] = useState('');
  const [step3Title, setStep3Title] = useState('');
  const [step3Desc, setStep3Desc] = useState('');
  const [step4Title, setStep4Title] = useState('');
  const [step4Desc, setStep4Desc] = useState('');
  const [servicesTestimonialSubtitle, setServicesTestimonialSubtitle] = useState('');
  const [servicesTestimonialTitle, setServicesTestimonialTitle] = useState('');
  const [servicesTestimonialDesc, setServicesTestimonialDesc] = useState('');

  // Service Categories States
  const [service1Title, setService1Title] = useState('');
  const [service1Desc, setService1Desc] = useState('');
  const [service1Image, setService1Image] = useState('');
  const [service1Brands, setService1Brands] = useState('');
  const [service1Benefit1, setService1Benefit1] = useState('');
  const [service1Benefit2, setService1Benefit2] = useState('');
  const [service1Benefit3, setService1Benefit3] = useState('');
  const [service1Benefit4, setService1Benefit4] = useState('');

  const [service2Title, setService2Title] = useState('');
  const [service2Desc, setService2Desc] = useState('');
  const [service2Image, setService2Image] = useState('');
  const [service2Brands, setService2Brands] = useState('');
  const [service2Benefit1, setService2Benefit1] = useState('');
  const [service2Benefit2, setService2Benefit2] = useState('');
  const [service2Benefit3, setService2Benefit3] = useState('');
  const [service2Benefit4, setService2Benefit4] = useState('');

  const [service3Title, setService3Title] = useState('');
  const [service3Desc, setService3Desc] = useState('');
  const [service3Image, setService3Image] = useState('');
  const [service3Brands, setService3Brands] = useState('');
  const [service3Benefit1, setService3Benefit1] = useState('');
  const [service3Benefit2, setService3Benefit2] = useState('');
  const [service3Benefit3, setService3Benefit3] = useState('');
  const [service3Benefit4, setService3Benefit4] = useState('');

  const [service4Title, setService4Title] = useState('');
  const [service4Desc, setService4Desc] = useState('');
  const [service4Image, setService4Image] = useState('');
  const [service4Brands, setService4Brands] = useState('');
  const [service4Benefit1, setService4Benefit1] = useState('');
  const [service4Benefit2, setService4Benefit2] = useState('');
  const [service4Benefit3, setService4Benefit3] = useState('');
  const [service4Benefit4, setService4Benefit4] = useState('');

  // GALLERY Page States
  const [galleryHeroSubtitle, setGalleryHeroSubtitle] = useState('');
  const [galleryHeroTitle, setGalleryHeroTitle] = useState('');
  const [galleryHeroDesc, setGalleryHeroDesc] = useState('');

  // CONTACT Page States
  const [contactHeroSubtitle, setContactHeroSubtitle] = useState('');
  const [contactHeroTitle, setContactHeroTitle] = useState('');
  const [contactHeroDesc, setContactHeroDesc] = useState('');
  const [contactIntroSubtitle, setContactIntroSubtitle] = useState('');
  const [contactIntroTitle, setContactIntroTitle] = useState('');
  const [contactIntroDesc, setContactIntroDesc] = useState('');
  const [contactWorkingHours, setContactWorkingHours] = useState('');

  const loadContent = async () => {
    setLoading(true);
    try {
      const data = await dbService.getWebsiteContent();
      if (data) {
        setContent(data);
        
        // Load Contact & Globals
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setAddress(data.address || '');
        setHours(data.hours || '');
        setFacebook(data.facebook || '');
        setInstagram(data.instagram || '');
        setLinkedin(data.linkedin || '');
        setMapEmbed(data.mapEmbed || '');

        // Load HOME Section
        setHeroTitle(data.heroTitle || '');
        setHeroSubtitle(data.heroSubtitle || '');
        setHeroDescription(data.heroDescription || '');
        setHeroBgImage(data.heroBgImage || '');
        setHeroCtaText(data.heroCtaText || '');
        setHeroCtaLink(data.heroCtaLink || '');

        setSpecSectionSubtitle(data.specSectionSubtitle || 'Nossas Atuações');
        setSpecSectionTitle(data.specSectionTitle || 'Áreas de Especialização MIRCA');
        setSpecSectionDesc(data.specSectionDesc || 'Integramos tecnologia, engenharia e design de interiores refinado para prover resultados estéticos e de extrema proteção técnica.');
        setSpecArea1Title(data.specArea1Title || 'Segurança Eletrónica');
        setSpecArea1Desc(data.specArea1Desc || 'CCTV IP de alta resolução, alarmes inteligentes Ajax, controle de acesso biométrico e barreiras automáticas.');
        setSpecArea2Title(data.specArea2Title || 'Mobiliário Planejado');
        setSpecArea2Desc(data.specArea2Desc || 'Projetos de marcenaria sob medida de alto padrão para cozinhas sofisticadas, roupeiros luxuosos e escritórios.');
        setSpecArea3Title(data.specArea3Title || 'Construção & Acabamento');
        setSpecArea3Desc(data.specArea3Desc || 'Construção residencial e comercial, aplicação de gesso cartonado, sancas flutuantes, pintura e porcelanatos.');

        // Load ABOUT Section
        setAboutHeroSubtitle(data.aboutHeroSubtitle || 'Sobre a MIRCA');
        setAboutHeroTitle(data.aboutHeroTitle || 'Nossa História, Valores e Compromisso');
        setAboutHeroDesc(data.aboutHeroDesc || 'Conheça mais sobre a trajetória da MIRCA LDA e as metas que pautam nossa entrega no mercado angolano.');
        setAboutStorySubtitle(data.aboutStorySubtitle || 'Soluções Corporativas');
        setAboutStoryTitle(data.aboutStoryTitle || 'Comprometimento com Engenharia e Design de Alto Nível');
        setAboutStoryText1(data.aboutStoryText1 || '');
        setAboutStoryText2(data.aboutStoryText2 || '');
        setAboutStoryImage(data.aboutStoryImage || '');
        setAboutYearsText(data.aboutYearsText || '5+ Anos');
        setAboutYearsSub(data.aboutYearsSub || 'No Coração de Huambo');
        setHistory(data.history || '');
        setMission(data.mission || '');
        setVision(data.vision || '');
        setValues(data.values || []);

        setTimeline1Year(data.timeline1Year || '2021');
        setTimeline1Title(data.timeline1Title || 'Fundação da MIRCA no Huambo');
        setTimeline1Desc(data.timeline1Desc || '');
        setTimeline2Year(data.timeline2Year || '2022');
        setTimeline2Title(data.timeline2Title || 'Abertura do Atelier de Marcenaria');
        setTimeline2Desc(data.timeline2Desc || '');
        setTimeline3Year(data.timeline3Year || '2023');
        setTimeline3Title(data.timeline3Title || 'Parcerias Internacionais');
        setTimeline3Desc(data.timeline3Desc || '');
        setTimeline4Year(data.timeline4Year || '2025');
        setTimeline4Title(data.timeline4Title || 'Liderança no Setor Regional');
        setTimeline4Desc(data.timeline4Desc || '');

        setDiff1Title(data.diff1Title || 'Qualidade Extrema');
        setDiff1Desc(data.diff1Desc || '');
        setDiff2Title(data.diff2Title || 'Tecnologia Conectada');
        setDiff2Desc(data.diff2Desc || '');
        setDiff3Title(data.diff3Title || 'Sustentabilidade');
        setDiff3Desc(data.diff3Desc || '');
        setDiff4Title(data.diff4Title || 'Compromisso com o Cliente');
        setDiff4Desc(data.diff4Desc || '');

        // Load SERVICES Section
        setServicesHeroSubtitle(data.servicesHeroSubtitle || 'Serviços Profissionais');
        setServicesHeroTitle(data.servicesHeroTitle || 'Nossas Áreas de Competência');
        setServicesHeroDesc(data.servicesHeroDesc || 'Desenvolvemos engenharia sofisticada, marcenaria sob medida e segurança para projetos comerciais, residenciais e institucionais com máxima garantia.');
        setServicesWorkflowSubtitle(data.servicesWorkflowSubtitle || 'Etapas Mirca');
        setServicesWorkflowTitle(data.servicesWorkflowTitle || 'Nosso Fluxo de Trabalho Garantido');
        setStep1Title(data.step1Title || 'Visita & Levantamento');
        setStep1Desc(data.step1Desc || 'Realizamos medições a laser gratuitas no local de obra ou recolhemos a planta civil.');
        setStep2Title(data.step2Title || 'Projeto 3D & Orçamento');
        setStep2Desc(data.step2Desc || 'Nossos projetistas geram simulações estéticas ou de câmeras para análise detalhada de custos.');
        setStep3Title(data.step3Title || 'Execução de Elite');
        setStep3Desc(data.step3Desc || 'Técnicos certificados instalam ou fabricam os materiais com acabamentos nivelados limpos.');
        setStep4Title(data.step4Title || 'Entrega & Assistência');
        setStep4Desc(data.step4Desc || 'Formalizamos termo de aprovação do cliente com instruções de uso e suporte contínuo.');
        setServicesTestimonialSubtitle(data.servicesTestimonialSubtitle || 'Garantia Comprovada');
        setServicesTestimonialTitle(data.servicesTestimonialTitle || 'O que dizem as empresas clientes da MIRCA?');
        setServicesTestimonialDesc(data.servicesTestimonialDesc || 'Nossas parcerias de monitorização e engenharia com empresas angolanas estendem confiança no mercado local.');

        // Load Service Category Fields
        setService1Title(data.service1Title || 'Segurança Eletrónica Inteligente');
        setService1Desc(data.service1Desc || 'Sistemas inteligentes integrados por rádio e IP para cobrir condomínios, agências financeiras e vivendas com segurança de redundância militar.');
        setService1Image(data.service1Image || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80');
        setService1Brands(data.service1Brands || 'Hikvision, Intelbras, Ajax Systems, Yale, Ajax Pro');
        setService1Benefit1(data.service1Benefit1 || 'CCTV IP inteligente de 4MP com alertas em canais de rádio dedicados');
        setService1Benefit2(data.service1Benefit2 || 'Controle de acessos com biometria facial anti-spoofing e cartões UHF');
        setService1Benefit3(data.service1Benefit3 || 'Dispositivos de alarmes anti-sabotagem sem fios com baterias auxiliares de 16h');
        setService1Benefit4(data.service1Benefit4 || 'Criação de Centrais de Operação integradas de segurança sob medida');

        setService2Title(data.service2Title || 'Mobiliário Planejado & Marcenaria');
        setService2Desc(data.service2Desc || 'Fabricação artesanal associada a cortes mecânicos de alta fidelidade para originar móveis perfeitamente ajustados à sua planta.');
        setService2Image(data.service2Image || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80');
        setService2Brands(data.service2Brands || 'Blum, Häfele, MIRCA Atelier Design');
        setService2Benefit1(data.service2Benefit1 || 'MDF naval de 18mm tratado contra fungos e humidade com laca resistente');
        setService2Benefit2(data.service2Benefit2 || 'Amortecedores inteligentes de trilhos invisíveis de patente alemã');
        setService2Benefit3(data.service2Benefit3 || 'Projetos elaborados em modelagem 3D antes da validação de fabricação');
        setService2Benefit4(data.service2Benefit4 || 'Ajustabilidade total de nichos práticos e closets com iluminação');

        setService3Title(data.service3Title || 'Informática, Redes & Servidores');
        setService3Desc(data.service3Desc || 'Cabeamento estruturado estrutural de rede, instalação de servidores, switches gerenciáveis e rede sem fios estável.');
        setService3Image(data.service3Image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80');
        setService3Brands(data.service3Brands || 'Ubiquiti, Cisco, Mikrotik, TP-Link, Intelbras');
        setService3Benefit1(data.service3Benefit1 || 'Cabeamento Cat6/Cat6A certificado com calhas organizadoras de rack');
        setService3Benefit2(data.service3Benefit2 || 'Sistemas Wi-Fi 6 Mesh profissionais para centenas de utilizadores estáveis');
        setService3Benefit3(data.service3Benefit3 || 'Configuração de Servidores NAS, redundância de backups e controle de acessos');
        setService3Benefit4(data.service3Benefit4 || 'Instalação de firewalls inteligentes de segurança de perímetro de rede');

        setService4Title(data.service4Title || 'Suporte & Manutenção Preventiva');
        setService4Desc(data.service4Desc || 'Planos corporativos anuais para certificar o bom funcionamento e redundância de fechaduras, alarmes, bombas de água e elétricas prediais.');
        setService4Image(data.service4Image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80');
        setService4Brands(data.service4Brands || 'MIRCA Pro Support');
        setService4Benefit1(data.service4Benefit1 || 'Visitas regulares de aferição técnica de cabeamento estruturado e lentes de câmeras');
        setService4Benefit2(data.service4Benefit2 || 'Substituição imediata de componentes com defeito inclusa nos pacotes de suporte');
        setService4Benefit3(data.service4Benefit3 || 'Limpeza profunda e recalibração de trilhos de gavetas e portas de correr de marcenaria');
        setService4Benefit4(data.service4Benefit4 || 'Monitorização de software e bases de dados de acessos biométricos prediais');

        // Load GALLERY Section
        setGalleryHeroSubtitle(data.galleryHeroSubtitle || 'Galeria Multimédia');
        setGalleryHeroTitle(data.galleryHeroTitle || 'Nossos Detalhes Visuais');
        setGalleryHeroDesc(data.galleryHeroDesc || 'Acompanhe fotos reais de peças de marcenaria concluídas, painéis IP instalados e andamento das nossas obras em Angola.');

        // Load CONTACT Section
        setContactHeroSubtitle(data.contactHeroSubtitle || 'Fale Connosco');
        setContactHeroTitle(data.contactHeroTitle || 'Contacte os Nossos Escritórios');
        setContactHeroDesc(data.contactHeroDesc || 'Estamos prontos para elaborar orçamentos e agendar vistorias gratuitas à sua residência, loja ou indústria.');
        setContactIntroSubtitle(data.contactIntroSubtitle || 'Atendimento Dedicado');
        setContactIntroTitle(data.contactIntroTitle || 'Canais de Ajuda Rápida');
        setContactIntroDesc(data.contactIntroDesc || 'Damos preferência aos contactos de WhatsApp para cotações instantâneas de alarmes e orçamentos, mas respondemos a mails em até 24 horas úteis.');
        setContactWorkingHours(data.contactWorkingHours || 'Segunda a Sábado: 08:00h - 18:00h | Domingo: Encerrado');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleAddValue = () => {
    const val = newValueItem.trim();
    if (!val) return;
    setValues([...values, val]);
    setNewValueItem('');
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: WebsiteContent = {
        id: 'general-cms',
        history,
        mission,
        vision,
        values,
        phone,
        email,
        address,
        hours,
        facebook,
        instagram,
        linkedin,
        mapEmbed,
        
        // Home Page
        heroTitle,
        heroSubtitle,
        heroDescription,
        heroBgImage,
        heroCtaText,
        heroCtaLink,
        specSectionSubtitle,
        specSectionTitle,
        specSectionDesc,
        specArea1Title,
        specArea1Desc,
        specArea2Title,
        specArea2Desc,
        specArea3Title,
        specArea3Desc,

        // About Page
        aboutTitle: aboutHeroTitle, // fallback legacy
        aboutDescription: aboutHeroDesc, // fallback legacy
        aboutImage: aboutStoryImage, // fallback legacy
        aboutHeroSubtitle,
        aboutHeroTitle,
        aboutHeroDesc,
        aboutStorySubtitle,
        aboutStoryTitle,
        aboutStoryText1,
        aboutStoryText2,
        aboutStoryImage,
        aboutYearsText,
        aboutYearsSub,
        timeline1Year,
        timeline1Title,
        timeline1Desc,
        timeline2Year,
        timeline2Title,
        timeline2Desc,
        timeline3Year,
        timeline3Title,
        timeline3Desc,
        timeline4Year,
        timeline4Title,
        timeline4Desc,
        diff1Title,
        diff1Desc,
        diff2Title,
        diff2Desc,
        diff3Title,
        diff3Desc,
        diff4Title,
        diff4Desc,

        // Services Page
        servicesHeroSubtitle,
        servicesHeroTitle,
        servicesHeroDesc,
        servicesWorkflowSubtitle,
        servicesWorkflowTitle,
        step1Title,
        step1Desc,
        step2Title,
        step2Desc,
        step3Title,
        step3Desc,
        step4Title,
        step4Desc,
        servicesTestimonialSubtitle,
        servicesTestimonialTitle,
        servicesTestimonialDesc,

        // Service Categories
        service1Title,
        service1Desc,
        service1Image,
        service1Brands,
        service1Benefit1,
        service1Benefit2,
        service1Benefit3,
        service1Benefit4,

        service2Title,
        service2Desc,
        service2Image,
        service2Brands,
        service2Benefit1,
        service2Benefit2,
        service2Benefit3,
        service2Benefit4,

        service3Title,
        service3Desc,
        service3Image,
        service3Brands,
        service3Benefit1,
        service3Benefit2,
        service3Benefit3,
        service3Benefit4,

        service4Title,
        service4Desc,
        service4Image,
        service4Brands,
        service4Benefit1,
        service4Benefit2,
        service4Benefit3,
        service4Benefit4,

        // Gallery Page
        galleryHeroSubtitle,
        galleryHeroTitle,
        galleryHeroDesc,

        // Contact Page
        contactHeroSubtitle,
        contactHeroTitle,
        contactHeroDesc,
        contactIntroSubtitle,
        contactIntroTitle,
        contactIntroDesc,
        contactWorkingHours
      };

      await dbService.saveWebsiteContent(payload);
      activityLogged(`O usuário atualizou conteúdos do CMS público (Secção: ${activeSubTab.toUpperCase()}).`, 'edit');
      alert('Conteúdo do website atualizado com sucesso no Firestore!');
      await loadContent();
    } catch (e) {
      console.error(e);
      alert('Erro ao atualizar conteúdo do CMS.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Carregando textos corporativos CMS...
      </div>
    );
  }

  const tabOptions = [
    { id: 'home', label: 'Página Inicial', icon: Home },
    { id: 'about', label: 'Sobre Nós', icon: Info },
    { id: 'services', label: 'Serviços', icon: Hammer },
    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
    { id: 'contact', label: 'Contactos', icon: Contact }
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Gestão de Conteúdo (CMS)</h2>
          <p className="text-gray-500 text-xs text-slate-400">Edite todas as secções informativas do website, banners principais e textos sem mexer em nenhuma linha de código.</p>
        </div>
        
        {/* Global Save Action outside form but bound by form id */}
        <button
          form="cms-global-form"
          type="submit"
          disabled={saving}
          className="bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center justify-center gap-1.5 self-start"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Gravando...' : 'Gravar Alterações'}
        </button>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-gray-150 pb-px">
        {tabOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeSubTab === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveSubTab(opt.id as SubTab)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-xs tracking-tight transition-all cursor-pointer ${
                isActive 
                  ? 'border-[#FF6B00] text-[#FF6B00]' 
                  : 'border-transparent text-gray-500 hover:text-[#202A50] hover:border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              {opt.label}
            </button>
          );
        })}
      </div>

      <form id="cms-global-form" onSubmit={handleSubmit} className="space-y-6">
        
        {/* SUB TAB: HOME */}
        {activeSubTab === 'home' && (
          <div className="space-y-6">
            
            {/* HERO SECTION */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Eye className="w-4 h-4 text-[#FF6B00]" /> Destaque Inicial (Hero Section - HOME)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Impacto</label>
                    <input 
                      type="text"
                      value={heroTitle}
                      onChange={(e) => setHeroTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      placeholder="Ex: Seguranças Ativas e Móveis de Luxo"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                    <input 
                      type="text"
                      value={heroSubtitle}
                      onChange={(e) => setHeroSubtitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Auxiliar</label>
                    <textarea 
                      rows={3}
                      value={heroDescription}
                      onChange={(e) => setHeroDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Texto do Botão (CTA)</label>
                      <input 
                        type="text"
                        value={heroCtaText}
                        onChange={(e) => setHeroCtaText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Link do Botão</label>
                      <input 
                        type="text"
                        value={heroCtaLink}
                        onChange={(e) => setHeroCtaLink(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <ImageUpload 
                    value={heroBgImage}
                    onChange={setHeroBgImage}
                    folder="hero"
                    label="Fundo de Ecran Principal"
                    aspectRatio="aspect-video"
                  />
                </div>
              </div>
            </div>

            {/* SPECIALIZATION AREAS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Áreas de Especialização (Secção 2 - HOME)
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo da Secção</label>
                    <input 
                      type="text"
                      value={specSectionSubtitle}
                      onChange={(e) => setSpecSectionSubtitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Título Principal</label>
                    <input 
                      type="text"
                      value={specSectionTitle}
                      onChange={(e) => setSpecSectionTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição da Secção</label>
                  <textarea 
                    rows={2}
                    value={specSectionDesc}
                    onChange={(e) => setSpecSectionDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>

                <div className="border-t border-slate-100 my-2 pt-4">
                  <h4 className="text-[11px] font-extrabold text-[#202A50] mb-4 uppercase tracking-wider">Configurações dos Três Blocos Principais</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Area 1 */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <span className="text-[9px] font-extrabold text-[#FF6B00] uppercase block">Bloco 1 (Esquerda)</span>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                        <input 
                          type="text"
                          value={specArea1Title}
                          onChange={(e) => setSpecArea1Title(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                        <textarea 
                          rows={4}
                          value={specArea1Desc}
                          onChange={(e) => setSpecArea1Desc(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Area 2 */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <span className="text-[9px] font-extrabold text-[#FF6B00] uppercase block">Bloco 2 (Centro)</span>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                        <input 
                          type="text"
                          value={specArea2Title}
                          onChange={(e) => setSpecArea2Title(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                        <textarea 
                          rows={4}
                          value={specArea2Desc}
                          onChange={(e) => setSpecArea2Desc(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Area 3 */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <span className="text-[9px] font-extrabold text-[#FF6B00] uppercase block">Bloco 3 (Direita)</span>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                        <input 
                          type="text"
                          value={specArea3Title}
                          onChange={(e) => setSpecArea3Title(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                        <textarea 
                          rows={4}
                          value={specArea3Desc}
                          onChange={(e) => setSpecArea3Desc(e.target.value)}
                          className="w-full bg-white border border-slate-150 rounded-lg px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUB TAB: ABOUT US */}
        {activeSubTab === 'about' && (
          <div className="space-y-6">
            
            {/* HERO SECTION ABOUT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Info className="w-4 h-4 text-[#FF6B00]" /> Cabeçalho (Hero Section - SOBRE NÓS)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                  <input 
                    type="text"
                    value={aboutHeroSubtitle}
                    onChange={(e) => setAboutHeroSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Boas-vindas</label>
                  <input 
                    type="text"
                    value={aboutHeroTitle}
                    onChange={(e) => setAboutHeroTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Curta</label>
                  <textarea 
                    rows={2}
                    value={aboutHeroDesc}
                    onChange={(e) => setAboutHeroDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* MAIN STORY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <BookOpen className="w-4 h-4 text-[#FF6B00]" /> Nossa História & Slogan Sede
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo Histórico</label>
                    <input 
                      type="text"
                      value={aboutStorySubtitle}
                      onChange={(e) => setAboutStorySubtitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Título da Narrativa</label>
                    <input 
                      type="text"
                      value={aboutStoryTitle}
                      onChange={(e) => setAboutStoryTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Parágrafo 1</label>
                    <textarea 
                      rows={3}
                      value={aboutStoryText1}
                      onChange={(e) => setAboutStoryText1(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Parágrafo 2</label>
                    <textarea 
                      rows={3}
                      value={aboutStoryText2}
                      onChange={(e) => setAboutStoryText2(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Anos Experiência (Texto)</label>
                      <input 
                        type="text"
                        value={aboutYearsText}
                        onChange={(e) => setAboutYearsText(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo Emblema</label>
                      <input 
                        type="text"
                        value={aboutYearsSub}
                        onChange={(e) => setAboutYearsSub(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <ImageUpload 
                    value={aboutStoryImage}
                    onChange={setAboutStoryImage}
                    folder="about"
                    label="Fotografia Institucional (Direita)"
                    aspectRatio="aspect-video"
                  />

                  <div className="space-y-1 mt-4">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Trajetória Unificada (História Completa)</label>
                    <textarea 
                      rows={8}
                      value={history}
                      onChange={(e) => setHistory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* MISSION VISION VALUES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <ShieldCheck className="w-4 h-4 text-[#FF6B00]" /> Missão, Visão e Pilares Corporativos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Nossa Missão</label>
                  <textarea 
                    rows={3}
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Nossa Visão</label>
                  <textarea 
                    rows={3}
                    value={vision}
                    onChange={(e) => setVision(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>

              {/* Pilares builder */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase block">Pilares Corporativos (Valores)</label>
                
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={newValueItem}
                    onChange={(e) => setNewValueItem(e.target.value)}
                    placeholder="Ex: Rigor Orçamental..."
                    className="flex-grow bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                  <button
                    type="button"
                    onClick={handleAddValue}
                    className="bg-[#202A50] hover:bg-[#FF6B00] text-white font-extrabold text-[10px] uppercase py-2 px-4 rounded-xl transition-all cursor-pointer"
                  >
                    Adicionar Pilar
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {values.map((v, idx) => (
                    <span key={idx} className="bg-slate-100 text-[#202A50] text-[10px] font-extrabold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      {v}
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(idx)}
                        className="text-rose-500 hover:text-rose-700 font-bold focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* TIMELINE TIMING */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Clock className="w-4 h-4 text-[#FF6B00]" /> Linha do Tempo (Timeline de Evolução)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Milestone 1 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-3">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Marco 1</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Ano</label>
                      <input type="text" value={timeline1Year} onChange={(e) => setTimeline1Year(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                      <input type="text" value={timeline1Title} onChange={(e) => setTimeline1Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={timeline1Desc} onChange={(e) => setTimeline1Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850 leading-relaxed" />
                  </div>
                </div>

                {/* Milestone 2 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-3">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Marco 2</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Ano</label>
                      <input type="text" value={timeline2Year} onChange={(e) => setTimeline2Year(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                      <input type="text" value={timeline2Title} onChange={(e) => setTimeline2Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={timeline2Desc} onChange={(e) => setTimeline2Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850 leading-relaxed" />
                  </div>
                </div>

                {/* Milestone 3 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-3">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Marco 3</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Ano</label>
                      <input type="text" value={timeline3Year} onChange={(e) => setTimeline3Year(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                      <input type="text" value={timeline3Title} onChange={(e) => setTimeline3Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={timeline3Desc} onChange={(e) => setTimeline3Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850 leading-relaxed" />
                  </div>
                </div>

                {/* Milestone 4 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-3">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Marco 4</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Ano</label>
                      <input type="text" value={timeline4Year} onChange={(e) => setTimeline4Year(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                    <div className="space-y-1 col-span-2">
                      <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                      <input type="text" value={timeline4Title} onChange={(e) => setTimeline4Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={timeline4Desc} onChange={(e) => setTimeline4Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850 leading-relaxed" />
                  </div>
                </div>

              </div>
            </div>

            {/* CORE VALUE DIFFS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Diferenciais Competitivos (4 Cards)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Diff 1 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Diferencial 1</span>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                    <input type="text" value={diff1Title} onChange={(e) => setDiff1Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={diff1Desc} onChange={(e) => setDiff1Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                </div>

                {/* Diff 2 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Diferencial 2</span>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                    <input type="text" value={diff2Title} onChange={(e) => setDiff2Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={diff2Desc} onChange={(e) => setDiff2Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                </div>

                {/* Diff 3 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Diferencial 3</span>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                    <input type="text" value={diff3Title} onChange={(e) => setDiff3Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={diff3Desc} onChange={(e) => setDiff3Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                </div>

                {/* Diff 4 */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-150/65 space-y-2">
                  <span className="text-[10px] font-extrabold text-[#FF6B00] uppercase block">Diferencial 4</span>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Título</label>
                    <input type="text" value={diff4Title} onChange={(e) => setDiff4Title(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase">Descrição</label>
                    <textarea rows={2} value={diff4Desc} onChange={(e) => setDiff4Desc(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-1.5 text-xs text-gray-850" />
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* SUB TAB: SERVICES */}
        {activeSubTab === 'services' && (
          <div className="space-y-6">
            
            {/* HERO SECTION SERVICES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Info className="w-4 h-4 text-[#FF6B00]" /> Cabeçalho (Hero Section - SERVIÇOS)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                  <input 
                    type="text"
                    value={servicesHeroSubtitle}
                    onChange={(e) => setServicesHeroSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Impacto</label>
                  <input 
                    type="text"
                    value={servicesHeroTitle}
                    onChange={(e) => setServicesHeroTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Explicativa</label>
                  <textarea 
                    rows={2}
                    value={servicesHeroDesc}
                    onChange={(e) => setServicesHeroDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* SERVICES DETAILED CATEGORIES */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Hammer className="w-4 h-4 text-[#FF6B00]" /> Edição de Categorias de Serviços (Imagens, Descrições e Vantagens)
              </h3>

              <div className="space-y-8 divide-y divide-gray-100">
                
                {/* Category 1: Segurança Eletrónica */}
                <div className="space-y-4 pt-4 first:pt-0">
                  <h4 className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center text-[10px]">1</span>
                    Categoria 1: Segurança Eletrónica Inteligente
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Título do Serviço</label>
                          <input type="text" value={service1Title} onChange={(e) => setService1Title(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Marcas Parceiras</label>
                          <input type="text" value={service1Brands} onChange={(e) => setService1Brands(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Descrição Principal</label>
                        <textarea rows={2} value={service1Desc} onChange={(e) => setService1Desc(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000] leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 1</label>
                          <input type="text" value={service1Benefit1} onChange={(e) => setService1Benefit1(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 2</label>
                          <input type="text" value={service1Benefit2} onChange={(e) => setService1Benefit2(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 3</label>
                          <input type="text" value={service1Benefit3} onChange={(e) => setService1Benefit3(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 4</label>
                          <input type="text" value={service1Benefit4} onChange={(e) => setService1Benefit4(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageUpload 
                        value={service1Image}
                        onChange={setService1Image}
                        folder="services"
                        label="Imagem de Destaque"
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>
                </div>

                {/* Category 2: Mobiliário Planejado */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center text-[10px]">2</span>
                    Categoria 2: Mobiliário Planejado & Marcenaria
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Título do Serviço</label>
                          <input type="text" value={service2Title} onChange={(e) => setService2Title(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Marcas Parceiras</label>
                          <input type="text" value={service2Brands} onChange={(e) => setService2Brands(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Descrição Principal</label>
                        <textarea rows={2} value={service2Desc} onChange={(e) => setService2Desc(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000] leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 1</label>
                          <input type="text" value={service2Benefit1} onChange={(e) => setService2Benefit1(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 2</label>
                          <input type="text" value={service2Benefit2} onChange={(e) => setService2Benefit2(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 3</label>
                          <input type="text" value={service2Benefit3} onChange={(e) => setService2Benefit3(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 4</label>
                          <input type="text" value={service2Benefit4} onChange={(e) => setService2Benefit4(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageUpload 
                        value={service2Image}
                        onChange={setService2Image}
                        folder="services"
                        label="Imagem de Destaque"
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>
                </div>

                {/* Category 3: Informática */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center text-[10px]">3</span>
                    Categoria 3: Informática & Infraestrutura
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Título do Serviço</label>
                          <input type="text" value={service3Title} onChange={(e) => setService3Title(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Marcas Parceiras</label>
                          <input type="text" value={service3Brands} onChange={(e) => setService3Brands(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Descrição Principal</label>
                        <textarea rows={2} value={service3Desc} onChange={(e) => setService3Desc(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000] leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 1</label>
                          <input type="text" value={service3Benefit1} onChange={(e) => setService3Benefit1(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 2</label>
                          <input type="text" value={service3Benefit2} onChange={(e) => setService3Benefit2(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 3</label>
                          <input type="text" value={service3Benefit3} onChange={(e) => setService3Benefit3(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 4</label>
                          <input type="text" value={service3Benefit4} onChange={(e) => setService3Benefit4(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageUpload 
                        value={service3Image}
                        onChange={setService3Image}
                        folder="services"
                        label="Imagem de Destaque"
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>
                </div>

                {/* Category 4: Suporte & Manutenção */}
                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-[#FF6B00] uppercase tracking-wide flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF6B00] flex items-center justify-center text-[10px]">4</span>
                    Categoria 4: Suporte & Manutenção Preventiva
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Título do Serviço</label>
                          <input type="text" value={service4Title} onChange={(e) => setService4Title(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Marcas Parceiras</label>
                          <input type="text" value={service4Brands} onChange={(e) => setService4Brands(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-gray-400 uppercase">Descrição Principal</label>
                        <textarea rows={2} value={service4Desc} onChange={(e) => setService4Desc(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs text-[#000000] leading-relaxed" />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 1</label>
                          <input type="text" value={service4Benefit1} onChange={(e) => setService4Benefit1(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 2</label>
                          <input type="text" value={service4Benefit2} onChange={(e) => setService4Benefit2(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 3</label>
                          <input type="text" value={service4Benefit3} onChange={(e) => setService4Benefit3(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase">Vantagem 4</label>
                          <input type="text" value={service4Benefit4} onChange={(e) => setService4Benefit4(e.target.value)} className="w-full bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-xs text-[#000000]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <ImageUpload 
                        value={service4Image}
                        onChange={setService4Image}
                        folder="services"
                        label="Imagem de Destaque"
                        aspectRatio="aspect-video"
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* WORKFLOW STEPS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Clock className="w-4 h-4 text-[#FF6B00]" /> Etapas de Fluxo de Trabalho (Workflow MIRCA)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo do Fluxo</label>
                  <input 
                    type="text"
                    value={servicesWorkflowSubtitle}
                    onChange={(e) => setServicesWorkflowSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título do Fluxo</label>
                  <input 
                    type="text"
                    value={servicesWorkflowTitle}
                    onChange={(e) => setServicesWorkflowTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border-t border-gray-55 pt-4">
                {/* Step 1 */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-[#FF6B00] block">Passo 1</span>
                  <input type="text" value={step1Title} onChange={(e) => setStep1Title(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-800 font-extrabold" />
                  <textarea rows={3} value={step1Desc} onChange={(e) => setStep1Desc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-600 leading-relaxed" />
                </div>

                {/* Step 2 */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-[#FF6B00] block">Passo 2</span>
                  <input type="text" value={step2Title} onChange={(e) => setStep2Title(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-800 font-extrabold" />
                  <textarea rows={3} value={step2Desc} onChange={(e) => setStep2Desc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-600 leading-relaxed" />
                </div>

                {/* Step 3 */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-[#FF6B00] block">Passo 3</span>
                  <input type="text" value={step3Title} onChange={(e) => setStep3Title(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-800 font-extrabold" />
                  <textarea rows={3} value={step3Desc} onChange={(e) => setStep3Desc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-600 leading-relaxed" />
                </div>

                {/* Step 4 */}
                <div className="bg-slate-50 p-4 rounded-xl space-y-2">
                  <span className="text-[10px] font-black text-[#FF6B00] block">Passo 4</span>
                  <input type="text" value={step4Title} onChange={(e) => setStep4Title(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-800 font-extrabold" />
                  <textarea rows={3} value={step4Desc} onChange={(e) => setStep4Desc(e.target.value)} className="w-full bg-white border border-slate-200 rounded-lg p-1.5 text-xs text-gray-600 leading-relaxed" />
                </div>
              </div>
            </div>

            {/* TESTIMONIAL PREVIEW TEXTS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Cabeçalho de Testemunhos (Serviços)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo de Prova</label>
                  <input 
                    type="text"
                    value={servicesTestimonialSubtitle}
                    onChange={(e) => setServicesTestimonialSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título de Testemunhos</label>
                  <input 
                    type="text"
                    value={servicesTestimonialTitle}
                    onChange={(e) => setServicesTestimonialTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição de Enquadramento</label>
                  <textarea 
                    rows={2}
                    value={servicesTestimonialDesc}
                    onChange={(e) => setServicesTestimonialDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUB TAB: GALLERY */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-6">
            
            {/* HERO SECTION GALLERY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <ImageIcon className="w-4 h-4 text-[#FF6B00]" /> Cabeçalho (Hero Section - GALERIA)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                  <input 
                    type="text"
                    value={galleryHeroSubtitle}
                    onChange={(e) => setGalleryHeroSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título da Página</label>
                  <input 
                    type="text"
                    value={galleryHeroTitle}
                    onChange={(e) => setGalleryHeroTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Principal</label>
                  <textarea 
                    rows={3}
                    value={galleryHeroDesc}
                    onChange={(e) => setGalleryHeroDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUB TAB: CONTACT */}
        {activeSubTab === 'contact' && (
          <div className="space-y-6">
            
            {/* HERO SECTION CONTACT */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Contact className="w-4 h-4 text-[#FF6B00]" /> Cabeçalho (Hero Section - CONTACTOS)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo</label>
                  <input 
                    type="text"
                    value={contactHeroSubtitle}
                    onChange={(e) => setContactHeroSubtitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título Principal</label>
                  <input 
                    type="text"
                    value={contactHeroTitle}
                    onChange={(e) => setContactHeroTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1 md:col-span-3">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Explicativa</label>
                  <textarea 
                    rows={2}
                    value={contactHeroDesc}
                    onChange={(e) => setContactHeroDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT INTRO & HOURS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Clock className="w-4 h-4 text-[#FF6B00]" /> Informações de Atendimento e Intro
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Subtítulo de Atendimento</label>
                    <input 
                      type="text"
                      value={contactIntroSubtitle}
                      onChange={(e) => setContactIntroSubtitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Título Informativo</label>
                    <input 
                      type="text"
                      value={contactIntroTitle}
                      onChange={(e) => setContactIntroTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Informativa</label>
                    <textarea 
                      rows={2}
                      value={contactIntroDesc}
                      onChange={(e) => setContactIntroDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Frase de Horários de Trabalho (Completa)</label>
                    <input 
                      type="text"
                      value={contactWorkingHours}
                      onChange={(e) => setContactWorkingHours(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* DIRECT CHANNELS & GPS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black text-[#202A50] uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-50 pb-2">
                <Phone className="w-4 h-4 text-[#FF6B00]" /> Contactos Directos e Redes Sociais
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Telefones (Visível no cabeçalho/rodapé)</label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Correio Eletrónico (Visível)</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Endereço Completo Sede</label>
                  <input 
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Horários de Atendimento (Rodapé)</label>
                  <input 
                    type="text"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Link de Redes Sociais - Facebook</label>
                  <input 
                    type="text"
                    value={facebook}
                    onChange={(e) => setFacebook(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Link de Redes Sociais - Instagram</label>
                  <input 
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Link de Redes Sociais - Linkedin</label>
                  <input 
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Coordenadas GPS ou Link do Google Maps</label>
                  <input 
                    type="text"
                    value={mapEmbed}
                    onChange={(e) => setMapEmbed(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="-12.7766, 15.7323"
                  />
                </div>

              </div>
            </div>

          </div>
        )}

        {/* Global Save action at footer too */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-xs py-3.5 px-8 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Gravando Alterações...' : `Gravar Secção ${activeSubTab.toUpperCase()}`}
          </button>
        </div>

      </form>
    </div>
  );
}
