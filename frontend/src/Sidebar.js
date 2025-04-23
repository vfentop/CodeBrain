import React from 'react';
import './Sidebar.css'; // 导入侧边栏样式

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* 侧边栏内容 */}
      <ul>
        <li><a href="/">首页</a></li>
        <li><a href="/shorts">Shorts</a></li> {/* 示例链接 */}
        <li><a href="/subscriptions">订阅内容</a></li> {/* 示例链接 */}
        <hr />
        <li><a href="/library">媒体库</a></li> {/* 示例链接 */}
        <li><a href="/history">历史记录</a></li> {/* 示例链接 */}
        {/* 可以添加更多导航项 */}
      </ul>
    </aside>
  );
}

export default Sidebar;