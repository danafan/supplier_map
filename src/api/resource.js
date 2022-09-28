import http from './request.js'
let path = {	
	getConfig:'ding/getConfig',						//获取钉钉鉴权信息
	dingAuth:'ding/auth',							//钉钉鉴权
}								
export default{
	//获取钉钉鉴权信息
	getConfig(params){
		return http.get(path.getConfig, params)
	},
	//钉钉鉴权
	dingAuth(params){
		return http.get(path.dingAuth, params)
	},
}









