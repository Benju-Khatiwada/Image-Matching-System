# React App Setup Instructions

## Project Structure
```
client/
├── public/
│   └── index.html
├── src/
│   ├── index.js
│   ├── index.css
│   ├── App.js
│   └── App.css
├── package.json
└── .gitignore
```

## Installation & Running

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Start the Development Server
```bash
npm start
```

The React app will open at `http://localhost:3000`

### 3. Ensure Backend is Running
Make sure your Express server is running on `http://localhost:5000`:
```bash
cd server
npm start
```

## Features

✅ **Upload Two Images**: Select and preview two images side-by-side
✅ **AI-Powered Comparison**: Uses GPT-4o-mini to describe images
✅ **Similarity Analysis**: Calculates semantic similarity using embeddings
✅ **Responsive Design**: Works on desktop and mobile devices
✅ **Real-time Results**: Shows whether images are similar or not

## How It Works

1. User selects two images from their device
2. Images are uploaded to the server via multipart form
3. Server processes:
   - Converts images to base64
   - Sends to GPT-4o-mini for detailed description
   - Generates embeddings using text-embedding-3-large
   - Calculates cosine similarity
4. Result is displayed with similarity score

## Technologies Used

- **React 18**: Frontend framework
- **Axios**: HTTP client for API calls
- **CSS3**: Modern styling with gradients and animations
- **OpenAI API**: Image description and embeddings

## Troubleshooting

**CORS Errors**: Make sure backend has CORS enabled (already configured)

**File Upload Issues**: Ensure `uploads/` folder exists in server directory

**API Errors**: Check that OPENAI_API_KEY is set in server `.env` file
