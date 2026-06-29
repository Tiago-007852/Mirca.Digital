import { doc, getDoc, setDoc, collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  CategoryItem, 
  ServiceItem, 
  SystemSettings, 
  WebsiteContent, 
  UserProfile, 
  Product, 
  Project, 
  BannerItem, 
  Testimonial, 
  Partner 
} from '../types';

/**
 * PRODUCTION-GRADE FIRESTORE SEEDER
 * 
 * Provides an idempotent, stateful, transaction-safe approach for bootstrapping
 * the MIRCA CONTROL platform in a production cloud context.
 * 
 * Designed to prevent side-effects, duplicate writes, and collision events.
 */

// Default categories with robust descriptions & modern icon tags
const DEFAULT_CATEGORIES: CategoryItem[] = [
  { 
    id: 'cat-1', 
    name: 'Segurança Eletrónica', 
    slug: 'seguranca-eletronica', 
    icon: 'Shield', 
    banner: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    description: 'Vigilância inteligente, câmaras de CCTV profissionais, controle de acesso e alarmes contra intrusões.', 
    displayOrder: 1 
  },
  { 
    id: 'cat-2', 
    name: 'Informática', 
    slug: 'informatica', 
    icon: 'Laptop', 
    banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Equipamentos de redes, servidores de alta performance, computadores empresariais e assessoria técnica.', 
    displayOrder: 2 
  },
  { 
    id: 'cat-3', 
    name: 'Eletricidade', 
    slug: 'eletricidade', 
    icon: 'Zap', 
    banner: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    description: 'Projetos e montagem elétrica industrial ou residencial, quadros elétricos e cablagens estruturadas.', 
    displayOrder: 3 
  }
];

// Default services to demonstrate scope
const DEFAULT_SERVICES: ServiceItem[] = [
  { 
    id: 'srv-1', 
    title: 'Instalação de Sistemas de CCTV', 
    tag: 'Segurança Eletrónica', 
    description: 'Monitorização ininterrupta de alta resolução equipada com visão noturna por infravermelhos e alertas integrados para dispositivos móveis.', 
    benefits: [
      'Visão noturna avançada infravermelho de longo alcance', 
      'Integração nativa com smartphones e centrais físicas', 
      'Gravação em Cloud privada com proteção de redundância'
    ], 
    icon: 'Camera', 
    displayOrder: 1 
  },
  { 
    id: 'srv-2', 
    title: 'Marcenaria sob Medida de Luxo', 
    tag: 'Mobiliário Planejado', 
    description: 'Design de móveis de requinte para cozinhas planeadas, armários, salas corporativas e closets desenhados ao milímetro.', 
    benefits: [
      'Aproveitamento científico absoluto de 100% da área útil', 
      'Tratamento marítimo anti-humidade em placas de MDF naval', 
      'Instalação limpa com ferragens suaves de tecnologia alemã'
    ], 
    icon: 'PenTool', 
    displayOrder: 2 
  },
  { 
    id: 'srv-3', 
    title: 'Informática & Infraestrutura de Redes', 
    tag: 'Informática', 
    description: 'Instalação de cabeamento estruturado, servidores de dados e redes Wi-Fi empresariais de alta performance e densidade.', 
    benefits: [
      'Cabeamento de rede certificado Cat6/Cat6A profissional', 
      'Roteadores Wi-Fi Mesh de alta densidade sem quebras de sinal', 
      'Segurança contra intrusões de rede com Firewalls robustos'
    ], 
    icon: 'Laptop', 
    displayOrder: 3 
  }
];

