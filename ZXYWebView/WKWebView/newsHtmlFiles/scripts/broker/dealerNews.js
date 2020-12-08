(function () { function r(e, n, t) { function o(i, f) { if (!n[i]) { if (!e[i]) { var c = "function" == typeof require && require; if (!f && c) return c(i, !0); if (u) return u(i, !0); var a = new Error("Cannot find module '" + i + "'"); throw a.code = "MODULE_NOT_FOUND", a } var p = n[i] = { exports: {} }; e[i][0].call(p.exports, function (r) { var n = e[i][1][r]; return o(n || r) }, p, p.exports, r, e, n, t) } return n[i].exports } for (var u = "function" == typeof require && require, i = 0; i < t.length; i++)o(t[i]); return o } return r })()({
  1: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    /// <reference path="../../../gulp/tsd/jquery.d.ts" />
    var bk = require("../../../gulp/mobile/booksMethod");
    var TextTransformation2 = require("./../../../gulp/TextTransformation/TextTransformation2");
    var GetQueryString_1 = require("./../../../gulp/getQueryString/GetQueryString");
    var header_Data = require("./../../../gulp/headerData/headerData");
    var windows_1 = require("../../../gulp/win/windows");
    var globalTimeLimit_1 = require("./../gulp/globalLimit/globalTimeLimit"); //全局时间规则
    var id = GetQueryString_1["default"]("id");
    var imgList = {};
    var showTraderInfoCard;
    var pageUrl;
    var vm = {};
    var judge = 0;
    var clickImageArray = [];
    var type = parseInt(GetQueryString_1["default"]("type")) || 1;
    var typeData = {
      "1": { name: "交易商汇评" },
      "2": { name: "交易商公告" },
      "3": { name: "交易商活动" }
    };
    document.title = typeData[type].name; //设置title文本
    var hosts;
    var shareIcon;
    var returnIcon;
    var HeaderObj;
    //设置域名
    windows_1["default"].getHosts = function (data) {
      var obj=data;
      try{
        obj=typeof data==="string"?JSON.parse(data):data;
      }catch(e){}
      shareIcon = obj.imgHost + "/upload/images/master/2019/10/28/163646090.png";
      returnIcon = obj.imgHost + "/upload/images/master/2019/10/28/163642168.png";
      hosts = obj;


    }
    function getHead() {
      if (vm.newsIntroduction) {
        var Summary = vm.newsIntroduction.Summary, Id = vm.newsIntroduction.NoticeId, SmallImage = vm.newsIntroduction.TitleImages.Small, Title = vm.newsIntroduction.Title, ShareIcon = shareIcon;
      }
      else {
        var Summary = '', Id = 0, SmallImage = "", Title = '暂无内容，无法进行分享操作', ShareIcon = "";
      }
      HeaderObj = {
        backgroundColor: "#FFFFFF",
        title: {
          content: typeData[type].name ? typeData[type].name : "交易商汇评",
          color: "#333333",
          isTwoLine: false
        },
        leftIcon: [
          {
            type: header_Data.share_headData.type.goback,
            goback: {
              content: "",
              icon: returnIcon,
              color: ""
            }
          }
        ],
        rightIcon: [
          {
            type: header_Data.share_headData.type.share,
            share: {
              content: "",
              icon: ShareIcon,
              color: "",
              shareModel: {
                type: header_Data.share_headData.shareModel.link,
                title: Title,
                content: Summary,
                imgUrl: vm.newsIntroduction?vm.newsIntroduction.Logo:"",
                shareUrl: pageUrl
              }
            }
          }
        ]
      };
      var headerDataObj = header_Data.HeaderData(HeaderObj);
      bk.booksInit("HeaderData", JSON.stringify(headerDataObj));
    }

    //Android和IOS  数据通用入口
    windows_1["default"].loadNewsJson = function (data, traderInfoCard, exhibit) {
      renderHeadHtml(data);
      loadData(data, traderInfoCard, exhibit);
    }

    //回传链接
    windows_1["default"].loadNewsUrl = function (url) {
      showTraderInfoCard = getQueryString(url, "traderInfoCard");
      type = parseInt(getQueryString(url, "type"));
      pageUrl = url.replace("brokerDetails", "brokerShares");
    };
    function state(status, value, statusTxt, valueTxt) {
      if (status != 0) {
        return '<p class="status' + status + '" style="background-color:#f04040"><em>' + statusTxt + '</em></p>';
      } else {
        return '<p class="status' + value + '"><em>' + (valueTxt ? valueTxt : '未知') + '</em></p>';
      }
    }
    //获取Url的参数
    function getQueryString(url, n) {
      var e = new RegExp("(^|&)" + n + "=([^&]*)(&|$)");
      var r = url.substr(url.lastIndexOf("?") + 1).match(e);
      return null != r ? decodeURI(r[2]) : null;
    }
    //h5优化原生提供数据，不在请求接口
    windows_1["default"].renderHeadHtml = function (data) {
      if (data && data != '') {
        //页面赋值
        var html = '';
        html = '<div class="new_title"><p>' + data.Notices.Title + '</p></div>' +
          '<div class="news_attach">' +
          '<img class="news_platform_logo" src="' + data.EnterpriseStatistics.LogoFive + '">' +
          '<span class="new_platform_name">' + data.EnterpriseStatistics.Name + ' | </span>' +
          '<span class="publish_time">' + globalTimeLimit_1["default"](data.Notices.AddTime) + '</span>' +
          '</div>';
        $('.main_top').html(html);
      }
      else {
        return;
      }
    };
    function fraction(grade) {
      if (grade > 0) {
        return grade.toFixed(2);
      }
      else {
        return '暂无';
      }
    }
    function supervise(type, exhibit) {
      if (type == 1 && exhibit == true) {
        return '<a class="regulatory">源监管<img src="' + hosts.imgHost + '/upload/files/master/2020/09/22/111436593.png"/></a>';
      }
      else {
        return '';
      }
    }
    function handleNullOrEmpty(data) {
      if (data == '' || data == null) {
        return "-"
      } else {
        return data
      }
    }
    function getAttention(data){
      let result="0";
      if(data!=null&&data>0){
        if(data<10000){
          var reg = /(\d+)(\d{3})/; 
            result = data.toString().replace(reg, "$1,$2"); 
        }else if(data<100000){
          result=(data/10000).toFixed(1)+'万';
        }else if(data<100000000){
          result=Math.round(data/10000)+'万';
        }else{
          result=(data/100000000).toFixed(1)+'亿';
        }
      }
      return result;
    }
    windows_1["default"].loadData = function (data, traderInfoCard, exhibit) {
      if (data && data != '') {
        //原生头部获取信息
        var mainData = data.Notices;
        vm.newsIntroduction = mainData;
        vm.newsIntroduction.Logo = data.EnterpriseStatistics.LogoFive;
        getHead();

        //主要新闻信息
        var newsHtml = "";
        var contentData = '';
        if (mainData.MContent && mainData.MContent != "") {
          //去除banner
          var str = mainData.MContent ? mainData.MContent.replace(/\\n+/ig, '</p><p>') : "";
          var img = str.replace(/<p>{/ig, '<section>{');
          var img2 = img.replace(/}<\/p>/ig, '}</section>');
          var txt = img2.replace(/<p><\/p>/ig, '');
          var mContMsg = JSON.parse(txt);
          var mCont = mContMsg.Content.trim();
          mContMsg.Content = mCont.trim();
          if (clickImageArray.length > 0) clickImageArray = [];
          for (var k = 0; k < mContMsg.Url.length; k++) {
            clickImageArray.push(mContMsg.Url[k].Big);
          }
          contentData = TextTransformation2.MobileToWeb(mContMsg, imgList, judge);
        }
        //新闻内容渲染
        newsHtml += '<div class="news_text">' + contentData + '</div>';
        $(".news_content").html(newsHtml);
        //交易商头部
        if (traderInfoCard == 1 && $(".dealer_content")[0] != undefined) {
          var brokerStr = '';
            brokerStr = '<div class="dealer_box">' +
              '<div class="dealer_logo_box" data-value="' + data.Notices.BrokerId + '" style="background-image: url(' + data.EnterpriseStatistics.LogoFour + ')">' + state(data.EnterpriseStatistics.BusinessStatus, data.EnterpriseStatistics.RegulatoryStatus, data.EnterpriseStatistics.BusinessStatusText, data.EnterpriseStatistics.RegulatoryStatusText) + '</div>' +
              '<div class="dealer_desc_box">' +
                '<div class="dealer_main clearFix">'+
                    '<div class="left_info">'+
                        '<h3 class="dealer_name">' + data.EnterpriseStatistics.Name + '</h3>' +
                        '<div class="dealer_rank">' +supervise(data.EnterpriseStatistics.HasOriginal, exhibit) + '<p class="attention"><em>'+getAttention(data.EnterpriseStatistics.EntExtend.FollowCount)+'</em>人关注</p>'+                            
                        '</div>'+
                    '</div>'+
                    '<div class="rank-score">'+
                        '<p class="rankings">' + fraction(data.EnterpriseStatistics.ReputationTotalAvgScore) + '</p>'+
                        '<p class="score">口碑分</p>'+
                    '</div>'+
                '</div>'+
                '<div class="dealer_more">' + handleNullOrEmpty(data.EnterpriseStatistics.EntYears) + ' | ' + handleNullOrEmpty(data.EnterpriseStatistics.CountryName) + '监管 | ' + handleNullOrEmpty(data.EnterpriseStatistics.LicenseType) + '</div>' + //年限 | 监管国家 | 监管牌照
              '</div>' +
            '</div>';
          $('.dealer_content').html(brokerStr);
          //添加点击事件跳转原生
          $('.dealer_box').on('click', function (event) {
            var domEvent = windows_1["default"].event || event;
            if (domEvent.target.className == "regulatory")
              return;
            var dealerId = parseInt($(this).find('.dealer_logo_box').data('value'));
            bk.booksInit("openDealerDetailsPage", dealerId);
          });
          //原监管跳转
          $('.regulatory').on('click', function () {
            var openDealersPageDataObj = {
              dealerId: data.EnterpriseStatistics.EntId,
              dealerName: data.EnterpriseStatistics.Name
            };
            bk.booksInit("openSourceRegulator", openDealersPageDataObj);
          });
        }

        //点击图片与原生进行放大处理
        $('.zoom').on('click', function () {
          var index = parseInt($(this).data('num'));
          var zoomData = {
            "index": index,
            "imageArray": clickImageArray
          };
          bk.booksInit("onClickWebImage", zoomData);
        });
        //新闻中图片懒加载
        TextTransformation2.lazyLoad(imgList);
        //新闻中图片放大

      }else {        
        getHead();
      }
    };
  }, { "../../../gulp/mobile/booksMethod": 9, "../../../gulp/win/windows": 11, "./../../../gulp/TextTransformation/TextTransformation2": 3, "./../../../gulp/getQueryString/GetQueryString": 5, "./../../../gulp/headerData/headerData": 6, "./../gulp/globalLimit/globalTimeLimit": 2 }], 2: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    var GlobalTimeLimit = /** @class */ (function () {
      function GlobalTimeLimit(data) {
        var data = data.replace(/-/g, '/');
        this.addTime = new Date(data);
        this.systemTime = new Date();
        this.addStamp = this.addTime.getTime();
        this.systemStamp = this.systemTime.getTime();
        this.init();
      }
      GlobalTimeLimit.prototype.init = function () {
        this.systemYear = this.systemTime.getFullYear();
        this.systemMonth = this.systemTime.getMonth() + 1;
        this.systemDay = this.systemTime.getDate();
        this.systemHour = this.systemTime.getHours();
        this.systemMinute = this.systemTime.getMinutes();
        this.addYear = this.addTime.getFullYear();
        this.addMonth = this.addTime.getMonth() + 1;
        this.addDay = this.addTime.getDate();
        this.addHour = this.addTime.getHours();
        this.addMinute = this.addTime.getMinutes();
        this.addMonthLastDay = (new Date(this.addYear, this.addMonth, 0)).getDate();
        return this.getTimeString();
      };
      GlobalTimeLimit.prototype.getTimeString = function () {
        //注：发布时间>系统当前时间（存在于用户系统时间调整，导致时间不准确），则显示为"刚刚"
        if (this.addStamp >= this.systemStamp) {
          return "刚刚";
        }
        //1.发布时间与当前时间是同一天
        if (this.sameDay()) {
          var distanceStamp = this.systemStamp - this.addStamp;
          if (distanceStamp < 60 * 1000) {
            return "刚刚";
          }
          if (distanceStamp < 60 * 60 * 1000) {
            var minutes = Math.floor(distanceStamp / (60 * 1000));
            return minutes + "\u5206\u949F\u524D";
          }
          else {
            let hours = Math.floor(distanceStamp / 3600000);
            return hours + '小时前';
          }
        }
        //2.发布时间比当前时间早一天，显示为“昨天 hh:mm”
        if (this.yesterDay()) {
          return "\u6628\u5929 " + this.withZero(this.addHour) + ":" + this.withZero(this.addMinute);
        }
        //3.非1非2，但发布时间与当前时间是同一年，显示为“MM-DD hh:mm”
        else if (this.addYear == this.systemYear) {
          return this.withZero(this.addMonth) + "-" + this.withZero(this.addDay) + " " + this.withZero(this.addHour) + ":" + this.withZero(this.addMinute);
        }
        //非1非2，但发布时间与当前时间不是同一年，显示为“YYYY-MM-DD”
        else {
          return this.addYear + "-" + this.withZero(this.addMonth) + "-" + this.withZero(this.addDay);
        }
      };
      //发布时间和系统时间为同一天
      GlobalTimeLimit.prototype.sameDay = function () {
        var yearFlag = this.addYear == this.systemYear;
        var monthFlag = this.addMonth == this.systemMonth;
        var dayFlag = this.addDay == this.systemDay;
        if (yearFlag && monthFlag && dayFlag) {
          return true;
        }
        else {
          return false;
        }
      };
      //发布时间比当前时间早一天
      GlobalTimeLimit.prototype.yesterDay = function () {
        var yearFlag = this.addYear == this.systemYear;
        var monthFlag = this.addMonth == this.systemMonth;
        if (yearFlag) { //同年
          if (monthFlag) { //同月
            if (this.addDay == this.systemDay - 1) { //隔天
              return true;
            }
          }
          else if (this.addMonth == this.systemMonth - 1) { //隔月
            if (this.addDay == this.addMonthLastDay && this.systemDay == 1) { //隔月隔天
              return true;
            }
            else { //隔月不隔天
              return false;
            }
          }
          else { //非同月或者隔月
            return false;
          }
        }
        else if (this.addYear == this.systemYear - 1) { //隔年
          var addMonthFlag = this.addMonth == 12;
          var addDayFlag = this.addDay == this.addMonthLastDay;
          var systemMonthFlag = this.systemMonth == 1;
          var systemDayFlag = this.systemDay == 1;
          if (addMonthFlag && addDayFlag && systemMonthFlag && systemDayFlag) { //12月最后一天和隔年第一天
            return true;
          }
          else {
            return false;
          }
        }
        else { //非同年或者隔年
          return false;
        }
      };
      //小于10就补零
      GlobalTimeLimit.prototype.withZero = function (num) {
        if (num < 10) {
          return "0" + num;
        }
        else {
          return num;
        }
      };
      return GlobalTimeLimit;
    }());
    function globalTimeLimit(data) {
      var str = new GlobalTimeLimit(data);
      return str.init();
    }
    exports["default"] = globalTimeLimit;
  }, {}], 3: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    function MobileToWeb(html, imgList, index) {
      if (!(arguments.length > 0))
        return "";
      html = "object" == typeof html ? html : JSON.parse(html);
      var t = html.Content;
      var screenWidth = window.screen.width - 40;
      if (html.Url) {
        var a = html.Url;
        if (a.length > 0) {
          for (var i = 0; i < a.length; i++) {
            if (t.indexOf("{img" + i + "}") >= 0) {
              var jug = a[i].Height;
              var imgHeight = parseInt(a[i].Height);
              var imgWidth = parseInt(a[i].Width);
              var scale = (imgHeight / imgWidth); ///高宽比
              var setHight = Math.round(screenWidth * scale) + 'px';
              if (jug == undefined) {
                setHight = '8rem';
              }
              var n = a[i].Big.replace("/ChatText/dialogs/qq/", "/ChatText/dialogs/qqpc/");
              t = t.replace("{img" + i + "}", '<img class="zoom" data-num="' + (i + index) + '"  id="img_' + i + '" data-src="' + n + '" data-preview-src="" data-preview-group="1" style="width:100%;height:' + setHight + ';border:none;background:#fcfcfc"/>');
              var img = new Image();
              imgList[i] = img;
              imgList[i].style.opacity = 0;
              imgList[i].onload = function () {
                imgList[i].style.opacity = 1;
              }
              imgList[i].src = n;
            }
            else if (t.indexOf("{video" + i + "}") >= 0) {
              t = t.replace("{video" + i + "}", '<video class="video" src="' + a[i].Big + '" poster="' + a[i].Small + '" controls="" loop="loop" style="display: block;width: 100%;margin:auto;"></video>');
            }
          }
        }
      }
      return '<p>' + t + '</p>';
    }
    exports.MobileToWeb = MobileToWeb;
    ;
    function BBsMobileToWeb(e, imgList) {
      var r;
      if (!(arguments.length > 0))
        return "";
      r = "object" == typeof e ? e : JSON.parse(e);
      var t = r.Content ? r.Content.replace(/\\n/g, "<br/>") : "";
      if (r.Url) {
        var a = r.Url;
        if (a.length > 0) {
          for (var i = 0; i < a.length; i++) {
            if (t.indexOf("{img" + i + "}") >= 0) {
              var n = a[i].Big.replace("/ChatText/dialogs/qq/", "/ChatText/dialogs/qqpc/");
              t = t.replace("{img" + i + "}", '<img id="img_' + i + '" data-src="' + n + '" style="width:100%;height:5.2rem;border:none;background:#f7f7f7"/>');
              imgList.push(new Image());
              imgList[i].src = n;
            }
          }
        }
      }
      return t;
    }
    exports.BBsMobileToWeb = BBsMobileToWeb;
    ;
    function lazyLoad(imgList) {
      for (var i in imgList) {
        (function (i) {
          imgList[i].onload = function () {
            var $img = $("#img_" + i);
            var src = $img.data("src");
            $img.load(function () {
              $img.css({ opacity: 1 });
            })
            $img.attr("src", src).css({ opacity: 0 });
          };
        })(i);
      }
    }
    exports.lazyLoad = lazyLoad;
  }, {}], 4: [function (require, module, exports) {
    "use strict";
    /// <reference path="../../gulp/tsd/jquery.d.ts" />
    /// <reference path="../../gulp/tsd/min/min.d.ts" />
    exports.__esModule = true;
    var Consts = {
      _browseType: {
        Android: 1,
        Ios: 2
      },
      _IosType: {
        iPhone: 1,
        iPod: 2,
        iPad: 3
      },
      singnalrUrl: '',
      FXUrl: '',
      OKRUrl: '',
      OKRUrlS: '',
      ForumApi: '',
      NewsPush: '',
      BrokerSpread: '',
      Rank: '',
      BailunNews: '',
      h5Src: "",
      UserServiceApi: "",
      JCAPI: "",
      Fxchatimage: "",
      CommentApi: "",
      GoldMall: "",
      HccH5: "",
      Mobile: ""
    };
    exports["default"] = Consts;
  }, {}], 5: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    function GetQueryString(n) {
      var e = new RegExp("(^|&)" + n + "=([^&]*)(&|$)"), r = window.location.search.substr(1).match(e);
      return null != r ? decodeURI(r[2]) : null;
    }
    exports["default"] = GetQueryString;
  }, {}], 6: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    exports.share_headData = {
      type: {
        share: 1,
        link: 2,
        goback: 3,
        collection: 4,
        select: 5 //下拉列表
      },
      shareModel: {
        img: 1,
        link: 2 //分享链接
      },
      newsType: {
        specialType: 2,
        newsType: 1,
        reviewType: 4
      }
    };
    //新确定的数据结构
    function HeaderData(data) {
      var HeaderDataObj = {
        backgroundColor: data.backgroundColor || "#2ea9df",
        title: data.title || {
          content: "内容",
          color: "#FFFFFF",
          isTwoLine: true //是否两行文字
        },
        leftIcon: data.leftIcon || [
          {
            type: exports.share_headData.type.goback,
            goback: {
              content: "返回",
              icon: "",
              color: "#FFFFFF"
            }
          },
        ],
        rightIcon: data.rightIcon || [
          {
            type: exports.share_headData.type.share,
            share: {
              content: "",
              icon: "",
              color: "",
              shareModel: {
                type: 1,
                title: "",
                content: "",
                imgUrl: "",
                shareUrl: "" //分享的地址
              }
            }
          },
          {
            type: exports.share_headData.type.link,
            link: {
              content: "链接",
              color: "#FFFFFF",
              icon: "",
              href: ""
            }
          },
          {
            type: exports.share_headData.type.select,
            select: {
              content: "文字",
              icon: "",
              color: "",
              itemBackground: "",
              itemSelection: "",
              itemColor: "",
              defaultId: "",
              item: [{
                content: "文字",
                icon: "",
                method: "function",
                id: 1 //子元素的id  回调方法里面传回
              },
              {
                content: "文字",
                icon: "",
                method: "function",
                id: 2
              }]
            }
          }
          //....   多个按照从右至左的排列方式
        ]
      };
      return HeaderDataObj;
    }
    exports.HeaderData = HeaderData;

    exports.linkModel = {
      goldCoin: 2 //金币商城
      //链接跳转
    };
    function linkJump(data) {
      var LinkJump = {
        type: data.type || 5
      };
      return LinkJump;
    }
    exports.linkJump = linkJump;
  }, {}], 7: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    var u = navigator.userAgent;
    var androidFn = function (ImgAry, i) {
      nativeMethod.ImagePagerStringPath({ "ImgAry": ImgAry, "i": i });
    };
    //安卓版本
    function mobileAndroidEdition() {
      var reg = /Android ([^.]*).([^.]*).([^;]*);/gi;
      var Tp = [];
      u.replace(reg, function (a, b, c, e) {
        Tp[0] = b;
        Tp[1] = c;
        Tp[2] = e;
      });
      return Tp;
    }
    exports.mobileAndroidEdition = mobileAndroidEdition;
    function method(config) {
      androidFn(config, "");
    }
    //出口方法
    //config
    //id  图片的父级id
    //MethodName   安卓 Ios 执行的方法名称
    function addMethod(config) {
      if (config.MethodName) {
        androidFn = function (config) {
          eval("nativeMethod." + config.MethodName + "(" + config + ")");
        };
      }
      method(config);
    }
    exports.addMethod = addMethod;
  }, {}], 8: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    var u = navigator.userAgent;
    var IosMethod_7 = function (config) {
      ImagePagerStringPath(config);
    };
    var IosMethod = function (config) {
      window.webkit.messageHandlers.ImagePagerStringPath.postMessage(config);
    };
    //判断苹果手机的种类
    function IosType() {
      if (u.match(/iPhone/i)) {
        return Consts._IosType.iPhone;
      }
      else if (u.match(/iPod/i)) {
        return Consts._IosType.iPod;
      }
      else if (u.match(/iPad/i)) {
        return Consts._IosType.iPad;
      }
      else {
        return null;
      }
    }
    exports.IosType = IosType;
    //Ios版本
    function molieIosEdition() {
      var reg = /OS ([^_]*)_([^_]*)_([^_]*) like Mac OS X/gi;
      var Tp = [];
      u.replace(reg, function (a, b, c, e) {
        Tp[0] = b;
        Tp[1] = c;
        Tp[2] = e;
      });
      return Tp;
    }
    exports.molieIosEdition = molieIosEdition;
    function method(config) {
      var EditionType = molieIosEdition();
      if (EditionType[0] <= 7) {
        IosMethod_7(config);
      }
      else {
        IosMethod(config);
      }
    }
    //出口方法
    //config
    //id  图片的父级id
    //MethodName   安卓 Ios 执行的方法名称
    function addMethod(config) {
      var configs = JSON.stringify(config);
      if (config.MethodName) {
        IosMethod_7 = function (config) {
          eval(config.MethodName + "(" + configs + ")");
        };
        IosMethod = function (config) {
          eval("window.webkit.messageHandlers." + config.MethodName + ".postMessage(" + configs + ")");
        };
      }
      method(configs);
    }
    exports.addMethod = addMethod;
  }, {}], 9: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    var m = require("./molieInit");
    var const_1 = require("./../consts/const");
    var androidFn = function (type, config) {
      nativeMethod.ImagePagerStringPath(config);
    }; //安卓手机执行方法
    var IosMethod_7 = function (type, config) {
      ImagePagerStringPath(config);
    }; //Ios 系统 7（包括7）一下的执行方法
    var IosMethod = function (type, config) {
      window.webkit.messageHandlers.ImagePagerStringPath.postMessage(config);
    }; //Ios  7以上的执行方法
    //根据手机类型执行不同的方法
    function booksInits(type, config) {
      var mobileType = m.mobileType(); //判断手机类型
      switch (mobileType) {
        case const_1["default"]._browseType.Android:
          androidMethod(type, config);
          break;
        case const_1["default"]._browseType.Ios:
          iosMethod(type, config);
          break;
        default:
          console.log(mobileType);
      }
    }
    //安卓的执行方法
    function androidMethod(type, config) {
      androidFn(type, config);
    }
    //IOS的执行方法
    function iosMethod(type, config) {
      var EditionType = m.IosEdition();
      if (EditionType[0] <= 7) {
        IosMethod_7(type, config);
      }
      else {
        IosMethod(type, config);
      }
    }
    /* 出口方法
     * config
     * type 必须 安卓 Ios 执行的方法名称
     * parameterName 参数名
     * parameterValue 参数值
    */
    function booksInit(type, config) {
      try {
        if (type) {
          if (config != "") {
            config = typeof config === "string" ? config : JSON.stringify(config);
            androidFn = function (type, config) {
              eval("nativeMethod." + type + "('" + config + "')");
            };
            IosMethod_7 = function (type, config) {
              eval(type + "('" + config + "')");
            };
            IosMethod = function (type, config) {
              eval("window.webkit.messageHandlers." + type + ".postMessage('" + config + "')");
            };
          }
          else {
            androidFn = function (type, config) {
              eval("nativeMethod." + type + "()");
            };
            IosMethod_7 = function (type, config) {
              eval(type + "('none')");
            };
            IosMethod = function (type, config) {
              eval("window.webkit.messageHandlers." + type + ".postMessage('none')");
            };
          }
        }
        else {
          alert("必须传入类型");
          return false;
        }
        booksInits(type, config);
      }
      catch (e) { }
    }
    exports.booksInit = booksInit;
  }, { "./../consts/const": 4, "./molieInit": 10 }], 10: [function (require, module, exports) {
    "use strict";
    exports.__esModule = true;
    var Ios = require("./Ios");
    var Ad = require("./Android");
    var const_1 = require("./../consts/const");
    require("./../zepto/zepto.js");
    //declare const Consts;
    var u = navigator.userAgent;
    //判断手机是哪种类型
    function mobileType() {
      if (u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) {
        return const_1["default"]._browseType.Android;
      }
      else if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
        return const_1["default"]._browseType.Ios;
      }
      return 0;
    }
    exports.mobileType = mobileType;
    //根据不用手机执行不同的方法
    function mobileTypeFn(Fn) {
      if (typeof Fn === 'function') {
        switch (mobileType()) {
          case const_1["default"]._browseType.Android:
            Fn();
            break;
          case const_1["default"]._browseType.Ios:
            Fn();
            break;
          default:
            break;
        }
      }
      else {
        console.log("参数必须为方法");
      }
    }
    exports.mobileTypeFn = mobileTypeFn;
    //微信内核执行方法
    function wechatMethod(fn) {
      var isWechat = !!/MicroMessenger/i.test(u);
      if (isWechat) {
        return true;
      }
      else {
        return false;
      }
    }
    exports.wechatMethod = wechatMethod;
    //手机获取版本的方法
    function mobileEdition() {
      switch (mobileType()) {
        case const_1["default"]._browseType.Android:
          return Ad.mobileAndroidEdition();
        case const_1["default"]._browseType.Ios:
          return Ios.molieIosEdition();
        default:
          return null;
      }
    }
    exports.mobileEdition = mobileEdition;
    //添加方法
    function addMethod(config) {
      switch (mobileType()) {
        case const_1["default"]._browseType.Android:
          return Ad.addMethod(config);
        case const_1["default"]._browseType.Ios:
          return Ios.addMethod(config);
        default:
          return null;
      }
    }
    exports.addMethod = addMethod;
    //获取Ios的版本
    //返回的是数组   (8_0_1)  [8][0][1]
    exports.IosEdition = Ios.molieIosEdition;
    //获取安卓的版本
    //返回的是数组   (8.0.1)  [8][0][1]
    exports.AndroidEdition = Ad.mobileAndroidEdition;
    exports.IosType = Ios.IosType; //判断苹果手机的种类  iPhone   ipend
  }, { "./../consts/const": 4, "./../zepto/zepto.js": 12, "./Android": 7, "./Ios": 8 }], 11: [function (require, module, exports) {
    (function (global) {
      "use strict";
      exports.__esModule = true;
      var win;
      if (typeof window !== "undefined") {
        win = window;
      }
      else if (typeof global !== "undefined") {
        win = global;
      }
      else if (typeof self !== "undefined") {
        win = self;
      }
      else {
        win = {};
      }
      exports["default"] = win;
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

  }, {}], 12: [function (require, module, exports) {
    var Zepto = function () {
      function t(t) {
        return null == t ? String(t) : U[J.call(t)] || "object";
      } function e(e) {
        return "function" == t(e);
      } function n(t) {
        return null != t && t == t.window;
      } function r(t) {
        return null != t && t.nodeType == t.DOCUMENT_NODE;
      } function i(e) {
        return "object" == t(e);
      } function o(t) {
        return i(t) && !n(t) && Object.getPrototypeOf(t) == Object.prototype;
      } function a(t) {
        return "number" == typeof t.length;
      } function s(t) {
        return P.call(t, function (t) {
          return null != t;
        });
      } function u(t) {
        return t.length > 0 ? j.fn.concat.apply([], t) : t;
      } function c(t) {
        return t.replace(/::/g, "/").replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2").replace(/([a-z\d])([A-Z])/g, "$1_$2").replace(/_/g, "-").toLowerCase();
      } function l(t) {
        return t in Z ? Z[t] : Z[t] = new RegExp("(^|\\s)" + t + "(\\s|$)");
      } function f(t, e) {
        return "number" != typeof e || _[c(t)] ? e : e + "px";
      } function h(t) {
        var e, n; return L[t] || (e = A.createElement(t), A.body.appendChild(e), n = getComputedStyle(e, "").getPropertyValue("display"), e.parentNode.removeChild(e), "none" == n && (n = "block"), L[t] = n), L[t];
      } function p(t) {
        return "children" in t ? O.call(t.children) : j.map(t.childNodes, function (t) {
          return 1 == t.nodeType ? t : void 0;
        });
      } function d(t, e, n) {
        for (E in e) n && (o(e[E]) || G(e[E])) ? (o(e[E]) && !o(t[E]) && (t[E] = {}), G(e[E]) && !G(t[E]) && (t[E] = []), d(t[E], e[E], n)) : e[E] !== w && (t[E] = e[E]);
      } function m(t, e) {
        return null == e ? j(t) : j(t).filter(e);
      } function v(t, n, r, i) {
        return e(n) ? n.call(t, r, i) : n;
      } function g(t, e, n) {
        null == n ? t.removeAttribute(e) : t.setAttribute(e, n);
      } function y(t, e) {
        var n = t.className || "",
          r = n && n.baseVal !== w; return e === w ? r ? n.baseVal : n : void (r ? n.baseVal = e : t.className = e);
      } function x(t) {
        try {
          return t ? "true" == t || "false" != t && ("null" == t ? null : +t + "" == t ? +t : /^[\[\{]/.test(t) ? j.parseJSON(t) : t) : t;
        } catch (e) {
          return t;
        }
      } function b(t, e) {
        e(t); for (var n = 0, r = t.childNodes.length; r > n; n++) b(t.childNodes[n], e);
      } var w,
        E,
        j,
        S,
        T,
        C,
        N = [],
        O = N.slice,
        P = N.filter,
        A = window.document,
        L = {},
        Z = {},
        _ = { "column-count": 1, columns: 1, "font-weight": 1, "line-height": 1, opacity: 1, "z-index": 1, zoom: 1 },
        $ = /^\s*<(\w+|!)[^>]*>/,
        D = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
        M = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
        R = /^(?:body|html)$/i,
        k = /([A-Z])/g,
        z = ["val", "css", "html", "text", "data", "width", "height", "offset"],
        F = ["after", "prepend", "before", "append"],
        q = A.createElement("table"),
        H = A.createElement("tr"),
        I = { tr: A.createElement("tbody"), tbody: q, thead: q, tfoot: q, td: H, th: H, "*": A.createElement("div") },
        V = /complete|loaded|interactive/,
        B = /^[\w-]*$/,
        U = {},
        J = U.toString,
        X = {},
        W = A.createElement("div"),
        Y = { tabindex: "tabIndex", readonly: "readOnly", for: "htmlFor", class: "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable" },
        G = Array.isArray || function (t) {
          return t instanceof Array;
        }; return X.matches = function (t, e) {
          if (!e || !t || 1 !== t.nodeType) return !1; var n = t.webkitMatchesSelector || t.mozMatchesSelector || t.oMatchesSelector || t.matchesSelector; if (n) return n.call(t, e); var r,
            i = t.parentNode,
            o = !i; return o && (i = W).appendChild(t), r = ~X.qsa(i, e).indexOf(t), o && W.removeChild(t), r;
        }, T = function (t) {
          return t.replace(/-+(.)?/g, function (t, e) {
            return e ? e.toUpperCase() : "";
          });
        }, C = function (t) {
          return P.call(t, function (e, n) {
            return t.indexOf(e) == n;
          });
        }, X.fragment = function (t, e, n) {
          var r, i, a; return D.test(t) && (r = j(A.createElement(RegExp.$1))), r || (t.replace && (t = t.replace(M, "<$1></$2>")), e === w && (e = $.test(t) && RegExp.$1), e in I || (e = "*"), a = I[e], a.innerHTML = "" + t, r = j.each(O.call(a.childNodes), function () {
            a.removeChild(this);
          })), o(n) && (i = j(r), j.each(n, function (t, e) {
            z.indexOf(t) > -1 ? i[t](e) : i.attr(t, e);
          })), r;
        }, X.Z = function (t, e) {
          return t = t || [], t.__proto__ = j.fn, t.selector = e || "", t;
        }, X.isZ = function (t) {
          return t instanceof X.Z;
        }, X.init = function (t, n) {
          var r; if (!t) return X.Z(); if ("string" == typeof t) {
            if (t = t.trim(), "<" == t[0] && $.test(t)) r = X.fragment(t, RegExp.$1, n), t = null; else {
              if (n !== w) return j(n).find(t); r = X.qsa(A, t);
            }
          } else {
            if (e(t)) return j(A).ready(t); if (X.isZ(t)) return t; if (G(t)) r = s(t); else if (i(t)) r = [t], t = null; else if ($.test(t)) r = X.fragment(t.trim(), RegExp.$1, n), t = null; else {
              if (n !== w) return j(n).find(t); r = X.qsa(A, t);
            }
          } return X.Z(r, t);
        }, j = function (t, e) {
          return X.init(t, e);
        }, j.extend = function (t) {
          var e,
            n = O.call(arguments, 1); return "boolean" == typeof t && (e = t, t = n.shift()), n.forEach(function (n) {
              d(t, n, e);
            }), t;
        }, X.qsa = function (t, e) {
          var n,
            i = "#" == e[0],
            o = !i && "." == e[0],
            a = i || o ? e.slice(1) : e,
            s = B.test(a); return r(t) && s && i ? (n = t.getElementById(a)) ? [n] : [] : 1 !== t.nodeType && 9 !== t.nodeType ? [] : O.call(s && !i ? o ? t.getElementsByClassName(a) : t.getElementsByTagName(e) : t.querySelectorAll(e));
        }, j.contains = A.documentElement.contains ? function (t, e) {
          return t !== e && t.contains(e);
        } : function (t, e) {
          for (; e && (e = e.parentNode);) if (e === t) return !0; return !1;
        }, j.type = t, j.isFunction = e, j.isWindow = n, j.isArray = G, j.isPlainObject = o, j.isEmptyObject = function (t) {
          var e; for (e in t) return !1; return !0;
        }, j.inArray = function (t, e, n) {
          return N.indexOf.call(e, t, n);
        }, j.camelCase = T, j.trim = function (t) {
          return null == t ? "" : String.prototype.trim.call(t);
        }, j.uuid = 0, j.support = {}, j.expr = {}, j.map = function (t, e) {
          var n,
            r,
            i,
            o = []; if (a(t)) for (r = 0; r < t.length; r++) null != (n = e(t[r], r)) && o.push(n); else for (i in t) null != (n = e(t[i], i)) && o.push(n); return u(o);
        }, j.each = function (t, e) {
          var n, r; if (a(t)) {
            for (n = 0; n < t.length; n++) if (!1 === e.call(t[n], n, t[n])) return t;
          } else for (r in t) if (!1 === e.call(t[r], r, t[r])) return t; return t;
        }, j.grep = function (t, e) {
          return P.call(t, e);
        }, window.JSON && (j.parseJSON = JSON.parse), j.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (t, e) {
          U["[object " + e + "]"] = e.toLowerCase();
        }), j.fn = {
          forEach: N.forEach, reduce: N.reduce, push: N.push, sort: N.sort, indexOf: N.indexOf, concat: N.concat, map: function (t) {
            return j(j.map(this, function (e, n) {
              return t.call(e, n, e);
            }));
          }, slice: function () {
            return j(O.apply(this, arguments));
          }, ready: function (t) {
            return V.test(A.readyState) && A.body ? t(j) : A.addEventListener("DOMContentLoaded", function () {
              t(j);
            }, !1), this;
          }, get: function (t) {
            return t === w ? O.call(this) : this[t >= 0 ? t : t + this.length];
          }, toArray: function () {
            return this.get();
          }, size: function () {
            return this.length;
          }, remove: function () {
            return this.each(function () {
              null != this.parentNode && this.parentNode.removeChild(this);
            });
          }, each: function (t) {
            return N.every.call(this, function (e, n) {
              return !1 !== t.call(e, n, e);
            }), this;
          }, filter: function (t) {
            return e(t) ? this.not(this.not(t)) : j(P.call(this, function (e) {
              return X.matches(e, t);
            }));
          }, add: function (t, e) {
            return j(C(this.concat(j(t, e))));
          }, is: function (t) {
            return this.length > 0 && X.matches(this[0], t);
          }, not: function (t) {
            var n = []; if (e(t) && t.call !== w) this.each(function (e) {
              t.call(this, e) || n.push(this);
            }); else {
              var r = "string" == typeof t ? this.filter(t) : a(t) && e(t.item) ? O.call(t) : j(t); this.forEach(function (t) {
                r.indexOf(t) < 0 && n.push(t);
              });
            } return j(n);
          }, has: function (t) {
            return this.filter(function () {
              return i(t) ? j.contains(this, t) : j(this).find(t).size();
            });
          }, eq: function (t) {
            return -1 === t ? this.slice(t) : this.slice(t, +t + 1);
          }, first: function () {
            var t = this[0]; return t && !i(t) ? t : j(t);
          }, last: function () {
            var t = this[this.length - 1]; return t && !i(t) ? t : j(t);
          }, find: function (t) {
            var e = this; return t ? "object" == typeof t ? j(t).filter(function () {
              var t = this; return N.some.call(e, function (e) {
                return j.contains(e, t);
              });
            }) : 1 == this.length ? j(X.qsa(this[0], t)) : this.map(function () {
              return X.qsa(this, t);
            }) : j();
          }, closest: function (t, e) {
            var n = this[0],
              i = !1; for ("object" == typeof t && (i = j(t)); n && !(i ? i.indexOf(n) >= 0 : X.matches(n, t));) n = n !== e && !r(n) && n.parentNode; return j(n);
          }, parents: function (t) {
            for (var e = [], n = this; n.length > 0;) n = j.map(n, function (t) {
              return (t = t.parentNode) && !r(t) && e.indexOf(t) < 0 ? (e.push(t), t) : void 0;
            }); return m(e, t);
          }, parent: function (t) {
            return m(C(this.pluck("parentNode")), t);
          }, children: function (t) {
            return m(this.map(function () {
              return p(this);
            }), t);
          }, contents: function () {
            return this.map(function () {
              return O.call(this.childNodes);
            });
          }, siblings: function (t) {
            return m(this.map(function (t, e) {
              return P.call(p(e.parentNode), function (t) {
                return t !== e;
              });
            }), t);
          }, empty: function () {
            return this.each(function () {
              this.innerHTML = "";
            });
          }, pluck: function (t) {
            return j.map(this, function (e) {
              return e[t];
            });
          }, show: function () {
            return this.each(function () {
              "none" == this.style.display && (this.style.display = ""), "none" == getComputedStyle(this, "").getPropertyValue("display") && (this.style.display = h(this.nodeName));
            });
          }, replaceWith: function (t) {
            return this.before(t).remove();
          }, wrap: function (t) {
            var n = e(t); if (this[0] && !n) var r = j(t).get(0),
              i = r.parentNode || this.length > 1; return this.each(function (e) {
                j(this).wrapAll(n ? t.call(this, e) : i ? r.cloneNode(!0) : r);
              });
          }, wrapAll: function (t) {
            if (this[0]) {
              j(this[0]).before(t = j(t)); for (var e; (e = t.children()).length;) t = e.first(); j(t).append(this);
            } return this;
          }, wrapInner: function (t) {
            var n = e(t); return this.each(function (e) {
              var r = j(this),
                i = r.contents(),
                o = n ? t.call(this, e) : t; i.length ? i.wrapAll(o) : r.append(o);
            });
          }, unwrap: function () {
            return this.parent().each(function () {
              j(this).replaceWith(j(this).children());
            }), this;
          }, clone: function () {
            return this.map(function () {
              return this.cloneNode(!0);
            });
          }, hide: function () {
            return this.css("display", "none");
          }, toggle: function (t) {
            return this.each(function () {
              var e = j(this); (t === w ? "none" == e.css("display") : t) ? e.show() : e.hide();
            });
          }, prev: function (t) {
            return j(this.pluck("previousElementSibling")).filter(t || "*");
          }, next: function (t) {
            return j(this.pluck("nextElementSibling")).filter(t || "*");
          }, html: function (t) {
            return 0 in arguments ? this.each(function (e) {
              var n = this.innerHTML; j(this).empty().append(v(this, t, e, n));
            }) : 0 in this ? this[0].innerHTML : null;
          }, text: function (t) {
            return 0 in arguments ? this.each(function (e) {
              var n = v(this, t, e, this.textContent); this.textContent = null == n ? "" : "" + n;
            }) : 0 in this ? this[0].textContent : null;
          }, attr: function (t, e) {
            var n; return "string" != typeof t || 1 in arguments ? this.each(function (n) {
              if (1 === this.nodeType) if (i(t)) for (E in t) g(this, E, t[E]); else g(this, t, v(this, e, n, this.getAttribute(t)));
            }) : this.length && 1 === this[0].nodeType ? !(n = this[0].getAttribute(t)) && t in this[0] ? this[0][t] : n : w;
          }, removeAttr: function (t) {
            return this.each(function () {
              1 === this.nodeType && t.split(" ").forEach(function (t) {
                g(this, t);
              }, this);
            });
          }, prop: function (t, e) {
            return t = Y[t] || t, 1 in arguments ? this.each(function (n) {
              this[t] = v(this, e, n, this[t]);
            }) : this[0] && this[0][t];
          }, data: function (t, e) {
            var n = "data-" + t.replace(k, "-$1").toLowerCase(),
              r = 1 in arguments ? this.attr(n, e) : this.attr(n); return null !== r ? x(r) : w;
          }, val: function (t) {
            return 0 in arguments ? this.each(function (e) {
              this.value = v(this, t, e, this.value);
            }) : this[0] && (this[0].multiple ? j(this[0]).find("option").filter(function () {
              return this.selected;
            }).pluck("value") : this[0].value);
          }, offset: function (t) {
            if (t) return this.each(function (e) {
              var n = j(this),
                r = v(this, t, e, n.offset()),
                i = n.offsetParent().offset(),
                o = { top: r.top - i.top, left: r.left - i.left }; "static" == n.css("position") && (o.position = "relative"), n.css(o);
            }); if (!this.length) return null; var e = this[0].getBoundingClientRect(); return { left: e.left + window.pageXOffset, top: e.top + window.pageYOffset, width: Math.round(e.width), height: Math.round(e.height) };
          }, css: function (e, n) {
            if (arguments.length < 2) {
              var r,
                i = this[0]; if (!i) return; if (r = getComputedStyle(i, ""), "string" == typeof e) return i.style[T(e)] || r.getPropertyValue(e); if (G(e)) {
                  var o = {}; return j.each(e, function (t, e) {
                    o[e] = i.style[T(e)] || r.getPropertyValue(e);
                  }), o;
                }
            } var a = ""; if ("string" == t(e)) n || 0 === n ? a = c(e) + ":" + f(e, n) : this.each(function () {
              this.style.removeProperty(c(e));
            }); else for (E in e) e[E] || 0 === e[E] ? a += c(E) + ":" + f(E, e[E]) + ";" : this.each(function () {
              this.style.removeProperty(c(E));
            }); return this.each(function () {
              this.style.cssText += ";" + a;
            });
          }, index: function (t) {
            return t ? this.indexOf(j(t)[0]) : this.parent().children().indexOf(this[0]);
          }, hasClass: function (t) {
            return !!t && N.some.call(this, function (t) {
              return this.test(y(t));
            }, l(t));
          }, addClass: function (t) {
            return t ? this.each(function (e) {
              if ("className" in this) {
                S = []; var n = y(this); v(this, t, e, n).split(/\s+/g).forEach(function (t) {
                  j(this).hasClass(t) || S.push(t);
                }, this), S.length && y(this, n + (n ? " " : "") + S.join(" "));
              }
            }) : this;
          }, removeClass: function (t) {
            return this.each(function (e) {
              if ("className" in this) {
                if (t === w) return y(this, ""); S = y(this), v(this, t, e, S).split(/\s+/g).forEach(function (t) {
                  S = S.replace(l(t), " ");
                }), y(this, S.trim());
              }
            });
          }, toggleClass: function (t, e) {
            return t ? this.each(function (n) {
              var r = j(this); v(this, t, n, y(this)).split(/\s+/g).forEach(function (t) {
                (e === w ? !r.hasClass(t) : e) ? r.addClass(t) : r.removeClass(t);
              });
            }) : this;
          }, scrollTop: function (t) {
            if (this.length) {
              var e = "scrollTop" in this[0]; return t === w ? e ? this[0].scrollTop : this[0].pageYOffset : this.each(e ? function () {
                this.scrollTop = t;
              } : function () {
                this.scrollTo(this.scrollX, t);
              });
            }
          }, scrollLeft: function (t) {
            if (this.length) {
              var e = "scrollLeft" in this[0]; return t === w ? e ? this[0].scrollLeft : this[0].pageXOffset : this.each(e ? function () {
                this.scrollLeft = t;
              } : function () {
                this.scrollTo(t, this.scrollY);
              });
            }
          }, position: function () {
            if (this.length) {
              var t = this[0],
                e = this.offsetParent(),
                n = this.offset(),
                r = R.test(e[0].nodeName) ? { top: 0, left: 0 } : e.offset(); return n.top -= parseFloat(j(t).css("margin-top")) || 0, n.left -= parseFloat(j(t).css("margin-left")) || 0, r.top += parseFloat(j(e[0]).css("border-top-width")) || 0, r.left += parseFloat(j(e[0]).css("border-left-width")) || 0, { top: n.top - r.top, left: n.left - r.left };
            }
          }, offsetParent: function () {
            return this.map(function () {
              for (var t = this.offsetParent || A.body; t && !R.test(t.nodeName) && "static" == j(t).css("position");) t = t.offsetParent; return t;
            });
          }
        }, j.fn.detach = j.fn.remove, ["width", "height"].forEach(function (t) {
          var e = t.replace(/./, function (t) {
            return t[0].toUpperCase();
          }); j.fn[t] = function (i) {
            var o,
              a = this[0]; return i === w ? n(a) ? a["inner" + e] : r(a) ? a.documentElement["scroll" + e] : (o = this.offset()) && o[t] : this.each(function (e) {
                a = j(this), a.css(t, v(this, i, e, a[t]()));
              });
          };
        }), F.forEach(function (e, n) {
          var r = n % 2; j.fn[e] = function () {
            var e,
              i,
              o = j.map(arguments, function (n) {
                return e = t(n), "object" == e || "array" == e || null == n ? n : X.fragment(n);
              }),
              a = this.length > 1; return o.length < 1 ? this : this.each(function (t, e) {
                i = r ? e : e.parentNode, e = 0 == n ? e.nextSibling : 1 == n ? e.firstChild : 2 == n ? e : null; var s = j.contains(A.documentElement, i); o.forEach(function (t) {
                  if (a) t = t.cloneNode(!0); else if (!i) return j(t).remove(); i.insertBefore(t, e), s && b(t, function (t) {
                    null == t.nodeName || "SCRIPT" !== t.nodeName.toUpperCase() || t.type && "text/javascript" !== t.type || t.src || window.eval.call(window, t.innerHTML);
                  });
                });
              });
          }, j.fn[r ? e + "To" : "insert" + (n ? "Before" : "After")] = function (t) {
            return j(t)[e](this), this;
          };
        }), X.Z.prototype = j.fn, X.uniq = C, X.deserializeValue = x, j.zepto = X, j;
    }(); window.Zepto = Zepto, void 0 === window.$ && (window.$ = Zepto), function (t) {
      function e(t) {
        return t._zid || (t._zid = h++);
      } function n(t, n, o, a) {
        if (n = r(n), n.ns) var s = i(n.ns); return (v[e(t)] || []).filter(function (t) {
          return !(!t || n.e && t.e != n.e || n.ns && !s.test(t.ns) || o && e(t.fn) !== e(o) || a && t.sel != a);
        });
      } function r(t) {
        var e = ("" + t).split("."); return { e: e[0], ns: e.slice(1).sort().join(" ") };
      } function i(t) {
        return new RegExp("(?:^| )" + t.replace(" ", " .* ?") + "(?: |$)");
      } function o(t, e) {
        return t.del && !y && t.e in x || !!e;
      } function a(t) {
        return b[t] || y && x[t] || t;
      } function s(n, i, s, u, l, h, p) {
        var d = e(n),
          m = v[d] || (v[d] = []); i.split(/\s/).forEach(function (e) {
            if ("ready" == e) return t(document).ready(s); var i = r(e); i.fn = s, i.sel = l, i.e in b && (s = function (e) {
              var n = e.relatedTarget; return !n || n !== this && !t.contains(this, n) ? i.fn.apply(this, arguments) : void 0;
            }), i.del = h; var d = h || s; i.proxy = function (t) {
              if (t = c(t), !t.isImmediatePropagationStopped()) {
                t.data = u; var e = d.apply(n, t._args == f ? [t] : [t].concat(t._args)); return !1 === e && (t.preventDefault(), t.stopPropagation()), e;
              }
            }, i.i = m.length, m.push(i), "addEventListener" in n && n.addEventListener(a(i.e), i.proxy, o(i, p));
          });
      } function u(t, r, i, s, u) {
        var c = e(t); (r || "").split(/\s/).forEach(function (e) {
          n(t, e, i, s).forEach(function (e) {
            delete v[c][e.i], "removeEventListener" in t && t.removeEventListener(a(e.e), e.proxy, o(e, u));
          });
        });
      } function c(e, n) {
        return (n || !e.isDefaultPrevented) && (n || (n = e), t.each(S, function (t, r) {
          var i = n[t]; e[t] = function () {
            return this[r] = w, i && i.apply(n, arguments);
          }, e[r] = E;
        }), (n.defaultPrevented !== f ? n.defaultPrevented : "returnValue" in n ? !1 === n.returnValue : n.getPreventDefault && n.getPreventDefault()) && (e.isDefaultPrevented = w)), e;
      } function l(t) {
        var e,
          n = { originalEvent: t }; for (e in t) j.test(e) || t[e] === f || (n[e] = t[e]); return c(n, t);
      } var f,
        h = 1,
        p = Array.prototype.slice,
        d = t.isFunction,
        m = function (t) {
          return "string" == typeof t;
        },
        v = {},
        g = {},
        y = "onfocusin" in window,
        x = { focus: "focusin", blur: "focusout" },
        b = { mouseenter: "mouseover", mouseleave: "mouseout" }; g.click = g.mousedown = g.mouseup = g.mousemove = "MouseEvents", t.event = { add: s, remove: u }, t.proxy = function (n, r) {
          var i = 2 in arguments && p.call(arguments, 2); if (d(n)) {
            var o = function () {
              return n.apply(r, i ? i.concat(p.call(arguments)) : arguments);
            }; return o._zid = e(n), o;
          } if (m(r)) return i ? (i.unshift(n[r], n), t.proxy.apply(null, i)) : t.proxy(n[r], n); throw new TypeError("expected function");
        }, t.fn.bind = function (t, e, n) {
          return this.on(t, e, n);
        }, t.fn.unbind = function (t, e) {
          return this.off(t, e);
        }, t.fn.one = function (t, e, n, r) {
          return this.on(t, e, n, r, 1);
        }; var w = function () {
          return !0;
        },
          E = function () {
            return !1;
          },
          j = /^([A-Z]|returnValue$|layer[XY]$)/,
          S = { preventDefault: "isDefaultPrevented", stopImmediatePropagation: "isImmediatePropagationStopped", stopPropagation: "isPropagationStopped" }; t.fn.delegate = function (t, e, n) {
            return this.on(e, t, n);
          }, t.fn.undelegate = function (t, e, n) {
            return this.off(e, t, n);
          }, t.fn.live = function (e, n) {
            return t(document.body).delegate(this.selector, e, n), this;
          }, t.fn.die = function (e, n) {
            return t(document.body).undelegate(this.selector, e, n), this;
          }, t.fn.on = function (e, n, r, i, o) {
            var a,
              c,
              h = this; return e && !m(e) ? (t.each(e, function (t, e) {
                h.on(t, n, r, e, o);
              }), h) : (m(n) || d(i) || !1 === i || (i = r, r = n, n = f), (d(r) || !1 === r) && (i = r, r = f), !1 === i && (i = E), h.each(function (f, h) {
                o && (a = function (t) {
                  return u(h, t.type, i), i.apply(this, arguments);
                }), n && (c = function (e) {
                  var r,
                    o = t(e.target).closest(n, h).get(0); return o && o !== h ? (r = t.extend(l(e), { currentTarget: o, liveFired: h }), (a || i).apply(o, [r].concat(p.call(arguments, 1)))) : void 0;
                }), s(h, e, i, r, n, c || a);
              }));
          }, t.fn.off = function (e, n, r) {
            var i = this; return e && !m(e) ? (t.each(e, function (t, e) {
              i.off(t, n, e);
            }), i) : (m(n) || d(r) || !1 === r || (r = n, n = f), !1 === r && (r = E), i.each(function () {
              u(this, e, r, n);
            }));
          }, t.fn.trigger = function (e, n) {
            return e = m(e) || t.isPlainObject(e) ? t.Event(e) : c(e), e._args = n, this.each(function () {
              e.type in x && "function" == typeof this[e.type] ? this[e.type]() : "dispatchEvent" in this ? this.dispatchEvent(e) : t(this).triggerHandler(e, n);
            });
          }, t.fn.triggerHandler = function (e, r) {
            var i, o; return this.each(function (a, s) {
              i = l(m(e) ? t.Event(e) : e), i._args = r, i.target = s, t.each(n(s, e.type || e), function (t, e) {
                return o = e.proxy(i), !i.isImmediatePropagationStopped() && void 0;
              });
            }), o;
          }, "focusin focusout focus blur load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function (e) {
            t.fn[e] = function (t) {
              return 0 in arguments ? this.bind(e, t) : this.trigger(e);
            };
          }), t.Event = function (t, e) {
            m(t) || (e = t, t = e.type); var n = document.createEvent(g[t] || "Events"),
              r = !0; if (e) for (var i in e) "bubbles" == i ? r = !!e[i] : n[i] = e[i]; return n.initEvent(t, r, !0), c(n);
          };
    }(Zepto), function (t) {
      function e(e, n, r) {
        var i = t.Event(n); return t(e).trigger(i, r), !i.isDefaultPrevented();
      } function n(t, n, r, i) {
        return t.global ? e(n || y, r, i) : void 0;
      } function r(e) {
        e.global && 0 == t.active++ && n(e, null, "ajaxStart");
      } function i(e) {
        e.global && ! --t.active && n(e, null, "ajaxStop");
      } function o(t, e) {
        var r = e.context; return !1 !== e.beforeSend.call(r, t, e) && !1 !== n(e, r, "ajaxBeforeSend", [t, e]) && void n(e, r, "ajaxSend", [t, e]);
      } function a(t, e, r, i) {
        var o = r.context,
          a = "success"; r.success.call(o, t, a, e), i && i.resolveWith(o, [t, a, e]), n(r, o, "ajaxSuccess", [e, r, t]), u(a, e, r);
      } function s(t, e, r, i, o) {
        var a = i.context; i.error.call(a, r, e, t), o && o.rejectWith(a, [r, e, t]), n(i, a, "ajaxError", [r, i, t || e]), u(e, r, i);
      } function u(t, e, r) {
        var o = r.context; r.complete.call(o, e, t), n(r, o, "ajaxComplete", [e, r]), i(r);
      } function c() { } function l(t) {
        return t && (t = t.split(";", 2)[0]), t && (t == j ? "html" : t == E ? "json" : b.test(t) ? "script" : w.test(t) && "xml") || "text";
      } function f(t, e) {
        return "" == e ? t : (t + "&" + e).replace(/[&?]{1,2}/, "?");
      } function h(e) {
        e.processData && e.data && "string" != t.type(e.data) && (e.data = t.param(e.data, e.traditional)), !e.data || e.type && "GET" != e.type.toUpperCase() || (e.url = f(e.url, e.data), e.data = void 0);
      } function p(e, n, r, i) {
        return t.isFunction(n) && (i = r, r = n, n = void 0), t.isFunction(r) || (i = r, r = void 0), { url: e, data: n, success: r, dataType: i };
      } function d(e, n, r, i) {
        var o,
          a = t.isArray(n),
          s = t.isPlainObject(n); t.each(n, function (n, u) {
            o = t.type(u), i && (n = r ? i : i + "[" + (s || "object" == o || "array" == o ? n : "") + "]"), !i && a ? e.add(u.name, u.value) : "array" == o || !r && "object" == o ? d(e, u, r, n) : e.add(n, u);
          });
      } var m,
        v,
        g = 0,
        y = window.document,
        x = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        b = /^(?:text|application)\/javascript/i,
        w = /^(?:text|application)\/xml/i,
        E = "application/json",
        j = "text/html",
        S = /^\s*$/,
        T = y.createElement("a"); T.href = window.location.href, t.active = 0, t.ajaxJSONP = function (e, n) {
          if (!("type" in e)) return t.ajax(e); var r,
            i,
            u = e.jsonpCallback,
            c = (t.isFunction(u) ? u() : u) || "jsonp" + ++g,
            l = y.createElement("script"),
            f = window[c],
            h = function (e) {
              t(l).triggerHandler("error", e || "abort");
            },
            p = { abort: h }; return n && n.promise(p), t(l).on("load error", function (o, u) {
              clearTimeout(i), t(l).off().remove(), "error" != o.type && r ? a(r[0], p, e, n) : s(null, u || "error", p, e, n), window[c] = f, r && t.isFunction(f) && f(r[0]), f = r = void 0;
            }), !1 === o(p, e) ? (h("abort"), p) : (window[c] = function () {
              r = arguments;
            }, l.src = e.url.replace(/\?(.+)=\?/, "?$1=" + c), y.head.appendChild(l), e.timeout > 0 && (i = setTimeout(function () {
              h("timeout");
            }, e.timeout)), p);
        }, t.ajaxSettings = {
          type: "GET", beforeSend: c, success: c, error: c, complete: c, context: null, global: !0, xhr: function () {
            return new window.XMLHttpRequest();
          }, accepts: { script: "text/javascript, application/javascript, application/x-javascript", json: E, xml: "application/xml, text/xml", html: j, text: "text/plain" }, crossDomain: !1, timeout: 0, processData: !0, cache: !0
        }, t.ajax = function (e) {
          var n,
            i = t.extend({}, e || {}),
            u = t.Deferred && t.Deferred(); for (m in t.ajaxSettings) void 0 === i[m] && (i[m] = t.ajaxSettings[m]); r(i), i.crossDomain || (n = y.createElement("a"), n.href = i.url, n.href = n.href, i.crossDomain = T.protocol + "//" + T.host != n.protocol + "//" + n.host), i.url || (i.url = window.location.toString()), h(i); var p = i.dataType,
              d = /\?.+=\?/.test(i.url); if (d && (p = "jsonp"), !1 !== i.cache && (e && !0 === e.cache || "script" != p && "jsonp" != p) || (i.url = f(i.url, "_=" + Date.now())), "jsonp" == p) return d || (i.url = f(i.url, i.jsonp ? i.jsonp + "=?" : !1 === i.jsonp ? "" : "callback=?")), t.ajaxJSONP(i, u); var g,
                x = i.accepts[p],
                b = {},
                w = function (t, e) {
                  b[t.toLowerCase()] = [t, e];
                },
                E = /^([\w-]+:)\/\//.test(i.url) ? RegExp.$1 : window.location.protocol,
                j = i.xhr(),
                C = j.setRequestHeader; if (u && u.promise(j), i.crossDomain || w("X-Requested-With", "XMLHttpRequest"), w("Accept", x || "*/*"), (x = i.mimeType || x) && (x.indexOf(",") > -1 && (x = x.split(",", 2)[0]), j.overrideMimeType && j.overrideMimeType(x)), (i.contentType || !1 !== i.contentType && i.data && "GET" != i.type.toUpperCase()) && w("Content-Type", i.contentType || "application/x-www-form-urlencoded"), i.headers) for (v in i.headers) w(v, i.headers[v]); if (j.setRequestHeader = w, j.onreadystatechange = function () {
                  if (4 == j.readyState) {
                    j.onreadystatechange = c, clearTimeout(g); var e,
                      n = !1; if (j.status >= 200 && j.status < 300 || 304 == j.status || 0 == j.status && "file:" == E) {
                        p = p || l(i.mimeType || j.getResponseHeader("content-type")), e = j.responseText; try {
                          "script" == p ? (0, eval)(e) : "xml" == p ? e = j.responseXML : "json" == p && (e = S.test(e) ? null : t.parseJSON(e));
                        } catch (t) {
                          n = t;
                        } n ? s(n, "parsererror", j, i, u) : a(e, j, i, u);
                      } else s(j.statusText || null, j.status ? "error" : "abort", j, i, u);
                  }
                }, !1 === o(j, i)) return j.abort(), s(null, "abort", j, i, u), j; if (i.xhrFields) for (v in i.xhrFields) j[v] = i.xhrFields[v]; var N = !("async" in i) || i.async; j.open(i.type, i.url, N, i.username, i.password); for (v in b) C.apply(j, b[v]); return i.timeout > 0 && (g = setTimeout(function () {
                  j.onreadystatechange = c, j.abort(), s(null, "timeout", j, i, u);
                }, i.timeout)), j.send(i.data ? i.data : null), j;
        }, t.get = function () {
          return t.ajax(p.apply(null, arguments));
        }, t.post = function () {
          var e = p.apply(null, arguments); return e.type = "POST", t.ajax(e);
        }, t.getJSON = function () {
          var e = p.apply(null, arguments); return e.dataType = "json", t.ajax(e);
        }, t.fn.load = function (e, n, r) {
          if (!this.length) return this; var i,
            o = this,
            a = e.split(/\s/),
            s = p(e, n, r),
            u = s.success; return a.length > 1 && (s.url = a[0], i = a[1]), s.success = function (e) {
              o.html(i ? t("<div>").html(e.replace(x, "")).find(i) : e), u && u.apply(o, arguments);
            }, t.ajax(s), this;
        }; var C = encodeURIComponent; t.param = function (e, n) {
          var r = []; return r.add = function (e, n) {
            t.isFunction(n) && (n = n()), null == n && (n = ""), this.push(C(e) + "=" + C(n));
          }, d(r, e, n), r.join("&").replace(/%20/g, "+");
        };
    }(Zepto), function (t) {
      t.fn.serializeArray = function () {
        var e,
          n,
          r = [],
          i = function (t) {
            return t.forEach ? t.forEach(i) : void r.push({ name: e, value: t });
          }; return this[0] && t.each(this[0].elements, function (r, o) {
            n = o.type, (e = o.name) && "fieldset" != o.nodeName.toLowerCase() && !o.disabled && "submit" != n && "reset" != n && "button" != n && "file" != n && ("radio" != n && "checkbox" != n || o.checked) && i(t(o).val());
          }), r;
      }, t.fn.serialize = function () {
        var t = []; return this.serializeArray().forEach(function (e) {
          t.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
        }), t.join("&");
      }, t.fn.submit = function (e) {
        if (0 in arguments) this.bind("submit", e); else if (this.length) {
          var n = t.Event("submit"); this.eq(0).trigger(n), n.isDefaultPrevented() || this.get(0).submit();
        } return this;
      };
    }(Zepto), function (t) {
      "__proto__" in {} || t.extend(t.zepto, {
        Z: function (e, n) {
          return e = e || [], t.extend(e, t.fn), e.selector = n || "", e.__Z = !0, e;
        }, isZ: function (e) {
          return "array" === t.type(e) && "__Z" in e;
        }
      }); try {
        getComputedStyle(void 0);
      } catch (t) {
        var e = getComputedStyle; window.getComputedStyle = function (t) {
          try {
            return e(t);
          } catch (t) {
            return null;
          }
        };
      }
    }(Zepto);
  }, {}]
}, {}, [1])
