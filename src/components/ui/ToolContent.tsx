import React from 'react';

interface Section {
    title: string;
    content: React.ReactNode;
}

interface ToolContentProps {
    title: string;
    sections: Section[];
}

export const ToolContent: React.FC<ToolContentProps> = ({ title, sections }) => {
    return (
        <div className="mt-12 max-w-4xl mx-auto border-t border-outline-variant/20 pt-12 pb-12">
            <h2 className="text-2xl md:text-3xl font-display font-medium text-surface-on mb-8">
                About {title}
            </h2>
            <div className="grid gap-8 md:grid-cols-2 text-left">
                {sections.map((section, idx) => (
                    <div key={idx} className="space-y-3">
                        <h3 className="text-lg font-medium text-surface-on flex items-center gap-2">
                            {section.title}
                        </h3>
                        <div className="text-surface-onVariant leading-relaxed text-sm md:text-base">
                            {section.content}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};