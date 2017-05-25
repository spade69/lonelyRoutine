function func(drag,context){
    var timer=null,begin=new Date();
    return function(){
        var context=this,args=arguments,current=new Date();
        clearTimeout(timer);
        if(current-begin>=100){
            drag.apply(context,args);
            begin=current;
        }
    }else{
        timer=setTimeout(function(){
            method.apply(context,args);
        })
    }

}