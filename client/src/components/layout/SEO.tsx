import React from 'react';
import { Helmet } from 'react-helmet-async';

type SEOProps = {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  keywords?: string;
  children?: React.ReactNode;
};

export default function SEO({
  title = 'მულტიფუნქციური აპლიკაცია - ქართული ციფრული ინსტრუმენტები',
  description = 'მულტიფუნქციური აპლიკაცია, რომელიც მოიცავს რეცეპტებს, სიახლეებს, ამინდის პროგნოზს, კალკულატორს და სხვა სასარგებლო ინსტრუმენტებს.',
  canonicalUrl,
  ogType = 'website',
  ogImage = '/og-image.jpg',
  keywords = 'ქართული რეცეპტები, სიახლეები, ამინდი, კალკულატორი, ტაიმერი, ვალუტის კურსი',
  children,
}: SEOProps) {
  // ბაზისური URL-ის განსაზღვრა (წინასწარ განსაზღვრული ან ამჟამინდელი)
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  // კანონიკური URL-ის ფორმირება
  const fullCanonicalUrl = canonicalUrl 
    ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${baseUrl}${canonicalUrl}`)
    : (typeof window !== 'undefined' ? window.location.href : '');
  
  // სრული OG სურათის URL
  const fullOgImage = ogImage?.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <Helmet>
      {/* ძირითადი მეტა ტეგები */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonicalUrl} />
      
      {/* Open Graph მეტა ტეგები */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="მულტიფუნქციური აპლიკაცია" />
      <meta property="og:locale" content="ka_GE" />
      
      {/* Twitter Card მეტა ტეგები */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* მობილური ოპტიმიზაცია */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#4F46E5" />
      
      {/* სხვა მნიშვნელოვანი მეტა ტეგები */}
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
      
      {/* დამატებითი მეტა ტეგები */}
      {children}
    </Helmet>
  );
} 