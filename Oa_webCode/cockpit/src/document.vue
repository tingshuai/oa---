<template>
    <div class="document">
        <div class="my-container">
            <div class="dir">
                <dir-tree :ports="ports" @getList="getList"></dir-tree>
            </div>
            <div class="file">
                <div class="doc-top">
                    <el-button  size="small" @click="upload"  v-if="titles[0].name=='文档库'||currentId=='document'"><span>上传文件</span></el-button>
                    <el-button  size="small" @click="create"  v-if="titles[0].name=='文档库'||currentId=='document'"><span>创建目录</span></el-button>
                    <el-input placeholder="请输入内容" class="my-search" v-model="searchValue" size="small" style="width:240px;">
                        <el-button slot="append" type="primary" @click="search">搜索</el-button>
                    </el-input>
                    <div class="spareRate right">
                        <span>空间容量</span>
                        <div>
                            <el-progress  :stroke-width="18" :percentage="precent" ></el-progress>
                            <p class="right">{{spaceUsedSize}}/{{spaceInitSize}}</p>
                        </div>
                    </div>
                </div>
                <div class="doc-content">
                    <div class="doc-content-title">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item v-for="item in titles"><a @click="goTo(item.id)">{{item.name}}</a></el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="doc-content-container no-scroll">
                        <div class="doc-content-list">
                            <div class="list-item" @mouseenter="enterData=item" @mouseleave="enterData=null" :class="{selected:item==enterData||item==selectData}" @dblclick.prevent="enterFloder(item.id,item.name)" @click.stop.prevent="select(item)" v-for="(item,index) in folders">
                                <div class="list-item-icon">
                                    <img src="http://124.160.96.135:8070/appSign/qwertyuiop.png" alt="">
                                </div>
                                <div class="list-item-name"><span class="text">{{item.name}}</span><el-input @blur="handlerDirBlur($event,item)" class="editText" style="width:216px" v-model="item.name"  size="mini"></el-input></div>
                                <div class="list-item-menu" v-show="enterData==item">
                                    <i class="iconfont icon-jiaohuan" v-if="titles[0].name!='文档'" @click.stop="move(index,'floder',item.id)"></i>
                                    <i class="iconfont icon-bianji" v-if="titles[0].name!='文档'" @click.stop="handlerDirEdit($event)"></i>
                                    <i class="iconfont icon-shanchu" v-if="titles[0].name!='文档'" @click.stop="handlerDirDel(index,item.id)"></i>
                                </div>
                                <div class="list-item-date">
                                    {{item.modifyTime}}
                                </div>
                            </div>
                        </div>
                        <div class="doc-content-list">
                            <div class="list-item" @mouseenter="enterData=item" @mouseleave="enterData=null" :class="{selected:item==enterData||item==selectData}"  @click.stop.prevent="select(item)" v-for="(item,index) in files">
                                <div class="list-item-icon">
                                    <img :src="ports+item.icon" alt="">
                                </div>
                                <div class="list-item-name"><span  class="text">{{item.fileName}}<el-tag style="margin-left:10px;" type="success" v-for="val in item.tags">{{val}}</el-tag></span></div>
                                <div class="list-item-menu" v-show="enterData==item">
                                    <i class="iconfont icon-wujiaoxing" :style="{'color':item.followed?'#ec6a1a':'#666'}" v-if="titles[0].name=='文档库'||titles[0].name=='文档'&&currentId=='document'" @click="like(item,index)"></i>
                                    <i class="iconfont icon-xiazai" @click="downLoad(item.fileId)" ></i>
                                    <i class="iconfont icon-jiaohuan1"  v-if="titles[0].name=='文档库'||titles[0].name=='文档'&&currentId=='document'" @click.stop="move(index,'file',item.id)"></i>
                                    <i class="iconfont icon-fenxiang"  v-if="titles[0].name=='文档库'||titles[0].name=='文档'&&currentId=='document'||titles[0].name=='分享的文档'||titles[0].name=='文档'&&currentId=='shareDoc'" @click.stop="handlerShare(item,index)"></i>
                                    <i class="iconfont icon-shanchu"  v-if="titles[0].name=='文档库'||titles[0].name=='文档'&&currentId=='document'" @click.stop="handlerFileDel(index,item.id)"></i>
                                </div>
                                <div class="list-item-date">
                                    {{item.modifyTime}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 上传 -->
        <upload-form :config="uploadConfig" :formData="formData" @uploadSuccess="uploadSuccess" ></upload-form>
        <!-- 创建目录 -->
        <create-form :config="createConfig" :formData="createFormData" @createSuccess="createSuccess"></create-form>
        <!-- 目录选择 -->
        <dir-form :config="dirConfig"  :formData="dirFormData" @successMove="successMove"></dir-form>
        <!-- 分享 -->
        <share-form :config="shareConfig" :formData="shareFormData" @successShare="successShare"></share-form>
    </div>
</template>
<script>
import uploadForm from './components/document/uploadForm.vue'
import createForm from './components/document/cearteForm.vue'
import dirForm from './components/document/dirForm.vue'
import shareForm from './components/document/shareForm.vue'
import dirTree from './components/document/dirTree.vue'
import  {mapState} from 'vuex'
export default {
    data(){
        return{
            precent:0.0,
            // 当前可用空间
            spaceInitSize:0,
            // 当前已使用空间
            spaceUsedSize:0,
            fileUrl:'/libraries/files',
           searchValue:'',
           titles:[{
               name:'文档',
               id:0
            }],
           folders:[],
           files:[],
           selectData:null,
           enterData:null,
           uploadConfig:{
               title:'上传文件',
               dialogVisible:false,
               width:'384px',
               btnData:[
                   {
                       type:'primary',
                       method:'submit',
                       name:'确定',

                   },
                    {
                       type:'',
                       method:'cancel',
                       name:'取消',

                   }
               ]
           },
           createConfig:{
               title:'创建目录',
               dialogVisible:false,
               width:'384px',
               btnData:[
                   {
                       type:'primary',
                       method:'submit',
                       name:'确定',

                   },
                    {
                       type:'',
                       method:'cancel',
                       name:'取消',

                   }
               ]
           },
           dirConfig:{
               title:'目录选择',
               dialogVisible:false,
               width:'384px',
               treeData:[],
               btnData:[
                   {
                       type:'primary',
                       method:'submit',
                       name:'确定',

                   },
                    {
                       type:'',
                       method:'cancel',
                       name:'取消',

                   }
               ]
           },
           formData:{
               dirId:'',
               tags:[],
               beSharedUserIds:[],
               companyId:'',
               userId:''
           },
           createFormData:{
               name:'',
               managerId:''
           },
           dirFormData:{
               id:''
           },
           shareConfig:{
               index:-1,
               title:'文档分享',
               dialogVisible:false,
               width:'384px',
               btnData:[
                   {
                       type:'primary',
                       method:'submit',
                       name:'确定',

                   },
                    {
                       type:'',
                       method:'cancel',
                       name:'取消',

                   }
               ]
           },
           shareFormData:{
               fileName:'',
               beSharedUserIds:[]
           },
           currentPage:1,
           canHttp:true,
           currentId:0,
           selectIndex:-1,
           treeData:[{
               name:'文档',
               id:0,
           }]
        }
    },
    props:['ports','companyId','userId'],
    methods:{
        // 获取空间
        getSpace(){
            this.$http.get(
                this.ports+'/libraries/spaces/info',
                {},
                data=>{
                  console.log(data,'0----')
                    this.spaceInitSize=data.spaceInitSize;
                    this.spaceUsedSize=data.spaceUsedSize;
                    this.precent=data.percentage
                },
                this
            )
        },
        // 分享成功
        successShare(data){
            this.files[this.shareConfig.index].beSharedUserIds=data.beSharedUserIds
        },
        // 新建成功
        createSuccess(data){
            console.log(data)
            this.folders.unshift(data)
        },
        // 进入文件夹
        enterFloder(id,name){
            this.currentId=id
            this.currentPage=1
            if(typeof(id)!='string'||id=='document'){
                this.getFloder(id,(data)=>{
                    this.folders=data
                    this.titles.push({name:name,id:id})
                })
            }else{
                 this.folders=[]
                 this.titles.push({name:name,id:id})
            }
                
            this.getFile(id,this.currentPage,(data)=>{
                this.files=data.rows
            })
        },
        getFloder(id,callback){
            if(typeof(id)=='string'){
                id=0
            }
            this.$http.get(
                this.ports+'/libraries/directories',
                {parentId:id,isType:false,keywords:this.searchValue},
                data=>{
                    console.log(data,'-------------')
                    callback(data.rows)
                },
                this
            )
        },
        search(){
            this.currentPage=1
            this.getFile(this.currentId,this.currentPage,(data)=>{
                this.files=data.rows
            })
            if(this.titles[0].name=='文档库'){
                this.getFloder(this.currentId,(data)=>{
                this.folders=data
              })
            }
            
        },
        getFile(id,currentPage,callback){
            if(typeof(id)=='string'){
                id=0
            }
            this.$http.get(
                this.ports+this.fileUrl,
                {dirId:id,pageNum:currentPage,pageSize:20,keywords:this.searchValue},
                data=>{
                    callback(data)
                },
                this
            )
        },
        select(item){
            this.selectData=item
        },
        // 前往导航页面
        goTo(id){
            if(this.titles[0].name=='文档'){
                this.files=[]
                this.folders=[
                        {
                            name:'文档库',
                                id:'document',
                        },
                        {
                            name:'分享的文档',
                            id:'shareDoc'
                        },
                        {
                            name:'关注的文档',
                            id:'aim'
                        },
                        {
                            name:'共享给我的文档',
                            id:'shareMe'
                        }
                    ]
                    this.titles=[{
                        name:'文档',
                        id:0
                    }]
            }else{
                var index=this.titles.findIndex(val=>val.id==id)
                this.titles=this.titles.slice(0,index+1)
                if(typeof(id)=='string'){
                    id=0
                }
                this.currentId=id
                this.currentPage=1
                this.getFloder(id,(data)=>{
                    this.folders=data
                })
                this.getFile(id,this.currentPage,(data)=>{
                    this.files=data.rows
                })
            }
            
        },
        // 点击上传按钮
        upload(){
            console.log(this.formData)
            this.formData={
               dirId:typeof(this.currentId)=='string'?0:this.currentId,
               tags:[],
               beSharedUserIds:[],
               companyId:this.companyId,
               userId:this.userId,
               upVer:false
           }
           console.log(this.formData,'----')
           this.uploadConfig.dialogVisible=true
        },
        create(){
            this.createConfig.dialogVisible=true
            this.createFormData={
               name:'',
            //    managerId:'',
               parentId:typeof(this.currentId)=='string'?0:this.currentId,
               isType:false
           }
        },
        move(index,type,id){
            this.type=type
            this.selectIndex=index
            var currentDirId=0
            if(typeof(this.currentId)!='string'){
                currentDirId=this.currentId
            }
            this.$http.get(
                this.ports+'/libraries/directories/front-end/tree',
                {dirId:id,currentDirId:currentDirId},
                data=>{
                    this.dirFormData.currentDirId=id
                    this.dirConfig.dialogVisible=true
                    this.dirConfig.treeData=data
                }
            )
        },
        successMove(id){
            if(this.type=='file'){
                this.$http.post(
                    this.ports+'/libraries/files/move/'+this.dirFormData.currentDirId+'/'+id,
                    {},
                    data=>{
                        this.$message({
                            message: '移动成功',
                            type: 'success'
                        });
                         this.files.splice(this.selectIndex,1)
                    },
                    this
                )
            }else{
                this.$http.post(
                    this.ports+'/libraries/directories/edit',
                   {parentId:id,diriId:this.dirFormData.currentDirId},
                    data=>{
                        this.$message({
                            message: '移动成功',
                            type: 'success'
                        });
                        this.folders.splice(this.selectIndex,1)
                    },
                    this
                ) 
            }
            this.dirConfig.dialogVisible=false
        },
        handlerDirEdit(e){
            e.stopPropagation()
            $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','inline-block').children('input').focus()
            $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','none')
        },
        handlerDirBlur(e,data){
            e.stopPropagation()
            $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','none')
            $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','inline-block')
            var param={
                ...data,
                parentId:typeof(this.currentId)=='string'?0:this.currentId
            }
            this.$http.post(
                this.ports+'/libraries/directories/edit',
                param,
                data=>{
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                },
                this
            ) 
        },
        handlerDirDel(index,id){
            this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(
                        this.ports+'/libraries/directories/delete/'+id,
                        {},
                        data=>{
                          this.$message({
                              type: 'success',
                              message: '删除成功!'
                          });
                          this.folders.splice(index,1)
                        },
                        this
                    )
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },
        // handlerFileEdit(e){
        //     e.stopPropagation()
        //     $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','inline-block').children('input').focus()
        //     $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','none')
        // },
        // handlerFileBlur(e,data){
        //     e.stopPropagation()
        //     $(e.target).parents('.list-item').children('.list-item-name').children('.editText').css('display','none')
        //     $(e.target).parents('.list-item').children('.list-item-name').children('.text').css('display','inline-block')
        //     var param={
        //         ...data,
        //         parentId:this.currentId
        //     }
        //     this.$http.post(
        //         this.ports+'/libraries/directories/edit',
        //         param,
        //         data=>{
        //             this.$message({
        //                 message: '编辑成功',
        //                 type: 'success'
        //             });
        //         },
        //         this
        //     ) 
        // },
        handlerFileDel(index,id){
            this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post(
                        this.ports+'/libraries/files/delete/'+id,
                        {},
                        data=>{
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.files.splice(index,1)
                        },
                        this
                    )
                    
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                });          
            });
        },
        downLoad(id){
            if (typeof (this.downLoad.iframe) == "undefined") {
                var iframe = document.createElement("iframe");
                this.downLoad.iframe = iframe;
                document.body.appendChild(this.downLoad.iframe);
            }
                // alert(download_file.iframe);
            this.downLoad.iframe.src =this.ports+'/libraries/files/download/'+id;
            console.log(this.downLoad.iframe.src)

            this.downLoad.iframe.style.display = "none";
        },
        like(item,index){
            console.log(item.followed)
            if(!item.followed){
                this.$http.post(
                    this.ports+'/libraries/follow/'+item.id,
                    {},
                    data=>{
                        this.$message('已关注')
                        this.files[index].followed=!this.files[index].followed
                    },
                    this
                )
            }else{
                this.$http.post(
                    this.ports+'/libraries/unfollow/'+item.id,
                    {},
                    data=>{
                        this.$message('已取消关注')
                        this.files[index].followed=!this.files[index].followed
                    },
                    this
                )
            }
            
        },
        handlerShare(data,index){
            console.log(data)
            this.shareConfig.dialogVisible=true
            this.shareConfig.index=index
            this.shareFormData={
                fileName:data.fileName,
                beSharedUserIds:data.beSharedUserIds,
                fileId:data.id
            }
        },
        uploadSuccess(res,data){
            if(res.status==200){
              if(!data.upVer){
                this.files.unshift(res.data)
              }else{
                var index=this.files.findIndex(val=>val.id==res.data.id)
                this.files[index].modifyTime=res.data.modifyTime
                this.$set(this.files[index],'tags',res.data.tags)
              }
            }
        },
        getList(selectNode){
            this.searchValue='';
            this.currentPage=1;
            this.folders=[];
            this.files=[];
            this.titles=[selectNode];
            this.currentId=selectNode.id
            if(selectNode.id=='document'){
                this.fileUrl='/libraries/files',
                this.getFloder(0,(data)=>{
                    this.folders=data
                })
                this.getFile(0,this.currentPage,data=>{
                    this.files=data.rows
                })
            }else if(selectNode.id=='shareDoc'){
                this.fileUrl='/libraries/shares';
                this.getFile(0,this.currentPage,data=>{
                    this.files=data.rows
                })
            }else if(selectNode.id=='aim'){
                this.fileUrl='/libraries/follow';
                this.getFile(0,this.currentPage,data=>{
                    this.files=data.rows
                })
            }else if(selectNode.id=='shareMe'){
                this.fileUrl='/libraries/shares/others';
                this.getFile(0,this.currentPage,data=>{
                    this.files=data.rows
                })
            }else if(selectNode.id==0){
                this.files=[]
                this.folders=[
                        {
                            name:'文档库',
                                id:'document',
                        },
                        {
                            name:'分享的文档',
                            id:'shareDoc'
                        },
                        {
                            name:'关注的文档',
                            id:'aim'
                        },
                        {
                            name:'共享给我的文档',
                            id:'shareMe'
                        }
                    ]
            }else{
                this.fileUrl='/libraries/files',
                this.getFile(selectNode.id,this.currentPage,data=>{
                    this.files=data.rows
                })
            }
            
        }
    },
    components:{
        uploadForm,
        createForm,
        dirForm,
        shareForm,
        dirTree
    },
    mounted(){
        // setInterval(()=>{this.spaceUsedSize+=10},1000)
        var self=this
        $('.doc-content-container').scroll(function(){
            var $this =$(this);
            var viewH =$(this).height();//可见高度  
            var contentH =$(this).get(0).scrollHeight;//内容高度  
            var scrollTop =$(this).scrollTop();//滚动高度  
            console.log(viewH,contentH,scrollTop) 
            if(scrollTop/(contentH -viewH)>=0.98){
                if(self.canHttp){
                    self.canHttp=false;
                    self.currentPage++;
                    self.getFile(self.currentId,self.currentPage,(data)=>{
                        if(data.rows.length>0){
                            self.files=self.files.concat(data.rows)
                            self.canHttp=true
                        }else{
                            self.$messge.info('已加载全部')
                        }
                    })
                }
            }  
        })
        this.getSpace()
    },
    created(){
    	this.$store.commit('set_ports',this.ports)
    	this.$http.get(
	        this.ports+'/users',
	        {},
	        data=>{
	          console.log(data,'-----------------')
	            this.$store.commit('setUserList',data.rows)
	            // this.userList=data
	        },
	        this
	    )
    }
}
</script>

