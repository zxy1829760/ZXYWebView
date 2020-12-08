!function (win, option) {
    var count = 0,
        designWidth = option.designWidth,
        designHeight = option.designHeight || 0,
        designFontSize = option.designFontSize || 10,
        callback = option.callback || null,
        root = document.documentElement,
        body = document.body,
        rootWidth, newSize, t, self;

    //返回root元素字体计算结果
    function _getNewFontSize() {
        if (window.orientation == 180 || window.orientation == 0) {
            designWidth = option.designWidth;
            designHeight = option.designHeight || 0;
        }
        else if (window.orientation == 90 || window.orientation == -90) {
            designWidth = option.designHeight;
            designHeight = option.designWidth;
        }
        var scale = designHeight !== 0 ? Math.min(win.innerWidth / designWidth, win.innerHeight / designHeight) : win.innerWidth / designWidth;
        return parseInt(scale * 10000 * designFontSize) / 10000;
    }
    !function () {
        rootWidth = root.getBoundingClientRect().width;
        self = self ? self : arguments.callee;
        function Init() {
            // alert(win.innerWidth + ":" + win.innerHeight);
            if (win.innerWidth == 0 || win.innerHeight == 0) {
                setTimeout(function () { Init() }, 200);
            } else {
                //如果此时屏幕宽度不准确，就尝试再次获取分辨率，只尝试20次，否则使用win.innerWidth计算
                if (rootWidth !== win.innerWidth && count < 20) {
                    win.setTimeout(function () {
                        count++;
                        self();
                    }, 0);
                } else {
                    newSize = _getNewFontSize();
                    //如果css已经兼容当前分辨率就不管了
                    if (newSize + 'px' !== getComputedStyle(root)['font-size']) {
                        root.style.fontSize = newSize + "px";
                        return callback && callback(newSize);
                    };
                };
            }
        }
        Init();
    }();
    //横竖屏切换的时候改变fontSize，根据需要选择使用
    win.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
        clearTimeout(t);
        t = setTimeout(function () {
            self();
        }, 200);
    }, false);
}(window, {
    designWidth: 320,
    designHeight: 568,
    designFontSize: 8
});