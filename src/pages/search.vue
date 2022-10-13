<template>
	<div class="search_container">
		<div class="input_container">
			<img class="back_icon" src="../static/back_icon.png" @click="$router.go(-1)">
			<div class="search_input">
				<img class="search_icon" src="../static/search_icon.png">
				<input class="input" autofocus placeholder="搜索供应商" v-model="search_value">
			</div>
			<div class="cancel" @click="search_value = ''">取消</div>
		</div>
		<div class="list" v-if="search_list.length > 0">
			<div class="supplier_item" v-for="item in search_list" @click="goIndex(item)">
				<img class="store_icon" src="../static/store_icon.png">
				<div class="store_name">{{item.name}}</div>
			</div>
		</div>
		<div class="empty" v-else>暂无数据～</div>
	</div>
</template>
<style scoped>
.search_container{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
}
.input_container{
	background: #ffffff;
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding:0 12px;
}
.back_icon{
	margin-right: 12px;
	width: 18px;
	height: 18px;
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
.input{
	background: #f7f8fa;
	outline: none;
	border: none;
	flex:1;
	height: 30px;
	font-size: 14px;
}
.cancel{
	margin-left: 12px;
	font-size: 14px;
	color: #333333;
	white-space: nowrap;
}
.list{
	flex: 1;
	overflow-y: scroll;
}
.supplier_item{
	border-bottom:1px solid #f7f8fa;
	height: 42px;
	display: flex;
	align-items: center;
	padding: 0 12px;
}
.store_icon{
	margin-right: 5px;
	width: 16px;
	height: 16px;
}
.store_name{
	flex: 1;
	font-size: 15px;
	color: #333333;
}
.empty{
	flex: 1;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	color: #333333;
}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				address_list:[],		//供应商列表
				search_value:"",		//搜索内容
				search_list:[],
			}
		},
		watch:{
			search_value:function(n,o){
				if(n){
					this.search_list = this.address_list.filter(item => {
						var patt = new RegExp(n,'i') ;
						return patt.test(item.name) == true;
					});
				}else{
					this.search_list = [];
				}
			},
		},
		created(){
			//获取供应商地址
			this.getAddress();
		},
		methods:{
			//获取供应商地址
			getAddress(){
				resource.getAddress().then(res => {
					this.address_list = res.data;
				})
			},
			goIndex(item){
				this.$router.replace(`/index?is_search=1&lng=${item.lng_lat[0]}&lat=${item.lng_lat[1]}`)
			}
		}
	}
</script>