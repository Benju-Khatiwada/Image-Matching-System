// Image comparison utility using Canvas API
// Works entirely in the browser without backend

export async function compareImagesLocal(image1File, image2File) {
  try {
    const img1Data = await loadImageData(image1File);
    const img2Data = await loadImageData(image2File);

    // Method 1: Size comparison
    const sizeSimilarity = calculateSizeSimilarity(
      image1File.size,
      image2File.size,
    );

    // Method 2: Pixel data comparison
    const pixelSimilarity = comparePixelData(img1Data, img2Data);

    // Method 3: Histogram comparison
    const histSimilarity = compareHistograms(img1Data, img2Data);

    // Combine methods with stricter weighting
    const overallSimilarity =
      sizeSimilarity * 0.2 + pixelSimilarity * 0.6 + histSimilarity * 0.2;

    // Higher threshold for similarity (70%)
    const isSimilar = overallSimilarity >= 70;

    return {
      similarity_score: Math.round(overallSimilarity * 100) / 100,
      structural_similarity: Math.round(pixelSimilarity * 100) / 100,
      histogram_similarity: Math.round(histSimilarity * 100) / 100,
      is_similar: isSimilar,
      message: isSimilar ? "Similar Images ✓" : "Different Images ✗",
    };
  } catch (error) {
    throw new Error(`Image comparison failed: ${error.message}`);
  }
}

// Load image and get pixel data
function loadImageData(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Resize to 256x256 for consistent comparison
        canvas.width = 256;
        canvas.height = 256;

        ctx.drawImage(img, 0, 0, 256, 256);

        const imageData = ctx.getImageData(0, 0, 256, 256);
        resolve(imageData.data);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(imageFile);
  });
}

// Calculate similarity based on file size
function calculateSizeSimilarity(size1, size2) {
  const maxSize = Math.max(size1, size2);
  const minSize = Math.min(size1, size2);
  const similarity = (minSize / maxSize) * 100;
  return Math.min(similarity, 100);
}

// Compare pixel data - compares all color channels
function comparePixelData(pixelData1, pixelData2) {
  const minLength = Math.min(pixelData1.length, pixelData2.length);
  let totalDifference = 0;
  let pixelCount = 0;

  // Compare all RGBA channels
  for (let i = 0; i < minLength; i += 4) {
    const r1 = pixelData1[i];
    const g1 = pixelData1[i + 1];
    const b1 = pixelData1[i + 2];

    const r2 = pixelData2[i];
    const g2 = pixelData2[i + 1];
    const b2 = pixelData2[i + 2];

    // Calculate Euclidean distance for RGB
    const diff = Math.sqrt(
      Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2),
    );
    totalDifference += diff;
    pixelCount++;
  }

  const avgDifference = pixelCount > 0 ? totalDifference / pixelCount : 0;
  // Max possible RGB difference is sqrt(3 * 255^2) = ~441
  const similarity = Math.max(0, 100 - (avgDifference / 441) * 100);

  return similarity;
}

// Compare histograms using Bhattacharyya coefficient
function compareHistograms(pixelData1, pixelData2) {
  const hist1 = buildHistogram(pixelData1);
  const hist2 = buildHistogram(pixelData2);

  // Bhattacharyya coefficient - measures overlap between distributions
  let bhattacharyya = 0;
  for (let i = 0; i < 256; i++) {
    bhattacharyya += Math.sqrt(hist1[i] * hist2[i]);
  }

  // Convert to similarity percentage
  // Bhattacharyya ranges from 0 to 1, where 1 is perfect match
  const similarity = Math.max(0, bhattacharyya * 100);

  return similarity;
}

// Build histogram from pixel data
function buildHistogram(pixelData) {
  const histogram = new Array(256).fill(0);

  // Use red channel (every 4 bytes, first byte)
  for (let i = 0; i < pixelData.length; i += 4) {
    const pixelValue = pixelData[i];
    histogram[pixelValue]++;
  }

  // Normalize
  const sum = histogram.reduce((a, b) => a + b, 0);
  return histogram.map((val) => (sum > 0 ? val / sum : 0));
}
