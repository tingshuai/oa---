<template>
    <div class="document">
        <div class="doc-top">
            <el-button  size="small" @click="upload" :disabled="currentId==0"><img src="../assets/img/1 (4).png" alt=""><span>上传文件</span></el-button>
            <el-button  size="small" @click="create"><img src="../assets/img/1 (5).png" alt=""><span>创建分类</span></el-button>
            <el-input placeholder="请输入内容" class="search" v-model="searchValue" size="small" style="width:240px;">
                <el-button slot="append" type="primary" @click="search">搜索</el-button>
            </el-input>
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
                        <div class="list-item-name"><span class="text" style="cursor:pointer">{{item.name}}</span><el-input @blur="handlerDirBlur($event,item)" class="editText" style="width:216px" v-model="item.name"  size="mini"></el-input></div>
                        <div class="list-item-menu" v-show="enterData==item">
                            <img  @click.stop="move(index,'floder',item.id)" src="../assets/img/1 (9).png" alt="">
                            <img @dblclick.stop="()=>{return false}" @click.stop="handlerDirEdit($event)" src="../assets/img/1 (10).png" alt="">
                            <img @dblclick.stop="()=>{return false}" @click.stop="handlerToSee(item,index)"  src="../assets/img/1 (2).png" alt="">
                            <img @dblclick.stop="()=>{return false}" @click.stop="handlerDirDel(index,item.id)" src="../assets/img/1 (6).png" alt="">
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
                        <div class="list-item-name"><span style="cursor:pointer;"  class="text">{{item.fileName}}<el-tag style="margin-left:10px;" type="success" v-for="val in item.tags">{{val}}</el-tag></span></div>
                        <div class="list-item-menu" v-show="enterData==item">
                            <!-- <img src="../assets/img/1 (3).png" alt=""> -->
                            <img @click="downLoad(item.id)" src="../assets/img/1 (8).png" alt="">
                            <img  @click.stop="move(index,'file',item.id)" src="../assets/img/1 (9).png" alt="">
                            <!-- <img @click.stop="handlerFileEdit($event)"  src="../assets/img/1 (10).png" alt=""> -->
                            <img @click.stop="handlerShare(item,index)"  src="../assets/img/1 (2).png" alt="">
                            <img @dblclick.stop="()=>{return false}" @click.stop="handlerFileDel(index,item.id)" src="../assets/img/1 (6).png" alt="">
                        </div>
                        <div class="list-item-date">
                            {{item.modifyTime}}
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
        <share-form :config="shareConfig" :formData="shareFormData" @shareSuccess="shareSuccess"></share-form>
    </div>
