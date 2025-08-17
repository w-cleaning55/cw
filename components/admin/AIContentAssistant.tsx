"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { getLocalizedText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Bot,
  Wand2,
  Search,
  Type,
  Hash,
  FileText,
  Globe,
  Sparkles,
  Copy,
  RefreshCw,
  Check,
  X,
  Send,
  Star,
  Target,
  TrendingUp,
  Languages,
  MessageSquare,
  Lightbulb,
  Eye,
  ChevronDown,
  ChevronUp,
  Settings,
  Zap,
} from "lucide-react";

interface AIAssistantProps {
  mode:
    | "title"
    | "description"
    | "seo"
    | "keywords"
    | "content"
    | "social"
    | "email";
  language: "ar" | "en" | "both";
  context?: string;
  currentValue?: string;
  onGenerate: (generated: string | { ar: string; en: string }) => void;
  onClose?: () => void;
  businessContext?: {
    industry: string;
    location: string;
    services: string[];
    targetAudience: string;
  };
}

interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  example: string;
  category: string;
}

const AI_TEMPLATES: Record<string, AITemplate[]> = {
  title: [
    {
      id: "hero_title",
      name: "عنوان رئيسي جذاب",
      description: "عنوان قوي يجذب الانتباه ويحفز على العمل",
      prompt: "اكتب عنوان رئيسي جذاب ومقنع لشركة تنظيف في جدة",
      example: "عالم النظافة جدة - شريككم الموثوق للنظافة المثالية",
      category: "marketing",
    },
    {
      id: "service_title",
      name: "عنوان خدمة",
      description: "عنوان واضح و��حدد لخدمة معينة",
      prompt: "اكتب عنوان مميز لخدمة {service} مع التركيز على الفوائد",
      example: "تنظيف السجاد والمفروشات - استعد بريق منزلك",
      category: "services",
    },
    {
      id: "section_title",
      name: "عنوان قسم",
      description: "عنوان لقسم في الصفحة",
      prompt: "اكتب عنوان واضح وجذاب لقسم {section} في الموقع",
      example: "لماذا نحن الخيار الأفضل؟",
      category: "content",
    },
  ],
  description: [
    {
      id: "service_desc",
      name: "وصف خدمة شامل",
      description: "وصف تفصيلي يبرز مميزات وفوائد الخدمة",
      prompt:
        "اكتب وصفاً شاملاً وجذاباً لخدمة {service} يتضمن المميزات والفوائد والعملية",
      example:
        "خدمة تنظيف احترافية للسجاد والمفروشات باستخدام أحدث التقنيات...",
      category: "services",
    },
    {
      id: "company_desc",
      name: "وصف الشركة",
      description: "وصف متكامل عن الشركة وخدماتها",
      prompt: "اكتب وصفاً متكاملاً عن شركة تنظيف محترفة في جدة",
      example: "شركة رائدة في مجال خدمات التنظيف المتخصصة...",
      category: "company",
    },
    {
      id: "feature_desc",
      name: "وصف ميزة",
      description: "وصف موجز وواضح لميزة أو فائدة",
      prompt: "اكتب وصفاً موجزاً وجذاباً لميزة {feature}",
      example: "ضمان شامل على جميع خدماتنا مع إمكانية الإعادة مجاناً",
      category: "features",
    },
  ],
  seo: [
    {
      id: "meta_title",
      name: "عنوان SEO",
      description: "عنوان محسن لمحركات البحث (50-60 حرف)",
      prompt: "اكتب عنوان SEO مُحسّن لصفحة {page} (50-60 حرف)",
      example: "شركة تنظيف جدة | خدمات تنظيف احترافية",
      category: "seo",
    },
    {
      id: "meta_desc",
      name: "وصف SEO",
      description: "وصف محسن لمحركات البحث (150-160 حرف)",
      prompt: "اكتب وصف meta محسن لمحركات البحث لصفحة {page} (150-160 حرف)",
      example:
        "شركة تنظيف احترافية في جدة. خدمات تنظيف شاملة للمنازل والمكاتب...",
      category: "seo",
    },
    {
      id: "alt_text",
      name: "نص بديل للصور",
      description: "نص بديل وصفي للصور",
      prompt: "اكتب نص بديل (alt text) وصفي ومحسن للصورة",
      example: "فريق تنظيف محترف ينظف سجاد في منزل بجدة",
      category: "images",
    },
  ],
  keywords: [
    {
      id: "primary_keywords",
      name: "كلمات مفتاحية أساسية",
      description: "كلمات مفتاحية رئيسية للخدمة أو الصفحة",
      prompt: "اقترح 5-8 كلمات مفتاحية أساسية لـ {topic}",
      example: "شركة تنظيف جدة، تنظيف منازل، جلي رخام",
      category: "seo",
    },
    {
      id: "long_tail",
      name: "كلمات طويلة الذيل",
      description: "عبارات بحث طويلة ومحددة",
      prompt: "اقترح 5-10 عبارات بحث طويلة الذيل لـ {topic}",
      example: "أفضل شركة تنظيف منازل في جدة، تنظيف سجاد احترافي جدة",
      category: "seo",
    },
    {
      id: "local_keywords",
      name: "كلمات محلية",
      description: "كلمات مفتاحية مرتبطة بالموقع الجغرافي",
      prompt: "اقترح كلمات مفتاحية محلية لـ {service} في جدة",
      example: "تنظيف منازل الزهراء، شركة تنظيف حي السلامة",
      category: "local",
    },
  ],
  content: [
    {
      id: "blog_post",
      name: "مقال مدونة",
      description: "مقال متكامل للمدونة",
      prompt: "اكتب مقال مدونة شامل عن {topic} (800-1200 كلمة)",
      example: "دليل شامل لتنظيف السجاد في المنزل...",
      category: "blog",
    },
    {
      id: "faq_answer",
      name: "إجابة سؤال شائع",
      description: "إجابة شاملة لسؤال شائع",
      prompt: "اكتب إجابة شاملة ومفيدة للسؤال: {question}",
      example: "تختلف تكلفة تنظيف السجاد حسب عدة عوامل...",
      category: "faq",
    },
    {
      id: "testimonial",
      name: "شهادة عميل",
      description: "شهادة عميل واقعية ومقنعة",
      prompt: "اكتب شهادة عميل واقعية ومقنعة عن {service}",
      example: "خدمة رائعة وفريق محترف، النتيجة فاقت توقعاتي...",
      category: "testimonials",
    },
  ],
  social: [
    {
      id: "facebook_post",
      name: "منشور فيسبوك",
      description: "منشو�� جذاب للفيسبوك",
      prompt: "اكتب منشور فيسبوك جذاب عن {topic}",
      example: "✨ هل تريد منزلاً نظيفاً ومعقماً؟ فريقنا المحترف...",
      category: "social",
    },
    {
      id: "instagram_caption",
      name: "تعليق إنستغرام",
      description: "تعليق إنستغرام مع هاشتاج",
      prompt: "اكتب تعليق إنستغرام مع هاشتاج مناسب عن {topic}",
      example: "نتائج مبهرة لتنظيف السجاد 🏠✨ #تنظيف_جدة #نظافة",
      category: "social",
    },
    {
      id: "twitter_tweet",
      name: "تغريدة تويتر",
      description: "تغريدة قصيرة وجذابة",
      prompt: "اكتب تغريدة قصيرة وجذابة عن {topic}",
      example: "خدمة تنظيف احترافية في جدة 🧽✨ جودة عالية وأسعار منافسة",
      category: "social",
    },
  ],
  email: [
    {
      id: "email_subject",
      name: "موضوع إيميل",
      description: "موضوع إيميل جذاب",
      prompt: "اكتب موضوع إيميل جذاب لـ {purpose}",
      example: "عرض خاص: خصم 20% على خدمات التنظيف",
      category: "email",
    },
    {
      id: "newsletter",
      name: "نشرة إخبارية",
      description: "محتوى نشرة إخبارية",
      prompt: "اكتب محتوى نشرة إخبارية عن {topic}",
      example: "مرحباً بك في نشرتنا الشهرية...",
      category: "email",
    },
  ],
};

