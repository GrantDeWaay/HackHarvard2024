/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect, useCallback } from "react";
import WaveDecoder from "./WaveDecoder";

const THRESHOLD = 0.07;
const WAIT_TIME_MS = 2000;

const AudioRecorder: React.FC = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState<boolean>(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const silenceTimeout = useRef<number | null>(null);
  const silenceDetected = useRef(false); // Track silence detection
  const [speechResponse, setSpeechResponse] = useState<string | null>(null);

  const monitorAudioLevel = useCallback(
    (analyser: AnalyserNode) => {
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        analyser.getByteTimeDomainData(dataArray);

        // Calculate the RMS of the signal
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const value = (dataArray[i] - 128) / 128; // Normalize between -1 and 1
          sumSquares += value * value;
        }
        const rms = Math.sqrt(sumSquares / bufferLength); // RMS value

        // Start recording if RMS exceeds the threshold
        if (rms > THRESHOLD && !recording) {
          startRecording();
        }

        // Stop recording if RMS falls below the threshold for a period of time
        if (rms <= THRESHOLD) {
          if (!silenceDetected.current) {
            silenceDetected.current = true;
            silenceTimeout.current = window.setTimeout(() => {
              stopRecording();
              silenceDetected.current = false; // Reset after stopping
            }, WAIT_TIME_MS); // Stop recording after 2 seconds of silence
          }
        } else {
          // If the sound level is above the threshold, clear the silence timeout
          if (silenceTimeout.current) {
            clearTimeout(silenceTimeout.current);
            silenceTimeout.current = null;
          }
          silenceDetected.current = false; // No silence detected
        }

        requestAnimationFrame(checkAudioLevel); // Continuously monitor the audio levels
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

        // Create an audio context and analyser to analyze the audio stream
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

        // Start monitoring the audio input levels
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
        audioChunksRef.current = []; // Clear the recorded chunks
        console.log("Recording stopped due to silence.");
        sendToAPI(audioBlob); // Replace with your API call
      };
      setRecording(false);
    }
  };

  const sendToAPI = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "recording.webm"); // The key 'file' must match Flask's expectation

    try {
      const response = await fetch(
        "https://bbavoso-flask--5000.prod1a.defang.dev/transcribe",
        {
          // Assuming Flask is running locally
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);
      changeTranscription(result);
      setSpeechResponse(result.audio_base64);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const changeTranscription = (response: any) => {
    const text = response.transcription;
    setTranscription(text);
  };

  return (
    <div>
      {/* <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button> */}
      <h1 id="recording-indicator">
        {!recording ? "🔴 NOT RECORDING 🔴" : "🟢 RECORDING 🟢"}
      </h1>

      {audioURL && (
        <div className="audio-container">
          <audio src={audioURL} controls />
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
