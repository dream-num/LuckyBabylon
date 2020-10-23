//字体
const fontFamilyListWin = [
    { label: '微软雅黑', value: 'Microsoft YaHei' },
    { label: '宋体', value: 'SimSun' },
    { label: '楷体', value: '楷体' },
    { label: '黑体', value: 'Heiti SC' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Arial', value: 'Arial' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Times New Roman', value: 'Times New Roman' },
];

const fontFamilyListMac = [
    { label: '苹方', value: 'PingFang SC' },
    { label: '苹果丽黑', value: 'Hiragino Sans GB' },
    { label: '黑体', value: 'Heiti SC' },
    { label: '华文细黑', value: 'STXihei' },
    { label: '华文黑体', value: 'STHeiti' },
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Times New Roman', value: 'Times New Roman' },
];
let fontFamilyList = [];
if(/macintosh|mac os x/i.test(navigator.userAgent)){
    fontFamilyList = fontFamilyListMac;
}
else{
    fontFamilyList = fontFamilyListWin;
}

/**
 * 避头尾法则
 */
const headTailRuleList = [
    { label: '规则1', value: 'rule1' },
    { label: '规则2', value: 'rule2' },
    { label: '规则3', value: 'rule3' },
    { label: '规则4', value: 'rule4' },
];

/**
 * 边框描边样式
 */
const strokeDashList = [
    {
        value: 'straightLine',
        label: '——————',
    },
    {
        value: 'foldLine',
        label: '▬ ▬ ▬ ▬ ▬ ▬ ▬ ',
    },
    {
        value: 'dottedLine',
        label: '·············',
    },
    {
        value: 'squareLine',
        label: '■ ■ ■ ■ ■ ■ ■',
    },
];

/**
 * 项目符号、编号类型
 */
const bulletTypeList = [
    // {
    //     value: 'square',
    //     icon: 'iconxiantiaotuceng',
    //     label: '项目符号',
    // },
    // {
    //     value: 'number',
    //     icon: 'iconshupaiwenzi',
    //     label: '项目编号',
    // },
    // {
    //     value: 'nothing',
    //     icon: '',
    //     label: '无',
    // },
    {
        value: 'number',
        label: '数字 1',
    },
    {
        value: 'circle',
        label: '●',
    },
    {
        value: 'square',
        label: '◆',
    },
];

/**
 * 项目符号
 */
const shapeList = [
    {
        value: 'circle',
        label: '●',
    },
    {
        value: 'square',
        label: '◆',
    },
];

/**
 * 起始编号
 */
const numberList = [
    {
        value: '0',
        label: '1',
    },
    {
        value: '1',
        label: '(1)',
    },
    {
        value: '2',
        label: '①',
    },
    {
        value: '3',
        label: 'Ⅰ',
    },
    {
        value: '4',
        label: '(Ⅰ)',
    },
    {
        value: '5',
        label: '一',
    },
    {
        value: '6',
        label: '壹',
    },
    {
        value: '7',
        label: 'A',
    },
    {
        value: '8',
        label: 'a',
    },
];

/**
 * 项目编号类型
 */
const numTypeList = [
    {
        value: '0',
        label: '1',
    },
    {
        value: '1',
        label: '(1)',
    },
    {
        value: '2',
        label: '①',
    },
    {
        value: '3',
        label: 'Ⅰ',
    },
    {
        value: '4',
        label: '(Ⅰ)',
    },
    {
        value: '5',
        label: '一',
    },
    {
        value: '6',
        label: '壹',
    },
    {
        value: '7',
        label: 'A',
    },
    {
        value: '8',
        label: 'a',
    },
];

/**
 * 对齐方式
 */
const textAlignList = [
    { content: '左对齐', icon: 'iconwenbenzuoduiqi', attr: 'left' },
    { content: '居中对齐', icon: 'iconwenbenjuzhongduiqi', attr: 'center' },
    { content: '右对齐', icon: 'iconwenbenyouduiqi', attr: 'right' },
    { content: '两端对齐', icon: 'iconwenbenliangduanduiqi', attr: 'justify' },
];

const textDecrationList = [
    { content: '加粗', icon: 'iconshupaiwenzi', attr: 'fontWeight' },
    { content: '倾斜', icon: 'iconwenbentuceng', attr: 'italic' },
    { content: '下划线', icon: 'iconxiangshangqingxie', attr: 'underline' },
    { content: '删除线', icon: 'iconxiangxia', attr: 'linethrough' },
];

