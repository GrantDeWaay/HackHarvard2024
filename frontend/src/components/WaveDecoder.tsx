import React from "react";
import { useState, useEffect, useRef } from "react";

function WaveDecoder({ base64Data }: { base64Data: string }) {
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const audioUrl = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    decodeAndPlayWav();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl.current!; // Set the source for the audio element
      audioRef.current.play(); // Play the audio automatically
    }
  }, [audioSrc]);

  const decodeAndPlayWav = () => {
    // Decode base64 WAV
    const binaryString = atob(base64Data); // atob decodes the base64 string to binary
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob from the byte array (MIME type for WAV is "audio/wav")
    const blob = new Blob([bytes], { type: "audio/wav" });

    // Create a URL for the Blob and set it as the audio src
    audioUrl.current = URL.createObjectURL(blob);
    setAudioSrc(audioUrl.current);
  };

  return (
    <div>{audioSrc && <audio ref={audioRef} controls src={audioSrc} />}</div>
  );
}

export default WaveDecoder;
