//
//  ZXYWebViewController.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit
import WebKit

public class ZXYWebViewController: UIViewController {
    
    /// 网页加载完回调
    public var webViewDidLoadHandle:(()->Void)?
    
    // 是否显示进度条
    public var showProgress: Bool = false
    // 进度条颜色
    public var progressColor: UIColor = UIColor.black
    /// 超时时间
    public var timeoutInternal: TimeInterval = 15
    /// 是否加载中
    var isLoading: Bool {
        return webView?.isLoading ?? false
    }

    // 客户端外部设置的title，优先级最高，有设置则忽略H5设置的标题
    fileprivate var nativeTitle: String?
    
    var navBarHidden: Bool = false
    /// 是否加载完成
    var isFinished: Bool = false
    
    /// 是否隐藏标题
    public var isHideTitle: Bool = false
    
    /// 是否显示骨架动画
    public var isShowFrameworkLoading: Bool = true
    
    fileprivate var marginTop: CGFloat = 0
    
    fileprivate var request: URLRequest?
        
    var webView: ZXYWebView?
    #warning("使用自己项目的占位View")
    fileprivate var errorView: ZXYPlaceholderView?
    
    lazy var progressView: UIProgressView = {
        let progressV = UIProgressView()
        progressV.isHidden = true
        return progressV
    }()
    
    lazy var navBar: ZXYWebNavigationBar = {
        let bar = ZXYWebNavigationBar()
        bar.btnClickHandle = { [weak self] (entity) in
            self?.onNavBarButtonClick(entity: entity)
        }
        return bar
    }()
    
    /// 是否使用系统的导航栏显示客户端定义的标题，当外部有设置nativeTitle且不隐藏导航栏时为true
    fileprivate var useNativeNavigationBarTitle: Bool {
        return (nativeTitle != nil && navBarHidden == false)
    }
    
    /// 初始化web控制器with url
    /// - Parameter url: url
    /// - Parameter nativeTitle: 客户端外部设置的title，优先级最高，有设置则忽略H5设置的标题
    convenience public init(with url: URL, nativeTitle: String? = nil) {
        let request = URLRequest(url: url)
        self.init(with: request, nativeTitle: nativeTitle)
    }
    
    /// 初始化web控制器with url字符串
    /// - Parameter urlString: urlString 字符串
    /// - Parameter nativeTitle: 客户端外部设置的title，优先级最高，有设置则忽略H5设置的标题
    convenience public init(with urlString: String, nativeTitle: String? = nil) {
        if let url = URL(string: urlString) {
            self.init(with: url, nativeTitle: nativeTitle)
        } else {
            self.init()
        }
    }
    
    /// 初始化web控制器with request
    /// - Parameter request: request
    /// - Parameter nativeTitle: 客户端外部设置的title，优先级最高，有设置则忽略H5设置的标题
    convenience public init(with request: URLRequest, nativeTitle: String? = nil) {
        self.init()
        self.request = request
        self.nativeTitle = nativeTitle
    }
    
    override public func viewDidLoad() {
        super.viewDidLoad()
        self.setupBaseData()
        
        if useNativeNavigationBarTitle {
            self.title = nativeTitle
        } else {
            // 隐藏系统的导航栏，设置自定义的由H5控制的导航栏
            self.setupNavgationBar()
        }
        self.setupSubviews()
        self.setupObservers()
        if useNativeNavigationBarTitle == false {
            // 把自定义导航栏置顶
            self.view.bringSubviewToFront(navBar)
        }
        self.view.bringSubviewToFront(progressView)

        if var request = request {
            if isShowFrameworkLoading {
            }
            request.timeoutInterval = timeoutInternal
            webView?.load(request)
        }
                
    }
    
    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.addScriptMessageHandler()
        // 可能白屏
        if webView?.title == nil {
            webView?.reload()
        }
    }
    
    public override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        self.removeScriptMessageHandler()
    }
    
    /// 调用 JS 方法
    ///
    /// - Parameter name: 方法名
    public func callJSMethod(name: String) {
        if !isFinished {return}
        self.webView?.evaluateJavaScript(name, completionHandler: { (_, error) in
            if error != nil {
                // self.showErrorHUD(message: "操作失败", image: #imageLiteral(resourceName: "MBHUD_Error"))
            }
        })
    }
    
    open func loadNewsJSMethod() {
        
    }
    
    deinit {
        if showProgress {
             webView?.removeObserver(self, forKeyPath: "estimatedProgress")
        }
        webView?.removeObserver(self, forKeyPath: "title")
        ZXYWebViewPool.shared.tryCompactWeakHolders()
    }
}

