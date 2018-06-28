<template>
	<div class="processApplication">
		<div class="breadcrumb">
			<el-breadcrumb separator-class="el-icon-arrow-right">
			  	<el-breadcrumb-item><a :href="tourl">待办事项</a></el-breadcrumb-item>
			  	<el-breadcrumb-item>流程申请</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="main">
			<div >
				<!-- <div>
					<h2 class="title subTitle">
						{{commonList.folderName}}
					</h2>
					<div class="my-column clearfix">
						<div class="item" @click.stop="handlerClick(val)" v-for="(val,i) in commonList.reportList" :key="val.id" @mouseover="select=val" @mouseout="select={}">							
							<div class="item-content">
								<img :src="val.img">
								<div >
									<h2>{{val.title}}</h2>
									<p>{{val.content}}</p>
								</div>
							</div>
						</div>
					</div>
				</div> -->
				<div v-for="(item,index) in classList" >
					<h2 class="title subTitle" >
						{{item.categoryName}}
					</h2>
					<div class="my-column clearfix">
						<div class="item" @click.stop="handlerClick(val)" v-for="(val,i) in item.procList" @mouseover="select=val" @mouseout="select={}">
							<div class="item-content">
								<img :src="val.img?val.img:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1527672790810&di=f1d597f7348be2d36c20ec224a9397a2&imgtype=0&src=http%3A%2F%2Fwww.llrsrc.gov.cn%2Fimglib%2Fnoface.gif'">
								<div >
									<h2>{{val.name}}</h2>
									<p>{{val.content}}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			 <transition name="slide">
				<div class="form-box" v-if="isShow">
					<div class="box-title">
						<p>{{type}}</p>
						<i class="el-icon-close" @click="isShow=false,currentId=-1"></i>
					</div>
					<div class="box-content">
						<el-form :model="formData" ref="ruleForm" label-width="120px">
							<el-form-item :label="item.name" :prop="item.id" v-for="item in formConfig" v-if="item.readable" :rules="[{type:setType(item.type) ,required: item.required, message: '此项为必填项', trigger: 'blur' }]">
								<el-input v-if="item.type=='string'" v-model="formData[item.id]" placeholder="" :disabled="!item.writable"></el-input>
								<el-switch
									v-if="item.type=='boolean'"
									v-model="formData[item.id]"
									active-color="#13ce66"
									:disabled="!item.writable"
									inactive-color="#ff4949">
								</el-switch>
								<el-select :disabled="!item.writable" v-if="item.type=='enum'" v-model="formData[item.id]" placeholder="">
									<el-option v-for="val in item.items" :label="val.value" :value="val.value" :key="val.value"></el-option>
								</el-select>
								<el-date-picker
									v-if="item.type=='date'"
									v-model="formData[item.id]"
									:value-format="item.datePattern"
									type="datetime"
									placeholder="选择日期时间">
								</el-date-picker>
		                        <!-- <el-select :disabled="!item.writable" v-if="item.type=='enum'" v-model="formData[item.id]" placeholder="">
		                          <el-option v-for="val in item.items" :label="val.value" :value="val.value" :key="val.value"></el-option>
		                        </el-select> -->
                        		<el-input-number :disabled="!item.writable" v-if="item.type=='long'" v-model="formData[item.id]"></el-input-number>
							</el-form-item>
							<el-form-item>
								<div style="text-align:center">
									<el-button type="primary" @click="submitForm('ruleForm')">申请</el-button>
									<el-button @click="resetForm('ruleForm')">重置</el-button>
								</div>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</transition>
		</div>
	</div>
</template>
<style lang="less">
	.processApplication{
		height: 850px;
		overflow: auto;
		display:flex;
		flex-direction:column;
		position: relative;
		overflow:hidden;
		.breadcrumb{
			margin: 0 50px;
			height: 65px;
			display: flex;
			align-items: center;
			font-size:20px;
			font-family:MicrosoftYaHei-Bold;
			color:rgba(51,51,51,1);
			font-weight: 900;
			border-bottom: 2px solid #DBD9D9;
			span{
				cursor: pointer;
			}
			.icon{
				transform:rotate(180deg);
			}
		}
		.main{
			flex:1;
			padding: 0 50px;
			.form-box{
				position:absolute;
				width: 800px;
				overflow: auto;
				height:100%;
				background:rgba(255,255,255,1);
				box-shadow:10px 0px 35px rgba(0,0,0,0.17);
				right: 0;
				top:0;
				.box-title{
					height:65px;
					position:relative;
					border-bottom:#DBD9D9 2px solid;
					line-height: 65px;
					font-size:16px;
					font-family:MicrosoftYaHei-Bold;
					color:rgba(51,51,51,1);
					padding-left: 20px;
					i{
						position:absolute;
						right:10px;
						top: 50%;
						transform:translate(0,-50%);
						cursor: pointer;
					}
				}
				.box-content{
					padding:20px;
					overflow: auto;
				}
			}
		}
	}
	.slide-enter-active, .slide-leave-active {
	  transition: all .5s;
	}
	.slide-enter, .slide-leave-to {
	  transform:translate(100%,0)
	}
</style>
<script type="text/javascript">
	import './assets/css/processApplication.css'
	export default{
		data(){
			return{
				type:'请假',
				currentId:-1,
				isShow:false,
				classList:[
					{
						folderName:'其他',
						reportList:[{
							img:'./src/assets/img/222.png',
							title:'补卡流程',
							content:'忘记打卡可申请',
							id:'2'
						}]
					}
				],
				formData:{},
				formConfig:[]
			}
		},
		props:['ports','tourl'],
		mounted(){
			this.$http.get(
				this.ports+'/repository/process-definitions/usableProcess',
				{},
				data=>{
					this.classList=data
					console.log(data)
				},
				this
			)
		},
		methods:{
			setType(type){
				if(type=='boolean'){
					return 'boolean'
				}else if(type=='long'){
					return 'number'
				}else{
					return 'string'
				}
			},
			handlerClick(item){
				if(this.currentId!=item.id){
					this.isShow=false
					this.$http.get(
						this.ports+'/repository/process-definitions/'+item.id+'/properties',
						{},
						data=>{
							this.type=item.name
							console.log(data)
							this.formConfig=data
							for(let d of data){
								this.$set(this.formData,d.id,d.value)
							}
							this.isShow=true
						},
						this
					)
					this.currentId=item.id
				}else{
					this.isShow=!this.isShow
				}
			},
			handlerOpen(){
				window.location.href=this.tourl 
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
				if (valid) {
					console.log(this.formData)
					this.$http.post(
						this.ports+'/runtime/process-instances/'+this.currentId,
						this.formData,
						res=>{
							this.resetForm('ruleForm')
							this.$message('流程申请成功')
							this.isShow=false
						},
						this
					)
				} else {
					console.log('error submit!!');
					return false;
				}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		}
	}
</script>