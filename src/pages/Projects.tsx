import { useState, useEffect } from 'react';
import { PROJECTS_DATA } from '../constants/mockData';
import { Project } from '../types';
import { MapPin, Calendar, LayoutGrid, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { dbService } from '../services/dbService';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'furniture' | 'informatica'>('all');
  const [viewCompareId, setViewCompareId] = useState<string | null>(null);
  const [activeImageIndexes, setActiveImageIndexes] = useState<Record<string, number>>({});
  const [dbProjects, setDbProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let active = true;
    const fetchProjects = async () => {
      try {
        const projects = await dbService.getProjects();
        if (active && projects) {
          setDbProjects(projects);
        }
      } catch (err) {
        console.error('Error fetching projects in Portfolio page', err);
      }
    };
    fetchProjects();
    return () => {
      active = false;
    };
  }, []);

  const projectsSource = dbProjects !== null ? dbProjects : PROJECTS_DATA;

  const filteredProjects = selectedCategory === 'all' 
    ? projectsSource 
    : projectsSource.filter(p => p.category === selectedCategory);

  const handleNextImage = (projId: string, maxImages: number) => {
    setActiveImageIndexes(prev => {
      const current = prev[projId] || 0;
      return { ...prev, [projId]: (current + 1) % maxImages };
    });
  };

  const handlePrevImage = (projId: string, maxImages: number) => {
    setActiveImageIndexes(prev => {
      const current = prev[projId] || 0;
      return { ...prev, [projId]: (current - 1 + maxImages) % maxImages };
    });
  };

  return (
    <div className="space-y-24 pb-16">
      
      {/* Portfolio Hero */}
      <section className="relative bg-[#202A50] text-white py-24 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-overlay"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1500&q=80")' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 space-y-4 font-sans">
          <span className="text-[#FF6B00] text-xs font-bold tracking-widest uppercase block">Portfólio de Obras</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">Nossos Projetos Concluídos</h1>
          <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full" />
          <p className="text-sm text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Explorar trabalhos e instalações executados com rigor técnico pela equipa da MIRCA em Angola.
          </p>
        </div>
      </section>

      {/* Portfolio Grid and Filters */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Simple Filters */}
        <div className="flex justify-center gap-3 mb-16 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'Todos os Projetos' },
            { id: 'security', label: 'Segurança Eletrónica' },
            { id: 'furniture', label: 'Mobiliário Planejado' },
            { id: 'informatica', label: 'Informática & Redes' }
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

        {/* Portfolio items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((p) => {
            const currentImgIndex = activeImageIndexes[p.id] || 0;
            const imagesList = p.images || [p.afterImage];

            return (
              <div 
                key={p.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  
                  {/* Image gallery carousel structure */}
                  <div className="h-64 bg-gray-100 relative group overflow-hidden">
                    <img 
                      src={imagesList[currentImgIndex]} 
                      className="w-full h-full object-cover transition-opacity duration-300" 
                      alt="" 
                    />
                    
                    {/* Carousel navigation arrows */}
                    {imagesList.length > 1 && (
                      <>
                        <button 
                          onClick={() => handlePrevImage(p.id, imagesList.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#202A50]/80 p-1.5 rounded-full text-white hover:bg-[#FF6B00] transition-colors"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleNextImage(p.id, imagesList.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#202A50]/80 p-1.5 rounded-full text-white hover:bg-[#FF6B00] transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {/* Compare buttons label */}
                    {p.beforeImage && (
                      <button 
                        onClick={() => setViewCompareId(p.id)}
                        className="absolute bottom-4 left-4 bg-[#FF6B00] text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-[#202A50] transition-colors"
                      >
                        Antes / Depois
                      </button>
                    )}

                    <span className="absolute top-4 right-4 bg-[#202A50]/95 text-white text-[9px] font-bold tracking-wider px-3 py-1 rounded-md uppercase">
                      {p.category}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-[11px] text-[#FF6B00] font-bold">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {p.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {p.date}</span>
                    </div>

                    <h3 className="font-extrabold text-xl text-[#202A50]">{p.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.description}</p>
                    
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Serviços Utilizados</span>
                      <div className="flex flex-wrap gap-1.5">
                        {p.servicesUsed.map((srv, idx) => (
                          <span key={idx} className="bg-gray-100 text-[#202A50] text-[9.5px] font-medium px-2.5 py-1 rounded-md border border-gray-100 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-[#FF6B00]" />
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="p-6 pt-0 border-t border-gray-50 mt-4">
                  <span className="text-[10px] text-gray-400 block pt-4">Garantia estrutural de engenharia inclusa.</span>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* BEFORE / AFTER IMAGES POPUP COMPARE COMPONENT */}
      {viewCompareId && (() => {
        const found = projectsSource.find(p => p.id === viewCompareId);
        if (!found) return null;
        return (
          <div className="fixed inset-0 z-50 bg-[#202A50]/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-white/10">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#FF6B00] uppercase block">Comparação Estética de Obra</span>
                  <h4 className="font-extrabold text-[#202A50] text-lg">{found.title}</h4>
                </div>
                <button 
                  onClick={() => setViewCompareId(null)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 bg-gray-50">
                {/* Before Image */}
                <div className="space-y-2">
                  <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-md inline-block">Antes do Projeto (Estado Inicial)</span>
                  <div className="rounded-2xl overflow-hidden h-72 bg-gray-300 relative border border-gray-200">
                    <img src={found.beforeImage || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80'} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/10" />
                  </div>
                </div>

                {/* After Image */}
                <div className="space-y-2">
                  <span className="bg-orange-100 text-[#FF6B00] text-xs font-bold px-3 py-1 rounded-md inline-block">Depois do Projeto (Entrega MIRCA)</span>
                  <div className="rounded-2xl overflow-hidden h-72 bg-gray-300 relative border border-gray-200">
                    <img src={found.afterImage} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-[#202A50]/10" />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 text-center text-xs text-gray-500">
                Executado com segurança, marcenaria planejada integrada e acompanhamento profissional.
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
