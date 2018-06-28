<template>
  <div id="app">
    <div class="content">
			<div class="wrap">
				<div class="nav">
					<ul>
						<li>
			              <a href="#folerId0">
			                <b  >常</b>
			                <span >常用</span>
			              </a>
			            </li>
						<li v-for="(item,index) in navList" :key="index">
			              <a :href="'#folerId'+item.id">
			                <b  >{{item.folderName?item.folderName.substr(0,1):''}}</b>
			                <span >{{item.folderName}}</span>
			              </a>
			            </li>
					</ul>
				</div>
				<div class="main noScroll">
					<div >
						<div>
							<h2 class="title subTitle" :id="'folerId'+commonList.folderId">
								{{commonList.folderName}}
							</h2>
							<div class="my-column clearfix">
								<transition-group name="el-zoom-in-top">
									<div class="item" @click.stop="toOther(val)" v-for="(val,i) in commonList.reportList" :key="val.id" @mouseover="select=val" @mouseout="select={}">							
										<div class="item-content">
											<img :src="val.img">
											<p style="text-align: center">{{val.repertName}}</p>
										</div>
										<transition name="el-zoom-in-center">
											<span v-show="select==val"  @click.stop="remove(i)">
												<svg class="icon" aria-hidden="true">
													<use xlink:href="#icon-yichu"></use>
												</svg>
											</span>
										</transition>
									</div>
								</transition-group>
							</div>
						</div>
						<div v-for="(item,index) in classList" >
							<h2 class="title subTitle" :id="'folerId'+item.folderId">
								{{item.folderName}}
							</h2>
							<div class="my-column clearfix">
								<div class="item" @click.stop="toOther(val)" v-for="(val,i) in item.reportList" @mouseover="select=val" @mouseout="select={}">
									<div class="item-content">
										<img :src="val.img">
										<p style="text-align: center">{{val.repertName}}</p>
									</div>
									<transition name="el-zoom-in-center">
										<span v-show="select==val" @click.stop="append(index,i)">
											<svg class="icon" aria-hidden="true" >
												<use xlink:href="#icon-changyong-"></use>
											</svg>
										</span>
									</transition>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
import './assets/css/home.css'
export default {
  name: 'app',
  data () {
    return {
    	select:{},
      	navList:[],
      	commonList:{
      		folderId:0,
			folderName:'常用',
			reportList:[]
      	},
      	classList:[],
		// showimgList:[[false,false,false,false,false],[false,false,false,false,false],[false,false]],
		contentimgList:[]
    }
	},
	methods:{
		//移除常用
		remove(index){
			this.$http.post(
				this.ports+'/temp/updateReport',
				{id:this.commonList.reportList[index].id,isCommon:0},
				{account:this.account},
				res=>{
					this.commonList.reportList.splice(index,1)
					this.select={}
				},
				this
			)
		},
		toOther(val){
			console.log(val.url)
			if(val.url){
				window.open(val.url+'?id='+val.id)
			}
			
		},
		append(index,i){
			console.log(index,i)
			var d=this.commonList.reportList.findIndex(val=>val.id==this.classList[index].reportList[i].id)
			if(d<0){
				this.$http.post(
					this.ports+'temp/updateReport',
					{id:this.classList[index].reportList[i].id,isCommon:1},
					{account:this.account},
					res=>{
						console.log(res)
						var data=Object.assign({},this.classList[index].reportList[i])
						data.folderId=0
						data.folderName='常用'
						this.commonList.reportList.push(data)
					},
					this
				)
				
				// this.contentimgList[index].imgList[i].isCommon=true
			}else{
				return this.$message({
					message: '所选应用已添加至常用应用,请勿重复添加',
          			type: 'warning'
				})
			}
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
	mounted(){
		console.log('---------------------111')
		this.$http.get(
			this.ports+'/temp/findFolder',
			{account:this.account},
			data=>{
				this.navList=data
			},
			this
		)
		this.$http.get(
			this.ports+'/temp/getNewUrlList',
			{account:this.account},
			data=>{
				console.log(data,'==')
				this.commonList=data.CommonList
				this.classList=data.ReportList
				this.toUrl=data.url
			},
			this
		)
	}
}
</script>
