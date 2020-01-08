/**
 * 原axios封装(已弃用)
 */

/*
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

function apiAxios(method, url, params, response) {
    http({
        method: method,
        url: url,
        data: method === 'POST' || method === 'PUT' ? params : null,
        params: method === 'GET' || method === 'DELETE' ? params : null,
    }).then(function (res) {
        response(res);
    }).catch(function (err) {
        response(err);
    })
}

export default {
    get: function (url, params, response) {
        return apiAxios('GET', url, params, response)
    },
    post: function (url, params, response) {
        return apiAxios('POST', url, params, response)
    },
    put: function (url, params, response) {
        return apiAxios('PUT', url, params, response)
    },
    delete: function (url, params, response) {
        return apiAxios('DELETE', url, params, response)
    }
}
*/
// 使用方法示例
// this.$http.post('user/login.do(地址)', {
//     "参数名": "参数值"
// }, response => {
//     if (response.status >= 200 && response.status < 300) {
//         console.log(response.data); \\ 请求成功，response为成功信息参数
//     } else {
//         console.log(response.message); \\ 请求失败，response为失败信息
//     }
// });