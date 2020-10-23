const ID_OFFSET=-8,SIZE_OFFSET=-4,ARRAYBUFFER_ID=0,STRING_ID=1,ARRAYBUFFERVIEW=1,ARRAY=2,VAL_ALIGN_OFFSET=5,VAL_SIGNED=1024,VAL_FLOAT=2048,VAL_MANAGED=8192,ARRAYBUFFERVIEW_BUFFER_OFFSET=0,ARRAYBUFFERVIEW_DATASTART_OFFSET=4,ARRAYBUFFERVIEW_DATALENGTH_OFFSET=8,ARRAYBUFFERVIEW_SIZE=12,ARRAY_LENGTH_OFFSET=12,ARRAY_SIZE=16,BIGINT="undefined"!=typeof BigUint64Array,THIS=Symbol(),CHUNKSIZE=1024;function getStringImpl(a,b){var c=String.fromCharCode;const d=new Uint32Array(a),e=new Uint16Array(a);var f=d[b+SIZE_OFFSET>>>2]>>>1,g=b>>>1;if(f<=CHUNKSIZE)return c.apply(String,e.subarray(g,g+f));const h=[];do{const a=e[g+CHUNKSIZE-1],b=55296<=a&&56320>a?CHUNKSIZE-1:CHUNKSIZE;h.push(c.apply(String,e.subarray(g,g+=b))),f-=b}while(f>CHUNKSIZE);return h.join("")+c.apply(String,e.subarray(g,g+f))}function preInstantiate(a){function b(a,b){return a?getStringImpl(a.buffer,b):"<yet unknown>"}const c={},d=a.env=a.env||{};return d.abort=d.abort||function(a,e,f,g){const h=c.memory||d.memory;throw Error("abort: "+b(h,a)+" at "+b(h,e)+":"+f+":"+g)},d.trace=d.trace||function(a,e){const f=c.memory||d.memory;console.log("trace: "+b(f,a)+(e?" ":"")+Array.prototype.slice.call(arguments,2,2+e).join(", "))},a.Math=a.Math||Math,a.Date=a.Date||Date,c}function postInstantiate(a,b){function c(a){const b=new Uint32Array(j.buffer),c=b[n>>>2];if((a>>>=0)>=c)throw Error("invalid id: "+a);return b[(n+4>>>2)+2*a]}function d(a){const b=new Uint32Array(j.buffer),c=b[n>>>2];if((a>>>=0)>=c)throw Error("invalid id: "+a);return b[(n+4>>>2)+2*a+1]}function e(a){var b=Math.clz32;return 31-b(31&a>>>VAL_ALIGN_OFFSET)}function f(a,b,c){const d=j.buffer;if(c)switch(a){case 2:return new Float32Array(d);case 3:return new Float64Array(d);}else switch(a){case 0:return new(b?Int8Array:Uint8Array)(d);case 1:return new(b?Int16Array:Uint16Array)(d);case 2:return new(b?Int32Array:Uint32Array)(d);case 3:return new(b?BigInt64Array:BigUint64Array)(d);}throw Error("unsupported align: "+a)}function g(a){const b=new Uint32Array(j.buffer),d=b[a+ID_OFFSET>>>2],g=c(d);if(!(g&ARRAYBUFFERVIEW))throw Error("not an array: "+d);const h=e(g);var i=b[a+ARRAYBUFFERVIEW_DATASTART_OFFSET>>>2];const k=g&ARRAY?b[a+ARRAY_LENGTH_OFFSET>>>2]:b[i+SIZE_OFFSET>>>2]>>>h;return f(h,g&VAL_SIGNED,g&VAL_FLOAT).subarray(i>>>=h,i+k)}function h(a,b,c){const d=j.buffer,e=new Uint32Array(d),f=e[c+ARRAYBUFFERVIEW_DATASTART_OFFSET>>>2];return new a(d,f,e[f+SIZE_OFFSET>>>2]>>>b)}const i=b.exports,j=i.memory,k=i.table,l=i.__alloc,m=i.__retain,n=i.__rtti_base||-1;return a.__allocString=function(a){const b=a.length,c=l(b<<1,STRING_ID),d=new Uint16Array(j.buffer);for(var e=0;e<b;++e)d[(c>>>1)+e]=a.charCodeAt(e);return c},a.__getString=function(a){const b=j.buffer,c=new Uint32Array(b)[a+ID_OFFSET>>>2];if(c!==STRING_ID)throw Error("not a string: "+a);return getStringImpl(b,a)},a.__allocArray=function(a,b){const d=c(a);if(!(d&(ARRAYBUFFERVIEW|ARRAY)))throw Error("not an array: "+a+" @ "+d);const g=e(d),h=b.length,k=l(h<<g,ARRAYBUFFER_ID),n=l(d&ARRAY?ARRAY_SIZE:ARRAYBUFFERVIEW_SIZE,a),o=new Uint32Array(j.buffer);o[n+ARRAYBUFFERVIEW_BUFFER_OFFSET>>>2]=m(k),o[n+ARRAYBUFFERVIEW_DATASTART_OFFSET>>>2]=k,o[n+ARRAYBUFFERVIEW_DATALENGTH_OFFSET>>>2]=h<<g,d&ARRAY&&(o[n+ARRAY_LENGTH_OFFSET>>>2]=h);const p=f(g,d&VAL_SIGNED,d&VAL_FLOAT);if(d&VAL_MANAGED)for(let a=0;a<h;++a)p[(k>>>g)+a]=m(b[a]);else p.set(b,k>>>g);return n},a.__getArrayView=g,a.__getArray=function(a){const b=g(a),c=b.length,d=Array(c);for(let e=0;e<c;e++)d[e]=b[e];return d},a.__getArrayBuffer=function(a){const b=j.buffer,c=new Uint32Array(b)[a+SIZE_OFFSET>>>2];return b.slice(a,a+c)},a.__getInt8Array=h.bind(null,Int8Array,0),a.__getUint8Array=h.bind(null,Uint8Array,0),a.__getUint8ClampedArray=h.bind(null,Uint8ClampedArray,0),a.__getInt16Array=h.bind(null,Int16Array,1),a.__getUint16Array=h.bind(null,Uint16Array,1),a.__getInt32Array=h.bind(null,Int32Array,2),a.__getUint32Array=h.bind(null,Uint32Array,2),BIGINT&&(a.__getInt64Array=h.bind(null,BigInt64Array,3),a.__getUint64Array=h.bind(null,BigUint64Array,3)),a.__getFloat32Array=h.bind(null,Float32Array,2),a.__getFloat64Array=h.bind(null,Float64Array,3),a.__instanceof=function(a,b){const c=new Uint32Array(j.buffer);var e=c[a+ID_OFFSET>>>2];if(e<=c[n>>>2])do if(e==b)return!0;while(e=d(e));return!1},a.memory=a.memory||j,a.table=a.table||k,demangle(i,a)}function wrapFunction(a,b){var c=(...c)=>(b(c.length),a(...c));return c.original=a,c}function isResponse(a){return"undefined"!=typeof Response&&a instanceof Response}async function instantiate(a,b){return isResponse(a=await a)?instantiateStreaming(a,b):postInstantiate(preInstantiate(b||(b={})),(await WebAssembly.instantiate(a instanceof WebAssembly.Module?a:await WebAssembly.compile(a),b)))}async function instantiateStreaming(a,b){return WebAssembly.instantiateStreaming?postInstantiate(preInstantiate(b||(b={})),(await WebAssembly.instantiateStreaming(a,b)).instance):instantiate(isResponse(a=await a)?a.arrayBuffer():a,b)}var instantiateStreaming_1=instantiateStreaming;function demangle(a,b){function c(a,b){return Object.prototype.hasOwnProperty.call(a,b)}var d=b?Object.create(b):{},e=a.__setargc||function(){};for(let f in a){if(!c(a,f))continue;let b=a[f],g=f.split("."),h=d;for(;1<g.length;){let a=g.shift();c(h,a)||(h[a]={}),h=h[a]}let i=g[0],j=i.indexOf("#");if(0<=j){let d=i.substring(0,j),g=h[d];if("undefined"==typeof g||!g.prototype){let a=function(...b){return a.wrap(a.prototype.constructor(0,...b))};a.prototype={valueOf:function(){return this[THIS]}},a.wrap=function(b){return Object.create(a.prototype,{[THIS]:{value:b,writable:!1}})},g&&Object.getOwnPropertyNames(g).forEach(b=>Object.defineProperty(a,b,Object.getOwnPropertyDescriptor(g,b))),h[d]=a}if(i=i.substring(j+1),h=h[d].prototype,!/^(get|set):/.test(i))"constructor"===i?h[i]=wrapFunction(b,e):Object.defineProperty(h,i,{value:function(...a){return e(a.length),b(this[THIS],...a)}});else if(!c(h,i=i.substring(4))){let b=a[f.replace("set:","get:")],c=a[f.replace("get:","set:")];Object.defineProperty(h,i,{get:function(){return b(this[THIS])},set:function(a){c(this[THIS],a)},enumerable:!0})}}else /^(get|set):/.test(i)?!c(h,i=i.substring(4))&&Object.defineProperty(h,i,{get:a[f.replace("set:","get:")],set:a[f.replace("get:","set:")],enumerable:!0}):"function"==typeof b?h[i]=wrapFunction(b,e):h[i]=b}return d}class Compiler{constructor(a){this.wasm=a}static async Build(a){const b={env:{abort(a,b,c,d){console.error("abort called at"+c+":"+d)}}},c=await instantiateStreaming_1(fetch(a),b);return new Compiler(c)}encode(a,b){const c=new DataView(b);let d=0,e=0,f=0;for(const g of a){let a=g.type.codePointAt(0);c.setUint8(d,a),d++;a===77||a===76?(c.setFloat64(d,g.x,!0),d+=8,c.setFloat64(d,g.y,!0),d+=8,e=g.x,f=g.y):a===81?(c.setFloat64(d,e,!0),d+=8,c.setFloat64(d,f,!0),d+=8,c.setFloat64(d,g.x1,!0),d+=8,c.setFloat64(d,g.y1,!0),d+=8,c.setFloat64(d,g.x,!0),d+=8,c.setFloat64(d,g.y,!0),d+=8,e=g.x,f=g.y):a===67?(c.setFloat64(d,e,!0),d+=8,c.setFloat64(d,f,!0),d+=8,c.setFloat64(d,g.x1,!0),d+=8,c.setFloat64(d,g.y1,!0),d+=8,c.setFloat64(d,g.x2,!0),d+=8,c.setFloat64(d,g.y2,!0),d+=8,c.setFloat64(d,g.x,!0),d+=8,c.setFloat64(d,g.y,!0),d+=8,e=g.x,f=g.y):void 0}return d}compileEncoded(a,b,c,d,e){var f=Math.abs,g=Math.max,h=Math.min,i=Math.round;if(d=g(0,h(255,i(d))),e=f(e),a!==this.wasm.memory.buffer){const b=this.wasm.memory.buffer;for(let c=0,d=a.byteLength;c<d;++c)b[c]=a[c]}const j=this.wasm.compile(b,c,d,e),k=new Float64Array(this.wasm.memory.buffer),l=this.wasm.__getUint32Array(j),m=Array(l.length);for(let f=0;f<l.length;f++){const a={fill:[],holes:[]},b=this.wasm.__getUint32Array(l[f]);for(const c of b){const b=this.wasm.__getUint32Array(c);let d;0===a.fill.length?d=a.fill:a.holes.push(d=[]);for(const a of b)d.push([k[(a>>>3)+0],k[(a>>>3)+1]])}m[f]=a}return m}compile(a,b,c,d){const e=this.wasm.memory.buffer,f=this.encode(a,this.wasm.memory.buffer);return this.compileEncoded(e,f,b,c,d)}}class Font{constructor(a,b){this.raw=a,this.compiler=b}static async Install(a,b){const c=await opentypeLoadAsync(a);return new Font(c,b)}static Measure(a,b,c){return new Metrics(a,b,c)}static Compile(a,b,c,d,e){const f=a.raw.getPath(b,0,0,c).commands,g=a.raw.outlinesFormat,h=a.compiler.compile(f,g,d,e*c),i=([a,b])=>new BABYLON.Vector3(a,0,-b),j=[];for(const{fill:f,holes:g}of h){const a={fill:f.map(i),holes:g.map(a=>a.map(i))};j.push(a)}return j}static BuildMesh(a,b,c){const d=[];for(const{fill:e,holes:f}of a){const a=BABYLON.MeshBuilder.CreatePolygon("",{...b,shape:e,holes:f},c);d.push(a)}return 0<d.length?BABYLON.Mesh.MergeMeshes(d,!0,!0):null}}class Metrics{constructor(a,b,c){this.font=a,this.name=b,this.size=c}get ascender(){return this.font.raw.ascender/this.font.raw.unitsPerEm*this.size}get descender(){return this.font.raw.descender/this.font.raw.unitsPerEm*this.size}get advanceWidth(){return this.font.raw.getAdvanceWidth(this.name,this.size)}}function opentypeLoadAsync(a){return new Promise((b,c)=>{opentype.load(a,(a,d)=>{a?c(a):b(d)})})}export{Compiler,Font};
//# sourceMappingURL=babylon.font.mjs.map
