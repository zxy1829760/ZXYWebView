//
//  ZXYWebNavigationBar.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

import UIKit

class ZXYWebNavigationBar: UIView {
    
    fileprivate var currentEntity: WebHeaderDataEntity?
    var btnClickHandle: ((WebNavButtonEntity)->())?
    
    lazy var titleLabel: UILabel = {
        let label = UILabel()
        label.font = UIFont.boldSystemFont(ofSize: 18)
        label.textColor = UIColor.black
        label.textAlignment = .center
        return label
    }()
    
    lazy var contentView: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.clear
        return view
    }()
    
    lazy var backButton: ZXYWebNavButton = {
        let btn = ZXYWebNavButton()
//        btn.setImage(R.image.assistant_imageBroswerBack(), for: .normal)
        btn.addTarget(self, action: #selector(onBackButtonClick), for: .touchUpInside)
        btn.backgroundColor = UIColor.white
        return btn
    }()
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.setupSubviews()
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    private func setupSubviews() { //
        self.backgroundColor = UIColor.white
        #warning("使用SnipKit第三方")
        self.addSubview(contentView)
        contentView.snp.makeConstraints { (make) in
            make.left.right.bottom.equalToSuperview()
            make.top.equalToSuperview().offset(kSafeAreaTopInset)
        }
        contentView.addSubview(titleLabel)
        titleLabel.snp.makeConstraints{ (make) in
            make.edges.equalToSuperview()
        }
        contentView.addSubview(backButton)
        backButton.snp.makeConstraints { (make) in
            make.left.equalToSuperview().offset(20)
            make.height.equalTo(20)
            make.centerY.equalToSuperview()
        }
    }
}


// MARK: - interface
extension ZXYWebNavigationBar {
    
    func updateContent(with navEntity: WebHeaderDataEntity, isHideTitle: Bool = false) {
        
        currentEntity = navEntity
        
        // ------------- 背景颜色 ---------------- //
        if let backgroundColor = UIColor.hexColor(hexString: navEntity.backgroundColor) {
            self.backgroundColor = backgroundColor
        } else {
            self.backgroundColor = UIColor.white
        }
        
        // ---------------- 标题 ----------------- //
        //            let isTwoLine = titleEntity.isTwoLine
        if let titleEntity = navEntity.title {
            if isHideTitle {return}
            self.titleLabel.text = titleEntity.content
            if let titleColor = UIColor.hexColor(hexString: titleEntity.color) {
                self.titleLabel.textColor = titleColor
            }
        }
        
        // ------------- 左按钮 ---------------- //
        for subView in contentView.subviews {
            if let btn = subView as? UIButton {
                btn.removeFromSuperview()
            }
        }
        
        if let leftBtns = navEntity.leftIcon {
            
            var leftView: UIView = self
            for (index, leftEntity) in leftBtns.enumerated() {
                let btn = ZXYWebNavButton()
                btn.setTitle(leftEntity.content, for: .normal)
                btn.sd_setImage(with: URL(string: leftEntity.icon), for: .normal, placeholderImage: R.image.assistant_imageBroswerBack())
                btn.imageEdgeInsets = UIEdgeInsets(top: 12, left: 0, bottom: 12, right: 0)
                contentView.addSubview(btn)
                let isOnlyIcon = (leftEntity.content.count <= 0 && leftEntity.icon.count > 0)
                
                if isOnlyIcon {
                    btn.contentHorizontalAlignment = .center
                } else {
                    btn.contentHorizontalAlignment = .left
                }
                
                if index == 0 {
                    btn.snp.makeConstraints { (make) in
                        if isOnlyIcon {
                            make.width.equalTo(44)
                        }
                        make.left.equalTo(leftView).offset(10)
                        make.height.equalTo(44)
                        make.centerY.equalToSuperview()
                    }
                }else {
                    btn.snp.makeConstraints { (make) in
                        if isOnlyIcon {
                            make.width.equalTo(44)
                        }
                        make.left.equalTo(leftView.snp.right).offset(10)
                        make.height.equalTo(44)
                        make.centerY.equalToSuperview()
                    }
                }
                leftView = btn
                btn.entity = leftEntity
                btn.addTarget(self, action: #selector(btnClick(_:)), for: .touchUpInside)
            }
        }
        
        // ------------- 右按钮 ---------------- //
        if let rightBtns = navEntity.rightIcon {
            var rightView: UIView = self
            for (index, rightEntity) in rightBtns.enumerated() {
                let btn = ZXYWebNavButton()
                btn.setTitle(rightEntity.content, for: .normal)
                if rightEntity.type == .share {
                    btn.setImage(R.image.assistant_H5_shareIcon(), for: .normal)
                }else {
                    btn.sd_setImage(with: URL(string: rightEntity.icon), for: .normal, completed: nil)
                }
                contentView.addSubview(btn)
                let isOnlyIcon = (rightEntity.content.count <= 0 && rightEntity.icon.count > 0)
                if isOnlyIcon {
                    btn.contentHorizontalAlignment = .center
                } else {
                    btn.contentHorizontalAlignment = .right
                }
                if index == 0{
                    btn.snp.makeConstraints { (make) in
                        if isOnlyIcon {
                            make.width.equalTo(44)
                        }
                        make.right.equalTo(rightView).offset(-10)
                        make.height.equalTo(44)
                        make.centerY.equalToSuperview()
                    }
                }else {
                    btn.snp.makeConstraints { (make) in
                        if isOnlyIcon {
                            make.width.equalTo(44)
                        }
                        make.right.equalTo(rightView.snp.left).offset(-10)
                        
                        make.height.equalTo(44)
                        make.centerY.equalToSuperview()
                    }
                }
                rightView = btn
                btn.entity = rightEntity
                btn.addTarget(self, action: #selector(btnClick(_:)), for: .touchUpInside)
            }
        }
    }
}


// MARK: - action
extension ZXYWebNavigationBar {

    @objc func btnClick(_ sender: ZXYWebNavButton) {
        guard let entity = sender.entity else {
            return
        }
        btnClickHandle?(entity)
    }
    
    @objc func onBackButtonClick() {
        let entity = WebNavButtonEntity()
        entity.type = .goback
        btnClickHandle?(entity)
    }
}


class ZXYWebNavButton: UIButton {
    var entity: WebNavButtonEntity?
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.titleLabel?.font = UIFont.boldSystemFont(ofSize: 16)
        self.setTitleColor(UIColor.black, for: .normal)
        self.imageView?.contentMode = .scaleAspectFit
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override public func point(inside point: CGPoint, with event: UIEvent?) -> Bool {
        let sizeXY:CGFloat = -10
        let clickArea = bounds.insetBy(dx: sizeXY, dy: sizeXY)
        return clickArea.contains(point)
    }
}
