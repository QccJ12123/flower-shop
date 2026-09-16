const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');
const app = express();

// 配置
app.use(bodyParser.urlencoded({ extended: false }));

// 静态文件服务 
app.use(express.static(path.join(__dirname, 'Public'))); 
app.use('/images', express.static(path.join(__dirname, 'Public', 'images'))); 

// SQL Server 配置
const dbConfig = {
  user: 'sa',
  password: '123456',
  server: 'localhost',
  port: 1433,
  database: 'UserDB',
  options: { 
    encrypt: false, 
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

// 自动创建数据库和表
async function initDB() {
  try {
    let pool = await sql.connect({ ...dbConfig, database: 'master' });
    
    // 创建数据库
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.databases WHERE name='UserDB') 
      CREATE DATABASE UserDB
    `);
    await pool.close();

    // 连接到 UserDB 创建表
    pool = await sql.connect({ ...dbConfig, database: 'UserDB' });
    
    await pool.request().query(`
      IF NOT EXISTS(SELECT * FROM sys.tables WHERE name='users')
      CREATE TABLE users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) UNIQUE NOT NULL,
        password NVARCHAR(50) NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        age INT CHECK(age>0 AND age<150),
        name NVARCHAR(50) NOT NULL,
        created_at DATETIME DEFAULT GETDATE()
      )
    `);
    
    console.log('✅ 数据库初始化成功');
    await pool.close();
  } catch (err) {
    console.error('❌ 数据库初始化失败：', err.message);
  }
}

// 数据库连接函数
async function getConn() {
  try {
    return await sql.connect(dbConfig);
  } catch (err) {
    console.error('数据库连接失败:', err.message);
    throw err;
  }
}

// 初始化数据库
initDB();

// 注册接口
app.post('/register', async (req, res) => {
  const { name, username, password, repassword, email, age } = req.body;
  console.log('注册请求:', { name, username, email, age });

  const errors = [];

  // 表单验证
  if (!name || name.length < 2 || name.length > 20) errors.push('姓名需2-20字符');
  if (!username || username.length < 2 || username.length > 20) errors.push('用户名需2-20字符');
  if (!password || password.length < 6) errors.push('密码需≥6位');
  if (password !== repassword) errors.push('两次密码不一致');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('邮箱格式错误');
  if (!age || isNaN(age) || age < 1 || age > 149) errors.push('年龄需1-149之间');

  if (errors.length > 0) {
    return res.send(`<script>alert('${errors.join('\\n')}');window.location.href='/register.html';</script>`);
  }

  try {
    const pool = await getConn();
    
    // 检查用户名和邮箱是否已存在
    const checkResult = await pool.request()
      .input('username', sql.NVarChar(50), username)
      .input('email', sql.NVarChar(100), email)
      .query('SELECT username, email FROM users WHERE username = @username OR email = @email');

    if (checkResult.recordset.length > 0) {
      const existing = checkResult.recordset[0];
      if (existing.username === username) {
        return res.send(`<script>alert('用户名已存在');window.location.href='/register.html';</script>`);
      }
      if (existing.email === email) {
        return res.send(`<script>alert('邮箱已注册');window.location.href='/register.html';</script>`);
      }
    }

    // 插入新用户
    await pool.request()
      .input('name', sql.NVarChar(50), name)
      .input('username', sql.NVarChar(50), username)
      .input('password', sql.NVarChar(50), password)
      .input('email', sql.NVarChar(100), email)
      .input('age', sql.Int, parseInt(age))
      .query(`
        INSERT INTO users (name, username, password, email, age) 
        VALUES (@name, @username, @password, @email, @age)
      `);
    
    res.send(`
      <script>
        alert('注册成功！欢迎 ${name} 加入花卉百科！');
        window.location.href = '/login.html';
      </script>
    `);
  } catch (err) {
    console.error('注册错误:', err);
    res.send(`<script>alert('注册失败：${err.message}');window.location.href='/register.html';</script>`);
  }
});

// 登录接口
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('登录请求:', { username });

  if (!username || !password) {
    return res.send(`<script>alert('用户名和密码不能为空');window.location.href='/login.html';</script>`);
  }

  try {
    const pool = await getConn();
    const result = await pool.request()
      .input('username', sql.NVarChar(50), username)
      .input('password', sql.NVarChar(50), password)
      .query('SELECT name, username FROM users WHERE username = @username AND password = @password');
    
    if (result.recordset.length > 0) {
      const user = result.recordset[0];
      res.send(`
        <script>
          alert('登录成功！欢迎 ${user.name} 回到花卉百科！');
          window.location.href = '/index.html';
        </script>
      `);
    } else {
      res.send(`<script>alert('用户名或密码错误');window.location.href='/login.html';</script>`);
    }
  } catch (err) {
    console.error('登录错误:', err);
    res.send(`<script>alert('登录失败：${err.message}');window.location.href='/login.html';</script>`);
  }
});

// 忘记密码接口
app.post('/forget', async (req, res) => {
  const { username, email, newpassword } = req.body;
  console.log('忘记密码请求:', { username, email });
  
  if (!username || !email || !newpassword) {
    return res.send(`<script>alert('请填写完整信息');window.location.href='/forget.html';</script>`);
  }
  
  if (newpassword.length < 6) {
    return res.send(`<script>alert('新密码需≥6位');window.location.href='/forget.html';</script>`);
  }

  try {
    const pool = await getConn();
    
    const userResult = await pool.request()
      .input('username', sql.NVarChar(50), username)
      .input('email', sql.NVarChar(100), email)
      .query('SELECT id FROM users WHERE username = @username AND email = @email');

    if (userResult.recordset.length === 0) {
      return res.send(`<script>alert('用户名或邮箱错误');window.location.href='/forget.html';</script>`);
    }

    await pool.request()
      .input('newpassword', sql.NVarChar(50), newpassword)
      .input('username', sql.NVarChar(50), username)
      .query('UPDATE users SET password = @newpassword WHERE username = @username');
    
    res.send(`<script>alert('密码修改成功，请登录');window.location.href='/login.html';</script>`);
  } catch (err) {
    console.error('修改密码错误:', err);
    res.send(`<script>alert('修改失败：${err.message}');window.location.href='/forget.html';</script>`);
  }
});

// 根路径重定向到首页
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// 启动服务器
app.listen(3000, () => {
  console.log('🌺 花卉百科服务器运行：http://localhost:3000');
  console.log('📝 访问注册页：http://localhost:3000/register.html');
  console.log('🔐 访问登录页：http://localhost:3000/login.html');
  console.log('🏠 访问首页：http://localhost:3000/index.html');
  console.log('✅ 静态文件服务已配置');
});