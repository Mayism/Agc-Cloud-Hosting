  
var APP_JS_API = window.hwAwardsJSApi;

var raffle_URL = "https://" + window.location.host + "/Wallet/wallet/gateway.action?clientVersion=801100090";
var hasEid_URL = "https://" + window.location.host + "/WalletIdentityService/api/v1/queryOpenHis";


var srcTranID,b_userid,serviceToken,appID,deviceID,deviceType,cplc,promotionId,issuerid,SN,deviceModel,payCert,appVersion;

var myDate = new Date();

b_userid = APP_JS_API.getUserAccountId();

serviceToken = APP_JS_API.getServiceToken();

deviceID = APP_JS_API.getDeviceId();

appVersion = APP_JS_API.getWalletVersion();

var cplfData = JSON.parse(APP_JS_API.getCplc());

if(cplfData.resultCd == 0){
    cplc = cplfData.data.cplc;

}else{
    cplc = false;
}
if(appVersion < 801103000){
    $(".mask").show();
    $(".version-note").show();
}
$(".update-app").click(function(){
    var marketScheme = 'hiapp://com.huawei.appmarket?activityName=activityUri|appdetail.activity&params={"params":[{"name":"uri","type":"String","value":"package|com.huawei.wallet"}]}&channelId=1234567';
    pullPage(marketScheme)  
})
var hasCardNum = 0;
var isRaffleopenCardLotteryResult;
//资格验证接口
function isRaffle(promotionName,obj,num){
    if(cplc){
        $.ajax({
            type : "POST",
            url : raffle_URL,
            async : true,
            data : JSON.stringify({
                    "keyIndex" : -1,
                    "data":JSON.stringify({
                        "header": {
                            "srcTranID": currentTime() + generateMixed(7),                   
                            "version": "1.2",
                            "ts":myDate.getTime(),
                            "serviceTokenAuth": {
                                "userid": b_userid,
                                "serviceToken": serviceToken,
                                "appID": "com.huawei.wallet",
                                "deviceID": deviceID,
                                "deviceType": 2
                            },
                            "commander":"verify.opencard"
                        },
                        "cplc": cplc,
                        "promotionName":promotionName
                    })                  
                }),
            dataType:"json",
            contentType:"application/json;charset=UTF-8",
            success : function(resp)
            {   
                var isRaffleData = JSON.parse(resp.response);
                if(isRaffleData.returnCode === "0"){
                    isRaffleopenCardLotteryResult = isRaffleData.openCardLotteryResult;
                    if(isRaffleData.openCardLotteryResult == "0"){
                       
                        raffle(promotionName,obj,num);
                    }else{
                        hasEidCard();  
                    }
                    
               }else{
                    // 抽奖按钮恢复点击
                    click = false;
                    notConnectedShow();
               }        
            },
            error : function(resp)
            {   
            
                notConnectedShow();
            }
        });
    }else{
        click = false;
        $(".mask").show();
        $(".noactiontime").show();
        $(".confirm-note").html("请打开NFC开关，并重新进入页面");
    }     
}
//查询卡片接口
function hasEidCard(){ 
    $.ajax({
        type : "POST",
        url : hasEid_URL,
        async : true,
        data:JSON.stringify({
            "header": {
                "srcTranID": currentTime() + generateMixed(7),                   
                "version": "1.2",
                "ts":myDate.getTime(),
                "serviceTokenAuth": {
                    "userid": b_userid,
                    "serviceToken": serviceToken,
                    "appID": "com.huawei.wallet",
                    "deviceID": deviceID,
                    "deviceType": 2
                },
                "commander":""
            },
            "servType": "eID"
        }),
        dataType:"json",
        contentType:"application/json;charset=UTF-8",
        success : function(resp)
        {   
            var hasCardNum = 0;
            if(resp.returnCode === "0"){  
                //看是否为首开卡
                if(resp.openStatus > 0){
                    click = false;
                    $(".mask").show();
                    $(".noactiontime").show();
                    $(".confirm-note").html("您已开通过eID，谢谢参与！");
                }else{
                    if(isRaffleopenCardLotteryResult == "1"){
                        click = false;
                        $(".mask").show();
                        $(".outrule").show();
                        $(".guide-rule").html("您已经抽过奖了");

                    }else if(isRaffleopenCardLotteryResult == "2"){
                        click = false;
                        $(".mask").show();
                        $(".noactiontime").show();
                        $(".confirm-note").html("您不符合活动规则，请详阅活动规则");
                    }else if(isRaffleopenCardLotteryResult == "3"){
                        click = false;
                        $(".mask").show();
                        $(".noactiontime").show();
                        $(".confirm-note").html("活动已结束");
                    }else if(isRaffleopenCardLotteryResult == "4"){
                        click = false;
                        $(".mask").show();
                        $(".outrule").show();
                        $(".guide-rule").html("您已经抽过奖了");
                    }else if(isRaffleopenCardLotteryResult == "5"){
                        click = false;
                        $(".mask").show();
                        $(".noactiontime").show();
                        $(".confirm-note").html("当前不在活动时间范围内哦");
                    }else if(isRaffleopenCardLotteryResult == "6"){
                        click = false;
                        $(".mask").show();
                        $(".nopencard").show();
                        $(".guide-note").html("开通eID即可抽奖");
                    }else if(isRaffleopenCardLotteryResult == "7"){
                        click = false;
                        $(".mask").show();
                        $(".outrule").show();
                        $(".guide-rule").html("您已经抽过奖了");
                    }else if(isRaffleopenCardLotteryResult == "11"){
                        click = false;
                        $(".mask").show();
                        $(".noactiontime").show();
                        $(".confirm-note").html("活动太火爆了，请稍后重试");
                    }else{
                        // 抽奖按钮恢复点击
                        click = false;
                        $(".mask").show();
                        $(".nopencard").show();
                    }  
                }
               
           }else{               
                notConnectedShow();
           }        
        },
        error : function(resp)
        {   
            notConnectedShow();
        }
    });
}
var res;
function raffle(promotionName,obj,num){ 
    $.ajax({
        type : "POST",
        url : raffle_URL,
        async : true,

        data : JSON.stringify({
                "keyIndex" : -1,
                "data":JSON.stringify({
                    "header": {
                    "srcTranID": currentTime() + generateMixed(7),                   
                    "version": "1.2",
                    "ts":myDate.getTime(),
                    "serviceTokenAuth": {
                        "userid": b_userid,
                        "serviceToken": serviceToken,
                        "appID": "com.huawei.wallet",
                        "deviceID": deviceID,
                        "deviceType": 2
                    },
                    "commander":"verify.awardrule"
                },
                "cplc": cplc,
                "promotionName":promotionName
                })               
        }),
        dataType:"json",
        contentType:"application/json;charset=UTF-8",
        success : function(resp)
        {   
            
            var raffleData = JSON.parse(resp.response); 
           if(raffleData.returnCode === "0"){
                if(raffleData.lotteryAwardInfo){
                    var getAwardName = raffleData.lotteryAwardInfo.awardName;            
                    resultImg = getAwardImg(getAwardName);
                }else{
                    
                    //未中奖位置为5（根据页面奖品变化）
                    // resultNum = 5;
                   
                }
                obj.addClass("active");
                obj.find(".back img").attr("src",resultImg);
                $(".flip-mask").eq(num).hide().siblings(".flip-mask").show();
                $(".todetail").show();
                $(".award-special-note").show().addClass("special-note")
               
                click = false;
                
                
                var outlink = raffleData.lotteryAwardInfo.awardObtainLink;
                var awardName = raffleData.lotteryAwardInfo.awardName;
                var promotionName = raffleData.lotteryAwardInfo.promotioName;
                var promotionId =  raffleData.lotteryAwardInfo.promotionId;
                var awardId = raffleData.lotteryAwardInfo.awardID;
                $(".todetail").unbind("click").click(function(){
                    var awardType = raffleData.lotteryAwardInfo.awardType;
                    // $(this).parent().hide();
                    // $(".mask").hide();
                    if(awardType == "6_hwCoinTicket"){
                      
                        APP_JS_API.gotoActivity("GetHcoinActivity");
                    }else if(awardType == "7_teleFareTicket"){
                          
                        // 进行encodeURI转义
                        var transAwardName= jQuery.trim(awardName);  
                        var transText= jQuery.trim(promotionName);  
                        var searchUrl =encodeURI("draw-award.html?awardName="+transAwardName+"&promotionname="+transText+"&awardid="+awardId);   //使用encodeURI编码  
                        window.location.href =searchUrl;    
                                
                        // window.location.href = "draw-award.html?promotionname="+promotionName+"&awardid="+awardId;
                    }else if(awardType == "12_meituanTicket"){
                        
                        // window.location.href = outlink;
                        openSkyClient()
                    }else if(awardType == "2"){
                        // 进行encodeURI转义
                       
                        var transAwardName= jQuery.trim(awardName);  
                        var userinfoUrl =encodeURI("draw-userinfo.html?awardName="+transAwardName+"&promotionId="+promotionId+"&awardId="+awardId);  
                         //使用encodeURI编码  
                        window.location.href =userinfoUrl;    
                    }
                })
               
           }else{
                
                notConnectedShow();
           }        
        },
        error : function(resp)
        {   
            
            notConnectedShow();
        }
    });
   
}
 