// Default General System Settings (Global Business Identity)
const DEFAULT_SETTINGS: SystemSettings = {
  id: 'system-settings',
  siteName: 'MIRCA LDA',
  logoUrl: '', // blank by default to fallback to dynamic stylized M icon
  whiteLogoUrl: '',
  darkLogoUrl: '',
  faviconUrl: '',
  companySlogan: 'Inovação, Segurança e Marcenaria sob Medida',
  businessAddress: 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola',
  phoneNumber: '+244 948170046',
  whatsappNumber: '244948170046',
  businessEmail: 'mirca_prestacaodeservico@outlook.com',
  socialFacebook: 'https://www.facebook.com/mirca',
  socialInstagram: 'https://www.instagram.com/mirca',
  socialLinkedin: 'https://linkedin.com/company/mirca',
  seoDefaultTitle: 'MIRCA LDA | Segurança Eletrónica, Obras Civis e Marcenaria de Luxo',
  seoDefaultDescription: 'As melhores soluções integradas em CCTV HD, alarmes residenciais, gesso cartonado, porcelanatos e móveis por medida no Huambo, Angola.',
  seoKeywords: 'mirca, huambo, angola, cctv, alarmes, moveis planejados, obras civis, gesso, acabamento',
  seoOgImage: '',
  footerCopyright: '© 2026 MIRCA LDA. Todos os direitos reservados. Inovação Integrada no Huambo.'
};

// Default CMS General Content
const DEFAULT_CMS_CONTENT: WebsiteContent = {
  id: 'general-cms',
  history: 'Fundada na província do Huambo com a missão de unificar projetos de infraestrutura robusta e móveis de alto acabamento decorativo, a MIRCA LDA consolidou-se como a principal escolha técnica para clientes que exigem pontualidade, rigores fiscais e alto requinte no acabamento de seus imóveis e ambientes.',
  mission: 'Prover inovação inteligente em segurança ativa, aliada ao conforto de marcenaria de luxo e engenharia civil resiliente.',
  vision: 'Ser o ecossistema líder no mercado angolano de infraestruturas técnicas integradas até 2030.',
  values: [
    'Segurança e Vigilância Activa', 
    'Alta Marcenaria Artesanal', 
    'Engenharia de Confiança', 
    'Transparência com Investidores'
  ],
  phone: '+244 948 170 046',
  email: 'mirca_prestacaodeservico@outlook.com',
  address: 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola',
  hours: 'Segunda - Sábado: 08:00 - 18:00',
  facebook: 'https://www.facebook.com/mirca',
  instagram: 'https://www.instagram.com/mirca',
  linkedin: 'https://linkedin.com/company/mirca',
  mapEmbed: '-12.7766, 15.7323',
  // Home Section CMS Defaults
  heroTitle: 'Transformamos Projetos em Ambientes Seguros, Funcionais e Belos',
  heroSubtitle: 'Soluções Completas em Angola',
  heroDescription: 'Mobiliário sob medida exclusivo, sistemas integrados de segurança avançada, engenharia e acabamentos civis de altíssima precisão no Huambo e em toda Angola.',
  heroBgImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1920&q=80',
  heroCtaText: 'Solicitar Orçamento',
  heroCtaLink: '/orcamento',
  // About Section CMS Defaults
  aboutTitle: 'Engenharia Civil de Precisão, Segurança Inteligente e Marcenaria Exclusiva',
  aboutDescription: 'A MIRCA LDA foi idealizada para unificar num único prestador estratégico as principais demandas técnicas de imóveis de alto requinte: segurança patrimonial eletrônica, marcenaria planejada personalizada de alta sofisticação e infraestrutura civil.',
  aboutImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
};

