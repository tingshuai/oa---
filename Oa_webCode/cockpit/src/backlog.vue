<template>
	<div class="backlog">
		<div class="breadcrumb">
			<span>待办事项</span>
		</div>
		<div class="my-main">
			<div class="my-aside noScroll">
                <nav-tree :ports="ports" @nodeChange="nodeChange"></nav-tree>
            </div>
            <div class="my-content noScroll">
            	<components :is="con" :tourl="tourl" @submit="submit" :ports="ports" :text="text" :color="color" :total="total" :list="list" :type="type" @handleCommand="handleCommand" @currentChange="currentChange"></components>
               <!--  <my-content :tourl="tourl" @submit="submit" :ports="ports" :text="text" :color="color" :total="total" :list="list" :type="type" @handleCommand="handleCommand" @currentChange="currentC hange"></my-content>-->
            </div>
		</div>
	</div>
</template>
<style lang="less">
	.backlog{
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
			.icon{
				transform:rotate(180deg);
			}
		}
		.my-main{
            display: flex;
            margin: 15px 50px 0;
            .my-aside{
                width: 260px;
                height: 868px;
                background: #ECECEC;
                overflow: auto;
            }
            .my-content{
                flex:1;
                height: 868px;
                overflow: auto;
                margin-left: 15px;
                background: #F4F4F4;
            }
            .my-calendar{
                width: 385px;
                height: 868px;
                overflow: auto;
                background: #ECECEC;
                margin-left: 15px;
            }
		}
	}
</style>
<style lang="less">
    .model{
    	margin: 20px;
    	background: #fff;
        .view{
            h2{
                font-size: 18px;
            }
            ul{
                padding-left: 30px;
                li{
                    height: 50px;
                    line-height: 50px;
                    padding-left: 10px;
                    border-bottom: 1px solid #e5e5e5;
                }
            }
            >div{
                height: 200px;
                text-align: center;
                line-height: 200px;
            }
        }
        .doc-top{
            height: 40px;
            line-height: 40px;
            border-bottom: #E5E5E5 1px solid;
            padding: 20px;
            box-sizing: content-box;
            .search{
              input{
                border:1px solid #dcdfe6;
              }
            }
            >button{
                margin-left: 24px;
            }
            .search {
                margin-left: 24px;
                .el-input-group__append{
                    background: #409eff;
                    border: none;
                    span{
                        color:#fff;
                    }
                }
            }
            img{
                margin: 0 10px 0 0px;
            }
            span{
                font-family:MicrosoftYaHei;
                color:rgba(51,51,51,1);
            }
        }
        .doc-content{
            flex:1;
            display: flex;
            flex-direction: column;
            padding: 0 32px 20px;
            .doc-content-title{
                height: 60px;
                line-height: 60px;
                border-bottom:1px solid #EEEEEE;
                .el-breadcrumb{
                    height: 60px;
                    line-height: 60px;
                    font-size: 18px;
                }
            }
            .doc-content-container{
                flex:1;
                overflow: auto;
            }
        }
    }
</style>
<script type="text/javascript">
    import navTree from './components/backlog/navTree.vue'
    import myContent from './components/backlog/myContent.vue'
    import runTable from './components/backlog/runTable.vue'
    import historyTable from './components/backlog/historyTable.vue'
	export default{
		data(){
			return{
				pageSize:10,
				pageNum:1,
				total:0,
				list:[],
				type:null,
				category:null,
				text:'',
				color:'',
				con:'myContent'
			}
		},
		methods:{
			handleCommand(category){
				this.category=category;
				this.pageSize=10;
				this.pageNum=1
				this.getList()
			},
			getList(){
				this.$http.get(
					this.ports+'/runtime/tasks/front-end/'+this.type,
					{
						pageSize:this.pageSize,
						pageNum:this.pageNum,
						category:this.category
					},
					data=>{
						console.log(data)
						this.list=data.rows;
						this.total=data.total
					},
					this
				)
			},
			currentChange(currentPage){
				this.pageNum=currentPage
				this.getList()
			},
			nodeChange(data){
				this.type=data.id
				 if(this.type=='todo'){
					this.text='处理'
					this.con='myContent'
					this.color='#fdb278'
					this.getList()
				}else if(this.type=='done'){
					this.text='已处理'
					this.con='myContent'
					this.color='#9ee2cd'
					this.getList()
				}else if(this.type=='claim'){
					this.text='签收'
					this.con='myContent'
					this.color='#409EFF'
					this.getList()
				}else if(this.type=='asked'){
					this.text='已托办'
					this.con='myContent'
					this.color='#F56C6C'
					this.getList()
				}else if(this.type=='runProcess'){
					this.text='运行中的流程'
					this.con='runTable'
					this.color='#F56C6C'
				}else if(this.type=='hiProcess'){
					this.text='历史流程'
					this.con='historyTable'
					this.color='#F56C6C'
				}
				
			},
			submit(){
				this.getList()
			}
        },
		props:['ports','tourl'],
        components:{
            navTree,
            myContent,
            runTable,
            historyTable
        },
        created(){
        	this.$store.commit('set_ports',this.ports)
        }
	}
</script>