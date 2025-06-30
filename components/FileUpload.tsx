import { useState, useRef } from "react";
import { Upload, X, File } from "lucide-react";
import { Button } from "./ui/button";
import { cn, validateFile } from "./lib/utils";

interface FileUploadProps {
  onFilesChange: (files: File[]) => void;
  allowedTypes: string[];
  maxSize: number;
  maxFiles?: number;
  className?: string;
  description?: string;
}

export default function FileUpload({
  onFilesChange,
  allowedTypes,
  maxSize,
  maxFiles = 10,
  className,
  description
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const newErrors: string[] = [];

    fileArray.forEach(file => {
      const error = validateFile(file, allowedTypes, maxSize);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
      } else if (files.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      } else {
        newErrors.push(`Maximum ${maxFiles} files allowed`);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      onFilesChange(updatedFiles);
    }

    setErrors(newErrors);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors file-upload-area",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">
          Drag and drop your files here, or{" "}
          <Button
            type="button"
            variant="link"
            className="p-0 h-auto text-primary font-medium"
            onClick={() => fileInputRef.current?.click()}
          >
            browse
          </Button>
        </p>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept={allowedTypes.join(",")}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Display uploaded files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Uploaded Files:</h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{file.name}</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Display errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
