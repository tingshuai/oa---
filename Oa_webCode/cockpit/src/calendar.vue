<template>
  <div class="fullCalendar">
      <div id='calendar' @click="dome($event)"></div>
       <my-toast :config="config" @submit="sure" @cancel="config.dialogVisible=false" @delete="del">
            <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm" style="margin:0 40px;"> 
                <el-form-item prop="title" label="日程标题">
                    <el-input  v-model="form.title" placeholder="请输入日程标题"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="colorLevel" label="日程等级">
                            <el-select v-model="form.colorLevel" placeholder="">
                            <el-option v-for="val in 10" :key="val" :label="'等级'+val" :value="val"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="显示颜色">
                            <el-color-picker t placeholder="选择时间" v-model="form.color" ></el-color-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="start" label="日程开始时间">
                            <el-time-picker
                                placeholder="起始时间"
                                @blur="handlerBlur"
                                editable
                                v-model="form.start">
                            </el-time-picker>
                            <!-- <el-date-picker  type="datetime" placeholder="选择时间" v-model="form.start" style="width: 100%;"></el-date-picker> -->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="end" label="日程结束时间">
                            <!-- <el-date-picker  type="datetime" placeholder="选择时间" v-model="form.end" style="width: 100%;"></el-date-picker> -->
                            <el-time-picker
                                placeholder="结束时间"
                                v-model="form.end"
                                editable
                                :picker-options="{
                                minTime:form.start
                                }">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                      <el-form-item  label="">
                            <el-checkbox v-model="form.allDay">全天</el-checkbox>
                            <el-checkbox v-model="form.isCycle" @change="handlerChange">重复</el-checkbox>
                            <div class="cycle-con" v-show="form.isCycle">
                                <div>
                                    <span>重复</span>
                                    <el-select size="small" v-model="form.cycleType" placeholder="请选择">
                                        <el-option label="日" value="day"></el-option>
                                        <el-option label="周" value="week"></el-option>
                                        <el-option label="月" value="month"></el-option>
                                        <el-option label="年" value="year"></el-option>
                                    </el-select>
                                    <span style="margin-left:20px;">频率</span>
                                    <el-input-number :min="1" :controls="false" size="small" v-model="form.cycleFrequency" style="width:100px;" placeholder=""></el-input-number>
                                    <span>次</span>
                                </div>
                                <div style="margin-top:15px;" v-if="form.cycleType=='week'">
                                    <el-checkbox-group v-model="form.cycleWeeks" >
                                        <el-checkbox v-for="i in 7" :label="i.toString()" :key="i">{{week[i-1]}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div style="margin-top:15px;">
                                    <span>结束</span>
                                    <el-date-picker
                                        clearable
                                        size="small"
                                        v-model="form.cycleDeadline"
                                        type="datetime"
                                        placeholder="永不">
                                    </el-date-picker>
                                </div>
                                <div  style="margin-top:15px;" v-if="form.cycleType&&form.cycleFrequency">
                                    <!-- {{form.cycleFrequency}} -->
                                    <span>结果</span>
                                    <span style="font-size:14px;color:#999;">每{{form.cycleFrequency}}{{setCycleType(form.cycleType)}}</span>
                                </div>
                            </div>
                        </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="是否闹铃">
                    <el-switch
                        v-model="form.needAlarm"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>
                <el-form-item label="通知类型">
                    <el-checkbox-group v-model="form.alarmType">
                        <el-checkbox label="SMS">短信</el-checkbox>
                        <el-checkbox label="MSG">平台消息</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
                <!-- <el-button @click="config.dialogVisible = false">取 消</el-button> -->
                <!-- <el-button type="primary" @click="del('ruleForm')" v-if="title=='编辑日程'">删除</el-button> -->
                <!-- <el-button type="primary" @click="sure('ruleForm')">确 定</el-button> -->
       </my-toast>
    </div>
</template>
<script>
import '../static/date.js'
export default {
    data(){
        var validate = (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请输入日常结束时间'));
            } else if (value<= this.form.start) {
                callback(new Error('开始时间不能大于结束时间!'));
            } else {
                callback();
            }
        };
        return{ 
            // title:'',
            week:['周日','周一','周二','周三','周四','周五','周六'],
            dateType:'month',
            isShow:true,
            calendar:null,
            form:{},
            events:[],
            config:{
               title:'',
               dialogVisible:false,
               width:'800px',
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
            rules:{
                start:[{ required: true, message: '请选择时间', trigger: 'blur' }],
                end:[{ validator: validate, trigger: 'blur' },{ required: true, message: '请选择时间', trigger: 'blur' }],
                title:[{ required: true, message: '请选择时间', trigger: 'blur' }]
            }
        }
    },
    methods:{
        handlerBlur(){
            this.form.end=this.form.start
        },
        handlerChange(data){
            if(!data){
                this.form.cycleType=null;
                this.form.cycleFrequency=null;
                this.form.cycleDeadline=null;
                this.form.cycleWeeks=[]
            }
        },
        setCycleType(type){
            if(type=='year'){
                return '年'
            }else if(type=='month'){
                return '月'
            }else if(type=='week'){
                return '周'
            }else if(type=='day'){
                return '日'
            }
        },
        del(){
            var self=this
            this.$http.post(
                this.ports+'/calendar/'+this.form.id+'/delete',
                {},
                data=>{
                      self.calendar.fullCalendar('removeEvents',[self.form.id]);
                      self.config.dialogVisible=false
                      this.$message('删除成功')
                },
                this
            )
        },
        sure(){
               this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    if(this.form.id==0){
                        delete this.form.id
                        var param=Object.assign({},this.form)
                        param.startAt=new Date().GMTToStr(param.start)
                         param.endAt=new Date().GMTToStr(param.end)
                         param.cycleWeeks=param.cycleWeeks.join(',')
                        this.$http.post(
                            this.ports+'/calendar/save',
                            param,
                            data=>{
                                this.config.dialogVisible=false
                                this.getData()
                            },
                            this
                        )
                    }else{
                        var param=Object.assign({},this.form)
                        param.startAt=new Date().GMTToStr(param.start)
                         param.endAt=new Date().GMTToStr(param.end)
                         param.cycleWeeks=param.cycleWeeks.join(',')
                        this.$http.post(
                            this.ports+'/calendar/edit',
                            param,
                            data=>{
                                this.config.dialogVisible=false
                                this.getData()
                            },
                            this
                        )
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
        },
        dome(e){
           if($(e.target).html()=='周'){
               this.dateType='week';
               this.getData();
           }else if($(e.target).html()=='月'){
               this.dateType='month';
               this.getData();
           }else if($(e.target).html()=='日'){
               this.dateType='day';
               this.getData();
           }else if($(e.target).hasClass('fc-icon')||$(e.target).children().hasClass('fc-icon')){      
               console.log('1')       
               this.getData()
           }else if($(e.target).html()=='今天'){
               console.log('2')
               this.getData();
           }else{
               return false
           }
        },
        getData(){
            var date = new Date().GMTToStrDate(this.calendar.fullCalendar('getDate')._d);
            this.$http.get(
                this.ports+'/calendar',
                {
                    dateType:this.dateType,
                    startAt:date,
                },
                data=>{
                    this.calendar.fullCalendar('removeEvents')
                    // console.log(this.calendar.fullCalendar('removeEventSource'))
                    this.calendar.fullCalendar( 'renderEvents',data )
                },
                this
            )
        }
    },
    props:['ports'],
    mounted(){
        var date = new Date().GMTToStrDate(new Date());
        console.log(date)
        var self=this
        this.$http.get(this.ports+'/calendar',{
            dateType:this.dateType,
            startAt:date,
        },data=>{
            self.calendar =$('#calendar').fullCalendar({
                header: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'month,agendaWeek,agendaDay'
                },
                aspectRatio:2.5,
                navLinks: false, 
                selectable: true,
                selectHelper: true,
                // editable: true,
                eventLimit: true,
                select: function(start, end, allDay) {
                    console.log(start._i)
                    self.config.title='新增日程'
                    self.config.btnData=[
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
                    self.form={
                        title:'',
                        start:new Date(start._i),
                        end:new Date(start._i),
                        id:0,
                        allDay:true,
                        color:'',
                        isCycle:false,
                        alarmType:'',
                        needAlarm:false,
                        cycleType:null,
                        cycleFrequency:null,
                        cycleDeadline:null,
                        cycleWeeks:[],
                        colorLevel:null,
                    }
                    self.config.dialogVisible=true
                    self.calendar.fullCalendar('unselect');
                },
                eventClick: function(event, jsEvent, view) {
                    console.log(event)
                    self.config.btnData=[
                        {
                            type:'primary',
                            method:'submit',
                            name:'确定',

                        },
                        {
                            type:'',
                            method:'cancel',
                            name:'取消',

                        },{
                            type:'',
                            method:'delete',
                            name:'删除'
                        }
                    ]
                     self.form={
                        title:event.title,
                        start:event.start?new Date(event.start._i):null,
                        end:event.end?new Date(event.end._i):null,
                        id:event.id,
                        allDay:event.allDay,
                        color:event.color,
                        isCycle:event.isCycle,
                        alarmType:event.alarmType,
                        needAlarm:event.needAlarm,
                        cycleType:event.cycleType,
                        cycleFrequency:event.cycleFrequency,
                        cycleDeadline:event.cycleDeadline,
                        cycleWeeks:event.cycleWeeks?event.cycleWeeks.split(','):[],
                        colorLevel:event.colorLevel
                    }
                    self.config.title='编辑日程'
                     self.config.dialogVisible=true
                },
                eventDrop:function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ) {
                    self.$set(self.form,'title',event.title)
                    self.$set(self.form,'start',new Date(event.start).getTime())
                    self.$set(self.form,'end',new Date(event.end).getTime())
                    self.$set(self.form,'id',event.id)
                    self.$set(self.form,'color',event.color)
                    self.$ajax.post(self.ports+'/edit',qs.stringify(self.form),{
                        params: {}
                    }).then(res => {
                        var data=Object.assign({},this.form)
                        data.start=new Date(data.start)
                        data.end=new Date(data.end)
                        this.calendar.fullCalendar('removeEvents',[data.id]);
                        this.calendar.fullCalendar('renderEvent',
                            data,
                            true // make the event "stick"
                        );
                        this.config.dialogVisible=false
                    })
                },
                events:data
            });
        },self) 
    }
}
</script>
<style lang="less">
    .fullCalendar{
       padding:20px;
       .cycle-con{
           width:553px;
            height:200px;
            border:1px solid #E5E5E5;
            padding: 20px;
       }
    }
     #calendar {
        margin: 0 auto;
    }
</style>

