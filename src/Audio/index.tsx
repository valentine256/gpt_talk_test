import React, { useState } from "react";
import AudioPlayer from "react-audio-player";
import _ from "lodash";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { audioUrlAtom, recordAtom } from "../Mic/state/mic.atom";

const MyAudioPlayer: React.FC = () => {
  const [playing, setPlaying] = useState(false);
  const audioUrl = useRecoilValue(audioUrlAtom);
  const setRecord = useSetRecoilState(recordAtom);

  const handlePlay = () => {
    setPlaying(true);
  };

  const handlePause = () => {
    setPlaying(false);
    setRecord(true);
  };

  if (_.isNull(audioUrl)) {
    return <div>no audio</div>;
  }

  return (
    <div>
      <AudioPlayer
        src={audioUrl}
        autoPlay={true}
        controls
        listenInterval={1000}
        onPlay={handlePlay}
        onPause={handlePause}
      />
    </div>
  );
};

export default MyAudioPlayer;
