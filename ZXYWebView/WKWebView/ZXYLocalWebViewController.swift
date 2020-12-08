//
//  ZXYLocalWebViewController.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit
import WebKit

public class ZXYLocalWebViewController: ZXYWebViewController {
    
    var dataId: Int = 0
    #warning("枚举类型，代表消息的类型，根据枚举类型去加载相应的js，css，html等")
    var newsType: NewsTypeEnum = .unknown
    var shareURL: String?
    var isShowBroker: Bool = true
    var newsJson: String = ""
    var noticesEntity: NewsNoticesEntity?

    override public func viewDidLoad() {
        super.viewDidLoad()
        self.setNavBar()
        
        loadNewsWebFiles()
        loadNewsJson()

    }
    
    public func set(dataId: Int, type: NewsTypeEnum, isShowBroker: Bool = false, shareURL: String? = nil) {
        self.dataId = dataId
        self.newsType = type
        self.isShowBroker = isShowBroker
        self.shareURL = shareURL
    }
    
    func setNavBar() {
        self.navBar.removeFromSuperview()
        self.bl_naviBarHidden = false
        self.isHideTitle = true
        self.title = newsType.name

    }
    
    @objc private func onClickShareItem() {
        var shareURL: String?
        switch newsType {
        
        case .IBPolicy:
            #warning("使用自己的请求连接")
            shareURL = ZXYApi.h5.brokerIBPolicyShareURL(id: dataId)
            self.showShareView(shareURL: shareURL, isBannerOrTopic: false)
        
        case .bannerDetail:
            shareURL = self.shareURL
            self.showShareView(shareURL: shareURL, isBannerOrTopic: true)
            
        case .topic:
            shareURL = ZXYApi.h5.topicShareAddress(dataId)
            self.showShareView(shareURL: shareURL, isBannerOrTopic: true)
            
        default:
            break
        }
        
        
    }
    
    func showShareView(shareURL: String?, isBannerOrTopic: Bool) {
        guard let newsEntity = self.noticesEntity else {return}
        
        
    }
    
    func loadNewsWebFiles() {
        let bundle = Bundle(for: ZXYLocalWebViewController.self)
        var htmlName: String?
        switch newsType {
        case .dealerComments, .dealerActivity, .dealerAnnouncement:
            htmlName = "dealerNews"
            
        default:
            htmlName = "industryNews"
        }
        guard let path = bundle.path(forResource: htmlName, ofType: "html") else {
            return
        }
        
        DispatchQueue.global().async {
            guard let htmlString = try? String(contentsOfFile: path, encoding: String.Encoding.utf8) else {
                return
            }
            DispatchQueue.main.async {
                let baseURL = URL(fileURLWithPath: path, isDirectory: false)
                self.webView?.loadHTMLString(htmlString, baseURL: baseURL)
            }
        }
    }

    public override func loadNewsJSMethod() {
        super.loadNewsJSMethod()
        let traderInfoCard = self.isShowBroker ? 1 : 0
        #warning("相应的调用JS方法")
        self.callJSMethod(name: "loadNewsJson(\(newsJson), \(traderInfoCard))")
    }
}

extension ZXYLocalWebViewController {
    
    func loadNewsJson() {
        let request = BLRequestEntity()
        
        switch newsType {
        #warning("使用自己的请求连接")
        case .brokerIntroduction:
            request.api = ZXYApi.broker.BrokerIntroductionApi
            request.params = ["brokerId": dataId, "type": 1, "contentType": 1]
            
        default:
            request.api = ZXYApi.home.HomeNewsDetailApi
            request.params = ["id": dataId]
        }
        
        ZXYHttpManager.shared.get(request: request, success: { (response) in
            guard response.code == HttpRequestResult.success, let newsData = response.bodyMessage, !newsData.isEmpty else {
                self.view.addPlaceholder(type: .noData)
                return
            }
            
            self.view.removePlaceholder()
            switch self.newsType {
            case .coolForeignCurrency:
                self.noticesEntity = NewsNoticesEntity.deserialize(from: newsData, designatedPath: "NewsDetail")
                
            case .IBPolicy, .bannerDetail, .brokerIntroduction,.topic:
                self.noticesEntity = NewsNoticesEntity.deserialize(from: newsData)
                
            default:
                self.noticesEntity = NewsNoticesEntity.deserialize(from: newsData, designatedPath: "Notices")
            }
            
            self.newsJson = newsData
            if self.isFinished {
                let traderInfoCard = self.isShowBroker ? 1 : 0
                self.callJSMethod(name: "loadNewsJson(\(newsData), \(traderInfoCard), \(self.isShowSourceRegulator))")
            }
            
        }, failure: { (error) in
            self.showToast(message: error)
            self.view.addPlaceholder(type: .webviewLoadFail, handler: {[weak self] in
                self?.loadNewsJson()
            })
        }, completed: {
            
        })
    }
}


class NewsNoticesEntity: ZXYBaseEntity {
    var id: Int = 0
    var newsId: Int = 0
    var noticeId: Int = 0
    var category: Int = 0
    var brokerId: Int = 0
    var title: String?
    var TitleImg: String?
    var titleImgR: String?
    var titleImgS: String?
    var summary: String?
}
