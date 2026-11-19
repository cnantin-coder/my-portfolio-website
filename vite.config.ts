import fs from 'fs';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      {
        name: 'copy-static-portfolio-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const foldersToCopy = ['js', 'images', 'css', 'audio'];
          for (const folder of foldersToCopy) {
            const srcFolder = path.resolve(__dirname, folder);
            const distFolder = path.resolve(distDir, folder);
            if (fs.existsSync(distDir) && fs.existsSync(srcFolder)) {
              fs.cpSync(srcFolder, distFolder, {recursive: true, force: true});
            }
          }
        },
      },
    ],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          assignments: path.resolve(__dirname, 'assignments.html'),
          assignment1: path.resolve(__dirname, 'assignment1.html'),
          assignment2: path.resolve(__dirname, 'assignment2.html'),
          assignment3: path.resolve(__dirname, 'assignment3.html'),
          assignment4: path.resolve(__dirname, 'assignment4.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
