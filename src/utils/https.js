// 该 axios 封装已弃用
import axios from 'axios'
import qs from 'querystring'

// 创建axios实例
let http = axios.create({
    baseURL: 'http://localhost:8080/',
    withCredentials: true, // 是否跨域
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    // 参数转化
    // transformRequest: [function (data) {
    //     let newData = '';
    //     for (let k in data) {
    //         if (data.hasOwnProperty(k) === true) {
    //             newData += encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) + '&';
    //         }
    //     }
    //     return newData;
    // }]
});
// 添加request拦截器 
http.interceptors.request.use(config => {
    return config
}, error => {
    Promise.reject(error)
})
// 添加respone拦截器
http.interceptors.response.use(
    response => {
        let res = {};
        res.status = response.status
        res.data = response.data;
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

export function get(url, params = {}) {
    params.t = new Date().getTime(); //get方法加一个时间参数,解决ie下可能缓存问题.
    console.log(params)
    return http({
        url: url,
        method: 'get',
        headers: {
        },
        params
    })
}


// 封装post请求
export function post(url, data = {}) {
    //默认配置 
    let sendObject = {
        url: url,
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: data
    };
    sendObject.data = JSON.stringify(data);
    return http(sendObject)
}

// 封装put方法 (resfulAPI常用)
export function put(url, data = {}) {
    return http({
        url: url,
        method: 'put',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        data: JSON.stringify(data)
    })
}
// 删除方法(resfulAPI常用)
export function deletes(url) {
    return http({
        url: url,
        method: 'delete',
        headers: {}
    })
}

export default http;
