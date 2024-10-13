import React, { useState, useRef, useEffect, useCallback } from "react";
import WaveDecoder from "./WaveDecoder";

const THRESHOLD = 0.07;
const WAIT_TIME_MS = 2000;

interface AudioRecorderProps {
  onMenuItemsChange: (menuItems: string[]) => void; // Prop to propagate menu_items
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onMenuItemsChange }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const silenceTimeout = useRef<number | null>(null);
  const silenceDetected = useRef(false); // Track silence detection
  const [speechResponse, setSpeechResponse] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [menuItems, setMenuItems] = useState<string[]>([]); // State for menu items

  const monitorAudioLevel = useCallback(
    (analyser: AnalyserNode) => {
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const value = (dataArray[i] - 128) / 128;
          sumSquares += value * value;
        }
        const rms = Math.sqrt(sumSquares / bufferLength);

        if (rms > THRESHOLD && !recording) {
          startRecording();
        }

        if (rms <= THRESHOLD) {
          if (!silenceDetected.current) {
            silenceDetected.current = true;
            silenceTimeout.current = window.setTimeout(() => {
              stopRecording();
              silenceDetected.current = false;
            }, WAIT_TIME_MS);
          }
        } else {
          if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
            silenceTimeout.current = null;
          }
          silenceDetected.current = false;
        }

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();
    },
    [recording]
  );

  useEffect(() => {
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        const audioCtx = new AudioContext();
        const analyserNode = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyserNode);
        analyserNode.fftSize = 2048;
        setAudioContext(audioCtx);

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm",
        });
        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
          audioChunksRef.current.push(event.data);
        };

        monitorAudioLevel(analyserNode);
      } catch (error) {
        console.error("Error accessing microphone", error);
      }
    };

    initAudio();

    return () => {
      if (audioContext) audioContext.close();
      if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    };
  }, []);

  const startRecording = () => {
    if (
      !recording &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "recording"
    ) {
      mediaRecorderRef.current.start();
      setRecording(true);
      console.log("Recording started due to sound level.");
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef &&
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        audioChunksRef.current = [];
        console.log("Recording stopped due to silence.");
        sendToAPI(audioBlob);
      };
      setRecording(false);
    }
  };

  const sendToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm");
    setIsFetching(true);
    try {
      const response = await fetch("/transcribe", {
        // Assuming Flask is running locally
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
        setIsFetching(false);
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
      changeTranscription(result);
      setSpeechResponse(result.audio_base64);

      // Assuming menu_items is in the response
      if (result.menu_items && Array.isArray(result.menu_items)) {
        setMenuItems(result.menu_items); // Set menu items in state
        onMenuItemsChange(result.menu_items); // Propagate to parent component
      }
      setIsFetching(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsFetching(false);
    }
  };

  const changeTranscription = (response: any) => {
    const text = response.fast_food_worker_response;
    if (text === "none") {
      setTranscription("");
    } else {
      setTranscription(text);
    }
  };

  return (
    <div>
      <h1 id="recording-indicator">
        {isFetching
          ? "Processing..."
          : !recording
          ? "🔴 Waiting on Customer... 🔴"
          : "🟢 Taking order... 🟢"}
      </h1>

      {audioURL && (
        <div className="audio-container">
          <audio src={audioURL} />
        </div>
      )}
      {transcription && <p id="transcription">{transcription}</p>}
      {speechResponse && (
        <div className="audio-container">
          <WaveDecoder base64Data={speechResponse} />
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
