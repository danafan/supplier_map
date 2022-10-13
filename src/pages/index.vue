<template>
	<div>
		<div class="container" id="container"></div>
		<div class="input_container">
			<div class="search_input" @click="$router.push('/search')">
				<img class="search_icon" src="../static/search_icon.png">
				<div class="search_text">搜索供应商</div>
			</div>
		</div>
	</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';
	import AMapLoader from '@amap/amap-jsapi-loader';
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				address_list:[],									//地址列表
				value:"",			//搜索的内容
			}
		},
		created(){
			//获取供应商地址
			this.getAddress();
		},
		mounted(){
			//获取钉钉鉴权信息
			// this.getConfig();
			//获取供应商地址
			// this.getAddress();

			//获取供应商地址
			// this.setMarket();
		},
		methods:{
			//获取供应商地址
			getAddress(){
				resource.getAddress().then(res => {
					this.address_list = res.data;
					this.setMarket();
				})
			},
			setMarket(){
				//点击某一个地点去导航
				var clickMarkers  =  (e) => {
					let index = e.originEvent.target.id.split('_')[1];
					let lng_lat = this.address_list[index].lng_lat;
					let name = this.address_list[index].name;
					//调用高德地图
					window.location.href = "https://uri.amap.com/marker?position=" + lng_lat[0] + "," + lng_lat[1] + "&name=" + name;
				}

				var map = new AMap.Map('container', {
					resizeEnable: true
				});

				AMap.plugin('AMap.Geolocation', function() {
					var geolocation = new AMap.Geolocation({
			            enableHighAccuracy: true,//是否使用高精度定位，默认:true
			            timeout: 10000,          //超过10秒后停止定位，默认：5s
			            position:'RB',    //定位按钮的停靠位置
			            offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
			            zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点

			        });
					map.addControl(geolocation);
					geolocation.getCurrentPosition(function(status,result){
						if(status=='complete'){
							onComplete(result)
						}else{
							onError(result)
						}
					});
				});
			    //解析定位结果
			    var onComplete = (data) => {
			    	var markerList = [];
					// 标记所有供应商位置
					this.address_list.map((item,index) => {
						var content = `<div id="marker_${index}" style="background:#ffffff;color:#333333;padding:5px 10px;white-space: nowrap;">${item.name}</div>`;
						var marker_item = new AMap.Marker({
							icon: '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png',
							anchor:'bottom-center',
							offset: new AMap.Pixel(0, 0),
							position: item.lng_lat,  
							title: item.name
						});
						marker_item.setLabel({
							direction:'right',
					        offset: new AMap.Pixel(0, 0),  //设置文本标注偏移量
					        content: content, //设置文本标注内容
					    });
						markerList.push(marker_item)
						marker_item.on('click',clickMarkers)
					})
					map.add(markerList);

					//如果从搜索页进入，设置中心点
					if(this.$route.query.is_search){
						let lng = this.$route.query.lng;
						let lat = this.$route.query.lat;
						map.setCenter([lng,lat]); 
					}
				}
			    //解析定位错误信息
			    function onError(data) {
			    	alert(JSON.stringify(data));
			    }
			},
			// //获取钉钉鉴权信息
			// getConfig(){
			// 	resource.getConfig().then(res => {
			// 		if(res.code == 1){
			// 			let data = res.data;
			// 			//钉钉鉴权
			// 			this.dingAuth(data);
			// 		}
			// 	})
			// },
			// //钉钉鉴权
			// dingAuth(data){
			// 	data.url = window.location.href;
			// 	data.corp_id = 'ding7828fff434921f5b';
			// 	resource.dingAuth(data).then(res => {
			// 		//钉钉鉴权
			// 		this.ddConfig(res.data);
			// 	})
			// },
			// //钉钉鉴权
			// ddConfig(data){
			// 	dd.config({
			// 		agentId: data.agentId, // 必填，微应用ID
			// 		corpId: data.corpId,//必填，企业ID
			// 		timeStamp: data.timeStamp, // 必填，生成签名的时间戳
			// 		nonceStr: data.nonceStr, // 必填，自定义固定字符串。
			// 		signature: data.signature, // 必填，签名
			// 		jsApiList : [
			// 		'device.geolocation.get'
			// 		] 
			// 	});
			// 	dd.error(function (err) {
			// 		alert('dd error: ' + JSON.stringify(err));
			// 	})
			// 	//获取当前位置
			// 	this.getLocation();
			// },
			// //获取当前位置
			// getLocation(){
			// 	dd.ready(() => {
			// 		dd.device.geolocation.get({
			// 			targetAccuracy : 200,
			// 			coordinate : 1,
			// 			withReGeocode : false,
			// 			onSuccess : (result) => {
			// 				this.longitude = result.longitude;
			// 				this.latitude = result.latitude;
			// 				var map = new AMap.Map('container', {
			// 					center: [this.longitude, this.latitude],//中心点坐标
			// 					zoom:16
			// 				});
			// 				//点击某一个地点去导航
			// 				var clickMarkers  =  (e) => {
			// 					let index = e.originEvent.target.id.split('_')[1];
			// 					let lng_lat = this.address_list[index].lng_lat;
			// 					let name = this.address_list[index].name;
			// 					//调用高德地图
			// 					window.location.href = "https://uri.amap.com/marker?position=" + lng_lat[0] + "," + lng_lat[1] + "&name=" + name;
			// 				}

			// 				var markerList = [];
			// 				// 标记当前位置
			// 				var marker = new AMap.Marker({
			// 					position: [this.longitude, this.latitude],  
			// 					title: '杭州'
			// 				});
			// 				markerList.push(marker);
			// 				// 标记所有供应商位置
			// 				this.address_list.map((item,index) => {
			// 					var content = `<div id="marker_${index}" style="background:#ffffff;color:red;padding:5px 10px;white-space: nowrap;">${item.name}</div>`;
			// 					var marker_item = new AMap.Marker({
			// 						content: content,
			// 						position: item.lng_lat,  
			// 						title: item.name
			// 					});
			// 					markerList.push(marker_item)
			// 					marker_item.on('click',clickMarkers)
			// 				})
			// 				map.add(markerList);
			// 			},
			// 			onFail : function(err) {}
			// 		});
			// 	})
			// },

		}
	}
</script>
<style type="text/css">
.amap-icon{
	position: relative!important;
	width: 25px!important;
	height: 34px!important;
}
.amap-icon img{
	position: absolute!important;
	top: 0!important;
	left: 0!important;
	width: 100%!important;
	height: 100%!important;
}
.amap-marker-label{
	border:none!important;
}
</style>
<style scoped>
.container{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.input_container{
	background: #ffffff;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.search_input{
	padding: 0 12px;
	border-radius: 2px;
	background: #f7f8fa;
	width: 390px;
	height: 34px;
	display: flex;
	align-items: center;
}
.search_icon{
	margin-right: 3px;
	width: 16px;
	height: 16px;
}
.search_text{
	font-size: 14px;
	color: #969799;
}
/*.input_ele{
	width: 600px;
	height: 60px;
	}*/
</style>