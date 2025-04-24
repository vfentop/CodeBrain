import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 用于链接到视频播放页
import VideoCard from '../components/VideoCard'; // 引入视频卡片组件
import './HomePage.css'; // 引入 HomePage 样式

function HomePage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:3001/api/videos');
        if (!response.ok) {
          throw new Error(`获取视频列表失败: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error("加载视频数据出错:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []); // 空依赖数组表示只在组件挂载时运行一次

  if (loading) {
    return <div className="loading-message">正在加载视频...</div>;
  }

  if (error) {
    return <div className="error-message">加载失败: {error}</div>;
  }

  return (
    <div className="home-page">
      <div className="video-grid">
        {videos.length > 0 ? (
          videos.map(video => (
            <Link to={`/watch/${video.id}`} key={video.id} className="video-card-link">
              <VideoCard video={video} />
            </Link>
          ))
        ) : (
          <p>暂无视频。</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;