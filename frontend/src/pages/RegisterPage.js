import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import './RegisterPage.css'; // 可以创建或复用 Login 页面的 CSS

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    setLoading(true);

    try {
      const result = await registerUser(username, password);
      setSuccess(result.message + ' 即将跳转到登录页面...');
      // 注册成功后等待几秒跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 2000); // 延迟 2 秒
    } catch (err) {
      setError(err.message || '注册失败，请稍后再试。');
      console.error("注册出错:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page"> {/* 使用 register-page 或 login-page 类 */}
      <div className="register-container"> {/* 使用 register-container 或 login-container 类 */}
        <h2>注册 MyTube 账户</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading || success} // 成功后也禁用
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || success}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading || success}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <button type="submit" className="register-button" disabled={loading || success}>
            {loading ? '正在注册...' : '注册'}
          </button>
        </form>
        <p className="login-link">
          已有账户？ <Link to="/login">立即登录</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;