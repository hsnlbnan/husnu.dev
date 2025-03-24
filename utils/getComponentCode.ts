import fs from 'fs';
import path from 'path';

export const getComponentCode = async (componentPath: string) => {
  try {
    const fullPath = path.join(process.cwd(), 'components', componentPath);
    const code = await fs.promises.readFile(fullPath, 'utf8');
    return code;
  } catch (error) {
    console.error('Error reading component code:', error);
    return '';
  }
};