function notConnectedShow(){   
    $(".noHistory").show().prevAll().hide();
}
 $(".noHistory").click(function(){
    window.location.reload();
 })  


//登录失败
function loginHWAccountError(errorCode)
{
}



//获取随机数
function generateMixed(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9'];
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*9);
         res += chars[id];
     }
     return res;
}
//获取随机数2
function getRandom(n) {
    var chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H',
    'I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
     var res = "";
     for(var i = 0; i < n ; i ++) {
         var id = Math.ceil(Math.random()*35);
         res += chars[id];
     }
     return res;
}
// 获取当前年月日时分秒毫秒17位数
function currentTime(){
    var myDate = new Date();
    var res = "";
    var year = myDate.getFullYear(); // 获取当前年份(2位)   
    var month = myDate.getMonth()+1; // 获取当前月份(0-11,0代表1月) 
    if(month < 10){
        month = "0"+month;
    }
    var day = myDate.getDate(); // 获取当前日(1-31)
    if(day < 10){
        day = "0"+day;
    }   
    var hour = myDate.getHours(); // 获取当前小时数(0-23) 
     if(hour < 10){
        hour = "0"+hour;
    }  
    var min = myDate.getMinutes(); // 获取当前分钟数(0-59) 
     if(min < 10){
        min = "0"+min;
    }  
    var second = myDate.getSeconds(); // 获取当前秒数(0-59) 
    if(second < 10){
        second = "0"+second;
    } 
    var milliseconds = myDate.getMilliseconds(); // 获取当前毫秒数(0-999) 
    if(milliseconds < 10){
        milliseconds = "00"+milliseconds;
    }else if(10 <= milliseconds && milliseconds < 100){
        milliseconds = "0"+milliseconds;
    }
    console.log(year,month,day,hour,min,second,milliseconds)
    res = String(year) + month + day + hour + min + second + milliseconds;
    return res;
}

function openSkyClient(){
    var ua = navigator.userAgent.toLowerCase();
    
    // 钱包目前只有android3.0以上版本
    var androidStr = 'android';
    var index = ua.indexOf(androidStr);
    if (index > -1) //android终端
    {
        if (ua.substr(index+androidStr.length+1, 1) < 3)
        {
            
            return;
        }
        
        var t;
        var config = {
            /*scheme:必须*/
            
            scheme: 'skytone://(999)/(com.huawei.hiskytone)/(9990)/(3)/?v=1&url=https%3A%2F%2Fskytone-res1.vmall.com%2F1af8de8d025749d28222e633fa37c50b%2Findex.html%3Fskytone-msg-type%3D1%26campaignID%3D1af8de8d025749d28222e633fa37c50b',
        
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
          
            if (!startTime || endTime - startTime - config.timeout < threshold) { 
                
                // window.location = config.download_url;
            } else {

            }
        }, config.timeout);

        window.onblur = function() {
            clearTimeout(t);
        }
    }
    else 
    {
        // alert("sorry，此活动目前只支持安卓手机哟~");
    }
    
}


