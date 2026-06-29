import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  getDoc 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  Product, 
  Project, 
  GalleryItem, 
  QuotationRequest,
  CategoryItem,
  SubcategoryItem,
  ServiceItem,
  ShoppingRequest,
  BannerItem,
  WebsiteContent,
  Partner,
  Testimonial,
  ActivityLog,
  SystemSettings,
  UserProfile
} from '../types';
import { PRODUCTS_DATA, PROJECTS_DATA, GALLERY_DATA } from '../constants/mockData';
import { handleFirestoreError, OperationType } from './firestoreErrorHandler';
import { seedDatabase } from './dbSeeder';

// Helper to check if any Firestore operation returned permission issues and throw appropriate structured format
function checkError(e: unknown, operation: OperationType, path: string): void {
  const msg = e instanceof Error ? e.message : String(e);
  if (
    msg.toLowerCase().includes('permission') || 
    msg.toLowerCase().includes('insufficient') || 
    (e as any)?.code === 'permission-denied'
  ) {
    if (operation === OperationType.LIST || operation === OperationType.GET) {
      console.warn(`Permission warning on ${operation} for ${path}: using local fallback.`);
      return;
    }
    handleFirestoreError(e, operation, path);
  }
}

// Helper to check if we can access firestore or if we should use local state
const LOCAL_STORAGE_PREFIX = 'mirca_';

function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving to localStorage', e);
  }
}

