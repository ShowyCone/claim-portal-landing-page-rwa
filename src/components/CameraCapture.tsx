"use client";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  onCapture: (file: File) => void;
}

const CameraCapture: React.FC<Props> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState(false);

  // Start the camera
  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) videoRef.current.srcObject = newStream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Capture image from video
  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `photo-${Date.now()}.png`, {
          type: "image/png",
        });
        onCapture(file);
        setCaptured(true);
        stopCamera();
      }
    }, "image/png");
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  // Flip camera
  const swapCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  return (
    <div className="w-full flex flex-col items-center">
      {!captured && (
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full rounded-lg"
        />
      )}
      <canvas ref={canvasRef} className="hidden" />
      <div className="flex gap-2 mt-4">
        {!captured && (
          <>
            <button onClick={captureImage}>📸 Capture</button>
            <button onClick={swapCamera}>🔁 Flip</button>
          </>
        )}
        {captured && (
          <button
            onClick={() => {
              setCaptured(false);
              startCamera();
            }}
          >
            🔄 Retake
          </button>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
