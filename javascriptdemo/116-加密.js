const crypto = require("crypto");

// 哈希加密
const dataToHash =JSON.stringify({location:"zz",age:18,sex:"nan"});
const hashData = crypto.createHash("sha256").update(dataToHash).digest("base64");
console.log(hashData);

// 可以解密
const algorithm = 'aes-192-cbc';
const key = crypto.randomBytes(24);
const iv = crypto.randomBytes(16);
const message = JSON.stringify({name:"乳酸菌",count:22222,date:"2023-12-28 14:00:38"});

// 加密
const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update(message, 'utf8', "base64");
encrypted += cipher.final("base64");

// 解密
const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, "base64", 'utf8');
decrypted += decipher.final('utf8');
console.log(`Encrypted message: ${encrypted}`);
console.log(`Decrypted message: ${decrypted}`);
