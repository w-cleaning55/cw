import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  Send,
  Phone,
  Video,
  Paperclip,
  MoreVertical,
  Search,
  Filter,
  Archive,
  Star,
  Reply,
  Forward,
  Download,
  Trash2,
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Smile,
  Image as ImageIcon,
  FileText,
  MessageSquare,
  Users,
  Settings,
  X,
} from "lucide-react";
import { useTranslation } from "../hooks/useTranslation";
import { useNotifications } from "./NotificationSystem";
import { useAnimation } from "./AnimationController";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type:
    | "text"
    | "image"
    | "file"
    | "audio"
    | "video"
    | "location"
    | "contact"
    | "system";
  timestamp: string;
  status: "sending" | "sent" | "delivered" | "read" | "failed";
  attachments?: MessageAttachment[];
  replyTo?: string;
  reactions?: MessageReaction[];
  edited?: boolean;
  editedAt?: string;
  deleted?: boolean;
  deletedAt?: string;
  metadata?: Record<string, any>;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group" | "channel" | "support";
  name: string;
  nameAr: string;
  description?: string;
  descriptionAr?: string;
  participants: ConversationParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  settings: ConversationSettings;
  metadata?: Record<string, any>;
}

export interface ConversationParticipant {
  userId: string;
  name: string;
  nameAr: string;
  avatar?: string;
  role: "owner" | "admin" | "member" | "guest";
  joinedAt: string;
  lastSeen?: string;
  isOnline: boolean;
  permissions: string[];
}

export interface ConversationSettings {
  canAddMembers: boolean;
  canRemoveMembers: boolean;
  canEditMessages: boolean;
  canDeleteMessages: boolean;
  messageRetention?: number; // days
  allowAttachments: boolean;
  maxAttachmentSize: number; // MB
  allowedAttachmentTypes: string[];
}

interface MessagingSystemProps {
  userId: string;
  onConversationSelect?: (conversation: Conversation) => void;
  onMessageSend?: (
    message: Omit<Message, "id" | "timestamp" | "status">,
  ) => void;
  className?: string;
}

