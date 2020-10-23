/**
 * 删除数组元素
 * @param {Array} arr 
 * @param {Object} item 
 */
function delArrItem(arr, item) {
    let i = arr.indexOf(item);
    if (i > -1) {
        arr.splice(i, 1);
    }
    return arr;
}

/**
 * 深度克隆数据,包括对象，数组，map
 * @param {*} obj 对象，数组，map
 */
function deepCopy(obj) {
    if (!isObject(obj) && !isMap(obj)) {
        return obj;
    }

    let cloneObj;
    if (isMap(obj)) {
        cloneObj = new Map();
        for (let key of obj.keys()) {
            let value = obj.get(key);
            if (isMap(value) || isObject(value) || Array.isArray(obj)) {
                let copyVal = deepCopy(value);
                cloneObj.set(key, copyVal);
            }else{
                cloneObj.set(key,value);
            }
        }
    }else if(typeof obj === "function"){
        cloneObj = obj
    }else {
        cloneObj = Array.isArray(obj) ? [] : {};
        if(obj instanceof HTMLElement){
            cloneObj=obj.cloneNode(true)
        }else {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloneObj[key] =
                        isMap(obj[key]) || isObject(obj[key])
                            ? deepCopy(obj[key])
                            : obj[key];
                }
            }

        }
    }
    return cloneObj;
}

/**
 * 深拷贝，当obj为map时转为一维数组
 * @param {*} obj
 */
function deepCopyMapToArray(obj) {
    if (!isObject(obj)) {
        console.error('obj 不是一个对象！');
        return obj;
    }
    function isObject(o) {
        return (typeof o === 'object' || typeof o === 'function') && o !== null;
    }

    if (obj instanceof Map) {
        let arr = [];
        for (let value of obj.values()) {
            arr.push(value);
        }
        obj = arr;
    }

    let cloneObj = Array.isArray(obj) ? [] : {};
    for (let key in obj) {
        cloneObj[key] = isObject(obj[key])
            ? deepCopyMapToArray(obj[key])
            : obj[key];
    }

    return cloneObj;
}

/**
 * 判断某个元素是否在指定数组里面
 * @param {*} item 
 * @param {*} arr 
 */
function isBelong(item, arr) {
    var flag = false;
    if (arr.length) {
        var strArr = JSON.stringify(arr);
        var strItem = JSON.stringify(item);
        if (strArr.indexOf(strItem) > -1) {
            flag = true;
            return flag;
        }
    }
    return flag;
}

/**
 * 检查一个数组是否包含属于另一个数组
 * @param {Array} arr1 
 * @param {Array} arr2 
 */
function isContain(arr1, arr2) {
    for (var i = arr2.length - 1; i >= 0; i--) {
        if (!arr1.includes(arr2[i])) {
            return false;
        }
    }
    return true;
}

/**
 * map转jsonObj
 * @param {Map} map
 */
function mapToObj(map) {
    let obj = Object.create(null);
    for (let [k, v] of map) {
        // We don’t escape the key '__proto__'
        // which can cause problems on older engines
        obj[k] = v;
    }
    return obj;
}

/**
 * jsonObj转map
 * @param {json} obj
 */
function objToMap(obj) {
    let map = new Map();
    try {
        for (let k of Object.keys(obj)) {
            if (!k || k == 'null') {
                throw new Error('键值不能为空!');
            }
            //是数字值？
            // if (!isNaN(k)) {
            //     map.set(Number(k), obj[k]);
            // } else {
            //     map.set(k, obj[k]);
            // }
            map.set(k, obj[k]);
        }
    } catch (e) {
        console.error(e.name + ': ' + e.message);
        return null;
    }

    return map;
}

/**
 * 递归查找objects下的子objects转成map
 * @param {Map} map 已经转成了map的objects
 */
function recursiveObjsToMap(map) {
    for (let value of map.values()) {
        if (value.objects) {
            let childMap = objToMap(value.objects);
            value.objects = childMap;
            recursiveObjsToMap(childMap);
        }
    }
}

/**
 * map集合排序
 * @param {Map} map 需要排序的map
 * @param {String} property 传key表示key排序，或者传value的属性名称
 * @param {Boolean} isDesc 是否降序，默认升序asc
 */
function sortMap(map, property, isDesc) {
    try {
        let sortedMap = new Map(
            [...map].sort(([k1, v1], [k2, v2]) => {
                if (property === 'key') {
                    if (isNaN(k1)) {
                        throw new Error('键值不是数字，不能排序!');
                    }
                    if (!isDesc) {
                        if (k1 > k2) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        if (k2 > k1) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                } else {
                    if (isNaN(v1[property])) {
                        throw new Error('不是数字，不能排序！');
                    }
                    if (!isDesc) {
                        if (v1[property] > v2[property]) {
                            return 1;
                        } else {
                            return -1;
                        }
                    } else {
                        if (v2[property] > v1[property]) {
                            return 1;
                        } else {
                            return -1;
                        }
                    }
                }
            })
        );
        return sortedMap;
    } catch (e) {
        console.error(e.name + ': ' + e.message);
        return map;
    }
}

/**
 * 拼接map  将第一个参数后的所有map加到第一个map上; 若key值重复,则对应值将会被覆盖
 * @param {Map} map 用于拼接并返回的map
 * @param {Array<Map>} args 多个map参数的数组 es6 Rest Parameters写法 
 */
function concatMap(map, ...args) {
    let isValidate = true;
    if (!isMap(map)) {
        console.error("参数不是map类型！");
        isValidate = false;
    } else if (args && args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            const arg = args[i];
            if (!isMap(arg)) {
                console.error("包含非map类型参数！");
                break;
            } else {
                for (let [key, value] of arg.entries()) {
                    map.set(key, value);
                }
            }
        }
    }
    return map;
}

