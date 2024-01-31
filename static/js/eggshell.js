function KeyupEgg(obj) {
    const keyArr = obj.keyArr;//需要按下的按键列表
    let index = 0;//初始值, 表示当前需要按下按键列表中的哪个按键
    let flag = false;//用于判断当前是否成功

    const fun = function (e) {

        if (flag) {//判断是否已经成功
            return
        }

        if(keyArr[index].indexOf(e.key) !== -1) {//判断当前按下的按键是否是正确的

            if (obj.time) {//判断之前有没有设置定时任务
                clearTimeout(obj.time);//清除定时任务
            }

            obj.time = setTimeout(function () {//开启定时任务, 用变量接收是为了清除定时任务
                index = 0;//重置索引
                if (typeof obj.error === 'function') {//判断是否有失败函数
                    obj.error(e);//执行失败函数
                }
            }, obj.ms);//定时任务的定时时间

            index++;//更新索引

            if (typeof obj.animation === 'function') {//判断是否有过程函数
                obj.animation(e);//执行过程函数
            }

            if (index === keyArr.length) {//判断是否成功
                flag = true
                clearTimeout(obj.time);//清除定时任务, 因为定时任务可能会触发失败函数
                obj.success(e);//执行成功函数
            }

        } else {//如果按错按键则重新开始
            index = 0;//重置索引
        }
    };

    (function(fun) {
        /*
         * 1. 保存原来的keyup函数
         * 2. 按下按键后, 在执行完判断函数后还应该调用会原本的keyup方法, 避免之前的keyup函数失效
         */
        const keyup = window.document.onkeyup;

        if (typeof window.document.onkeyup !== 'function') {//判断在此之前keyup是否已经是一个函数了
            window.document.onkeyup = fun;//如果不是函数, 直接把判断函数赋值给按键监听事件
        } else {//如果在此之前keyup已经是一个函数了
            window.document.onkeyup = function(e) {//重置keyup函数
                fun(e);//先执行判断函数
                keyup(e);//在执行原本keyup的函数
            };
        }
    })(fun);

}

new KeyupEgg({
    "keyArr": [//必须
        "ArrowUp", //↑
        "ArrowUp", //↑
        "ArrowDown", //↓
        "ArrowDown", //↓
        "ArrowLeft", //←
        "ArrowRight", //→
        "ArrowLeft", //←
        "ArrowRight", //→
        "Bb",
        "Aa"
    ],
    "ms": 1000,//必须 --->两次按键间隔的毫秒
    "success": function (e) {//必须
        const elem = document.querySelector("body")
        setTimeout(function () {
            const oHead = document.getElementsByTagName('HEAD').item(0);
            const oScript= document.createElement("script");
            oScript.type = "text/javascript";
            oScript.src="static/js/eggshell-success.js";
            oHead.appendChild( oScript);

            elem.style['animation'] = 'eggshell-success .6s linear'
        }, 100);
    },
    // "error": function (e) {//非必须
    //     alert("失败");
    // },
    "animation": function (e) {//非必须
        const elem = document.querySelector("body")
        document.querySelector("body").style.overflow = "hidden"
        elem.style['animation'] = 'none'
        switch (e.key) {
            case "ArrowUp" :
                setTimeout(function () {
                    elem.style['animation'] = 'eggshell-ArrowUp .1s linear'
                }, 10);
                break
            case "ArrowDown" :
                setTimeout(function () {
                    elem.style['animation'] = 'eggshell-ArrowDown .1s linear'
                }, 10);
                break
            case "ArrowRight" :
                setTimeout(function () {
                    elem.style['animation'] = 'eggshell-ArrowRight .15s linear'
                }, 10);
                break
        }
        setTimeout(function () {
            document.querySelector("body").style.overflow = "auto"
        }, 10 * 1000);
    }
});
