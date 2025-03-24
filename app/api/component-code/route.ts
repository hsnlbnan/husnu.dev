import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const componentPath = searchParams.get('path');

  if (!componentPath) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  try {
    // Temel dizin yolunu düzeltelim - src klasörünü de kontrol edelim
    const possiblePaths = [
      path.join(process.cwd(), 'app', 'components'),
      path.join(process.cwd(), 'src', 'components'),
      path.join(process.cwd(), 'components')
    ];

    let mainFile = null;
    let basePath = '';
    let componentDir = '';

    // Tüm olası yolları deneyelim
    for (const testPath of possiblePaths) {
      try {
        const fullPath = path.join(testPath, componentPath);
        mainFile = await fs.readFile(fullPath, 'utf-8');
        basePath = testPath;
        componentDir = path.dirname(fullPath);
        break;
      } catch (error) {
        continue;
      }
    }

    if (!mainFile) {
      return NextResponse.json({
        files: [{
          name: 'Component.tsx',
          content: `// TimeSelector component example
export const TimeSelector = () => {
  return (
    <div className="w-full max-w-md border   rounded-lg overflow-hidden bg-[#242424]">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-[#969696]">
          <span className="font-medium">Time</span>
        </div>
        <div>
          <span className="text-white">4:30 am</span>
        </div>
      </div>
    </div>
  );
};`,
          language: 'typescript',
          type: 'component'
        },
        {
          name: 'Usage.tsx',
          content: `import { TimeSelector } from '@/components/TimeSelector';

export default function Example() {
  return (
    <div className="p-4">
      <TimeSelector />
    </div>
  );
}`,
          language: 'typescript',
          type: 'usage'
        }]
      });
    }

    const files = [];

    // Ana bileşen dosyasını ekleyelim
    files.push({
      name: path.basename(componentPath),
      content: mainFile,
      language: 'typescript',
      type: 'component'
    });

    // Kullanım örneği ekleyelim
    const usageExample = `import { ${path.basename(componentPath, '.tsx')} } from '@/components/${componentPath.replace('/index.tsx', '')}';

export default function Example() {
  return (
    <div className="p-4">
      <${path.basename(componentPath, '.tsx')} />
    </div>
  );
}`;

    files.push({
      name: 'Usage.tsx',
      content: usageExample,
      language: 'typescript',
      type: 'usage'
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading component files:', error);
    return NextResponse.json({
      files: [{
        name: 'Component.tsx',
        content: `// Example component
export const TimeSelector = () => {
  return (
    <div>Time Selector Component</div>
  );
};`,
        language: 'typescript',
        type: 'component'
      }]
    });
  }
}