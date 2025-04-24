import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom'; // 导入 useSearchParams 获取查询参数
import VideoCard from '../components/VideoCard'; // 复用 VideoCard 组件
import './SearchResultsPage.css'; // 引入样式

function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // 获取 URL 中的 'q' 参数值
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 当 query 变化时，重新获取搜索结果
    if (!query) {
      setVideos([]); // 如果没有搜索词，清空结果
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // **注意：后端需要实现 /api/search 端点**
        const response = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error(`搜索失败: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (err) {
        console.error("加载搜索结果出错:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]); // 依赖数组包含 query，当 query 变化时重新执行 effect

  if (loading) {
    return <div className="loading-message">正在搜索 "{query}"...</div>;
  }

  if (error) {
    return <div className="error-message">搜索 "{query}" 出错: {error}</div>;
  }

  return (
    <div className="search-results-page">
      <h2>搜索结果: "{query}"</h2>
      <div className="search-results-grid">
        {videos.length > 0 ? (
          videos.map(video => (
            <Link to={`/watch/${video.id}`} key={video.id} className="video-card-link">
              <VideoCard video={video} />
            </Link>
          ))
        ) : (
          <p>没有找到与 "{query}" 相关的视频。</p>
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;