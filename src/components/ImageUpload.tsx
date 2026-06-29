import React, { useState, useRef } from 'react';
import { uploadImage, deleteImageByUrl } from '../services/storageService';
import { motion } from 'motion/react';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  aspectRatio?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  label = 'Imagem',
  aspectRatio = 'aspect-video'
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    setError('');
    setLoading(true);
    setProgress(0);

    const oldUrl = value;

    try {
      // 1. Upload new image directly to Storage with live progress
      const newUrl = await uploadImage(file, folder, (p) => {
        setProgress(p);
      });

      // 2. Clear old image from Storage immediately to prevent orphans
      if (oldUrl && oldUrl.startsWith('https://firebasestorage.googleapis.com')) {
        await deleteImageByUrl(oldUrl);
      }

      // 3. Set the new URL
      onChange(newUrl);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Erro ao realizar o upload da imagem.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');
    const oldUrl = value;
    if (!oldUrl) return;

    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setConfirmDelete(false);
    setLoading(true);
    try {
      if (oldUrl.startsWith('https://firebasestorage.googleapis.com')) {
        await deleteImageByUrl(oldUrl);
      }
      onChange('');
      setProgress(0);
    } catch (err: any) {
      setError('Erro ao remover imagem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block font-sans">
          {label}
        </label>
        {value && !loading && (
          <div className="flex items-center gap-2">
            {confirmDelete ? (
              <>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-[10px] font-extrabold text-rose-600 hover:underline uppercase tracking-widest flex items-center gap-1 cursor-pointer bg-red-50/50 px-2 py-0.5 rounded-lg border border-red-100"
                >
                  <Check className="w-3 h-3 text-rose-500" /> Confirmar?
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setConfirmDelete(false);
                  }}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest cursor-pointer"
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleRemove}
                className="text-[10px] font-extrabold text-rose-500 hover:underline uppercase tracking-widest flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Remover
              </button>
            )}
          </div>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-2xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all ${aspectRatio} ${
          dragActive ? 'border-[#FF6B00] bg-orange-50/5' : 'border-gray-200 hover:border-gray-350 bg-gray-50/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
          disabled={loading}
        />

        {value ? (
          // Preview state
          <div className="absolute inset-0 w-full h-full group">
            <img
              src={value}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
              alt="Preview"
              referrerPolicy="no-referrer"
            />
            {/* Overlay for hovering/changing */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button
                type="button"
                onClick={onButtonClick}
                className="bg-white hover:bg-[#FF6B00] hover:text-white text-[#202A50] font-extrabold text-[10px] uppercase tracking-wider py-2 px-4 rounded-xl shadow-md transition-all cursor-pointer"
              >
                Substituir Imagem
              </button>
              <span className="text-[9px] text-white/85 font-sans">Arraste um novo ficheiro aqui</span>
            </div>
          </div>
        ) : (
          // Empty upload trigger state
          <div className="p-6 text-center space-y-3 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00]">
              <Upload className="w-5 h-5 animate-bounce" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-700">
                Arraste e solte o ficheiro ou{' '}
                <button
                  type="button"
                  onClick={onButtonClick}
                  className="text-[#FF6B00] hover:underline focus:outline-none cursor-pointer"
                >
                  procure no computador
                </button>
              </p>
              <p className="text-[10px] text-gray-400 font-sans">
                Suporta PNG, JPG, WEBP e GIF (Máx 5MB)
              </p>
            </div>
          </div>
        )}

        {/* Upload Loading State */}
        {loading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 space-y-4">
            <Loader2 className="w-8 h-8 text-[#FF6B00] animate-spin" />
            <div className="w-full max-w-[200px] bg-gray-150 h-1.5 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#FF6B00] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <span className="text-xs font-extrabold text-gray-700 uppercase tracking-widest font-mono">
              A carregar... {progress}%
            </span>
          </div>
        )}

        {/* Drag Over Active Overlay */}
        {dragActive && (
          <div className="absolute inset-0 bg-orange-50/10 backdrop-blur-[2px] flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-[#FF6B00] text-white p-4 rounded-full shadow-lg">
              <Upload className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-[#FF6B00] mt-3 font-sans">
              Solte para iniciar o Upload
            </span>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-bold text-rose-500 font-sans flex items-center gap-1">
          <X className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}
