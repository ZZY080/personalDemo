const crypto = require('crypto');

function generateToken(payload, expiresIn) {
  // 有效期限时间戳（例如，设定有效期为 1 小时）
  const expiryTime = Math.floor(Date.now() / 1000) + expiresIn; // 当前时间戳 + 有效期限（单位：秒）

  // 负载中加入有效期字段
  payload.exp = expiryTime;

  // 生成令牌
  const secretKey = 'YourSecretKey';
  const token = Buffer.from(JSON.stringify(payload)).toString('base64');

  // 返回生成的令牌
  return token;
}

function verifyToken(token) {
  try {
    // 解码令牌
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const payload = JSON.parse(decoded);

    // 验证有效期
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('Token 已过期');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('无效的令牌', error);
    return null;
  }
}

// 生成带有效期的令牌（例如：有效期为 1 小时）
const payload = { userId: '1234' };
const expiresIn = 3600; // 1 小时
const token = generateToken(payload, expiresIn);
console.log('生成的令牌:', token);

// 验证令牌
const decodedToken = verifyToken(token);
if (decodedToken) {
  console.log('验证通过，解码后的令牌负载:', decodedToken);
}
