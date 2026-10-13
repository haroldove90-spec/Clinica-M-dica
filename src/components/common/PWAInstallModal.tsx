import React from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { X, Download, Share, PlusSquare, Smartphone, Laptop, Check } from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isIOS, isInstalled, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-sky-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">Instalar Clinica Médica</h3>
              <p className="text-[11px] text-slate-500">Acceso rápido sin conexión en móvil o PC</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs sm:text-sm text-slate-700">
          {isInstalled ? (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900">Aplicación ya instalada</h4>
              <p className="text-xs text-slate-600">
                La aplicación ya se encuentra instalada en este dispositivo y está operando en modo nativo.
              </p>
            </div>
          ) : isInstallable ? (
            <div className="space-y-4">
              <p className="text-slate-600">
                Instala la aplicación en tu pantalla de inicio o escritorio para una experiencia a pantalla completa, tiempos de respuesta instantáneos y acceso sin barras del navegador.
              </p>
              <button
                onClick={handleNativeInstall}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                <Download className="w-5 h-5" />
                Instalar Ahora
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-sky-600" />
                Instrucciones para iPhone / iPad (Safari):
              </h4>
              <ol className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-800">1.</span>
                  <span>Toca el botón <strong>Compartir</strong> <Share className="w-3.5 h-3.5 inline mx-1 text-sky-600" /> en la barra inferior de Safari.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-800">2.</span>
                  <span>Desliza hacia abajo y presiona <strong>Agregar a pantalla de inicio</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-sky-600" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold text-slate-800">3.</span>
                  <span>Presiona <strong>Agregar</strong> en la esquina superior derecha.</span>
                </li>
              </ol>

              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 pt-2">
                <Laptop className="w-4 h-4 text-teal-600" />
                En Chrome, Edge o Computadoras:
              </h4>
              <p className="text-xs text-slate-600">
                Haz clic en el icono de instalación que aparece a la derecha de la barra de direcciones del navegador o usa el menú del navegador → "Instalar Clinica Médica".
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg transition"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
