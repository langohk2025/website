/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const NewsletterSignup: React.FC = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Replace with your actual Mailchimp form URL (change post to post-json)
    const url = 'https://lango.us21.list-manage.com/subscribe/post-json?u=0dd87b14f2798445bae85ed49&amp;id=df6f87d646&amp;f_id=00d99ae6f0';
    
    // Create JSONP request
    const script = document.createElement('script');
    const callbackName = `mailchimp_callback_${Date.now()}`;
    
    // Define callback function
    (window as any)[callbackName] = (data: any) => {
      if (data.result === 'success') {
        setStatus('success');
        setMessage(t('newsletter.success'));
        setEmail('');
      } else {
        setStatus('error');
        // Clean up HTML tags from Mailchimp error messages
        const cleanMessage = data.msg ? data.msg.replace(/<[^>]*>/g, '') : t('newsletter.error');
        setMessage(cleanMessage);
      }
      
      // Cleanup
      document.head.removeChild(script);
      delete (window as any)[callbackName];
    };
    
    // Handle script loading errors
    script.onerror = () => {
      setStatus('error');
      setMessage(t('newsletter.networkError'));
      document.head.removeChild(script);
      delete (window as any)[callbackName];
    };
    
    script.src = `${url}&EMAIL=${encodeURIComponent(email)}&c=${callbackName}`;
    document.head.appendChild(script);
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm border border-purple-300">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-4xl font-bold mb-6 text-purple-600">
            {t('newsletter.title')}
            </h2>
            <p className="text-xl mb-4 max-w-2xl mx-auto">
            {t('newsletter.description')}
            </p>
            
            <input
            type="email"
            placeholder={t('newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-gradient-to-r from-purple-600 rounded-md to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
            >
            {status === 'loading' ? t('newsletter.subscribing') : t('newsletter.subscribe')}
            </button>
        </form>
        
        {message && (
            <div className={`mt-3 p-3 rounded-md ${
            status === 'success' 
                ? 'bg-purple-50 border border-purple-200 text-purple-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
            <p className="text-sm">{message}</p>
            </div>
        )}
        </div>
    </div>
    </section>
  );
};

export default NewsletterSignup;
