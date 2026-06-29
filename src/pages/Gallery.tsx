import React, { useState, useEffect } from 'react';
import { GALLERY_DATA } from '../constants/mockData';
import { GalleryItem, WebsiteContent } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, ChevronLeft, ChevronRight, X, Play } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'furniture' | 'informatica'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [content, setContent] = useState<WebsiteContent | null>(null);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [cmsData, itemsData] = await Promise.all([
          dbService.getWebsiteContent(),
          dbService.getGallery()
        ]);
        setContent(cmsData);
        // Fallback to static mock data if Firestore has no custom photos added yet
        if (itemsData && itemsData.length > 0) {
          setGalleryItems(itemsData);
        } else {
          setGalleryItems(GALLERY_DATA);
        }
      } catch (err) {
        console.error('Erro ao ler a galeria dinamicamente', err);
        setGalleryItems(GALLERY_DATA);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Gallery Hero */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">
            {content?.galleryHeroSubtitle || 'Galeria Multimédia'}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white font-sans">
            {content?.galleryHeroTitle || 'Nossos Detalhes Visuais'}
          </h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {content?.galleryHeroDesc || 'Acompanhe fotos reais de peças de marcenaria concluídas, painéis IP instalados e andamento das nossas obras em Angola.'}
          </p>
        </div>
      </section>

      {/* Real multi-category Masonry list */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple filtering tabs */}
        <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Toda a Galeria' },
            { id: 'security', label: 'Segurança Eletrónica' },
            { id: 'furniture', label: 'Mobiliário' },
            { id: 'informatica', label: 'Informática' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-[#202A50] text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Sincronizando fotos da galeria...
          </div>
        ) : (
          /* Masonry Styled layout */
          <motion.div 
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6"
          >
            {filteredItems.map((item, idx) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid bg-white border border-gray-100/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group cursor-pointer relative"
              >
                <div className="relative overflow-hidden">
                  <img src={item.image} className="w-full h-auto max-h-[440px] hover:scale-102 transition-transform duration-500 object-cover" alt="" />
                  
                  {/* Overlay details */}
                  <div className="absolute inset-0 bg-[#202A50]/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 z-10 text-white">
                    <span className="text-[9px] uppercase font-bold text-[#FF6B00] tracking-widest">{item.category}</span>
                    <p className="font-bold text-sm tracking-tight">{item.title}</p>
                    <span className="text-[10px] text-gray-200 mt-1 flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Ampliar</span>
                  </div>
                </div>
                <div className="p-4 bg-white border-t border-gray-50">
                  <h4 className="font-bold text-xs text-[#202A50]">{item.title}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            Nenhuma foto disponível para esta categoria técnica atualmente.
          </div>
        )}

      </section>

      {/* LIGHTBOX POPUP COMPONENT */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#202A50]/95 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white bg-white/10 p-2.5 rounded-full hover:bg-[#FF6B00] hover:text-[#202A50] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl w-full flex items-center justify-between gap-4">
              {/* Prev Button */}
              <button 
                onClick={handlePrev}
                className="bg-white/10 p-3 rounded-full text-white hover:bg-[#FF6B00] hover:text-[#202A50] transition-all shrink-0"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Central Expanded image */}
              <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                <img 
                  src={filteredItems[lightboxIndex].image} 
                  className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl" 
                  alt="" 
                />
                
                <div className="text-center text-white space-y-1 max-w-lg">
                  <span className="text-[10px] text-[#FF6B00] font-bold uppercase tracking-widest">{filteredItems[lightboxIndex].category}</span>
                  <h4 className="font-extrabold text-lg">{filteredItems[lightboxIndex].title}</h4>
                  <p className="text-xs text-gray-300">{filteredItems[lightboxIndex].description}</p>
                </div>
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNext}
                className="bg-white/10 p-3 rounded-full text-white hover:bg-[#FF6B00] hover:text-[#202A50] transition-all shrink-0"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
