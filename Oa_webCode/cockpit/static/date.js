Date.prototype.GMTToStrDate=function(time) {
	if(time==''||time==null){
	    return ''
	}else {
	    let now = new Date(time);
	    let year = now.getFullYear(); //得到年份
	    let month = now.getMonth();//得到月份
	    let date = now.getDate();//得到日期

	    month = month + 1;
	    if (month < 10) month = "0" + month;
	    if (date < 10) date = "0" + date;
	    let times = "";
	    times = year + "-" + month + "-" + date;

	    return times
	}
}
Date.prototype.GMTToStr=function(time) {
	if(time==''||time==null){
	    return ''
	}else {
	    let now = new Date(time);
	    let year = now.getFullYear(); //得到年份
	    let month = now.getMonth();//得到月份
	    let date = now.getDate();//得到日期
	    let hour = now.getHours();//得到小时
	    let minu = now.getMinutes();//得到分钟
	    let sec = now.getSeconds();//得到秒
	    let MS = now.getMilliseconds();//获取毫秒
	    month = month + 1;
	    if (month < 10) month = "0" + month;
	    if (date < 10) date = "0" + date;
	    if (hour < 10) hour = "0" + hour;
	    if (minu < 10) minu = "0" + minu;
	    if (sec < 10) sec = "0" + sec;
	    if (MS < 100) MS = "0" + MS;
	    let times = "";
	    times = year + "-" + month + "-" + date + " " + hour + ":" + minu + ":" + sec;

	    return times
	}
}
Date.prototype.GMTToStrMonth=function(time) {
	if(time==''||time==null){
	    return ''
	}else {
	    let now = new Date(time);
	    let year = now.getFullYear(); //得到年份
	    let month = now.getMonth();//得到月份

	    month = month + 1;
	    if (month < 10) month = "0" + month;
	    let times = "";
	    times = year + "-" + month;

	    return times
	}
}