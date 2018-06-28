<template>
	<div>
		<div class="fishEye">
			<div class="eye_bottom" >
				<div class="expand-down">
					<img class="bottomImg" src="http://124.160.96.135:8070/appSign/bg.png" >
					<ul class="clearfix">
						<li v-for="item in commonList" @click="openUrl(item.releaseUrl)">
							<span>{{item.name}}</span>
							<img :src="item.pictureUrl">
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import './assets/css/application.css'
	import './assets/css/common.css'
	export default{
		data(){
			return{
				commonList:[],
			}
		},
		props:{
	      	ports: {
	        	type: String,
	        	default: ''
	      	},
	      	account: {
	        	type: String,
	        	default: ''
	      	}
	  	},
	  	methods:{
	  		openUrl(url){
	  			if(url){
	  				window.open(url)
	  			}else{
	  				this.$alert('应用开发中', '提示', {
			          confirmButtonText: '确定',
			          callback: action => {
			          }
			        });
	  			}
	  			
	  		}
	  	},
		mounted(){
			this.$http.get(
				this.ports+'temp/findAppByUserPlat',
				{account:this.account},
				data=>{	
					this.commonList=data.commonList
				},
				this
			)
		}
	}
</script>