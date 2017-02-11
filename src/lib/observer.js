//If you want to make it a Global variable,just put it in a closure
/**
 * 
 * 
 var Event=(function(){
    var clientList=[],listen,trigger,remove;
    listen=function(){};
    trigger=function(){}
    remove=function(){}
    return{
        listen:listen,
        trigger:trigger,
        remove:remove
    }
 })();
 */
var Event={
    clientList:[],
    listen:function(key,fn){
        if(!this.clientList[key]){//消息列表:clientList数组
            //消息还有一个数组是存储每个订阅者的事件
            this.clientList[key]=[]; //也就是一个订阅者列表
        }
        this.clientList[key].push(fn);
    },
    trigger:function(){ //发布消息函数
        var key=Array.prototype.shift.call(arguments),//获取消息类型
            fns=this.clientList[key];//取出这个消息对应的所有处理函数
        if(!fns||fns.length===0){
            return false;
        }
        for(var i=0,fn;fn=fns[i++];){//挨个执行
            fn.apply(this,arguments);//arguments是trigger时带上的参数
        }
    },
    //取消订阅
    remove:function(key,fn){
        var fns=this.clientList[key];
        if(!fns){
            return false;
        }
        if(!fn){//如果没有传入具体的处理函数，表示需要取消key对应消息的所有订阅
            fns&&(fns.length=0); 
        }else{
            for(var l=fns.length-1;l>=0;l--){
                var _fn=fns[l];
                if(_fn===fn){
                    fns.splice(l,1); //删除订阅者的回调函数Array.prototype.splice
                }
            }
        }
    }
};
export default Event;
// var installEvent=function(obj){
//     for(var i in event){
//         obj[i]=event[i];
//     }
// }

// /