const BUSINESS_CONTEXT = {
  industry: "خدمات التنظيف",
  location: "جدة، المملكة العربية السعودية",
  services: [
    "تنظيف السجاد",
    "جلي الرخام",
    "تنظيف المنازل",
    "تعقيم المنشآت",
    "مكافحة الحشرات",
  ],
  targetAudience: "أصحاب المنازل والمكاتب في جدة",
  company: "عالم النظافة جدة",
  experience: "6+ سنوات",
  employees: "50+ موظف متخصص",
};

export default function AIContentAssistant({
  mode,
  language,
  context = "",
  currentValue = "",
  onGenerate,
  onClose,
  businessContext = BUSINESS_CONTEXT,
}: AIAssistantProps) {
  const { t, isArabic } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(
    null,
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<
    string | { ar: string; en: string }
  >("");
  const [showTemplates, setShowTemplates] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "templates" | "custom" | "improve"
  >("templates");
  const [improvementType, setImprovementType] = useState<
    "enhance" | "simplify" | "formal" | "casual"
  >("enhance");
  const [progress, setProgress] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const templates = AI_TEMPLATES[mode] || [];

  // محاكاة التقدم أثناء الإنتاج
  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const generateContent = async (prompt: string, template?: AITemplate) => {
    try {
      setGenerating(true);
      const progressInterval = simulateProgress();

      // إنشاء البرومبت الكامل مع السياق
      const fullPrompt = buildFullPrompt(prompt, template);

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullPrompt,
          context: {
            mode,
            language,
            businessContext,
            currentValue: currentValue || context,
          },
        }),
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        const generated =
          language === "both"
            ? parseMultiLanguageResponse(data.response)
            : data.response;

        setGeneratedContent(generated);
        generateSuggestions(generated);
      } else {
        throw new Error(data.error || "فشل في إنتاج المحتوى");
      }
    } catch (error) {
      console.error("Error generating content:", error);
      setGeneratedContent(
        "عذراً، حدث خطأ أثناء إنتاج المحتوى. يرجى المحاولة مرة أخرى.",
      );
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const buildFullPrompt = (prompt: string, template?: AITemplate) => {
    let fullPrompt = "";

    // إضافة السياق العام
    fullPrompt += `أنت مساعد ذكي متخصص في كتابة المحتوى التسويقي لشركة تنظيف في جدة.\n`;
    fullPrompt += `معلومات الشركة: ${businessContext.company}\n`;
    fullPrompt += `الصناعة: ${businessContext.industry}\n`;
    fullPrompt += `الموقع: ${businessContext.location}\n`;
    fullPrompt += `الخدمات: ${businessContext.services.join(", ")}\n`;
    fullPrompt += `الجمهور المستهدف: ${businessContext.targetAudience}\n\n`;

    // إضافة تعليمات اللغة
    if (language === "both") {
      fullPrompt += `اكتب المحتوى باللغتين العربية والإنجليزية. ابدأ بالعربية ثم الإنجليزية، واستخدم الشكل التالي:\n[AR]: النص العربي\n[EN]: النص الإنجليزي\n\n`;
    } else if (language === "ar") {
      fullPrompt += `اكتب المحتوى باللغة العربية فقط.\n\n`;
    } else {
      fullPrompt += `اكتب المحتوى باللغة الإنجليزية فقط.\n\n`;
    }

    // إضافة السياق الحالي
    if (context) {
      fullPrompt += `السياق الحالي: ${context}\n\n`;
    }

    // إضافة القيمة الحالية للتحسين
    if (currentValue && activeTab === "improve") {
      fullPrompt += `النص الحالي للتحسين: ${currentValue}\n\n`;
    }

    // إضافة البرومبت الرئي��ي
    fullPrompt += `المطلوب: ${prompt}\n\n`;

    // إضافة تعليمات خاصة بنوع المحتوى
    switch (mode) {
      case "title":
        fullPrompt += `تأكد من أن العنوان جذاب ولا يتجاوز 60 حرف للـ SEO.\n`;
        break;
      case "description":
        fullPrompt += `اجعل الوصف واضح ومقنع ويتضمن الكلمات المفتاحية المهمة.\n`;
        break;
      case "seo":
        fullPrompt += `ركز على الكلمات المفتاحية المحلية وتحسين محركات البحث.\n`;
        break;
      case "keywords":
        fullPrompt += `اقترح كلمات مفتاحية مناسبة للبحث المحلي في جدة.\n`;
        break;
      case "social":
        fullPrompt += `اجعل النص مناسب لوسائل التواصل الاجتماعي مع استخدام الإيموجي.\n`;
        break;
    }

    return fullPrompt;
  };

  const parseMultiLanguageResponse = (
    response: string,
  ): { ar: string; en: string } => {
    const arMatch = response.match(/\[AR\]:\s*(.*?)(?=\[EN\]:|$)/s);
    const enMatch = response.match(/\[EN\]:\s*(.*?)$/s);

    return {
      ar: arMatch ? arMatch[1].trim() : response,
      en: enMatch ? enMatch[1].trim() : "",
    };
  };

  const generateSuggestions = (
    content: string | { ar: string; en: string },
  ) => {
    // إنتاج اقتراحات بناءً على المحتوى المُولد
    const baseSuggestions = [
      "جعل النص أكثر إقناعاً",
      "إضافة كلمات مفتاحية",
      "تبسيط اللغة",
      "إضافة دعوة للعمل",
      "تحسين SEO",
    ];
    setSuggestions(baseSuggestions);
  };

  const improveContent = async (type: string) => {
    if (!generatedContent) return;

    const currentText =
      typeof generatedContent === "string"
        ? generatedContent
        : generatedContent[language as "ar" | "en"] || generatedContent.ar;

    const improvementPrompts = {
      enhance: "حسّن هذا النص ليكون أكثر جاذبية وإقناعاً",
      simplify: "بسّط هذا النص ليكون أكثر وضوحاً",
      formal: "اجعل هذا النص أكثر رسمية ومهنية",
      casual: "اجعل هذا النص أكثر ودية وقرباً",
    };

    await generateContent(
      improvementPrompts[type as keyof typeof improvementPrompts],
    );
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // يمكن إضافة toast notification هنا
    } catch (error) {
      console.error("Error copying to clipboard:", error);
    }
  };

  const handleGenerate = () => {
    if (selectedTemplate) {
      let prompt = selectedTemplate.prompt;
      // استبدال المتغيرات في البرومبت
      prompt = prompt.replace("{service}", context || "الخدمة");
      prompt = prompt.replace("{page}", context || "الصفحة");
      prompt = prompt.replace("{topic}", context || "الموضوع");
      prompt = prompt.replace("{section}", context || "القسم");
      prompt = prompt.replace("{feature}", context || "الميزة");
      prompt = prompt.replace("{question}", context || "السؤال");
      prompt = prompt.replace("{purpose}", context || "الغرض");

      generateContent(prompt, selectedTemplate);
    } else if (customPrompt) {
      generateContent(customPrompt);
    }
  };

  const handleUseContent = () => {
    onGenerate(generatedContent);
    onClose?.();
  };

  return (
    <div className="relative">
      {/* زر تفعيل المساعد */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 hover:from-purple-600 hover:to-blue-600"
      >
        <Bot className="w-4 h-4 mr-2" />
        <Sparkles className="w-3 h-3 mr-1" />
        مساعد AI
      </Button>

      {/* نافذة المساعد */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    مساعد المحتوى الذكي
                  </h3>
                  <p className="text-xs text-gray-500">
                    مدعوم بالذكاء الاصطناعي
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            {/* التبويبات */}
            <div className="flex space-x-1 rtl:space-x-reverse mb-4 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab("templates")}
                className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                  activeTab === "templates"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Wand2 className="w-3 h-3 mr-1 inline" />
                قوالب
              </button>
              <button
                onClick={() => setActiveTab("custom")}
                className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                  activeTab === "custom"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Type className="w-3 h-3 mr-1 inline" />
                مخصص
              </button>
              {currentValue && (
                <button
                  onClick={() => setActiveTab("improve")}
                  className={`flex-1 px-3 py-2 text-xs rounded-md transition-colors ${
                    activeTab === "improve"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <TrendingUp className="w-3 h-3 mr-1 inline" />
                  تحسين
                </button>
              )}
            </div>

            {/* محتوى القوالب */}
            {activeTab === "templates" && (
              <div className="space-y-3">
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate?.id === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      {selectedTemplate?.id === template.id && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <span className="font-medium">مثال:</span>{" "}
                            {template.example}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* محتوى الطلب المخصص */}
            {activeTab === "custom" && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">
                    اكتب طلبك المخصص
                  </Label>
                  <Textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="مثال: اكتب عنوان جذاب لخدمة تنظيف السجاد مع التركيز على السرعة والجودة"
                    rows={3}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCustomPrompt(customPrompt + " (باللغة العربية)")
                    }
                  >
                    <Languages className="w-3 h-3 mr-1" />
                    عربي
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCustomPrompt(customPrompt + " (باللغة الإنجليزية)")
                    }
                  >
                    <Globe className="w-3 h-3 mr-1" />
                    إنجليزي
                  </Button>
                </div>
              </div>
            )}

            {/* محتوى التحسين */}
            {activeTab === "improve" && currentValue && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">النص الحالي</Label>
                  <div className="p-2 bg-gray-50 rounded text-sm text-gray-700 max-h-20 overflow-y-auto">
                    {currentValue}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">نوع التحسين</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {[
                      { id: "enhance", label: "تحسين", icon: TrendingUp },
                      { id: "simplify", label: "تبسيط", icon: Eye },
                      { id: "formal", label: "رسمي", icon: FileText },
                      { id: "casual", label: "ودود", icon: MessageSquare },
                    ].map((type) => (
                      <Button
                        key={type.id}
                        variant={
                          improvementType === type.id ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setImprovementType(type.id as any)}
                      >
                        <type.icon className="w-3 h-3 mr-1" />
                        {type.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* شريط التقدم */}
            {generating && (
              <div className="my-4">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  جارٍ إنتاج المحتوى... {Math.round(progress)}%
                </p>
              </div>
            )}

            {/* أزرار الإجراءات */}
            <div className="flex space-x-2 rtl:space-x-reverse mt-4">
              <Button
                onClick={
                  activeTab === "improve"
                    ? () => improveContent(improvementType)
                    : handleGenerate
                }
                disabled={
                  generating ||
                  (activeTab === "templates" && !selectedTemplate) ||
                  (activeTab === "custom" && !customPrompt)
                }
                className="flex-1"
              >
                {generating ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {activeTab === "improve" ? "تحسين" : "إنتاج"}
              </Button>
              {generatedContent && (
                <Button variant="outline" onClick={handleUseContent}>
                  <Check className="w-4 h-4 mr-2" />
                  استخدام
                </Button>
              )}
            </div>

            {/* المحتوى المُولد */}
            {generatedContent && (
              <div className="mt-4 space-y-3">
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">
                      المحتوى المُولد
                    </Label>
                    <div className="flex space-x-1 rtl:space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          copyToClipboard(
                            typeof generatedContent === "string"
                              ? generatedContent
                              : `${generatedContent.ar}\n\n${generatedContent.en}`,
                          )
                        }
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          generateContent(
                            activeTab === "templates" && selectedTemplate
                              ? selectedTemplate.prompt
                              : customPrompt,
                          )
                        }
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg text-sm">
                    {typeof generatedContent === "string" ? (
                      <p className="text-gray-800">{generatedContent}</p>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            العربية
                          </Badge>
                          <p className="text-gray-800" dir="rtl">
                            {generatedContent.ar}
                          </p>
                        </div>
                        <div>
                          <Badge variant="secondary" className="text-xs mb-1">
                            English
                          </Badge>
                          <p className="text-gray-800" dir="ltr">
                            {generatedContent.en}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* اقتراحات التحسين */}
                {suggestions.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium">
                      اقتراحات تحسين
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            generateContent(
                              `${suggestion}: ${typeof generatedContent === "string" ? generatedContent : generatedContent.ar}`,
                            )
                          }
                        >
                          <Lightbulb className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
