import React, { useState, useRef } from "react";

const AudioRecorder: React.FC = () => {
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    // Request access to the user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // Create a new MediaRecorder instance
    mediaRecorderRef.current = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });
    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    // Start recording
    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();

      // Once recording is stopped, create a blob from the audio chunks
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);

        // You can use the audioBlob to send to an API, for example:
        sendToAPI(audioBlob);

        // Clear the recorded chunks
        audioChunksRef.current = [];
      };
    }
    setRecording(false);
  };

  const sendToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm"); // The key 'file' must match Flask's expectation

    try {
      const response = await fetch("http://127.0.0.1:5000/transcribe", {
        // Assuming Flask is running locally
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>

      {audioURL && (
        <div>
          <audio src={audioURL} controls />
          <p>Your recorded audio</p>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
