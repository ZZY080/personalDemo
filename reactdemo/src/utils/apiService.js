import axios from "axios";

// 配置url
axios.defaults.baseURL = "https://api.oioweb.cn";

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        // 发送请求前做一些什么
        // 比如请求头,验证 token
        const token = localStorage.getItem("token");
        if(token){
            // config.headers.Authorization=`Bearer ${token}`
        }
        return config;
    },
    (error) => {
        // 对请求错误做些什么
        return Promise.reject(error);
    });

// 响应拦截器
axios.interceptors.response.use(
    (response) => {
        // 对响应数据做些什么
        // 比如处理返回的数据,错误处理等
        console.log(response)
        return response ;
    },
    (error)=>{
        // 对响应错误做些什么
        return Promise.reject(error);
    }
)
export default axios;

