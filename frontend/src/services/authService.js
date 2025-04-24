const API_URL = 'http://localhost:3001/api/auth'; // 后端认证 API 的基础 URL

export const registerUser = async (username, password) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // 获取错误文本
    throw new Error(errorText || `注册失败: ${response.status}`);
  }
  // 注册成功通常不直接返回数据，可以返回成功状态或消息
  return { success: true, message: '注册成功' };
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // 获取错误文本
    throw new Error(errorText || `登录失败: ${response.status}`);
  }

  const data = await response.json(); // { token, user: { id, username } }
  return data;
};

// 可以添加其他认证相关函数，例如验证 token 等