// Base Catalog Fallback Products for high fidelity initial demo
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'sec-01',
    name: 'Câmara IP Speed Dome Hikvision Pro',
    category: 'seguranca-eletronica',
    description: 'Câmara de videovigilância externa com rotação PTZ de 360 graus, zoom ótico de 25x, resolução de 4K e visão noturna infravermelha avançada de até 150 metros.',
    technicalSpecs: [
      'Resolução: Ultra HD 4K (8 Megapixels)',
      'Zoom: Ótico de 25x e digital de 16x',
      'Proteção: Certificação IP66 à prova de poeira e água',
      'Visão Noturna: Alcance de até 150 metros com Smart IR'
    ],
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'Hikvision',
    price: 185000,
    priceVisible: true,
    featured: true,
    isNew: true
  },
  {
    id: 'sec-02',
    name: 'Kit Alarme Sem Fios Inteligente Ajax Hub 2',
    category: 'seguranca-eletronica',
    description: 'Central de alarmes profissional com verificação fotográfica de intrusões, suporte a cartão SIM duplo, bateria de backup e alcance de sinal de até 2000 metros.',
    technicalSpecs: [
      'Dispositivos: Suporta até 100 sensores e câmaras',
      'Canais de Comunicação: Ethernet + 2G dual-SIM',
      'Bateria de Backup: Autonomia de até 16 horas',
      'Foto-verificação: Envio de foto em caso de ativação'
    ],
    image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'Ajax Systems',
    price: 340000,
    priceVisible: true,
    featured: true,
    onSale: true
  },
  {
    id: 'inf-01',
    name: 'Switch PoE Administrável 24 Portas Gigabit',
    category: 'informatica',
    description: 'Switch de rede gerenciável de camada 2+ com 24 portas Gigabit Ethernet RJ45 PoE+ e 4 slots SFP+ de 10G. Oferece alta performance e suporte a VLANs avançadas.',
    technicalSpecs: [
      'Portas: 24 portas RJ45 10/100/1000 Mbps PoE+',
      'Portas SFP+: 4 slots SFP+ de 10 Gbps para uplink',
      'Orçamento PoE: Total de 380W de potência',
      'Gerenciamento: Interface Web intuitiva e suporte a CLI'
    ],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'Ubiquiti',
    price: 245000,
    priceVisible: true,
    featured: true,
    isNew: true
  },
  {
    id: 'inf-02',
    name: 'Router Wi-Fi 6 Mesh Empresarial AX6000',
    category: 'informatica',
    description: 'Router de alta performance com suporte a tecnologia Wi-Fi 6 de banda dupla. Permite ligar centenas de utilizadores em simultâneo com estabilidade e controlo de tráfego.',
    technicalSpecs: [
      'Velocidade: Até 6000 Mbps (4804 Mbps em 5GHz + 1148 Mbps em 2.4GHz)',
      'Tecnologias: OFDMA, MU-MIMO e encriptação WPA3',
      'Antenas: 8 antenas externas de alto ganho',
      'Cobertura: Expansível com tecnologia Mesh de longo alcance'
    ],
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'Cisco',
    price: 135000,
    priceVisible: true,
    featured: false,
    onSale: true
  },
  {
    id: 'ele-01',
    name: 'Quadro de Distribuição Monofásico Equipado',
    category: 'eletricidade',
    description: 'Quadro elétrico montado e cablado, pronto para fixação. Inclui disjuntor geral de 40A, diferencial de 30mA, disjuntores de proteção e calhas DIN organizadas.',
    technicalSpecs: [
      'Proteção Principal: Disjuntor Geral 40A bipolar',
      'Segurança de Pessoas: Interruptor Diferencial 40A/30mA',
      'Disjuntores Parciais: 6x 16A (tomadas) + 4x 10A (iluminação)',
      'Estrutura: Caixa termoplástica de alta resistência com porta fumada'
    ],
    image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'Schneider',
    price: 85000,
    priceVisible: true,
    featured: true,
    isNew: false
  },
  {
    id: 'ele-02',
    name: 'Cabo de Cobre Blindado XV 3G4 mm²',
    category: 'eletricidade',
    description: 'Rolo de 100 metros de cabo elétrico de cobre multi-condutor blindado com isolamento XLPE. Ideal para ligações elétricas externas de potência ou de segurança.',
    technicalSpecs: [
      'Condutores: 3 condutores de cobre de 4 mm² de secção',
      'Isolamento: Polietileno reticulado (XLPE) e bainha exterior em PVC',
      'Tensão de Serviço: 0.6/1 kV para instalações industriais',
      'Resistência: Resistente a raios UV e humidade exterior direta'
    ],
    image: 'https://images.unsplash.com/photo-1516520930276-130756e47d21?auto=format&fit=crop&w=800&q=80',
    inStock: true,
    brand: 'General Cable',
    price: 110000,
    priceVisible: true,
    featured: false,
    onSale: false
  }
];

