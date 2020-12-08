//
//  ZXYWebViewHandle.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit

class WebImageEntity: ZXYBaseEntity {//换成自己的第三方解析，本人用的是HandyJson
    var index: Int = -1
    var imageArray: [String] = []
}

class WebVideoEntity: ZXYBaseEntity {
    var videoUrl: String = ""
    var videoDuration: Float = 0.0
}


struct WebScriptMessage {
    static let close = "clickClose"                    // 关闭
    static let exit = "exitPage"                       // 退出
    static let authLogin = "authLoginSuccess"          // 授权登录
    static let reload = "clickDownload"                // 加载数据
    static let headData = "HeaderData"                 // 导航栏信息数据
    static let brokerDetail = "openDealerDetailsPage"  // 交易商详情

}

class WebScriptHandle: NSObject {
    
    /// 关闭
    static func closeWebView(bodyMessage: Any) {
//         UIViewController.current()?.navigationController?.popViewController(animated: true)
    }

    /// 新闻图片浏览
    static func newsImageBrowse(_ bodyMessage: Any) {
        guard let message = bodyMessage as? String else {return}
    }
//        if let newsImageEntity = WebImageEntity.deserialize(from: message), !newsImageEntity.imageArray.isEmpty {
//            let imageBrowse = ZXYImageBrowseView()
//            let toolBar = ZXYImageBrowserToolBar(leftBtnImage: R.image.assistant_back_white(), indexTextColor: UIColor.white, rightBtnTitle: nil, rightBtnImage: nil)
//            toolBar.backgroundColor = UIColor.init(white: 0, alpha: 0.7)
//            imageBrowse.show(imageURLs: newsImageEntity.imageArray , index: newsImageEntity.index, sourceView: nil, toolBar: toolBar)
//            toolBar.onClickLeftBtnHandle = { [weak imageBrowse] in
//                imageBrowse?.hide()
//            }
}
