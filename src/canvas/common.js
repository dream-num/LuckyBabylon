/**
 * 导出整个fabricPlus，方法调用 f.notActiveStyle();
 * --  import * as f from '@/canvas/fabricPlus'
 *
 * 导出单个方法 ，方法调用notActiveStyle();
 * import {notActiveStyle} as f from '@/canvas/fabricPlus'
 * */

//fabric对象转json对象
import store from '@/store/index.js';
import {commonSpace,pageSpace,commonUpdate,commonGet} from '@/store/mutations/mutation-types'


const canvasId = 'sliderCanvas';
const scrollx = 'msMidScrollx';
const scrolly = 'msMidScrolly';


/**
 * 编辑图片，编辑元件
 * @param {*} objects 
 * @param {*} objHanddle 
 */
function notActiveStyle(objects, objHanddle) {
    let sliderCanvas = getCanvas();
    let showviewportBorder = sliderCanvas._objects[0];
    let allobjects = sliderCanvas.getObjects();
    for (let i = 0; i < allobjects.length; i++) {
        let obj = allobjects[i];
        let isMatch = checkInObjects(obj, objects);

        if (!isMatch && obj != showviewportBorder) {
            if (typeof objHanddle == 'function') {
                objHanddle(obj);
            }
            //obj.set({"opacity": obj.get("opacityC"), "selectable":true});
        }
    }
}

/**
 * 判断一个对象obj是否在数组objects中
 * @param {*} obj 
 * @param {*} objects 
 */
function checkInObjects(obj, objects) {
    let isMatch = false;
    for (let x = 0; x < objects.length; x++) {
        let ac = objects[x];
        if (obj == ac) {
            isMatch = true;
            break;
        }
    }
    return isMatch;
}

/**
 * 生成随机的图表id
 * @param {*} prefix
 */
function generateRandomKey(prefix) {
    if (prefix == null) {
        prefix = 'page';
    }

    let userAgent = window.navigator.userAgent
        .replace(/[^a-zA-Z0-9]/g, '')
        .split('');
    let mid = '';
    for (let i = 0; i < 12; i++) {
        mid += userAgent[Math.round(Math.random() * (userAgent.length - 1))];
    }
    let time = new Date().getTime();

    return prefix + '_' + mid + '_' + time;
}

/**
 * 取得组件随机位置
 * @param {*} type
 */
function getRandomPosition(type) {
    let center = getViewAbsoluteXY();
    return {
        left: center.width / 2,
        top: center.height / 2,
    };
}

/**
 * 获取当前页面的最大Zindex
 */
function getCurPageIndexMax() {
    let curPageObjects = store.state.page.curPage.objects;

    if(curPageObjects.size === 0){
        return 0;
    }

    let max = -Infinity;
    for (let object of curPageObjects.values()) {
        let index = object.mszIndex;
        if (max < index) {
            max = index;
        }
    }
    return max;
}

//处理主画布的interactive/selection/selectable状态
function banCanvasInteract(state) {
    if (state == null) {
        state = false;
    }
    let canvas = getCanvas();
    //console.log(state);
    canvas.interactive = state;
    canvas.selection = state;
    canvas.selectable = state;

    let sliderCanvas = getCanvas();
    sliderCanvas.forEachObject(function(object){
        if(object!=sliderCanvas.showviewportBorder){
            object.set("evented", state);
        }
    });
    canvas.requestRenderAll();
}

/**
 * 获取画布相关位置信息
 */
