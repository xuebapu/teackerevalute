import axios from 'axios'
export function requestLocal(config) {
    //创建 axios实例npm
    const  instance = axios.create({
        baseURL: 'http://localhost:8081',
        timeout: 1000,
    })
    //axios 拦截器
    instance.interceptors.request.use(config=>{
        // console.log(config);
        //一定要返回
        return config;
    },err => {
        console.log(err)
    });
    //响应拦截
    instance.interceptors.response.use(res=>{
        // console.log(res);
        return res;
    },err => {
        console.log(err)
    })

    //发送网络请求
    return instance(config);

}
