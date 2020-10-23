/**
 * 
 * 说明:
 * 在editor/show/master三个入口文件index.js中均引入了,按需修改
 * 
 * 全局变量使用规则:
 * 1.优先使用store代替,或者挂载 Vue.prototype,若是跨js过多的flag,无法使用Vue.prototype的情况,使用全局变量
 * 2.严格按照内部分类挂载,更多分类自行添加
 * 3.所有变量预先初始化,加好注释
 * 4.可临时使用全局变量代替store存储,并加上TODO:表明后期会优化
 * 
 */

window._vueMain={
    //挂载全局flag使用
    flag:{
      isDrawObjectFinished:true, //标识是否渲染canvas完成, //防止切换页过快,导致上一页没渲染完毕的组件被渲染到了当前切换页
    },
    //挂载数组使用
    arr:{}, 
    //挂载对象使用
    obj: {
      //TODO:迁移到store.common 模块中
      msLoadingState:{ //3D loading 样式
          stateOpen:false, //是否采用全局设置 //大部分情况不采用此设置
          display: 'none', //是否显示 'none' / 'flex'
          colorChange: false, //是否使用设置的背景颜色
          backgroundColor: 'rgba(0, 0, 0, 0.3)'//背景颜色 //用于黑色背景还是透明背景
      }

    },
    //函数
    func:{

    }
  };