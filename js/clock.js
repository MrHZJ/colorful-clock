/**
 * Created by zhijun on 2017/12/19.
 */
/*获取元素*/
var hour = document.getElementById("hour");
var minute = document.getElementById("minute");
var second = document.getElementById("second");

/* 获取当前时间*/
var now = 0;
setInterval(function(){
    now = new Date();

    time(now);
},1000);

/*初始化时钟*/
makeNeedle();

/*时钟角度转换*/
function time(now){
    var h = now.getHours();
    var m = now.getMinutes();
    var s = now.getSeconds();

    /*秒针走的度数*/
    var roteta_s = s * (360 / 60);
    /* 分针走的度数+秒针走的度数*/
    var roteta_m = (m + s / 60) * 360 / 60 ;
    /* 时针走的度数+分针走的度数+秒针走的度数*/
    var roteta_h = (h % 12) * 360 / 12 + (m + s / 60) / 60 * 360 / 12;

    /*设置旋转*/
    hour.style.transform = "rotate("+Math.floor(roteta_h)+"deg)";
    minute.style.transform = "rotate("+Math.floor(roteta_m)+"deg)";
    second.style.transform = "rotate("+Math.ceil(roteta_s)+"deg)";
}
/*绘制刻度*/
function needle(){
    var str = '';
    for(var i = 0; i < 60 ; i ++){
        if(i % 5 == 0){
            str += "<div class='bigneedle'></div>"
        }else {
            str += '<div></div>'
        }
    }
    document.getElementById("needle_box").innerHTML = str;
}

/*刻度旋转*/
function makeNeedle(){
    needle();
    
    /* 小刻度针旋转*/
    var aneedles = document.getElementById("needle_box").getElementsByTagName("div");
    //console.log(aneedles.length);
    for(var i = 0; i < aneedles.length ; i ++){
        var item = aneedles[i];
        item.style.transform = "rotate("+ i * 360 / 60 +"deg)";
    }
    num(120);
}

/*绘制数字*/

function num(radii){
    var numbox = document.getElementById("num_box");
    
    for(var i = 12;i > 0 ; i--){
        var odiv = document.createElement("div");
        var angles = i * 360 / 12;
        
        odiv.style.transform = "rotate("+angles+"deg)";
        var left = radii * Math.sin(Math.PI / 180 * angles);
        var top = radii * -Math.cos(Math.PI / 180 * angles);
        odiv.style.cssText = "left:"+left+"px;top:"+top+"px";
        odiv.innerHTML = i;
        
        numbox.appendChild(odiv);
    }
}

/*拖拽事件*/
var lastX = 0;
var lastY = 0;

var oclock = document.getElementById("wrap1");
oclock.onmousedown = function(ev){

    var oEvent = ev || event;

    /*获取物体的位置*/
    var disX = oEvent.pageX-oclock.offsetLeft;
    var disY = oEvent.pageY-oclock.offsetTop;
    console.log(disX);
    console.log(disY);

    document.onmousemove = function(ev){
        var oEvent = ev || event;

        oEvent.preventDefault();
        /*获取鼠标在物体中的位置*/
        var l = oEvent.pageX - disX;
        var t = oEvent.pageY - disY;

        oclock.style.cssText = "left:"+l+"px;top:"+t+"px";

        speedX = l - lastX;
        speedY = t - lastY;
        lastX = l;
        lastY = t;
    };
    document.onmouseup = function(){
        document.onmousemove = null;
        document.onmouseup=null;

        startMove(0.6);
    };
    clearInterval(timer);
};
var timer = null;
var speedX = 0;
var speedY = 0;

function startMove(k){
    clearInterval(timer);
    timer = setInterval(function(){
        speedY += 3;
        var t = oclock.offsetTop + speedY;
        var l = oclock.offsetLeft + speedX;

        if(l > document.documentElement.clientWidth - oclock.offsetWidth){
            speedX *= -k;
            l = document.documentElement.clientWidth - oclock.offsetWidth;
        }else if(l < 0){
            speedX *= -k;
            l = 0;
        }
        if(t > document.documentElement.clientHeight - oclock.offsetHeight){
            speedY *= -k;
            speedX *= k;
            t = document.documentElement.clientHeight - oclock.offsetHeight;
        }else if(t < 0){
            speedY *= -k;
            speedX *= k;
            t = 0;
        }

        var anglesSpeed = Math.abs(speedX) + Math.abs(speedX);

        if(Math.abs(speedX) < 1){
            speedX = 0;
        }
        if(Math.abs(speedY) < 1){
            speedY = 0;
        }
        
        if(speedX == 0 && speedY == 0 && t == document.documentElement.clientHeight - oclock.offsetHeight){
            oclock.style.transform = 'rotate('+anglesSpeed * 0+'deg)';
            clearInterval(timer);
        }else{
            oclock.style.top = t + 'px';
            oclock.style.left = l + 'px';
            oclock.style.transform = 'rotate('+anglesSpeed * 360 * 150+'deg)';
        }
    },20);
}
/*获取元素当前样式*/
function css(dom,attr){
    if(dom.currentStyle){
        return dom.currentStyle[attr];
    }else {
        return window.getComputedStyle(dom,null)[attr];
    }
}