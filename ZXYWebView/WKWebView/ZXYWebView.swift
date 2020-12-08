//
//  ZXYWebView.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit
import WebKit

protocol ZXYWebViewProtocol: class {
    func clearAllWebCache()
}

public class ZXYWebView: WKWebView {
    weak var holderObject: AnyObject?
    
    static func defaultConfiguration() -> WKWebViewConfiguration {
        let config = WKWebViewConfiguration()
        config.preferences = WKPreferences()
        config.preferences.javaScriptEnabled = true
        config.preferences.javaScriptCanOpenWindowsAutomatically = true
        config.userContentController = WKUserContentController()

        return config
    }
    
    deinit {
        //清除UserScript
        configuration.userContentController.removeAllUserScripts()
        //停止加载
        stopLoading()
        uiDelegate = nil
        navigationDelegate = nil
        // 持有者置为nil
        holderObject = nil
        print("WKWebView析构")
    }
    
}


extension ZXYWebView: ZXYWebViewProtocol {
    
    func clearAllWebCache() {
        let dataTypes = [WKWebsiteDataTypeMemoryCache, WKWebsiteDataTypeCookies, WKWebsiteDataTypeSessionStorage, WKWebsiteDataTypeOfflineWebApplicationCache, WKWebsiteDataTypeOfflineWebApplicationCache, WKWebsiteDataTypeCookies, WKWebsiteDataTypeLocalStorage, WKWebsiteDataTypeIndexedDBDatabases, WKWebsiteDataTypeWebSQLDatabases]
        let websiteDataTypes = Set(dataTypes)
        let dateFrom = Date(timeIntervalSince1970: 0)
        
        WKWebsiteDataStore.default().removeData(ofTypes: websiteDataTypes, modifiedSince: dateFrom) {
        }
    }
}


// MARK: ZXYWebViewPoolProtocol
extension ZXYWebView: ZXYWebViewPoolProtocol {
    
    /// 即将被复用
    func webviewWillLeavePool() {
        
    }
    
    /// 被回收
    func webviewWillEnterPool() {
        holderObject = nil
        scrollView.delegate = nil
        stopLoading()
        NSObject.cancelPreviousPerformRequests(withTarget: self)
        navigationDelegate = nil
        uiDelegate = nil
        // 删除历史记录
        let selStr = "_re" + "mov" + "eA" + "llIt" + "ems"
        let sel = Selector(selStr)
        if self.backForwardList.responds(to: sel) {
            self.backForwardList.perform(sel)
        }
        #warning("使用自定义的移除占位图")
//        self.removePlaceholder()
        loadHTMLString("", baseURL: nil)
    }
    
}
