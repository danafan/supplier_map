<template>
	<div>
		<div class="container" id="container"></div>
	</div>
</template>
<script>

	import * as dd from 'dingtalk-jsapi';
	import AMapLoader from '@amap/amap-jsapi-loader';
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				address_list:[{
					name:'上海',
					lng_lat:[121.472644,31.231706]
				},{
					name:'嘉兴',
					lng_lat:[120.750865,30.762653]
				},{
					name:'湖州',
					lng_lat:[120.102398,30.867198]
				},{
					name:'绍兴',
					lng_lat:[120.582112,29.997117]
				}],									//地址列表
				longitude:120.25521240234374,
				latitude:30.229253743489583,
			}
		},
		created(){
			
		},
		mounted(){
			//获取钉钉鉴权信息
			// this.getConfig();
			this.ddd();
			
			
		},
		methods:{
			ddd(){
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
						var content = `<div id="marker_${index}" style="background:#ffffff;color:red;padding:5px 10px;white-space: nowrap;">${item.name}</div>`;
						var marker_item = new AMap.Marker({
							content: content,
							position: item.lng_lat,  
							title: item.name
						});
						markerList.push(marker_item)
						marker_item.on('click',clickMarkers)
					})
					map.add(markerList);
				}
			    //解析定位错误信息
			    function onError(data) {
			    	alert(JSON.stringify(data));
			    }

			},
			//获取钉钉鉴权信息
			getConfig(){
				resource.getConfig().then(res => {
					if(res.code == 1){
						let data = res.data;
						//钉钉鉴权
						this.dingAuth(data);
					}
				})
			},
			//钉钉鉴权
			dingAuth(data){
				data.url = window.location.href;
				data.corp_id = 'ding7828fff434921f5b';
				resource.dingAuth(data).then(res => {
					//钉钉鉴权
					this.ddConfig(res.data);
				})
			},
			//钉钉鉴权
			ddConfig(data){
				dd.config({
					agentId: data.agentId, // 必填，微应用ID
					corpId: data.corpId,//必填，企业ID
					timeStamp: data.timeStamp, // 必填，生成签名的时间戳
					nonceStr: data.nonceStr, // 必填，自定义固定字符串。
					signature: data.signature, // 必填，签名
					jsApiList : [
					'device.geolocation.get'
					] 
				});
				dd.error(function (err) {
					alert('dd error: ' + JSON.stringify(err));
				})
				//获取当前位置
				this.getLocation();
			},
			//获取当前位置
			getLocation(){
				dd.ready(() => {
					dd.device.geolocation.get({
						targetAccuracy : 200,
						coordinate : 1,
						withReGeocode : false,
						onSuccess : (result) => {
							this.longitude = result.longitude;
							this.latitude = result.latitude;
							var map = new AMap.Map('container', {
								center: [this.longitude, this.latitude],//中心点坐标
								zoom:16
							});
							//点击某一个地点去导航
							var clickMarkers  =  (e) => {
								let index = e.originEvent.target.id.split('_')[1];
								let lng_lat = this.address_list[index].lng_lat;
								let name = this.address_list[index].name;
								//调用高德地图
								window.location.href = "https://uri.amap.com/marker?position=" + lng_lat[0] + "," + lng_lat[1] + "&name=" + name;
							}

							var markerList = [];
							// 标记当前位置
							var marker = new AMap.Marker({
								position: [this.longitude, this.latitude],  
								title: '杭州'
							});
							markerList.push(marker);
							// 标记所有供应商位置
							this.address_list.map((item,index) => {
								var content = `<div id="marker_${index}" style="background:#ffffff;color:red;padding:5px 10px;white-space: nowrap;">${item.name}</div>`;
								var marker_item = new AMap.Marker({
									content: content,
									position: item.lng_lat,  
									title: item.name
								});
								markerList.push(marker_item)
								marker_item.on('click',clickMarkers)
							})
							map.add(markerList);
						},
						onFail : function(err) {}
					});
				})
			},

		}
	}
</script>
<style scoped>
.container{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>