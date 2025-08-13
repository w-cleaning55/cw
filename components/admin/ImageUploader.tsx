import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import {
  Upload,
  X,
  Eye,
  Download,
  Trash2,
  Image as ImageIcon,
  Film,
  Loader2,
  Check,
  AlertCircle,
  Move,
} from "lucide-react";
import { useTranslation } from "../../hooks/useTranslation";
import { toast } from "../../hooks/use-toast";

interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: string;
  size: number;
  mimetype: string;
  uploadedAt: string;
  alt?: string;
  description?: string;
}

interface ImageUploaderProps {
  onUpload: (files: UploadedFile[]) => void;
  onRemove?: (fileId: string) => void;
  maxFiles?: number;
  maxFileSize?: number; // in MB
  acceptedTypes?: string[];
  existingFiles?: UploadedFile[];
  showPreview?: boolean;
  allowMultiple?: boolean;
  type?: string; // للتصنيف (service-images, icons, gallery, etc.)
  className?: string;
}

const ACCEPTED_TYPES = {
  images: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
  videos: ["video/mp4", "video/webm", "video/mov"],
  all: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/mov",
  ],
};

export default function ImageUploader({
  onUpload,
  onRemove,
  maxFiles = 10,
  maxFileSize = 10, // 10MB default
  acceptedTypes = ACCEPTED_TYPES.all,
  existingFiles = [],
  showPreview = true,
  allowMultiple = true,
  type = "general",
  className = "",
}: ImageUploaderProps) {
  const { t, currentLanguage } = useTranslation();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {},
  );
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImageFile = (mimetype: string) => {
    return mimetype.startsWith("image/");
  };

  const isVideoFile = (mimetype: string) => {
    return mimetype.startsWith("video/");
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `نوع الملف غير مدعوم. الأنواع المدعومة: ${acceptedTypes.join(", ")}`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `حجم الملف كبير جداً. الحد الأقصى: ${maxFileSize}MB`;
    }

    // Check total files limit
    if (!allowMultiple && existingFiles.length >= 1) {
      return `يُسمح بملف واحد فقط`;
    }

    if (existingFiles.length >= maxFiles) {
      return `تم تجاوز العدد الأقصى من الملفات (${maxFiles})`;
    }

    return null;
  };

  const uploadFile = async (file: File): Promise<UploadedFile | null> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("type", type);

    try {
      const response = await fetch("/api/content-management/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل في رفع الملف");
      }

      const data = await response.json();
      return {
        id: data.metadata.filename,
        filename: data.metadata.filename,
        originalName: data.metadata.originalName,
        url: data.imageUrl,
        type: data.metadata.type,
        size: data.metadata.size,
        mimetype: data.metadata.mimetype,
        uploadedAt: data.metadata.uploadedAt,
      };
    } catch (error) {
      console.error("خطأ في رفع الملف:", error);
      throw error;
    }
  };

  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    setUploading(true);
    const uploadedFiles: UploadedFile[] = [];
    const filesToUpload = allowMultiple ? Array.from(files) : [files[0]];

    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      const validationError = validateFile(file);

      if (validationError) {
        toast({
          title: "خطأ في الملف",
          description: `${file.name}: ${validationError}`,
          variant: "destructive",
        });
        continue;
      }

      try {
        // Show progress
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

        // Simulate progress (in real implementation, use xhr.upload.onprogress)
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: Math.min((prev[file.name] || 0) + 10, 90),
          }));
        }, 100);

        const uploadedFile = await uploadFile(file);
        clearInterval(progressInterval);

        if (uploadedFile) {
          uploadedFiles.push(uploadedFile);
          setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

          toast({
            title: "تم الرفع بنجاح",
            description: `تم رفع ${file.name} بنجاح`,
          });
        }
      } catch (error) {
        setUploadProgress((prev) => {
          const newProgress = { ...prev };
          delete newProgress[file.name];
          return newProgress;
        });

        toast({
          title: "خطأ في الرفع",
          description: `فشل في رفع ${file.name}`,
          variant: "destructive",
        });
      }
    }

    setUploading(false);
    setUploadProgress({});

    if (uploadedFiles.length > 0) {
      onUpload(uploadedFiles);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(files);
    }
  };

  const handleRemoveFile = async (fileId: string) => {
    try {
      // Call API to delete file
      const response = await fetch(`/api/content-management/images/${fileId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        if (onRemove) {
          onRemove(fileId);
        }
        toast({
          title: "تم الحذف",
          description: "تم حذف الملف بنجاح",
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "فشل في حذف الملف",
        variant: "destructive",
      });
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            } ${uploading ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
          >
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                <div>
                  <p className="text-lg font-medium">جاري الرفع...</p>
                  <div className="mt-2 space-y-2">
                    {Object.entries(uploadProgress).map(
                      ([fileName, progress]) => (
                        <div key={fileName} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{fileName}</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">رفع ملفات جديدة</p>
                  <p className="text-muted-foreground mt-1">
                    اسحب الملفات هنا أو انقر للتحديد
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    الحد الأقصى: {maxFileSize}MB لكل ملف | {maxFiles} ملفات كحد
                    أقصى
                  </p>
                </div>
                <Button type="button" variant="outline">
                  تحديد ملفات
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              multiple={allowMultiple}
              accept={acceptedTypes.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Files Preview */}
      {showPreview && existingFiles.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">الملفات المرفوعة</h3>
              <Badge variant="secondary">
                {existingFiles.length} / {maxFiles}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingFiles.map((file) => (
                <Card key={file.id} className="group relative overflow-hidden">
                  <div className="aspect-square relative">
                    {isImageFile(file.mimetype) ? (
                      <img
                        src={file.url}
                        alt={file.alt || file.originalName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : isVideoFile(file.mimetype) ? (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Film className="w-12 h-12 text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}

                    {/* Overlay Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setPreviewFile(file)}
                        className="text-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(file.url, "_blank")}
                        className="text-xs"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* File Type Badge */}
                    <Badge
                      className="absolute top-2 right-2 text-xs"
                      variant={
                        isImageFile(file.mimetype) ? "default" : "secondary"
                      }
                    >
                      {isImageFile(file.mimetype)
                        ? "صورة"
                        : isVideoFile(file.mimetype)
                          ? "فيديو"
                          : "ملف"}
                    </Badge>
                  </div>

                  <div className="p-3">
                    <h4
                      className="font-medium text-sm truncate"
                      title={file.originalName}
                    >
                      {file.originalName}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatFileSize(file.size)}
                    </p>

                    {/* File Metadata */}
                    <div className="mt-2 space-y-1">
                      <Input
                        placeholder="نص بديل للصورة"
                        value={file.alt || ""}
                        onChange={(e) => {
                          // Update file metadata
                          const updatedFiles = existingFiles.map((f) =>
                            f.id === file.id
                              ? { ...f, alt: e.target.value }
                              : f,
                          );
                          onUpload(updatedFiles);
                        }}
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="max-w-4xl max-h-[90vh] w-full">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">معاينة الملف</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setPreviewFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  {isImageFile(previewFile.mimetype) ? (
                    <img
                      src={previewFile.url}
                      alt={previewFile.alt || previewFile.originalName}
                      className="w-full max-h-[60vh] object-contain rounded"
                    />
                  ) : isVideoFile(previewFile.mimetype) ? (
                    <video
                      src={previewFile.url}
                      controls
                      className="w-full max-h-[60vh] rounded"
                    />
                  ) : (
                    <div className="w-full h-64 bg-muted flex items-center justify-center rounded">
                      <ImageIcon className="w-16 h-16 text-muted-foreground" />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label>اسم الملف</Label>
                      <p className="text-muted-foreground">
                        {previewFile.originalName}
                      </p>
                    </div>
                    <div>
                      <Label>الحجم</Label>
                      <p className="text-muted-foreground">
                        {formatFileSize(previewFile.size)}
                      </p>
                    </div>
                    <div>
                      <Label>النوع</Label>
                      <p className="text-muted-foreground">
                        {previewFile.mimetype}
                      </p>
                    </div>
                    <div>
                      <Label>تاريخ الرفع</Label>
                      <p className="text-muted-foreground">
                        {new Date(previewFile.uploadedAt).toLocaleDateString(
                          "ar",
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-alt">النص البديل</Label>
                    <Input
                      id="file-alt"
                      value={previewFile.alt || ""}
                      onChange={(e) => {
                        setPreviewFile({ ...previewFile, alt: e.target.value });
                        const updatedFiles = existingFiles.map((f) =>
                          f.id === previewFile.id
                            ? { ...f, alt: e.target.value }
                            : f,
                        );
                        onUpload(updatedFiles);
                      }}
                      placeholder="وصف للصورة لتحسين الوصولية"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-description">الوصف</Label>
                    <Input
                      id="file-description"
                      value={previewFile.description || ""}
                      onChange={(e) => {
                        setPreviewFile({
                          ...previewFile,
                          description: e.target.value,
                        });
                        const updatedFiles = existingFiles.map((f) =>
                          f.id === previewFile.id
                            ? { ...f, description: e.target.value }
                            : f,
                        );
                        onUpload(updatedFiles);
                      }}
                      placeholder="وصف تفصيلي للملف"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
