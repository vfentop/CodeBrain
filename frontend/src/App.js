import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import VideoPlayer from './VideoPlayer';
import Sidebar from './Sidebar'; // 导入 Sidebar 组件

function App() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/videos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("获取视频数据失败:", error);
      }
    };
    fetchVideos();
  }, []);

  // 将视频列表渲染逻辑提取为一个组件或函数，以便在 Route 中使用
  const VideoList = () => (
    <>
      <h1>推荐视频</h1>
      <div className="video-list">
        {videos.length === 0 && <p>正在加载视频...</p>}
        {videos.map(video => (
          // 使用 Link 组件包裹每个视频项，使其成为导航链接
          <Link to={`/watch/${video.id}`} key={video.id} className="video-item-link">
            <div className="video-item">
              {/* 这里可以放视频缩略图 */}
              <h3>{video.title}</h3>
              <p>{video.uploader}</p>
              <p>{video.views} • {video.uploaded}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="app-body"> {/* 新增一个容器 */}
          <Sidebar /> {/* 添加 Sidebar */}
          <div className="main-content"> {/* 主要内容区域 */}
            <Routes>
              <Route path="/" element={<VideoList />} />
              <Route path="/watch/:videoId" element={<VideoPlayer />} />
              {/* 其他路由 */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;