import React, { useState, useEffect } from 'react';
import './Comments.css'; // 引入样式
import { useAuth } from './context/AuthContext'; // 导入 useAuth

function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth(); // 获取 token 和用户信息

  // 获取评论
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/videos/${videoId}/comments`);
        if (!response.ok) {
          throw new Error(`获取评论失败: ${response.status}`);
        }
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error("获取评论出错:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);


  // 处理评论提交
  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!newComment.trim()) {
      setError('评论内容不能为空');
      return;
    }
    if (!user) { // 检查用户是否登录
        setError('请先登录再发表评论');
        return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // === 添加 Authorization 头 ===
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (!response.ok) {
        // === 更详细的错误处理 ===
        let errorText = `发表评论失败: ${response.status}`;
        try {
            const errorData = await response.json();
            errorText = errorData.message || errorText; // 尝试获取后端返回的错误信息
        } catch (e) {
            // 如果响应体不是 JSON 或为空
            errorText = await response.text() || errorText;
        }
        throw new Error(errorText);
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]); // 将新评论添加到列表
      setNewComment(''); // 清空输入框
    } catch (err) {
      console.error("发表评论出错:", err);
      setError(err.message); // 显示错误信息
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>评论</h3>
      {/* 评论列表 */}
      {/* ... */}

      {/* 评论表单 */}
      {user ? ( // 仅在登录后显示评论框
        <form onSubmit={handleSubmitComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="添加评论..."
            rows="3"
            disabled={loading}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '正在提交...' : '评论'}
          </button>
        </form>
      ) : (
        <p>请 <a href="/login">登录</a> 后发表评论。</p> // 提示登录
      )}
    </div>
  );
}

export default Comments;