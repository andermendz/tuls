import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string[];
}

export const SEO: React.FC<SEOProps> = ({ title, description, canonical, keywords }) => {
    const siteName = 'Tuls';
    const fullTitle = `${title} | ${siteName}`;
    const baseUrl = 'https://tuls.app'; // Replace with your actual production domain
    const currentUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

    // JSON-LD Schema for WebApplication
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": title,
        "url": currentUrl,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": description,
        "browserRequirements": "Requires JavaScript. Works in all modern browsers."
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords.join(', ')} />}
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:site_name" content={siteName} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};