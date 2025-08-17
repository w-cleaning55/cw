import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { useTranslation } from "../hooks/useTranslation";
import { getLocalizedText } from "../lib/utils";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  X,
  Loader2,
  Lightbulb,
  HeadphonesIcon,
  ShoppingCart,
  Zap,
  Brain,
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  context?: "support" | "sales" | "general" | "content";
}

interface AssistantProps {
  context?: "support" | "sales" | "general" | "content";
  initialMessage?: string;
  onClose?: () => void;
}

export default function AIAssistant({
  context = "general",
  initialMessage,
  onClose,
}: AssistantProps) {
  const { currentLanguage } = useTranslation();
  const isArabic = currentLanguage === "ar";

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [provider, setProvider] = useState<"gemini" | "chatgpt">("gemini");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      handleInitialMessage();
    }
  }, [initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleInitialMessage = async () => {
    if (!initialMessage) return;

    const welcomeMessage: Message = {
      id: Date.now().toString(),
      type: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
      context,
    };

    setMessages([welcomeMessage]);
    setIsOpen(true);
  };

  const getWelcomeMessage = () => {
    const messages = {
      support: {
        en: "Hello! I'm your technical support assistant. How can I help you resolve any issues today?",
        ar: "مرحباً! أنا مساعدك للدعم الفني. كيف يمكنني مساعدتك في حل أي مشاكل اليوم؟",
      },
      sales: {
        en: "Hi there! I'm your sales assistant. I'm here to help you find the perfect solution for your needs. What are you looking for?",
        ar: "أهلاً بك! أنا مساعدك في المبيعات. أنا هنا لمساعدتك في العثور على الحل المثالي لاحتياجاتك. ماذا تبحث عن؟",
      },
      content: {
        en: "Welcome! I'm here to help you optimize and generate content. Whether you need SEO optimization, content suggestions, or automatic generation, I'm ready to assist!",
        ar: "مرحباً! أنا هنا لمساعدتك في تحسين وتوليد المحتوى. سواء كنت تحتاج لتحسين السيو، اقتراحات المحتوى، أو التوليد التلقائي، أنا مستعد للمساعدة!",
      },
      general: {
        en: "Hello! I'm your AI assistant. How can I help you today?",
        ar: "مرحباً! أنا مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟",
      },
    };

    return getLocalizedText(messages[context], isArabic, "رسالة");
  };

  const getContextPrompt = () => {
    const prompts = {
      support: isArabic
        ? "أنت مساعد دعم فني خبير في نظام إدارة التنظيف. ساعد المستخدم في حل المشاكل التقنية وأجب بالعربية."
        : "You are an expert technical support assistant for a cleaning management system. Help users resolve technical issues.",
      sales: isArabic
        ? "أنت مساعد مبيعات محترف لشركة تنظيف. ساعد العملاء في اختيار أفضل الخدمات وأجب بالعربية."
        : "You are a professional sales assistant for a cleaning company. Help customers choose the best services.",
      content: isArabic
        ? "أنت خبير في تحسين المحتوى والسيو. ساعد في تحسين النصوص وتوليد محتوى عالي الجودة وأجب بالعربية."
        : "You are a content optimization and SEO expert. Help improve texts and generate high-quality content.",
      general: isArabic
        ? "أنت مساعد ذكي عام. ساعد المستخدم في أي استفسار وأجب بالعربية."
        : "You are a general AI assistant. Help the user with any inquiry.",
    };

    return prompts[context];
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
      context,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputValue,
          context: getContextPrompt(),
          provider,
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      });

      const data = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
          context,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        // Fallback to other provider
        const fallbackProvider = provider === "gemini" ? "chatgpt" : "gemini";
        const fallbackResponse = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: inputValue,
            context: getContextPrompt(),
            provider: fallbackProvider,
            conversationHistory: messages.slice(-5),
          }),
        });

        const fallbackData = await fallbackResponse.json();

        if (fallbackData.success) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            type: "assistant",
            content: fallbackData.response,
            timestamp: new Date(),
            context,
          };

          setMessages((prev) => [...prev, assistantMessage]);
          setProvider(fallbackProvider); // Switch to working provider
        } else {
          throw new Error("Both AI providers failed");
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: isArabic
          ? "عذراً، حدث خطأ في الاتصال بالمساعد الذكي. يرجى المحاولة مرة أخرى."
          : "Sorry, there was an error connecting to the AI assistant. Please try again.",
        timestamp: new Date(),
        context,
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case "support":
        return <HeadphonesIcon className="w-5 h-5" />;
      case "sales":
        return <ShoppingCart className="w-5 h-5" />;
      case "content":
        return <Lightbulb className="w-5 h-5" />;
      default:
        return <Bot className="w-5 h-5" />;
    }
  };

  const getContextTitle = () => {
    const titles = {
      support: isArabic ? "الدعم الفني" : "Technical Support",
      sales: isArabic ? "مساعد المبيعات" : "Sales Assistant",
      content: isArabic ? "مساعد المحتوى" : "Content Assistant",
      general: isArabic ? "ال��ساعد الذكي" : "AI Assistant",
    };

    return titles[context];
  };

  const getProviderColor = (currentProvider: string) => {
    return currentProvider === provider
      ? "bg-blue-600 text-white"
      : "bg-gray-200 text-gray-700 hover:bg-gray-300";
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="lg"
      >
        {getContextIcon()}
      </Button>
    );
  }

  return (
    <div
      className={`fixed ${isArabic ? "left-6" : "right-6"} bottom-6 z-50 ${isMinimized ? "w-80" : "w-96"} transition-all duration-300`}
    >
      <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                {getContextIcon()}
              </div>
              <div>
                <CardTitle className="text-sm font-semibold">
                  {getContextTitle()}
                </CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">
                    {isArabic ? "متصل" : "Online"}
                  </span>
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    {provider === "gemini" ? "Gemini" : "ChatGPT"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? (
                  <Maximize2 className="w-4 h-4" />
                ) : (
                  <Minimize2 className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  onClose?.();
                }}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Provider Toggle */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {isArabic ? "المزود:" : "Provider:"}
            </span>
            <div className="flex rounded-lg overflow-hidden">
              <button
                onClick={() => setProvider("gemini")}
                className={`px-3 py-1 text-xs transition-colors ${getProviderColor("gemini")}`}
              >
                Gemini
              </button>
              <button
                onClick={() => setProvider("chatgpt")}
                className={`px-3 py-1 text-xs transition-colors ${getProviderColor("chatgpt")}`}
              >
                ChatGPT
              </button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-4">
            {/* Messages */}
            <div className="h-64 overflow-y-auto space-y-3 pr-2">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-8">
                  {isArabic
                    ? "ابدأ محادثة جديدة..."
                    : "Start a new conversation..."}
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`
                    p-2 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0
                    ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                    }
                  `}
                  >
                    {message.type === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  <div
                    className={`
                    flex-1 p-3 rounded-lg text-sm
                    ${
                      message.type === "user"
                        ? "bg-blue-600 text-white ml-8"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-8"
                    }
                  `}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString(
                        isArabic ? "ar-SA" : "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-full w-8 h-8 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-gray-100 dark:bg-gray-700 mr-8">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {isArabic
                          ? "الذكاء الاصطناعي يفكر..."
                          : "AI is thinking..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder={
                  isArabic ? "اكتب رسالتك هنا..." : "Type your message here..."
                }
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Quick Actions */}
            {context !== "general" && (
              <div className="flex flex-wrap gap-2">
                {context === "support" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "أحتاج مساعدة في تسجيل الدخول"
                            : "I need help with login",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "مشكلة تسجيل دخول" : "Login Issue"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "النظام لا يعمل بشكل صحيح"
                            : "System not working properly",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "مشكلة تقنية" : "Technical Issue"}
                    </Button>
                  </>
                )}

                {context === "sales" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "أريد معرفة أسعار الخدمات"
                            : "I want to know service prices",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "الأسعار" : "Pricing"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "ما هي أفضل خدمة للمنازل؟"
                            : "What is the best service for homes?",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "أفضل خدمة" : "Best Service"}
                    </Button>
                  </>
                )}

                {context === "content" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "حسن هذا النص للسيو"
                            : "Optimize this text for SEO",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "تحسين السيو" : "SEO Optimize"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setInputValue(
                          isArabic
                            ? "اكتب وصف للخدمة"
                            : "Write a service description",
                        )
                      }
                      className="text-xs"
                    >
                      {isArabic ? "توليد محتوى" : "Generate Content"}
                    </Button>
                  </>
                )}
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