<style lang="less">
    .document{
        display: flex;
        flex-direction: column;
        height: 700px;
        .el-progress__text{
            font-size: 14px!important;
        }
        .my-container{
            height: 100%;
            display: flex;
            .dir{
                width: 220px;
                height: 100%;
                overflow: auto;
                background: #ECECEC;
                .el-tree{
                    background: none;
                    .el-tree-node__content{
                        height: 50px;
                    }
                }
            }
            .file{
                flex: 1;
                display: flex;
                flex-direction: column;
            }
        }
        .tags-content{
            >div{
                margin-right: 15px;
                float: left;
                position: relative;
                height: 20px;
                padding: 0px 10px;
                margin-bottom: 5px;
                font-size:14px;
                font-family:MicrosoftYaHei;
                &.noDefault{
                    color:rgba(42,147,255,1);
                }
                >i{
                    position: absolute;
                    top: 5px;
                    right: 0;
                    height: 14px;
                    cursor: pointer;
                }
            }
        }
        .doc-top{
            height: 40px;
            line-height: 40px;
            border-bottom: #E5E5E5 1px solid;
            padding: 20px;
            -webkit-box-sizing: content-box;
            -moz-box-sizing: content-box;
            box-sizing:content-box;
            >button{
                margin-left: 24px;
            }
            .spareRate{
            	width:280px;
            	display:flex;
            	>span{
            		position:relative;
            		top: -9px;
            		width:80px;
            	}
            	>div{
            		flex:1;
            	}
            }
            .my-search {
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
            padding: 0 32px;
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
                .doc-content-list{
                    .list-item{
                        &.selected{
                            background: #F6F6F6;
                        }
                        height: 60px;
                        border-bottom:1px solid #EEEEEE;
                        display: flex;
                        .list-item-icon{
                            width: 40px;
                            display: flex;
                            align-items: center;
                            margin-left: 10px;
                        }
                        .list-item-name{
                            flex: 1;
                            font-family:MicrosoftYaHei;
                            font-size:14px;
                            color:rgba(51,51,51,1);
                            line-height:60px;
                            height: 60px;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            .editText{
                                display: none;
                            }
                            .text{
                                display: inline;
                            }
                        }
                        .list-item-menu{
                            width:360px;
                            line-height:60px;
                            i{
                                cursor: pointer;
                                margin-left: 30px;
                                font-size: 18px;
                            }
                        }
                        .list-item-date{
                            padding-right: 10px;
                            line-height:60px;
                            font-size:14px;
                            font-family:ArialMT;
                            color:rgba(153,153,153,1);
                            line-height:64px;
                        }
                    }
                }
            }
            
        }
    }
</style>
