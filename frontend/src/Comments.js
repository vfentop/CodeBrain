import React, { useState, useEffect } from 'react'; // 导入 useEffect
import './Comments.css';

function Comments({ videoId }) {
  const [comments, setComments] = useState([]); // 初始化为空数组
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false); // 加载状态
  const [errorComments, setErrorComments] = useState(null); // 错误状态
  const [postingComment, setPostingComment] = useState(false); // 提交状态

  // 获取评论的函数
  const fetchComments = async () => {
    setLoadingComments(true);
    setErrorComments(null);
    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}/comments`);
      if (!response.ok) {
        throw new Error(`获取评论失败: ${response.status}`);
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("获取评论出错:", err);
      setErrorComments(err.message);
      setComments([]); // 出错时清空评论
    } finally {
      setLoadingComments(false);
    }
  };

  // 组件加载或 videoId 变化时获取评论
  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]); // 依赖 videoId

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || postingComment) {
      return; // 防止空评论或重复提交
    }

    setPostingComment(true);
    setErrorComments(null); // 清除之前的提交错误

    try {
      const response = await fetch(`http://localhost:3001/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newComment,
          user: '当前用户', // TODO: 替换为实际登录用户名
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `提交评论失败: ${response.status}`);
      }

      const addedComment = await response.json();
      // 乐观更新：立即添加到列表，或者重新获取列表
      // setComments([...comments, addedComment]); // 乐观更新方式
      setNewComment(''); // 清空输入框
      await fetchComments(); // 重新获取评论列表以保证同步

    } catch (err) {
      console.error("提交评论出错:", err);
      setErrorComments(`提交失败: ${err.message}`);
    } finally {
      setPostingComment(false);
    }
  };

  return (
    <div className="comments-section">
      <h3>评论 ({comments.length})</h3> {/* 显示评论数量 */}
      {/* 评论输入表单 */}
      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          placeholder="添加评论..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows="3"
          disabled={postingComment} // 提交时禁用
        />
        <button type="submit" disabled={postingComment || !newComment.trim()}>
          {postingComment ? '提交中...' : '评论'}
        </button>
        {errorComments && <p className="comment-error">{errorComments}</p>} {/* 显示错误信息 */}
      </form>

      {/* 评论列表 */}
      <div className="comment-list">
        {loadingComments ? (
          <p>正在加载评论...</p>
        ) : comments.length === 0 && !errorComments ? ( // 确保不是因为错误而为空
          <p>暂无评论，快来抢沙发吧！</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <strong>{comment.user}:</strong>
              <p>{comment.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Comments;