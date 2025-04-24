const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt'); // 新增
const jwt = require('jsonwebtoken'); // 新增

const app = express();
const port = 3001;
const JWT_SECRET = 'your_very_secret_key_here'; // !! 请务必替换为强密钥并保存在安全的地方（例如环境变量）!!
const saltRounds = 10; // bcrypt 加盐轮数

// 允许来自前端的请求 (http://localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // 用于解析 POST 请求的 JSON body

// --- 模拟数据存储 ---
// 模拟用户数据存储 (实际应用应使用数据库)
const users = []; // { id, username, passwordHash }
let nextUserId = 1;

// 模拟视频数据
const videos = [
  { id: 1, title: 'React 教程 - 基础入门', uploader: '张三', views: '10K views', uploaded: '1 day ago', description: '学习 React 的基础知识，包括组件、状态和 props。', videoUrl: '/videos/sample.mp4', relatedVideos: [2, 3] },
  { id: 2, title: 'Node.js Express 快速上手', uploader: '李四', views: '5.5K views', uploaded: '2 days ago', description: '快速学习如何使用 Node.js 和 Express 构建后端 API。', videoUrl: '/videos/sample.mp4', relatedVideos: [1, 4] },
  { id: 3, title: 'CSS Flexbox 布局详解', uploader: '王五', views: '20K views', uploaded: '5 hours ago', description: '深入理解 CSS Flexbox，轻松实现复杂布局。', videoUrl: '/videos/sample.mp4', relatedVideos: [1, 4] },
  { id: 4, title: 'JavaScript 异步编程 (Async/Await)', uploader: '赵六', views: '8K views', uploaded: '3 days ago', description: '掌握 JavaScript 中的异步编程，使用 async/await 简化代码。', videoUrl: '/videos/sample.mp4', relatedVideos: [2, 3] },
  // 可以添加更多视频...
];

// 模拟评论数据 (按 videoId 存储)
const commentsStore = {
  1: [{ id: 101, user: '用户A', text: '讲得很好！' }, { id: 102, user: '用户B', text: '有点快，但内容不错。' }],
  2: [{ id: 201, user: '用户C', text: 'Express 真方便！' }],
  3: [{ id: 301, user: '用户D', text: 'Flexbox 终于搞懂了！' }],
  4: [], // 视频4暂时没有评论
};
let nextCommentId = 401; // 用于生成新的评论 ID

// --- 中间件 ---
// 认证中间件 (可选，用于保护需要登录的路由)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // 如果没有 token，返回未授权

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 如果 token 无效或过期，返回禁止访问
    req.user = user; // 将解码后的用户信息附加到请求对象上
    next(); // 继续处理请求
  });
};


// --- API 端点 ---

// === 认证 API ===
// 用户注册 - 后端路由是 /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('用户名和密码不能为空');
    }
    // 检查用户名是否已存在
    if (users.find(u => u.username === username)) {
      return res.status(409).send('用户名已存在'); // 409 Conflict
    }
    // 哈希密码
    const passwordHash = await bcrypt.hash(password, saltRounds);
    // 存储用户 (实际应用中存入数据库)
    const newUser = { id: nextUserId++, username, passwordHash };
    users.push(newUser);
    console.log('用户已注册:', newUser); // 后端日志
    // 注册成功后可以考虑直接登录或让用户跳转登录
    res.status(201).send('注册成功');
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).send('服务器内部错误');
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('用户名和密码不能为空');
    }
    // 查找用户
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).send('用户名或密码错误'); // 未授权
    }
    // 比较密码
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).send('用户名或密码错误'); // 未授权
    }
    // 生成 JWT
    const tokenPayload = { userId: user.id, username: user.username };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token 有效期 1 小时

    console.log('用户已登录:', user.username); // 后端日志
    res.json({ token, user: { id: user.id, username: user.username } }); // 返回 token 和用户信息
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).send('服务器内部错误');
  }
});

// === 视频 API ===
// 获取所有视频
app.get('/api/videos', (req, res) => {
  res.json(videos);
});

// 获取单个视频详情
app.get('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id, 10);
  const video = videos.find(v => v.id === videoId);
  if (video) {
    // 查找相关视频的完整信息
    const related = videos.filter(v => video.relatedVideos.includes(v.id));
    res.json({ ...video, relatedVideos: related }); // 返回包含完整相关视频信息的视频对象
  } else {
    res.status(404).send('Video not found');
  }
});

// === 评论 API ===
// 获取视频评论
app.get('/api/videos/:videoId/comments', (req, res) => {
  const videoId = parseInt(req.params.videoId, 10);
  const comments = commentsStore[videoId] || [];
  res.json(comments);
});

// 添加视频评论 (需要认证)
// 注意：这里添加了 authenticateToken 中间件
app.post('/api/videos/:videoId/comments', authenticateToken, (req, res) => {
  const videoId = parseInt(req.params.videoId, 10);
  // const { user, text } = req.body; // 旧代码：从请求体获取 user 和 text
  const { text } = req.body; // 新代码：只从请求体获取 text
  const user = req.user.username; // 新代码：从认证后的 req.user 获取用户名

  if (!text) { // 只需要检查 text
    return res.status(400).send('评论内容不能为空');
  }

  if (!commentsStore[videoId]) {
    commentsStore[videoId] = []; // 如果该视频还没有评论，初始化数组
  }

  const newComment = {
    id: nextCommentId++,
    user, // 使用认证后的用户名
    text,
  };
  commentsStore[videoId].push(newComment);
  console.log(`用户 ${user} 对视频 ${videoId} 发表评论: ${text}`); // 后端日志
  res.status(201).json(newComment); // 返回新创建的评论
});

// === 搜索 API ===
// 新增：搜索视频接口
app.get('/api/search', (req, res) => {
  const query = req.query.q; // 获取查询参数 'q'

  if (!query) {
    // 如果没有提供查询参数，可以返回空数组或错误
    return res.json([]);
    // 或者: return res.status(400).send('Search query "q" is required');
  }

  const lowerCaseQuery = query.toLowerCase(); // 转换为小写以进行不区分大小写的搜索

  // 过滤视频标题包含查询字符串的视频
  const results = videos.filter(video =>
    video.title.toLowerCase().includes(lowerCaseQuery)
  );

  res.json(results); // 返回搜索结果
});


app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});