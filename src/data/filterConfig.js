// 滤镜自定义设置组件数据

const CONFIGLIST = [
  {
    name: '抗锯齿',
    value: 0,
    label: 'antialiasing',
    isSelected:false,
    children: [{
      type: 'radio',
      label: 'value',
      showLabel: false,
      value: 'samples',
      children: [{
          name: '多样本抗锯齿（较慢）',
          value: 'samples',
        },
        {
          name: '快速近似抗锯齿（快速）',
          value: 'fxaaEnabled',
        },
      ],
    }, ],
  },
  {
    name: '锐化',
    value: 1,
    label: 'sharpening',
    isSelected:false,
    children: [{
        type: 'slider',
        label: 'colorAmount',
        name: '着色',
        value: 1,
        min: 0,
        max: 1,
        step: 0.1,
        showValue: true,
      },
      {
        type: 'slider',
        label: 'edgeAmount',
        name: '边缘',
        value: 0.3,
        min: 0,
        max: 5,
        step: 0.1,
        showValue: true,
      },
    ],
  },
  {
    name: '景深',
    value: 2,
    label: 'depthOfField',
    isSelected:false,
    children: [{
        name: '模糊水平',
        label: 'depthOfFieldBlurLevel',
        type: 'radio',
        value: 0,
        showLabel: true,
        children: [{
            name: '低',
            value: 0,
          },
          {
            name: '中',
            value: 1
          },
          {
            name: '高',
            value: 2
          },
        ],
      },
      {
        name: '对焦距离',
        type: 'slider',
        label: 'focusDistance',
        value: 2000,
        min: 1,
        max: 50000,
        step: 1,
        showValue: true,
      },
      {
        name: '焦距',
        type: 'slider',
        label: 'focalLength',
        value: 150,
        min: 1,
        max: 300,
        step: 1,
        showValue: true,
      },
      {
        name: '光圈',
        type: 'slider',
        label: 'fStop',
        value: 1.4,
        min: 1,
        max: 10,
        step: 0.1,
        showValue: true,
      },
    ],
  },
  {
    name: '全屏泛光',
    value: 3,
    label: 'Bloom',
    isSelected:false,
    children: [{
        name: '阙值',
        type: 'slider',
        label: 'bloomThreshold',
        value: 0.8,
        min: 0,
        max: 1,
        step: 0.1,
        showValue: true,
      },
      {
        name: '比重',
        type: 'slider',
        label: 'bloomWeight',
        value: 0.3,
        min: 0,
        max: 1,
        step: 0.1,
        showValue: true,
      },
      {
        name: '核心',
        type: 'slider',
        label: 'bloomKernel',
        value: 64,
        min: 0,
        max: 500,
        step: 1,
        showValue: true,
      },
      {
        name: '范围',
        type: 'slider',
        label: 'bloomScale',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.1,
        showValue: true,
      },
    ],
  },
  {
    name: '色差',
    value: 4,
    label: 'chromaticAberration',
    isSelected:false,
    children: [{
        name: '异常值',
        type: 'slider',
        label: 'aberrationAmount',
        value: 30,
        min: -100,
        max: 100,
        step: 1,
        showValue: true,
      },
      {
        name: '径向强度',
        type: 'slider',
        label: 'radialIntensity',
        value: 0,
        min: 0,
        max: 1,
        step: 0.1,
        showValue: true,
      },
      {
        name: '位置',
        type: 'slider',
        label: 'direction',
        value: 0,
        min: -2,
        max: 2,
        step: 0.1,
        showValue: true,
      },
    ],
  },
  {
    name: '杂点',
    value: 5,
    label: 'grain',
    isSelected:false,
    children: [{
        type: 'slider',
        label: 'intensity',
        name: '强度',
        value: 30,
        min: 0,
        max: 500,
        step: 1,
        showValue: true,
      },
      {
        value: false,
        type: 'switch',
        label: 'animated',
        active: '开启动画',
        inactive: '关闭动画',
      },
    ],
  },
  {
    name: '黑白&高亮&浮雕',
    value: 6,
    label: 'blackAndWhite,highlights,convolution',
    type: 'compose',
    isSelected:false,
    children: [{
        name: '黑白',
        parentLabel: 'blackAndWhite',
        label: 'state',
        value: false,
        ptype: 'compose',
        type: 'switch',
        active: '开启',
        inactive: '关闭',
      },
      {
        name: '高亮',
        parentLabel: 'highlights',
        label: 'state',
        value: false,
        ptype: 'compose',
        type: 'switch',
        active: '开启',
        inactive: '关闭',
      },
      {
        name: '卷积',
        parentLabel: 'convolution',
        label: 'kenel',
        value: 'off',
        ptype: 'compose',
        type: 'radio',
        showLabel: true,
        children: [{
            name: '关闭',
            value: 'off'
          },
          {
            name: '边缘检测',
            value: 'EdgeDetect0Kernel',
          },
          {
            name: '边缘检测1',
            value: 'EdgeDetect1Kernel',
          },
          {
            name: '边缘检测2',
            value: 'EdgeDetect2Kernel',
          },
          {
            name: '浮雕',
            value: 'EmbossKernel'
          },
          {
            name: '高斯',
            value: 'GaussianKernel'
          },
          {
            name: '锐化',
            value: 'SharpenKernel'
          },
        ],
      },
    ],
  },
  {
    name: '模糊',
    value: 9,
    label: 'blur',
    isSelected:false,
    children: [{
        name: '横向',
        label: 'blurKernelHorizen',
        type: 'slider',
        value: 1,
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
      },
      {
        name: '纵向',
        label: 'blurKernelVertical',
        type: 'slider',
        value: 1,
        min: 0,
        max: 100,
        step: 1,
        showValue: true,
      },
    ],
  },
  {
    name: '色调映射',
    value: 10,
    label: 'tonemap',
    isSelected:false,
    children: [{
        name: '色调映射',
        label: 'TonemappingOperator',
        type: 'radio',
        showLabel: true,
        value: 'Hable',
        children: [{
            name: 'Hable',
            value: 'Hable',
          },
          {
            name: 'Reinhard',
            value: 'Reinhard'
          },
          {
            name: 'HejiDawson',
            value: 'HejiDawson'
          },
          {
            name: 'Photographic',
            value: 'Photographic'
          },
        ],
      },
      {
        name: '纵向',
        label: 'exposureAdjustment',
        type: 'slider',
        value: 1,
        min: 0,
        max: 20,
        step: 1,
        showValue: true,
      },
    ],
  },
  {
    name: '对比度&曝光',
    value: 11,
    label: 'ImageProcessingCE',
    isSelected:false,
    children: [{
        name: '对比度',
        label: 'contrast',
        type: 'slider',
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        showValue: true,
      },
      {
        name: '曝光',
        label: 'exposure',
        type: 'slider',
        value: 1,
        min: 0,
        max: 5,
        step: 1,
        showValue: true,
      },
    ],
  },
  {
    name: '颜色曲线',
    value: 12,
    label: 'ImageProcessingCurves',
    isSelected:false,
    children: [{
        name: '全局',
        type: 'group',
        children: [{
            label: 'globalDensity',
            name: '密度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'globalExposure',
            name: '曝光',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'globalHue',
            name: '色调',
            value: 0,
            type: 'slider',
            mix: 0,
            max: 360,
            step: 1,
            showValue: false,
          },
          {
            label: 'globalSaturation',
            name: '饱和度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
        ],
      },
      {
        name: '高光',
        type: 'group',
        children: [{
            label: 'highlightsDensity',
            name: '密度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'highlightsExposure',
            name: '曝光',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'highlightsHue',
            name: '色调',
            value: 0,
            type: 'slider',
            mix: 0,
            max: 360,
            step: 1,
            showValue: false,
          },
          {
            label: 'highlightsSaturation',
            name: '饱和度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
        ],
      },
      {
        name: '中间色调',
        type: 'group',
        children: [{
            label: 'midtonesDensity',
            name: '密度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'midtonesExposure',
            name: '曝光',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'midtonesHue',
            name: '色调',
            value: 0,
            type: 'slider',
            mix: 0,
            max: 360,
            step: 1,
            showValue: false,
          },
          {
            label: 'midtonesSaturation',
            name: '饱和度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
        ],
      },
      {
        name: '阴影',
        type: 'group',
        children: [{
            label: 'shadowsDensity',
            name: '密度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'shadowsExposure',
            name: '曝光',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
          {
            label: 'shadowsHue',
            name: '色调',
            value: 0,
            type: 'slider',
            mix: 0,
            max: 360,
            step: 1,
            showValue: false,
          },
          {
            label: 'shadowsSaturation',
            name: '饱和度',
            value: 0,
            type: 'slider',
            mix: -100,
            max: 100,
            step: 1,
            showValue: false,
          },
        ],
      },
    ],
  },
  {
    name: '屏幕暗角',
    value: 13,
    label: 'ImageProcessingVignette',
    isSelected:false,
    children: [{
        label: 'vignetteStretch',
        name: '拉伸',
        value: 0,
        type: 'slider',
        mix: 0,
        max: 50,
        step: 0.1,
        showValue: true,
      },
      {
        label: 'vignetteCentreX',
        name: '水平中心',
        value: 0,
        type: 'slider',
        mix: -2,
        max: 2,
        step: 0.01,
        showValue: true,
      },
      {
        label: 'vignetteCentreY',
        name: '垂直中心',
        value: 0,
        type: 'slider',
        mix: -2,
        max: 2,
        step: 0.01,
        showValue: true,
      },
      {
        label: 'vignetteWeight',
        name: '权重',
        value: 1.5,
        type: 'slider',
        mix: 0,
        max: 50,
        step: 1,
        showValue: true,
      },
      {
        label: 'vignetteColor',
        name: '颜色',
        type: 'color',
        value: '',
      },
      {
        label: 'vignetteBlendMode',
        name: '颜色',
        type: 'radio',
        value: 'MULTIPLY',
        showLabel: true,
        children: [{
            name: '叠加',
            value: 'MULTIPLY',
          },
          {
            name: '不透明',
            value: 'OPAQUE',
          },
        ],
      },
    ],
  },
]
// 滤镜自定义组件默认数据结构
const DEFAULTCONFIG = {
  ImageProcessingTexture: {
    colorGradingTexture: '', //url链接，默认为空
    level: 1, //默认0，数字范围，可选范围0-2，拉伸
    animated: false, //默认false，开关，动态效果
    speed: 1, //默认1, 可选：1很慢,2慢,3一般,4快,5很快
  },
  antialiasing: {
    // 修改后
    value: 'samples',
    // 默认 samples 多样本抗锯齿（较慢）
    // 选项，可选："fxaaEnabled"  快速近似抗锯齿（快速）

    // 之前数据结构
    //抗锯齿
    // samples: 4, //开启则有此选项，多样本抗锯齿（较慢）
    // fxaaEnabled: true, //开启则有此选项，快速近似抗锯齿（快速）
  },
  sharpening: {
    //锐化，需要开启pipeline.sharpenEnabled = true;
    colorAmount: 1, //默认1，数字范围，可选范围0到1，着色
    edgeAmount: 0.3, //默认0.3，数字范围，可选范围0到5，边缘
  },
  depthOfField: {
    //景深，需要开启pipeline.depthOfFieldEnabled = true;
    depthOfFieldBlurLevel: 1, //默认1，单选框，可选0： BABYLON.DepthOfFieldEffectBlurLevel.Low，1：Medium，2：High，模糊水平
    focusDistance: 2000, //默认2000，数字范围，可选范围1-50000，对焦距离
    focalLength: 150, //默认150，数字范围，可选范围1-300，焦距
    fStop: 1.4, //默认1.4，数字范围，可选范围1-10，光圈
  },
  Bloom: {
    //全屏泛光，需要开启pipeline.bloomEnabled = true;
    bloomThreshold: 0.8, //默认1，数字范围，可选范围0-1，阈值
    bloomWeight: 0.3, //默认2000，数字范围，可选范围0-1，比重
    bloomKernel: 64, //默认150，数字范围，可选范围1-500，核心
    bloomScale: 0.5, //默认1.4，数字范围，可选范围0-1，范围
  },
  chromaticAberration: {
    //色差，pipeline.chromaticAberrationEnabled = true;
    aberrationAmount: 30, //默认30，数字范围，可选范围-100-100，异常值
    radialIntensity: 0, //默认0，数字范围，可选范围0-1，径向强度
    direction: 'Math.PI', //默认Math.PI，数字范围，可选范围0 - Math.PI*2，位置
  },
  grain: {
    //噪声，pipeline.grainEnabled = true;
    intensity: 30, //默认30，数字范围，可选范围0-500，强度
    animated: false, //默认false,是否，可选true false，开启动画
  },

  //PostProcess
  blackAndWhite: {
    //黑白
    state: false, //默认false，可选true false，是否开启
  },
  highlights: {
    //高亮
    state: false, //默认false，可选true false，是否开启
  },
  convolution: {
    kenel: 'off', //默认off，选项，可选：EdgeDetect0Kernel(边缘检测), EdgeDetect1Kernel(边缘检测1), EdgeDetect2Kernel(边缘检测2), EmbossKernel(浮雕), GaussianKernel(高斯),SharpenKernel(锐化)
  },
  blur: {
    //色差，pipeline.chromaticAberrationEnabled = true;
    blurKernelVertical: 1, //默认1，数字范围，可选范围1-100，异常值
    blurKernelHorizen: 1, //默认1，数字范围，可选范围1-100，径向强度
  },
  tonemap: {
    //色调映射（Tonemap），var postProcess = new BABYLON.TonemapPostProcess("tonemap", BABYLON.TonemappingOperator.HejiDawson,1, camera);
    TonemappingOperator: 'Hable', //默认Hable, 可选：Hable、Reinhard、HejiDawson、Photographic, 色调映射
    exposureAdjustment: 1, //默认1，数字范围，可选范围0.1-20，色调校准
  },
  ImageProcessingCE: {
    //对比度&曝光（contrast&exposure）
    contrast: 1, //默认1，数字范围，可选范围0-5，对比度
    exposure: 1, //默认1，数字范围，可选范围0-5，曝光
  },
  ImageProcessingCurves: {
    //颜色曲线（ColorCurves）, colorCurvesEnabled =true | false
    //全局
    globalDensity: 0, //默认0，数字范围，可选范围-100-100，密度
    globalExposure: 0, //默认0，数字范围，可选范围-100-100，曝光
    globalHue: 30, //默认30，数字范围，可选范围0-360，色调
    globalSaturation: 0, //默认0，数字范围，可选范围-100-100，密度

    //高光
    highlightsDensity: 0, //默认0，数字范围，可选范围-100-100，密度
    highlightsExposure: 0, //默认0，数字范围，可选范围-100-100，曝光
    highlightsHue: 30, //默认30，数字范围，可选范围0-360，色调
    highlightsSaturation: 0, //默认0，数字范围，可选范围-100-100，密度

    //中间色调
    midtonesDensity: 0, //默认0，数字范围，可选范围-100-100，密度
    midtonesExposure: 0, //默认0，数字范围，可选范围-100-100，曝光
    midtonesHue: 30, //默认30，数字范围，可选范围0-360，色调
    midtonesSaturation: 0, //默认0，数字范围，可选范围-100-100，密度

    //阴影
    shadowsDensity: 0, //默认0，数字范围，可选范围-100-100，密度
    shadowsExposure: 0, //默认0，数字范围，可选范围-100-100，曝光
    shadowsHue: 30, //默认30，数字范围，可选范围0-360，色调
    shadowsSaturation: 0, //默认0，数字范围，可选范围-100-100，密度
  },
  ImageProcessingVignette: {
    //屏幕暗角（Vignette）， vignetteEnabled = true | false
    vignetteStretch: 0, //默认0，数字范围，可选范围0-20，拉伸
    vignetteCentreX: 0, //默认0，数字范围，可选范围-2-2
    vignetteCentreY: 0, //默认0，数字范围，可选范围-2-2，垂直中心
    vignetteWeight: 1.5, //默认1.5，数字范围，可选范围0-50，权重
    vignetteColor: '', //默认为空，color，支持透明度，颜色
    vignetteBlendMode: 'MULTIPLY', //默认MULTIPLY， 可选：MULTIPLY(叠加)BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY, OPAQUE(不透明)BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE
  },
}
export {
  CONFIGLIST,
  DEFAULTCONFIG
}