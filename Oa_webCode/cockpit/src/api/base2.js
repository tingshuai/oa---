import axios from 'axios'
export default {
  get: (url, param, callback,this_) => {
    console.log(url)
    console.log(param)
    axios.get(url, {
      params: param
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
  },
  post: (url, data, param, callback,this_) => {
    console.log(url)
    console.log(data)
    let qs = require('qs')
    axios.post(url, qs.stringify(data), {
      params: param
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
  },
  post_noqs: (url, data, param, callback,this_) => {
    let qs = require('qs')
    console.log(url)
    console.log(data)
    axios.post(url, data, {
      params: param
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