function getViewAbsoluteXY() {
    let viewOriginX = store.state.common.canvasSetting.viewOriginX,
        viewOriginY = store.state.common.canvasSetting.viewOriginY,
        curzoom = store.state.common.canvasSetting.curzoom,
        viewCanvasWidth = store.state.common.canvasSetting.viewWidth,
        viewCanvasHeight = store.state.common.canvasSetting.viewHeight;
    // param = _this.calMoveParam(),
    // center = _this.sliderCanvas.getCenter(),
    // vf = _this.sliderCanvas.viewportTransform,
    // centerfix = fabric.util.transformPoint(new fabric.Point(center.left, center.top), vf),
    // centerLeft = centerfix.x,
    // centerTop = centerfix.y,

    // viewCanvasWidth = _this.$store.state.curPage.viewCanvasWidth,
    // viewCanvasHeight = _this.$store.state.curPage.viewCanvasHeight,
    // viewW = viewCanvasWidth,
    // viewH = viewCanvasHeight;
    // if(viewCanvasWidth > this.sliderCanvasParentW){
    // 	centerLeft += (center.left+this.viewFixScrollLeft) * this.curzoom;
    // }

    // if(viewCanvasHeight > this.sliderCanvasParentH){
    // 	centerTop += (center.top+this.viewFixScrollTop) * this.curzoom;
    // }

    return {
        left: viewOriginX,
        right: viewOriginX + viewCanvasWidth,
        top: viewOriginY,
        bottom: viewOriginY + viewCanvasHeight,
        width: viewCanvasWidth,
        height: viewCanvasHeight,
        zoomWidth: viewCanvasWidth * curzoom,
        zoomHeight: viewCanvasHeight * curzoom,
    };
}

/**
 * 根据鼠标位置 计算鼠标在组件内的位置
 * @param {*} x
 * @param {*} y
 * @param {*} invert
 */
function transformPoint(x, y, invert) {
    let canvas = getCanvas();
    if (invert == null) {
        invert = true;
    }
    let vf = canvas.viewportTransform;
    if (invert) {
        vf = fabric.util.invertTransform(vf);
    }
    let centerfix = fabric.util.transformPoint(new fabric.Point(x, y), vf);

    return {
        x: centerfix.x,
        y: centerfix.y,
    };
}

/**
 * 根据鼠标位置 判断鼠标是否在组件上
 * @param {*} x
 * @param {*} y
 */
function isMousePointInView(x, y) {
    let viewXY = getViewAbsoluteXY();
    let inContainView = false;
    let centerfix = transformPoint(x, y);
    //console.log("viewXY:"+JSON.stringify(viewXY) + ", x:" + x + ", y:" + y + ", centerfix.x:" + centerfix.x + ", centerfix.y:" + centerfix.y);
    x = centerfix.x;
    y = centerfix.y;
    if (
        y > viewXY.top &&
        y < viewXY.bottom &&
        x > viewXY.left &&
        x < viewXY.right
    ) {
        inContainView = true;
    }
    return inContainView;
}