const fields = [
    'msItemID',
    'width',
    'height',
    'listItem',
    'fontFamily',
    'fontSize',
    'fill',
    'charSpacing',
    'lineSpace',
    'headTailRule',
    'textIndent',
    'bulletType',
    'bulletOffset',
    'bulletColor',
    'numType',
    'startNum',
    'shapeType',
    'fontWeight',
    'fontStyle',
    'underline',
    'linethrough',
    'textAlign',
];

/**
 *  angleX,angleY（X,Y轴旋转）是不存在的属性
 *  angleX->skewX + scaleX的改变
 *  angleY->skewY + scaleY的改变
 *  msLine:没有left,top,width,height
 *  isLockWH 不存在的特殊属性
 *  isShadow 是否有阴影
 *  ‘color,blur,offsetX,offsetY’四个属性组成了shadow
 *  strokeDashType 描边线条类型
 */
const normalFields = [
    'msItemID', //id
    'type', //类型
    'isFill', //是否填充
    'fill', //填充颜色或者图片
    'fontWeight', //加粗
    'fontStyle', //倾斜
    'underline', //下划线
    'linethrough', //删除线
    'opacity', //透明度
    'isStroke', //是否有边框样式
    'strokeWidth', //边框宽度
    'stroke', //边框颜色
    'strokeDashType', //边框的样式类型
    'isShadow', //是否有阴影
    'shadowColor', //阴影颜色
    'shadowBlur', //模糊
    'shadowX', //X偏移
    'shadowY', //Y偏移
    'isLockWH', //是否锁定宽高比
    'width', //宽
    'height', //高
    'scaleX',
    'scaleY',
    'left', //左
    'top', //上
    'angle', //Z轴旋转
    // 'angleX', //x轴旋转
    // 'angleY', //Y轴旋转
    'skewX', // X轴斜切
    'skewY', // Y轴斜切
    'flipX', //水平翻转
    'flipY', //垂直翻转
    'mszIndex', //层次
    'visible', //隐藏
    'path', //
    'lineWidth',    // 直线线条粗细
    'lineColor',    // 直线线条颜色
];

/**
 * 获取对比属性值是否相等的map
 */
function getNormalMap() {
    let map = new Map();
    let arr = [
        'isFill', //是否填充
        'fill', //填充颜色或者图片
        'opacity', //透明度
        'isStroke', //是否有边框样式
        'strokeWidth', //边框宽度
        'stroke', //边框颜色
        'strokeDashType', //边框的样式类型
        'isShadow', //是否有阴影
        'shadowColor', //阴影颜色
        'shadowBlur', //模糊
        'shadowX', //X偏移
        'shadowY', //Y偏移
        'isLockWH', //是否锁定宽高比
        'width', //宽
        'height', //高
        'left', //左
        'top', //上
        'angle', //Z轴旋转
        // 'angleX', //x轴旋转
        // 'angleY', //Y轴旋转
        'skewX', // X轴斜切
        'skewY', // Y轴斜切
        'flipX', //水平翻转
        'flipY', //垂直翻转
        'visible', //隐藏
    ];
    arr.forEach(item => {
        map.set(item, 0);
    });
    return map;
}

/**
 * 当选中多个时model的初始值
 */
const normalGroupModel = {
    msItemID: null,
    type: null,
    isFill: false,
    fill: null,
    opacity: 0,
    isStroke: false, //是否有边框
    strokeWidth: 0, //边框宽度
    stroke: null, //边框颜色
    strokeDashType: null, //边框的样式类型
    isShadow: false, //是否有阴影
    shadowColor: null, //阴影颜色
    shadowBlur: 0, //模糊
    shadowX: 0, //X偏移
    shadowY: 0, //Y偏移
    isLockWH: false, //是否锁定宽高比
    angle: 0, //Z轴旋转
    // angleX: 0, //x轴旋转
    // angleY: 0, //Y轴旋转
    skewX: 0, //x轴斜切
    skewY: 0, //Y轴斜切
    flipX: false, //水平翻转
    flipY: false, //垂直翻转
    //mszIndex:0, //层次
    visible: true, //隐藏
};

export {
    fontFamilyList,
    headTailRuleList,
    strokeDashList,
    bulletTypeList,
    shapeList,
    numberList,
    numTypeList,
    textAlignList,
    textDecrationList,
    fields,
    normalFields,
    normalGroupModel,
    getNormalMap,
};
