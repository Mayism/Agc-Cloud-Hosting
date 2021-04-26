var SHARE_JS_API = window.hiWalletShareAPI;
    var pageUrl = "https://pcpay.vmall.com/agreement/share-april19/eid_raffle.html";
    var pageTitle = $("title").html();
    var pageDescript = $("title").html();

    $(function(){   
        // alert("加载之前");
        if (SHARE_JS_API){        
            //加载以前传输分享数据
            // alert("分享接口");
            SHARE_JS_API.setShareData(
                pageTitle,
                pageDescript,
                pageUrl
            )
        }
    });