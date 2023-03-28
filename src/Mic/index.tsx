import React, { useState, useEffect, useRef } from "react";
import { ReactMic, ReactMicStopEvent } from "react-mic";
import { useRecoilState } from "recoil";
import { audioUrlAtom, recordAtom } from "./state/mic.atom";

const Example = () => {
  const [record, setRecord] = useRecoilState(recordAtom);
  const [audioUrl, setAudioUrl] = useRecoilState(audioUrlAtom);
  const [volume, setVolume] = useState(0);
  const [idle, setIdle] = useState(false);

  const mediaStream = useRef<MediaStream | null>(null);

  useEffect(() => {
    setIdle(volume < -45);
  }, [volume]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (idle) {
      timeout = setTimeout(() => {
        stopRecording();
        setIdle(false);
      }, 2000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [idle]);

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onData = (recordedBlob: Blob) => {
    console.log("chunk of real-time data is: ", recordedBlob);
  };

  const onStop = (recordedBlob: ReactMicStopEvent) => {
    console.log("recordedBlob is: ", recordedBlob);
    setAudioUrl(URL.createObjectURL(recordedBlob.blob));
  };

  useEffect(() => {
    let animationFrameId: number;
    let mediaStreamSource: MediaStreamAudioSourceNode | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;

    const processStream = (stream: MediaStream) => {
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const processor = context.createScriptProcessor(1024, 1, 1);

      processor.onaudioprocess = (event) => {
        const buffer = event.inputBuffer.getChannelData(0);
        const rms = Math.sqrt(
          buffer.reduce((acc, val) => acc + val * val, 0) / buffer.length
        );
        const db = 20 * Math.log10(rms + Number.EPSILON);
        setVolume(db);
      };

      source.connect(processor);
      processor.connect(context.destination);

      mediaStreamSource = source;
      scriptProcessor = processor;
    };

    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaStream.current = stream;
        processStream(stream);
      } catch (error) {
        console.error(error);
      }
    };

    if (!record && mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
      mediaStream.current = null;
    }

    if (record && !mediaStream.current) {
      startStream();
    }

    if (record && mediaStream.current) {
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }

      if (mediaStreamSource) {
        mediaStreamSource.disconnect();
        mediaStreamSource = null;
      }

      if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
      }
    };
  }, [record]);

  return (
    <div>
      <ReactMic
        record={record}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        // autoGainControl={false}
      />
      <button onClick={startRecording} type="button">
        녹음시작
      </button>
      <button onClick={stopRecording} type="button">
        녹음종료
      </button>
      <div>Volume: {volume.toFixed(2)} dB</div>
    </div>
  );
};

export default Example;
