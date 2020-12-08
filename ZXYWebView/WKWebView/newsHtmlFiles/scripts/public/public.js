//获取链接后附加的参数(n=>参数名)
function GetQueryString(n) {
    var e = new RegExp("(^|&)" + n + "=([^&]*)(&|$)"),
        r = window.location.search.substr(1).match(e); return null != r ? decodeURI(r[2]) : null;
}