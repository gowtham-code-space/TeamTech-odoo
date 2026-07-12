import React, { useEffect } from 'react';
import { RiCloseLine } from 'react-icons/ri';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  closeOnBackdrop = true,
  closeOnEscape = true,
  size = 'md', // sm, md, lg, xl
  className = '',
}) {
  // Listen for Escape key press to dismiss modal
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, closeOnEscape]);

  // Block page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Backdrop Click
  const handleBackdropClick = (e) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Modal Dialog Card */}
      <div className={`w-full bg-white rounded-2xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden max-h-[90vh] animate-scale-up ${sizeClass} ${className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          {title ? (
            <h3 className="text-base md:text-lg font-bold text-slate-800 tracking-tight">
              {title}
            </h3>
          ) : (
            <div />
          )}
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
            title="Close dialog"
          >
            <RiCloseLine className="w-5.5 h-5.5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-600 space-y-4">
          {children}
        </div>

        {/* Footer Actions */}
        {footer && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
