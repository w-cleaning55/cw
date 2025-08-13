import { useState, useEffect, useCallback } from "react";
import {
  colorPaletteService,
  ColorPalette,
} from "../services/colorPaletteService";

interface UseColorPaletteReturn {
  // State
  palettes: ColorPalette[];
  activePalette: ColorPalette | null;
  loading: boolean;
  error: string | null;

  // Actions
  loadPalettes: () => Promise<void>;
  setActivePalette: (id: string) => Promise<void>;
  createPalette: (
    palette: Omit<ColorPalette, "id" | "createdAt" | "updatedAt">,
  ) => Promise<void>;
  updatePalette: (id: string, palette: Partial<ColorPalette>) => Promise<void>;
  deletePalette: (id: string) => Promise<void>;
  generateAIPalette: (
    prompt: string,
    category: string,
  ) => Promise<ColorPalette>;
  generateFromImage: (imageFile: File) => Promise<ColorPalette>;
  applyPalette: (palette: ColorPalette) => void;

  // Helpers
  getPaletteById: (id: string) => ColorPalette | undefined;
  getPalettesByCategory: (category: string) => ColorPalette[];
}

export function useColorPalette(): UseColorPaletteReturn {
  const [palettes, setPalettes] = useState<ColorPalette[]>([]);
  const [activePalette, setActivePaletteState] = useState<ColorPalette | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all palettes
  const loadPalettes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedPalettes = await colorPaletteService.getPalettes();

      // Ensure we have valid palettes
      if (
        loadedPalettes &&
        Array.isArray(loadedPalettes) &&
        loadedPalettes.length > 0
      ) {
        setPalettes(loadedPalettes);

        // Set active palette
        const active =
          loadedPalettes.find((p) => p.isActive) || loadedPalettes[0];
        if (active) {
          setActivePaletteState(active);
          colorPaletteService.applyPalette(active);
        }
      } else {
        throw new Error("No valid palettes received");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "خطأ في تحميل الباليتات";
      setError(errorMessage);
      console.warn("Error loading palettes:", err);

      // Use default palettes as fallback
      const defaultPalettes = [
        {
          id: "default",
          name: "Default",
          nameAr: "افتراضي",
          description: "Default palette",
          descriptionAr: "باليت افتراضي",
          category: "business" as const,
          colors: {
            primary: "#2563eb",
            secondary: "#64748b",
            accent: "#0ea5e9",
            background: "#ffffff",
            surface: "#f8fafc",
            text: "#0f172a",
            textSecondary: "#64748b",
            border: "#e2e8f0",
            success: "#16a34a",
            warning: "#ea580c",
            error: "#dc2626",
            info: "#0ea5e9",
          },
          cssVariables: {},
          isActive: true,
          isDefault: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setPalettes(defaultPalettes);
      setActivePaletteState(defaultPalettes[0]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Set active palette
  const setActivePalette = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await colorPaletteService.setActivePalette(id);

        // Update local state
        const updatedPalettes = palettes.map((p) => ({
          ...p,
          isActive: p.id === id,
        }));
        setPalettes(updatedPalettes);

        const newActivePalette = updatedPalettes.find((p) => p.id === id);
        if (newActivePalette) {
          setActivePaletteState(newActivePalette);
          colorPaletteService.applyPalette(newActivePalette);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ في تفعيل الباليت");
        console.error("Error activating palette:", err);
      } finally {
        setLoading(false);
      }
    },
    [palettes],
  );

  // Create new palette
  const createPalette = useCallback(
    async (
      paletteData: Omit<ColorPalette, "id" | "createdAt" | "updatedAt">,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const newPalette = await colorPaletteService.savePalette(paletteData);

        // Update local state
        const updatedPalettes = [...palettes, newPalette];
        if (newPalette.isActive) {
          // Deactivate other palettes
          updatedPalettes.forEach((p) => {
            if (p.id !== newPalette.id) {
              p.isActive = false;
            }
          });
          setActivePaletteState(newPalette);
          colorPaletteService.applyPalette(newPalette);
        }

        setPalettes(updatedPalettes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ في إنشاء الباليت");
        console.error("Error creating palette:", err);
      } finally {
        setLoading(false);
      }
    },
    [palettes],
  );

  // Update existing palette
  const updatePalette = useCallback(
    async (id: string, paletteData: Partial<ColorPalette>) => {
      try {
        setLoading(true);
        setError(null);

        const updatedPalette = await colorPaletteService.updatePalette(
          id,
          paletteData,
        );

        // Update local state
        const updatedPalettes = palettes.map((p) =>
          p.id === id ? updatedPalette : p,
        );

        if (updatedPalette.isActive) {
          // Deactivate other palettes
          updatedPalettes.forEach((p) => {
            if (p.id !== updatedPalette.id) {
              p.isActive = false;
            }
          });
          setActivePaletteState(updatedPalette);
          colorPaletteService.applyPalette(updatedPalette);
        }

        setPalettes(updatedPalettes);
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ في تحديث الباليت");
        console.error("Error updating palette:", err);
      } finally {
        setLoading(false);
      }
    },
    [palettes],
  );

  // Delete palette
  const deletePalette = useCallback(
    async (id: string) => {
      try {
        setLoading(true);
        setError(null);

        await colorPaletteService.deletePalette(id);

        // Update local state
        const updatedPalettes = palettes.filter((p) => p.id !== id);
        setPalettes(updatedPalettes);

        // If deleted palette was active, activate the first one
        if (activePalette?.id === id) {
          const newActivePalette =
            updatedPalettes.find((p) => p.isDefault) || updatedPalettes[0];
          if (newActivePalette) {
            setActivePaletteState(newActivePalette);
            colorPaletteService.applyPalette(newActivePalette);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "خطأ في حذف الباليت");
        console.error("Error deleting palette:", err);
      } finally {
        setLoading(false);
      }
    },
    [palettes, activePalette],
  );

  // Generate AI palette
  const generateAIPalette = useCallback(
    async (prompt: string, category: string): Promise<ColorPalette> => {
      try {
        setLoading(true);
        setError(null);

        const generatedPalette = await colorPaletteService.generateWithAI(
          prompt,
          category,
        );
        return generatedPalette;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "خطأ في توليد الباليت بالذكاء الاصطناعي",
        );
        console.error("Error generating AI palette:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Generate from image
  const generateFromImage = useCallback(
    async (imageFile: File): Promise<ColorPalette> => {
      try {
        setLoading(true);
        setError(null);

        const generatedPalette =
          await colorPaletteService.generateFromImage(imageFile);
        return generatedPalette;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "خطأ في توليد الباليت من الصورة",
        );
        console.error("Error generating palette from image:", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Apply palette to document
  const applyPalette = useCallback((palette: ColorPalette) => {
    colorPaletteService.applyPalette(palette);
  }, []);

  // Get palette by ID
  const getPaletteById = useCallback(
    (id: string): ColorPalette | undefined => {
      return palettes.find((p) => p.id === id);
    },
    [palettes],
  );

  // Get palettes by category
  const getPalettesByCategory = useCallback(
    (category: string): ColorPalette[] => {
      return palettes.filter((p) => p.category === category);
    },
    [palettes],
  );

  // Load palettes on mount
  useEffect(() => {
    loadPalettes();
  }, []); // Remove loadPalettes dependency to prevent infinite loop

  // Load from localStorage on mount for immediate theme application
  useEffect(() => {
    const savedPalette = localStorage.getItem("active-palette");
    if (savedPalette) {
      try {
        const palette = JSON.parse(savedPalette);
        colorPaletteService.applyPalette(palette);
        setActivePaletteState(palette);
      } catch (err) {
        console.error("Error loading saved palette:", err);
      }
    }
  }, []);

  return {
    // State
    palettes,
    activePalette,
    loading,
    error,

    // Actions
    loadPalettes,
    setActivePalette,
    createPalette,
    updatePalette,
    deletePalette,
    generateAIPalette,
    generateFromImage,
    applyPalette,

    // Helpers
    getPaletteById,
    getPalettesByCategory,
  };
}
