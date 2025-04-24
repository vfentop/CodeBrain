import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken')); // 从 localStorage 初始化 token

  useEffect(() => {
    // 当 token 改变时，尝试从 localStorage 获取用户信息（如果之前存了的话）
    // 或者可以在这里添加一个 API 调用来验证 token 并获取用户信息
    const storedUser = localStorage.getItem('authUser');
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("解析用户信息失败:", error);
        logout(); // 解析失败则登出
      }
    } else if (!token) {
      setUser(null); // 没有 token 则确保用户未登录
    }
    // 注意：更健壮的做法是每次应用加载时用 token 去后端验证一下有效性
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('authUser', JSON.stringify(userData)); // 存储用户信息
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const authValue = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!user, // 方便使用的布尔值
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义 Hook，方便在组件中使用 AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};