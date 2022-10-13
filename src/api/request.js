import axios from './index'

//中间处理
export function middleWare(params,type) { 
  //组织参数
  // var req = {...params,...{userid:'16161349938228000'}};   
  // var req = {...params,...{userid:'014017496357903146'}};   
  // var req = {...params,...{user_id:'15262575868677723'}};   
  var req = {...params,...{}};   


  var get_arr = [];
  //post请求参数
  var form = new FormData();
  for(let key in req){
    form.append(key, req[key]);
    get_arr.push(`${key}=${req[key]}`);
  }
  //get请求参数
  var get_str = get_arr.join('&');
  return type == 'get'?get_str:form;
}

export default {
  post(path, params={}){
    var form = middleWare(params,'post');
    return axios.post(`${path}`, form);
  },
  get(path, params={}){
    var str = middleWare(params,'get');
    return axios.get(`${path}?${str}`);
  }
}
