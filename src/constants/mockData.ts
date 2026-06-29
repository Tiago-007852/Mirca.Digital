import { Product, Project, GalleryItem } from '../types';

export const BRANDS = [
  { name: 'Hikvision', logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=120&q=80&txt=Hikvision' },
  { name: 'Ajax Systems', logo: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=120&q=80&txt=Ajax' },
  { name: 'Intelbras', logo: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=120&q=80&txt=Intelbras' },
  { name: 'Yale', logo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=120&q=80&txt=Yale' },
  { name: 'Bosch Security', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=120&q=80&txt=Bosch' },
  { name: 'Samsung Business', logo: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=120&q=80&txt=Samsung' }
];

export const PRODUCTS_DATA: Product[] = [
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

export const PROJECTS_DATA: Project[] = [
  {
    id: 'proj-01',
    title: 'Monitoramento Corporativo - Banco BFA Huambo',
    category: 'security',
    description: 'Implementação de um sistema de segurança IP redundante de última geração, cobrindo todo o perímetro da agência, terminal de caixas e tesouraria, integrado com central de alarmes de pânico silencioso e biometria.',
    location: 'Cidade Alta, Huambo, Angola',
    date: 'Dezembro de 2025',
    servicesUsed: ['Instalação de Câmeras IP Hikvision', 'Configuração de Sala de Videomonitoramento', 'Controle de Acesso Biométrico', 'Alarme de Pânico contra Intrusão'],
    beforeImage: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-02',
    title: 'Apartamento de Luxo - Mobília e Acabamentos',
    category: 'furniture',
    description: 'Transformação completa de um apartamento T3. Desenvolvemos toda a marcenaria sob medida (cozinha integrada, roupeiros embutidos e gabinetes de WC) e executamos o acabamento civil com sancas de gesso e pisos vinílicos premium.',
    location: 'Edifício Acácias, Huambo, Angola',
    date: 'Março de 2026',
    servicesUsed: ['Móveis Planejados de MDF Naval', 'Iluminação Decorativa em Sanca de Gesso', 'Instalação de Piso Retificado', 'Pintura Acrílica de Toque Acetinado'],
    beforeImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-03',
    title: 'Infraestrutura de Rede Estruturada - Escritório Central',
    category: 'informatica',
    description: 'Implementação completa de cabeamento de rede estruturada de Categoria 6A, montagem de bastidor central com switch administrável Ubiquiti PoE e roteador corporativo Wi-Fi 6 de alta densidade.',
    location: 'Bairro Benfica, Huambo, Angola',
    date: 'Maio de 2026',
    servicesUsed: ['Certificação de Rede Cat6A', 'Instalação de Bastidor e Racks', 'Configuração de Switches Ubiquiti', 'Rede Wi-Fi de Alta Densidade'],
    beforeImage: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    afterImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const GALLERY_DATA: GalleryItem[] = [
  {
    id: 'gal-01',
    title: 'Central de Câmeras de Última Geração',
    category: 'security',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80',
    description: 'Instalação de moderno rack de servidores e gravadores IP NVR integrados com switch PoE industrial de alto processamento.'
  },
  {
    id: 'gal-02',
    title: 'Cozinha Planejada Iluminada',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    description: 'Visão frontal da cozinha luxo sob medida onde se destaca a iluminação inteligente em LED sob as prateleiras embutidas.'
  },
  {
    id: 'gal-03',
    title: 'Montagem de Bastidores de Rede',
    category: 'informatica',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Organização profissional de bastidores com identificação e certificação de cabos de rede estruturada Gigabit Ethernet.'
  },
  {
    id: 'gal-04',
    title: 'Pontos de Acesso Wi-Fi de Longo Alcance',
    category: 'informatica',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80',
    description: 'Instalação de pontos de acesso de teto com ampla cobertura e rede mesh unificada de alta densidade de utilizadores.'
  },
  {
    id: 'gal-05',
    title: 'Sala Limpa de Tecnologia Corporativa',
    category: 'security',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    description: 'Controle de entrada estruturado com catracas eletrônicas associadas a reconhecimento facial inteligente para escritórios premium.'
  },
  {
    id: 'gal-06',
    title: 'Closet Planejado Conforto Máximo',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Disposição otimizada de nichos, sapateiras deslizantes e cabideiros metálicos iluminados para conforto diário impecável.'
  }
];
