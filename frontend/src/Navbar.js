import React from 'react';
import './Navbar.css'; // 我们将创建这个 CSS 文件来添加样式

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* 可以添加汉堡菜单图标 */}
        <span className="navbar-logo">MyTube</span> {/* 临时的 Logo */}
      </div>
      <div className="navbar-center">
        <input type="text" placeholder="搜索" className="search-input" />
        <button className="search-button">🔍</button> {/* 简单的搜索图标 */}
      </div>
      <div className="navbar-right">
        {/* 可以添加创建、通知、用户头像等图标 */}
        <span className="user-icon">👤</span> {/* 临时的用户图标 */}
      </div>
    </nav>
  );
}

export default Navbar;