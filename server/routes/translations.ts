import { RequestHandler } from "express";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";

const MissingKeySchema = z.object({
  key: z.string(),
  currentLanguage: z.string()
});

export const handleMissingTranslation: RequestHandler = async (req, res) => {
  try {
    const { key, currentLanguage } = MissingKeySchema.parse(req.body);
    
    // In development, automatically add missing keys
    if (process.env.NODE_ENV === 'development') {
      const filePath = path.join(process.cwd(), 'public', 'i18n', `${currentLanguage}.json`);
      
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const translations = JSON.parse(fileContent);
        
        // Add the missing key with a placeholder value
        const keyParts = key.split('.');
        let current = translations;
        
        for (let i = 0; i < keyParts.length - 1; i++) {
          if (!(keyParts[i] in current)) {
            current[keyParts[i]] = {};
          }
          current = current[keyParts[i]];
        }
        
        // Set the final key with a placeholder
        const finalKey = keyParts[keyParts.length - 1];
        if (!(finalKey in current)) {
          current[finalKey] = `[MISSING: ${key}]`;
          
          // Write the updated translations back to the file
          await fs.writeFile(filePath, JSON.stringify(translations, null, 2));
          
          console.log(`Added missing translation key: ${key} to ${currentLanguage}.json`);
        }
        
      } catch (error) {
        console.error('Error updating translation file:', error);
      }
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Translation error:', error);
    res.status(400).json({ error: 'Invalid request' });
  }
};

export const handleGetTranslations: RequestHandler = async (req, res) => {
  try {
    const { language } = req.params;
    
    if (!language || !['en', 'ar'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }
    
    const filePath = path.join(process.cwd(), 'public', 'i18n', `${language}.json`);
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const translations = JSON.parse(fileContent);
      res.json(translations);
    } catch (error) {
      console.error(`Error reading translation file for ${language}:`, error);
      res.status(404).json({ error: 'Translation file not found' });
    }
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const handleUpdateTranslations: RequestHandler = async (req, res) => {
  try {
    const { language } = req.params;
    const translations = req.body;
    
    if (!language || !['en', 'ar'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }
    
    const filePath = path.join(process.cwd(), 'public', 'i18n', `${language}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(translations, null, 2));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Translation update error:', error);
    res.status(500).json({ error: 'Failed to update translations' });
  }
};
