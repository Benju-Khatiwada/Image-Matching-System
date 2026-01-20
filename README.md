# Image Comparison Tool

A lightweight, frontend-only React application for comparing two images and determining their similarity using pixel-based and histogram analysis. **No backend server required!**

## Features

- ✨ Upload and compare two images instantly
- 🖼️ Real-time image preview
- ⚡ Image comparison using Canvas API (browser-based)
- 🎯 Simple result indication (Similar/Different)
- 📱 Responsive design
- 🔒 All processing happens locally in your browser - no data sent anywhere

## Quick Start

```bash
# Navigate to client folder
cd client

# Install dependencies
npm install

# Start the app
npm start
```

Then open `http://localhost:3000` in your browser.

## Project Structure

```
image_finder1/
├── README.md                # This file
└── client/                  # React frontend (complete app)
    ├── src/
    │   ├── App.js          # Main component
    │   ├── App.css         # Styling
    │   ├── imageComparison.js  # Browser-based comparison algorithm
    │   ├── index.js        # React entry point
    │   └── index.css       # Global styles
    ├── public/
    │   └── index.html      # HTML template
    ├── package.json        # Dependencies
    └── build/              # Production build (after npm run build)
```

## How to Use

1. **Upload Image 1** - Click the first upload area
2. **Upload Image 2** - Click the second upload area
3. **Click "Compare Images"** - See the result instantly
4. **View Result** - "Similar" or "Different"
5. **Reset** - Compare new images

## Image Comparison Algorithm

Uses three methods to determine similarity:

### 1. **File Size** (20% weight)

- Compares image file sizes

### 2. **Pixel Analysis** (50% weight)

- Loads images in Canvas API
- Resizes to 256x256
- Compares pixel RGB values
- Calculates average difference

### 3. **Histogram** (30% weight)

- Analyzes color distribution
- Compares histograms
- Higher intersection = more similar

**Overall = (Size × 0.2) + (Pixels × 0.5) + (Histogram × 0.3)**

**Result:**

- ✓ Similar if ≥ 50%
- ✗ Different if < 50%

## Supported Formats

- JPG / JPEG
- PNG
- GIF
- BMP
- WebP

## Build for Production

```bash
cd client
npm run build
```

Then deploy the `build` folder to your hosting.

## Browser Support

- Chrome/Chromium
- Firefox
- Safari
- Edge

All modern browsers with Canvas API support.

## Privacy

✅ All processing happens **locally in your browser**
✅ No data uploaded anywhere
✅ No servers involved
✅ Images automatically deleted after comparison

## Technologies

- React 18.2.0
- Canvas API
- CSS3

## Troubleshooting

**Port 3000 in use?**

```powershell
taskkill /F /IM node.exe
```

**Installation issues?**

```bash
cd client
rm -r node_modules package-lock.json
npm install
npm start
```

## License

MIT License - Open Source
