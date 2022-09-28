import http from './request.js'
let path = {	
	getAddress:'open/getsupplierlocation',		//获取所有供应商位置
}								
export default{
	//获取所有供应商位置
	getAddress(params){
		return http.get(path.getAddress, params)
	},
}









