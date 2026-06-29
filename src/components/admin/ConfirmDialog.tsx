import React from 'react';
import { AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'info' | 'success';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: <AlertTriangle className="w-6 h-6 text-rose-500" />,
      iconBg: 'bg-rose-50',
      confirmBtn: 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500',
      titleColor: 'text-gray-900',
    },
    info: {
      icon: <Info className="w-6 h-6 text-blue-500" />,
      iconBg: 'bg-blue-50',
      confirmBtn: 'bg-[#FF6B00] hover:bg-[#e05e00] text-white focus:ring-orange-500',
      titleColor: 'text-gray-900',
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
      iconBg: 'bg-green-50',
      confirmBtn: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
      titleColor: 'text-gray-900',
    }
  };

  const currentType = typeConfig[type] || typeConfig.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Dialog Body */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-6 relative z-10 transform transition-all duration-300 scale-100">
        <button 
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="flex gap-4 items-start">
          <div className={`p-2.5 rounded-xl ${currentType.iconBg} shrink-0`}>
            {currentType.icon}
          </div>
          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className={`font-bold ${currentType.titleColor} text-sm leading-6`}>
              {title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-gray-50 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-300"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentType.confirmBtn}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
