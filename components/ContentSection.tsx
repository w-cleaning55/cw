"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ContentSectionProps {
  title?: string;
  text?: string;
  content?: string;
  className?: string;
  style?: 'default' | 'centered' | 'card' | 'minimal';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const ContentSection: React.FC<ContentSectionProps> = React.memo(({
  title,
  text,
  content,
  className = "",
  style = "default",
  maxWidth = "2xl"
}) => {
  const contentText = text || content || "";
  
  if (!contentText) {
    return null;
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full"
  };

  const renderContent = () => {
    const textContent = (
      <div className={`prose prose-lg max-w-none ${maxWidthClasses[maxWidth]}`}>
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 mb-6" dir="rtl">
            {title}
          </h2>
        )}
        <div 
          className="text-gray-700 leading-relaxed text-lg"
          dir="rtl"
          dangerouslySetInnerHTML={{ __html: contentText }}
        />
      </div>
    );

    switch (style) {
      case 'centered':
        return (
          <div className="text-center">
            {textContent}
          </div>
        );
      
      case 'card':
        return (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              {textContent}
            </CardContent>
          </Card>
        );
      
      case 'minimal':
        return (
          <div className="text-center py-12">
            <div className={`${maxWidthClasses[maxWidth]} mx-auto`}>
              {title && (
                <h3 className="text-2xl font-semibold text-gray-900 mb-4" dir="rtl">
                  {title}
                </h3>
              )}
              <p className="text-gray-600 leading-relaxed" dir="rtl">
                {contentText}
              </p>
            </div>
          </div>
        );
      
      default:
        return textContent;
    }
  };

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {renderContent()}
      </div>
    </section>
  );
});

ContentSection.displayName = 'ContentSection';

export default ContentSection;
