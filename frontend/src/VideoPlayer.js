import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 导入 Link
import Comments from './Comments';
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
    <div className="video-page-layout">
      <div className="main-column">
        <div className="video-player-container">
          {/* 替换为实际的 video 标签 */}
          <video
            controls // 显示播放控件
            src={videoDetails.videoUrl} // 使用后端提供的 URL (目前是占位符)
            poster={`/thumbnails/video${videoDetails.id}.jpg`} // 假设有缩略图，路径需要对应
            className="video-element" // 添加一个类名方便样式控制
            width="100%" // 宽度占满容器
          >
            您的浏览器不支持 HTML5 video 标签。
          </video>
          <h2 className="video-title">{videoDetails.title}</h2>
          <div className="video-info">
            <p><strong>上传者:</strong> {videoDetails.uploader}</p>
            <p>{videoDetails.views} • {videoDetails.uploaded}</p>
            <hr />
            <p><strong>描述:</strong></p>
            <p>{videoDetails.description}</p>
          </div>
        </div>
        <Comments videoId={videoId} />
      </div>

      <div className="related-column">
        <h3>相关视频</h3>
        {/* 移除占位符，渲染实际列表 */}
        <div className="related-videos-list">
          {relatedVideos.length > 0 ? (
            relatedVideos.map(video => (
              <Link to={`/watch/${video.id}`} key={video.id} className="related-video-item-link">
                <div className="related-video-item">
                  {/* 假设有缩略图 */}
                  <img
                    src={`/thumbnails/video${video.id}.jpg`} // 假设缩略图路径
                    alt={video.title}
                    className="related-video-thumbnail"
                  />
                  <div className="related-video-info">
                    <h4>{video.title}</h4>
                    <p>{video.uploader}</p>
                    <p>{video.views} • {video.uploaded}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>暂无相关视频。</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPlayer;