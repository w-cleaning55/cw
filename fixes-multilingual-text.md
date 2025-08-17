# Multilingual Text Fixes

## Files that need to be fixed:

### 1. DynamicSimpleHero.tsx ✅ (Already fixed)
- Uses getLocalizedText correctly

### 2. DynamicFeaturesSection.tsx ✅ (Already fixed)
- Uses getLocalizedText correctly

### 3. DynamicTestimonialsSection.tsx ✅ (Already fixed)
- Uses getLocalizedText correctly

### 4. DynamicServicesOverview.tsx ✅ (Already fixed)
- Uses getLocalizedText correctly

### 5. ContentManagementInterface.tsx ✅ (Already fixed)
- Uses getLocalizedText correctly

### 6. Files that still need fixing:

#### ThemeSelector.tsx
- Line 144: {theme.name[isArabic ? "ar" : "en"]}
- Line 148: {theme.description[isArabic ? "ar" : "en"]}
- Line 335: title={theme.name[isArabic ? "ar" : "en"]}

#### AdvancedImageUploader.tsx
- Line 621: {cat.name[isArabic ? "ar" : "en"]}
- Line 663: {cat.name[isArabic ? "ar" : "en"]}
- Line 719: image.altText?.[isArabic ? "ar" : "en"] ||
- Line 748: {image.title?.[isArabic ? "ar" : "en"] ||
- Line 783: image.altText?.[isArabic ? "ar" : "en"] ||
- Line 791: {image.title?.[isArabic ? "ar" : "en"] ||
- Line 795: {image.description?.[isArabic ? "ar" : "en"]}

#### AIAssistant.tsx
- Line 103: return messages[context][isArabic ? "ar" : "en"];

## Fix Pattern:
Replace:
```tsx
{textObj[isArabic ? "ar" : "en"]}
```

With:
```tsx
{getLocalizedText(textObj, isArabic, "fallback text")}
```

## Import Statement:
```tsx
import { getLocalizedText } from "@/lib/utils";
```
