
//根据页面appId设置pageId
  var pageId=pageId||"page-rxdindex";
  /***********统计代码************/
  //全局对象
  var _paq = _paq || [];
  //设置上报URL：以下为测试URL；商用URL为:http://datacollect.vmall.com:28080/webv1
  _paq.push(['setTrackerUrl', 'https://metrics1.data.hicloud.com:6447/webv1']);
  //设置网站域名ID，如：www.honor.cn
  _paq.push(['setSiteId', 'huaweipay_activity']);

  //加载采集JS
  var _doc = document.getElementsByTagName('head')[0];
  var js = document.createElement('script');
  js.setAttribute('type', 'text/javascript');
  //采集JS的URL：以下为测试URL；商用URL为:http://res.vmall.com/bi/hianalytics.js
  js.setAttribute('src', 'https://metrics1.data.hicloud.com:6447/hianalytics.js'/*tpa=http://res.vmallres.com/bi/hianalytics.js*/);
  _doc.appendChild(js);
  // 上报流量来源，’12345’需要从URL参数或cookie中获取sid\cid
  _paq.push(['setCustomVariable',1, 'sid',pageId, 'page']);
  _paq.push(['setCustomVariable',2, 'cid', pageId, 'page']);
  //跟踪页面
  _paq.push(['trackPageView']);

  
  var APP_JS_API = window.hwAwardsJSApi;
  var userAgent = navigator.userAgent;       
  var start = userAgent.indexOf("/");
  var userAgent2 = userAgent.slice(start+1);
  var start2 = userAgent2.indexOf("/");
  var deviceModel = userAgent2.slice(start2+7,start2+15);
  console.log(deviceModel)
  var uid,deviceId;
  try{
    uid = APP_JS_API.getUserAccountId();
    deviceId = APP_JS_API.getDeviceId();
  }catch(e){
    uid="";
    deviceId=""
  }
  var activityId = "hwp"+Date.parse("2019 3 12");
  var u = window.location.search;
  var n = u.indexOf("from");
  var fromWays = u.slice(n+5);

  
  //页面打点
  function pageDot(typeId,typeName,key,actName){
    var pageDottKey = "H5_page_index_HuaweiPay_"+typeId+"_"+typeName+"_"+key+"_"+actName+"_"+activityId+"_"+uid+"_"+deviceId+"_"+deviceModel+"_"+fromWays;
    _paq.push(['trackLink',pageDottKey, 'link',pageId]);
  }

  //按钮打点
  function buttonDot(typeId,typeName,key,buttonName){
    var buttonDottKey = "H5_button_index_HuaweiPay_"+typeId+"_"+typeName+"_"+key+"_"+activityId+"_"+buttonName+"_"+uid+"_"+deviceId+"_"+deviceModel+"_"+fromWays;
    _paq.push(['trackLink',buttonDottKey, 'link',pageId]);
  }