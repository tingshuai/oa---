<template>
	<div>
		<div class="main noScroll">
			<div class="my_column clearfix">
				<div class="item" v-for="(item,index) in list" @click="toOpen(item.releaseUrl)" :key="item.id" @mouseover="select=item" @mouseout="select={}">
					<!-- <img :src="item.pictureUrl"/> -->
					<div class="item-content">
						<img :src="item.pictureUrl" width="80" height="80">
						<p style="text-align: center">{{item.name}}</p>
					</div>
					<transition name="el-zoom-in-center">
						<span v-show="select.id==item.id"  @click.stop="update(item,index)">
							<svg class="icon" aria-hidden="true">
								<use :xlink:href="item.commonApp?'#icon-yichu':'#icon-changyong-'"></use>
							</svg>
						</span>
					</transition>
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
				list:[],
				select:{},

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
	  		update(data,index){
	  			this.$http.get(
	  				this.ports+'temp/updateCommonApp',
	  				{id:data.id,commonApp:!data.commonApp,account:this.account},
	  				res=>{
	  					location.reload(true)  
	  				},
	  				this
	  			)
	  		},
	  		toOpen(url){
	  			console.log(url)
	  			if(url){
	  				window.open(url)
	  			}
	  			
	  		}
	  	},
		mounted(){
			this.$http.get(
				this.ports+'temp/findAppByUserPlat',
				{account:this.account},
				data=>{	
					console.log(data,'------')
					this.list=data.allList
				},
				this
			)
		}
	}
</script>