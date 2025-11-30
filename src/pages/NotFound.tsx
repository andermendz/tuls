import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center space-y-6 animate-fade-in">
            <SEO title="Page Not Found" description="The page you are looking for does not exist." />

            <div className="w-24 h-24 bg-error-container rounded-full flex items-center justify-center text-error">
                <AlertCircle size={48} />
            </div>

            <div className="space-y-2">
                <h1 className="text-4xl font-display font-medium text-surface-on">404</h1>
                <p className="text-lg text-surface-onVariant">Page not found</p>
            </div>

            <Link to="/">
                <Button icon={<Home size={20} />}>Go Home</Button>
            </Link>
        </div>
    );
};