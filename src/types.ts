export type Category = string;

export interface Product {
  id: string;
  name: string;
  slug?: string;
  categoryId?: string;
  subcategoryId?: string;
  category: Category;
  description: string;
  shortDescription?: string;
  technicalSpecs: string[];
  applications?: string[];
  features?: string[];
  image: string;
  thumbnail?: string;
  galleryImages?: string[];
  inStock: boolean;
  brand?: string;
  price?: number;
  priceVisible?: boolean;
  featured?: boolean;
  isNew?: boolean;
  onSale?: boolean;
  displayOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug?: string;
  category: Category;
  description: string;
  client?: string;
  location: string;
  date: string;
  completionDate?: string;
  servicesUsed: string[];
  beforeImage?: string;
  afterImage: string;
  coverImage?: string;
  images: string[];
  galleryImages?: string[];
  videoLink?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: Category;
  image: string;
  description: string;
  createdAt?: string;
}

export interface QuotationRequest {
  id: string;
  name: string;
  phone: string;
  email: string;
  company?: string;
  service: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
  }[];
  projectDescription: string;
  budget?: string;
  deadline?: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  assignedEmployee?: string;
  notes?: string;
  attachments?: string[];
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  photo?: string;
  role: 'admin' | 'employee';
  permissions?: string[];
  status?: 'active' | 'inactive';
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Category Entity
export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  banner?: string;
  description: string;
  displayOrder: number;
}

// Subcategory Entity
export interface SubcategoryItem {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  icon: string;
  displayOrder: number;
}

// Service Entity
export interface ServiceItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  benefits: string[];
  gallery?: string[];
  icon: string;
  displayOrder: number;
  archived?: boolean;
}

// Shopping/Order request from site Cart
export interface ShoppingRequest {
  id: string;
  customerName: string;
  phone: string;
  email?: string;
  products: {
    productId: string;
    name: string;
    quantity: number;
    price?: number;
  }[];
  totalItems: number;
  generatedMessage: string;
  timestamp: string;
  status: 'pending' | 'contacted' | 'completed' | 'cancelled';
}

// Hero banners manager
export interface BannerItem {
  id: string;
  headline: string;
  subtitle: string;
  bgImage: string;
  buttonText: string;
  buttonLink: string;
  displaySchedule?: string;
  priority: number;
  active: boolean;
}

// CMS site editable settings block
export interface WebsiteContent {
  id: string;
  history: string;
  mission: string;
  vision: string;
  values: string[];
  phone: string;
  email: string;
  address: string;
  hours: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  mapEmbed?: string;
  // Home Section CMS
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroBgImage?: string;
  heroCtaText?: string;
  heroCtaLink?: string;
  // About Section CMS
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImage?: string;
  // Specialization Areas CMS (Section 2)
  specSectionSubtitle?: string;
  specSectionTitle?: string;
  specSectionDesc?: string;
  specArea1Title?: string;
  specArea1Desc?: string;
  specArea2Title?: string;
  specArea2Desc?: string;
  specArea3Title?: string;
  specArea3Desc?: string;

  // New CMS page fields
  // About page
  aboutHeroSubtitle?: string;
  aboutHeroTitle?: string;
  aboutHeroDesc?: string;
  aboutStorySubtitle?: string;
  aboutStoryTitle?: string;
  aboutStoryText1?: string;
  aboutStoryText2?: string;
  aboutStoryImage?: string;
  aboutYearsText?: string;
  aboutYearsSub?: string;
  aboutTimelineJson?: string;
  aboutCoreValuesJson?: string;
  timeline1Year?: string;
  timeline1Title?: string;
  timeline1Desc?: string;
  timeline2Year?: string;
  timeline2Title?: string;
  timeline2Desc?: string;
  timeline3Year?: string;
  timeline3Title?: string;
  timeline3Desc?: string;
  timeline4Year?: string;
  timeline4Title?: string;
  timeline4Desc?: string;
  diff1Title?: string;
  diff1Desc?: string;
  diff2Title?: string;
  diff2Desc?: string;
  diff3Title?: string;
  diff3Desc?: string;
  diff4Title?: string;
  diff4Desc?: string;

  // Services page
  servicesHeroSubtitle?: string;
  servicesHeroTitle?: string;
  servicesHeroDesc?: string;
  servicesWorkflowSubtitle?: string;
  servicesWorkflowTitle?: string;
  step1Title?: string;
  step1Desc?: string;
  step2Title?: string;
  step2Desc?: string;
  step3Title?: string;
  step3Desc?: string;
  step4Title?: string;
  step4Desc?: string;
  servicesTestimonialSubtitle?: string;
  servicesTestimonialTitle?: string;
  servicesTestimonialDesc?: string;

  // Service Categories
  service1Title?: string;
  service1Desc?: string;
  service1Image?: string;
  service1Brands?: string;
  service1Benefit1?: string;
  service1Benefit2?: string;
  service1Benefit3?: string;
  service1Benefit4?: string;

  service2Title?: string;
  service2Desc?: string;
  service2Image?: string;
  service2Brands?: string;
  service2Benefit1?: string;
  service2Benefit2?: string;
  service2Benefit3?: string;
  service2Benefit4?: string;

  service3Title?: string;
  service3Desc?: string;
  service3Image?: string;
  service3Brands?: string;
  service3Benefit1?: string;
  service3Benefit2?: string;
  service3Benefit3?: string;
  service3Benefit4?: string;

  service4Title?: string;
  service4Desc?: string;
  service4Image?: string;
  service4Brands?: string;
  service4Benefit1?: string;
  service4Benefit2?: string;
  service4Benefit3?: string;
  service4Benefit4?: string;

  // Gallery page
  galleryHeroSubtitle?: string;
  galleryHeroTitle?: string;
  galleryHeroDesc?: string;

  // Contact page
  contactHeroSubtitle?: string;
  contactHeroTitle?: string;
  contactHeroDesc?: string;
  contactIntroSubtitle?: string;
  contactIntroTitle?: string;
  contactIntroDesc?: string;
  contactWorkingHours?: string;
}

// Brand partners
export interface Partner {
  id: string;
  name: string;
  logo: string;
  website?: string;
  displayOrder: number;
}

// Testimonials of clients
export interface Testimonial {
  id: string;
  clientName: string;
  photo: string;
  company: string;
  rating: number;
  comment: string;
  displayOrder: number;
  featured: boolean;
}

// Professional audit logging
export interface ActivityLog {
  id: string;
  action: 'login' | 'logout' | 'create' | 'edit' | 'delete' | 'archive' | 'restore';
  details: string;
  timestamp: string;
  user: string;
  role: string;
}

// Global System Settings info
export interface SystemSettings {
  id: string;
  siteName: string;
  logoUrl?: string;
  whiteLogoUrl?: string;
  darkLogoUrl?: string;
  faviconUrl?: string;
  companySlogan?: string;
  businessAddress: string;
  phoneNumber: string;
  whatsappNumber: string;
  businessEmail: string;
  socialFacebook?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  seoDefaultTitle: string;
  seoDefaultDescription: string;
  seoKeywords?: string;
  seoOgImage?: string;
  footerCopyright?: string;
}