//滚动条被拖动到边之后，即取消移动滚动条
function calMoveParam() {
    let parentWH = getCanvasParentWH();
    let sliderCanvasParentW = parentWH.width;
    let sliderCanvasParentH = parentWH.height;
    let showMin = store.state.common.canvasSetting.showMin;
    let curzoom = store.state.common.canvasSetting.curzoom;
    /*  let viewCanvasWidth = store.state.curPage.viewCanvasWidth * curzoom,
        viewCanvasHeight = store.state.curPage.viewCanvasHeight * curzoom;
    var center = this.sliderCanvas.getCenter(); */

    // var moveLimitX = (viewCanvasWidth+this.sliderCanvasParentW)/2 - this.showMin;
    // var moveLimitY = (viewCanvasHeight+this.sliderCanvasParentH)/2 -this.showMin;

    // if(this.$store.state.curPage.viewCanvasWidth > this.sliderCanvasParentW){
    // 	moveLimitX -= (center.left+this.viewFixScrollLeft) * this.curzoom;
    // }

    // if(this.$store.state.curPage.viewCanvasHeight > this.sliderCanvasParentH){
    // 	moveLimitY -= (center.top+this.viewFixScrollTop) * this.curzoom;
    // }

    /*   var cl =
            (this.sliderCanvasParentW - showMin) * (1 - curzoom) -
            this.fixResizeX / this.curzoom,
        ct =
            (this.sliderCanvasParentH - showMin) * (1 - curzoom) -
            this.fixResizeY / curzoom; */

    //中心点测试
    //var _this = vueMain.$children[0].$children[0];var zoom = 0.4;var center = _this.sliderCanvas.getCenter();_this.sliderCanvas.viewportTransform = [zoom,0,0,zoom,center.left*(1-zoom),center.left*(1-zoom)  ];_this.sliderCanvas.requestRenderAll();_this.sliderCanvas.forEachObject(function(obj) {obj.setCoords();});

    // console.log("Y",this.viewportTransform[5]-ct,moveLimitY,viewCanvasHeight/2 , _this.sliderCanvasParentH/2);
    // console.log("X",this.viewportTransform[4]-cl,moveLimitX,viewCanvasWidth/2, _this.sliderCanvasParentW/2);
    // console.log("center", JSON.stringify(center), JSON.stringify(vpcenter), _this.curzoom ,canvas.getZoom(), "cl"+cl, "ct"+ct);

    /*  return {
          moveLimitX:
            (this.sliderCanvasParentW - this.showMin) * (1 - this.curzoom),
          moveLimitY:
            (this.sliderCanvasParentH - this.showMin) * (1 - this.curzoom),
          centerFixLeft: 0,
          centerFixTop: 0
        };
   */

    return {
        moveLimitX: (sliderCanvasParentW) * (1 - curzoom),
        moveLimitY: (sliderCanvasParentH) * (1 - curzoom),
        centerFixLeft: 0,
        centerFixTop: 0,
    };

    //return {moveLimitX: (this.sliderCanvasParentW-this.showMin)*(1-this.curzoom)+this.fixResizeX*this.curzoom, moveLimitY:(this.sliderCanvasParentH-this.showMin)*(1-this.curzoom)+this.fixResizeY*this.curzoom, centerFixLeft:0, centerFixTop:0};
}

/**
 * 根据当前的角度/宽/高，设置active对象的位置坐标
 */
function activeObjectSetCoods() {
    let sliderCanvas = getCanvas();
    let active = sliderCanvas.getActiveObject();
    if (active != null) {
        active.setCoords();
    }
}

/**
 * 计算滚动条的长和宽
 * 然后改store的数据
 */
function calScrollSize() {
    let sliderCanvas = getCanvas();
    let parentWH = getCanvasParentWH();
    let sliderCanvasParentW = parentWH.width,
        sliderCanvasParentH = parentWH.height,
        viewWidth = store.state.common.canvasSetting.viewWidth,
        viewHeight = store.state.common.canvasSetting.viewHeight,
        curzoom = store.state.common.canvasSetting.curzoom,
        showMin = store.state.common.canvasSetting.showMin;
    let scrollWidth =
        sliderCanvasParentW * 2 + viewWidth * curzoom ;
    let scrollHeight =
        sliderCanvasParentH * 2 + viewHeight * curzoom ;
    commitCommonMutations('canvasSetting.scrollWidth', scrollWidth);
    commitCommonMutations('canvasSetting.scrollHeight', scrollHeight);
    // if(this.curPage.viewCanvasWidth > this.sliderCanvasParentW){
    //    	this.scrollWidth -= 2*(this.sliderCanvas.getCenter().left+this.viewFixScrollLeft) * (this.curzoom);
    //    }

    //    if(this.curPage.viewCanvasHeight > this.sliderCanvasParentH){
    //    	this.scrollHeight -= 2*(this.sliderCanvas.getCenter().top+this.viewFixScrollTop) * (this.curzoom);
    //    }

    //console.log(sliderCanvas, "viewWidth:"+viewWidth, "viewHeight:"+viewHeight,"curzoom:"+curzoom,"showMin:"+showMin,"sliderCanvasParentW:"+sliderCanvasParentW,"sliderCanvasParentH:"+sliderCanvasParentH,"scrollWidth:"+scrollWidth, "scrollHeight:"+scrollHeight);
}