// MARK: - Assistant
fileprivate extension ZXYWebViewController {
    
    func setupBaseData() {
        
        navBarHidden = self.bl_naviBarHidden
        if navBarHidden == true {
            self.marginTop = kSafeAreaTopInset
        } else {
            self.marginTop = kNavigationBarHeight
        }
        
        if useNativeNavigationBarTitle == false {
            navBar.isHidden = navBarHidden
        }
    }
    
    func setupNavgationBar() {
        
        self.bl_naviBarHidden = true
        view.addSubview(navBar)
        navBar.backgroundColor = UIColor.white
        navBar.frame = CGRect(x: 0, y: 0, width: self.view.bounds.size.width, height: kNavigationBarHeight)
    }
    
    func setupSubviews() {
        self.view.backgroundColor = .white
        self.setupWebview()
        
        self.progressView.frame = CGRect(x: 0, y: marginTop, width: webView!.frame.size.width, height: 3)
        self.progressView.trackTintColor = UIColor.white
        self.progressView.progressTintColor = UIColor.black
        self.view.addSubview(progressView)
        progressView.isHidden = !showProgress
    }
    
    func setupWebview() {
        
        webView = ZXYWebViewPool.shared.getReusedWebView(forHolder: self)
        self.view.addSubview(webView!)
        #warning("使用SnipKit")

        webView?.snp.remakeConstraints({ (make) in
            make.top.equalToSuperview().offset(marginTop)
            make.left.right.equalToSuperview()
            make.height.equalTo(kScreenHeight - marginTop)
        })

        if #available(iOS 11.0, *) {
            webView!.scrollView.contentInsetAdjustmentBehavior = .never
        }else {
            self.automaticallyAdjustsScrollViewInsets = false
        }
        webView!.scrollView.contentInset = UIEdgeInsets(top: 0, left: 0, bottom: kSafeAreaBottomInset, right: 0)
        webView!.scrollView.showsVerticalScrollIndicator = true
        webView!.scrollView.showsHorizontalScrollIndicator = false
        webView!.scrollView.maximumZoomScale = 1
        webView!.scrollView.bouncesZoom = false
        // 手势交互
        webView!.allowsBackForwardNavigationGestures = true
        webView!.navigationDelegate = self
        webView!.uiDelegate = self
       
    }
    
    func setupObservers() {
        if showProgress == true {
            webView!.addObserver(self, forKeyPath: "estimatedProgress", options: .new, context: nil)
        }
        webView!.addObserver(self, forKeyPath: "title", options: .new, context: nil)
    }
    
    func addScriptMessageHandler() {
        webView?.configuration.userContentController.add(self, name: WebScriptMessage.close)
        webView?.configuration.userContentController.add(self, name: WebScriptMessage.exit)
        webView?.configuration.userContentController.add(self, name: WebScriptMessage.authLogin)
        webView?.configuration.userContentController.add(self, name: WebScriptMessage.reload)
        if !useNativeNavigationBarTitle {
            webView?.configuration.userContentController.add(self, name: WebScriptMessage.headData)
        }
        webView?.configuration.userContentController.add(self, name: WebScriptMessage.brokerDetail)
    }
    
    func removeScriptMessageHandler() {
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.close)
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.exit)
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.authLogin)
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.reload)
        if !useNativeNavigationBarTitle {
            webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.headData)
        }
        webView?.configuration.userContentController.removeScriptMessageHandler(forName: WebScriptMessage.brokerDetail)


    }
}

// MARK: - Actions * Observers
extension ZXYWebViewController {
    
    override public func observeValue(forKeyPath keyPath: String?, of object: Any?, change: [NSKeyValueChangeKey : Any]?, context: UnsafeMutableRawPointer?) {
        
        if keyPath == "estimatedProgress"{
            progressView.isHidden = false
            progressView.alpha = 1
            // 设置进度
            let loadProgress = Float(webView?.estimatedProgress ?? 0)
            progressView.setProgress(loadProgress, animated: true)
            if loadProgress >= 1.0 {
                UIView.animate(withDuration: 0.25, delay: 0.3, options: UIView.AnimationOptions.curveLinear, animations: {
                    self.progressView.alpha = 0
                }) { (result) in
                    self.progressView.setProgress(0.0, animated: false)
                    self.progressView.isHidden = true
                }
            }
        } else if keyPath == "title" {
            if isHideTitle || useNativeNavigationBarTitle { return }
            self.title = webView?.title
        }
    }
}


