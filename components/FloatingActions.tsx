import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, Plus, X } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export default function FloatingActions() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === 'ar';

  const contactActions = [
    {
      icon: MessageCircle,
      label: isArabic ? 'واتساب' : 'WhatsApp',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => window.open('https://wa.me/966501234567', '_blank')
    },
    {
      icon: Phone,
      label: isArabic ? 'اتصال' : 'Call',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => window.open('tel:+966501234567', '_self')
    },
    {
      icon: Mail,
      label: isArabic ? 'إيميل' : 'Email',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => window.open('mailto:info@m-clean.net', '_self')
    }
  ];

  return (
    <div className={`fixed ${isArabic ? 'left-6' : 'right-6'} top-1/2 -translate-y-1/2 z-50 flex flex-col items-center space-y-3`}>
      {/* Main Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg 
          transition-all duration-300 transform hover:scale-105 active:scale-95
          flex items-center justify-center group
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
        aria-label={isArabic ? 'قائمة الاتصال' : 'Contact Menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <Plus className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>

      {/* Action Buttons */}
      <div className={`
        flex flex-col space-y-3 transition-all duration-300 transform
        ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'}
      `}>
        {contactActions.map((action, index) => (
          <div
            key={index}
            className={`
              flex items-center space-x-3 transition-all duration-300 transform
              ${isArabic ? 'flex-row-reverse space-x-reverse' : 'flex-row'}
              ${isOpen ? 'translate-x-0 opacity-100' : `${isArabic ? 'translate-x-4' : '-translate-x-4'} opacity-0`}
            `}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Label */}
            <div className={`
              px-3 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white 
              rounded-lg shadow-lg text-sm font-medium whitespace-nowrap
              border border-gray-200 dark:border-gray-700
              ${isArabic ? 'mr-2' : 'ml-2'}
              ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
            `}>
              {action.label}
            </div>

            {/* Action Button */}
            <button
              onClick={action.action}
              className={`
                w-12 h-12 rounded-full ${action.color} text-white shadow-lg
                transition-all duration-200 transform hover:scale-105 active:scale-95
                flex items-center justify-center
              `}
              aria-label={action.label}
            >
              <action.icon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Background Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