//缩放功能，鼠标不在中间区域时触发
function canvasZoomCenter(
    sliderCanvasParentW,
    sliderCanvasParentH,
    zoom,
    canvas
) {

    calScrollSize();

    let param = calMoveParam(),
        scrollWidth = store.state.common.canvasSetting.scrollWidth,
        scrollHeight = store.state.common.canvasSetting.scrollHeight;
    let x = (scrollWidth - sliderCanvasParentW) / 2,
        y = (scrollHeight - sliderCanvasParentH) / 2;
    // canvas.viewportTransform[4] = param.moveLimitX - x;
    // canvas.viewportTransform[5] = param.moveLimitY - y;
    // canvas.requestRenderAll();
    
    // var curPage = getState('page', 'curPage');
    // var sliderCanvas3D = document.getElementById("sliderCanvas3D");
    // if(sliderCanvas3D!=null){
    //     var babylon = sliderCanvas3D.babylon;
    //     if(babylon!=null){
    //         var curScene = babylon.scene[curPage.pageId];
    //         if(babylon!=null && curScene!=null){
    //             var camera = curScene.camera;
    //             camera.radius = 10/zoom;
    //         }
    //     }
    // }



    canvas.zoomToPoint(
        { x: sliderCanvasParentW / 2, y: sliderCanvasParentH / 2 },
        zoom
    );

    return {x:x, y:y};


    // let scroll = getScrollXY();
    // if(scroll.x!=null){
    //     scroll.x.scrollLeft = x;
    //     scroll.y.scrollTop = y;
    // }
}

/**
 * 窗口改变或者缩放之后 重刷主画布
 * @param {*} x 
 * @param {*} y 
 */
function initialCanvasShow(x, y) {
    let sliderCanvas = getCanvas();
    let scrollOffsetX, scrollOffsetY;
    let param = calMoveParam();
    if (x == null) {
        scrollOffsetX =
            param.moveLimitX +
            param.centerFixLeft -
            sliderCanvas.viewportTransform[4];
    } else {
        scrollOffsetX = x;
    }

    if (y == null) {
        scrollOffsetY =
            param.moveLimitY +
            param.centerFixTop -
            sliderCanvas.viewportTransform[5];
    } else {
        scrollOffsetY = y;
    }
    // _this.objScrollX.scrollLeft((_this.scrollWidth - _this.sliderCanvasParentW)/2);
    // _this.objScrollY.scrollTop((_this.scrollHeight - _this.sliderCanvasParentH)/2);

    // console.log("X",param.moveLimitX , param.centerFixLeft,this.sliderCanvas.viewportTransform[4], scrollOffsetX);
    // console.log("Y",param.moveLimitY , param.centerFixTop ,this.sliderCanvas.viewportTransform[5], scrollOffsetY);

    // setTimeout(function() {
        let scroll = getScrollXY();
        scroll.x.scrollLeft = scrollOffsetX;
        scroll.y.scrollTop = scrollOffsetY;
    // }, 0);
}

/**
 * 获取fabriccanvas以及父级canvas的宽高
 */
function getEditorCanvas() {
    let canvas = document.getElementById(canvasId);
    let parent = canvas.parentElement;
    let parentW = parent.clientWidth;
    let parentH = parent.clientHeight;
    return {
        canvas: canvas.fabric,
        width: parentW,
        height: parentH,
    };
}

/**
 * 获取fabriccanvas
 */
function getCanvas() {
    return document.getElementById(canvasId).fabric;
}


function getStaticCanvasList() {
    return document.getElementById(canvasId).staticCanvas;
}

function getCurStaticCanvas(pageId) {
    var staticCanvas = document.getElementById(canvasId).staticCanvas;
    if(staticCanvas==null){
        return;
    }

    if(pageId==null){
        var curPage = getState('page', 'curPage');
        pageId = curPage.pageId;
    }

    return staticCanvas[pageId];
}

/**
 * 获取父级canvas的宽高
 */
function getCanvasParentWH() {
    let canvas = document.getElementById(canvasId);
    let parent = canvas.parentElement;
    let parentW = parent.clientWidth;
    let parentH = parent.clientHeight;
    return {
        width: parentW,
        height: parentH,
    };
}

