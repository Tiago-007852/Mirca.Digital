import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, Laptop, Zap, Armchair, HardHat, Paintbrush, 
  LayoutGrid, Award, ArrowRight, Sparkles 
} from 'lucide-react';
import { dbService } from '../services/dbService';
import { CategoryItem } from '../types';

// Pre-selected Icons catalog for visual matching
const ICON_MAP: Record<string, any> = {
  Shield: Shield,
  Laptop: Laptop,
  Zap: Zap,
  Armchair: Armchair,
  HardHat: HardHat,
  Paintbrush: Paintbrush,
  LayoutGrid: LayoutGrid,
  Award: Award
};

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getCategories().then((list) => {
      // Sort categories by displayOrder
      const sorted = [...list].sort((a, b) => (a.displayOrder || 1) - (b.displayOrder || 1));
      setCategories(sorted);
      setLoading(false);
    }).catch((err) => {
      console.error('Error loading categories:', err);
      // Fallback local categories
      const fallback: CategoryItem[] = [
        { id: 'cat-1', name: 'Segurança Eletrónica', slug: 'seguranca-eletronica', icon: 'Shield', banner: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80', description: 'Vigilância inteligente, câmaras de CCTV profissionais, controle de acesso e alarmes contra intrusões.', displayOrder: 1 },
        { id: 'cat-2', name: 'Informática', slug: 'informatica', icon: 'Laptop', banner: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80', description: 'Equipamentos de redes, servidores de alta performance, computadores empresariais e assessoria técnica.', displayOrder: 2 },
        { id: 'cat-3', name: 'Eletricidade', slug: 'eletricidade', icon: 'Zap', banner: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80', description: 'Projetos e montagem elétrica industrial ou residencial, quadros elétricos e cablagens estruturadas.', displayOrder: 3 }
      ];
      setCategories(fallback);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-20 pb-20">
      
      {/* Category Hero Header */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        {/* Abstract graphics overlays */}
        <div className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1500&q=80")' }} />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF6B00] rounded-full filter blur-[150px] opacity-10 -mr-40 -mt-40 animate-pulse" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Divisões Estruturais
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">Categorias do Catálogo</h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Navegue por nossas principais divisões comerciais e encontre equipamentos de precisão calibrada com garantia de assistência oficial MIRCA.
          </p>
        </div>
      </section>

      {/* Categories Grid Stage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Carregando divisões comerciais...</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
            {categories.map((cat, i) => {
              const defaultBanner = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80';
              
              return (
                <motion.div
                  key={cat.id || cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  onClick={() => navigate(`/categorias/${cat.slug}`)}
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all duration-300 cursor-pointer flex flex-col p-2"
                >
                  <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden relative">
                    <img 
                      src={cat.banner || defaultBanner} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      alt={cat.name} 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="py-3 px-1 text-center">
                    <h3 className="font-extrabold text-[11px] sm:text-xs text-[#202A50] group-hover:text-[#FF6B00] transition-colors leading-tight line-clamp-2">
                      {cat.name}
                    </h3>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
}
