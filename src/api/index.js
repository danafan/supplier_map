import axios from 'axios'
import router from '../router/index.js'

const baseURL = `${location.origin}/admin/`;
// 创建axios实例，可以自定义配置
const instance = axios.create({
  baseURL,
});

instance.interceptors.request.use(
  config => {
    return config
  },error => {
    return Promise.reject(error)
  })

instance.interceptors.response.use(response => {
  if(response.data.status == 1){
    return response.data;
  }
  switch (response.data.code) {
    case 1:
    return response.data;
    default:
    alert(response.data.msg);
    return;
  }

},error => {
 if (error.response) {
  switch (error.response.status) {
    case 404:
    alert('参数错误');
    break;
    case 500:
    alert('服务器故障');
    break;
    case 504:
    alert('没有网络');
    break;
  }
}
});

export default instance;