/**
 * 判断参数是否是Object类型
 * @param {*} o 
 */
function isObject(o) {
    return (
        !isMap(o) &&
        (typeof o === 'object' || typeof o === 'function') &&
        o !== null
    );
}

/**
 * 判断参数是否是Map类型
 * @param {*} obj 
 */
function isMap(obj) {
    if (obj instanceof Map) {
        return true;
    } else {
        return false;
    }
}

function copyProperties(target, source) {
    for (let key of Reflect.ownKeys(source)) {
      if ( key !== 'constructor'
        && key !== 'prototype'
        && key !== 'name'
      ) {
        let desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
      }
    }
}

/**
 * 判断是否为数值
 * @param {*} val 
 */
function isRealNum(val) {
    // 判断是否是数字
    if (typeof val !== 'number') {
        return false;
    }
    // NaN 或数字
    return !isNaN(val)
}


/**
 * 判断参数是否为空
 * @param {*} val 
 */
function isEmpty(val){


}

/**
 * 寻找数组中的相同的属性值的对象
 * @param {Array} objArray 
 */
function findDuplicates(objArray,fieldArray){
    let common = [];
    let fields = [];
    let map = new Map();
    let flag = 0;
    for (let i = 1; i < objArray.length; i++) {
        for (let j = i - 1; j >= 0; j--) {
            flag++;
           
            //如果存在字段数组
            if(fieldArray){
                fieldArray.forEach( f => {
                    if(objArray[i][f] == objArray[j][f]){
                        fields.push(f);
                        common.push(objArray[i][f]);
                        map.set(f,objArray[i][f]);
                    }
                });
            }

           /*  if (objArray[i] > objArray[j]) {
                break;
            } else if (objArray[i] == objArray[j]) {
                return true;
            } */
        }
    }
    console.log("循环数",flag);
    console.log("相同元素",fields,common,map);
}

/**
 * 比较两个基本数据类型的一维数组是否相等
 * @param {Array} arrA 
 * @param {Array} arrB 
 */
function equalsArray(arrA, arrB) {
    if (Array.isArray(arrA) && Array.isArray(arrB)) {
        if (arrA.length != arrB.length) return false;
        for (let i = 0; i < arrA.length; i++) {
            if (arrA[i] !== arrB[i]) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function isPlainObject(obj){
  return obj && Object.prototype.toString.call(obj) === "[object Object]"
}

// jq的 extend 方法
function $extend() {
  var options, name, src, copy, copyIsArray, clone,
      target = arguments[ 0 ] || {},
      i = 1,
      length = arguments.length,
      deep = false;

  // Handle a deep copy situation
  if ( typeof target === "boolean" ) {
      deep = target;

      // Skip the boolean and the target
      target = arguments[ i ] || {};
      i++;
  }

  // Handle case when target is a string or something (possible in deep copy)
  if ( typeof target !== "object" && typeof target !== "function" ) {
      target = {};
  }

  // Extend jQuery itself if only one argument is passed
  if ( i === length ) {
      target = this;
      i--;
  }

  for ( ; i < length; i++ ) {

      // Only deal with non-null/undefined values
      if ( ( options = arguments[ i ] ) != null ) {

          // Extend the base object
          for ( name in options ) {
              src = target[ name ];
              copy = options[ name ];

              // Prevent never-ending loop
              if ( target === copy ) {
                  continue;
              }

              // Recurse if we're merging plain objects or arrays
              if ( deep && copy && ( isPlainObject( copy ) ||
                  ( copyIsArray = Array.isArray( copy ) ) ) ) {

                  if ( copyIsArray ) {
                      copyIsArray = false;
                      clone = src && Array.isArray( src ) ? src : [];

                  } else {
                      clone = src && isPlainObject( src ) ? src : {};
                  }

                  // Never move original objects, clone them
                  target[ name ] = $extend( deep, clone, copy );

              // Don't bring in undefined values
              } else if ( copy !== undefined ) {
                  target[ name ] = copy;
              }
          }
      }
  }
  return target;
}


/**
 * 是否微信
 */
function isWeixin() {
    var a = navigator.userAgent.toLowerCase()
    return 'micromessenger' == a.match(/MicroMessenger/i) ? !0 : !1
  }


/**
 * 是否移动端
 *
 */
function isMobileAgent(){
       let mobile = navigator.userAgent.match(
            /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
        );
        return mobile != null;
    }

/**
 * 获取iphone手机系统版本号
 * @return { null | String } 非iphone返回null, iphone返回系统版本号
 */
function getIOSVersion() {
    let str = navigator.userAgent.toLowerCase();
    let ver = str.match(/cpu iphone os (.*?) like mac os/);
    if (!ver) {
        // alert("请在Ios系统中打开");
        console.log("非iphone");
    } else {
        // alert("你当前的Ios系统版本为：" + ver[1].replace(/_/g, "."));
        // 只返回大版本
        return ver[1].split('_')[0];
    }
    return null;
}


    export {
    delArrItem,
    deepCopy,
    deepCopyMapToArray,
    isBelong,
    isContain,
    mapToObj,
    objToMap,
    recursiveObjsToMap,
    sortMap,
    concatMap,
    isMap,
    isRealNum,
    findDuplicates,
    equalsArray,
    getQueryString,
    $extend,
    isWeixin,
    isMobileAgent,
    getIOSVersion
}