import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../services/dbService';
import { 
  Product, Project, QuotationRequest, ActivityLog, UserProfile, CategoryItem, ShoppingRequest
} from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart3, ClipboardList, ShoppingBag, Plus, FolderTree, Hammer, Briefcase, 
  Image as ImageIcon, BookOpen, Users, History, Settings, LogOut, Menu, X, 
  ChevronLeft, ChevronRight, Bell, User as UserIcon, Sparkles, ShieldCheck, AlertCircle,
  ArrowLeft
} from 'lucide-react';

// Modular Tab views
import DashboardTab from '../components/admin/DashboardTab';
import ProductsTab from '../components/admin/ProductsTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import QuotationsTab from '../components/admin/QuotationsTab';
import ShoppingTab from '../components/admin/ShoppingTab';
import UsersTab from '../components/admin/UsersTab';
import ContentTab from '../components/admin/ContentTab';
import LogsTab from '../components/admin/LogsTab';
import SettingsTab from '../components/admin/SettingsTab';

type AdminTab = 
  | 'dashboard'
  | 'quotations'
  | 'shopping'
  | 'products'
  | 'categories'
  | 'content'
  | 'users'
  | 'logs'
  | 'settings';

export default function Admin() {
  const { userProfile, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Control sidebars
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // States list persistence
  const [quotations, setQuotations] = useState<QuotationRequest[]>([]);
  const [shoppingRequests, setShoppingRequests] = useState<ShoppingRequest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Load SaaS Database
  const loadData = async () => {
    if (!userProfile || !userProfile.uid) {
      console.warn('loadData abortado: nenhum utilizador autenticado.');
      return;
    }
    setLoading(true);
    try {
      const q = await dbService.getQuotations();
      const s = await dbService.getShoppingRequests();
      const p = await dbService.getProducts();
      const cats = await dbService.getCategories();
      const l = await dbService.getActivityLogs();
      setQuotations(q);
      setShoppingRequests(s);
      setProducts(p);
      setCategories(cats);
      setLogs(l);
    } catch (e) {
      console.error('Falha carregamento bancos de dados admin.', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !userProfile) {
      navigate('/admin/login');
      return;
    }
    if (userProfile) {
      loadData();
    }
  }, [userProfile, authLoading]);

  // Activity logging router
  const activityLogged = async (details: string, actionName?: 'create' | 'edit' | 'delete' | 'auth' | 'restore') => {
    try {
      await dbService.addActivityLog({
        details,
        action: (actionName as any) || 'edit',
        user: userProfile?.name || 'Administrador',
        role: userProfile?.role || 'admin'
      });
      // Reload logs timeline instanstly
      const l = await dbService.getActivityLogs();
      setLogs(l);
    } catch (e) {
      console.error(e);
    }
  };

  // Restore Default Seeds simulation
  const handleRestoreDefaultSeed = async () => {
    setLoading(true);
    try {
      await dbService.reseedAllCollections();
      activityLogged('Restaurou todos os bancos de dados para a semente fictícia original.', 'restore');
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50 text-xs font-semibold text-slate-500">
        Autenticando sessão segura...
      </div>
    );
  }

  // Navigation Items with structural segments grouping
  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Monitor Geral', icon: BarChart3, category: 'Painel' },
    { id: 'quotations', label: 'CRM Orçamentos', icon: ClipboardList, category: 'Atendimento' },
    { id: 'shopping', label: 'Pedidos Carrinho', icon: ShoppingBag, category: 'Atendimento' },
    { id: 'products', label: 'Catálogo Produtos', icon: Plus, category: 'Matriz' },
    { id: 'categories', label: 'Divisões Negócio', icon: FolderTree, category: 'Matriz' },
    { id: 'content', label: 'Conteúdos Globais', icon: BookOpen, category: 'Interface CMS' },
    { id: 'users', label: 'Equipe &amp; Portaria', icon: Users, category: 'Segurança' },
    { id: 'logs', label: 'Pistas de Auditoria', icon: History, category: 'Segurança' },
    { id: 'settings', label: 'Configurações', icon: Settings, category: 'Segurança' }
  ];

  // Grouped Navigation item builder
  const categoriesList = ['Painel', 'Atendimento', 'Matriz', 'Interface CMS', 'Segurança'];

  // Current Breadcrumb resolution label
  const activeLabel = NAV_ITEMS.find(n => n.id === activeTab)?.label.replace('&amp; ', ' & ') || 'Console';

  // Fine-grained checks
  const isMeAdmin = userProfile.role === 'admin';

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* DESKTOP SIDEBAR: Dark Blue Theme with generous proportions */}
      <aside 
        className={`hidden md:flex flex-col bg-[#202A50] text-[#E0E2EC] transition-all duration-300 ease-in-out shrink-0 border-r border-[#1a2342] ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#1a2342] shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B00] flex items-center justify-center font-black text-white shrink-0 shadow-lg shadow-orange-500/20">
              M
            </div>
            {!sidebarCollapsed && (
              <span className="font-extrabold text-white text-xs tracking-wider">MIRCA CONTROL</span>
            )}
          </div>

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1 rounded-lg hover:bg-[#1a2342] text-[#8E91A0] hover:text-white cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Scrollable menu slots grouped */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {categoriesList.map((cat) => {
            const items = NAV_ITEMS.filter(item => item.category === cat);
            
            return (
              <div key={cat} className="space-y-1.5">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-extrabold text-[#8D919F] uppercase tracking-widest pl-3 block">
                    {cat}
                  </span>
                )}
                
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button 
                        key={item.id}
                        onClick={() => setActiveTab(item.id as AdminTab)}
                        className={`w-full flex items-center gap-3 py-2.5 px-3 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                          isActive 
                            ? 'bg-[#FF6B00] text-white font-bold' 
                            : 'hover:bg-[#1a2342] text-[#C1C5D4] hover:text-white'
                        }`}
                        title={item.label}
                      >
                        <Icon className="w-4.5 h-4.5 shrink-0" />
                        {!sidebarCollapsed && <span className="truncate">{item.label.replace('&amp; ', ' & ')}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Sidebar Operator Footer Panel */}
        <div className="p-4 border-t border-[#1a2342] shrink-0 space-y-3 bg-[#161D37]">
          
          {/* Identity block */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img 
              src={userProfile.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
              className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#202A50]" 
              alt=""
            />
            {!sidebarCollapsed && (
              <div className="min-w-0 leading-tight">
                <h4 className="font-extrabold text-xs text-white truncate">{userProfile.name}</h4>
                <span className="text-[10px] text-[#A3A6B4] uppercase block font-mono">
                  {userProfile.role === 'admin' ? 'Coordenador' : 'Profissional'}
                </span>
              </div>
            )}
          </div>

          {!sidebarCollapsed ? (
            <div className="space-y-1.5 w-full">
              <Link
                to="/"
                className="w-full bg-[#2A3663]/60 hover:bg-[#FF6B00] text-white font-extrabold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#1a2342]/40"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Site
              </Link>
              <button 
                onClick={logout}
                className="w-full bg-[#202A50] hover:bg-red-900/40 text-[#C1C5D4] hover:text-red-200 font-extrabold text-xs py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[#1a2342]"
              >
                <LogOut className="w-3.5 h-3.5" /> Terminar Sessão
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 items-center w-full pt-1">
              <Link
                to="/"
                title="Voltar ao Site"
                className="p-2 bg-[#2A3663]/60 hover:bg-[#FF6B00] text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <button
                onClick={logout}
                title="Terminar Sessão"
                className="p-2 bg-[#202A50] hover:bg-red-900/40 text-[#C1C5D4] hover:text-red-200 rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </aside>

      {/* MOBILE RESPONSIVE DRAWER OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          
          <div className="relative flex flex-col w-5/6 max-w-xs h-full bg-[#202A50] text-[#E0E2EC] p-5 z-50 overflow-y-auto space-y-6">
            
            {/* Header mobile brand */}
            <div className="flex items-center justify-between border-b border-[#1a2342] pb-4">
              <span className="font-black text-white text-sm tracking-wider flex items-center gap-2">
                <span className="p-1 px-2.5 bg-[#FF6B00] rounded text-white font-extrabold">M</span> MIRCA CONTROL
              </span>
              <button onClick={() => setIsMobileOpen(false)} className="p-1 text-slate-350 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable lists */}
            <nav className="space-y-6 flex-1">
              {categoriesList.map((cat) => {
                const items = NAV_ITEMS.filter(it => it.category === cat);
                return (
                  <div key={cat} className="space-y-1">
                    <span className="text-[9px] font-bold text-[#8D919F] uppercase tracking-wider pl-2 block">{cat}</span>
                    <div className="space-y-0.5">
                      {items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button 
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id as AdminTab);
                              setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 py-2 px-3 rounded-lg text-xs font-semibold cursor-pointer ${
                              isActive ? 'bg-[#FF6B00] text-white font-bold' : 'hover:bg-[#1a2342] text-[#C1C5D4]'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                            <span>{item.label.replace('&amp; ', ' & ')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </nav>

            {/* Logout Mobile user info */}
            <div className="pt-4 border-t border-[#1a2342] space-y-3">
              <div className="flex items-center gap-2.5">
                <img src={userProfile.photo || ''} className="w-10 h-10 rounded-lg object-cover" alt="" />
                <div>
                  <h4 className="font-extrabold text-xs text-white">{userProfile.name}</h4>
                  <span className="text-[10px] text-[#A3A6B4] block uppercase font-mono">{userProfile.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Link 
                  to="/"
                  className="w-full bg-[#FF6B00] hover:bg-[#e05e00] text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Voltar ao Site
                </Link>
                <button 
                  onClick={logout}
                  className="w-full bg-[#161D37] hover:bg-rose-950/20 py-2 text-rose-500 rounded-xl font-bold text-xs transition-colors"
                >
                  Sair do Terminal
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MID SECTION & MAIN VIEW WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR HEADER: Breadcrumbs, Notifications, profiles */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0 z-10">
          
          <div className="flex items-center gap-4">
            
            {/* Mobile menu button trigger */}
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="p-1.5 md:hidden text-gray-600 hover:bg-slate-50 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Live Breadcrumbs trail */}
            <nav className="text-[11px] font-semibold text-gray-400 flex items-center gap-1.5 select-none">
              <span className="hover:text-gray-600 flex items-center gap-1">MIRCA</span>
              <span>/</span>
              <span className="text-[#FF6B00] font-extrabold uppercase tracking-wide">{activeLabel}</span>
            </nav>
          </div>

          <div className="flex items-center gap-3.5 relative">
            
            {/* Notifications panel toggle button */}
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 bg-slate-50 hover:bg-slate-100 text-gray-500 hover:text-gray-900 rounded-xl cursor-pointer transition-colors relative"
            >
              <Bell className="w-4.5 h-4.5" />
              {quotations.filter(q => q.status === 'pending').length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              )}
            </button>

            {/* User Profile display pill details */}
            <div className="flex items-center gap-2 p-1 px-2.5 bg-slate-50 border border-gray-100/50 rounded-xl select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <div className="hidden sm:block leading-none mr-1.5">
                <span className="text-[10px] text-gray-400 block font-bold leading-normal">OPERADOR</span>
                <span className="text-[11px] font-extrabold text-gray-800 font-sans">{userProfile.name.split(' ')[0]}</span>
              </div>
              <img 
                src={userProfile.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'} 
                className="w-7 h-7 rounded-lg object-cover shrink-0 shadow-sm border border-gray-100" 
                alt=""
              />
            </div>

            {/* Dynamic Dropdown notifications */}
            {notificationsOpen && (
              <div className="absolute right-0 top-12 bg-white rounded-2xl shadow-xl border border-gray-100 w-80 p-5 z-50 space-y-3.5">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                  <h4 className="font-bold text-xs text-gray-900">Notificações Recentes</h4>
                  <button onClick={() => setNotificationsOpen(false)} className="text-[10px] text-gray-400 hover:underline">Fechar</button>
                </div>
                
                <div className="divide-y divide-gray-50 max-h-[250px] overflow-y-auto space-y-1.5">
                  {quotations.filter(q => q.status === 'pending').slice(0, 3).map((q) => (
                    <div key={q.id} className="pt-2 text-[11px] leading-relaxed text-gray-600">
                      <span className="font-extrabold text-amber-700">Novo orçamento por triar:</span> do cliente <strong className="text-gray-900 font-extrabold">{q.name}</strong> para o serviço de "{q.service}".
                    </div>
                  ))}
                  {quotations.filter(q => q.status === 'pending').length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-[10px] italic">Nenhuma triagem urgente pendente no momento.</div>
                  )}
                </div>
              </div>
            )}

          </div>

        </header>

        {/* CONTAINER WORKSPACE FOR THE ACTIVE TAB COMPONENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 gap-3">
              <span className="w-8 h-8 rounded-full border-4 border-indigo-50 border-t-[#FF6B00] animate-spin shrink-0" />
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-gray-800 text-sm">Sincronização em Andamento</h4>
                <p className="text-xs text-gray-500 max-w-sm">A carregar registros operacionais seguros do Cloud Firestore...</p>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              
              {/* Tab 1: Dashboard overview */}
              {activeTab === 'dashboard' && (
                <DashboardTab 
                  quotations={quotations}
                  products={products}
                  categories={categories}
                  shoppingRequests={shoppingRequests}
                  activityLogs={logs}
                  onSetTab={(tab) => {
                    if (tab === 'cms') {
                      setActiveTab('content');
                    } else {
                      setActiveTab(tab as AdminTab);
                    }
                  }}
                />
              )}

              {/* Tab 2: Quotations CRM estimates */}
              {activeTab === 'quotations' && (
                <QuotationsTab 
                  quotations={quotations}
                  onRefresh={loadData}
                  activityLogged={activityLogged}
                />
              )}

              {/* Tab 3: Shopping requests cart */}
              {activeTab === 'shopping' && (
                <ShoppingTab 
                  activityLogged={activityLogged}
                />
              )}

              {/* Tab 4: Products Catalogue list */}
              {activeTab === 'products' && (
                <ProductsTab 
                  products={products}
                  onRefresh={loadData}
                  activityLogged={activityLogged}
                />
              )}

              {/* Tab 5: Divisions Categories */}
              {activeTab === 'categories' && (
                <CategoriesTab 
                  activityLogged={activityLogged}
                />
              )}

              {/* Tab 9: Content editor blocks */}
              {activeTab === 'content' && (
                <ContentTab 
                  activityLogged={activityLogged}
                />
              )}

              {/* Tab 10: Staff registry RBAC system */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  {!isMeAdmin ? (
                    <div className="bg-orange-50/55 border border-orange-200 p-8 rounded-2xl flex flex-col items-center text-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-[#FF6B00]" />
                      <h4 className="font-extrabold text-[#202A50] text-sm">Controle de Equipe Restrito</h4>
                      <p className="text-xs text-gray-500 max-w-sm">
                        O painel de controle de equipe e atribuições de níveis de segurança granulares é restrito apenas a coordenadores com conta de <strong>Super-Administrador</strong>.
                      </p>
                    </div>
                  ) : (
                    <UsersTab 
                      currentUser={userProfile}
                      activityLogged={activityLogged}
                    />
                  )}
                </div>
              )}

              {/* Tab 11: Security audit log logs */}
              {activeTab === 'logs' && (
                <div className="space-y-6">
                  {!isMeAdmin ? (
                    <div className="bg-orange-50/55 border border-orange-200 p-8 rounded-2xl flex flex-col items-center text-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-[#FF6B00]" />
                      <h4 className="font-extrabold text-[#202A50] text-sm">Pistas de Auditoria Restritas</h4>
                      <p className="text-xs text-gray-500 max-w-sm">
                        As pistas de auditoria completas e exclusão de registros de banco de dados por logs de sistema são guardados sob controle de <strong>Super-Administrador</strong>.
                      </p>
                    </div>
                  ) : (
                    <LogsTab 
                      logs={logs}
                      onRefresh={loadData}
                      activityLogged={activityLogged}
                    />
                  )}
                </div>
              )}

              {/* Tab 12: General and maintenance variables */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {!isMeAdmin ? (
                    <div className="bg-orange-50/55 border border-orange-200 p-8 rounded-2xl flex flex-col items-center text-center space-y-3">
                      <AlertCircle className="w-10 h-10 text-[#FF6B00]" />
                      <h4 className="font-extrabold text-[#202A50] text-sm">Privilégios Administrativos Necessários</h4>
                      <p className="text-xs text-gray-500 max-w-sm">
                        A alteração das chaves globais de contato, redirecionamentos e ativação do modo manutenção necessita de privilégio nível <strong>Super-Administrador</strong>.
                      </p>
                    </div>
                  ) : (
                    <SettingsTab 
                      activityLogged={activityLogged}
                      onRestoreDefaultSeed={handleRestoreDefaultSeed}
                    />
                  )}
                </div>
              )}

            </div>
          )}

        </main>

      </div>

    </div>
  );
}
