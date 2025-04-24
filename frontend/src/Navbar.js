import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 导入 Link
import './Navbar.css';
import { useAuth } from './context/AuthContext'; // 导入 useAuth

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth(); // 获取认证状态和方法

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/'); // 退出后跳转到首页
  };


  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* Logo 点击返回首页 */}
        <span className="navbar-logo" onClick={() => navigate('/')}>MyTube</span>
      </div>
      {/* 搜索框 */}
      <form className="navbar-center" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="搜索"
          className="search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <button type="submit" className="search-button">🔍</button>
      </form>
      {/* 右侧用户区域 */}
      <div className="navbar-right">
        {isAuthenticated ? (
          // 用户已登录
          <>
            <span style={{ marginRight: '15px' }}>你好, {user?.username || '用户'}</span>
            <button onClick={handleLogout} className="logout-button">退出</button> {/* 可以添加样式 */}
          </>
        ) : (
          // 用户未登录
          <>
            <Link to="/login" className="nav-link">登录</Link> {/* 可以添加样式 */}
            <Link to="/register" className="nav-link register-link">注册</Link> {/* 可以添加样式 */}
          </>
        )}
        {/* 原始的用户图标可以移除或保留 */}
        {/* <span className="user-icon">👤</span> */}
      </div>
    </nav>
  );
}

export default Navbar;