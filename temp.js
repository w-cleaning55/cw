import fs from 'fs/promises';
import path from 'path';

async function modifyApiEndpoint(filePath, dataInterfaceName, defaultData) {
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');

    // Add import statement
    const importStatement = `import { safeFileRead, safeFileWrite } from '../../../../lib/api-utils';\n`;
    const contentWithImport = importStatement + fileContent;

    // Modify GET method
    const getMethodRegex = /export async function GET\\([^)]*\\) {([\\s\\S]*?)\}/;
    const getMethodMatch = contentWithImport.match(getMethodRegex);

    if (getMethodMatch) {
      const originalGetMethod = getMethodMatch[0];
      const getMethodBody = getMethodMatch[1];

      const modifiedGetMethodBody = `
  try {
    ensureDataDirectory();
    
    const data = await safeFileRead(BOOKINGS_FILE, defaultData);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading ${dataInterfaceName}:', error);
    return NextResponse.json(
      { error: 'Failed to load ${dataInterfaceName}' },
      { status: 500 }
    );
  }
`;

      const modifiedGetMethod = `export async function GET() {\${modifiedGetMethodBody}}`;
      const contentWithModifiedGetMethod = contentWithImport.replace(originalGetMethod, modifiedGetMethod);

      // Use safeFileWrite to write the modified content
      await fs.writeFile(filePath, contentWithModifiedGetMethod);

      console.log(`Successfully modified ${filePath}`);
    } else {
      console.warn(`Could not find GET method in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error modifying ${filePath}:`, error);
  }
}

modifyApiEndpoint(
  'app/api/admin/bookings/route.ts',
  'Booking[]',
  []
);