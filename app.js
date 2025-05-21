require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');

const app = express();

// CORS 配置
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 中间件
app.use(express.json({ limit: '10kb' }));

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 路由
app.use('/api/auth', authRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: '服务器错误',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: '未找到请求的资源' });
});

// 连接数据库
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('数据库连接成功'))
    .catch(err => {
        console.error('数据库连接失败:', err);
        process.exit(1);
    });

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
}); 