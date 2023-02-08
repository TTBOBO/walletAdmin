import axios, { AxiosInstance } from "axios";

let instance: AxiosInstance = axios.create({
    // baseURL: "https://cwapi.mazbipt.com/", // 正式环境
    baseURL: "http://34.92.148.187:9005", // 测试环境
    withCredentials: true // 跨域请求的时候使用凭证
});

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    if (response.data.code === 4000) {
        location.href = "/";
    }
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});
export default instance;
