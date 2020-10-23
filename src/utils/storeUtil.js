import { deepCopy, isMap } from './util';
/**
 * 递归把objects转为map
 * @param {Map} map
 * @param {*} curPageObjects
 * @param {*} symbols
 */
function getPageOjbects(map, curPageObjects, symbols) {
    if (!curPageObjects) return;
    curPageObjects.forEach(item => {
        map.set(item.msItemID, item);
        if (item.type == 'symbol' && symbols) {
            let symbolsTemp = symbols.get(item.symbolTempId);
            let symboldata = symbolsTemp ? symbolsTemp.objects : [];
            getPageOjbects(map, symboldata, symbols);
        } else if (item.objects && item.objects.size > 0) {
            //Map使用szie
            getPageOjbects(map, item.objects, symbols);
        }
    });
}

/**
 * 获取页面所有组件（包含子组件）object对象，放入一个map对象中
 * @param {Map} objects 
 * @param {Map} symbols 元件map
 * @param {Map} resultMap 返回包含所有组件的map
 */
function getAllObjects(objects, symbols, resultMap = new Map()) {
  if (!isMap(objects)) {
    console.error("参数不是map类型！");
    return null;
  }
  
  for (let [key, value] of objects.entries()) {
    if (value.type == 'group' || value.type == 'symbol') {
      let copyItem = deepCopy(value);
      delete copyItem.objects;
      resultMap.set(key, copyItem);
      
      if (value.type == 'group') {
        getAllObjects(value.objects, symbols, resultMap);
      } else if (value.type == 'symbol') {
        let symbolObjects;
        if (symbols.get(value.symbolTempId) != null) {
          symbolObjects = symbols.get(value.symbolTempId).objects;
        }
        if (symbolObjects != null) {
          getAllObjects(symbolObjects, symbols, resultMap);
        }
      }
    } else {
      resultMap.set(key, value);
    }
  }
  return resultMap;
  // objects = convertMapToArray(objects);
  // for (var i = 0; i < objects.length; i++) {
  //     var item = objects[i];

  //     arr[item.msItemID] = item;

  //     if (item.type == 'group') {
  //         this.checkGroupJson(item.objects, arr);
  //     } else if (item.type == 'symbol') {
  //         var o = item.objects;
  //         if (o == null) {
  //             var symbols = this.$store.state.symbols.symbolsTemp;

  //             if (symbols.get(item.symbolTempId) != null) {
  //                 o = symbols.get(item.symbolTempId).objects;
  //             }
  //         }

  //         if (o != null) {
  //             this.checkGroupJson(o, arr);
  //         }
  //     }
  // }
}

function queryFabricObject(msItemID, curPageObjects, symbols) {
    const map = new Map();
    getPageOjbects(map, curPageObjects, symbols);
    console.log(map);
    return map.get(msItemID);
}

/**
 * 公共修改Mutations的方法
 * @param {*} state
 * @param {*} param
 */
function commonMutationsUpdate(state, param) {
    let property = param.updateProperty; //多层嵌套写a.b.c
    let value = param.value;
    if (!property) {
        return;
    }
    if (property.includes('.')) {
        let n = '';
        let arr = property.split('.');
        for (let i = 0; i < arr.length - 1; i++) {
            let item = arr[i];
            if (n == '') {
                n = Reflect.get(state, item);
            } else {
                n = Reflect.get(n, item);
            }
        }
        let lastProperty = arr[arr.length - 1];
        n[lastProperty] = value;
    } else {
        state[property] = value;
    }
}

/**
 * 获取数据
 * @param {*} state
 * @param {*} property
 */
function getState(state, property) {
    if (property.includes('.')) {
        let n = '';
        let arr = property.split('.');
        for (let i = 0; i < arr.length - 1; i++) {
            let item = arr[i];
            if (n == '') {
                n = Reflect.get(state, item);
            } else {
                n = Reflect.get(n, item);
            }
        }
        let lastProperty = arr[arr.length - 1];
        return n[lastProperty];
    } else {
        return state[property];
    }
}

/**
 * 递归把map转为数组
 * @param {Map} map
 * @param {Array} array
 * @param {*} symbols
 */
function convertMapToArray(map, array = []) {
    if (!map) return [];
    let copyMap = deepCopy(map);
    let objects = [...copyMap.values()];
    if (!objects || objects.length == 0) return [];
    objects.forEach(item => {
        let itemCopy = deepCopy(item);
        delete itemCopy.objects;
        if (item.objects) {
            itemCopy.objects = convertMapToArray(item.objects);
        }
        array.push(itemCopy);
    })
    return array;
}

/**
 * store数据变model
 * @param {*} storeData 
 */
function sotreToModel(storeData){
    let shadow = storeData.shadow;
    if(shadow){
        storeData['color'] = shadow['color'];
        storeData['blur'] = shadow['blur'];
        storeData['offsetX'] = shadow['offsetX'];
        storeData['offsetY'] = shadow['offsetY'];
    }else{
        storeData['color'] ="rgb(0,0,0)"; //阴影颜色
        storeData['blur'] = 0;//阴影模糊程度
        storeData['offsetX'] = 0;//阴影水平偏移程度
        storeData['offsetY'] = 0;//阴影垂直偏移程度
    }
   
    // storeData['angleX'] = 0;
    // storeData['angleY'] = 0;
    return storeData;
}

