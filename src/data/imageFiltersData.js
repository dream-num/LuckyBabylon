const imgFilters = {
    // 滤镜属性数组
    filters: [
        'grayscale',        // 灰度
        'invert',           // 反色
        'remove-color',     // 删除色
        'sepia',            // 
        'brownie',
        'brightness',       // 明亮
        'contrast',         // 对比度
        'saturation',       // 饱和度
        'noise',            // 噪点
        'vintage',          // 复古
        'pixelate',         // 像素化
        'blur',             // 模糊
        'sharpen',          // 锐化
        'emboss',           // 浮雕
        'technicolor',      // 彩色
        'polaroid',         // 曝光
        'blend-color',      // 混色
        'gamma',            // 灰度系数（r,g,b）
        'kodachrome',       // 底片
        'blackwhite',       // 黑白
        'blend-image',      // 混合图像
        'hue',              // 色度
    ],

    // 滤镜类型数组
    filterTypes: [
        "HueRotation",
        "Saturation",
        "Contrast",
        "Brightness",
        "Grayscale",
        "BlackWhite",
        "Vintage",
        "Polaroid",
        "Kodachrome",
        "Technicolor",
        "Sepia",
        "Convolute",
        "Invert",
        "RemoveColor",
        "Noise",
        "Pixelate",
        "Blur",
        "BlendColor"
    ],

    /** 混色 modeList */
    blendcolorList: [
        {label: 'add', value: "add"},
        {label: 'diff', value: "diff"},
        {label: 'subtract', value: "subtract"},
        {label: 'multiply', value: "multiply"},
        {label: 'screen', value: "screen"},
        {label: 'lighten', value: "lighten"},
        {label: 'darken', value: "darken"},
        {label: 'overlay', value: "overlay"},
        {label: 'exclusion', value: "exclusion"},
        {label: 'tint', value: "tint"}
    ],

    /** 混合图片 modeList */
    blendimageList: [
        {label: 'multiply', value: "multiply"},
        {label: 'mask', value: "mask"}
    ],

    /** 锐化matrix */
    sharpenMatrix: [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ],

    /** 浮雕matrix */
    embossMatrix: [
        1,  1,   1,
        1, 0.7, -1,
        -1, -1, -1
    ]
}
export default imgFilters;