export default function MessagingSystem({
  userId,
  onConversationSelect,
  onMessageSend,
  className = "",
}: MessagingSystemProps) {
  const { t, currentLanguage } = useTranslation();
  const { addNotification } = useNotifications();
  const { isAnimationEnabled } = useAnimation();

  // State management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  // Load conversations and messages
  useEffect(() => {
    loadConversations();

    // Set up real-time listeners
    const messagesUnsubscribe = subscribeToMessages();
    const conversationsUnsubscribe = subscribeToConversations();
    const onlineStatusUnsubscribe = subscribeToOnlineStatus();

    return () => {
      messagesUnsubscribe();
      conversationsUnsubscribe();
      onlineStatusUnsubscribe();
    };
  }, [userId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch(
        `/api/messages/conversations?userId=${userId}`,
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);

        // Auto-select first conversation if none selected
        if (data.conversations?.length > 0 && !selectedConversation) {
          selectConversation(data.conversations[0]);
        }
      }
    } catch (error) {
      console.error("خطأ في تحميل ا��محادثات:", error);
      addNotification({
        type: "error",
        title: "خطأ في التحميل",
        titleAr: "خطأ في التحميل",
        message: "فشل في تحميل المحادثات",
        messageAr: "فشل في تحميل المحادثات",
        priority: "medium",
        category: "System",
        categoryAr: "النظام",
        actionable: false,
        autoDismiss: true,
      });
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(
        `/api/messages/conversations/${conversationId}/messages`,
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);

        // Mark messages as read
        markMessagesAsRead(conversationId);
      }
    } catch (error) {
      console.error("خطأ في تحميل الرسائل:", error);
    }
  };

  const selectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);

    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;
    if (!selectedConversation) return;

    const messageData: Omit<Message, "id" | "timestamp" | "status"> = {
      conversationId: selectedConversation.id,
      senderId: userId,
      content: newMessage,
      type: attachments.length > 0 ? "file" : "text",
      attachments:
        attachments.length > 0
          ? await uploadAttachments(attachments)
          : undefined,
      replyTo: replyToMessage?.id,
    };

    try {
      // Create temporary message for immediate display
      const tempMessage: Message = {
        ...messageData,
        id: `temp-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: "sending",
      };

      setMessages((prev) => [...prev, tempMessage]);
      setNewMessage("");
      setAttachments([]);
      setReplyToMessage(null);

      // Send to server
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const sentMessage = await response.json();

        // Replace temporary message with real message
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempMessage.id ? sentMessage : msg)),
        );

        if (onMessageSend) {
          onMessageSend(messageData);
        }
      } else {
        throw new Error("فشل في إرسال الرسالة");
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة:", error);

      // Mark message as failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id.startsWith("temp-")
            ? { ...msg, status: "failed" as const }
            : msg,
        ),
      );

      addNotification({
        type: "error",
        title: "فشل في الإرسال",
        titleAr: "فشل في الإرسال",
        message: "تعذر إرسال الرسالة",
        messageAr: "تعذر إرسال الرسالة",
        priority: "medium",
        category: "Messages",
        categoryAr: "الرسائل",
        actionable: false,
        autoDismiss: true,
      });
    }
  };

  const uploadAttachments = async (
    files: File[],
  ): Promise<MessageAttachment[]> => {
    const uploadedAttachments: MessageAttachment[] = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "message-attachment");

        const response = await fetch("/api/messages/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedAttachments.push({
            id: data.id,
            name: file.name,
            type: file.type,
            size: file.size,
            url: data.url,
            thumbnail: data.thumbnail,
          });
        }
      } catch (error) {
        console.error("خطأ في رفع المرفق:", error);
      }
    }

    return uploadedAttachments;
  };

  const markMessagesAsRead = async (conversationId: string) => {
    try {
      await fetch(`/api/messages/conversations/${conversationId}/mark-read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      // Update local state
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv,
        ),
      );
    } catch (error) {
      console.error("خطأ في تحديد الرسائل كمقروءة:", error);
    }
  };

  const subscribeToMessages = () => {
    // Simulate WebSocket connection
    const interval = setInterval(() => {
      // In a real implementation, this would be replaced with WebSocket listeners
      if (selectedConversation) {
        // Check for new messages
        // loadMessages(selectedConversation.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  };

  const subscribeToConversations = () => {
    // Simulate conversation updates
    const interval = setInterval(() => {
      // loadConversations();
    }, 10000);

    return () => clearInterval(interval);
  };

  const subscribeToOnlineStatus = () => {
    // Monitor participant online status
    const interval = setInterval(() => {
      // Update participant online status
    }, 30000);

    return () => clearInterval(interval);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("ar", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "أمس";
    } else if (days < 7) {
      return date.toLocaleDateString("ar", { weekday: "long" });
    } else {
      return date.toLocaleDateString("ar");
    }
  };

  const getMessageStatusIcon = (status: Message["status"]) => {
    switch (status) {
      case "sending":
        return <Clock className="w-4 h-4 text-muted-foreground" />;
      case "sent":
        return <Check className="w-4 h-4 text-muted-foreground" />;
      case "delivered":
        return <CheckCheck className="w-4 h-4 text-muted-foreground" />;
      case "read":
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.nameAr.includes(searchQuery),
  );

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Conversations Sidebar */}
      <div className="w-80 border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">الرسائل</h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                  selectedConversation?.id === conversation.id ? "bg-muted" : ""
                } ${isAnimationEnabled ? "transition-enhanced" : ""}`}
                onClick={() => selectConversation(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={conversation.avatar} />
                      <AvatarFallback>
                        {conversation.type === "group" ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          conversation.name.charAt(0)
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.type === "direct" && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {currentLanguage === "ar"
                          ? conversation.nameAr
                          : conversation.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {conversation.isPinned && (
                          <Star className="w-3 h-3 text-yellow-500" />
                        )}
                        {conversation.isMuted && (
                          <div className="w-4 h-4 bg-muted-foreground rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-background rounded-full" />
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {conversation.lastMessage &&
                            formatMessageTime(
                              conversation.lastMessage.timestamp,
                            )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.lastMessage?.content || "لا توجد رسائل"}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unreadCount > 99
                            ? "99+"
                            : conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>
                      {selectedConversation.type === "group" ? (
                        <Users className="w-5 h-5" />
                      ) : (
                        selectedConversation.name.charAt(0)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">
                      {currentLanguage === "ar"
                        ? selectedConversation.nameAr
                        : selectedConversation.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.type === "group"
                        ? `${selectedConversation.participants.length} أعضاء`
                        : isOnline
                          ? "متصل الآن"
                          : "غير متصل"}
                      {typingUsers.length > 0 && (
                        <span className="text-primary"> • يكتب...</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isOwn = message.senderId === userId;
                  const participant = selectedConversation.participants.find(
                    (p) => p.userId === message.senderId,
                  );

                  return (
                    <div
                      key={message.id}
                                               className={`flex ${isOwn ? "justify-end" : "justify-start"} ${
                         isAnimationEnabled ? "animate-fade-in" : ""
                       }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}
                      >
                        {!isOwn && selectedConversation.type === "group" && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={participant?.avatar} />
                              <AvatarFallback className="text-xs">
                                {participant?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {participant?.name}
                            </span>
                          </div>
                        )}

                        <div
                          className={`rounded-lg p-3 ${
                            isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.replyTo && (
                            <div className="border-l-2 border-border pl-2 mb-2 opacity-70">
                              <p className="text-xs">
                                ردٌ على:{" "}
                                {messages
                                  .find((m) => m.id === message.replyTo)
                                  ?.content.slice(0, 50)}
                                ...
                              </p>
                            </div>
                          )}

                          <p className="text-sm">{message.content}</p>

                          {message.attachments &&
                            message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div
                                    key={attachment.id}
                                    className="flex items-center space-x-2 p-2 bg-background/10 rounded"
                                  >
                                    {attachment.type.startsWith("image/") ? (
                                      <ImageIcon className="w-4 h-4" />
                                    ) : (
                                      <FileText className="w-4 h-4" />
                                    )}
                                    <span className="text-xs">
                                      {attachment.name}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0"
                                    >
                                      <Download className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}

                          <div
                            className={`flex items-center justify-between mt-2 text-xs ${
                              isOwn
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            <span>{formatMessageTime(message.timestamp)}</span>
                            {isOwn && (
                              <div className="flex items-center space-x-1">
                                {message.edited && <span>• محرّرة</span>}
                                {getMessageStatusIcon(message.status)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              {replyToMessage && (
                <div className="mb-2 p-2 bg-muted rounded border-l-2 border-primary">
                  <div className="flex items-center justify-between">
                    <p className="text-sm">
                      ردٌ على: {replyToMessage.content.slice(0, 50)}...
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReplyToMessage(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {attachments.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-2 bg-muted rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    ref={messageInputRef}
                    placeholder="اكتب رسالة..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="min-h-[44px] max-h-32 resize-none"
                    rows={1}
                  />
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile className="w-4 h-4" />
                  </Button>

                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() && attachments.length === 0}
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">اختر محادثة للبدء</h3>
              <p className="text-muted-foreground">
                اختر محادثة من القائمة للبدء في إرسال الرسائل
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