/**
 * 获取滚动条的x，y
 */
function getScrollXY() {
    let objScrollX = document.getElementById(scrollx);
    let objScrollY = document.getElementById(scrolly);
    return { x: objScrollX, y: objScrollY };
}

/**
 * 获取state属性
 * @param {*} param
 */
function getState(nameSpace, param) {
    let space = `${nameSpace}/${commonGet}`;
    return store.getters[space](param);
}

/**
 * 提交common模块下的Mutations
 * @param {*} updateProperty
 * @param {*} value
 */
function commitCommonMutations(updateProperty, value) {
    let space = `${commonSpace}/${commonUpdate}`;
    store.commit(space, { updateProperty: updateProperty, value: value });
}

/**
 * 提交page模块下的Mutations
 * @param {*} updateProperty 
 * @param {*} value 
 */
function pageCommonMutations(updateProperty, value) {
    let space = `${pageSpace}/${commonUpdate}`;
    store.commit(space, { updateProperty: updateProperty, value: value });
}


function getOrderPageList(sData){
    var sliderPageSort = []
    for (let [key, page] of sData) {
        sliderPageSort.push(page);
    }

    sliderPageSort.sort(function (a, b) {
        if (a.order > b.order) {
            return 1;
        } else {
            return -1;
        }
    });
    return sliderPageSort;
}

/** 
 * 设置对象fill属性  设置fill渐变或背景图片
 * @param {Object} updateObj 更新属性对象
 * @param {Fabric.canvas} canvas fabric的canvas对象
 * @param {Fabric.Object} activeObj fabric的操作对象
 */
function setFillOrImg(updateObj, canvas, activeObj) {
    if(!updateObj.fill){
        return;
    }
    if (updateObj.fill.source) {
        fabric.util.loadImage(updateObj.fill.source, function(img) {
            activeObj.set('fill', new fabric.Pattern({
              source: img
            }));
            canvas.requestRenderAll();
        });
    } else if (updateObj.fill.colorStops) { // 渐变色
        let colorStops = {};
        for(let i = 0; i < updateObj.fill.colorStops.length; i++){
            let offset = updateObj.fill.colorStops[i].offset;
            let color = updateObj.fill.colorStops[i].color;
            colorStops[offset] = color;
        }

        let fillOption = { 
            type: updateObj.fill.type, 
            colorStops: colorStops 
        };
        if(updateObj.fill.type == 'linear'){
            fillOption.x1 = updateObj.fill.x * activeObj.width;
            fillOption.y1 = updateObj.fill.y * activeObj.height;
            fillOption.x2 = updateObj.fill.x2 * activeObj.width;
            fillOption.y2 = updateObj.fill.y2 * activeObj.height;
        }
        else if(updateObj.fill.type == 'radial'){
            fillOption.x1 = updateObj.fill.cx * activeObj.width;
            fillOption.y1 = updateObj.fill.cy * activeObj.height;
            fillOption.x2 = updateObj.fill.cx * activeObj.width;
            fillOption.y2 = updateObj.fill.cy * activeObj.height;
            fillOption.r1 = updateObj.fill.r * activeObj.width;
            fillOption.r2 = updateObj.fill.r * activeObj.height;
        }
        activeObj.setGradient('fill', fillOption);
    }
}



export {
    notActiveStyle,
    checkInObjects,
    generateRandomKey,
    getRandomPosition,
    getCurPageIndexMax,
    banCanvasInteract,
    getViewAbsoluteXY,
    transformPoint,
    isMousePointInView,
    calMoveParam,
    activeObjectSetCoods,
    calScrollSize,
    getEditorCanvas,
    getCanvas,
    getCanvasParentWH,
    getScrollXY,
    canvasZoomCenter,
    initialCanvasShow,
    getState,
    commitCommonMutations,
    pageCommonMutations,
    getStaticCanvasList,
    getCurStaticCanvas,
    getOrderPageList,
    setFillOrImg
};
