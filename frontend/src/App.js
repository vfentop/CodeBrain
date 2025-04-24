import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; // 引入 App 样式

// 导入组件
import Navbar from './Navbar'; // 导航栏
import Sidebar from './Sidebar'; // 侧边栏
import HomePage from './pages/HomePage'; // 首页
import VideoPlayer from './VideoPlayer'; // 视频播放页
import SearchResultsPage from './pages/SearchResultsPage'; // 导入搜索结果页
import LoginPage from './pages/LoginPage'; // 导入登录页
import RegisterPage from './pages/RegisterPage'; // 导入注册页
import { AuthProvider } from './context/AuthContext'; // 导入 AuthProvider

function App() {
  return (
    // 使用 AuthProvider 包裹整个应用
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar /> {/* 添加导航栏 */}
          <div className="app-body"> {/* 新增容器用于布局 */}
            <Sidebar /> {/* 添加侧边栏 */}
            <main className="main-content"> {/* 主内容区域 */}
              <Routes>
                {/* 首页路由 */}
                <Route path="/" element={<HomePage />} />
                {/* 视频观看页路由 */}
                <Route path="/watch/:videoId" element={<VideoPlayer />} />
                {/* 搜索结果页路由 */}
                <Route path="/search" element={<SearchResultsPage />} />
                {/* 登录页路由 */}
                <Route path="/login" element={<LoginPage />} />
                {/* 注册页路由 */}
                <Route path="/register" element={<RegisterPage />} />
                {/* 其他路由... */}
                {/* 可以添加一个 404 页面 */}
                <Route path="*" element={<div>404 - 页面未找到</div>} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;