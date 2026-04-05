import os
import json

BASE_DIR = "frontend"

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w') as f:
        f.write(content.strip() + "\n")

# package.json
write_file(f"{BASE_DIR}/package.json", json.dumps({
  "name": "mediconnect-frontend",
  "private": True,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --port 3000",
    "build": "tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.3",
    "lucide-react": "^0.358.0",
    "axios": "^1.6.8",
    "zustand": "^4.5.2",
    "@tanstack/react-query": "^5.28.4",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "typescript": "^5.2.2",
    "vite": "^5.1.6"
  }
}, indent=2))

# vite.config.ts
write_file(f"{BASE_DIR}/vite.config.ts", """
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: true
  }
})
""")

# tsconfig.json
write_file(f"{BASE_DIR}/tsconfig.json", """
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
""")

# tsconfig.node.json
write_file(f"{BASE_DIR}/tsconfig.node.json", """
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
""")

# tailwind.config.js
write_file(f"{BASE_DIR}/tailwind.config.js", """
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#e0f2fe',
          DEFAULT: '#0ea5e9',
          dark: '#0284c7',
        }
      }
    },
  },
  plugins: [],
}
""")

# postcss.config.js
write_file(f"{BASE_DIR}/postcss.config.js", """
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
""")

# index.html
write_file(f"{BASE_DIR}/index.html", """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>MediConnect Lanka</title>
  </head>
  <body class="bg-slate-50 text-slate-900 antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
""")

# src/index.css
write_file(f"{BASE_DIR}/src/index.css", """
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-sans;
  }
}
""")

# src/main.tsx
write_file(f"{BASE_DIR}/src/main.tsx", """
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
""")

# src/App.tsx
write_file(f"{BASE_DIR}/src/App.tsx", """
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <header className="bg-brand text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">MediConnect Lanka</h1>
            <nav className="space-x-4">
              <a href="#" className="hover:text-brand-light transition">Home</a>
              <a href="#" className="hover:text-brand-light transition">Login</a>
            </nav>
          </div>
        </header>
        <main className="container mx-auto mt-8 p-4">
          <div className="bg-brand-light rounded-xl p-8 text-center text-brand-dark">
            <h2 className="text-3xl font-bold mb-4">Welcome to Smart Healthcare</h2>
            <p className="text-lg">Book appointments, consult online, and manage your health efficiently.</p>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
""")

print("React application setup generated successfully!")
