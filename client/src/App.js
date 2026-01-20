import React, { useState, useRef } from "react";
import "./App.css";
import { compareImagesLocal } from "./imageComparison";

function App() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInput1Ref = useRef(null);
  const fileInput2Ref = useRef(null);
  const handleImageChange = (e, imageNum) => {
    const file = e.target.files[0];
    if (file) {
      if (imageNum === 1) {
        setImage1(file);
        setPreview1(URL.createObjectURL(file));
      } else {
        setImage2(file);
        setPreview2(URL.createObjectURL(file));
      }
    }
  };

  const handleCompare = async () => {
    if (!image1 || !image2) {
      setError("Please select both images");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const result = await compareImagesLocal(image1, image2);
      setResult(result);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    // revoke object URLs to avoid memory leaks
    if (preview1) URL.revokeObjectURL(preview1);
    if (preview2) URL.revokeObjectURL(preview2);

    setImage1(null);
    setImage2(null);
    setPreview1(null);
    setPreview2(null);
    setResult(null);
    setError(null);

    // clear native file input values
    if (fileInput1Ref.current) fileInput1Ref.current.value = "";
    if (fileInput2Ref.current) fileInput2Ref.current.value = "";
  };

  return (
    <div className="container">
      <h1>Image Comparison Tool</h1>
      <p className="subtitle">Compare two images using AI</p>

      <div className="comparison-section">
        <div className="image-upload-box">
          <label>Image 1</label>
          <div className="upload-area">
            {preview1 ? (
              <img src={preview1} alt="Preview 1" className="preview-image" />
            ) : (
              <div className="placeholder">
                <span>📷</span>
                <p>Select Image 1</p>
              </div>
            )}
          </div>
          <input
            ref={fileInput1Ref}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 1)}
            className="file-input"
          />
        </div>

        <div className="vs-separator">VS</div>

        <div className="image-upload-box">
          <label>Image 2</label>
          <div className="upload-area">
            {preview2 ? (
              <img src={preview2} alt="Preview 2" className="preview-image" />
            ) : (
              <div className="placeholder">
                <span>📷</span>
                <p>Select Image 2</p>
              </div>
            )}
          </div>
          <input
            ref={fileInput2Ref}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 2)}
            className="file-input"
          />
        </div>
      </div>

      <div className="button-group">
        <button
          onClick={handleCompare}
          disabled={loading || !image1 || !image2}
          className="btn-compare"
        >
          {loading ? "Comparing..." : "Compare Images"}
        </button>
        <button onClick={resetForm} className="btn-reset">
          Reset
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <div
          className={`result-box ${
            result.is_similar ? "similar" : "not-similar"
          }`}
        >
          <h2>{result.message}</h2>
          <p>
            {result.is_similar
              ? "✅ The images appear to be similar"
              : "❌ The images are not similar"}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
