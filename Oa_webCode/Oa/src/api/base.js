import axios from 'axios'
axios.defaults.withCredentials=true;
export default {
  get: (url, param, callback,this_) => {
    axios.get(url, {
      params: param
    }).then(res => {
      let data = res.data
      if (data.status==200) {
        if (callback) {
          try {
            callback(data.data)
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        if(this_){
          this_.$alert(data.message, '错误提示', {
            confirmButtonText: '确定'
          });
        }else{
          alert(data.message)
        }
      }
    })
  },
  put:(url, data, callback,this_) => {
    let qs = require('qs')
    axios.put(url, data, {
      params: {}
    }).then(res => {
      let data = res.data
      if (data.status==200) {
        if (callback) {
          try {
            callback(data.data)
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        if(this_){
          this_.$alert(data.message, '错误提示', {
            confirmButtonText: '确定'
          });
        }else{
          alert(data.message)
        }
      }
    })
  },
  delete:(url, data, callback,this_) => {
    let qs = require('qs')
    axios.delete(url, {
      data: qs.stringify(data)
    }).then(res => {
      let data = res.data
      if (data.status==200) {
        if (callback) {
          try {
            callback(data.data)
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        if(this_){
          this_.$alert(data.message, '错误提示', {
            confirmButtonText: '确定'
          });
        }else{
          alert(data.message)
        }
      }
    })
  },
  post: (url, data, callback,this_) => {
    let qs = require('qs')
    axios.post(url, qs.stringify(data), {
      params: {}
    }).then(res => {
      let data = res.data
      if (data.status==200) {
        if (callback) {
          try {
            callback(data.data)
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        if(this_){
          this_.$alert(data.message, '错误提示', {
            confirmButtonText: '确定'
          });
        }else{
          alert(data.message)
        }
      }
    })
  },
  post_noqs: (url, data, callback,this_) => {
    let qs = require('qs')
    axios.post(url, data, {
      params: {}
    }).then(res => {
      let data = res.data
      if (data.result) {
        if (callback) {
          try {
            callback(data.model,data.message)
          } catch (e) {
            console.log(e)
          }
        }
      } else {
        if(this_){
          this_.$alert(data.message, '错误提示', {
            confirmButtonText: '确定'
          });
        }else{
          alert(data.message)
        }
      }
    })
  }
}
