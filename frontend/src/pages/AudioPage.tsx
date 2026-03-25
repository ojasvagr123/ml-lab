import { useState } from "react";
import ResultBox from "../components/ResultBox";
import Loader from "../components/Loader";
import DropUpload from "../components/DropUpload";
import api from "../services/api";

export default function AudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
    setResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await api.post("/predict/audio", formData, {
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
        <h1 className="page-title">Audio Chord Prediction</h1>
        <p className="page-subtitle">
          Upload or drag an audio sample and classify it as a major or minor chord.
        </p>
      </section>

      <div className="section-shell">
        <div className="glass-panel">
          <h2 className="panel-title">Upload Audio File</h2>
          <p className="panel-subtitle">
            Drag and drop your audio file or browse from your device.
          </p>

          <form className="upload-box" onSubmit={handleSubmit}>
            <DropUpload
              accept=".wav,.mp3,.ogg,.m4a,.flac"
              label="Drop your audio file here"
              helpText="Supports WAV, MP3, OGG, M4A, and FLAC."
              file={file}
              onFileSelect={handleFileSelect}
            />

            <div className="form-actions">
              <button className="primary-btn" type="submit" disabled={!file || loading}>
                Predict Chord
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