import axios from 'axios'

let http = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true, // 是否跨域
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    // 参数转化
    transformRequest: [function (data) {
        let newData = '';
        for (let k in data) {
            if (data.hasOwnProperty(k) === true) {
                newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
            }
        }
        return newData;
    }]
});

// 添加request拦截器 
http.interceptors.request.use(config => {
    // console.log(config)
    return config
}, error => {
    Promise.reject(error)
})
// 添加respone拦截器
http.interceptors.response.use(
    response => {
        let res = {};
        res.status = response.status
        res.payload = response.data;
        return res;
    },
    error => {
        if (error.response && error.response.status == 404) {
            console.log('http请求失败: ' + error)
            // router.push('/blank.vue') // 重定向到 404 页面
        }
        return Promise.reject(error.response)
    }
)

export default http;