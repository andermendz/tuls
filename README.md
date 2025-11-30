<div align="center">

# 🛠️ Tuls

**Privacy-First Image Utility Platform**

A beautiful, modern web application for image processing that runs entirely in your browser. No uploads, no servers, no compromises.

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/andermendz/tuls)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6.svg)](https://www.typescriptlang.org/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

Tuls is a comprehensive image processing toolkit that prioritizes your privacy. Every operation happens locally in your browser using modern web technologies—your files never leave your device. With a stunning Material You design and powerful features, Tuls makes image editing accessible, secure, and delightful.

## ✨ Features

### 🎨 Image Tools

- **🗜️ Compressor** - Reduce file sizes while maintaining quality with smart compression
- **🔄 Converter** - Convert between JPG, PNG, and WebP formats seamlessly
- **✂️ Cropper** - Precision cropping with preset aspect ratios for social media
- **🔍 Metadata Viewer** - Inspect and remove EXIF data to protect your privacy
- **🎨 Palette Generator** - Extract beautiful color schemes from any image
- **🪄 Background Remover** - AI-powered background removal running locally via WebAssembly

### 🔒 Privacy Features

- ✅ **100% Client-Side Processing** - All operations happen in your browser
- ✅ **No Server Uploads** - Your images never leave your device
- ✅ **Works Offline** - Full functionality without internet connection
- ✅ **No Tracking** - Zero analytics or data collection
- ✅ **Free Forever** - No subscriptions, credits, or hidden fees

### 🎯 Design Excellence

- 🌓 **Material You Design System** - Modern, beautiful interface with dark mode
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- ⚡ **Blazing Fast** - Instant feedback and smooth animations
- ♿ **Accessible** - WCAG compliant with keyboard navigation
- 🎭 **SEO Optimized** - Structured data and meta tags for discoverability

## 🚀 Demo

Visit the live demo: **[tuls.app](https://tuls.app)** *(replace with your actual URL)*

## 🛠️ Installation

### Prerequisites

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/andermendz/tuls.git
   cd tuls
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup** *(Optional - only for Background Remover)*
   
   Create a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
   > **Note:** The background remover uses WebAssembly and works without an API key for most use cases.

4. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
pnpm build
# or
npm run build
```

Preview the production build:
```bash
pnpm preview
# or
npm run preview
```

## 💻 Tech Stack

### Frontend Framework
- **React 19.2** - Modern UI library with hooks and concurrent features
- **TypeScript 5.8** - Type-safe development
- **Vite 6.2** - Lightning-fast build tool and dev server

### Routing & SEO
- **React Router 6** - Client-side routing
- **React Helmet Async** - Dynamic meta tags and SEO optimization

### Styling
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **Material You Design** - Custom design system with dynamic theming
- **Google Fonts** - Inter & Outfit fonts for typography
- **Lucide React** - Beautiful, consistent icons

### Image Processing
- **@imgly/background-removal** - AI-powered background removal (WebAssembly)
- **react-easy-crop** - Interactive image cropping
- **exifr** - EXIF metadata extraction
- **Canvas API** - Format conversion and compression

### Developer Experience
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Automatic vendor prefixing

## 📁 Project Structure

```
tuls/
├── public/               # Static assets
│   ├── favicon.svg
│   └── site.webmanifest
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base components (Button, Card, etc.)
│   │   ├── Layout.tsx  # App layout with navigation
│   │   └── SEO.tsx     # SEO component
│   ├── features/       # Feature-specific components
│   │   ├── BackgroundRemoverTool.tsx
│   │   ├── ColorTool.tsx
│   │   ├── CompressorTool.tsx
│   │   ├── ConverterTool.tsx
│   │   ├── CropperTool.tsx
│   │   ├── MetadataTool.tsx
│   │   └── Settings.tsx
│   ├── pages/          # Page components
│   │   ├── Home.tsx
│   │   └── NotFound.tsx
│   ├── utils/          # Utility functions
│   │   ├── imageUtils.ts
│   │   └── colorUtils.ts
│   ├── types.ts        # TypeScript type definitions
│   ├── App.tsx         # Root component
│   ├── index.tsx       # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies and scripts
```

## 🎯 Usage

### Compress Images
1. Navigate to **Compressor** from the sidebar
2. Upload your image
3. Adjust quality slider to your preference
4. Download the compressed version

### Convert Formats
1. Go to **Converter**
2. Upload an image
3. Select target format (JPG, PNG, or WebP)
4. Click "Convert" and download

### Remove Backgrounds
1. Open **Background Remover**
2. Upload an image with a clear subject
3. Wait for AI processing (runs locally)
4. Download transparent PNG

### Extract Color Palettes
1. Visit **Palette Generator**
2. Upload any image
3. Click color cards to copy hex codes
4. Use in your designs!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Material Design 3](https://m3.material.io/) for design inspiration
- [@imgly/background-removal](https://github.com/imgly/background-removal-js) for AI background removal
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility classes

## 📧 Contact

**Anderson Mendez** - [@andermendz](https://github.com/andermendz)

Project Link: [https://github.com/andermendz/tuls](https://github.com/andermendz/tuls)

---

<div align="center">

Made with ❤️ using Material You

**[⭐ Star this repo](https://github.com/andermendz/tuls)** if you find it useful!

</div>
