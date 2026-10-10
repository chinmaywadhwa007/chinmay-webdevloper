import React, { useRef, useEffect, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import gsap from 'gsap';
import { FiPlay, FiPause, FiVolume2, FiVolumeX, FiMaximize } from 'react-icons/fi';
import styles from './VexoVideoExperience.module.css';

/**
 * VEXO Interactive Cinematic Video Experience
 * Powered by Video.js with surrounding GSAP-animated sonic visualizer and ambient storytelling.
 */
const VexoVideoExperience = ({ isVisible = true }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const visualizerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Creative video loop asset - Ambient audio-visual stream
  const videoSource = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
  const posterSource = '/vexo.png';

  useEffect(() => {
    // Initialize Video.js
    if (!playerRef.current && videoRef.current) {
      const videoElement = videoRef.current;
      const player = (playerRef.current = videojs(
        videoElement,
        {
          autoplay: false,
          controls: false, // We use custom editorial controls
          muted: true,
          loop: true,
          preload: 'auto',
          poster: posterSource,
          sources: [
            {
              src: videoSource,
              type: 'video/mp4',
            },
          ],
        },
        () => {
          // Player ready
        }
      ));

      player.on('play', () => setIsPlaying(true));
      player.on('pause', () => setIsPlaying(false));
      player.on('timeupdate', () => {
        const current = player.currentTime();
        const total = player.duration();
        if (total > 0) {
          setProgress((current / total) * 100);
        }
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [videoSource, posterSource]);

  // GSAP Sonic Equalizer animation when playing
  useEffect(() => {
    const bars = visualizerRef.current?.querySelectorAll(`.${styles.eqBar}`);
    if (!bars || bars.length === 0) return;

    if (isPlaying) {
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: 'random(0.3, 1.4)',
          duration: 0.22,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
          delay: i * 0.05,
        });
      });
    } else {
      bars.forEach((bar) => {
        gsap.killTweensOf(bar);
        gsap.to(bar, { scaleY: 0.25, duration: 0.3 });
      });
    }
  }, [isPlaying]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play().catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    const newMuted = !isMuted;
    playerRef.current.muted(newMuted);
    setIsMuted(newMuted);
  };

  return (
    <div
      className={styles.videoExperienceContainer}
      data-cursor={isPlaying ? 'video' : 'video'}
      data-cursor-text={isPlaying ? 'PAUSE' : 'PLAY'}
      onClick={togglePlay}
    >
      {/* Video.js Root */}
      <div data-vjs-player className={styles.playerWrapper}>
        <video
          ref={videoRef}
          className={`video-js vjs-fill ${styles.videoElement}`}
          playsInline
        />
      </div>

      {/* Surrounding Ambient Overlay */}
      <div className={styles.overlay}>
        {/* Top Sonic Equalizer */}
        <div className={styles.equalizer} ref={visualizerRef}>
          <span className={styles.nowPlayingText}>VEXO Sonic Stream</span>
          <div className={styles.barsGroup}>
            {[...Array(8)].map((_, i) => (
              <span key={i} className={styles.eqBar} />
            ))}
          </div>
        </div>

        {/* Center Play Indicator (Only when paused) */}
        {!isPlaying && (
          <div className={styles.playButtonIndicator}>
            <div className={styles.playPulse} />
            <FiPlay size={20} className={styles.playIcon} />
          </div>
        )}

        {/* Bottom Audio Scrub & Controls */}
        <div className={styles.controlsBar} onClick={(e) => e.stopPropagation()}>
          <button
            className={styles.iconBtn}
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
          >
            {isPlaying ? <FiPause size={15} /> : <FiPlay size={15} />}
          </button>

          {/* Progress Track */}
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: `${progress}%` }} />
          </div>

          <button
            className={styles.iconBtn}
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <FiVolumeX size={15} /> : <FiVolume2 size={15} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VexoVideoExperience;