// Showcase Portfolio projects representing outstanding capabilities
const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Monitoramento Integrado - Matriz Banco Comercial',
    category: 'security',
    location: 'Cidade Alta, Huambo',
    description: 'Implementação de projeto técnico de CCTV integrado a centrais de pânico redundantes e alarmes de intrusão com certificação financeira de segurança.',
    afterImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80',
    servicesUsed: ['CCTV Operacional', 'Controle Biométrico', 'Cabos Blindados Contra Curto'],
    date: '2026-04-10',
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'proj-2',
    title: 'Infraestrutura de Rede e Wi-Fi Corporativo - Escritórios BFA',
    category: 'informatica',
    location: 'Bairro Benfica, Huambo',
    description: 'Projeto de instalação de cabeamento de rede estruturada de Categoria 6A, certificação Fluke, montagem de bastidores de dados e roteadores Wi-Fi de alta densidade.',
    afterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    servicesUsed: ['Cabeamento Estruturado Cat6A', 'Certificação de Rede', 'Rede Wi-Fi de Alta Densidade'],
    date: '2026-05-20',
    images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80']
  }
];

const DEFAULT_BANNER_SLIDES: BannerItem[] = [
  {
    id: 'ban-1',
    headline: 'Segurança Eletrónica De Topo e Engenharia de Confiança em Angola',
    subtitle: 'A MIRCA LDA desenvolve soluções corporativas e residenciais com altíssima precisão e durabilidade de marcenaria de luxo no Huambo.',
    bgImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Explore o Nosso Catálogo',
    buttonLink: '/produtos',
    priority: 1,
    active: true
  },
  {
    id: 'ban-2',
    headline: 'Mobiliário Planejado de Marceneiros Especialistas',
    subtitle: 'Cozinhas gourmet inteligentes, escritórios planejados e armários sob as exatas dimensões do seu lar.',
    bgImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    buttonText: 'Fazer Orçamento Rápido',
    buttonLink: '/orcamento',
    priority: 2,
    active: true
  }
];

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Dr. Manuel Augusto',
    company: 'Diretor de Operações - Soluções Integradas Huambo',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'A MIRCA transformou inteiramente nossa matriz comercial. A instalação da segurança eletrónica e CCTV foi minuciosa e nos trouxe extrema tranquilidade.',
    displayOrder: 1,
    featured: true
  },
  {
    id: 'test-2',
    clientName: 'Engª Sandra Costa',
    company: 'Residencial Terras de Angola',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Cozinha planejada com altíssima qualidade. O gesso cartonado e os flutuantes valorizaram demais nossa habitação.',
    displayOrder: 2,
    featured: true
  }
];

const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'part-1',
    name: 'Aliança Segurança Angola',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80',
    website: 'https://mirca.com',
    displayOrder: 1
  },
  {
    id: 'part-2',
    name: 'Carpintaria Central Huambo',
    logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80',
    website: 'https://mirca.com',
    displayOrder: 2
  }
];

export interface SeedingResult {
  success: boolean;
  message: string;
  counters: {
    settings: number;
    cms: number;
    categories: number;
    services: number;
    admin: number;
    products: number;
    projects: number;
    banners: number;
    testimonials: number;
    partners: number;
  };
}

/**
 * Executes a fully safe, duplicate-preventing seed of the entire database.
 */
