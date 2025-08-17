"use client";

import React, { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useTheme, useDarkMode, useThemeControl } from "@/hooks/useTheme";
import { getLocalizedText } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  Check,
  Eye,
  Settings,
  Sparkles,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

interface ThemeSelectorProps {
  showAdvanced?: boolean;
  compact?: boolean;
  position?: "popup" | "sidebar" | "inline";
}

export default function ThemeSelector({
  showAdvanced = true,
  compact = false,
  position = "popup",
}: ThemeSelectorProps) {
  const { t, isArabic } = useTranslation();
  const { isDarkMode, setDarkMode, toggleDarkMode, autoTheme, setAutoTheme } =
    useDarkMode();

  const {
    currentTheme,
    setCurrentTheme,
    availableThemes,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useThemeControl();

  const { colors, customization, setCustomization } = useTheme();

  const [activeTab, setActiveTab] = useState("themes");
  const [showPreview, setShowPreview] = useState(false);

  // استيراد الإعدادات
  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importSettings(content)) {
          alert(
            isArabic
              ? "تم استيراد الإعدادات بنجاح"
              : "Settings imported successfully",
          );
        } else {
          alert(
            isArabic ? "فشل في استيراد الإعدادات" : "Failed to import settings",
          );
        }
      };
      reader.readAsText(file);
    }
  };

  // تصدير الإعدادات
  const handleExportSettings = () => {
    const settings = exportSettings();
    const blob = new Blob([settings], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme-settings.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // الثيمات مع معاينة
  const renderThemeCard = (themeId: string, theme: any) => (
    <Card
      key={themeId}
      className={`cursor-pointer transition-all hover:scale-105 ${
        currentTheme === themeId
          ? "ring-2 ring-blue-500 shadow-lg"
          : "hover:shadow-md"
      }`}
      onClick={() => setCurrentTheme(themeId)}
    >
      <CardContent className="p-4">
        {/* معاينة الألوان */}
        <div className="flex gap-1 mb-3">
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: isDarkMode
                ? theme.dark.primary
                : theme.light.primary,
            }}
          />
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: isDarkMode
                ? theme.dark.secondary
                : theme.light.secondary,
            }}
          />
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: isDarkMode
                ? theme.dark.accent
                : theme.light.accent,
            }}
          />
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: isDarkMode
                ? theme.dark.neutral
                : theme.light.neutral,
            }}
          />
        </div>

        <h3 className="font-semibold text-sm mb-1">
          {getLocalizedText(theme.name, isArabic, "اسم الثيم")}
        </h3>

        <p className="text-xs text-gray-600 mb-2">
          {getLocalizedText(theme.description, isArabic, "وصف الثيم")}
        </p>

        {currentTheme === themeId && (
          <Badge variant="default" className="text-xs">
            <Check className="w-3 h-3 mr-1" />
            {isArabic ? "مفعل" : "Active"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );

  // الإعدادات المتقدمة
  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      {/* إعدادات التخصيص */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4" />
          {isArabic ? "إعدادات التخصيص" : "Customization Settings"}
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "تفعيل الحركات" : "Enable Animations"}
            </Label>
            <Switch
              checked={customization.enableAnimations}
              onCheckedChange={(checked) =>
                setCustomization({ enableAnimations: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "تفعيل الظلال" : "Enable Shadows"}
            </Label>
            <Switch
              checked={customization.enableShadows}
              onCheckedChange={(checked) =>
                setCustomization({ enableShadows: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "تفعيل التدرجات" : "Enable Gradients"}
            </Label>
            <Switch
              checked={customization.enableGradients}
              onCheckedChange={(checked) =>
                setCustomization({ enableGradients: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "تفعيل الضبابية" : "Enable Blur Effects"}
            </Label>
            <Switch
              checked={customization.enableBlur}
              onCheckedChange={(checked) =>
                setCustomization({ enableBlur: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "الوضع المضغوط" : "Compact Mode"}
            </Label>
            <Switch
              checked={customization.compactMode}
              onCheckedChange={(checked) =>
                setCustomization({ compactMode: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-sm">
              {isArabic ? "التباين العالي" : "High Contrast"}
            </Label>
            <Switch
              checked={customization.highContrast}
              onCheckedChange={(checked) =>
                setCustomization({ highContrast: checked })
              }
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* أدوات الإدارة */}
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          {isArabic ? "أدوات الإدارة" : "Management Tools"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSettings}
            className="justify-start"
          >
            <Download className="w-4 h-4 mr-2" />
            {isArabic ? "تصدير" : "Export"}
          </Button>

          <div>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
              id="import-settings"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                document.getElementById("import-settings")?.click()
              }
              className="justify-start w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isArabic ? "استيراد" : "Import"}
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={resetToDefaults}
            className="justify-start"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {isArabic ? "إعادة تعيين" : "Reset"}
          </Button>
        </div>
      </div>
    </div>
  );

  // الوضع المضغوط
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {/* زر الدارك مود */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleDarkMode}
          className="p-2"
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </Button>

        {/* اختيار الثيم */}
        <div className="flex gap-1">
          {Object.entries(availableThemes).map(([themeId, theme]) => (
            <button
              key={themeId}
              onClick={() => setCurrentTheme(themeId)}
              className={`w-6 h-6 rounded-full border-2 transition-all ${
                currentTheme === themeId
                  ? "border-gray-400 scale-110"
                  : "border-gray-200 hover:scale-105"
              }`}
              style={{
                backgroundColor: isDarkMode
                  ? theme.dark.primary
                  : theme.light.primary,
              }}
              title={getLocalizedText(theme.name, isArabic, "اسم الثيم")}
            />
          ))}
        </div>
      </div>
    );
  }

  // الوضع الكامل
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          {isArabic ? "إعدادات الثيم" : "Theme Settings"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="themes" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              {isArabic ? "الثيمات" : "Themes"}
            </TabsTrigger>
            <TabsTrigger value="dark-mode" className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="w-4 h-4" />
              ) : (
                <Sun className="w-4 h-4" />
              )}
              {isArabic ? "الوضع الليلي" : "Dark Mode"}
            </TabsTrigger>
            {showAdvanced && (
              <TabsTrigger value="advanced" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                {isArabic ? "متقدم" : "Advanced"}
              </TabsTrigger>
            )}
          </TabsList>

          {/* تبويب الثيمات */}
          <TabsContent value="themes" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">
                {isArabic ? "اختر الثيم المفضل" : "Choose Your Preferred Theme"}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(availableThemes).map(([themeId, theme]) =>
                  renderThemeCard(themeId, theme),
                )}
              </div>
            </div>

            {/* معاينة الثيم الحالي */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {isArabic ? "معاينة الثيم الحالي" : "Current Theme Preview"}
              </h3>

              <Card
                className="p-4"
                style={{
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <span className="font-semibold">
                                              {getLocalizedText(availableThemes[currentTheme]?.name, isArabic, "اسم الثيم")}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <div
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ backgroundColor: colors.primary }}
                    >
                      {isArabic ? "زر أساسي" : "Primary Button"}
                    </div>
                    <div
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ backgroundColor: colors.secondary }}
                    >
                      {isArabic ? "زر ثانوي" : "Secondary Button"}
                    </div>
                  </div>

                  <p style={{ color: colors.textSecondary }}>
                    {isArabic
                      ? "هذا مثال على النص الثانوي في الثيم المحدد"
                      : "This is an example of secondary text in the selected theme"}
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* تبويب الوضع الليلي */}
          <TabsContent value="dark-mode" className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                {isDarkMode ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                {isArabic ? "إعدادات الوضع الليلي" : "Dark Mode Settings"}
              </h3>

              <div className="space-y-4">
                {/* التبديل اليدوي */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5" />
                    ) : (
                      <Sun className="w-5 h-5" />
                    )}
                    <div>
                      <Label className="font-medium">
                        {isDarkMode
                          ? isArabic
                            ? "الوضع الليلي"
                            : "Dark Mode"
                          : isArabic
                            ? "الوضع النهاري"
                            : "Light Mode"}
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isDarkMode
                          ? isArabic
                            ? "الوضع الليلي مفعل حالياً"
                            : "Dark mode is currently active"
                          : isArabic
                            ? "الوضع النهاري مفعل حالياً"
                            : "Light mode is currently active"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={setDarkMode}
                    disabled={autoTheme}
                  />
                </div>

                {/* التبديل التلقائي */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Monitor className="w-5 h-5" />
                    <div>
                      <Label className="font-medium">
                        {isArabic ? "التبديل التلقائي" : "Auto Switch"}
                      </Label>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isArabic
                          ? "تبديل تلقائي حسب إعدادات النظام"
                          : "Automatically switch based on system settings"}
                      </p>
                    </div>
                  </div>
                  <Switch checked={autoTheme} onCheckedChange={setAutoTheme} />
                </div>

                {/* معلومات إضافية */}
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {isArabic ? "نصائح الوضع الليلي" : "Dark Mode Tips"}
                      </h4>
                      <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <li>
                          •{" "}
                          {isArabic
                            ? "يقلل إجهاد العين في الإضاءة المنخفضة"
                            : "Reduces eye strain in low light"}
                        </li>
                        <li>
                          •{" "}
                          {isArabic
                            ? "يوفر بطارية الشاشات OLED"
                            : "Saves battery on OLED screens"}
                        </li>
                        <li>
                          •{" "}
                          {isArabic
                            ? "يحسن التركيز أثناء الليل"
                            : "Improves focus during night time"}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* تبويب الإعدادات المتقدمة */}
          {showAdvanced && (
            <TabsContent value="advanced" className="space-y-6">
              {renderAdvancedSettings()}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
