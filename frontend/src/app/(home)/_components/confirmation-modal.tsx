'use client';

import Swal from 'sweetalert2';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  type = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  // SweetAlert2 ile modal göster
  Swal.fire({
    title: title,
    text: message,
    icon: type === 'danger' ? 'warning' : type === 'warning' ? 'warning' : 'info',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: type === 'danger' ? '#ef4444' : type === 'warning' ? '#f59e0b' : '#3b82f6',
    cancelButtonColor: '#6b7280',
    reverseButtons: true,
    allowOutsideClick: false,
    allowEscapeKey: true,
    customClass: {
      popup: 'rounded-2xl shadow-2xl border-0 bg-white dark:bg-gray-800',
      confirmButton: 'rounded-lg font-medium px-6 py-2.5 transition-all duration-200 hover:scale-105',
      cancelButton: 'rounded-lg font-medium px-6 py-2.5 transition-all duration-200 hover:scale-105',
      title: 'text-xl font-semibold text-gray-800 dark:text-white',
      htmlContainer: 'text-gray-600 dark:text-gray-300',
      icon: 'text-gray-800 dark:text-white',
      actions: 'gap-3'
    },
    buttonsStyling: true,
    backdrop: `
      rgba(0, 0, 0, 0.6)
      url("data:image/svg+xml,%3csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c2.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3e%3c/svg%3e")
      left top
      no-repeat
    `,
    didOpen: () => {
      // Karanlık tema kontrolü
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.backgroundColor = '#1f2937'; // dark:bg-gray-800
          popup.style.color = '#f9fafb'; // dark:text-white
        }
      }
    }
  }).then((result) => {
    if (result.isConfirmed) {
      onConfirm();
    }
    onClose();
  });

  return null;
}
