//
//  ZXYWebEntity.swift
//  ZXYWKWebView
//
//  Created by 张小杨 on 2020/12/6.
//

/// 导航栏按钮类型
///
/// - share: 分享
/// - link: 链接
/// - goback: 返回
/// - collection: 收藏
/// - select: 下拉列表

open class  ZXYBaseEntity: NSObject, HandyJSON  {
    required public override init() {}
}

public enum WebHeaderBtnTypeEnum: Int, HandyJSONEnum{
    case share = 1
    case link = 2
    case goback = 3
    case collection = 4
    case select = 5
}

public class WebHeaderDataEntity: ZXYBaseEntity{
    var backgroundColor: String = "#FFFFFF"         // 背景颜色
    var title: WebNavTitleEntity?                   // 标题
    var leftIcon, rightIcon: [WebNavButtonEntity]?  // 左右两边按钮数组
    required init() {}
}

// MARK: - 标题
public class WebNavTitleEntity: ZXYBaseEntity{
    var content: String = ""
    var color: String = ""
    var isTwoLine: Bool = false  // 是否是两行文字
    
    required init() {}
}

// MARK: - 按钮
public class WebNavButtonEntity: ZXYBaseEntity{
    
    var type: WebHeaderBtnTypeEnum = .share
    var goback: WebNavButtonTypeGobackEntity?
    var share: WebNavButtonTypeShareEntity?
    var link: WebNavButtonTypeLinkEntity?
    var select: WebNavButtonTypeSelectEntity?
    
    var realTypeModel: WebNavButtonTypeBaseEntity? {
        switch type {
        case .goback:
            return goback
        case .share:
            return share
        case .link:
            return link
        case .select:
            return select
        case .collection:
            return nil
        }
    }
    
    var content: String {
        return realTypeModel?.content ?? ""
    }
    var icon: String {
        return realTypeModel?.icon ?? ""
    }
    var color: String {
        return realTypeModel?.color ?? ""
    }
    
    required init() {}
}

// MARK: - 按钮各个type基类，包含按钮外观
public class WebNavButtonTypeBaseEntity: ZXYBaseEntity{
    var content: String = ""
    var icon: String = ""
    var color: String = ""
}


// MARK: - 按钮，返回类型
public class WebNavButtonTypeGobackEntity: WebNavButtonTypeBaseEntity{

}

// MARK: - 按钮，分享类型
public class WebNavButtonTypeShareEntity: WebNavButtonTypeBaseEntity{
    
    var shareModel: WebNavButtonTypeShareShareModel?
    
    required init() {}
}
// 分享模型
public class WebNavButtonTypeShareShareModel: ZXYBaseEntity{
    
    var type: WebShareModelTypeEnum = .link
    var title: String = ""
    var content: String = ""
    var imgURL: String = ""
    var shareURL: String = ""
    
    required init() {}
}

// MARK: - 分享的类型
public enum WebShareModelTypeEnum: Int, HandyJSONEnum{
    case img = 1    // 分享图片
    case link = 2   // 分享链接
}

// MARK: - 按钮，链接类型
public class WebNavButtonTypeLinkEntity: WebNavButtonTypeBaseEntity{
    
    var href: String = ""
    required init() {}
}

// MARK: - 按钮，下拉列表类型
public class WebNavButtonTypeSelectEntity: WebNavButtonTypeBaseEntity{
    
    var itemBackground: String = "" // 列表的背景颜色
    var itemSelection: String = ""  // 列表选中背景颜色
    var itemColor: String = ""      // 列表子元素的文字颜色
    var defaultId: String = ""
    var item: [WebNavSelectItemModel]?
    required init() {}
}

// MARK: - 下拉列表项
public class WebNavSelectItemModel: ZXYBaseEntity{
    
    var content: String = ""
    var icon: String = ""
    var method: String = "" // 回调的方法
    var id: String = ""     // 子元素的id  回调方法里面传回
    required init() {}
}

// MARK: - 按钮，收藏类型
public class WebNavButtonTypeCollectionEntity: WebNavButtonTypeBaseEntity{
    
}
