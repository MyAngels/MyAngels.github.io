function getStyle(obj, attr) {
//    进行判断调整浏览器兼容问题
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr];
    }

}


function startMove(obj, json, fn) {
    clearInterval(obj.timer);

    obj.timer = setInterval(function () {
        //这一次运动就结束了——所有的值都到达了
        var oStop = true;
        for (attr in json) {
            //取当前值
            var iCur = 0;
            if (attr === 'opacity') {
                iCur = parseInt(parseFloat(getStyle(obj, attr)) * 100);
            } else {
                iCur = parseInt(getStyle(obj, attr));
            }

            //    定义速度
            var iSpeed = (json[attr] - iCur) / 8;
            iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);

            //    检测停止
            if (iCur !== json[attr]) {
                oStop = false;
            }
            if (attr === 'opacity') {
                obj.style.filter = 'alpha(opacity:' + (iCur + iSpeed) + ')';
                obj.style.opacity = (iCur + iSpeed) / 100;
            }
            else {
                obj.style[attr] = iCur + iSpeed + 'px';
            }
        }

        //    如果整个循环所有值都到达关闭定时器
        if (oStop) {
            clearInterval(obj.timer);

            fn(fn)
            {
                fn();
            }
        }
    }, 30);
}