export const dbService = {
  // --- PRODUCTS ---
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, 'products'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Seed Firestore if empty
        const initial = getLocal<Product[]>('products', PRODUCTS_DATA);
        try {
          for (const prod of initial) {
            await setDoc(doc(db, 'products', prod.id), prod);
          }
        } catch (seedingError) {
          console.warn('Seeding products skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: Product[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as Product);
      });
      setLocal('products', list);
      return list;
    } catch (e) {
      checkError(e, OperationType.LIST, 'products');
      console.warn('Firestore products read failed, using local storage fallback.', e);
      return getLocal<Product[]>('products', PRODUCTS_DATA);
    }
  },

  async saveProduct(product: Product): Promise<void> {
    try {
      await setDoc(doc(db, 'products', product.id), product);
    } catch (e) {
      checkError(e, OperationType.WRITE, `products/${product.id}`);
      console.warn('Firestore products write failed, updating local state.', e);
    }
    const current = getLocal<Product[]>('products', PRODUCTS_DATA);
    const index = current.findIndex(p => p.id === product.id);
    if (index > -1) {
      current[index] = product;
    } else {
      current.push(product);
    }
    setLocal('products', current);
  },

  async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      checkError(e, OperationType.DELETE, `products/${id}`);
      console.warn('Firestore products delete failed, updating local state.', e);
    }
    const current = getLocal<Product[]>('products', PRODUCTS_DATA);
    const updated = current.filter(p => p.id !== id);
    setLocal('products', updated);
  },

  // --- PROJECTS ---
  async getProjects(): Promise<Project[]> {
    try {
      const q = query(collection(db, 'projects'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Seed
        const initial = getLocal<Project[]>('projects', PROJECTS_DATA);
        try {
          for (const proj of initial) {
            await setDoc(doc(db, 'projects', proj.id), proj);
          }
        } catch (seedingError) {
          console.warn('Seeding projects skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: Project[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as Project);
      });
      setLocal('projects', list);
      return list;
    } catch (e) {
      checkError(e, OperationType.LIST, 'projects');
      console.warn('Firestore projects read failed, using local storage fallback.', e);
      return getLocal<Project[]>('projects', PROJECTS_DATA);
    }
  },

  async saveProject(project: Project): Promise<void> {
    try {
      await setDoc(doc(db, 'projects', project.id), project);
    } catch (e) {
      checkError(e, OperationType.WRITE, `projects/${project.id}`);
      console.warn('Firestore projects write failed, updating local state.', e);
    }
    const current = getLocal<Project[]>('projects', PROJECTS_DATA);
    const index = current.findIndex(p => p.id === project.id);
    if (index > -1) {
      current[index] = project;
    } else {
      current.push(project);
    }
    setLocal('projects', current);
  },

  async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      checkError(e, OperationType.DELETE, `projects/${id}`);
      console.warn('Firestore projects delete failed, updating local state.', e);
    }
    const current = getLocal<Project[]>('projects', PROJECTS_DATA);
    const updated = current.filter(p => p.id !== id);
    setLocal('projects', updated);
  },

  // --- GALLERY ---
  async getGallery(): Promise<GalleryItem[]> {
    try {
      const q = query(collection(db, 'gallery'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        // Seed
        const initial = getLocal<GalleryItem[]>('gallery', GALLERY_DATA);
        try {
          for (const item of initial) {
            await setDoc(doc(db, 'gallery', item.id), item);
          }
        } catch (seedingError) {
          console.warn('Seeding gallery skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: GalleryItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as GalleryItem);
      });
      setLocal('gallery', list);
      return list;
    } catch (e) {
      console.warn('Firestore gallery read failed, using local storage fallback.', e);
      return getLocal<GalleryItem[]>('gallery', GALLERY_DATA);
    }
  },

  async saveGalleryItem(item: GalleryItem): Promise<void> {
    try {
      await setDoc(doc(db, 'gallery', item.id), item);
    } catch (e) {
      console.warn('Firestore gallery write failed, updating local state.', e);
    }
    const current = getLocal<GalleryItem[]>('gallery', GALLERY_DATA);
    const index = current.findIndex(g => g.id === item.id);
    if (index > -1) {
      current[index] = item;
    } else {
      current.push(item);
    }
    setLocal('gallery', current);
  },

  async deleteGalleryItem(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Firestore gallery delete failed, updating local state.', e);
    }
    const current = getLocal<GalleryItem[]>('gallery', GALLERY_DATA);
    const updated = current.filter(g => g.id !== id);
    setLocal('gallery', updated);
  },

  // --- QUOTATIONS ---
  async getQuotations(): Promise<QuotationRequest[]> {
    try {
      const q = query(collection(db, 'quotations'));
      const querySnapshot = await getDocs(q);
      const list: QuotationRequest[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as QuotationRequest);
      });
      // Sort in-memory to prevent requiring composite indices if not deployed
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setLocal('quotations', list);
      return list;
    } catch (e) {
      checkError(e, OperationType.LIST, 'quotations');
      console.warn('Firestore quotations read failed, using local storage fallback.', e);
      return getLocal<QuotationRequest[]>('quotations', []);
    }
  },

  async addQuotationRequest(request: Omit<QuotationRequest, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const id = 'quote_' + Math.random().toString(36).substr(2, 9);
    const newRequest: QuotationRequest = {
      ...request,
      id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'quotations', id), newRequest);
    } catch (e) {
      checkError(e, OperationType.WRITE, `quotations/${id}`);
      console.warn('Firestore quotation submit failed, writing locally.', e);
    }

    const current = getLocal<QuotationRequest[]>('quotations', []);
    current.unshift(newRequest);
    setLocal('quotations', current);
    return id;
  },

  async updateQuotationStatus(id: string, status: QuotationRequest['status']): Promise<void> {
    try {
      const ref = doc(db, 'quotations', id);
      await setDoc(ref, { status }, { merge: true });
    } catch (e) {
      checkError(e, OperationType.WRITE, `quotations/${id}`);
      console.warn('Firestore quotation status update failed, writing locally.', e);
    }
    const current = getLocal<QuotationRequest[]>('quotations', []);
    const index = current.findIndex(q => q.id === id);
    if (index > -1) {
      current[index].status = status;
    }
    setLocal('quotations', current);
  },

  async updateQuotationDetails(id: string, updates: Partial<QuotationRequest>): Promise<void> {
    try {
      const ref = doc(db, 'quotations', id);
      await setDoc(ref, updates, { merge: true });
    } catch (e) {
      checkError(e, OperationType.WRITE, `quotations/${id}`);
      console.warn('Firestore quotation details update failed, writing locally.', e);
    }
    const current = getLocal<QuotationRequest[]>('quotations', []);
    const index = current.findIndex(q => q.id === id);
    if (index > -1) {
      current[index] = { ...current[index], ...updates };
    }
    setLocal('quotations', current);
  },

  // --- CATEGORIES ---
  async getCategories(): Promise<CategoryItem[]> {
    const INITIAL_CATEGORIES: CategoryItem[] = [
      { id: 'cat-1', name: 'Segurança Eletrónica', slug: 'seguranca-eletronica', icon: 'Shield', banner: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80', description: 'Vigilância inteligente, câmaras de CCTV profissionais, controle de acesso e alarmes contra intrusões.', displayOrder: 1 },
      { id: 'cat-2', name: 'Informática', slug: 'informatica', icon: 'Laptop', banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', description: 'Equipamentos de redes, servidores de alta performance, computadores empresariais e assessoria técnica.', displayOrder: 2 },
      { id: 'cat-3', name: 'Eletricidade', slug: 'eletricidade', icon: 'Zap', banner: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80', description: 'Projetos e montagem elétrica industrial ou residencial, quadros elétricos e cablagens estruturadas.', displayOrder: 3 }
    ];
    try {
      const q = query(collection(db, 'categories'));
      const querySnapshot = await getDocs(q);
      
      let list: CategoryItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as CategoryItem);
      });

      const hasOldCategories = list.some(c => 
        c.slug?.includes('construcao') || 
        c.slug?.includes('acabamento') ||
        c.slug?.includes('construction') ||
        c.slug?.includes('finishing') ||
        c.name?.toLowerCase().includes('construção') ||
        c.name?.toLowerCase().includes('acabamento')
      );
      const hasInformatica = list.some(c => c.slug === 'informatica');

      if (hasOldCategories || !hasInformatica || querySnapshot.empty) {
        // Safe database self-cleaning routine
        try {
          for (const docSnap of querySnapshot.docs) {
            await deleteDoc(doc(db, 'categories', docSnap.id));
          }
          for (const cat of INITIAL_CATEGORIES) {
            await setDoc(doc(db, 'categories', cat.id), cat);
          }
        } catch (seedingError) {
          console.warn('Seeding updated categories skipped/failed:', seedingError);
        }
        setLocal('categories', INITIAL_CATEGORIES);
        return INITIAL_CATEGORIES;
      }

      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setLocal('categories', list);
      return list;
    } catch (e) {
      console.warn('Firestore categories read failed, using fallback.', e);
      return getLocal<CategoryItem[]>('categories', INITIAL_CATEGORIES);
    }
  },

  async saveCategory(category: CategoryItem): Promise<void> {
    try {
      await setDoc(doc(db, 'categories', category.id), category);
    } catch (e) {
      console.warn('Firestore category write failed.', e);
    }
    const current = getLocal<CategoryItem[]>('categories', []);
    const index = current.findIndex(c => c.id === category.id);
    if (index > -1) {
      current[index] = category;
    } else {
      current.push(category);
    }
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    setLocal('categories', current);
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {
      console.warn('Firestore cat delete failed.', e);
    }
    const current = getLocal<CategoryItem[]>('categories', []);
    setLocal('categories', current.filter(c => c.id !== id));
  },

  // --- SUBCATEGORIES ---
  async getSubcategories(): Promise<SubcategoryItem[]> {
    const INITIAL_SUBCATEGORIES: SubcategoryItem[] = [];
    try {
      const q = query(collection(db, 'subcategories'));
      const querySnapshot = await getDocs(q);
      
      let list: SubcategoryItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as SubcategoryItem);
      });

      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setLocal('subcategories', list);
      return list;
    } catch (e) {
      console.warn('Firestore subcategories read failed, using fallback.', e);
      return getLocal<SubcategoryItem[]>('subcategories', INITIAL_SUBCATEGORIES);
    }
  },

  async saveSubcategory(subcategory: SubcategoryItem): Promise<void> {
    try {
      await setDoc(doc(db, 'subcategories', subcategory.id), subcategory);
    } catch (e) {
      console.warn('Firestore subcategory write failed.', e);
    }
    const current = getLocal<SubcategoryItem[]>('subcategories', []);
    const index = current.findIndex(sc => sc.id === subcategory.id);
    if (index > -1) {
      current[index] = subcategory;
    } else {
      current.push(subcategory);
    }
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    setLocal('subcategories', current);
  },

  async deleteSubcategory(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'subcategories', id));
    } catch (e) {
      console.warn('Firestore subcategory delete failed.', e);
    }
    const current = getLocal<SubcategoryItem[]>('subcategories', []);
    setLocal('subcategories', current.filter(sc => sc.id !== id));
  },

  // --- SERVICES ---
  async getServices(): Promise<ServiceItem[]> {
    const INITIAL_SERVICES: ServiceItem[] = [
      { id: 'srv-1', title: 'Instalação de Sistemas de CCTV', tag: 'Segurança Eletrónica', description: 'Monitoramento contínuo em ultra alta definição com processamento analítico de movimentações suspeitas.', benefits: ['Visão noturna avançada infravermelho', 'Integração móvel e alarmes integrados', 'Gravações em Cloud redundantes'], icon: 'Camera', displayOrder: 1 },
      { id: 'srv-2', title: 'Marcenaria sob Medida de Luxo', tag: 'Mobiliário Planejado', description: 'Mobiliário corporativo e residencial planejado sob as exatas dimensões do local com ferragens alemãs premium.', benefits: ['Aproveitamento inteligente de 100% do espaço', 'Acabamento em laca alto brilho e naval durável', 'Instalação silenciosa inclusa'], icon: 'PenTool', displayOrder: 2 },
      { id: 'srv-3', title: 'Informática & Infraestrutura de Redes', tag: 'Informática', description: 'Instalação de cabeamento estruturado, servidores de dados e redes Wi-Fi empresariais de alta performance e densidade.', benefits: ['Cabeamento de rede certificado Cat6/Cat6A profissional', 'Roteadores Wi-Fi Mesh de alta densidade sem quebras de sinal', 'Segurança contra intrusões de rede com Firewalls robustos'], icon: 'Laptop', displayOrder: 3 }
    ];
    try {
      const q = query(collection(db, 'services'));
      const querySnapshot = await getDocs(q);
      
      let list: ServiceItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as ServiceItem);
      });

      const hasOldServices = list.some(s => 
        s.tag?.toLowerCase().includes('construção') || 
        s.title?.toLowerCase().includes('construção')
      );

      if (hasOldServices || querySnapshot.empty) {
        try {
          for (const docSnap of querySnapshot.docs) {
            await deleteDoc(doc(db, 'services', docSnap.id));
          }
          for (const srv of INITIAL_SERVICES) {
            await setDoc(doc(db, 'services', srv.id), srv);
          }
        } catch (seedingError) {
          console.warn('Seeding services failed:', seedingError);
        }
        setLocal('services', INITIAL_SERVICES);
        return INITIAL_SERVICES;
      }

      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setLocal('services', list);
      return list;
    } catch (e) {
      console.warn('Firestore services read failed, using fallback.', e);
      return getLocal<ServiceItem[]>('services', INITIAL_SERVICES);
    }
  },

  async saveService(service: ServiceItem): Promise<void> {
    try {
      await setDoc(doc(db, 'services', service.id), service);
    } catch (e) {
      console.warn('Firestore service write failed.', e);
    }
    const current = getLocal<ServiceItem[]>('services', []);
    const index = current.findIndex(s => s.id === service.id);
    if (index > -1) {
      current[index] = service;
    } else {
      current.push(service);
    }
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    setLocal('services', current);
  },

  async deleteService(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn('Firestore service delete failed.', e);
    }
    const current = getLocal<ServiceItem[]>('services', []);
    setLocal('services', current.filter(s => s.id !== id));
  },

  // --- SHOPPING REQUESTS ---
  async getShoppingRequests(): Promise<ShoppingRequest[]> {
    const INITIAL_SHOPPING: ShoppingRequest[] = [
      { id: 'shop-1', customerName: 'Felipe Mendes', phone: '+244921384752', email: 'felipe@gmail.com', products: [{ productId: 'sec-01', name: 'Câmera IP Speed Dome Hikvision Pro', quantity: 2, price: 34000 }], totalItems: 2, generatedMessage: 'Olá MIRCA, tenho interesse na compra de 2 unidades de Câmera IP Speed Dome Hikvision Pro.', timestamp: new Date(Date.now() - 36000000).toISOString(), status: 'pending' },
      { id: 'shop-2', customerName: 'Ana Paula Neves', phone: '+244933481230', products: [{ productId: 'furn-01', name: 'Cozinha Planejada Luxo Gourmet', quantity: 1 }], totalItems: 1, generatedMessage: 'Olá MIRCA, quero solicitar visita técnica no Huambo para planejar minha Cozinha Gourmet.', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'contacted' }
    ];
    try {
      const q = query(collection(db, 'shoppingRequests'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<ShoppingRequest[]>('shoppingRequests', INITIAL_SHOPPING);
        try {
          for (const sr of initial) {
            await setDoc(doc(db, 'shoppingRequests', sr.id), sr);
          }
        } catch (seedingError) {
          console.warn('Seeding shoppingRequests skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: ShoppingRequest[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as ShoppingRequest);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocal('shoppingRequests', list);
      return list;
    } catch (e) {
      console.warn('Firestore shoppingRequests read failed, using fallback.', e);
      return getLocal<ShoppingRequest[]>('shoppingRequests', INITIAL_SHOPPING);
    }
  },

  async saveShoppingRequest(request: ShoppingRequest): Promise<void> {
    try {
      await setDoc(doc(db, 'shoppingRequests', request.id), request);
    } catch (e) {
      console.warn('Firestore shopping write failed.', e);
    }
    const current = getLocal<ShoppingRequest[]>('shoppingRequests', []);
    const index = current.findIndex(s => s.id === request.id);
    if (index > -1) {
      current[index] = request;
    } else {
      current.push(request);
    }
    current.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    setLocal('shoppingRequests', current);
  },

  async updateShoppingStatus(id: string, status: ShoppingRequest['status']): Promise<void> {
    try {
      await setDoc(doc(db, 'shoppingRequests', id), { status }, { merge: true });
    } catch (e) {
      console.warn('Firestore shopping status update failed.', e);
    }
    const current = getLocal<ShoppingRequest[]>('shoppingRequests', []);
    const index = current.findIndex(s => s.id === id);
    if (index > -1) {
      current[index].status = status;
    }
    setLocal('shoppingRequests', current);
  },

  async deleteShoppingRequest(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'shoppingRequests', id));
    } catch (e) {
      console.warn('Firestore shopping delete failed.', e);
    }
    const current = getLocal<ShoppingRequest[]>('shoppingRequests', []);
    setLocal('shoppingRequests', current.filter(s => s.id !== id));
  },

  // --- BANNERS ---
  async getBanners(): Promise<BannerItem[]> {
    const INITIAL_BANNERS: BannerItem[] = [
      { id: 'ban-1', headline: 'Segurança Eletrónica De Topo e Engenharia de Confiança em Angola', subtitle: 'A MIRCA LDA desenvolve soluções corporativas e residenciais com altíssima precisão e durabilidade certificada no Huambo.', bgImage: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1600&q=80', buttonText: 'Explore o Nosso Catálogo', buttonLink: '/produtos', priority: 1, active: true },
      { id: 'ban-2', headline: 'Mobiliário Planejado de Marceneiros Especialistas', subtitle: 'Cozinhas gourmet, escritórios integrados e armários automatizados sob as dimensões do seu lar.', bgImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80', buttonText: 'Fazer Orçamento Rápido', buttonLink: '/orcamento', priority: 2, active: true }
    ];
    try {
      const q = query(collection(db, 'banners'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<BannerItem[]>('banners', INITIAL_BANNERS);
        try {
          for (const banner of initial) {
            await setDoc(doc(db, 'banners', banner.id), banner);
          }
        } catch (seedingError) {
          console.warn('Seeding banners skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: BannerItem[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as BannerItem);
      });
      list.sort((a, b) => a.priority - b.priority);
      setLocal('banners', list);
      return list;
    } catch (e) {
      return getLocal<BannerItem[]>('banners', INITIAL_BANNERS);
    }
  },

  async saveBanner(banner: BannerItem): Promise<void> {
    try {
      await setDoc(doc(db, 'banners', banner.id), banner);
    } catch (e) {
      console.warn('Firestore banner save failed.', e);
    }
    const current = getLocal<BannerItem[]>('banners', []);
    const index = current.findIndex(b => b.id === banner.id);
    if (index > -1) {
      current[index] = banner;
    } else {
      current.push(banner);
    }
    current.sort((a, b) => a.priority - b.priority);
    setLocal('banners', current);
  },

  async deleteBanner(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {
      console.warn('Firestore banner delete failed.', e);
    }
    const current = getLocal<BannerItem[]>('banners', []);
    setLocal('banners', current.filter(b => b.id !== id));
  },

  // --- WEBSITE CONTENT CMS ---
  async getWebsiteContent(): Promise<WebsiteContent> {
    const INITIAL_CONTENT: WebsiteContent = {
      id: 'general-cms',
      history: 'Fundada no ano de 2021 na província do Huambo, a MIRCA LDA iniciou sua trajetória focada em oferecer soluções completas de segurança eletrónica de altíssimo nível. Com o passar do tempo e o aumento da equipe de engenheiros seniores e marceneiros especialistas, a empresa expandiu suas operações consolidando-se como referência unificada em Engenharia Civil, Acabamentos Premium de Gesso Cartonado, e Marcenaria de Luxo em todo o território angolano.',
      mission: 'Prover inovação, durabilidade extrema e proteção insustentável ao património dos nossos clientes através de engenharia ética e artesanato refinado.',
      vision: 'Ser a empresa líder indiscutível de soluções integradas de infraestrutura residencial e corporativa em Angola até 2030.',
      values: ['Profissionalismo Estrito', 'Proteção e Confiabilidade', 'Inovação Tecnológica', 'Acabamento Sem Gaps'],
      phone: '+244 948 170 046',
      email: 'mirca_prestacaodeservico@outlook.com',
      address: 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola',
      hours: 'Segunda - Sábado: 08:00 - 18:00',
      facebook: 'https://www.facebook.com/mirca',
      instagram: 'https://www.instagram.com/mirca',
      linkedin: 'https://linkedin.com/company/mirca',
      mapEmbed: '-12.7766, 15.7323',
      specSectionSubtitle: 'Nossas Atuações',
      specSectionTitle: 'Áreas de Especialização MIRCA',
      specSectionDesc: 'Integramos tecnologia, engenharia e design de interiores refinado para prover resultados estéticos e de extrema proteção técnica.',
      specArea1Title: 'Segurança Eletrónica',
      specArea1Desc: 'CCTV IP de alta resolução, alarmes inteligentes Ajax, controle de acesso biométrico e barreiras automáticas.',
      specArea2Title: 'Mobiliário Planejado',
      specArea2Desc: 'Projetos de marcenaria sob medida de alto padrão para cozinhas sofisticadas, roupeiros luxuosos e escritórios.',
      specArea3Title: 'Informática & Redes',
      specArea3Desc: 'Cabeamento estruturado, servidores locais, switches administráveis, redes Wi-Fi Mesh de alta densidade e assistência de TI.',

      // New CMS page fields
      // About page
      aboutHeroSubtitle: 'Sobre a MIRCA',
      aboutHeroTitle: 'Nossa História, Valores e Compromisso',
      aboutHeroDesc: 'Conheça mais sobre a trajetória da MIRCA LDA e as metas que pautam nossa entrega no mercado angolano.',
      aboutStorySubtitle: 'Soluções Corporativas',
      aboutStoryTitle: 'Comprometimento com Engenharia e Design de Alto Nível',
      aboutStoryText1: 'A MIRCA – Comércio e Prestação de Serviços, LDA foi fundada em 2021 com foco ambicioso: suprir a necessidade de integrações técnicas refinadas na província do Huambo e províncias vizinhas.',
      aboutStoryText2: 'Entendemos que uma residência ou escritório necessita de segurança absoluta de dados eletrónicos e monitoramento, mas também de harmonia estética e móveis práticos. Unificamos essas três forças (Construção, Marcenaria e Segurança) num único parceiro de confiança absoluta, reduzindo cansaço mecânico de múltiplos fornecedores.',
      aboutStoryImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      aboutYearsText: '5+ Anos',
      aboutYearsSub: 'No Coração de Huambo',
      aboutTimelineJson: JSON.stringify([
        { year: '2021', title: 'Fundação da MIRCA no Huambo', desc: 'A MIRCA iniciou suas atividades com foco em instalações hidráulicas e infraestrutura civil e rede de segurança fundamental.' },
        { year: '2022', title: 'Abertura do Atelier de Marcenaria', desc: 'Expandimos nossos serviços criando uma divisão dedicada ao mobiliário planejado e projetos customizados em 3D.' },
        { year: '2023', title: 'Parcerias Internacionais', desc: 'Consolidação de parcerias técnicas com marcas de renome de segurança eletrónica como Hikvision, Yale e Ajax Systems.' },
        { year: '2025', title: 'Liderança no Setor Regional', desc: 'Consolidação como uma das referências principais de soluções estruturais integradas na província do Huambo.' }
      ]),
      aboutCoreValuesJson: JSON.stringify([
        { title: 'Qualidade Extrema', desc: 'Seleção minuciosa de madeira naval certificada e hardware de topo europeu.' },
        { title: 'Tecnologia Conectada', desc: 'Alarmes e CCTV perfeitamente integrados com interfaces móveis robustas.' },
        { title: 'Sustentabilidade', desc: 'Gerenciamento inteligente de resíduos de obras e uso de tintas ecológicas.' },
        { title: 'Compromisso com o Cliente', desc: 'Atendimento corporativo e residencial prestativo, do projeto à assistência pós-entrega.' }
      ]),
      timeline1Year: '2021',
      timeline1Title: 'Fundação da MIRCA no Huambo',
      timeline1Desc: 'A MIRCA iniciou suas atividades com foco em instalações hidráulicas e infraestrutura civil e rede de segurança fundamental.',
      timeline2Year: '2022',
      timeline2Title: 'Abertura do Atelier de Marcenaria',
      timeline2Desc: 'Expandimos nossos serviços criando uma divisão dedicada ao mobiliário planejado e projetos customizados em 3D.',
      timeline3Year: '2023',
      timeline3Title: 'Parcerias Internacionais',
      timeline3Desc: 'Consolidação de parcerias técnicas com marcas de renome de segurança eletrónica como Hikvision, Yale e Ajax Systems.',
      timeline4Year: '2025',
      timeline4Title: 'Liderança no Setor Regional',
      timeline4Desc: 'Consolidação como uma das referências principais de soluções estruturais integradas na província do Huambo.',
      diff1Title: 'Qualidade Extrema',
      diff1Desc: 'Seleção minuciosa de madeira naval certificada e hardware de topo europeu.',
      diff2Title: 'Tecnologia Conectada',
      diff2Desc: 'Alarmes e CCTV perfeitamente integrados com interfaces móveis robustas.',
      diff3Title: 'Sustentabilidade',
      diff3Desc: 'Gerenciamento inteligente de resíduos de obras e uso de tintas ecológicas.',
      diff4Title: 'Compromisso com o Cliente',
      diff4Desc: 'Atendimento corporativo e residencial prestativo, do projeto à assistência pós-entrega.',

      // Services page
      servicesHeroSubtitle: 'Serviços Profissionais',
      servicesHeroTitle: 'Nossas Áreas de Competência',
      servicesHeroDesc: 'Desenvolvemos engenharia sofisticada, marcenaria sob medida e segurança para projetos comerciais, residenciais e institucionais com máxima garantia.',
      servicesWorkflowSubtitle: 'Etapas Mirca',
      servicesWorkflowTitle: 'Nosso Fluxo de Trabalho Garantido',
      step1Title: 'Visita & Levantamento',
      step1Desc: 'Realizamos medições a laser gratuitas no local de obra ou recolhemos a planta civil.',
      step2Title: 'Projeto 3D & Orçamento',
      step2Desc: 'Nossos projetistas geram simulações estéticas ou de câmeras para análise detalhada de custos.',
      step3Title: 'Execução de Elite',
      step3Desc: 'Técnicos certificados instalam ou fabricam os materiais com acabamentos nivelados limpos.',
      step4Title: 'Entrega & Assistência',
      step4Desc: 'Formalizamos termo de aprovação do cliente com instruções de uso e suporte contínuo.',
      servicesTestimonialSubtitle: 'Garantia Comprovada',
      servicesTestimonialTitle: 'O que dizem as empresas clientes da MIRCA?',
      servicesTestimonialDesc: 'Nossas parcerias de monitorização e engenharia com empresas angolanas estendem confiança no mercado local.',

      // Service Categories (1 - Security)
      service1Title: 'Segurança Eletrónica Inteligente',
      service1Desc: 'Sistemas inteligentes integrados por rádio e IP para cobrir condomínios, agências financeiras e vivendas com segurança de redundância militar.',
      service1Image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80',
      service1Brands: 'Hikvision, Intelbras, Ajax Systems, Yale, Ajax Pro',
      service1Benefit1: 'CCTV IP inteligente de 4MP com alertas em canais de rádio dedicados',
      service1Benefit2: 'Controle de acessos com biometria facial anti-spoofing e cartões UHF',
      service1Benefit3: 'Dispositivos de alarmes anti-sabotagem sem fios com baterias auxiliares de 16h',
      service1Benefit4: 'Criação de Centrais de Operação integradas de segurança sob medida',

      // Service Categories (2 - Furniture)
      service2Title: 'Mobiliário Planejado & Marcenaria',
      service2Desc: 'Fabricação artesanal associada a cortes mecânicos de alta fidelidade para originar móveis perfeitamente ajustados à sua planta.',
      service2Image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      service2Brands: 'Blum, Häfele, MIRCA Atelier Design',
      service2Benefit1: 'MDF naval de 18mm tratado contra fungos e humidade com laca resistente',
      service2Benefit2: 'Amortecedores inteligentes de trilhos invisíveis de patente alemã',
      service2Benefit3: 'Projetos elaborados em modelagem 3D antes da validação de fabricação',
      service2Benefit4: 'Ajustabilidade total de nichos práticos e closets com iluminação',

      // Service Categories (3 - IT / Informática)
      service3Title: 'Informática, Redes & Servidores',
      service3Desc: 'Cabeamento estruturado estrutural de rede, instalação de servidores, switches gerenciáveis e rede sem fios estável.',
      service3Image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      service3Brands: 'Ubiquiti, Cisco, Mikrotik, TP-Link, Intelbras',
      service3Benefit1: 'Cabeamento Cat6/Cat6A certificado com calhas organizadoras de rack',
      service3Benefit2: 'Sistemas Wi-Fi 6 Mesh profissionais para centenas de utilizadores estáveis',
      service3Benefit3: 'Configuração de Servidores NAS, redundância de backups e controle de acessos',
      service3Benefit4: 'Instalação de firewalls inteligentes de segurança de perímetro de rede',

      // Service Categories (4 - Maintenance)
      service4Title: 'Suporte & Manutenção Preventiva',
      service4Desc: 'Planos corporativos anuais para certificar o bom funcionamento e redundância de fechaduras, alarmes, bombas de água e elétricas prediais.',
      service4Image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      service4Brands: 'MIRCA Pro Support',
      service4Benefit1: 'Visitas regulares de aferição técnica de cabeamento estruturado e lentes de câmeras',
      service4Benefit2: 'Substituição imediata de componentes com defeito inclusa nos pacotes de suporte',
      service4Benefit3: 'Limpeza profunda e recalibração de trilhos de gavetas e portas de correr de marcenaria',
      service4Benefit4: 'Monitorização de software e bases de dados de acessos biométricos prediais',

      // Gallery page
      galleryHeroSubtitle: 'Galeria Multimédia',
      galleryHeroTitle: 'Nossos Detalhes Visuais',
      galleryHeroDesc: 'Acompanhe fotos reais de peças de marcenaria concluídas, painéis IP instalados e andamento das nossas obras em Angola.',

      // Contact page
      contactHeroSubtitle: 'Fale Connosco',
      contactHeroTitle: 'Contacte os Nossos Escritórios',
      contactHeroDesc: 'Estamos prontos para elaborar orçamentos e agendar vistorias gratuitas à sua residência, loja ou indústria.',
      contactIntroSubtitle: 'Atendimento Dedicado',
      contactIntroTitle: 'Canais de Ajuda Rápida',
      contactIntroDesc: 'Damos preferência aos contactos de WhatsApp para cotações instantâneas de alarmes e orçamentos, mas respondemos a mails em até 24 horas úteis.',
      contactWorkingHours: 'Segunda a Sábado: 08:00h - 18:00h | Domingo: Encerrado'
    };
    try {
      const snap = await getDoc(doc(db, 'websiteContent', 'general-cms'));
      if (snap.exists()) {
        const item = snap.data() as WebsiteContent;
        setLocal('website_content', item);
        return item;
      }
      try {
        await setDoc(doc(db, 'websiteContent', 'general-cms'), INITIAL_CONTENT);
      } catch (seedingError) {
        console.warn('Seeding website content general-cms skipped/failed (unauthenticated visitor):', seedingError);
      }
      return INITIAL_CONTENT;
    } catch (e) {
      return getLocal<WebsiteContent>('website_content', INITIAL_CONTENT);
    }
  },

  async saveWebsiteContent(content: WebsiteContent): Promise<void> {
    try {
      await setDoc(doc(db, 'websiteContent', 'general-cms'), content);
    } catch (e) {
      console.warn('Firestore saveWebsiteContent failed.', e);
    }
    setLocal('website_content', content);
  },

  // --- TESTIMONIALS ---
  async getTestimonials(): Promise<Testimonial[]> {
    const INITIAL_TESTIMONIALS: Testimonial[] = [
      { id: 'test-1', clientName: 'Dr. Manuel Augusto', company: 'Diretor de Operações - Soluções Integradas Huambo', photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'A MIRCA transformou inteiramente nossa matriz comercial. A instalação da segurança eletrónica e CCTV foi minuciosa e nos trouxe extrema tranquilidade.', displayOrder: 1, featured: true },
      { id: 'test-2', clientName: 'Engª Sandra Costa', company: 'Residencial Terras de Angola', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Cozinha planejada com altíssima qualidade. O gesso cartonado e os flutuantes valorizaram demais nossa habitação.', displayOrder: 2, featured: true }
    ];
    try {
      const q = query(collection(db, 'testimonials'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
        try {
          for (const item of initial) {
            await setDoc(doc(db, 'testimonials', item.id), item);
          }
        } catch (seedingError) {
          console.warn('Seeding testimonials skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: Testimonial[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as Testimonial);
      });
      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setLocal('testimonials', list);
      return list;
    } catch (e) {
      return getLocal<Testimonial[]>('testimonials', INITIAL_TESTIMONIALS);
    }
  },

  async saveTestimonial(testimonial: Testimonial): Promise<void> {
    try {
      await setDoc(doc(db, 'testimonials', testimonial.id), testimonial);
    } catch (e) {
      console.warn('Firestore testimonial write failed.', e);
    }
    const current = getLocal<Testimonial[]>('testimonials', []);
    const index = current.findIndex(t => t.id === testimonial.id);
    if (index > -1) {
      current[index] = testimonial;
    } else {
      current.push(testimonial);
    }
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    setLocal('testimonials', current);
  },

  async deleteTestimonial(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      console.warn('Firestore testimonial delete failed.', e);
    }
    const current = getLocal<Testimonial[]>('testimonials', []);
    setLocal('testimonials', current.filter(t => t.id !== id));
  },

  // --- PARTNERS ---
  async getPartners(): Promise<Partner[]> {
    const INITIAL_PARTNERS: Partner[] = [
      { id: 'part-1', name: 'Aliança Segurança Angola', logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&q=80', website: 'https://mirca.com', displayOrder: 1 },
      { id: 'part-2', name: 'Carpintaria Central Huambo', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80', website: 'https://mirca.com', displayOrder: 2 }
    ];
    try {
      const q = query(collection(db, 'partners'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<Partner[]>('partners', INITIAL_PARTNERS);
        try {
          for (const item of initial) {
            await setDoc(doc(db, 'partners', item.id), item);
          }
        } catch (seedingError) {
          console.warn('Seeding partners skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: Partner[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as Partner);
      });
      list.sort((a, b) => a.displayOrder - b.displayOrder);
      setLocal('partners', list);
      return list;
    } catch (e) {
      return getLocal<Partner[]>('partners', INITIAL_PARTNERS);
    }
  },

  async savePartner(partner: Partner): Promise<void> {
    try {
      await setDoc(doc(db, 'partners', partner.id), partner);
    } catch (e) {
      console.warn('Firestore partner write failed.', e);
    }
    const current = getLocal<Partner[]>('partners', []);
    const index = current.findIndex(p => p.id === partner.id);
    if (index > -1) {
      current[index] = partner;
    } else {
      current.push(partner);
    }
    current.sort((a, b) => a.displayOrder - b.displayOrder);
    setLocal('partners', current);
  },

  async deletePartner(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'partners', id));
    } catch (e) {
      console.warn('Firestore partner delete failed.', e);
    }
    const current = getLocal<Partner[]>('partners', []);
    setLocal('partners', current.filter(p => p.id !== id));
  },

  // --- SYSTEM SETTINGS ---
  async getSystemSettings(): Promise<SystemSettings> {
    const INITIAL_SETTINGS: SystemSettings = {
      id: 'system-settings',
      siteName: 'MIRCA LDA',
      logoUrl: '',
      faviconUrl: '',
      businessAddress: 'Cidade Alta, Edifício dos Correios, 1º Andar, Huambo, Angola',
      phoneNumber: '+244 948170046',
      whatsappNumber: '244948170046',
      businessEmail: 'mirca_prestacaodeservico@outlook.com',
      socialFacebook: 'https://www.facebook.com/mirca',
      socialInstagram: 'https://www.instagram.com/mirca',
      seoDefaultTitle: 'MIRCA LDA | Segurança Eletrónica, Obras Civis e Móveis Planejados',
      seoDefaultDescription: 'As melhores soluções em CCTV, portões automáticos, gesso cartonado, porcelanatos e móveis residenciais sob medida no Huambo, Angola.',
      footerCopyright: '© 2026 MIRCA LDA. Todos os direitos reservados.'
    };
    try {
      const snap = await getDoc(doc(db, 'settings', 'system-settings'));
      if (snap.exists()) {
        const item = snap.data() as SystemSettings;
        setLocal('system_settings', item);
        return item;
      }
      try {
        await setDoc(doc(db, 'settings', 'system-settings'), INITIAL_SETTINGS);
      } catch (seedingError) {
        console.warn('Seeding settings skipped/failed (unauthenticated visitor):', seedingError);
      }
      return INITIAL_SETTINGS;
    } catch (e) {
      return getLocal<SystemSettings>('system_settings', INITIAL_SETTINGS);
    }
  },

  async saveSystemSettings(settings: SystemSettings): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'system-settings'), settings);
    } catch (e) {
      console.warn('Firestore settings write failed.', e);
    }
    setLocal('system_settings', settings);
  },

  // --- ACTIVITY LOGS ---
  async getActivityLogs(): Promise<ActivityLog[]> {
    const INITIAL_LOGS: ActivityLog[] = [
      { id: 'log-1', action: 'login', details: 'Sessão administrativa iniciada com sucesso.', timestamp: new Date().toISOString(), user: 'Administrador MIRCA', role: 'admin' }
    ];
    try {
      const q = query(collection(db, 'activityLogs'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<ActivityLog[]>('activity_logs', INITIAL_LOGS);
        try {
          for (const log of initial) {
            await setDoc(doc(db, 'activityLogs', log.id), log);
          }
        } catch (seedingError) {
          console.warn('Seeding activity logs skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: ActivityLog[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as ActivityLog);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLocal('activity_logs', list);
      return list;
    } catch (e) {
      checkError(e, OperationType.LIST, 'activityLogs');
      return getLocal<ActivityLog[]>('activity_logs', INITIAL_LOGS);
    }
  },

  async addActivityLog(log: Omit<ActivityLog, 'id' | 'timestamp'>): Promise<void> {
    const id = 'log_' + Math.random().toString(36).substr(2, 9);
    const newLog: ActivityLog = {
      ...log,
      id,
      timestamp: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'activityLogs', id), newLog);
    } catch (e) {
      checkError(e, OperationType.WRITE, `activityLogs/${id}`);
      console.warn('Firestore log write failed.', e);
    }
    const current = getLocal<ActivityLog[]>('activity_logs', []);
    current.unshift(newLog);
    setLocal('activity_logs', current.slice(0, 100)); // cap at 100 logs in cache
  },

  // --- USERS / PERMISSIONS ---
  async getUserProfiles(): Promise<UserProfile[]> {
    const INITIAL_USERS: UserProfile[] = [
      { uid: 'admin-mirca', email: 'tiagopw07@gmail.com', name: 'Tiago Admin', role: 'admin', phone: '+244 948170046', status: 'active', permissions: ['all_access'], lastLogin: new Date().toISOString(), createdAt: '2026-01-01T08:00:00Z' },
      { uid: 'admin-mirca-servico', email: 'mirca_prestacaodeservico@outlook.com', name: 'Mirca Serviços', role: 'admin', phone: '+244 948170046', status: 'active', permissions: ['all_access'], lastLogin: new Date().toISOString(), createdAt: '2026-01-01T08:00:00Z' },
      { uid: 'employee-1', email: 'mirca_funcionario@outlook.com', name: 'Engenheiro Carlos', role: 'employee', phone: '+244 912345678', status: 'active', permissions: ['read_catalog', 'manage_quotes', 'manage_shopping'], lastLogin: new Date(Date.now() - 50000000).toISOString(), createdAt: '2026-03-12T09:00:00Z' }
    ];
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        const initial = getLocal<UserProfile[]>('users', INITIAL_USERS);
        try {
          for (const user of initial) {
            await setDoc(doc(db, 'users', user.uid), user);
          }
        } catch (seedingError) {
          console.warn('Seeding user profiles skipped/failed (unauthenticated visitor):', seedingError);
        }
        return initial;
      }
      const list: UserProfile[] = [];
      querySnapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data() } as UserProfile);
      });
      setLocal('users', list);
      return list;
    } catch (e) {
      checkError(e, OperationType.LIST, 'users');
      return getLocal<UserProfile[]>('users', INITIAL_USERS);
    }
  },

  async saveUserProfile(user: UserProfile): Promise<void> {
    try {
      await setDoc(doc(db, 'users', user.uid), user);
    } catch (e) {
      checkError(e, OperationType.WRITE, `users/${user.uid}`);
      console.warn('Firestore user write failed.', e);
    }
    const current = getLocal<UserProfile[]>('users', []);
    const index = current.findIndex(u => u.uid === user.uid);
    if (index > -1) {
      current[index] = user;
    } else {
      current.push(user);
    }
    setLocal('users', current);
  },

  async deleteUserProfile(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (e) {
      checkError(e, OperationType.DELETE, `users/${uid}`);
      console.warn('Firestore user Delete failed.', e);
    }
    const current = getLocal<UserProfile[]>('users', []);
    setLocal('users', current.filter(u => u.uid !== uid));
  },

  async reseedAllCollections(): Promise<void> {
    try {
      localStorage.clear();
      await seedDatabase(true);
    } catch (e) {
      console.error('Falha reseed manual', e);
    }
  }
};

