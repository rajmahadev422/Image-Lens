import React, { useState, ChangeEvent, useCallback, useRef } from "react";
import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const genAI = new GoogleGenAI({ apiKey: API_KEY });

const App: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      const fullString = reader.result as string;
      setPreview(fullString);
      setBase64(fullString.split(",")[1]);
      setResult("");
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) processFile(file);
  }, []);

  const describeImage = async () => {
    if (!base64) return;
    setIsLoading(true);
    setResult("");
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                text: "What is in this image? Provide a brief description.",
              },
              { inlineData: { mimeType, data: base64 } },
            ],
          },
        ],
        config: {
          systemInstruction: "You are an AI assistant that describes the content of images in a concise manner.Give your answer in less than 50 words with a one line labeling the main subject of the image. Focus on the most prominent elements and avoid overanalyzing minor details.",
        }
      });
      setResult(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      setResult(
        "Error: Could not describe the image. Check your API key and console.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setBase64(null);
    setResult("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[10%] w-150 h-150 rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[5%] w-125 h-125 rounded-full bg-cyan-500/8 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-14 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/50 tracking-widest uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Powered by Gemini
          </div>
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-br from-white via-white/90 to-white/40 bg-clip-text text-transparent mb-3">
            Vision AI
          </h1>
          <p className="text-white/40 text-base">
            Drop an image. Let Gemini tell you what it sees.
          </p>
        </header>

        {/* Upload / Preview area */}
        {!preview ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300
              flex flex-col items-center justify-center gap-5 p-16
              ${
                isDragging
                  ? "border-violet-400 bg-violet-500/10 scale-[1.01]"
                  : "border-white/10 bg-white/3 hover:border-white/20 hover:bg-white/5"
              }
            `}
          >
            {/* Upload icon */}
            <div
              className={`
              w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300
              ${isDragging ? "bg-violet-500/20 scale-110" : "bg-white/5 group-hover:bg-white/10"}
            `}
            >
              <svg
                className="w-7 h-7 text-white/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-white/70 text-sm font-medium mb-1">
                {isDragging ? "Release to upload" : "Drag & drop your image"}
              </p>
              <p className="text-white/30 text-xs">
                or click to browse — PNG, JPG, WEBP, GIF
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/3">
            {/* Image preview */}
            <div className="relative group">
              <img
                src={preview}
                alt="Upload Preview"
                className="w-full max-h-105 object-cover"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-4 py-2 text-sm text-white/80 transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Remove image
                </button>
              </div>
            </div>

            {/* Action bar */}
            <div className="p-4 flex items-center justify-between gap-3 border-t border-white/5">
              <p className="text-white/30 text-xs truncate">
                Image ready for analysis
              </p>
              <button
                onClick={describeImage}
                disabled={isLoading}
                className={`
                  flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0
                  ${
                    isLoading
                      ? "bg-white/5 text-white/30 cursor-not-allowed"
                      : "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/40 hover:shadow-violet-800/50"
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Analyzing…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Describe Image
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-white/40 tracking-widest uppercase font-medium">
                Analysis Result
              </span>
            </div>
            <div className="px-5 py-5">
              <p className="text-white/75 text-sm leading-relaxed">{result}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && !result && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/3 overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/5">
              <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="text-xs text-white/40 tracking-widest uppercase font-medium">
                Generating…
              </span>
            </div>
            <div className="px-5 py-5 space-y-2.5">
              {[100, 85, 92, 60].map((w, i) => (
                <div
                  key={i}
                  className="h-3 rounded-full bg-white/5 animate-pulse"
                  style={{ width: `${w}%`, animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
