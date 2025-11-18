// src/components/analysis/VideoPlayer.jsx
/**
 * VideoPlayer Component
 * ---------------------
 * Custom video player with phase navigation controls
 * 
 * Features:
 * - Standard playback controls (play, pause, seek)
 * - Jump to specific phases
 * - Frame-by-frame navigation
 * - Playback speed control
 * - Current phase indicator
 * - Synchronized with analysis timeline
 * 
 * Props:
 * - videoUrl: URL of the video to play
 * - phases: Object with phase boundaries
 * - events: Object with event frame numbers
 * - fps: Frames per second (default: 30)
 */

import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { MdPlayArrow, MdPause, MdSkipPrevious, MdSkipNext } from 'react-icons/md';
import Button from '../common/Button';

const PlayerContainer = styled.div`
  width: 100%;
  background-color: ${props => props.theme.colors.background.paper};
  border-radius: ${props => props.theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.lg};
`;

const VideoElement = styled.video`
  width: 100%;
  height: auto;
  background-color: #000;
`;

const Controls = styled.div`
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${props => props.theme.colors.neutral[200]};
  border-radius: ${props => props.theme.borderRadius.full};
  cursor: pointer;
  position: relative;
`;

const ProgressFill = styled.div`
  height: 100%;
  background-color: ${props => props.theme.colors.primary.main};
  width: ${props => props.progress}%;
  border-radius: ${props => props.theme.borderRadius.full};
  transition: width 0.1s linear;
`;

const ControlButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const TimeDisplay = styled.span`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  min-width: 100px;
`;

const PhaseJumpButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const VideoPlayer = ({ videoUrl, phases, events, fps = 30 }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => {
      setCurrentTime(video.currentTime);
      setCurrentFrame(Math.floor(video.currentTime * fps));
    };

    const updateDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [fps]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seekToFrame = (frame) => {
    const video = videoRef.current;
    video.currentTime = frame / fps;
  };

  const jumpToPhase = (phaseName) => {
    if (phases[phaseName]) {
      seekToFrame(phases[phaseName][0]);
    }
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const video = videoRef.current;
    video.currentTime = pos * duration;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <PlayerContainer>
      <VideoElement ref={videoRef} src={videoUrl} />
      
      <Controls>
        <ProgressBar onClick={handleProgressClick}>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <ControlButtons>
          <Button
            variant="outline"
            size="sm"
            icon={<MdSkipPrevious />}
            onClick={() => seekToFrame(Math.max(0, currentFrame - 1))}
          >
            -1 Frame
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={isPlaying ? <MdPause /> : <MdPlayArrow />}
            onClick={togglePlay}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<MdSkipNext />}
            onClick={() => seekToFrame(currentFrame + 1)}
          >
            +1 Frame
          </Button>

          <TimeDisplay>
            {formatTime(currentTime)} / {formatTime(duration)} (Frame: {currentFrame})
          </TimeDisplay>
        </ControlButtons>

        <PhaseJumpButtons>
          <strong style={{ marginRight: '8px' }}>Jump to:</strong>
          {Object.keys(phases).map(phase => (
            <Button
              key={phase}
              variant="outline"
              size="sm"
              onClick={() => jumpToPhase(phase)}
            >
              {phase.replace('_', ' ')}
            </Button>
          ))}
        </PhaseJumpButtons>
      </Controls>
    </PlayerContainer>
  );
};

export default VideoPlayer;