/**
 * 把 shadowColor, shadowBlur,
 * shadowX,shadowY,shadowAffectStroke合成shadow
 * store数据转fabric数据结构
 * @param {*} storeData 
 */
function storeToFabric(storeData,fabricItem){
    let emptyShadow = false,    // 是否清空阴影
    emptyStroke = false,        // 是否清除描边
    emptyFill = false;          // 是否清除填充
    if (storeData.hasOwnProperty("isShadow")) {
        if (!storeData.isShadow) {
            storeData['shadow'] = {};
            emptyShadow = true;
        }
    } else if (fabricItem && !fabricItem.isShadow) {
        storeData['shadow'] = {};
        emptyShadow = true;
    } 
    if (!emptyShadow && fabricItem) {
        let fieldArr = [ 
            {storeKey:'shadowColor',fabricKey:'color'}, //阴影颜色
            {storeKey:'shadowBlur',fabricKey:'blur'}, //模糊
            {storeKey:'shadowX',fabricKey:'offsetX'}, //X偏移量
            {storeKey:'shadowY',fabricKey:'offsetY'}, //Y偏移量
            {storeKey:'shadowAffectStroke',fabricKey:'affectStroke'}
        ];
        let shadow = {}; 
        fieldArr.forEach(item=>{
            // if(fabricItem && fabricItem.shadow){
            //     shadow[item.fabricKey] = fabricItem.shadow[item.fabricKey]
            // }
            if(fabricItem){
                shadow[item.fabricKey] = fabricItem[item.storeKey];
            }
            
            if(storeData.hasOwnProperty(item.storeKey)){
                shadow[item.fabricKey] = storeData[item.storeKey];
                // delete storeData[item.storeKey];
            }
        });
        if(JSON.stringify(shadow) != "{}"){
            storeData['shadow'] = shadow;
        }
    }
    //X轴旋转
    // if (storeData.hasOwnProperty('angleX')) {
    //     let x = (storeData.angleX) * Math.PI / 180;
    //     storeData['skewX'] = Math.tan(x);
    //     //this.curActiveObj.skewX = this.styles.skewX.toFixed(6)*10;
    //     storeData['scaleX'] = Math.cos(x);
    //     //this.curActiveObj.scaleX = +this.styles.scaleX.toFixed(6);
    //     //this.curActiveObj.angleX = param;
    //     delete storeData.angleX;
    // }
    // //Y轴旋转
    // if (storeData.hasOwnProperty('angleY')) {
    //     let y = (storeData.angleY) * Math.PI / 180;
    //     storeData['skewY'] = Math.tan(y);
    //     storeData['scaleY'] = Math.cos(y);
    //     //this.styles.skewY = Math.tan(y);
    //     // this.curActiveObj.skewY = this.styles.skewY.toFixed(6)*10;
    //     // this.styles.scaleY = Math.cos(y);
    //     // this.curActiveObj.scaleY = +this.styles.scaleY.toFixed(6);
    //     // this.curActiveObj.angleY = param;
    //     delete storeData.angleY;
    // } 

    // 边框描边
    if (storeData.hasOwnProperty("isStroke")) {
        if (!storeData.isStroke) {
            storeData.stroke = null;
            emptyStroke = true;
        }
    } 
    // else if (fabricItem && !fabricItem.isStroke) {
    //     storeData.stroke = null;
    //     emptyStroke = true;
    // } 
    if (!emptyStroke) {
        if(storeData.hasOwnProperty('strokeDashType')){
            let dashType = storeData.strokeDashType;
            if(dashType ==='straightLine'){
                storeData.strokeDashArray = [0,0,0];
            }else if(dashType ==='foldLine'){
                storeData.strokeDashArray = [1,4,4];
            }else if(dashType ==='dottedLine'){
                storeData.strokeLineCap = "round";
                storeData.strokeDashArray = [0,0,0,9,0,0,0,9,0,0];
            }else if(dashType ==='squareLine'){
                storeData.strokeLineCap = "square";
                storeData.strokeDashArray = [0,0,0,10,0,0,0,10,0,0];
            }
            // delete storeData.strokeDashType;
        }
    }
}

/**
 * 根据路劲路由更新主对象的子属性
 * @param {需要更新的主对象} chartOptions 
 * @param {路径路由} router 
 * @param {更新对象} updateObj 
 */
function setChartOptionsByRouter(chartOptions,router,updateObj) {
    if (chartOptions == undefined || router == undefined) {
        return chartOptions;
    }
    
    let routerArray = router.split('/');
    const defaultOption = chartOptions.defaultOption;

    //递归获取内部属性
    function deepFind(curObj) {
        if (routerArray.length != 0) {
            return deepFind(curObj[routerArray.shift()])
        }else{
            Object.assign(curObj,updateObj)
            return curObj
        }
        
    }
    deepFind(defaultOption);
    return chartOptions;
}
export { 
  getPageOjbects, 
  commonMutationsUpdate, 
  getState, 
  convertMapToArray, 
  getAllObjects,
  sotreToModel,
  storeToFabric,
  setChartOptionsByRouter
};
