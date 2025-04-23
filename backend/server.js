const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000' // 允许来自前端的请求
}));
app.use(express.json()); // 添加 JSON 解析中间件

const videos = [
  { id: 1, title: '【nBn教程】自动化新闻口播视频工作流', uploader: 'Jay\'s AI Lab', views: '36次观看', uploaded: '1小时前', description: '学习如何使用 n8n 自动化创建新闻口播视频。', videoUrl: '/videos/placeholder1.mp4' }, // 示例：使用相对路径或完整 URL
  { id: 2, title: '李显龙夫人何晶: 习近平像黑帮老大...', uploader: 'stone记', views: '4万次观看', uploaded: '5小时前', description: 'Stone 锐评时事。', videoUrl: '/videos/placeholder2.mp4' },
  { id: 3, title: '这款 AI Vlog 影片工具，效果爆炸好!', uploader: 'Jelena 玩转部落 AIGC', views: '2711次观看', uploaded: '1个月前', description: '介绍一款强大的 AI 视频编辑工具 Flexclip。', videoUrl: '/videos/placeholder3.mp4' },
  { id: 4, title: 'OSS ComfyUI 新采样调度器', uploader: '枫铃风林', views: '106次观看', uploaded: '3天前', description: 'ComfyUI 的新功能介绍和演示。', videoUrl: '/videos/placeholder4.mp4' },
  { id: 5, title: '最新小程序全自动挂G掘金', uploader: '吾爱分享', views: '无人观看', uploaded: '11分钟前', description: '一个关于小程序自动化赚钱的分享。', videoUrl: '/videos/placeholder5.mp4' },
];

// 简单的内存评论存储 { videoId: [ { id, user, text }, ... ] }
const commentsStore = {
  1: [ { id: 101, user: '用户A', text: '这个视频太棒了！' } ],
  2: [ { id: 201, user: '用户B', text: '学到了很多东西。' } ],
};

// API 路由：获取视频列表
app.get('/api/videos', (req, res) => {
  res.json(videos);
});

// API 路由：根据 ID 获取单个视频详情
app.get('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id, 10);
  const video = videos.find(v => v.id === videoId);

  if (video) {
    res.json(video);
  } else {
    res.status(404).json({ message: 'Video not found' }); // 返回 JSON 格式的错误
  }
});

// --- 新增评论 API ---

// GET /api/videos/:videoId/comments - 获取指定视频的评论
app.get('/api/videos/:videoId/comments', (req, res) => {
  const videoId = parseInt(req.params.videoId, 10);
  const videoComments = commentsStore[videoId] || []; // 如果没有评论则返回空数组
  console.log(`获取视频 ${videoId} 的评论:`, videoComments);
  res.json(videoComments);
});

// POST /api/videos/:videoId/comments - 添加新评论
app.post('/api/videos/:videoId/comments', (req, res) => {
  const videoId = parseInt(req.params.videoId, 10);
  const { text, user } = req.body; // 从请求体获取评论内容和用户

  if (!text || !user) {
    return res.status(400).json({ message: '评论内容和用户信息不能为空' });
  }

  if (!commentsStore[videoId]) {
    commentsStore[videoId] = []; // 如果该视频还没有评论，初始化数组
  }

  const newComment = {
    id: Date.now(), // 使用时间戳作为临时唯一 ID
    user: user,
    text: text,
  };

  commentsStore[videoId].push(newComment);
  console.log(`视频 ${videoId} 收到新评论:`, newComment);
  res.status(201).json(newComment); // 返回新创建的评论
});

// --- 结束评论 API ---

// 添加静态文件服务 (可选，如果视频文件放在 backend/public/videos 目录下)
// app.use('/videos', express.static('public/videos'));

app.listen(port, () => {
  console.log(`后端服务运行在 http://localhost:${port}`);
});