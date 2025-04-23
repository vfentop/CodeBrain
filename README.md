# MyTube Clone - 视频分享平台

这是一个使用 MERN 技术栈（简化版，这里是 React + Node.js/Express）构建的简单视频分享平台。

## ✨ 功能特性

*   **视频浏览**: 在首页以网格布局展示推荐视频列表。
*   **视频观看**: 点击视频进入观看页面，包含视频播放器、标题、描述、上传者信息等。
*   **评论系统**: 在视频下方查看和添加评论（当前为前端模拟，可连接后端 API）。
*   **相关视频**: 在观看页面右侧展示相关视频列表。
*   **响应式布局**: 简单的响应式设计，包含导航栏和侧边栏。

## 🚀 技术栈

*   **前端**:
    *   React
    *   React Router DOM (用于页面路由)
    *   CSS (用于样式)
*   **后端**:
    *   Node.js
    *   Express (用于构建 API)
    *   CORS (处理跨域请求)
*   **数据存储**:
    *   内存存储 (用于模拟视频和评论数据)

## ⚙️ 安装与运行

**前提条件:**

*   安装 [Node.js](https://nodejs.org/) (包含 npm)

**后端:**

1.  进入后端目录:
    ```bash
    cd backend
    ```
2.  安装依赖:
    ```bash
    npm install
    ```
3.  启动后端服务 (默认运行在 `http://localhost:3001`):
    ```bash
    node server.js
    ```
    或者使用 `nodemon` (如果已安装):
    ```bash
    nodemon server.js
    ```

**前端:**

1.  进入前端目录:
    ```bash
    cd frontend
    ```
2.  安装依赖:
    ```bash
    npm install
    ```
3.  启动前端开发服务器 (默认运行在 `http://localhost:3000`):
    ```bash
    npm start
    ```

4.  在浏览器中打开 `http://localhost:3000` 即可访问应用。

## 📄 许可证

本项目采用 [Apache License 2.0](LICENSE) 许可证。
