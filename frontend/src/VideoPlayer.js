import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Comments from './Comments'; // 引入评论组件
import './VideoPlayer.css'; // 引入样式

function VideoPlayer() {
  const { videoId } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]); // 新增 state 存储相关视频
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      setLoading(true);
      setError(null);
      setVideoDetails(null); // 重置视频详情
      setRelatedVideos([]); // 重置相关视频

      try {
        // 并行获取视频详情和所有视频列表
        const [detailsResponse, listResponse] = await Promise.all([
          fetch(`http://localhost:3001/api/videos/${videoId}`),
          fetch('http://localhost:3001/api/videos') // 获取所有视频
        ]);

        // 处理视频详情
        if (!detailsResponse.ok) {
          const errorData = await detailsResponse.json().catch(() => ({})); // 尝试解析 JSON，失败则返回空对象
          throw new Error(errorData.message || `获取视频详情失败: ${detailsResponse.status}`);
        }
        const detailsData = await detailsResponse.json();
        setVideoDetails(detailsData);

        // 处理视频列表 (用于相关视频)
        if (!listResponse.ok) {
          console.error(`获取视频列表失败: ${listResponse.status}`);
          // 即使列表获取失败，也可能继续显示视频详情
        } else {
          const listData = await listResponse.json();
          // 过滤掉当前正在播放的视频
          setRelatedVideos(listData.filter(video => video.id !== parseInt(videoId, 10)));
        }

      } catch (err) {
        console.error("加载视频数据出错:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVideoData();
  }, [videoId]); // 依赖 videoId

  if (loading) {
    return <div className="loading-message">正在加载视频信息...</div>;
  }

  if (error) {
    // 如果 videoDetails 也为 null，则显示完整错误；否则可能只显示部分错误信息
    return <div className="error-message">加载失败: {error}</div>;
  }

  if (!videoDetails) {
    // 如果没有错误但 videoDetails 仍然是 null (理论上不应发生，除非 API 返回成功但数据为空)
    return <div className="info-message">未找到视频信息。</div>;
  }

  return (
    <div className="video-player-page">
      <div className="main-content-area"> {/* 主要内容区，包含播放器和信息 */}
        {/* 条件渲染检查 videoDetails 而不是 video */}
        {videoDetails && (
          <>
            <div className="video-container">
              {/* 使用 videoDetails.videoUrl */}
              <video controls src={videoDetails.videoUrl} className="video-element">
                您的浏览器不支持 HTML5 video 标签。
              </video>
            </div>

            {/* 视频信息区域 */}
            <div className="video-info-section">
              {/* 使用 videoDetails.title 等 */}
              <h1 className="video-title">{videoDetails.title}</h1>
              <div className="video-metadata">
                <span>{videoDetails.views}</span>
                <span>•</span>
                <span>{videoDetails.uploaded}</span>
              </div>
              <hr className="info-separator" /> {/* 添加分隔线 */}
              <div className="uploader-info">
                {/* 这里可以放上传者头像等 */}
                <span className="uploader-name">{videoDetails.uploader}</span>
                {/* 可以添加订阅按钮等 */}
              </div>
              <div className="video-description">
                <p>{videoDetails.description}</p>
              </div>
              <hr className="info-separator" /> {/* 添加分隔线 */}
            </div>

            {/* 评论区 */}
            <Comments videoId={videoId} />
          </>
        )}
      </div>

      {/* 相关视频区域 */}
      <div className="related-videos-area">
        <h2>相关视频</h2>
        {/* 这里使用 relatedVideos state */}
        {relatedVideos && relatedVideos.length > 0 ? (
          relatedVideos.map(relatedVideo => (
            <Link to={`/watch/${relatedVideo.id}`} key={relatedVideo.id} className="related-video-link">
              <div className="related-video-item">
                {/* 假设也有缩略图 */}
                <img src={`/thumbnails/video${relatedVideo.id}.jpg`} alt={relatedVideo.title} className="related-video-thumbnail" />
                <div className="related-video-info">
                  <h4 className="related-video-title">{relatedVideo.title}</h4>
                  <p className="related-video-uploader">{relatedVideo.uploader}</p>
                  <p className="related-video-stats">{relatedVideo.views}</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>没有相关视频。</p>
        )}
      </div>
    </div>
  );
}

export default VideoPlayer;