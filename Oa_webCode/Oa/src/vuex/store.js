
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new  Vuex.Store({
    state:{
        isLog:true,//是否打印日志
        ports:null,
        isLoading:false,
        userList:[],
        typeList:[],
        flowPorts:null,
        companyId:null,
        userId:null,
        userName:'',
        userImg:'',
        companyName:'',
        companyEnglish:'',
        companyLogo:''
    },
    mutations:{
       setUserName:(state,data)=>{state.userName = data},
       setUserImg:(state,data)=>{state.userImg = data},
       setCompanyName:(state,data)=>{state.companyName = data},
       setCompanyEnglish:(state,data)=>{state.companyEnglish = data},
       setCompanyLogo:(state,data)=>{state.companyLogo = data},
        print(state,str){//输出日志
             if(state.isLog){
                 console.log(str);//打印
             }
        },
        set_ports:(state,ports)=>{
            state.ports=ports
        },
        set_flowPorts:(state,ports)=>{
            state.flowPorts=ports
        },
        setCompanyId:(state,companyId)=>{
            state.companyId=companyId
        },
        setUserId:(state,userId)=>{
            state.userId=userId
        },
        loading:(state)=>{
            state.isLoading=true
        },
        cancelLoad:(state)=>{
            state.isLoading=false
        },
        setUserList:(state,data)=>{
            state.userList=data
        },
        setTypeList:(state,data)=>{
            state.typeList=data
        },
    },
    getters:{
        getUserName:(state) => state.userName,
        getUserImg:(state) => state.userImg,
        getCompanyName:(state) => state.companyName,
        getCompanyEnglish:(state) => state.companyEnglish,
        getCompanyLogo:(state) => state.companyLogo
    }
})