</template>
<script>
import uploadForm from '../component/document/uploadForm.vue'
import createForm from '../component/document/cearteForm.vue'
import dirForm from '../component/document/dirForm.vue'
import shareForm from '../component/document/shareForm.vue'
import  {mapState} from 'vuex'
export default {
    data(){
        return{
           searchValue:'',
           titles:[{
               name:'文档库',
               id:0
           }],
           list:[],
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
               title:'创建分类',
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
               folderId:[],
               tags:[],
               beSharedUserIds:[]
           },
           createFormData:{
               name:'',
               managerId:''
           },
           dirFormData:{
               id:''
           },
            shareConfig:{
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
           selectDirId:-1
        }
    },
    computed:{
        ...mapState({
            ports:'ports',
            companyId:'companyId',
            userId:'userId'
        })
    },
    methods:{
      handlerToSee(item,index){
        console.log(item)
          this.shareConfig.dialogVisible=true
          this.shareConfig.index=index
          this.shareConfig.type='dir'
          this.shareFormData={
              fileName:item.name,
              beSharedUserIds:item.beSharedUserIds,
              fileId:item.id
          }
      },
      shareSuccess(data){
        console.log(data)
        var arr=[]
        arr=Object.assign([],data.beSharedUserIds)
        if(this.shareConfig.type=='file'){
            this.$http.post(
              this.ports+'/libraries/shares',
              {fileId:data.fileId,beSharedUserIds:arr.join(',')},
              res=>{
                console.log(data,this.shareConfig.index)
                  this.files[this.shareConfig.index].beSharedUserIds=data.beSharedUserIds
                  this.shareConfig.dialogVisible=false
                  this.$message({
                      message: '分享成功',
                      type: 'success'
                  });
              },
              this
          )
        }else{          this.$http.post(
            this.ports+'/libraries/directories/'+data.fileId+'/users',
            {userIds:arr.join(',')},
            res=>{
                this.$message({
                showClose: true,
                message: '设置成功',
                type: 'success'
                });
                this.folders[this.shareConfig.index].beSharedUserIds=arr
                this.shareConfig.dialogVisible=false
            },
            this
        )
        } 
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
            this.getFloder(id,(data)=>{
                this.folders=data
                this.titles.push({name:name,id:id})
            })
            this.getFile(id,this.currentPage,(data)=>{
                this.files=data.rows
            })
        },
        getFloder(id,callback){
            this.$http.get(
                this.ports+'/libraries/directories',
                {parentId:id,isType:true,keywords:this.searchValue},
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
            this.getFloder(this.currentId,(data)=>{
              this.folders=data
            })
        },
        getFile(id,currentPage,callback){
            this.$http.get(
                this.ports+'/libraries/files',
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
            this.currentId=id
            this.currentPage=1
            var index=this.titles.findIndex(val=>val.id==id)
            this.titles=this.titles.slice(0,index+1)
            this.getFloder(id,(data)=>{
                this.folders=data
            })
            if(id!=0){
                this.getFile(id,this.currentPage,(data)=>{
                    this.files=data.rows
                })
            }else{
                 this.files=[]
            }
            
        },
        // 点击上传按钮
        upload(){
            this.uploadConfig.dialogVisible=true
            this.formData={
               dirId:this.currentId,
               tags:[],
               beSharedUserIds:[],
               upVer:false,
               companyId:this.companyId,
               userId:this.userId
           }
        },
        create(){
            this.createConfig.dialogVisible=true
            this.createFormData={
               name:'',
               managerId:'',
               parentId:this.currentId,
               isType:true,
           }
        },
        move(index,type,id){
            this.type=type
            this.selectIndex=index
            this.$http.get(
                this.ports+'/libraries/directories/tree',
                {dirId:0,currentDirId:id,isType:true},
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
                   {parentId:id,id:this.dirFormData.currentDirId},
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
                parentId:this.currentId
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
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$http.post(
                        this.ports+'/libraries/directories/delete/'+id,
                        {},
                        data=>{
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
        handlerFileDel(index,id){
            this.$confirm('此操作将永久删除该文件夹, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.$http.post(
                        this.ports+'/libraries/files/delete/'+id,
                        {},
                        data=>{
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
        handlerShare(data,index){
            console.log(data)
            this.shareConfig.dialogVisible=true
            this.shareConfig.type='file'
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
        }
    },
    components:{
        uploadForm,
        createForm,
        dirForm,
        shareForm
    },
    mounted(){
        this.getFloder(0,(data)=>{
            this.folders=data
        })
        // this.getFile(0,this.currentPage,(data)=>{
        //     this.files=data.rows
        // })
        this.$http.get(
            this.ports+'/orgs/users/tree',
            {},
            data=>{
                this.treeData=data
            },
            this
        )
        var self=this
        $('.doc-content-container').scroll(function(){
            var $this =$(this),  
            viewH =$(this).height(),//可见高度  
            contentH =$(this).get(0).scrollHeight,//内容高度  
            scrollTop =$(this).scrollTop();//滚动高度   
            if(scrollTop/(contentH -viewH)>=0.98){   
                if(self.canHttp&&self.currentId!=0){
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
    }
}
</script>

<style lang="less">
    .document{
      .treeBox{
            height:500px;
            overflow:auto;
            padding:20px;
        }
        .userList{
            height:500px;
            border-left:2px solid #E5E5E5;
            padding: 15px;
            ul{
                li{
                    padding-left:40px;
                    height:50px;
                    line-height:50px;
                    span{
                        display:inline-block;
                        height:40px;
                        line-height:40px;
                        width:40px;
                        border-radius:50%;
                        background:#409EFF;
                        color:#fff;
                        text-align:center;
                        margin-right:20px;
                    }
                    &.select{
                        background:#F6F6F6;
                    }
                }
            }
        }
        display: flex;
        flex-direction: column;
        height: 100%;
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
                            height: 60px;
                            line-height: 60px;
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
                            img{
                                cursor: pointer;
                                margin-left: 30px;
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