// MARK: - WKNavigationDelegate
extension ZXYWebViewController: WKNavigationDelegate {
    
    // 开始请求，是否跳转
   public func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        decisionHandler(.allow)
    }
    
    // 开始加载
    public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        errorView?.removeFromSuperview()
        if useNativeNavigationBarTitle == false {
            navBar.isHidden = navBarHidden
        }
    }
    
    // 收到响应头，决定是否跳转
    public func webView(_ webView: WKWebView, decidePolicyFor navigationResponse: WKNavigationResponse, decisionHandler: @escaping (WKNavigationResponsePolicy) -> Void) {
        decisionHandler(.allow)
    }
    
    // 加载完成
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        self.isFinished = true
        self.webViewDidLoadHandle?()
        self.loadNewsJSMethod()
        if isShowFrameworkLoading {
        }
    }
    
    // 加载失败
    public func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        progressView.isHidden = true
        var errorUrl: URL? = self.request?.url
        if webView.url == nil {
            let nsError = error as NSError
            let userInfo = nsError.userInfo
            if let failingUrlStr = userInfo["NSErrorFailingURLStringKey"] as? String, let failingUrl = URL(string: failingUrlStr) {
                errorUrl = failingUrl
            }
        }
        
        #warning("占位图的展示")
       
        if navBar.isHidden == true {
            navBar.isHidden = false
        }
    }
    
    // 跳转失败
    public func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        
    }
    
    // 重定向
    public func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
        
    }
    
    // 打开新窗口委托
    public func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration, for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if navigationAction.targetFrame?.isMainFrame == nil {
            webView.load(navigationAction.request)
        }
        return nil
    }
    
    // 白屏
    public func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }
    
}


// MARK: - WKUIDelegate
extension ZXYWebViewController: WKUIDelegate {
    
    public func webView(_ webView: WKWebView, runJavaScriptAlertPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping () -> Void) {
        
    }
    
    public func webView(_ webView: WKWebView, runJavaScriptConfirmPanelWithMessage message: String, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (Bool) -> Void) {
        
    }
    
    public func webView(_ webView: WKWebView, runJavaScriptTextInputPanelWithPrompt prompt: String, defaultText: String?, initiatedByFrame frame: WKFrameInfo, completionHandler: @escaping (String?) -> Void) {
        
    }
}


extension ZXYWebViewController: WKScriptMessageHandler {
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        
        let name = message.name
        
        if name == WebScriptMessage.close || name == WebScriptMessage.exit {
            // 关闭
            WebScriptHandle.closeWebView(bodyMessage: message.body)
            
        }else if name == WebScriptMessage.reload {
           // 重新加载
            self.load(bodyMessage: message.body)

        }else if name == WebScriptMessage.headData {
            // 设置导航栏
            self.setupNavigationBar(message: message.body)
            
        }
        
    }
}

// MARK: - Actions
extension ZXYWebViewController {
    
    func onNavBarButtonClick(entity: WebNavButtonEntity) {
        
    }
}

// MARK: - interface
public extension ZXYWebViewController {
    
    func reload(_ url: URL?) {
        self.showFrameworkLoading(offsetY: kNavigationBarHeight)
        guard url == nil else {
            if let url = url {
                let request = URLRequest(url: url)
                webView?.load(request)
            }
            return
        }
        webView?.reload()
    }
    
    func goBack() {
        if webView?.canGoBack == true {
            webView?.goBack()
        }
    }
    
    func goForward() {
        if webView?.canGoForward == true {
            webView?.goForward()
        }
    }
    
    func load(bodyMessage: Any) {
        guard let urlStr = bodyMessage as? String, let url = URL(string: urlStr) else {
            return
        }
        let request = URLRequest(url: url)
        webView?.load(request)
    }
}

// MARK: - header setup
fileprivate extension ZXYWebViewController {
    
    func setupNavigationBar(message: Any) {
        
        guard var bodyStr =  message as? String else {
            return
        }
        bodyStr = bodyStr.replacingOccurrences(of: "\n", with: "")
        #warning("使用HandyJSON,换成自己的解析库")
        if let navEntity = WebHeaderDataEntity.deserialize(from: bodyStr) {
            self.view.bringSubviewToFront(navBar)
            navBar.isHidden = false
            navBar.updateContent(with: navEntity, isHideTitle: isHideTitle)
        }
    }
    
   
}
