//
//  ZXYWebViewPool.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit


protocol ZXYWebViewPoolProtocol: class {
    func webviewWillLeavePool()
    func webviewWillEnterPool()
}


public class ZXYWebViewPool: NSObject {

    // 当前有被页面持有的webview
    fileprivate var visiableWebViewSet = Set<ZXYWebView>()
    // 回收池中的webview
    fileprivate var reusableWebViewSet = Set<ZXYWebView>()
    
    fileprivate let lock = DispatchSemaphore(value: 1)

    public static let shared = ZXYWebViewPool()
    
    public override init() {
        super.init()
        // 监听内存警告，清除复用池
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(didReceiveMemoryWarningNotification),
                                               name: UIApplication.didReceiveMemoryWarningNotification,
                                               object: nil)
        // 监听首页初始化完成
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(mainControllerInit),
                                               name: NSNotification.Name(kMainControllerInitSuccessNotiKey),
                                               object: nil)
    }
    
    deinit {
        // 清除set
    }
}


// MARK: Observers
extension ZXYWebViewPool {
    
    @objc func mainControllerInit() {
        DispatchQueue.main.asyncAfter(deadline: DispatchTime.now() + 0.25) {
            self.prepareReuseWebView()
        }
    }
    
    @objc fileprivate func didReceiveMemoryWarningNotification() {
        lock.wait()
        reusableWebViewSet.removeAll()
        lock.signal()
    }
}


// MARK: Assistant
extension ZXYWebViewPool {
    
    /// 使用中的webView持有者已销毁，则放回可复用池中
    func tryCompactWeakHolders() {
        lock.wait()
        let shouldReusedWebViewSet = visiableWebViewSet.filter{ $0.holderObject == nil }
        for webView in shouldReusedWebViewSet {
            webView.webviewWillEnterPool()
            visiableWebViewSet.remove(webView)
            reusableWebViewSet.insert(webView)
        }
        lock.signal()
    }
    
    /// 预备一个空的webview
    func prepareReuseWebView() {
        guard reusableWebViewSet.count <= 0 else { return }
        let webview = ZXYWebView(frame: CGRect.zero, configuration: ZXYWebView.defaultConfiguration())
        self.reusableWebViewSet.insert(webview)
    }
}


// MARK: 复用池管理
public extension ZXYWebViewPool {
    
    /// 获取可复用的webView
    func getReusedWebView(forHolder holder: AnyObject?) -> ZXYWebView {
        assert(holder != nil, "ZXYWebView holder不能为nil")
        guard let holder = holder else {
            return ZXYWebView(frame: CGRect.zero, configuration: ZXYWebView.defaultConfiguration())
        }
        
        tryCompactWeakHolders()
        let webView: ZXYWebView
        lock.wait()
        if reusableWebViewSet.count > 0 {
            // 缓存池中有
            webView = reusableWebViewSet.randomElement()!
            reusableWebViewSet.remove(webView)
            visiableWebViewSet.insert(webView)
            // 出回收池前初始化
            webView.webviewWillLeavePool()
        } else {
            // 缓存池没有，创建新的
            webView = ZXYWebView(frame: CGRect.zero, configuration: ZXYWebView.defaultConfiguration())
            visiableWebViewSet.insert(webView)
        }
        
        webView.holderObject = holder
        lock.signal()
        
        return webView
    }
    
    /// 回收可复用的webView到复用池中
    func recycleReusedWebView(_ webView: ZXYWebView?) {
        guard let webView = webView else { return }
        lock.wait()
        // 存在于当前使用中，则回收
        if visiableWebViewSet.contains(webView) {
            // 进入回收池前清理
            webView.webviewWillEnterPool()
            visiableWebViewSet.remove(webView)
            reusableWebViewSet.insert(webView)
        }
        lock.signal()
    }
    
    /// 移除并销毁所有复用池的webView
    func clearAllReusableWebViews() {
        lock.wait()
        for webview in reusableWebViewSet {
            webview.webviewWillEnterPool()
        }
        reusableWebViewSet.removeAll()
        lock.signal()
    }
}
