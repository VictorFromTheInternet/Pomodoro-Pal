import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source and destination directories
const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Files to copy
const files = [
  'manifest.json',
  'popup.html',
  'popup.css',
  'popup.js',
  'content.js',
  'background.js',
  'Pomodoro_Pal_16.png',
  'Pomodoro_Pal_32.png',
  'Pomodoro_Pal_48.png',
  'Pomodoro_Pal_128.png',
  'Pomodoro_Pal_Typing.gif',
  'Pomodoro_Pal_Sleeping.gif'
];

// Copy each file
files.forEach(file => {
  const srcPath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`✓ Copied ${file}`);
  } else {
    console.log(`⚠ Warning: ${file} not found`);
  }
});

console.log('\n✓ Build complete! Extension ready in dist/');
