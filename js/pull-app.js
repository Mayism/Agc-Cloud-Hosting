function pullPage(schemeUrl){

    if(is_weixn() || is_weibo())
    {
        document.getElementById("wxm").style.display = "block";
        document.body.addEventListener('touchmove',function(event){
            event.preventDefault();
        },false);
    }
    else
    {

        var ua = navigator.userAgent.toLowerCase();
        var isHuawei = ua.indexOf("huawei");
        
    
        var androidStr = 'android';
        var index = ua.indexOf(androidStr);
        // if (index > -1) //android终端
        // {
        //     if (ua.substr(index+androidStr.length+1, 1) < 3)
        //     {
        //         // alert("sorry，预约活动目前只支持安卓系统哟~");
        //         return;
        //     }
            
            var t;
            var config = {                          
                scheme: schemeUrl,
                download_url: 'http://a.vmall.com/app/C10217244',
                timeout: 600
            };
            
            var threshold;
            // 判断是否是UC浏览器
            if(ua.match(/UCBrowser/i)=="ucbrowser")
            {
                // UC浏览器比较特殊，加载iframe的src很快，阈值设置为100ms
                threshold = 100;
            }
            else
            {
                threshold = 200;
            }
        
            var startTime = Date.now(); 
            var ifr = document.createElement('iframe');
            ifr.src = config.scheme;
            ifr.style.display = 'none';                     
            document.body.appendChild(ifr);
            
            var t = setTimeout(function() {
                var endTime = Date.now();
                
                // 如果手机没有响应自定义scheme的本地应用，则跳转到下载页面
                //alert(endTime - startTime - config.timeout);
                if (!startTime || endTime - startTime - config.timeout < threshold) { 
                    
                    // window.location = config.download_url;
                } else {

                }
            }, config.timeout);

            window.onblur = function() {
                clearTimeout(t);
            }
    //     }
    //     else 
    //     {
    //         // alert("sorry，活动目前只支持安卓手机哟~");
    //     }
    }
}
function is_weixn(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.match(/MicroMessenger/i)=="micromessenger") {  
        return true;  
    } else {  
        return false;  
    }  
} 
function is_weibo(){  
    var ua = navigator.userAgent.toLowerCase();  
    if(ua.indexOf("weibo") > 0){
        return true;  
    }else{  
        return false;  
    }  
} 
$(".cover").click(function(){
    $(this).hide();
})
$(".note").click(function(){
    scrollTop = $(window).scrollTop();
    $(this).hide();
    $(".mask").hide();
    $('body').css({'position':'static'});
})
function close()
{
    var share=document.getElementById('share');
    share.style.display="none";
    var gridBlock=document.getElementById('gridBlock');
    gridBlock.style.display="none";
}