export async function seedDatabase(forceOverwrite = false): Promise<SeedingResult> {
  const stats = {
    settings: 0,
    cms: 0,
    categories: 0,
    services: 0,
    admin: 0,
    products: 0,
    projects: 0,
    banners: 0,
    testimonials: 0,
    partners: 0
  };

  try {
    // 1. Root settings document (Idempotent - checked unless forced)
    const settingsRef = doc(db, 'settings', DEFAULT_SETTINGS.id);
    const settingsSnap = await getDoc(settingsRef);
    if (forceOverwrite || !settingsSnap.exists()) {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      stats.settings = 1;
    }

    // 2. CMS parameters document
    const cmsRef = doc(db, 'websiteContent', DEFAULT_CMS_CONTENT.id);
    const cmsSnap = await getDoc(cmsRef);
    if (forceOverwrite || !cmsSnap.exists()) {
      await setDoc(cmsRef, DEFAULT_CMS_CONTENT);
      stats.cms = 1;
    }

    // 3. Categories Collection (Batch written to avoid duplicates)
    const catQuery = await getDocs(collection(db, 'categories'));
    if (forceOverwrite || catQuery.empty) {
      const batch = writeBatch(db);
      for (const cat of DEFAULT_CATEGORIES) {
        batch.set(doc(db, 'categories', cat.id), cat);
        stats.categories++;
      }
      await batch.commit();
    }

    // 4. Services Collection
    const srvQuery = await getDocs(collection(db, 'services'));
    if (forceOverwrite || srvQuery.empty) {
      const batch = writeBatch(db);
      for (const srv of DEFAULT_SERVICES) {
        batch.set(doc(db, 'services', srv.id), srv);
        stats.services++;
      }
      await batch.commit();
    }

    // 5. Default Administrator Profiles (Not created automatically to prevent hardcoded accounts)
    stats.admin = 0;

    // 6. Products catalog
    const prodQuery = await getDocs(collection(db, 'products'));
    if (forceOverwrite || prodQuery.empty) {
      const batch = writeBatch(db);
      for (const prod of DEFAULT_PRODUCTS) {
        batch.set(doc(db, 'products', prod.id), prod);
        stats.products++;
      }
      await batch.commit();
    }

    // 7. Projects portfolio
    const projQuery = await getDocs(collection(db, 'projects'));
    if (forceOverwrite || projQuery.empty) {
      const batch = writeBatch(db);
      for (const proj of DEFAULT_PROJECTS) {
        batch.set(doc(db, 'projects', proj.id), proj);
        stats.projects++;
      }
      await batch.commit();
    }

    // 8. Banners carousel
    const bannerQuery = await getDocs(collection(db, 'banners'));
    if (forceOverwrite || bannerQuery.empty) {
      const batch = writeBatch(db);
      for (const b of DEFAULT_BANNER_SLIDES) {
        batch.set(doc(db, 'banners', b.id), b);
        stats.banners++;
      }
      await batch.commit();
    }

    // 9. Testimonials
    const testQuery = await getDocs(collection(db, 'testimonials'));
    if (forceOverwrite || testQuery.empty) {
      const batch = writeBatch(db);
      for (const t of DEFAULT_TESTIMONIALS) {
        batch.set(doc(db, 'testimonials', t.id), t);
        stats.testimonials++;
      }
      await batch.commit();
    }

    // 10. Partners
    const partQuery = await getDocs(collection(db, 'partners'));
    if (forceOverwrite || partQuery.empty) {
      const batch = writeBatch(db);
      for (const p of DEFAULT_PARTNERS) {
        batch.set(doc(db, 'partners', p.id), p);
        stats.partners++;
      }
      await batch.commit();
    }

    return {
      success: true,
      message: 'Base de dados inicializada para produção com integridade e segurança de forma parametrizada.',
      counters: stats
    };

  } catch (error) {
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error('Erro de seeding no Firestore: ', error);
    return {
      success: false,
      message: `Fatal error bootstrapping Firestore Database: ${errMessage}`,
      counters: stats
    };
  }
}

/**
 * PRODUCTION FIRESTORE INDEXES & STRUCTURAL NOTES
 * 
 * 1. Default Indexes (Auto-generated by Firestore):
 *    - Single field indexes are automatically configured for all document attributes.
 * 
 * 2. Required Composite Indexes:
 *    To support high-performance filtering, sorting, and dashboard telemetry within
 *    the MIRCA CONTROL production panel, configure the following composite indexes in 
 *    the Firebase Console (Firestore -> Indexes -> Composite):
 * 
 *    - Collection: "products"
 *      - category (Ascending) + price (Descending)
 *      - category (Ascending) + name (Ascending)
 * 
 *    - Collection: "projects"
 *      - category (Ascending) + date (Descending)
 * 
 *    - Collection: "quotations"
 *      - assignedEmployee (Ascending) + status (Ascending) + priority (Descending)
 * 
 *    - Collection: "activityLogs"
 *      - role (Ascending) + action (Ascending) + timestamp (Descending)
 * 
 * 3. Security Rules Deployments:
 *    Deploy the `firestore.rules` security policies using:
 *    $ npm run deploy:firebase (or automated CI/CD CLI commands) to ensure 
 *    the Zero-Trust schema rules are active.
 */
