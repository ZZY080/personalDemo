// 导入获取ip的方法
import { getLocalIpAddress } from "../utils/util.js";

// 1. token 秘钥
export let JWT_SECRET_KEY = "jsjdsjdksd";
// 2. express 运行的端口
export let SERVER_PORT = 8081;
// 3. express 运行的ip
export let IP = getLocalIpAddress();
// export let IP = "127.0.0.1";
export let MONGODB_PROTOCOL = "mongodb";
export let MONGODB_DOMAIN = "127.0.0.1";
export let MONGODB_PORT = "27017";
export let MONGODB_DATABASE_NAME = "justeasy";
