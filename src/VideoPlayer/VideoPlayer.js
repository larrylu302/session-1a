import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import './VideoPlayer.css';
import w1_v1 from './videos/w1_v1.mp4';
import w1_v2 from './videos/w1_v2.mp4';
import w2_v1 from './videos/w2_v1.mp4';
import w2_v2 from './videos/w2_v2.mp4';
import w3_v1 from './videos/w3_v1.mp4';
import w3_v2 from './videos/w3_v2.mp4';
import w4_v1 from './videos/w4_v1.mp4';
import w4_v2 from './videos/w4_v2.mp4';
import w5_v1 from './videos/w5_v1.mp4';
import w5_v2 from './videos/w5_v2.mp4';
import w6_v1 from './videos/w6_v1.mp4';
import w6_v2 from './videos/w6_v2.mp4';
import w7v1 from './videos/w7v1.mp4';
import w7v2 from './videos/w7v2.mp4';
import w8v1 from './videos/w8v1.mp4';
import w8v2 from './videos/w8v2.mp4';
import w9v1 from './videos/w9v1.mp4';
import w9v2 from './videos/w9v2.mp4';
import w10v1 from './videos/w10v1.mp4';
import w10v2 from './videos/w10v2.mp4';
import w11v1 from './videos/w11v1.mp4';
import w11v2 from './videos/w11v2.mp4';
import w12v1 from './videos/w12v1.mp4';
import w12v2 from './videos/w12v2.mp4';



const videoSources = {
  1: {
    intervention: w1_v1,
    challenge: w1_v2
  },
  2: {
    intervention: w2_v1,
    challenge: w2_v2
  },
  3: {
    intervention: w3_v1,
    challenge: w3_v2
  },
  4: {
    intervention: w4_v1,
    challenge: w4_v2
  },
  5: {
    intervention: w5_v1,
    challenge: w5_v2
  },
  6: {
    intervention: w6_v1,
    challenge:w6_v2
  },
  7: {
    intervention: w7v1,
    challenge: w7v2
  },
  8: {
    intervention: w8v1,
    challenge: w8v2
  },
  9: {
    intervention: w9v1,
    challenge: w9v2
  },
  10: {
    intervention: w10v1,
    challenge: w10v2
  },
  11: {
    intervention: w11v1,
    challenge: w11v2
  },
  12: {
    intervention: w12v1,
    challenge: w12v2
  }
};

const VideoPlayer = () => {
  const {name, day, video} = useParams();
  const [videoEnded, setVideoEnded] = useState(false);
  const [endgame] = useState(video === "intervention");

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('ended', handleVideoEnd);
    }
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('ended', handleVideoEnd);
      }
    };
  }, []);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleSkipVideo = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    setVideoEnded(true);
  };

  const videoSrc = videoSources[day][video]; // Default video if videoId is not found

  return (
    <div className="video-container">
      <video ref={videoRef} controls autoPlay playsInline onEnded={handleVideoEnd}>
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {endgame && (<Link to={`/${name}/${day}/home`} className="skip-button" onClick={videoEnded ? undefined : handleSkipVideo}>
        {videoEnded ? 'Next' : 'Skip Video'}
      </Link>)}
    </div>
  );
};

export default VideoPlayer;
