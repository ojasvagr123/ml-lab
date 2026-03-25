import { useState } from "react";
import ResultBox from "../components/ResultBox";
import Loader from "../components/Loader";
import DropUpload from "../components/DropUpload";
import api from "../services/api";

export default function FlagPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
    setResult(null);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await api.post("/predict/flag", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(response.data);
    } catch (error: any) {
      setResult({ error: error?.response?.data || "Prediction failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section className="hero">
        <h1 className="page-title">Flag Image Prediction</h1>
        <p className="page-subtitle">
          Upload a flag image and get the most likely country prediction with top confidence scores.
        </p>
      </section>

      <div className="section-shell">
        <div className="glass-panel">
          <h2 className="panel-title">Upload Flag Image</h2>
          <p className="panel-subtitle">
            You can drag and drop an image here or choose it manually.
          </p>

          <form className="upload-box" onSubmit={handleSubmit}>
            <DropUpload
              accept="image/*"
              label="Drop your flag image here"
              helpText="Supports JPG, JPEG, PNG, and other common image formats."
              file={file}
              onFileSelect={handleFileSelect}
            />

            {preview && (
              <img className="image-preview" src={preview} alt="flag preview" />
            )}

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={!file || loading}>
                Predict Flag
              </button>
            </div>
          </form>

          {loading && <Loader />}
        </div>

        <ResultBox title="Prediction Output" result={result} />
      </div>
    </div>
  );
}