import { useRef, useState } from "react";

type Props = {
  accept: string;
  label: string;
  helpText: string;
  file: File | null;
  onFileSelect: (file: File | null) => void;
};

export default function DropUpload({
  accept,
  label,
  helpText,
  file,
  onFileSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFileSelect(files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openPicker = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="upload-wrapper">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden-file-input"
      />

      <div
        className={`drop-zone ${dragActive ? "drop-zone-active" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        role="button"
        tabIndex={0}
      >
        <div className="drop-zone-icon">⬆</div>
        <div className="drop-zone-title">{label}</div>
        <div className="drop-zone-text">{helpText}</div>
        <div className="drop-zone-browse">Click to browse or drag file here</div>
      </div>

      {file && (
        <div className="selected-file-card">
          <div>
            <div className="selected-file-label">Selected File</div>
            <div className="selected-file-name">{file.name}</div>
            <div className="selected-file-size">
              {(file.size / 1024).toFixed(1)} KB
            </div>
          </div>

          <button
            type="button"
            className="secondary-btn"
            onClick={removeFile}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}