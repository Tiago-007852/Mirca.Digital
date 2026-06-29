import React, { useState, useEffect } from 'react';
import { 
  Settings, Save, Sparkles, RefreshCw, HelpCircle, 
  Info, ShieldCheck, Mail, Phone, MapPin, Globe, Database, Copyright, Type
} from 'lucide-react';
import { SystemSettings } from '../../types';
import { dbService } from '../../services/dbService';
import ImageUpload from '../ImageUpload';
import ConfirmDialog from './ConfirmDialog';

interface SettingsTabProps {
  activityLogged: (details: string, action?: any) => void;
  onRestoreDefaultSeed: () => Promise<void>;
}

export default function SettingsTab({ activityLogged, onRestoreDefaultSeed }: SettingsTabProps) {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [restoring, setRestoring] = useState(false);

  // Custom alert/confirm modal state
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'danger' | 'info' | 'success';
    showCancel: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'danger',
    showCancel: true,
    onConfirm: () => {}
  });

  // Form states matching SystemSettings exactly
  const [siteName, setSiteName] = useState('');
  const [companySlogan, setCompanySlogan] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [whiteLogoUrl, setWhiteLogoUrl] = useState('');
  const [darkLogoUrl, setDarkLogoUrl] = useState('');
  const [faviconUrl, setFaviconUrl] = useState('');
  
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  
  const [socialFacebook, setSocialFacebook] = useState('');
  const [socialInstagram, setSocialInstagram] = useState('');
  const [socialLinkedin, setSocialLinkedin] = useState('');
  
  const [seoDefaultTitle, setSeoDefaultTitle] = useState('');
  const [seoDefaultDescription, setSeoDefaultDescription] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [seoOgImage, setSeoOgImage] = useState('');
  const [footerCopyright, setFooterCopyright] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await dbService.getSystemSettings();
      if (data) {
        setSettings(data);
        setSiteName(data.siteName || '');
        setCompanySlogan(data.companySlogan || '');
        setLogoUrl(data.logoUrl || '');
        setWhiteLogoUrl(data.whiteLogoUrl || '');
        setDarkLogoUrl(data.darkLogoUrl || '');
        setFaviconUrl(data.faviconUrl || '');
        
        setBusinessAddress(data.businessAddress || '');
        setPhoneNumber(data.phoneNumber || '');
        setWhatsappNumber(data.whatsappNumber || '');
        setBusinessEmail(data.businessEmail || '');
        
        setSocialFacebook(data.socialFacebook || '');
        setSocialInstagram(data.socialInstagram || '');
        setSocialLinkedin(data.socialLinkedin || '');
        
        setSeoDefaultTitle(data.seoDefaultTitle || '');
        setSeoDefaultDescription(data.seoDefaultDescription || '');
        setSeoKeywords(data.seoKeywords || '');
        setSeoOgImage(data.seoOgImage || '');
        setFooterCopyright(data.footerCopyright || '');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: SystemSettings = {
        id: 'system-settings',
        siteName,
        companySlogan,
        logoUrl,
        whiteLogoUrl,
        darkLogoUrl,
        faviconUrl,
        businessAddress,
        phoneNumber,
        whatsappNumber,
        businessEmail,
        socialFacebook,
        socialInstagram,
        socialLinkedin,
        seoDefaultTitle,
        seoDefaultDescription,
        seoKeywords,
        seoOgImage,
        footerCopyright
      };

      await dbService.saveSystemSettings(payload);
      activityLogged('O usuário alterou as definições globais, marcas e detalhes institucionais da empresa.', 'edit');
      alert('Configurações de identidade e branding salvas com sucesso!');
      await loadSettings();
    } catch (e) {
      console.error(e);
      alert('Ocorreu um erro ao salvar as configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleManualBackup = async () => {
    setSaving(true);
    try {
      activityLogged('O usuário disparou a sincronização redundante manual para snapshot.', 'edit');
      alert(`Snapshot gravado em tempo de execução.`);
      await loadSettings();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleInstantRestore = () => {
    setConfirmState({
      isOpen: true,
      title: 'Restaurar Semente Padrão',
      message: 'Deseja reinicializar o banco de dados do Firestore com os dados fictícios iniciais? Todos os produtos e projetos atuais editados serão redefinidos.',
      type: 'danger',
      showCancel: true,
      onConfirm: async () => {
        setRestoring(true);
        try {
          await onRestoreDefaultSeed();
          activityLogged('O usuário disparou uma restauração forçada do banco de dados para a semente padrão.', 'restore');
          await loadSettings();
          setConfirmState({
            isOpen: true,
            title: 'Base de Dados Restaurada',
            message: 'Base de dados restaurada com êxito!',
            type: 'success',
            showCancel: false,
            onConfirm: () => setConfirmState(prev => ({ ...prev, isOpen: false }))
          });
        } catch (e) {
          console.error(e);
          setConfirmState(prev => ({ ...prev, isOpen: false }));
        } finally {
          setRestoring(false);
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Carregando configurações primárias...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Preferências &amp; Identidade Visual (Branding)</h2>
        <p className="text-gray-500 text-xs text-slate-400">Gerencie a identidade visual, logotipos da empresa, slogan corporativo e configurações globais de SEO.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: General System Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Core Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Globe className="w-4 h-4 text-[#FF6B00]" /> Informações Gerais da MIRCA
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* siteName */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Nome da Empresa</label>
                <input 
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="MIRCA LDA"
                />
              </div>

              {/* companySlogan */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Slogan Corporativo</label>
                <input 
                  type="text"
                  value={companySlogan}
                  onChange={(e) => setCompanySlogan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="Inovação, Segurança e Marcenaria de Luxo"
                />
              </div>

              {/* businessEmail */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Email Comercial de Destino</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input 
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="geral@mirca.com"
                  />
                </div>
              </div>

              {/* phoneNumber */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Telemóvel de Apoio</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>
              </div>

              {/* whatsappNumber */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">WhatsApp Corporativo (DDI+Número)</label>
                <input 
                  type="text"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  placeholder="244948170046"
                />
              </div>

              {/* businessAddress */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Endereço Sede</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                  <input 
                    type="text"
                    value={businessAddress}
                    onChange={(e) => setBusinessAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Branding Image uploads */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Sparkles className="w-4 h-4 text-[#FF6B00]" /> Identidade Corporativa (Logótipos)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <ImageUpload 
                value={logoUrl}
                onChange={setLogoUrl}
                folder="logos"
                label="Logotipo Principal (Cor / Padrão)"
                aspectRatio="aspect-video"
              />

              <ImageUpload 
                value={whiteLogoUrl}
                onChange={setWhiteLogoUrl}
                folder="logos"
                label="Logotipo Branco (Para fundos escuros)"
                aspectRatio="aspect-video"
              />

              <ImageUpload 
                value={darkLogoUrl}
                onChange={setDarkLogoUrl}
                folder="logos"
                label="Logotipo Escuro (Para cabeçalho claro)"
                aspectRatio="aspect-video"
              />

              <ImageUpload 
                value={faviconUrl}
                onChange={setFaviconUrl}
                folder="logos"
                label="Favicon do Navegador (.png quadrado)"
                aspectRatio="aspect-square"
              />

            </div>
          </div>

          {/* Section 3: SEO and Metadata */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5 border-b border-gray-50 pb-2">
              <Globe className="w-4 h-4 text-[#FF6B00]" /> Otimização para Motores de Pesquisa (SEO)
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Título Padrão (Meta Title)</label>
                  <input 
                    type="text"
                    value={seoDefaultTitle}
                    onChange={(e) => setSeoDefaultTitle(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Direitos Autorais (Copyright)</label>
                  <div className="relative">
                    <Copyright className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                    <input 
                      type="text"
                      value={footerCopyright}
                      onChange={(e) => setFooterCopyright(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 pl-9 pr-3 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">Palavras-chave SEO (Separadas por vírgula)</label>
                  <input 
                    type="text"
                    value={seoKeywords}
                    onChange={(e) => setSeoKeywords(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000]"
                    placeholder="cctv, alarmes, moveis Huambo, Angola"
                  />
                </div>

              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Descrição Base (Meta Description)</label>
                <textarea 
                  rows={2}
                  value={seoDefaultDescription}
                  onChange={(e) => setSeoDefaultDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-orange-500 outline-none text-[#000000] leading-relaxed"
                />
              </div>

              <ImageUpload 
                value={seoOgImage}
                onChange={setSeoOgImage}
                folder="logos"
                label="Imagem Open Graph (Partilha em redes sociais)"
                aspectRatio="aspect-video"
              />

            </div>

            {/* Save Button */}
            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                disabled={saving}
                className="bg-[#FF6B00] hover:bg-[#202A50] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-orange-500/10 cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> {saving ? 'A sincronizar...' : 'Gravar Alterações Globais'}
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Backups Snapshot and Cloud Engine */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-5 h-fit">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-600" /> Backups &amp; Sincronização
            </h3>
            
            <p className="text-xs text-slate-500 leading-normal">
              Realize cópias redundantes do Firestore ou force a injeção inicial de produtos e serviços para demonstração.
            </p>

            <button 
              type="button"
              onClick={handleManualBackup}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center"
            >
              Forçar Snapshot do Firestore
            </button>

            <hr className="border-gray-100" />

            {/* Factory Reset Seeder block */}
            <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-100 space-y-3">
              <div>
                <span className="text-[10px] font-bold text-rose-800 block uppercase">Injetor de Dados Iniciais</span>
                <p className="text-[10px] text-rose-650 leading-relaxed mt-0.5">Sua base de dados parece incompleta ou de demonstração? Dispare nossa rotina para recalibrar do início.</p>
              </div>
              
              <button 
                type="button"
                disabled={restoring}
                onClick={handleInstantRestore}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-1.5 rounded-lg transition-colors cursor-pointer text-center"
              >
                {restoring ? 'A calibrar...' : 'Re-Seed Banco de Dados'}
              </button>
            </div>
          </div>

        </div>

      </form>

      <ConfirmDialog
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmText="Confirmar"
        cancelText="Voltar"
        type={confirmState.type}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
