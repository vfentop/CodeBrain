import React from 'react';
import './VideoCard.css'; // 引入 VideoCard 样式

function VideoCard({ video }) {
  // 假设缩略图在 public/thumbnails/ 目录下，并以 videoX.jpg 命名
  const thumbnailUrl = `/thumbnails/video${video.id}.jpg`;

  return (
    <div className="video-card">
      <img src={thumbnailUrl} alt={video.title} className="video-thumbnail" />
      <div className="video-details">
        <h4 className="video-card-title">{video.title}</h4>
        <p className="video-uploader">{video.uploader}</p>
        <p className="video-stats">{video.views} • {video.uploaded}</p>
      </div>
    </div>
  );
}

export default VideoCard;