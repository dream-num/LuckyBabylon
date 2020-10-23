 //sceneConfig数据结构
// var sceneConfig = {
//     //场景整体背景
//     "background2D" : "http://bai",
//     "background3D" : "http://bai",
//     "particle3D" : "http://bai",
//     "is3D" : false,
//     "iconData":[{
//          "icon":"http://bai",
//          "name":"五哥"
//      }],
//     "offlineMode":true,
//     "autoPlay":true,
//     "filter":{},
//     "pages":[
//         //签到页
//         {
//             //场景页背景
//             "background2D" : "http://bai",
//             "background3D" : "http://bai",
//             "particle3D" : "http://bai",
//             "is3D" : false,
//            
//             //场景页3d相关功能
//             "functionType":"sign",
//             "functionEffect":"sphere",
//             
//         },
//         //抽奖页
//         {
//             //场景页背景
//             "background2D" : "http://bai",
//             "background3D" : "http://bai",
//             "particle3D" : "http://bai",
//             "is3D" : false,
            
//             //场景页3d相关功能
//             "functionType":"lottery",
//             "functionEffect":"sphere",
//         }
//     ],
//     redPacket:[{}]
// }

import { blankImageBase64, meshDatas, masterTemplate, materialTextureDatas, textureMap } from '@/master/js/meshData';

var particle3D = (function() {
    let Font;
    function initialize(engine, fontInstance) {
        var _this = this;
        _this.engine = engine;
        Font = fontInstance;
        // _this.scene = scene;
        // _this.camera = camera;

        if(typeof(callback)=="function"){
            callback();
        }

    }

    
    initialize.prototype.play = function() {

    }

    initialize.prototype.reset = function() {

    }


    initialize.prototype.createTextureAttribute = function(p, material, t, c, e, par, scene){
        if(t && p[t] && p[t] instanceof Object){
            material[t] = this.createTexture(p[t], scene);
        }

        if(c && p[c]){
            this.setColor3Value(c, new BABYLON.Color3(1,1,1));
        }

        if(e && p[e]){
            var param = p[par];

            material[par] = new BABYLON.FresnelParameters();
            material[par].bias = param.bias;
            material[par].power = param.power;
            var cl = rgbOrRgbaToArray(param.leftColor);
            material[par].leftColor = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
            var cr = rgbOrRgbaToArray(param.rightColor);
            material[par].rightColor = new BABYLON.Color3(cr[0]/255,cr[1]/255,cr[2]/255);
        }
    }

    initialize.prototype.updateSingleValue = function(key, object, param){
        if(paramJson==null || scene==null){
            return;
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let material;

        let p = paramJson;
        this.p = p;





        var curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;

    }

    initialize.prototype.createMaterial = function(paramJson, scene){
        if(paramJson==null || scene==null){
            return;
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let material;

        let p = paramJson;
        this.p = p;

        if(p.type == "StandardMaterial"){
            material = new BABYLON.StandardMaterial(p.id, scene);
            this.updateObject = material;

            //漫反射
            this.createTextureAttribute(p, material, "diffuseTexture", "diffuseColor", "enableDiffuseFresnelParameters", "diffuseFresnelParameters", scene);
            // if(p.diffuseTexture){
            //     material.diffuseTexture = this.createTexture(p.diffuseTexture, scene);
            // }

            // if(p.diffuseColor){
            //     this.setColor3Value("diffuseColor", new BABYLON.Color3(1,1,1));
            // }

            // if(p.enableDiffuseFresnelParameters){
            //     var param = p.diffuseFresnelParameters;

            //     material.diffuseFresnelParameters = new BABYLON.FresnelParameters();
            //     material.diffuseFresnelParameters.bias = param.bias;
            //     material.diffuseFresnelParameters.power = param.power;
            //     material.diffuseFresnelParameters.leftColor = param.leftColor;
            //     material.diffuseFresnelParameters.rightColor = param.rightColor;
            // }

            //镜面反射
            this.createTextureAttribute(p, material, "specularTexture", "specularColor",null, null, scene);
            // if(p.specularTexture){
            //     material.specularTexture = this.createTexture(p.specularTexture, scene);
            // }

            // if(p.specularColor){
            //     this.setColor3Value("specularColor", new BABYLON.Color3(1,1,1));
            // }

            this.setValue("specularPower", 0);

            //自发光
            this.createTextureAttribute(p, material, "emissiveTexture", "emissiveColor", "enableEmissiveFresnelParameters", "emissiveFresnelParameters", scene);
            // if(p.emissiveTexture){
            //     material.emissiveTexture = this.createTexture(p.emissiveTexture, scene);
            // }

            // if(p.emissiveColor){
            //     this.setColor3Value("emissiveColor", new BABYLON.Color3(1,1,1));
            // }

            // if(p.enableEmissiveFresnelParameters){
            //     var param = p.emissiveFresnelParameters;

            //     material.emissiveFresnelParameters = new BABYLON.FresnelParameters();
            //     material.emissiveFresnelParameters.bias = param.bias;
            //     material.emissiveFresnelParameters.power = param.power;
            //     material.emissiveFresnelParameters.leftColor = param.leftColor;
            //     material.emissiveFresnelParameters.rightColor = param.rightColor;
            // }

            //环境光
            this.createTextureAttribute(p, material, "ambientTexture", "ambientColor",null, null, scene);
            // if(p.ambientTexture){
            //     material.ambientTexture = this.createTexture(p.ambientTexture, scene);
            // }

            // if(p.ambientColor){
            //     this.setColor3Value("ambientColor", new BABYLON.Color3(1,1,1));
            // }


            //环境反射
            this.createTextureAttribute(p, material, "reflectionTexture", null, "enableReflectionFresnelParameters", "reflectionFresnelParameters", scene);

            //折射纹理
            this.createTextureAttribute(p, material, "refractionTexture", null, "enableRefractionFresnelParameters", "refractionFresnelParameters", scene);

            //透明度纹理
            this.createTextureAttribute(p, material, "opacityTexture", null, "enableOpacityFresnelParameters", "opacityFresnelParameters", scene);

            //法线纹理
            this.createTextureAttribute(p, material, "bumpTexture", null, null, null, scene);

            //灯光纹理
            this.createTextureAttribute(p, material, "lightmapTexture", null, null, null, scene);

            this.setValue("useLightmapAsShadowmap", false);

            this.setValue("alpha", 1);

            this.setValue("alphaMode", 2);

            // if(p.alphaMode!=null && p.alphaMode.length>0){
            //     material.alphaMode = BABYLON.Engine[p.alphaMode];
            // }

            this.setValue("wireframe", false);

            this.setValue("backFaceCulling", false);

            this.setValue("fillMode", 0);

            // if(p.fillMode!=null && p.fillMode.length>0){
            //     material.fillMode = BABYLON.Material[p.fillMode];
            // }

            this.setValue("pointsCloud", false);

            this.setValue("pointSize", 1);

            this.setValue("useParallax", false);
            this.setValue("useParallaxOcclusion", false);
            this.setValue("parallaxScaleBias", 0.1);



        }
        else if(p.type == "PBRMaterial"){
            material = new BABYLON.PBRMaterial(p.id, scene);
            this.updateObject = material;

            this.setColor3Value("albedoColor");
            this.setColor3Value("reflectivityColor");

            this.setValue("metallic");
            this.setValue("roughness");

            this.setValue("linkRefractionWithTransparency");
            this.setValue("indexOfRefraction");
            this.setValue("alpha");
            this.setValue("directIntensity");
            this.setValue("environmentIntensity");
            this.setValue("cameraExposure");
            this.setValue("cameraContrast");
            this.setValue("microSurface");
            this.setValue("backFaceCulling");
            this.setValue("forceIrradianceInFragment");

            this.setValue("emissiveIntensity");
            this.setColor3Value("emissiveColor");

            this.setValue("useLightmapAsShadowmap");

            if(p.enableSubSurface && p.subSurface){
                material.subSurface.isRefractionEnabled = p.subSurface.isRefractionEnabled;
                material.subSurface.indexOfRefraction = p.subSurface.indexOfRefraction;
                material.subSurface.refractionIntensity = p.subSurface.refractionIntensity;
                material.subSurface.isTranslucencyEnabled = p.subSurface.isTranslucencyEnabled;
                var cl = rgbOrRgbaToArray(p.subSurface.tintColor);
                material.subSurface.tintColor = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
                material.subSurface.tintColorAtDistance = p.subSurface.tintColorAtDistance;
                material.subSurface.minimumThickness = p.subSurface.minimumThickness;
                material.subSurface.maximumThickness = p.subSurface.maximumThickness;
                material.subSurface.linkRefractionWithTransparency = p.subSurface.linkRefractionWithTransparency;
                material.subSurface.useMaskFromThicknessTexture = p.subSurface.useMaskFromThicknessTexture;
            }

            if(p.enableClearCoat && p.clearCoat){
                material.clearCoat.isEnabled = true;
                material.clearCoat.intensity = p.clearCoat.intensity;
                material.clearCoat.isTintEnabled = p.clearCoat.isTintEnabled;
                var cl = rgbOrRgbaToArray(p.clearCoat.tintColor);
                material.clearCoat.tintColor = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
                material.clearCoat.tintColorAtDistance = p.clearCoat.tintColorAtDistance;
                material.clearCoat.tintThickness = p.clearCoat.tintThickness;
                material.clearCoat.roughness = p.clearCoat.roughness;
                material.clearCoat.indexOfRefraction = p.clearCoat.indexOfRefraction;
            }

            if(p.enableAnisotropy && p.anisotropy){
                material.anisotropy.isEnabled = true;
                material.anisotropy.intensity = p.anisotropy.intensity;
                material.anisotropy.direction.x = p.anisotropy.direction.x;
                material.anisotropy.direction.y = p.anisotropy.direction.y;
            }

            if(p.enableSheen && p.sheen){
                material.anisotropy.isEnabled = true;
                material.anisotropy.intensity = p.anisotropy.intensity;
                var cl = rgbOrRgbaToArray(p.anisotropy.color);
                material.anisotropy.color = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
            }

        }
        else if(p.type == "BackgroundMaterial"){
            material = new BABYLON.BackgroundMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("backFaceCulling");
            this.setValue("useRGBColor");
            this.setColor3Value("primaryColor");
            this.setValue("primaryColorShadowLevel");
            this.setValue("primaryColorHighlightLevel");
        }
        else if(p.type == "FireMaterial"){
            material = new BABYLON.FireMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("backFaceCulling");
            this.setValue("alpha");
            this.setValue("speed");
        }
        else if(p.type == "WaterMaterial"){
            material = new BABYLON.WaterMaterial(p.id, scene, new BABYLON.Vector2(512, 512));

            p.renderList.forEach(item => {
                material.addToRenderList(scene.getMeshByID(item));
            });

            this.updateObject = material;

            this.setValue("windForce");
            this.setValue("waveHeight");
            this.setValue("waveLength");
            this.setValue("waveSpeed");
            this.setVect2Value("windDirection");
            this.setColor3Value("waterColor");
            this.setColor3Value("waterColor2");
            this.setValue("colorBlendFactor");
            this.setValue("backFaceCulling");
            this.setValue("alpha");
        }
        else if(p.type == "LavaMaterial"){
            material = new BABYLON.LavaMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("unlit");
            this.setValue("backFaceCulling");
            this.setValue("alpha");
            this.setValue("speed");
            this.setColor3Value("fogColor");
        }
        else if(p.type == "NormalMaterial"){
            material = new BABYLON.NormalMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("alpha");
            this.setValue("backFaceCulling");
        }
        else if(p.type == "FurMaterial"){
            material = new BABYLON.FurMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("highLevelFur");
            this.setValue("furSpacing");
            this.setValue("furDensity");
            this.setValue("furSpeed");
            this.setVect3Value("furGravity");
            this.setValue("furQuality");
            this.setValue("furLength");
            this.setValue("furAngle");
            this.setColor3Value("furColor");
            this.setValue("alpha");
            this.setValue("backFaceCulling");
        }
        else if(p.type == "TerrainMaterial"){
            material = new BABYLON.TerrainMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("alpha");
        }
        else if(p.type == "TriPlanarMaterial"){
            material = new BABYLON.TriPlanarMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("tileSize");
            this.setValue("alpha");
        }
        else if(p.type == "GradientMaterial"){
            material = new BABYLON.GradientMaterial(p.id, scene);
            this.updateObject = material;

            this.setColor3Value("topColor");
            this.setColor3Value("bottomColor");
            this.setValue("offset");
            this.setValue("scale");
            this.setValue("smoothness");
            this.setValue("alpha");
            this.setValue("backFaceCulling");
        }
        else if(p.type == "SkyMaterial"){
            material = new BABYLON.SkyMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("turbidity");
            this.setValue("luminance");
            this.setValue("inclination");
            this.setValue("azimuth");
            this.setValue("useSunPosition");
            this.setVect3Value("sunPosition");
            this.setValue("rayleigh");
            this.setValue("mieDirectionalG");
            this.setValue("mieCoefficient");
            this.setValue("alpha");
            this.setValue("backFaceCulling");
        }
        else if(p.type == "GridMaterial"){
            material = new BABYLON.GridMaterial(p.id, scene);
            this.updateObject = material;

            this.setColor3Value("mainColor");
            this.setColor3Value("lineColor");
            this.setValue("opacity");
            this.setValue("gridRatio");
            this.setValue("majorUnitFrequency");
            this.setValue("minorUnitVisibility");
            this.setVect3Value("gridOffset");
        }
        else if(p.type == "ShadowOnlyMaterial"){
            material = new BABYLON.ShadowOnlyMaterial(p.id, scene);
            this.updateObject = material;

            this.setColor3Value("shadowColor");
            this.setValue("alpha");
        }
        else if(p.type == "MixMaterial"){
            material = new BABYLON.MixMaterial(p.id, scene);
            this.updateObject = material;

            this.setValue("alpha");
        }
        else if(p.type == "MToonMaterial"){
            material = new window.MToonMaterial(p.id, scene);
            this.updateObject = material;


            this.setColor3Value("diffuseColor");
            this.setColor3Value("emissiveColor");
            this.setColor3Value("ambientColor");
            this.setColor3Value("outlineColor");
            this.setValue("outlineWidth");
            this.setValue("outlineWidthMode");
            this.setValue("outlineColorMode");

            this.setColor3Value("rimColor");
            this.setValue("shadeShift");
            this.setValue("shadeToony");

            this.setValue("alpha", 1);

            this.setValue("alphaMode", 2);

            // if(p.alphaMode!=null && p.alphaMode.length>0){
            //     material.alphaMode = BABYLON.Engine[p.alphaMode];
            // }

            this.setValue("wireframe", false);

            this.setValue("backFaceCulling", false);

            this.setValue("fillMode", 0);

            // if(p.fillMode!=null && p.fillMode.length>0){
            //     material.fillMode = BABYLON.Material[p.fillMode];
            // }

            this.setValue("pointsCloud", false);

            this.setValue("pointSize", 1);

            // this.setValue("useParallax", false);
            // this.setValue("useParallaxOcclusion", false);
            // this.setValue("parallaxScaleBias", 0.1);



        }


        if(p.animations!=null && p.animations.length>0){
            createAnimation(this.updateObject, p.animations, p.animationSpeed, p.animationLoop, babylon);
        }

        var curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;

    }

    initialize.prototype.createTexture = function(paramJson, scene){
        if(paramJson==null || scene==null){
            return;
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let material;

        let p = paramJson;
        this.p = p;

        let defualtSourceImage  = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABS2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDAgNzkuMTYwNDUxLCAyMDE3LzA1LzA2LTAxOjA4OjIxICAgICAgICAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+LUNEtwAAAFpJREFUOI3tkrERwCAQw2Tg2If9h4B9AH+qtElBkyIaQGefLdsREaSU2HuTc+bGNmMMJDHnpNbKWgtJ2KaUQuKQX/AFQem9P+7cWuPpJ68JIuKsgqQzwRu/AC7scDCL94T3AQAAAABJRU5ErkJggg==";

        
        if(p.type == "Texture"){
            // if(p.source==null || p.source.length==0){
            //     return null;
            // }
            

            // let texture = new BABYLON.Texture(p.source, scene, p.noMipmap, p.invertY, 0,function(){
            //     alert(p.name);
            // }, null,null, true);
            let texture = new BABYLON.Texture(p.source, scene, p.noMipmap, p.invertY, 0,null, null,null, true);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;
            // texture.uid = p.id;

            // this.setValue("invertY");
            this.setValue("hasAlpha");
            this.setValue("level");
            this.setValue("vScale");
            this.setValue("uScale");
            this.setValue("vOffset");
            this.setValue("uOffset");
            this.setValue("vAng");
            this.setValue("uAng");

            this.setValue("isBlocking", true);

            this.setValue("coordinatesMode");

            // if(p.coordinatesMode){
            //     texture.coordinatesMode = BABYLON.Texture[p.coordinatesMode];
            // }
        }
        else if(p.type == "CubeTexture"){
            let texture;
            if(p.enableSixImage){
                let sourceArray = p.sourceArray, files=[];
                sourceArray.forEach(base=>{
                    if(base && base.length>0){
                        let type = getImageType(base);
                        files.push(convertSourceToUrl(base, type));
                    }
                    else{
                        files.push(convertSourceToUrl(defualtSourceImage, "image/png"));
                    }

                });
                texture = new BABYLON.CubeTexture("", scene, null, false, files);
            }
            else{
                let extention = "dds";
                if(p.extention){
                    extention = p.extention;
                }
                texture = new BABYLON.CubeTexture(convertSourceToUrl(p.source), scene, null,false,null,null,null,undefined, true,"."+extention,true);
            }
            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("invertZ");
            this.setValue("rotationY");
            this.setValue("level");
            this.setValue("coordinatesMode");
        }
        else if(p.type == "HDRCubeTexture"){
            let texture;
            if(p.enableSixImage){
                // texture = new BABYLON.CubeTexture(p.source, scene);
            }
            else{
                let size = 512;
                if(p.textureSize){
                    size = p.textureSize;
                }
                texture = new BABYLON.HDRCubeTexture(convertSourceToUrl(p.source, "application/hdr"), scene, size);
            }
            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("invertZ");
            this.setValue("rotationY");
            this.setValue("level");
            this.setValue("coordinatesMode");
        }
        else if(p.type == "EquiRectangularCubeTexture"){
            let texture;
            if(p.enableSixImage){
                // texture = new BABYLON.CubeTexture(p.source, scene);
            }
            else{
                let size = 512;
                if(p.textureSize){
                    size = p.textureSize;
                }

                let source = p.source;
                if(!p.source || p.source.length==0){
                    source = defualtSourceImage;
                }
                let type = getImageType(source);
                texture = new BABYLON.EquiRectangularCubeTexture(convertSourceToUrl(source, type), scene, size);
            }
            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("invertZ");
            this.setValue("rotationY");
            this.setValue("level");
            this.setValue("coordinatesMode");
        }
        else if(p.type == "ReflectionProbe"){
            let Probe = new BABYLON.ReflectionProbe(p.id, 512, scene);

            p.renderList.forEach(item => {
                Probe.renderList.push(scene.getMeshByID(item));
            });

            Probe.refreshRate = p.refreshRate;

            let texture = Probe.cubeTexture;
            this.updateObject = texture;
            texture.name = p.name;
            texture.uniqueId = p.id;
        }
        else if(p.type == "MirrorTexture"){
            let texture = new BABYLON.MirrorTexture(p.id, 512, scene, true);

            p.renderList.forEach(item => {
                texture.renderList.push(scene.getMeshByID(item));
            });

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;
            let mp = p.mirrorPlane;
            if(mp!=null && mp.length>0){
                texture.mirrorPlane = new BABYLON.Plane(mp[0], mp[1], mp[2], mp[3]);
            }

            this.setValue("ratio");
            // this.setValue("distance");
            this.setValue("level");
            this.setValue("adaptiveBlurKernel");
        }
        else if(p.type == "refractionTexture"){
            let texture = new BABYLON.RefractionTexture(p.id, 512, scene, true);

            p.renderList.forEach(item => {
                texture.renderList.push(scene.getMeshByID(item));
            });

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;
            let mp = p.refractionPlane;
            if(mp!=null && mp.length>0){
                texture.refractionPlane = new BABYLON.Plane(mp[0], mp[1], mp[2], mp[3]);
            }

            // this.setValue("distance");
            this.setValue("depth");
        }
        else if(p.type == "BrickProceduralTexture"){
            let texture = new BABYLON.BrickProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("numberOfBricksHeight");
            this.setValue("numberOfBricksWidth");
            this.setColor3Value("jointColor");
            this.setColor3Value("brickColor");
        }
        else if(p.type == "CloudProceduralTexture"){
            let texture = new BABYLON.CloudProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setColor4Value("skyColor");
            this.setColor4Value("cloudColor");
        }
        else if(p.type == "FireProceduralTexture"){
            let texture = new BABYLON.FireProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setVect2Value("speed");
            this.setVect2Value("shift");
            // this.setColor3Value("fireColors");

            var colors = [p.c1, p.c2, p.c3, p.c4, p.c5, p.c6];
            colors.forEach((pcolor,index)=>{
                if(pcolor!=null){
                    let c = rgbOrRgbaToArray(pcolor);
                    texture.fireColors[index].r = c[0]/255;
                    texture.fireColors[index].g = c[1]/255;
                    texture.fireColors[index].b = c[2]/255;
                }    
            });

            // this.setColor3Value("c1");
            // this.setColor3Value("c2");
            // this.setColor3Value("c3");
            // this.setColor3Value("c4");
            // this.setColor3Value("c5");
            // this.setColor3Value("c6");
        }
        else if(p.type == "GrassProceduralTexture"){
            let texture = new BABYLON.GrassProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            var colors = [p.herb1Color, p.herb2Color, p.herb3Color];
            colors.forEach((pcolor,index)=>{
                if(pcolor!=null){
                    let c = rgbOrRgbaToArray(pcolor);
                    texture.grassColors[index].r = c[0]/255;
                    texture.grassColors[index].g = c[1]/255;
                    texture.grassColors[index].b = c[2]/255;
                }    
            });

            // this.setColor3Value("grassColors");
            // this.setColor3Value("herb1Color");
            // this.setColor3Value("herb2Color");
            // this.setColor3Value("herb3Color");
            this.setColor3Value("groundColor");
        }
        else if(p.type == "MarbleProceduralTexture"){
            let texture = new BABYLON.MarbleProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("numberOfBricksHeight");
            this.setValue("numberOfBricksWidth");
            this.setColor3Value("jointColor");
            // this.setColor3Value("marbleColor");
        }
        else if(p.type == "RoadProceduralTexture"){
            let texture = new BABYLON.RoadProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setColor3Value("roadColor");
        }
        else if(p.type == "WoodProceduralTexture"){
            let texture = new BABYLON.WoodProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setColor3Value("woodColor");
            this.setValue("ampScale");
        }
        else if(p.type == "NoiseProceduralTexture"){
            let texture = new BABYLON.NoiseProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            this.setValue("brightness");
            this.setValue("octaves");
            this.setValue("persistence");
            this.setValue("animationSpeedFactor");
        }
        else if(p.type == "StarfieldProceduralTexture"){
            let texture = new BABYLON.StarfieldProceduralTexture(p.id, 512, scene);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;

            texture.metadata = {
                "type":"StarfieldProceduralTexture",
                "isMoveAble":false,
            };

            this.setValue("brightness",null, "StarfieldBrightness");
            this.setValue("beta");
            this.setValue("time",null, "Starfieldtime");
            this.setValue("coordinatesMode");
        }
        else if(p.type=="VideoTexture"){
            let texture = new BABYLON.VideoTexture(p.id, p.videoSrc, scene, true);

            this.updateObject = texture;

            texture.name = p.name;
            texture.uniqueId = p.id;
            // texture.uid = p.id;

            // this.setValue("invertY");
            this.setValue("hasAlpha");
            this.setValue("level");
            this.setValue("vScale");
            this.setValue("uScale");
            this.setValue("vOffset");
            this.setValue("uOffset");
            this.setValue("vAng");
            this.setValue("uAng");

            this.setValue("coordinatesMode");

            this.setValue("isBlocking", true);

            texture.video.autoplay = p.autoplay==null?true:p.autoplay;

            if(p.poster && p.poster.length>0){
                texture.video.poster = p.poster;
                texture.url = p.poster;
            }
        }



        var curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    initialize.prototype.createObject = function(paramJson, babylon, mode, vertexData) {
        let scene=babylon.scene, camera=scene.activeCamera, gizmo=babylon.gizmo;
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene, camera);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;

        if(p.mainType == "mesh"){
            let mesh;
            this.updateObject = mesh = createMeshObject(p, babylon, mode, vertexData);

            // this.setValue("isEnabled", true);

            this.setValue("isVisible", true);

            this.setVect3Value("position", new BABYLON.Vector3(0, 0, 0));

            this.setVect3Value("rotation", new BABYLON.Vector3(0, 0, 0));

            this.setVect3Value("scaling", new BABYLON.Vector3(1, 1, 1));

            this.setValue("visibility", 1);

            this.setValue("isPickable", true);

            if(p.enableEdgesRendering){
                mesh.enableEdgesRendering();    
                this.setValue("edgesWidth", 4);
                this.setColor4Value("edgesColor", new BABYLON.Color4(0,0,0,1));
            }
            
            if(p.enableHighlight){
                createhighlight(mesh, p, scene);
            }

            if(p.enableGlow){
                if(scene.effectLayers){
                    let gl = scene.getGlowLayerByName(scene.id+"_glow");
                    if(gl!=null){
                        gl.addIncludedOnlyMesh(mesh);
                    }
                    setMetaData(mesh, "enableGlow", true);
                }
            }


            this.setValue("billboardMode", 0);
            // if(p.billboardMode){
            //     mesh.billboardMode = BABYLON.Mesh[p.billboardMode];
            // }

            this.setValue("infiniteDistance", false);

            this.setValue("receiveShadows", false);
            
            if(p.type!="Lines" && p.type!="DashedLines" && p.type!="LineSystem"){
                this.setValue("checkCollisions", false);
            }
            
            this.setValue("applyFog", true);

            this.setValue("isBlocker", false);

            if(p.enableVolumetricLight){
                createVolumetricLight(mesh, p, scene);
            }

            if(p.enableLensFlare){
                createLensFlareSystem(p, scene, mesh);
                
            }

            createLookAt(mesh, p, babylon, mode);

            if(p.subMeshes && p.subMeshes.length>0){
                createSubMeshes(mesh, p.subMeshes);
                // mesh.subMeshes = [];
                // var verticesCount = mesh.getTotalVertices();

                // p.subMeshes.forEach((sub)=>{
                //     // indexCount: 103440
                //     // indexStart: 0
                //     // materialIndex: 0
                //     // verticesCount: 35387
                //     // verticesStart: 0
                //     let vc = sub.verticesCount;
                //     if(!vc){
                //         vc = verticesCount;
                //     }
                //     new BABYLON.SubMesh(sub.materialIndex, sub.verticesStart, vc, sub.indexStart, sub.indexCount, mesh);
                // });

                
                // // new BABYLON.SubMesh(1, 0, verticesCount, 900, 900, sphere);
                // // new BABYLON.SubMesh(2, 0, verticesCount, 1800, 2088, sphere);
            }

            if(p.materialId && mode!="u"){
                // let m = this.createMaterial(p.material, scene);
                let m = scene.getMaterialByID(p.materialId);
                if(m){
                    mesh.material = m;
                }
            }

            if(p.parentId && mode!="u"){
                // let m = this.createMaterial(p.material, scene);
                let m = scene.getMeshByID(p.parentId);
                if(m){
                    mesh.parent = m;
                }
            }

            if(p.enableRigidPhysic){
                createRigidPhysic(mesh, p, scene);
                if(gizmo){
                    gizmo.attachToMesh(null);
                }
            }
            else if(p.enableSoftPhysic){
                createSoftPhysic(mesh, p, scene);
                if(gizmo){
                    gizmo.attachToMesh(null);
                }
            }
            else{
                if(gizmo){
                    gizmo.attachToMesh(mesh);
                }
            }
            
            

        }
        else if(p.mainType == "material"){
            this.updateObject = this.createMaterial(p, scene);
        }
        else if(p.mainType == "texture"){
            this.updateObject = this.createTexture(p, scene);
        }
        else if(p.mainType == "camera"){
            this.updateObject = this.createCamera(p, babylon, mode);
        }
        else if(p.mainType == "particle"){
            this.updateObject = this.createParticle(p, babylon,mode);
        }
        else if(p.mainType == "spriteManager"){
            this.updateObject = this.createSpriteManager(p, babylon,mode);
        }
        else if(p.mainType == "light"){
            this.updateObject = this.createLight(p, babylon, mode);
        }
        else if(p.mainType == "transformNode"){
            this.updateObject = BABYLON.TransformNode.Parse(p, scene);// this.createLight(p, babylon, mode);
        }
        else if(p.mainType == "instance"){
            this.updateObject = this.addInstance(p, babylon, mode);
        }
        else if(p.mainType == "gui2D"){
            this.updateObject = this.createGui2D(p, babylon, mode);
        }

        if(p.animations!=null && p.animations.length>0){
            createAnimation(this.updateObject, p.animations, p.animationSpeed, p.animationLoop, babylon);
        }

        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    function createSubMeshes(mesh, subMeshes){
        mesh.subMeshes = [];
        var verticesCount = mesh.getTotalVertices();
        var indexCount = mesh.getTotalIndices();

        subMeshes.forEach((sub)=>{
            // indexCount: 103440
            // indexStart: 0
            // materialIndex: 0
            // verticesCount: 35387
            // verticesStart: 0
            let vc = sub.verticesCount;
            if(!vc){
                vc = verticesCount;
            }

            let ic = sub.indexCount;
            if(!ic){
                ic = indexCount;
            }
            new BABYLON.SubMesh(sub.materialIndex, sub.verticesStart, vc, sub.indexStart, ic, mesh);
        });
        
    }


    initialize.prototype.addInstance = function(paramJson, babylon, mode){
        let scene=babylon.scene, camera=scene.activeCamera, gizmo=babylon.gizmo;
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene, camera);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;

        let mesh = scene.getMeshByID(p.instanceByMeshId);
        if(!mesh){
            return null;
        }

        var newInstance = mesh.createInstance(p.id);
        this.updateObject = newInstance;

        this.setValue("isVisible", true);

        this.setVect3Value("position", new BABYLON.Vector3(0, 0, 0));

        this.setVect3Value("rotation", new BABYLON.Vector3(0, 0, 0));

        this.setVect3Value("scaling", new BABYLON.Vector3(1, 1, 1));

        // this.setValue("visibility", 1);

        this.setValue("isPickable", true);



        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    function getDefaultFunction(){
        let getSpriteManagerByID = ' function getSpriteManagerByID(scene){ let object = null; for(let i=0;i<scene.spriteManagers.length;i++){ let sm = scene.spriteManagers[i]; if(sm.name==id){ object = sm; break; } } return object;  }; ';

        let template = ' function pmName(id){ return scene.pmName(id) }; ';
        let tempLIst = ["getCameraByID","getLightByID","getMeshByID","getMaterialByID","getTextureByUniqueID","getSpriteManagerByID","getParticleSystemByID"];

        let defaultFunction = "";

        defaultFunction += getSpriteManagerByID;

        defaultFunction += ' function getDefaultCamera(){ return scene.cameras[0]; };  ';

        tempLIst.forEach((funcName)=>{
            if(funcName=="getTextureByUniqueID"){
                defaultFunction += ' function getTextureByID(id){ return scene.getTextureByUniqueID(id) }; ';
            }
            else{
                defaultFunction += template.replace(new RegExp("pmName",'g'), funcName);
            }
        });

        return defaultFunction;
    }

    let ms3dfProgramInnerLoopList = {};
    initialize.prototype.createProgram = function(paramJson, babylon, mode) {
        let p = paramJson, program = p.pro, scene = babylon.scene, gizmo = babylon.gizmo;
        if(program==null || program.length==0){
            return;
        }

        if(mode==null){
            mode = "b";
        }

        if(gizmo!=null){
            gizmo.attachToMesh(null);
        }

        scene.meshes.forEach(object=>{
            let qua = object.rotationQuaternion;
            if(qua){
                object.rotationQuaternion = null;
                object.rotation = qua.toEulerAngles(); 
            }
        });

        scene.lights.forEach(object=>{
            let qua = object.rotationQuaternion;
            if(qua){
                object.rotationQuaternion = null;
                object.rotation = qua.toEulerAngles(); 
            }
        });

        let pm = "window.msFunctionCache = function(scene, engine, canvas){ "+ getDefaultFunction() +" try{ "+ program +"} catch(err){ console.error(err); } }";
        let engine = scene.getEngine();
        if(p.type=="InnerProgram"){
            try{
               eval(pm);
               let pmAble = window.msFunctionCache;
               pmAble(scene, engine, engine.getRenderingCanvas());
            }
            catch(err){
                console.error(err);
            }
        }
        else if(p.type=="BeforeProgram" || p.type=="LoopProgram"){
            eval(pm);
            let pmAble = window.msFunctionCache;
            ms3dfProgramInnerLoopList[paramJson.id] =  pmAble;

            scene.registerBeforeRender(pmAble);
            
            // = ({
            //     id:paramJson.id,
            //     program:pmAble
            // });
        }
        else if(p.type=="AfterProgram"){
            eval(pm);
            let pmAble = window.msFunctionCache;
            ms3dfProgramInnerLoopList[paramJson.id] =  pmAble;

            scene.registerAfterRender(pmAble);
        }
    }

    initialize.prototype.updateProgram = function(paramJson, babylon, mode) {
        let p = paramJson, program = p.pro, scene = babylon.scene;
        if(program==null || program.length==0){
            return;
        }

        if(mode==null){
            mode = "b";
        }


        let pm = "window.msFunctionCache = function(scene, engine, canvas){ "+ getDefaultFunction() +" try{ "+ program +"} catch(err){ console.error(err); } }";

        if(p.type=="InnerProgram"){
            this.generateScene(p.ms3df, babylon);
        }
        else if(p.type=="BeforeProgram" || p.type=="LoopProgram"){
            eval(pm);
            let pmAble = window.msFunctionCache;
            scene.unregisterBeforeRender(ms3dfProgramInnerLoopList[p.id]);
            scene.unregisterAfterRender(ms3dfProgramInnerLoopList[p.id]);

            ms3dfProgramInnerLoopList[p.id] = pmAble;
            scene.registerBeforeRender(pmAble);

            // for(let i=0;i<ms3dfProgramInnerLoopList.length;i++){
            //     let item = ms3dfProgramInnerLoopList[i];
            //     if(item.id==p.id){
            //         item.program = pmAble;
            //         break;
            //     }
            // }
        }
        else if(p.type=="AfterProgram"){
            eval(pm);
            let pmAble = window.msFunctionCache;
            scene.unregisterBeforeRender(ms3dfProgramInnerLoopList[p.id]);
            scene.unregisterAfterRender(ms3dfProgramInnerLoopList[p.id]);

            ms3dfProgramInnerLoopList[p.id] = pmAble;
            scene.registerAfterRender(pmAble);
        }
    }

    initialize.prototype.deleteProgram = function(paramJson, babylon, mode) {
        let p = paramJson, scene = babylon.scene;
        if(mode==null){
            mode = "b";
        }

        if(p.type=="InnerProgram"){
            this.generateScene(p.ms3df, babylon);
        }
        else if(p.type=="BeforeProgram" || p.type=="AfterProgram" || p.type=="LoopProgram"){
            scene.unregisterBeforeRender(ms3dfProgramInnerLoopList[p.id]);
            scene.unregisterAfterRender(ms3dfProgramInnerLoopList[p.id]);
            // for(let i=0;i<ms3dfProgramInnerLoopList.length;i++){
            //     let item = ms3dfProgramInnerLoopList[i];
            //     if(item.id==p.id){
            //         ms3dfProgramInnerLoopList.splice(i, 1);
            //         break;
            //     }
            // }
        }
        // else if(p.type=="AfterProgram"){

        // }
    }

    // window.ms3dfProgramInnerLoop = function(scene){
    //     let engine = scene.getEngine();
    //     ms3dfProgramInnerLoopList.forEach((p)=>{
    //         try{
    //             if(p && p.program){
    //                 p.program(scene, engine, engine.getRenderingCanvas());
    //             }
    //         }
    //         catch(err){
    //             console.error(err);
    //         }
    //     });
    // }

    function createLookAt(object, p, babylon, mode){
        let scene = babylon.scene;
        if(object.registerLookAtFunction){
            scene.unregisterBeforeRender(object.registerLookAtFunction);
            object.registerLookAtFunction = null;
        }

        if(p.lookAtMode==0){
            
            return;
        }
        let registerLookAtFunction;

        if(p.lookAtMode==1){
            registerLookAtFunction = function(){
                let v = p.lookAtPosition;
                object.lookAt(new BABYLON.Vector3(v[0],v[1],v[2]));
            }
        }
        else if(p.lookAtMode==2 && p.lookAtMesh){
            let v = scene.getMeshByID(p.lookAtMesh);
            if(v!=null){
                registerLookAtFunction = function(){
                    object.lookAt(v.position);
                }
            }

        }
        else if(p.lookAtMode==3 && p.lookAtLight){
            let v = scene.getLightByID(p.lookAtLight);
            if(v!=null){
                registerLookAtFunction = function(){
                    object.lookAt(v.position);
                }
            }
        }
        else if(p.lookAtMode==4 && p.lookAtCamera){
            let v = scene.getCameraByID(p.lookAtCamera);
            if(v!=null){
                registerLookAtFunction = function(){
                    object.lookAt(v.position);
                }
            }
        }

        if(registerLookAtFunction){
            object.registerLookAtFunction = registerLookAtFunction;
            scene.registerBeforeRender(registerLookAtFunction);
        }

    }

    function createAnimation(object, animationOption, animationSpeed, animationLoop, babylon){
        let scene = babylon.scene, gizmo = babylon.gizmo;
        animationOption = JSON.parse(JSON.stringify(animationOption));
        if(gizmo!=null){
            gizmo.attachToMesh(null);
        }

        if(!animationSpeed){
            animationSpeed = 1;
        }

        if(animationLoop===undefined){
            animationLoop = true;
        }

        let qua = object.rotationQuaternion;
        if(qua){
            object.rotationQuaternion = null;
            object.rotation = qua.toEulerAngles(); 
        }

        if(object.animationables){
            object.animationables.stop();
        }

        let animations = [], maxFramePerSecond = -Infinity;
        animationOption.forEach((ani)=>{
            let animation = new BABYLON.Animation(ani.id, ani.property, ani.framePerSecond, ani.dataType, ani.loopBehavior);

            if(ani.keys.length==0){
                return false;
            }

            if(ani.framePerSecond>maxFramePerSecond){
                maxFramePerSecond = ani.framePerSecond;
            }

            if(ani.animationEaseFunction && ani.animationEaseFunction!="default"){
                // Creating an easing function
                var easingFunction = new BABYLON[ani.animationEaseFunction]();

                // For each easing function, you can choose between EASEIN (default), EASEOUT, EASEINOUT
                easingFunction.setEasingMode(BABYLON.EasingFunction[ani.animationEaseInOut]);

                // Adding the easing function to the animation
                animation.setEasingFunction(easingFunction);
            }

            let type = ani.property.split(".")[0];

            ani.keys.forEach(key=>{
                let v = key.value;
                if(v instanceof Array){
                    if(type=="rotation"){
                        key.value = new BABYLON.Vector3(v[0]*Math.PI/180, v[1]*Math.PI/180, v[2]*Math.PI/180);
                    }
                    else{
                        if(v.length==2){
                            key.value = new BABYLON.Vector2(v[0], v[1]);
                        }
                        if(v.length==3){
                            key.value = new BABYLON.Vector3(v[0], v[1], v[2]);
                        }
                        if(v.length==4){
                            key.value = new BABYLON.Vector4(v[0], v[1], v[2], v[3]);
                        }
                    }
                }
                else{
                    if(type=="beta" || type=="alpha" || type=="rotation"){
                        key.value = v*Math.PI/180;
                    }
                }
            });

            animation.setKeys(ani.keys);
            animations.push(animation);
        });

        object.animationables = scene.beginDirectAnimation(object, animations, 0, maxFramePerSecond, animationLoop, animationSpeed);
    }

    function getMultiMaterialById(materialId, babylon){
        let scene=babylon.scene, material = null;
        if(!scene.multiMaterials){
            return null;
        }
        for(let i=0;i<scene.multiMaterials.length;i++){
            let mulmaterial = scene.multiMaterials[i];
            if(mulmaterial.id==materialId){
                material = mulmaterial;
                break;
            }
        }
        return material;
    }

    initialize.prototype.createMultiMaterial = function(paramJson, babylon, mode){
        let scene=babylon.scene;
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;
        
        let preMultiMaterial = getMultiMaterialById(p.id, babylon);
        if(preMultiMaterial){
            preMultiMaterial.dispose();
        }

        var multimat = new BABYLON.MultiMaterial(p.id, scene);
        multimat.name = p.name;
        this.updateObject = multimat;
        p.materials && p.materials.forEach(mid=>{
            let material = scene.getMaterialByID(mid);
            if(material){
                multimat.subMaterials.push(material);
            }
        });

        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    initialize.prototype.createScene = function(paramJson, babylon, mode){
        let scene=babylon.scene;
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;


        this.updateObject = scene;

        this.setValue("id");
        this.setValue("name");
        this.setValue("autoClear");
        this.setColor3Value("clearColor", null);
        this.setColor3Value("ambientColor");
        this.setVect3Value("gravity");
        // this.setValue("environmentTexture");

        if(p.environmentTexture){
            let texture = scene.getTextureByUniqueID(p.environmentTexture);
            scene.environmentTexture = texture;
        }

        this.setValue("fogEnabled");
        this.setValue("fogMode");
        this.setValue("fogDensity");
        this.setValue("fogStart");
        this.setValue("fogEnd");
        this.setColor3Value("fogColor");

        if(p.enableBackground2D && p.background2D){
            new BABYLON.Layer(scene.id + "_layer",p.background2D, scene, true);
        }

        if(p.enableGlow){

            createGlow(p, scene);
        }

        if(p.enableFilter){
            this.changeFilterEffect(p["filter"], babylon);
        }


        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    initialize.prototype.createCamera = function(paramJson, babylon, mode){
        let scene=babylon.scene;
        

        if(paramJson==null || scene==null){
            return;
        }

        paramJson = JSON.parse(JSON.stringify(paramJson));
        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;

        let preCamera = scene.getCameraByID(p.id);

        var camera, canvas = scene.getEngine().getRenderingCanvas();
        if(p.type=="UniversalCamera"){
            camera = new BABYLON.UniversalCamera(p.id, new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]), scene);
            this.updateObject = camera;

            camera.setTarget(new BABYLON.Vector3(p.target[0], p.target[1], p.target[2]));

            camera.attachControl(canvas, false);

            if(p.enablePoint===false){
                camera.inputs.remove(camera.inputs.attached.mouse);
            }

            if(p.enableKeyBoard===false){
                camera.inputs.remove(camera.inputs.attached.keyboard);
            }
            // this.setVect3Value("direction");
        }
        else if(p.type=="ArcRotateCamera"){
            var camera = new BABYLON.ArcRotateCamera(p.id, p.alpha*Math.PI, p.beta*Math.PI, p.radius, new BABYLON.Vector3(p.target[0], p.target[1], p.target[2]), scene);
            // camera.setPosition(new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]));

            this.updateObject = camera;

            this.setValue("lowerRadiusLimit");
            this.setValue("upperRadiusLimit");

            camera.attachControl(canvas, false);

            if(p.enablePoint===false){
                camera.inputs.removeByType("ArcRotateCameraPointersInput");
            }

            if(p.enableMouseWheel===false){
                camera.inputs.removeByType("ArcRotateCameraMouseWheelInput");
            }

            if(p.enableKeyBoard===false){
                camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
            }
        }
        else if(p.type=="FollowCamera"){
            var camera = new BABYLON.FollowCamera(p.id, new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]), scene);            
            this.updateObject = camera;

            this.setValue("radius");
            this.setValue("heightOffset");
            this.setValue("rotationOffset");

            this.setValue("lowerRadiusLimit");
            this.setValue("upperRadiusLimit");

            camera.attachControl(canvas, false);

            if(p.enablePoint===false){
                camera.inputs.removeByType("FollowCameraPointersInput");
            }

            if(p.enableMouseWheel===false){
                camera.inputs.removeByType("FollowCameraMouseWheelInput");
            }

            if(p.enableKeyBoard===false){
                camera.inputs.removeByType("FollowCameraKeyboardMoveInput");
            }
        }



        if(p.lockedTargetId && p.lockedTargetId.length>0){
            let mesh = scene.getMeshByID(p.lockedTargetId);
            if(mesh!=null){
                camera.lockedTarget = mesh; 
            }
        }

        // this.setValue("fov");
        // this.setValue("fovMode");
        // this.setValue("minZ");
        // this.setValue("maxZ");
        // this.setValue("speed");

        // this.setValue("checkCollisions");
        // this.setValue("applyGravity");
        // this.setVect3Value("ellipsoid");

        // this.setValue("useBouncingBehavior");

        // if(p.useBouncingBehavior && p.bouncingBehavior){
        //     if(p.bouncingBehavior.transitionDuration){
        //         camera.bouncingBehavior.transitionDuration = p.bouncingBehavior.transitionDuration;
        //     }

        //     if(p.bouncingBehavior.autoTransitionRange){
        //         camera.bouncingBehavior.autoTransitionRange = p.bouncingBehavior.autoTransitionRange  ;
        //     }
        // }

        // if(p.enableViewport && p.viewport){
        //     let v = p.viewport;
        //     camera.viewport = new BABYLON.Viewport(v[0], v[1], v[2], v[3]);
        // }

        if(preCamera){   
            preCamera.dispose();
        }

        if(scene.cameras.length>1){
            scene.cameras[0].dispose();
        }

        scene.cameras = [camera];

        scene.meshes.forEach(mesh=>{
            if(mesh.volumetricLight){
                createVolumetricLight(mesh, getMetaData(mesh, VolumetricLight), scene);
            }
        });

        if(p.animations!=null && p.animations.length>0){
            createAnimation(this.updateObject, p.animations, p.animationSpeed, p.animationLoop, babylon);
        }

        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }


    initialize.prototype.createLight = function(paramJson, babylon, mode){
        let scene=babylon.scene;
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene, camera);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;

        let preLight = scene.getLightByID(p.id), lightGizmo;
        if(preLight){
            lightGizmo = preLight.lightGizmo;
            preLight.dispose();
        }

        var light;
        if(p.type=="point"){
            light = new BABYLON.PointLight(p.id, new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]), scene);
            this.updateObject = light;

            // this.setVect3Value("direction", BABYLON.Vector3.Zero());
        }
        else if(p.type=="spot"){
            light = new BABYLON.SpotLight(p.id, new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]), new BABYLON.Vector3(p.direction[0], p.direction[1], p.direction[2]), p.angle*Math.PI, p.exponent, scene);
            this.updateObject = light;

        }
        else if(p.type=="hemispheric"){
            light = new BABYLON.HemisphericLight(p.id, new BABYLON.Vector3(p.direction[0], p.direction[1], p.direction[2]), scene);
            this.updateObject = light;

            this.setColor3Value("groundColor");
            // this.setVect3Value("position", BABYLON.Vector3.Zero());
        }
        else{
            let pos = new BABYLON.Vector3(p.position[0], p.position[1], p.position[2]);
            light = new BABYLON.DirectionalLight(p.id, pos.scale(-1), scene);
            this.updateObject = light;
            light.position = pos;
            light.direction = pos.scale(-1).normalize();
            // this.setVect3Value("position", BABYLON.Vector3.Zero());
        }

        this.setValue("intensity");
        // this.setValue("intensityMode");
        // this.setValue("range");
        this.setColor3Value("diffuse");
        this.setColor3Value("specular");

        changeLightExcludeAndInclude(p, scene, light);

        // if(p.enableExcludedMeshesIds){
        //     light.excludedMeshes.splice(0, light.excludedMeshes.length);
        //     light.includedOnlyMeshes.splice(0, light.includedOnlyMeshes.length);
        //     p.excludedMeshesIds.forEach(meshID=>{
        //         let mesh = scene.getMeshByID(meshID);
        //         if(mesh){
        //             light.excludedMeshes.push(mesh);
        //         }
        //     });
        // }
        // else{
        //     light.excludedMeshes.splice(0, light.excludedMeshes.length);
        //     light.includedOnlyMeshes.splice(0, light.includedOnlyMeshes.length);
        //     p.includedOnlyMeshesIds.forEach(meshID=>{
        //         let mesh = scene.getMeshByID(meshID);
        //         if(mesh){
        //             light.includedOnlyMeshes.push(mesh);
        //         }
        //     });
        // }

        if(p.enableLensFlare){
            createLensFlareSystem(p, scene, light);
            // var lensFlareSystem = new BABYLON.LensFlareSystem(scene.id + "lensFlareSystem", light, scene);
            // p.lensFlareSystem.forEach(fare=>{
            //     let c = rgbOrRgbaToArray(fare.lensFlareColor);
            //     let instanceFare = new BABYLON.LensFlare(fare.lensFlareSize, fare.lensFlarePosition,  new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255), fare.lensFlareImg, lensFlareSystem);
            //     lensFlareSystem.lensFlares.push(instanceFare);
            // });
            
        }

        if(p.enableShadow){
            createShadowGenerator(p, scene, light);
        }

        if(lightGizmo){
            lightGizmo.light = light;
            if(lightGizmo.light.position){
                lightGizmo.attachedMesh.position = lightGizmo.light.position.clone();
            }
    
            if(lightGizmo.light.direction){
                lightGizmo.attachedMesh.rotation = lightGizmo.light.direction.clone();
            }
        }

        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    function getAdvancedTextureByOption(p, babylon){
        let scene=babylon.scene
        let advancedTexture;
        if(p.guiMode==1){
            // createByMeshId 物体画布模式
            if(!p.createByMeshId){
                return;
            }
            let mesh = scene.getMeshByID(p.createByMeshId);
            if(mesh.advancedTexture){
                advancedTexture = mesh.advancedTexture;
            }
            else{
                advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(mesh);
                mesh.advancedTexture = advancedTexture;
            }
            
        }
        else {
            //linkedMesh 全屏模式
            if(scene.advancedTexture){
                advancedTexture = scene.advancedTexture
            }
            else{
                advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("msFullscreenUI");
                scene.advancedTexture = advancedTexture;
            }

            
        }

        return advancedTexture;
    }

    function getGui2DByOption(id, advancedTexture){
        // let advancedTexture = getAdvancedTextureByOption(p, babylon);
        if(!advancedTexture){
            return null;
        }
        let preGui, guiList = advancedTexture.getDescendants(false);
        for(let i=0;i<guiList.length;i++){
            let g = guiList[i];
            if(g.name==id){
                preGui = g;
                break;
            }
        }

        return preGui;
    }


    initialize.prototype.createGui2D = function(paramJson, babylon, mode){
        let scene=babylon.scene, engine = scene.getEngine();
        paramJson = JSON.parse(JSON.stringify(paramJson));
        // console.log(paramJson, scene, camera);

        if(paramJson==null || scene==null){
            return;
        }

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;
        
        let advancedTexture = getAdvancedTextureByOption(p, babylon);
        // if(p.guiMode==1){
        //     // createByMeshId 物体画布模式
        //     if(!p.createByMeshId){
        //         return;
        //     }
        //     let mesh = scene.getMeshByID(p.createByMeshId);
        //     if(mesh.advancedTexture){
        //         advancedTexture = mesh.advancedTexture;
        //     }
        //     else{
        //         advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(mesh);
        //     }
        //     mesh.advancedTexture = advancedTexture;
        // }
        // else {
        //     //linkedMesh 全屏模式
        //     if(scene.advancedTexture){
        //         advancedTexture = scene.advancedTexture
        //     }
        //     else{
        //         advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("msFullscreenUI");
        //     }

        //     scene.advancedTexture = advancedTexture;
        // }

        if(!advancedTexture){
            return null;
        }
        
        let preGui = getGui2DByOption(p.id, advancedTexture);
        // let preGui, guiList = advancedTexture.getDescendants(false);
        // for(let i=0;i<guiList.length;i++){
        //     let g = guiList[i];
        //     if(g.name==p.id){
        //         preGui = g;
        //         break;
        //     }
        // }

        if(preGui){
            preGui.parent.removeControl(preGui);
            preGui.dispose();
        }
        else{
            if(scene.advancedTexture){
                let guiList = scene.advancedTexture.getDescendants(false);
                for(let i=0;i<guiList.length;i++){
                    let g = guiList[i];
                    if(g.name==p.id){
                        preGui = g;
                        preGui.parent.removeControl(preGui);
                        preGui.dispose();
                        break;
                    }
                }
            }
        }

        let gui;
        if(p.type=="SimpleButton"){
            gui = BABYLON.GUI.Button.CreateSimpleButton(p.id, p.text);
        }
        else if(p.type=="ImageButton"){
            let url = "";
            if(p.imageSrc){
                url = convertSourceToUrl(p.imageSrc);
            }
            gui = BABYLON.GUI.Button.CreateImageButton(p.id, p.text, url);
        }
        else if(p.type=="ImageWithCenterTextButton"){
            let url = "";
            if(p.imageSrc){
                url = convertSourceToUrl(p.imageSrc);
            }
            gui = BABYLON.GUI.Button.CreateImageWithCenterTextButton(p.id, p.text,url);
        }
        else if(p.type=="ImageOnlyButton"){
            let url = "";
            if(p.imageSrc){
                url = convertSourceToUrl(p.imageSrc);
            }
            gui = BABYLON.GUI.Button.CreateImageOnlyButton(p.id, url);
        }

        this.updateObject = gui;

        gui.uniqueId = p.id;

        // this.setValue("autoClear");
        // this.setColor3Value("clearColor", null);
        // this.setColor3Value("ambientColor");
        // this.setVect3Value("gravity");
        
        if(p.linkOffsetUnit==0){
            gui.linkOffsetX = p.linkOffsetX + "px";
            gui.linkOffsetY = p.linkOffsetY + "px";
        }
        else if(p.linkOffsetUnit==1){
            gui.linkOffsetX = p.linkOffsetX;
            gui.linkOffsetY = p.linkOffsetY;
        }

        this.setValue("zIndex");
        this.setValue("isVisible");

        if(p.hoverCursor==1){
            p.hoverCursor = "pointer";
        }
        else{
            p.hoverCursor = "";
        }

        if(p.positionUnit==0){
            gui.left = p.left + "px";
            gui.top = p.top + "px";
        }
        else if(p.positionUnit==1){
            gui.left = p.left;
            gui.top = p.top;
        }


        if(p.sizeUnit==0){
            gui.width = p.width + "%";
            gui.height = p.height + "%";
        }
        else if(p.sizeUnit==1){
            gui.width = p.width + "px";
            gui.height = p.height + "px";
        }


        this.setValue("scaleX");
        this.setValue("scaleY");
        this.setValue("rotation");
        this.setValue("transformCenterY");
        this.setValue("transformCenterX");

        this.setValue("horizontalAlignment");
        this.setValue("verticalAlignment");

        if(p.paddingUnit==0){
            gui.paddingLeft = p.paddingLeft + "px";
            gui.paddingRight = p.paddingRight + "px";
            gui.paddingTop = p.paddingTop + "px";
            gui.paddingBottom = p.paddingBottom + "px";
        }
        else if(p.positionUnit==1){
            gui.paddingLeft = p.paddingLeft;
            gui.paddingRight = p.paddingRight;
            gui.paddingTop = p.paddingTop;
            gui.paddingBottom = p.paddingBottom;
        }

        this.setValue("adaptHeightToChildren");
        this.setValue("adaptWidthToChildren");


        this.setValue("thickness");
        this.setValue("cornerRadius");
        this.setValue("background");
        this.setValue("alpha");
        this.setValue("isHighlighted");
        this.setValue("disabledColor");

        this.setValue("shadowOffsetX");
        this.setValue("shadowOffsetY");
        this.setValue("shadowBlur");
        this.setValue("shadowColor");

        this.setValue("color");
        this.setValue("fontFamily");
        
        if(p.fontStyle){
            gui.fontStyle = "itaily";
        }
        else{
            gui.fontStyle = "";
        }

        if(p.fontWeight){
            gui.fontWeight = "bold";
        }
        else{
            gui.fontWeight = "";
        }

        if(p.fontSize){
            gui.fontSizeInPixels = p.fontSize;
        }
        else{
            gui.fontSizeInPixels = 18;
        }

        // this.setValue("fontSize");

        this.setValue("clipChildren");
        this.setValue("clipContent");

        if(p.parentId){
            
        }

        if(p.children && p.children.length>0){
            
        }

        //绑定click事件
        if(p.clickPro && p.clickPro.length>0){
            window.msFunctionGuiObjectCache = gui;
            let pm = "window.msFunctionCache = function(scene, engine, canvas){ "+ getDefaultFunction() +" try{   window.msFunctionGuiObjectCache.onPointerDownObservable.add(function() { "+ p.clickPro +"}); } catch(err){ console.error(err); } }";
            try{
                eval(pm);
                let pmAble = window.msFunctionCache;
                pmAble(scene, engine, engine.getRenderingCanvas());
            }
            catch(err){
                console.error(err);
            }
        }
        

        advancedTexture.addControl(this.updateObject);




        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }


    function getImageType(source){
        //"data:image/png;base64,iVBORw0K
        if(!source || source.length==0){
            return "image/png";
        }

        let x = source.split(":");
        if(x.length>2){
            x = source.split(";");
            if(x.length>0){
                return x[0];
            }
        }

        return "image/png";
    }
    function changeLightExcludeAndInclude(p, scene, light){
        if(p.enableExcludedMeshesIds && p.excludedMeshesIds){
            light.excludedMeshes.splice(0, light.excludedMeshes.length);
            light.includedOnlyMeshes.splice(0, light.includedOnlyMeshes.length);
            p.excludedMeshesIds.forEach(meshID=>{
                let mesh = scene.getMeshByID(meshID);
                if(mesh){
                    light.excludedMeshes.push(mesh);
                }
            });
        }
        else if(p.includedOnlyMeshesIds){
            light.excludedMeshes.splice(0, light.excludedMeshes.length);
            light.includedOnlyMeshes.splice(0, light.includedOnlyMeshes.length);
            p.includedOnlyMeshesIds.forEach(meshID=>{
                let mesh = scene.getMeshByID(meshID);
                if(mesh){
                    light.includedOnlyMeshes.push(mesh);
                }
            });
        }
    }

    function createShadowGenerator(paramJson, scene, light){
        let p = paramJson, shadow = light.getShadowGenerator();
        if(shadow){
            shadow.dispose();
        }

        if(!p.enableShadow){
            return;
        }
        let shadowGenerator = new BABYLON.ShadowGenerator(p.shadowQuality, light);

        p.shadowRenderList.forEach(meshId=>{
            let mesh = scene.getMeshByID(meshId);
            if(mesh){
                shadowGenerator.addShadowCaster(mesh);
            }
        });

        shadowGenerator.usePoissonSampling = p.usePoissonSampling;
        shadowGenerator.useExponentialShadowMap = p.useExponentialShadowMap;
        shadowGenerator.useBlurExponentialShadowMap = p.useBlurExponentialShadowMap;
        if(p.blurScale){
            shadowGenerator.blurScale = p.blurScale;
        }

        if(p.blurBoxOffset){
            shadowGenerator.blurBoxOffset = p.blurBoxOffset;
        }

        if(p.useKernelBlur){
            shadowGenerator.useKernelBlur = p.useKernelBlur;
        }

        if(p.blurKernel){
            shadowGenerator.blurKernel = p.blurKernel;
        }
        
        shadowGenerator.usePercentageCloserFiltering = p.usePercentageCloserFiltering;
        if(p.filteringQuality){
            shadowGenerator.filteringQuality = p.filteringQuality;
        }
    }

    function createLensFlareSystem(paramJson, scene, target){
        let p = paramJson, oldLensId = target.id + "_lensFlareSystem";
        if(scene.lensFlareSystems){
            if(scene.lensFlareSystems){
                let oldLens = scene.getLensFlareSystemByID(oldLensId);
                if(oldLens!=null){
                    oldLens.dispose();
                }
            }
        }

        if(!p.enableLensFlare){
            return;
        }

        let lensFlareSystem = new BABYLON.LensFlareSystem(target.id + "_lensFlareSystem", target, scene);
        p.lensFlareSystem.forEach((fare)=>{
            let c = rgbOrRgbaToArray(fare.lensFlareColor);
            let instanceFare = new BABYLON.LensFlare(fare.lensFlareSize, fare.lensFlarePosition,  new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255), fare.lensFlareImg, lensFlareSystem);
            lensFlareSystem.lensFlares.push(instanceFare);
        });

        target.lensFlareSystem = lensFlareSystem;
    }

    function setMetaData(o, key, value){
        if(o.metadata==null){
            o.metadata = {};
        }
        o.metadata[key] = value;
    }

    function getMetaData(o, key){
        if(o.metadata!=null){
            return o.metadata[key];
        }
        
        return null;
    }

    function createGlow(paramJson, scene){
        let p = paramJson;
        let option = {};
        if(p.mainTextureFixedSize){
            option.mainTextureFixedSize = p.mainTextureFixedSize;
        }

        if(p.blurKernelSize){
            option.blurKernelSize = p.blurKernelSize;
        }

        if(p.mainTextureSamples){
            option.mainTextureSamples = p.mainTextureSamples?4:0;
        }

        if(p.mainTextureRatio){
            option.mainTextureRatio = p.mainTextureRatio;
        }

        if(scene.effectLayers){
            let glOld = scene.getGlowLayerByName(scene.id+"_glow");
            if(glOld){
                glOld.dispose();
            }
        }

        
        let gl = new BABYLON.GlowLayer(scene.id+"_glow", scene, option);

        if(p.glowIntensity){
            gl.intensity = p.glowIntensity;
        }

        scene.meshes.forEach(mesh=>{
            if(mesh.metadata && mesh.metadata.enableGlow){
                gl.addIncludedOnlyMesh(mesh);
            }
        });

        return gl;
    }



    initialize.prototype.createSpriteManager = function(paramJson, babylon){
        paramJson = JSON.parse(JSON.stringify(paramJson));
        let scene = babylon.scene;
        if(paramJson == null || scene == null){
            return;
        }

        var preParam = this.p, preUpdateObject = this.updateObject;

        let p = paramJson;
        this.p = p;

        // let object;
        // if(scene.spriteManagers){
        //     for(let i=0;i<scene.spriteManagers.length;i++){
        //         let sm = scene.spriteManagers[i];
        //         if(sm.name==id){
        //             object = sm;
        //             break;
        //         }
        //     }

        //     if(object && object.sprites){
        //         object.sprites.forEach((s)=>{
        //             s.dispose();
        //         });
        //     }
        // }

        this.deleteObject(p.mainType, p.id, babylon);


        let spriteManager = new BABYLON.SpriteManager(p.id, p.spriteImage, 100, { width: p.cellWidth, height: p.cellHeight }, scene);
        this.updateObject = spriteManager;

        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }

    function createMeshObject(p, babylon, mode, vertexData){
        let scene = babylon.scene, font = babylon.font;
        let mesh;
        if(mode==null){
            mode = "b";
        }
        let iniOption = {};
        if(p.type=="Box"){
            if(!p.accurate){
                iniOption.size = p.size;
            }
            else{
                iniOption.height = p.height;
                iniOption.width = p.width;
                iniOption.depth = p.depth;
            }


            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFace){
                iniOption.faceUV = p.faceUV;
                iniOption.faceColors = p.faceColors;
            }

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateBox(p.id, iniOption, scene);
        }
        else if(p.type=="TiledBox"){
            if(!p.accurate){
                iniOption.size = p.size;
            }
            else{
                iniOption.height = p.height;
                iniOption.width = p.width;
                iniOption.depth = p.depth;
            }

            iniOption.tileSize = p.tileSize;
            iniOption.tileHeight = p.tileHeight;
            iniOption.tileWidth = p.tileWidth;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFace){
                iniOption.faceUV = p.faceUV;
                iniOption.faceColors = p.faceColors;
            }

            mesh = BABYLON.MeshBuilder.CreateTiledBox(p.id, iniOption, scene);
        }
        else if(p.type=="Sphere"){
            iniOption.segments = p.segments;

            if(!p.accurate){
                iniOption.diameter = p.diameter;
            }
            else{
                iniOption.diameterX = p.diameterX;
                iniOption.diameterY = p.diameterY;
                iniOption.diameterZ = p.diameterZ;
            }

            iniOption.arc = p.arc;
            iniOption.slice = p.slice;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateSphere(p.id, iniOption, scene);
        }
        else if(p.type=="Cylinder"){

            iniOption.height = p.height;

            if(!p.accurate){
                iniOption.diameter = p.diameter;
            }
            else{
                iniOption.diameterTop = p.diameterTop;
                iniOption.diameterBottom = p.diameterBottom;
            }

            iniOption.tessellation = p.tessellation;
            iniOption.subdivisions = p.subdivisions;

            iniOption.arc = p.arc;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFace){
                iniOption.faceUV = p.faceUV;
                iniOption.faceColors = p.faceColors;
            }

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateCylinder(p.id, iniOption, scene);
        }
        else if(p.type=="Plane"){

            if(!p.accurate){
                iniOption.size = p.size;
            }
            else{
                iniOption.width = p.width;
                iniOption.height = p.height;
            }

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreatePlane(p.id, iniOption, scene);
        }
        else if(p.type=="TiledPlane"){
            if(!p.accurate){
                iniOption.size = p.size;
            }
            else{
                iniOption.width = p.width;
                iniOption.height = p.height;
            }

            if(!p.accurateTile){
                iniOption.tileSize = p.tileSize;
            }
            else{
                iniOption.tileHeight = p.tileHeight;
                iniOption.tileWidth = p.tileWidth;
            }

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateTiledPlane(p.id, iniOption, scene);
        }
        else if(p.type=="Disc"){

            iniOption.radius = p.radius;
            iniOption.tessellation = p.tessellation;

            iniOption.arc = p.arc;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            mesh = BABYLON.MeshBuilder.CreateDisc(p.id, iniOption, scene);
        }
        else if(p.type=="Torus"){

            iniOption.diameter = p.diameter;
            iniOption.thickness = p.thickness;
            iniOption.tessellation = p.tessellation;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateTorus(p.id, iniOption, scene);
        }
        else if(p.type=="TorusKnot"){
            iniOption.radius = p.radius;
            iniOption.tube = p.tube;
            iniOption.radialSegments = p.radialSegments;
            iniOption.tubularSegments = p.tubularSegments;
            iniOption.p = p.p;
            iniOption.q = p.q;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateTorusKnot(p.id, iniOption, scene);
        }
        else if(p.type=="Ground"){
            iniOption.height = p.height;
            iniOption.width = p.width;
            iniOption.subdivisions = p.subdivisions;

            mesh = BABYLON.MeshBuilder.CreateGround(p.id, iniOption, scene);
        }
        else if(p.type=="TiledGround"){
            iniOption.xmin = p.xmin;
            iniOption.zmin = p.zmin;
            iniOption.xmax = p.xmax;
            iniOption.zmax = p.zmax;

            iniOption.subdivisions = p.subdivisions;
            iniOption.precision = p.precision;

            mesh = BABYLON.MeshBuilder.CreateTiledGround(p.id, iniOption, scene);
        }
        else if(p.type=="HeightMap"){
            iniOption.width = p.width;
            iniOption.height = p.height;
            iniOption.subdivisions = p.subdivisions;
            iniOption.minHeight = p.minHeight;
            iniOption.maxHeigth = p.maxHeigth;

            iniOption.sideOrientation = p.sideOrientation;
            // iniOption.sideOrientation = BABYLON.Mesh[p.sideOrientation];

            let url = blankImageBase64;
            if(p.heightMapPicture!=null && p.heightMapPicture.length>0){
                url = p.heightMapPicture;
            }
            mesh = BABYLON.MeshBuilder.CreateGroundFromHeightMap(p.id, url, iniOption, scene);
        }
        else if(p.type=="3DText"){
            let content = "默认文字";
            if(p.content!=null && p.content.length>0){
                content = p.content;
            }

            let shapes;

            if(p.shapes!=null && mode=="p"){
                shapes = p.shapes;
            }
            else{
                shapes = Font.Compile(font, content, p.fontSize, p.Interpolation, p.decimation);
            }

            mesh = Font.BuildMesh(shapes, { depth:p.depth, sideOrientation:p.sideOrientation }, scene);
            mesh.name = p.id;
            mesh.id = p.id;
            mesh._msShapes = shapes;
        }
        else if(p.type=="UploadMesh"){
            mesh = new BABYLON.Mesh(p.id, scene);

            if(vertexData!=null){
                var geometry = new BABYLON.Geometry(vertexData.id, scene);
                BABYLON.VertexData.ImportVertexData(vertexData, geometry);
                geometry.applyToMesh(mesh);
            }

        }
        else if(p.type=="Lines"){
            
            if(p.points && p.points.length>0){
                let points = [], colors=[], isHaveColor=true;
                p.points.forEach((item)=>{
                    let point = item.point, color = item.color;
                    if(color!=null){
                        let c = rgbOrRgbaToArray(color);
                        colors.push(new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]));
                    }
                    else{
                        isHaveColor = false;
                    }
                    
                    points.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });

                iniOption.points = points;
                if(isHaveColor){
                    iniOption.colors = colors;
                }
            }
            // iniOption.points = p.points;
            iniOption.useVertexAlpha = p.useVertexAlpha;

            mesh = BABYLON.MeshBuilder.CreateLines(p.id, iniOption, scene);
        }
        else if(p.type=="DashedLines"){
            if(p.points && p.points.length>0){
                let points = [];
                p.points.forEach((item)=>{
                    let point = item.point;
                    points.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.points = points;
            }

            iniOption.dashSize = p.dashSize;
            iniOption.gapSize = p.gapSize;
            iniOption.dashNb = p.dashNb;

            mesh = BABYLON.MeshBuilder.CreateDashedLines(p.id, iniOption, scene);
        }
        else if(p.type=="LineSystem"){
            if(p.lines && p.lines.length>0){
                let lines = [], colors=[], isHaveColor=true;
                p.lines.forEach((line)=>{
                    let oneLine = [], oneLineColor=[], isOneLineHaveColor=true;
                    line.forEach((item)=>{
                        let point = item.point, color = item.color;
                        if(color!=null){
                            let c = rgbOrRgbaToArray(color);
                            oneLineColor.push(new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]));
                        }
                        else{
                            isHaveColor = false;
                            isOneLineHaveColor = false;
                        }
                        oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                    });
                    
                    lines.push(oneLine);

                    if(isOneLineHaveColor){
                        colors.push(oneLineColor);
                    }
                    else{
                        colors.push(undefined);
                    }
                    
                });

                iniOption.lines = lines;
                if(isHaveColor){
                    iniOption.colors = colors;
                }
            }

            iniOption.useVertexAlpha = p.useVertexAlpha;
            mesh = BABYLON.MeshBuilder.CreateLineSystem(p.id, iniOption, scene);
        }
        else if(p.type=="Ribbon"){
            if(p.pathArray && p.pathArray.length>0){
                let pathArray = [];
                p.pathArray.forEach((line)=>{
                    let oneLine = [];
                    line.forEach((item)=>{
                        let point = item.point;
                        oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                    });
                    
                    pathArray.push(oneLine);                    
                });

                iniOption.pathArray = pathArray;
            }

            iniOption.closeArray = p.closeArray;
            iniOption.closePath = p.closePath;
            iniOption.invertUV = p.invertUV;

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateRibbon(p.id, iniOption, scene);
        }
        else if(p.type=="Tube"){
            if(p.path && p.path.length>0){
                let path = [];
                p.path.forEach((item)=>{
                    let point = item.point;
                    path.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.path = path;
            }
            else{
                iniOption.path = [new BABYLON.Vector3(0,0,0), new BABYLON.Vector3(1,1,1)];
            }

            if(p.enableRadiusFunction){
                let pm = "window.msFunctionCache = function(i, distance){ "+ p.radiusFunction +" }";
                try{
                    eval(pm);
                    iniOption.radiusFunction = window.msFunctionCache;
                 }
                 catch(err){
                     console.error(err);
                 }
            }
            else{
                iniOption.radius = p.radius;
            }

            iniOption.tessellation = p.tessellation;
            iniOption.arc = p.arc;
            iniOption.cap = p.cap;
            iniOption.invertUV = p.invertUV;

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateTube(p.id, iniOption, scene);
        }
        else if(p.type=="ExtrudedShapes"){
            if(p.shape && p.shape.length>0){
                let shape = [];
                p.shape.forEach((item)=>{
                    let point = item.point;
                    shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.shape = shape;
            }

            if(p.path && p.path.length>0){
                let path = [];
                p.path.forEach((item)=>{
                    let point = item.point;
                    path.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.path = path;
            }



            iniOption.cap = p.cap;
            iniOption.ribbonCloseArray = p.closeArray;
            iniOption.ribbonClosePath = p.closePath;
            iniOption.invertUV = p.invertUV;

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            if(p.enableCustom){
                try{
                    eval("window.msFunctionCache = function(i, distance){ "+ p.scaleFunction +" }");
                    iniOption.scaleFunction = window.msFunctionCache;
                    eval("window.msFunctionCache = function(i, distance){ "+ p.rotationFunction +" }");
                    iniOption.rotationFunction = window.msFunctionCache;
                }
                catch(err){
                    console.error(err);
                }

                mesh = BABYLON.MeshBuilder.ExtrudeShapeCustom(p.id, iniOption, scene);
            }
            else{
                iniOption.scale = p.extrudedShapesScale;
                iniOption.rotation = p.extrudedShapesRotation;

                mesh = BABYLON.MeshBuilder.ExtrudeShape(p.id, iniOption, scene);
            }

            
        }
        else if(p.type=="Lathe"){
            if(p.shape && p.shape.length>0){
                let shape = [];
                p.shape.forEach((item)=>{
                    let point = item.point;
                    shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.shape = shape;
            }

            iniOption.radius = p.radius;
            iniOption.tessellation = p.tessellation;
            iniOption.arc = p.arc;
            iniOption.cap = p.cap;
            iniOption.invertUV = p.invertUV;

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreateLathe(p.id, iniOption, scene);
        }
        else if(p.type=="NonRegularPolygon"){
            if(p.shape && p.shape.length>0){
                let shape = [];
                p.shape.forEach((item)=>{
                    let point = item.point;
                    shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.shape = shape;
            }

            if(p.holes && p.holes.length>0){
                let holes = [];
                p.holes.forEach((line)=>{
                    let oneLine = [];
                    line.forEach((item)=>{
                        let point = item.point;
                        oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                    });
                    
                    holes.push(oneLine);                    
                });

                iniOption.holes = holes;
            }

            if(p.enableFrontBack){
                iniOption.frontUVs = p.frontUVs;
                iniOption.backUVs = p.backUVs;
            }

            mesh = BABYLON.MeshBuilder.CreatePolygon(p.id, iniOption, scene);
        }
        else if(p.type=="ExtrudedNonRegularPolygon"){
            if(p.shape && p.shape.length>0){
                let shape = [];
                p.shape.forEach((item)=>{
                    let point = item.point;
                    shape.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                });
                iniOption.shape = shape;
            }

            if(p.holes && p.holes.length>0){
                let holes = [];
                p.holes.forEach((line)=>{
                    let oneLine = [];
                    line.forEach((item)=>{
                        let point = item.point;
                        oneLine.push(new BABYLON.Vector3(point[0],point[1],point[2]));
                    });
                    
                    holes.push(oneLine);                    
                });

                iniOption.holes = holes;
            }

            iniOption.depth = p.depth;

            if(p.enableFace){
                iniOption.faceUV = p.faceUV;
                iniOption.faceColors = p.faceColors;
            }

            mesh = BABYLON.MeshBuilder.ExtrudePolygon(p.id, iniOption, scene);
        }
        else if(p.type=="programMesh"){
            let engine = scene.getEngine();
            let pm = "window.msFunctionCache = function(scene, engine, canvas){ try{ "+ p.pro +"} catch(err){ console.error(err); } }";
            eval(pm);
            let pmAble = window.msFunctionCache;
            pmAble(scene, engine, engine.getRenderingCanvas());
            mesh = window.msProgramMeshCache;
            mesh.id = p.id;
            mesh.name = p.id;
        }

        return mesh;
    }

    function createhighlight(mesh, p, scene){
        if(mesh.highlight){
            mesh.highlight.dispose();
        }

        if(!p.enableHighlight){
            return;
        }

        let hl = new BABYLON.HighlightLayer(p.id + "_hightlight", scene);
        let c = rgbOrRgbaToArray(p.highlightColor);
        hl.addMesh(mesh, new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255), p.ishighlightEmissive);
        hl.blurHorizontalSize = p.blurHorizontalSize;
        hl.blurVerticalSize = p.blurVerticalSize;
        hl.outerGlow = p.outerGlow;
        hl.innerGlow = p.innerGlow;

        mesh.highlight = hl;
    } 

    function createVolumetricLight(mesh, p, scene){
        let camera = scene.activeCamera;
        if(mesh.volumetricLight){
            mesh.volumetricLight.dispose(camera);
        }

        if(!p.enableVolumetricLight){
            return;
        }

        setMetaData(mesh, "VolumetricLight", {
            id: p.id + '_vls',
            volumetricLightRatio:p.volumetricLightRatio,
            volumetricLightSamplesNum:p.volumetricLightSamplesNum, 
            volumetricLightSamplingMode:p.volumetricLightSamplingMode, 
            volumetricLightUseDiffuseColor:p.volumetricLightUseDiffuseColor
        });

        let vls = new BABYLON.VolumetricLightScatteringPostProcess(p.id + '_vls', p.volumetricLightRatio, camera, mesh, p.volumetricLightSamplesNum, p.volumetricLightSamplingMode, scene.getEngine(), p.volumetricLightUseDiffuseColor);
        mesh.volumetricLight = vls;
    }

    function createRigidPhysic(mesh, p, scene){
        if(scene.isPhysicsEnabled){
            scene.enablePhysics(null, new BABYLON.AmmoJSPlugin(true, Ammo));
        }

        if(mesh.physicsImpostor){
            mesh.physicsImpostor.dispose();
        }

        if(!p.enableRigidPhysic){
            return;
        }

        let option = {};
        option.mass = p.rigidMass;
        option.friction = p.rigidFriction;
        option.restitution = p.rigidRestitution;
        option.ignoreParent = p.ignoreParent;

        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor[p.rigidImpostor], option, scene);

        if(p.enableVelocity){
            mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(p.velocity[0],p.velocity[1],p.velocity[2]));
        }

        if(p.enableAngularVelocity){
            mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(p.AngularVelocity[0],p.AngularVelocity[1],p.AngularVelocity[2]));
        }

        if(p.enableImpulse){
            mesh.physicsImpostor.applyImpulse(new BABYLON.Vector3(p.impulseDirection[0],p.impulseDirection[1],p.impulseDirection[2]),  new BABYLON.Vector3(p.impulsePosition[0],p.impulsePosition[1],p.impulsePosition[2]));
        }
    }

    function createSoftPhysic(mesh, p, scene){
        if(scene.isPhysicsEnabled){
            scene.enablePhysics(null, new BABYLON.AmmoJSPlugin(true, Ammo));
        }

        if(mesh.physicsImpostor){
            mesh.physicsImpostor.dispose();
        }

        if(!p.enableSoftPhysic){
            return;
        }

        let option = {};
        option.mass = p.softMass;
        option.friction = p.softFriction;
        option.restitution = p.softRestitution;
        option.velocityIterations = p.velocityIterations;
        option.positionIterations = p.positionIterations;
        option.stiffness = p.stiffness;
        option.margin = p.margin;
        option.damping = p.damping;
        
        if(p.enableAnchorFixedPoints && p.softImpostor=="ClothImpostor"){
            if(p.anchorFixedPoints.length>0){
                let i = 0;
                p.anchorFixedPoints.forEach(item=>{
                    i+= item;
                });
    
                option.fixedPoints = i;
            }
        }

        if(p.enableHookFixedPoints && p.softImpostor=="RopeImpostor"){
            option.fixedPoints = p.hookFixedPoints;
        }


        if(p.softImpostor=="SoftbodyImpostor"){
            option.pressure = p.pressure;
            mesh.forceSharedVertices();
            if(mesh.getTotalVertices()*Math.pow(p.softIncreaseVertices+1, 2)<=10000){
                mesh.increaseVertices(p.softIncreaseVertices);
            }
        }

        mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor[p.softImpostor], option, scene);



        if(!p.enableHookFixedPoints && p.softImpostor=="RopeImpostor"){
            if(p.hooks.length>0){
                p.hooks.forEach(hk=>{
                    let meshID = hk.hookMesheID;
                    let linkMesh = scene.getMeshByID(meshID);
                    mesh.physicsImpostor.addHook(linkMesh.physicsImpostor, hk.hookFraction, hk.hookInfluence, hk.hookNoCollisionBetweenLinkedBodies);
                });
            }
        }
        else if(!p.enableAnchorFixedPoints && p.softImpostor=="clothSoftBody"){
            if(p.anchors.length>0){
                p.anchors.forEach(hk=>{
                    let meshID = hk.anchormesheID;
                    let linkMesh = scene.getMeshByID(meshID);
                    mesh.physicsImpostor.addAnchor(linkMesh.physicsImpostor, hk.anchorFractionWidth, hk.anchorFractionHeight, hk.anchorInfluence, hk.anchorNoCollisionBetweenLinkedBodies);
                });
            }
        }

        // console.log(mesh.physicsImpostor);
    }


    initialize.prototype.hideFilterEffect = function(babylon){
        var _this = this;
        var pp = this.postProcess;
        var scene = babylon.scene;
        var camera = scene.activeCamera;

        var filter = _this.filter;

        if(pp==null){
            return;
        }

        // scene.postProcessesEnabled = false;
        if(pp.pipeline!=null){
            // pp.pipeline.removeCamera(camera);
            if(filter.antialiasing){
                if(filter.antialiasing.samples){
                    pp.pipeline.samples = 1;
                }
                else if(filter.antialiasing.fxaaEnabled){
                    pp.pipeline.fxaaEnabled = false;
                }
            }

            if(filter.sharpening){
                pp.pipeline.sharpenEnabled = false;
            }

            if(filter.depthOfField){
                pp.pipeline.depthOfFieldEnabled = false;
            }

            if(filter.Bloom){
                pp.pipeline.bloomEnabled = false;
            }

            if(filter.chromaticAberration){
                pp.pipeline.chromaticAberrationEnabled = false;
            }

            if(filter.grain){
                pp.pipeline.grainEnabled = false;
            }
            
            pp.pipeline.dispose();
            // if(filter.ImageProcessingCE!=null || filter.ImageProcessingCurves!=null || filter.ImageProcessingVignette!=null || filter.ImageProcessingTexture!=null){
            //     pp.pipeline.imageProcessingEnabled = false;
            // }

        }

        if(pp.postProcess!=null && pp.postProcess.length>0){
            pp.postProcess.forEach((item)=>{
                item.dispose();
                // camera.detachPostProcess(item);
            });
        }

        if(pp.ImageProcessing!=null){
            if(filter.ImageProcessingTexture!=null){
                pp.ImageProcessing.colorGradingTexture.dispose();
                pp.ImageProcessing.colorGradingTexture = null;
                pp.ImageProcessing.colorGradingEnabled = false;

                if(filter.ImageProcessingTexture.animated){
                    _this.ImageProcessingTextureSpeed = null;
                }
            }

            pp.ImageProcessing.dispose();
            
            // pp.ImageProcessing.dispose();
        }
    }

    initialize.prototype.changeFilterEffect = function(filter, babylon, filterCallback){
        var _this = this;
        // if(_this.loading){
        //     return;
        // }
        
        // if(i==null){
        //     i = 0;
        // }

        _this.hideFilterEffect(babylon);

        // var curp = _this.runParam[i];
        // var pp = this.postProcess;
        var scene = babylon.scene;
        var camera = scene.activeCamera;

        var isHdr = false;
        if(scene.environmentTexture && scene.environmentTexture.getClassName()=="HDRCubeTexture"){
            isHdr = true;
        }

         _this.createFilterEffect(filter, babylon, isHdr, filterCallback);

    }

    initialize.prototype.createFilterEffect = function(filter, babylon, isHdr, filterCallback){
        var _this = this;
        var ret = {};
        var scene = babylon.scene, camera = scene.activeCamera;
        this.ImageProcessingTextureSpeed = null;

        if(filter==null){
            return;
        }

        if(filter.ImageProcessingTexture!=null){
            var v = filter.ImageProcessingTexture;
            var colorGrading = new BABYLON.ColorGradingTexture(v.colorGradingTexture, scene);
            BABYLON.BaseTexture.WhenAllReady([colorGrading], ()=>{
                exec(colorGrading);
                if(typeof(filterCallback)=="function"){
                    filterCallback();
                }  
            });
        }
        else{
            exec();
            if(typeof(filterCallback)=="function"){
                filterCallback();
            }
        }



        function exec(colorGrading){

            if(filter.antialiasing!=null || filter.sharpening!=null || filter.depthOfField!=null || filter.Bloom!=null || filter.chromaticAberration!=null || filter.grain!=null){
                var pipeline = new BABYLON.DefaultRenderingPipeline("default", isHdr, scene, [camera]);

                ret.pipeline = pipeline;

                //抗锯齿
                if(filter.antialiasing!=null){
                    var v = filter.antialiasing.value;
                    if(v == "samples"){
                        pipeline.samples = 4;
                        pipeline.fxaaEnabled = false;
                    }
                    else if(v == "fxaaEnabled"){
                        pipeline.fxaaEnabled = true;
                        pipeline.samples = 1;
                    }
                }

                //锐化
                if(filter.sharpening!=null){
                    pipeline.sharpenEnabled = true;
                    pipeline.sharpen.colorAmount = filter.sharpening.colorAmount;
                    pipeline.sharpen.edgeAmount = filter.sharpening.edgeAmount;
                }

                //景深
                if(filter.depthOfField!=null){
                    pipeline.depthOfFieldEnabled = true;
                    var level = filter.depthOfField.depthOfFieldBlurLevel;
                    if(level==0){
                        level = BABYLON.DepthOfFieldEffectBlurLevel.Low;
                    }
                    else if(level==1){
                        level = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
                    }
                    else if(level==2){
                        level = BABYLON.DepthOfFieldEffectBlurLevel.High;
                    }

                    pipeline.depthOfFieldBlurLevel = filter.depthOfField.depthOfFieldBlurLevel;

                    pipeline.depthOfField.focusDistance = filter.depthOfField.focusDistance;
                    pipeline.depthOfField.focalLength = filter.depthOfField.focalLength;
                    pipeline.depthOfField.fStop = filter.depthOfField.fStop;
                }


                //全屏泛光
                if(filter.Bloom!=null){
                    pipeline.bloomEnabled = true;

                    pipeline.bloomThreshold = filter.Bloom.bloomThreshold;
                    pipeline.bloomWeight = filter.Bloom.bloomWeight;
                    pipeline.bloomKernel = filter.Bloom.bloomKernel;
                    pipeline.bloomScale = filter.Bloom.bloomScale;
                }

                //色差
                if(filter.chromaticAberration!=null){
                    pipeline.chromaticAberrationEnabled = true;
                    pipeline.chromaticAberration.aberrationAmount = filter.chromaticAberration.aberrationAmount;
                    pipeline.chromaticAberration.radialIntensity = filter.chromaticAberration.radialIntensity;

                    var value = pipeline.chromaticAberration.direction;
                    if(value == 0){
                        pipeline.chromaticAberration.direction.x = 0
                        pipeline.chromaticAberration.direction.y = 0
                    }else{
                        pipeline.chromaticAberration.direction.x = Math.sin(value)
                        pipeline.chromaticAberration.direction.y = Math.cos(value)
                    }

                }

                //噪声
                if(filter.grain!=null){
                    pipeline.grainEnabled = true;
                    pipeline.grain.intensity = filter.grain.intensity;
                    pipeline.grain.animated = filter.grain.animated;
                }




            }

            //以下为PostProcess模式
            if(filter.blackAndWhite!=null || filter.highlights!=null || filter.convolution!=null || filter.blur!=null || filter.tonemap!=null){

                ret.postProcess = [];

                //黑白
                if(filter.blackAndWhite!=null){
                    if(filter.blackAndWhite.state){
                        var postProcess = new BABYLON.BlackAndWhitePostProcess("blackAndWhite", 1.0, camera);

                        ret.postProcess.push(postProcess);
                    }
                }

                //高亮
                if(filter.highlights!=null){
                    if(filter.highlights.state){
                        var postProcess = new BABYLON.HighlightsPostProcess("highlights", 1.0, camera);

                        ret.postProcess.push(postProcess);
                    }
                }

                //卷积
                if(filter.convolution!=null){
                    var kenel = filter.convolution.kenel;

                    if(kenel=="EdgeDetect0Kernel"){
                        kenel = BABYLON.ConvolutionPostProcess.EdgeDetect0Kernel;
                    }
                    else if(kenel=="EdgeDetect1Kernel"){
                        kenel = BABYLON.ConvolutionPostProcess.EdgeDetect1Kernel;
                    }
                    else if(kenel=="EdgeDetect2Kernel"){
                        kenel = BABYLON.ConvolutionPostProcess.EdgeDetect2Kernel;
                    }
                    else if(kenel=="EmbossKernel"){
                        kenel = BABYLON.ConvolutionPostProcess.EmbossKernel;
                    }
                    else if(kenel=="GaussianKernel"){
                        kenel = BABYLON.ConvolutionPostProcess.GaussianKernel;
                    }
                    else if(kenel=="SharpenKernel"){
                        kenel = BABYLON.ConvolutionPostProcess.SharpenKernel;
                    }

                    if(kenel!="off"){
                        var postProcess = new BABYLON.ConvolutionPostProcess("Sepia", kenel, 1.0, camera);

                        ret.postProcess.push(postProcess);
                    }
                }

                if(filter.blur!=null){
                    var postProcess0 = new BABYLON.BlurPostProcess("HorizontalBlur", new BABYLON.Vector2(1, 0), filter.blur.blurKernelVertical, 1.0, camera);
                    var postProcess1 = new BABYLON.BlurPostProcess("VerticalBlur", new BABYLON.Vector2(0, 1), filter.blur.blurKernelHorizen, 1.0, camera);

                    ret.postProcess.push(postProcess0);
                    ret.postProcess.push(postProcess1);
                }

                if(filter.tonemap!=null){
                    var operator = filter.tonemap.TonemappingOperator;
                    var postProcess = new BABYLON.TonemapPostProcess("tonemap", BABYLON.TonemappingOperator[operator], filter.tonemap.exposureAdjustment, camera);

                    ret.postProcess.push(postProcess);
                }

            }
            else if(filter.ImageProcessingCE!=null || filter.ImageProcessingCurves!=null || filter.ImageProcessingVignette!=null || filter.ImageProcessingTexture!=null){

                // pipeline.imageProcessingEnabled = true;
                // var postProcess = pipeline.imageProcessing;

                // postProcess.alphaMode = true;
                var postProcess = new BABYLON.ImageProcessingPostProcess("ImageProcessing", 1.0, camera);

                ret.ImageProcessing = postProcess;

                if(filter.ImageProcessingCE!=null){
                    if(filter.ImageProcessingCE.contrast!=null){
                        postProcess.contrast = filter.ImageProcessingCE.contrast;
                    }

                    if(filter.ImageProcessingCE.exposure!=null){
                        postProcess.exposure = filter.ImageProcessingCE.exposure;
                    }
                    
                }

                if(filter.ImageProcessingCurves!=null){
                    var curve = new BABYLON.ColorCurves();
                    var c = filter.ImageProcessingCurves;
                    curve.globalDensity = c.globalDensity;
                    curve.globalExposure = c.globalExposure;
                    curve.globalHue = c.globalHue;
                    curve.globalSaturation = c.globalSaturation;

                    curve.highlightsDensity = c.highlightsDensity;
                    curve.highlightsExposure = c.highlightsExposure;
                    curve.highlightsHue = c.highlightsHue;
                    curve.highlightsSaturation = c.highlightsSaturation;

                    curve.midtonesDensity = c.midtonesDensity;
                    curve.midtonesExposure = c.midtonesExposure;
                    curve.midtonesHue = c.midtonesHue;
                    curve.midtonesSaturation = c.midtonesSaturation;

                    curve.shadowsDensity = c.shadowsDensity;
                    curve.shadowsExposure = c.shadowsExposure;
                    curve.shadowsHue = c.shadowsHue;
                    curve.shadowsSaturation = c.shadowsSaturation;

                    postProcess.colorCurvesEnabled = true;
                    postProcess.colorCurves = curve;
                }

                if(filter.ImageProcessingVignette!=null){
                    var v = filter.ImageProcessingVignette;

                    postProcess.vignetteEnabled = true;

                    postProcess.vignetteStretch = v.vignetteStretch;
                    postProcess.vignetteCentreX = v.vignetteCentreX;
                    postProcess.vignetteCentreY = v.vignetteCentreY;
                    postProcess.vignetteWeight = v.vignetteWeight;

                    if(v.vignetteColor!=null && v.vignetteColor.length>0){
                        var va = rgbOrRgbaToArray(v.vignetteColor);
                        for(var i=0;i<va.length-1;i++){
                            va[i] = Math.round(va[i]*100/255)/100;
                        }
                        postProcess.vignetteColor = new BABYLON.Color4(va[0],va[1],va[2],va[3]);
                    }
                    
                    var bm = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
                    if(v.vignetteBlendMode=="OPAQUE"){
                        bm = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_OPAQUE;
                    }
                    postProcess.vignetteBlendMode = bm;
                }

                if(filter.ImageProcessingTexture!=null){
                    postProcess.colorGradingEnabled = true;
                    scene.imageProcessingConfiguration.colorGradingEnabled = true;
                    var v = filter.ImageProcessingTexture;
                    // var colorGrading = new BABYLON.ColorGradingTexture(v.colorGradingTexture, scene);
                    postProcess.colorGradingTexture = colorGrading;
                    colorGrading.level = v.level;

                    this.ImageProcessingTexture = colorGrading;

                    if(v.animated){
                        _this.ImageProcessingTextureLevel = v.level;
                        _this.ImageProcessingTextureSpeed = v.speed*0.0015;
                        _this.ImageProcessingTextureT = 0;
                    }
                }
                    
            }

            _this.postProcess = ret;
            _this.filter = filter;
        }
    }


    initialize.prototype.booleanCalculationView = function(mesheIds, type, babylon){
        let scene = babylon.scene;
        let a = scene.getMeshByID(mesheIds[0]), b = scene.getMeshByID(mesheIds[1]);

        if(a==null || b==null){
            return null;
        }

        var aCSG = BABYLON.CSG.FromMesh(a);
        var bCSG = BABYLON.CSG.FromMesh(b);

        var subCSG = bCSG[type](aCSG);
        var newMesh = subCSG.toMesh("newCsg", null, scene);

        a.isVisible = false;
        b.isVisible = false;

        return newMesh;

    }


    initialize.prototype.mergeMeshHandle = function(meshIds, babylon){
        let scene = babylon.scene;
        // let a = scene.getMeshByID(mesheIds[0]), b = scene.getMeshByID(mesheIds[1]);

        // if(a==null || b==null){
        //     return null;
        // }
        
        if(meshIds==null || meshIds.length<=1){
            return null;
        }

        let mergeList = [];
        meshIds.forEach(item=>{
            let mesh = scene.getMeshByID(item.key);
            if(mesh && mesh.geometry){
                mergeList.push(mesh);
            }
        });

        let mesh = BABYLON.Mesh.MergeMeshes(mergeList, false, true, undefined, false, true);

        let multiMaterial = mesh.material;

        let geometry = mesh.geometry;

        // var aCSG = BABYLON.CSG.FromMesh(a);
        // var bCSG = BABYLON.CSG.FromMesh(b);

        // var subCSG = bCSG[type](aCSG);
        // var newMesh = subCSG.toMesh("newCsg", null, scene);

        // a.isVisible = false;
        // b.isVisible = false;

        mergeList.forEach(m=>{
            m.isVisible = false;
        });

        return {
            mesh:mesh,
            multiMaterial:multiMaterial,
            geometry:geometry,
        };

    }


    initialize.prototype.generateScene = function(ms3df, babylon, mode, callback){
        let scene = babylon.scene, camera = scene.activeCamera;
        if(ms3df==null || scene==null){
            return;
        }

        if(mode==null){
            mode = "b";
        }

        // let ms3dfKeyAddList = {
        //     cameras:1,
        //     lights:1,
        //     textures:1,
        //     materials:1,
        //     meshes:1,
        //     spriteManagers:1,
        //     particleSystems:1,
        //     programs:1,
            
        //     "geometries": 1,
        //     "transformNodes": 1,
        //     "skeletons": 1, //骨骼动画
        //     "animationGroups": 1,//动画组
        //     "multiMaterials": 1, //多材质
        // }

        // let ms3df = JSON.parse(JSON.stringify(ms3df));
        let meshToMaterial = {}, meshToParent={}, nodeToParent={},materialToTexture = {}, meshToSkeleton = {}, lightToParent={}, particleSystemToEmitter={}, animationGroupToMesh = {};
        let sceneParam = null;

        ms3df.meshes && ms3df.meshes.forEach((meshData)=>{
            let vd = null;
            if(meshData.type=="UploadMesh"){
                vd = getVertexDataByID(meshData.geometryId, ms3df.geometries.vertexData)
            }
            this.createObject(meshData, babylon, mode, vd);

            if(meshData.materialId){
                meshToMaterial[meshData.id] = meshData.materialId;
            }

            if(meshData.parentId){
                meshToParent[meshData.id] = meshData.parentId;
            }   

            if(meshData.skeletonId){
                meshToSkeleton[meshData.id] = meshData.skeletonId;
            }
            
        });

        ms3df.transformNodes && ms3df.transformNodes.forEach((node)=>{
            let nodeInstance = BABYLON.TransformNode.Parse(node, scene);
            nodeInstance.id = node.id;

            if(node.parentId){
                nodeToParent[node.id] = node.parentId;
            }
        });

        ms3df.instances && ms3df.instances.forEach((ins)=>{
            this.addInstance(ins, babylon, mode);
        });

        Object.keys(ms3df).forEach((key)=>{
            if(key=="meshes"){
                //初始化物体
                
            }
            else if(key=="transformNodes"){
                //初始化transformNodes

            }
            else if(key=="instances"){
                //初始化instances

            }
            else if(key=="materials"){
                //初始化材质
                ms3df.materials && ms3df.materials.forEach((materialData)=>{
                    this.createMaterial(materialData, scene);
                    materialToTexture[materialData.id] = {};
                    Object.keys(materialData).forEach(key=>{
                        if(key in textureMap){
                            materialToTexture[materialData.id][key] = materialData[key];
                        }
                    });
                });
            }
            else if(key=="textures"){
                //初始化纹理
                ms3df.textures && ms3df.textures.forEach((textureData)=>{
                    if(textureData.source==null || textureData.source.length==0){
                        textureData.source= blankImageBase64;
                    }
                    this.createTexture(textureData, scene);
                });
            }
            else if(key=="skeletons"){
                //初始化骨骼
                ms3df.skeletons && ms3df.skeletons.forEach((ske)=>{
                    let skeInstance = BABYLON.Skeleton.Parse(ske, scene);
                    skeInstance.id = ske.id;
                });
            }
            else if(key=="animationGroups"){
                //初始化动画
                ms3df.animationGroups && ms3df.animationGroups.forEach((ani)=>{
                    let aniInstance = BABYLON.AnimationGroup.Parse(ani, scene);
                    aniInstance.uniqueId = ani.id;

                    if(ani.targetedAnimations){
                        animationGroupToMesh[ani.id] = {};
                        ani.targetedAnimations.forEach((tar, index)=>{
                            if(tar.targetId){
                                animationGroupToMesh[ani.id][index] = tar.targetId;
                            }
                        });
                    }
                }); 
            }
            else if(key=="lights"){
                //初始化灯光
                ms3df.lights && ms3df.lights.forEach((light)=>{
                    this.createObject(light, babylon, mode);
                    if(typeof(callback)=="function"){
                        setTimeout(()=>{
                            callback(light);
                        }, 0);
                    }
                    if(light.parentId){
                        lightToParent[light.id] = light.parentId;
                    }
                });
            }
            else if(key=="spriteManagers"){
                //初始化精灵
                ms3df.spriteManagers && ms3df.spriteManagers.forEach((sp)=>{
                    this.createObject(sp, babylon, mode);
                });
            }
            else if(key=="particleSystems"){
                //初始化粒子
                ms3df.particleSystems && ms3df.particleSystems.forEach((pts)=>{
                    this.createObject(pts, babylon, mode);
                    if(typeof(callback)=="function"){
                        setTimeout(()=>{
                            callback(pts);
                        }, 0);
                    }
                    if(typeof(pts.emitter)=="string"){
                        particleSystemToEmitter[pts.id] = pts.emitter;
                    }
                });
            }
            else if(key=="multiMaterials"){
                //初始化多材质--还没实现
                ms3df.multiMaterials && ms3df.multiMaterials.forEach((sp)=>{
                    
                });
            }
            else if(key=="cameras"){
                if(ms3df.cameras && ms3df.cameras[0]!=null){
                    this.createCamera(ms3df.cameras[0], babylon, mode);
                }
            }
            else {
                if(sceneParam==null){
                    sceneParam = {};
                }
                sceneParam[key] = ms3df[key];
            }
        });

        ms3df.multiMaterials && ms3df.multiMaterials.forEach((mul)=>{
            this.createMultiMaterial(mul, babylon, mode);
        });

        if(sceneParam){
            let iniScene = false;
            for(let key in sceneParam){
                if(key != "environmentTexture" && key != "actionManagers" && key!="animations" && key != "geometries" && key != "scene"){
                    this.createScene(sceneParam, babylon, mode);
                    iniScene = true;
                    break;
                }
            }
            

            if(!iniScene && sceneParam.environmentTexture){
                let texture = scene.getTextureByUniqueID(sceneParam.environmentTexture);
                scene.environmentTexture = texture;
            }
        }


        

        //关联灯光及其父物体
        Object.keys(lightToParent).forEach(lightId=>{
            let parentId = lightToParent[lightId];
            let light = scene.getLightByID(lightId), parent = scene.getMeshByID(parentId);
            if(parent==null){
                parent = scene.getTransformNodeByID(parentId);
            }
            light.parent = parent;
        });

        //关联粒子发射器到物体或相机
        Object.keys(particleSystemToEmitter).forEach(psId=>{
            let emitId = particleSystemToEmitter[psId];
            let particle = scene.getParticleSystemByID(psId), emitter = scene.getMeshByID(emitId);
            if(emitter==null){
                emitter = scene.getTransformNodeByID(emitId);
                if(emitter==null){
                    emitter = scene.getCameraByID(emitId);
                }
            }
            particle.emitter = emitter;
        });

        //关联物体和材质
        Object.keys(meshToMaterial).forEach(meshId=>{
            let materialId = meshToMaterial[meshId];
            let mesh = scene.getMeshByID(meshId), material = scene.getMaterialByID(materialId);
            if(material==null){
                // for(let i=0;i<scene.multiMaterials.length;i++){
                //     let mulmaterial = scene.multiMaterials[i];
                //     if(mulmaterial.id==materialId){
                //         material = mulmaterial;
                //         break;
                //     }
                // }
                material = getMultiMaterialById(materialId, babylon);
            }
            mesh.material = material;
        });
        //关联物体及其父物体
        Object.keys(meshToParent).forEach(meshId=>{
            let parentId = meshToParent[meshId];
            let mesh = scene.getMeshByID(meshId), parent = scene.getMeshByID(parentId);
            if(parent==null){
                parent = scene.getTransformNodeByID(parentId);
            }
            mesh.parent = parent;
        });

        //关联transformNodes及其父物体
        Object.keys(nodeToParent).forEach(nodeId=>{
            let parentId = nodeToParent[nodeId];
            let node = scene.getTransformNodeByID(nodeId), parent = scene.getMeshByID(parentId);
            if(parent==null){
                parent = scene.getTransformNodeByID(parentId);
            }
            node.parent = parent;
        });

        //连接材质和纹理
        Object.keys(materialToTexture).forEach(materialId=>{
            let material = scene.getMaterialByID(materialId);
            let textureAttributeMap = materialToTexture[materialId];
            Object.keys(textureAttributeMap).forEach(textureAttribute=>{
                let textureId = textureAttributeMap[textureAttribute];
                let texture = scene.getTextureByUniqueID(textureId);
                material[textureAttribute] = texture;
            });
        });
        //连接物体和骨骼
        Object.keys(meshToSkeleton).forEach(meshId=>{
            let skeletonId = meshToSkeleton[meshId];
            let mesh = scene.getMeshByID(meshId), skeleton = scene.getSkeletonById(skeletonId);
            mesh.skeleton = skeleton;
        });

        //连接动画到物体及transformNodes
        ms3df.gui2Ds && ms3df.gui2Ds.forEach((p)=>{
            this.createGui2D(p, babylon);
        });

        //连接动画到物体及transformNodes
        scene.animationGroups && scene.animationGroups.forEach((animationGroup)=>{
            if(animationGroup.uniqueId in animationGroupToMesh){
                let cur = animationGroupToMesh[animationGroup.uniqueId];
                animationGroup.targetedAnimations.forEach((ani, index)=>{
                    let objectId = cur[index.toString()];
                    let object = scene.getMeshByID(objectId);
                    if(object==null){
                        object = scene.getTransformNodeByID(objectId);
                    }
                    ani.target = object;
                    object.animations.push(ani.animation);
                });
            }
        });

        if(ms3df.skeletons && ms3df.skeletons.length>0){
            ms3df.skeletons.forEach((item)=>{
                let o = scene.getSkeletonById(item.id);
                if(item.animationAutoPlay){
                    let animationAble = scene.beginAnimation(o, item.animationFrom, item.animationTo, item.animationIsLoop, item.animationSpeedRatio);
                    o.animationAble = animationAble;
                }
            });
        }


        //执行programs
        if(ms3df.programs){
            ms3df.programs.forEach((pro)=>{
                this.createProgram(pro, babylon, mode);
            });
        }

    }


    function getVertexDataByID(id, data){
        let vd = null;
        for(let i=0;i<data.length;i++){
            if(data[i].id == id){
                vd = data[i];
                break;
            }
        }
        return vd;
    }
 
    initialize.prototype.deleteObject = function(mainType, id, babylon, p) {
        if(mainType==null || id==null){
            return;
        }

        let scene = babylon.scene;

        let object = null;
	    if(mainType=="mesh"){
            object= scene.getMeshByID(id);
            if(scene.lensFlareSystems){
                let oldLens = scene.getLensFlareSystemByID(id + "_lensFlareSystem");
                if(oldLens!=null){
                    oldLens.dispose();
                }
            }

            if(object.highlight){
                object.highlight.dispose();
            }

            if(scene.effectLayers){
                let gl = scene.getGlowLayerByName(scene.id+"_glow");
                if(gl!=null){
                    gl.removeIncludedOnlyMesh(object);
                }
            }

            if(object.volumetricLight){
                object.volumetricLight.dispose(scene.activeCamera);
            }

            if(object.physicsImpostor){
                object.physicsImpostor.dispose();
            }

        }
        else if(mainType=="light"){
            object= scene.getLightByID(id);
            if(object.lightGizmo){
                if(object.lightGizmo.attachedMesh){
                    object.lightGizmo.attachedMesh.dispose();
                }
                object.lightGizmo.dispose();
            }

            if(scene.lensFlareSystems){
                let oldLens = scene.getLensFlareSystemByID(id + "_lensFlareSystem");
                if(oldLens!=null){
                    oldLens.dispose();
                }
            }

            let shadow = object.getShadowGenerator();
            if(shadow){
                shadow.dispose();
            }


        }
        else if(mainType=="texture"){
            object= scene.getTextureByUniqueID(id);
        }
        else if(mainType=="material"){
            object= scene.getMaterialByID(id);
        }
        else if(mainType=="spriteManager"){
            if(scene.spriteManagers){
                for(let i=0;i<scene.spriteManagers.length;i++){
                    let sm = scene.spriteManagers[i];
                    if(sm.name==id){
                        object = sm;
                        break;
                    }
                }

                if(object && object.sprites){
                    object.sprites.forEach((s)=>{
                        s.dispose();
                    });
                }
            }
        }
        else if(mainType=="particle"){
            object= scene.getParticleSystemByID(id);
            if(object){
                let auxMesh = scene.getMeshByID(id);
                if(auxMesh){
                    auxMesh.dispose();
                }
            }

        }
        else if(mainType=="transformNode"){
            object= scene.getTransformNodeByID(id);
        }
        else if(mainType=="instance"){
            object= scene.getMeshByID(id);
        } 
        else if(mainType=="multiMaterial"){
            object= scene.getMultiMaterialById(p.id, babylon);
        }
        else if(mainType=="gui2D"){
            let advancedTexture = getAdvancedTextureByOption(p, babylon);
            object = getGui2DByOption(p.id, advancedTexture);
            object.parent.removeControl(object);
        }

        if(object){
            if(object.animationables){
                object.animationables.stop();
            }
            object.dispose();
        }

    }


    var updateTypeList = {
        "mesh":{
            "highlight":{
                "highlightColor":1,
                "ishighlightEmissive":1,
                "blurHorizontalSize":1,
                "blurVerticalSize":1,
                "outerGlow":1,
                "innerGlow":1,
                "enableHighlight":1,
            },
            "volumetricLight":{
                "volumetricLightRatio":1,
                "volumetricLightSamplesNum":1,
                "volumetricLightSamplingMode":1,
                "volumetricLightUseDiffuseColor":1,
                "enableVolumetricLight":1,
            },
            "rigidPhysic":{
                "enableRigidPhysic":1,
                "rigidImpostor":1,
                "rigidMass":1,
                "rigidFriction":1,
                "rigidRestitution":1,
                "ignoreParent":1,
                "enableVelocity":1,
                "velocity":1,
                "enableAngularVelocity":1,
                "AngularVelocity":1,
                "enableImpulse":1,
                "impulseDirection":1,
                "impulsePosition":1,
            },
            "softPhysic":{
                "margin":1,
                "damping":1,

                "anchorFractionWidth":1,
                "anchorFractionHeight":1,
                "anchorInfluence":1,
                "anchorNoCollisionBetweenLinkedBodies":1,

                "hookFraction":1,
                "hookInfluence":1,
                "hookNoCollisionBetweenLinkedBodies":1,

                "enableSoftPhysic":1,
                "softImpostor":1,
                "softIncreaseVertices":1,
                "softMass":1,
                "softFriction":1,
                "softRestitution":1,
                "velocityIterations":1,
                "positionIterations":1,
                "stiffness":1,
                "pressure":1,
                "enableAnchorFixedPoints":1,
                "anchorFixedPoints":1,
                "anchors":1,
                "enableHookFixedPoints":1,
                "hookFixedPoints":1,
                "hooks":1,
            },
            "edgesRendering":{
                "enableEdgesRendering":1,
                "edgesWidth":1,
                "edgesColor":1,
            },
            "glow":{
                "enableGlow":1,
            },
        },

    } 

    function updateTextureToMaterial(id, scene){
        let materialsList = [];
        if(scene.materials){
            scene.materials.forEach((material)=>{
                if(material){
                    Object.keys(textureMap).forEach((key)=>{
                        // if(key in textureMap){
                        if(material[key] && material[key].uniqueId==id){
                            materialsList.push({
                                material:material,
                                key:key
                            });
                        }
                        // }
                    });
                }
            });
        }

        if(scene.environmentTexture && scene.environmentTexture.uniqueId==id){
            materialsList.push({
                material:scene,
                key:"environmentTexture"
            });
        }

        return materialsList;
    }

    initialize.prototype.updateBabylonObject = function(updateKey, paramJson, babylon, updateObjectCycle, parentClass) {
        let scene=babylon.scene, camera=scene.activeCamera, gizmo=babylon.gizmo;
        let p = paramJson, forceList = getOptionForce(p.mainType, p.type), isForce = false;
        let list = updateTypeList[p.mainType], listType = null;
        for(let key in list){
            if(updateKey in list[key]){
                listType = key;
                break;
            }
        }

        let linkList = [];
        if(updateKey in forceList || updateKey=="sideOrientation" || listType=="rigidPhysic" || listType=="softPhysic" ){
            isForce = true;

            scene.meshes && scene.meshes.forEach(m=>{
                if(m.parent && m.parent.id == p.id){
                    linkList.push({
                        type:"mesh",
                        "update":"parent",
                        "id":m.id
                    });
                }
            });

            scene.lights && scene.lights.forEach(light=>{
                light.excludedMeshes && light.excludedMeshes.forEach(m=>{
                    if(m.id == p.id){
                        linkList.push({
                            type:"light",
                            "update":"excludedMeshes",
                            "id":light.id
                        });
                    }
                }); 

                light.includedOnlyMeshes && light.includedOnlyMeshes.forEach(m=>{
                    if(m.id == p.id){
                        linkList.push({
                            type:"light",
                            "update":"includedOnlyMeshes",
                            "id":light.id
                        });
                    }
                });

                let shadow = light.getShadowGenerator();
                if(shadow){
                    let list = shadowGenerator.getShadowMap().renderList;
                    list && list.forEach(m=>{
                        if(m.id==p.id){
                            linkList.push({
                                type:"light",
                                "update":"shadow",
                                "id":light.id
                            });
                        }
                    });
                }
            });

            scene.textures && scene.textures.forEach(t=>{
                t.renderList && t.renderList.forEach(m=>{
                    if(m.id==p.id){
                        linkList.push({
                            type:"texture",
                            "update":"renderList",
                            "id":t.uniqueId
                        });
                    }
                });
            });
        }

        let preParam = this.p, preUpdateObject = this.updateObject, updateState = false;

        this.p = p;

        if(updateObjectCycle !=null){
            this.updateObject = updateObjectCycle;
        }

        if(p.mainType=="mesh"){
            let updateMesh = updateObjectCycle?updateObjectCycle:scene.getMeshByID(p.id);
            this.updateObject = updateMesh;
        }
        else if(p.mainType=="material"){
            let updateMaterial = updateObjectCycle?updateObjectCycle:scene.getMaterialByID(p.id);
            this.updateObject = updateMaterial;
        }
        else if(p.mainType=="texture"){
            let updateTexture = updateObjectCycle?updateObjectCycle:scene.getTextureByUniqueID(p.id);
            this.updateObject = updateTexture;
        }
        else if(p.mainType=="spriteManager"){
            let spriteManagers = scene.spriteManagers;
            let updateSpriteManager;
            
            for(let i = 0; i < spriteManagers.length; i++){
                if(spriteManagers[i].name == p.id){
                    updateSpriteManager = spriteManagers[i];
                }
            }
            
            this.updateObject = updateSpriteManager;
        }
        else if(p.mainType=="scene"){
            let updateTexture = updateObjectCycle?updateObjectCycle:scene;
            this.updateObject = updateTexture;
        }
        else if(p.mainType=="light"){
            let updateLight = updateObjectCycle?updateObjectCycle:scene.getLightByID(p.id);
            this.updateObject = updateLight;
        }
        else if(p.mainType=="camera"){
            let updateCamera = this.createCamera(p, babylon);
            this.updateObject = updateCamera;
            updateState = true;
        }
        else if(p.mainType=="particle"){
            if(p.type=="ParticleSystem"){
                var updateParticle = this.createParticle(p, babylon);
                this.updateObject = updateParticle;
                updateState = true;
            }
        }
        else if(p.mainType == "instance"){
            let updateMesh = updateObjectCycle?updateObjectCycle:scene.getMeshByID(p.id);
            this.updateObject = updateMesh;
        }
        else if(p.mainType == "transformNode"){
            let updateMesh = updateObjectCycle?updateObjectCycle:scene.getTransformNodeByID(p.id);
            this.updateObject = updateMesh;
        }
        else if(p.mainType == "gui2D"){
            let updateGui2D = this.createGui2D(p, babylon);
            this.updateObject = updateGui2D;
            updateState = true;
        }
        else if(p.mainType=="multiMaterial"){
            let meshesList = [];
            scene.meshes.forEach(mesh=>{
                if(mesh.material && mesh.material.id==p.id){
                    meshesList.push(mesh);
                }
            });

            let updateMul = this.createMultiMaterial(p, babylon);
            this.updateObject = updateMul;

            if(meshesList.length>0){
                meshesList.forEach(mesh=>{
                    mesh.material = updateMul;
                });
            }
            
            updateState = true;
        }

        if(updateKey instanceof Array){
            let lastKey = updateKey[updateKey.length-1], param = paramJson, babylonObj=this.updateObject;
            for(let i=0;i<updateKey.length-1;i++){
                let key = updateKey[i];
                param = param[key];
                babylonObj = babylonObj[key];
            }

            this.updateBabylonObject(lastKey, param, babylon, babylonObj, updateKey[updateKey.length-2]);
        }
        else if(updateKey=="animations" || updateKey=="animationSpeed" || updateKey=="animationLoop"){
            createAnimation(this.updateObject, p.animations, p.animationSpeed, p.animationLoop, babylon);
            updateState = true;
        }
        else{
            if(p.mainType=="mesh"){
                let updateMesh = this.updateObject;

                if(isForce){
                    let newMesh = this.createObject(paramJson, babylon);
                    // newMesh.material = updateMesh.material;
                    if(updateMesh.physicsImpostor){
                        updateMesh.physicsImpostor.dispose();
                    }

                    if(updateMesh.highlight){
                        updateMesh.highlight.dispose();
                    }

                    if(updateMesh.volumetricLight){
                        updateMesh.volumetricLight.dispose(camera);
                    }

                    updateMesh.dispose();

                    this.updateObject = newMesh;

                    linkList && linkList.forEach(item=>{
                        let type = item.type,update = item.update, id = item.id;
                        if(type=="mesh"){
                            if(update=="parent"){
                                let m = scene.getMeshByID(id);
                                m.parent = newMesh;
                            }
                        }
                        else if(type=="light"){
                            let light = scene.getLightByID(id);
                            if(type=="excludedMeshes"){
                                light.excludedMeshes.push(newMesh);
                            }
                            else if(type=="includedOnlyMeshes"){
                                light.includedOnlyMeshes.push(newMesh);
                            }
                            else if(type=="shadow"){
                                let shadow = light.getShadowGenerator();
                                shadow.addShadowCaster(newMesh);
                            }
                        }
                        else if(type=="texture"){
                            let texture = scene.getTextureByUniqueID(id);
                            if(update=="renderList"){
                                texture.renderList.push(newMesh);   
                            }
                        }
                    });

                    updateState = true;
                }
                else{
                    // updateMesh[updateKey] = p[updateKey];

                    if(listType=="highlight"){
                        createhighlight(updateMesh, p, scene);
                        updateState = true;
                    }
                    else if(listType=="volumetricLight"){
                        createVolumetricLight(updateMesh, p, scene);
                        updateState = true;
                    }
                    else if(listType=="rigidPhysic"){
                        createRigidPhysic(updateMesh, p, scene);
                        updateState = true;
                    }
                    else if(listType=="softPhysic"){
                        createSoftPhysic(updateMesh, p, scene);
                        updateState = true;
                    }
                    else if(listType=="edgesRendering"){
                        if(updateKey=="enableEdgesRendering"){
                            if(p[updateKey]){
                                updateMesh.enableEdgesRendering();
                                this.setValue("edgesWidth", 4);
                                this.setColor4Value("edgesColor", new BABYLON.Color4(0,0,0,1));
                            }
                            else{
                                updateMesh.disableEdgesRendering();
                            }

                            updateState = true;
                        }
                        else if(updateKey=="edgesWidth"){
                            this.setValue("edgesWidth", 4);

                            updateState = true;
                        }
                        else if(updateKey=="edgesColor"){
                            this.setColor4Value("edgesColor", new BABYLON.Color4(0,0,0,1));

                            updateState = true;
                        }
                    }
                    else if(listType=="glow"){
                        if(scene.effectLayers){
                            let gl = scene.getGlowLayerByName(scene.id+"_glow");
                            if(gl!=null){
                                if(p.enableGlow){
                                    gl.addIncludedOnlyMesh(updateMesh);
                                }
                                else{
                                    gl.removeIncludedOnlyMesh(updateMesh);
                                }
                                setMetaData(updateMesh, "enableGlow", p.enableGlow);

                                updateState = true;
                            }
                        }
                    }
                    else if(updateKey=="enableLensFlare" || updateKey=="lensFlareSystem"){
                        if(updateKey=="enableLensFlare"){
                            if(p[updateKey]){
                                createLensFlareSystem(p, scene, updateMesh);
                            }
                            else{
                                if(scene.lensFlareSystems){
                                    let oldLensId = updateMesh.id + "_lensFlareSystem";
                                    if(scene.lensFlareSystems){
                                        let oldLens = scene.getLensFlareSystemByID(oldLensId);
                                        if(oldLens!=null){
                                            oldLens.dispose();
                                        }
                                    }

                                }
                            }
                        }
                        else{
                            createLensFlareSystem(p, scene, updateMesh);
                        }
                        
                        updateState = true;
                    }
                    else if(updateKey in {"lookAtMode":1, "lookAtPosition":1,"lookAtMesh":1,"lookAtLight":1,"lookAtCamera":1}){
                        createLookAt(updateMesh, p, babylon);
                        updateState = true;
                    }
                    else if(updateKey=="instances"){
                        addInstance(updateMesh, p, babylon);
                        updateState = true;
                    }
                    else if(updateKey=="subMeshes"){
                        createSubMeshes(updateMesh, p.subMeshes);
                        updateState = true;
                    }


                }

                if(updateKey=="materialId"){
                    let mid = p[updateKey], material = scene.getMaterialByID(mid);
                    updateMesh.material = material;

                    updateState = true;
                }
                else if(updateKey=="parentId"){
                    let mid = p[updateKey], pmesh = scene.getMeshByID(mid);
                    updateMesh.parent = pmesh;

                    updateState = true;
                }
                
                // setTimeout(() => {
                //     gizmo.attachToMesh(null);
                //     gizmo.attachToMesh(updateMesh);
                // }, 50);
                
            }
            else if(p.mainType=="material"){
                let updateMaterial = this.updateObject;

                if(p.type=="StandardMaterial"){

                }

                var fresnelParaList = {
                    "diffuseFresnelParameters":"enableDiffuseFresnelParameters", 
                    "emissiveFresnelParameters":"enableEmissiveFresnelParameters", 
                    "reflectionFresnelParameters":"enableReflectionFresnelParameters", 
                    "refractionFresnelParameters":"enableRefractionFresnelParameters", 
                    "opacityFresnelParameters":"enableOpacityFresnelParameters",

                    "enableDiffuseFresnelParameters":"diffuseFresnelParameters",
                    "enableEmissiveFresnelParameters":"emissiveFresnelParameters",
                    "enableReflectionFresnelParameters":"reflectionFresnelParameters",
                    "enableRefractionFresnelParameters":"refractionFresnelParameters",
                    "enableOpacityFresnelParameters":"opacityFresnelParameters",
                }

                // var textureList = {
                //     "diffuseTexture":1,
                //     "specularTexture":1,
                //     "emissiveTexture":1,
                //     "ambientTexture":1,
                //     "reflectionTexture":1,
                //     "refractionTexture":1,
                //     "opacityTexture":1,
                //     "bumpTexture":1,
                //     "lightmapTexture":1,
                //     "metallicTexture":1,
                //     "reflectionTexture":1,
                //     "refractionTexture":1,
                //     "albedoTexture":1,
                //     "bumpTexture":1,
                //     "ambientTexture":1,
                //     "reflectivityTexture":1,
                //     "distortionTexture":1,
                //     "heightTexture":1,
                //     "mixTexture":1,
                //     "bumpTexture1":1,
                //     "bumpTexture2":1,
                //     "bumpTexture3":1,
                //     "diffuseTextureX":1,
                //     "diffuseTextureY":1,
                //     "diffuseTextureZ":1,
                //     "normalTextureX":1,
                //     "normalTextureY":1,
                //     "normalTextureZ":1,
                //     "diffuseTexture1":1,
                //     "diffuseTexture2":1,
                //     "diffuseTexture3":1,
                //     "diffuseTexture4":1,
                //     "diffuseTexture5":1,
                //     "diffuseTexture6":1,
                //     "diffuseTexture7":1,
                //     "diffuseTexture8":1,
                //     "mixTexture1":1,
                //     "mixTexture2":1,
                //     "diffuseTexture11":1,
                //     "diffuseTexture12":1,
                // }

                if(updateKey in fresnelParaList){
                    let updateValue = p[updateKey];

                    if(updateKey.indexOf("enable")>-1){
                        let fpkey = fresnelParaList[updateKey];
                        let updateValueFp = p[fpkey];
                        if(updateValue){
                            if(!updateMaterial[fpkey]){
                                updateMaterial[fpkey] = new BABYLON.FresnelParameters();
                            }

                            updateMaterial[fpkey].bias = updateValueFp.bias;
                            updateMaterial[fpkey].power = updateValueFp.power;
                            var cl = rgbOrRgbaToArray(updateValueFp.leftColor);
                            updateMaterial[fpkey].leftColor = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
                            var cr = rgbOrRgbaToArray(updateValueFp.rightColor);
                            updateMaterial[fpkey].rightColor = new BABYLON.Color3(cr[0]/255,cr[1]/255,cr[2]/255);
                            updateMaterial[fpkey].isEnabled = true;
                        }
                        else{
                            if(updateMaterial[fpkey]){
                                updateMaterial[fpkey].isEnabled = false;
                            }
                        }
                    }
                    else{
                        if(updateMaterial[updateKey]){
                            updateMaterial[updateKey].bias = updateValue.bias;
                            updateMaterial[updateKey].power = updateValue.power;
                            var cl = rgbOrRgbaToArray(updateValue.leftColor);
                            updateMaterial[updateKey].leftColor = new BABYLON.Color3(cl[0]/255,cl[1]/255,cl[2]/255);
                            var cr = rgbOrRgbaToArray(updateValue.rightColor);
                            updateMaterial[updateKey].rightColor = new BABYLON.Color3(cr[0]/255,cr[1]/255,cr[2]/255);
                        }
                    }

                    updateState = true;
                }
                else if(updateKey in materialTextureDatas[p.type]){
                    let updateTexture = scene.getTextureByUniqueID(p[updateKey]);
                    updateMaterial[updateKey] = updateTexture;

                    updateState = true;
                }
                else if(updateKey=="enableClearCoat"){
                    updateMaterial["clearCoat"].isEnabled = p[updateKey];
                    updateState = true;
                }
                else if(updateKey=="enableAnisotropy"){
                    updateMaterial["anisotropy"].isEnabled = p[updateKey];
                    updateState = true;
                }
                else if(updateKey=="enableSheen"){
                    updateMaterial["sheen"].isEnabled = p[updateKey];
                    updateState = true;
                }
                else if(updateKey=="enableSubSurface"){
                    
                    updateState = true;
                }
                else if(updateKey=="renderList"){
                    // updateMaterial.renderList.splice(0, updateMaterial.renderList.length);
                    // p[updateKey].forEach((meshId)=>{
                    //     updateMaterial.renderList.push(scene.getMeshByID(meshId));
                    // });

                    let newMaterial = this.createMaterial(p ,scene);
                    let texture = updateMaterial.bumpTexture;
                    if(texture!=null){
                        newMaterial.bumpTexture = texture.clone();
                        newMaterial.bumpTexture.name = texture.name;
                        newMaterial.bumpTexture.uniqueId = texture.uniqueId;
                        texture.dispose();
                    }
                    scene.meshes.forEach((mesh)=>{
                        if(mesh.material==updateMaterial){
                            mesh.material = newMaterial;
                        }
                    });

                    updateMaterial.dispose();

                    updateState = true;
                    // updateMaterial.renderList = arr;
                }

            }
            else if(p.mainType=="texture"){
                let updateTexture = this.updateObject;

                if(p.type=="StarfieldProceduralTexture"){
                    if(updateKey=="StarfieldBrightness"){
                        this.setValue("brightness",null, "StarfieldBrightness");
                        updateState = true;
                    }
                    else if(updateKey=="Starfieldtime"){
                        this.setValue("time",null, "Starfieldtime");
                        updateState = true;
                    }
                    
                }
                else if(p.type=="FireProceduralTexture"){
                    if(updateKey in {c1:1, c2:1, c3:1, c4:1, c5:1, c6:1}){

                        var colors = [p.c1, p.c2, p.c3, p.c4, p.c5, p.c6];
                        colors.forEach((pcolor,index)=>{
                            if(pcolor!=null){
                                let c = rgbOrRgbaToArray(pcolor);
                                updateTexture.fireColors[index].r = c[0]/255;
                                updateTexture.fireColors[index].g = c[1]/255;
                                updateTexture.fireColors[index].b = c[2]/255;
                            }    
                        });
                        updateState = true;
                    }
                }
                else if(p.type=="GrassProceduralTexture"){
                    if(updateKey in {herb1Color:1, herb2Color:1, herb3Color:1}){
                        
                        var colors = [p.herb1Color, p.herb2Color, p.herb3Color];
                        colors.forEach((pcolor,index)=>{
                            if(pcolor!=null){
                                let c = rgbOrRgbaToArray(pcolor);
                                updateTexture.grassColors[index].r = c[0]/255;
                                updateTexture.grassColors[index].g = c[1]/255;
                                updateTexture.grassColors[index].b = c[2]/255;
                            }    
                        });
                        updateState = true;
                    }
                }
                else if(updateKey=="source" || updateKey=="textureSize" || updateKey=="enableSixImage" || updateKey=="sourceArray" || updateKey=="videoSrc"){

                    // if(p.type=="CubeTexture"){                    
                    //     updateTexture.updateURL(convertSourceToUrl(p[updateKey]), ".dds");
                    // }
                    // else{
                    //     updateTexture.updateURL(p[updateKey]);
                    // }

                    let materialsList =  updateTextureToMaterial(p.id, scene);
                    if(updateTexture){
                        updateTexture.dispose();
                    }
                    let newTexture = this.createTexture(p, scene);

                    materialsList.forEach(item=>{
                        item.material[item.key] = newTexture;
                    });
                    
                    updateState = true;
                }
                else if(updateKey=="renderList"){
                    updateTexture.renderList.splice(0, updateTexture.renderList.length);
                    p[updateKey].forEach((meshId)=>{
                        updateTexture.renderList.push(scene.getMeshByID(meshId));
                    });

                    updateState = true;
                    // updateTexture.renderList = arr;
                }
                else if(updateKey=="mirrorPlane" || updateKey=="refractionPlane"){
                    let mp = p[updateKey];
                    updateTexture[updateKey] = new BABYLON.Plane(mp[0], mp[1], mp[2], mp[3]);
                    updateState = true;
                }
            }
            else if(p.mainType=="spriteManager"){
                if(updateKey == 'sprites'){ //精灵实例
                    this.updateObject.sprites.forEach(item => {
                        item.dispose();
                    });

                    p[updateKey].forEach(item => {
                        let sprite = new BABYLON.Sprite('player', this.updateObject);
                        sprite.cellIndex = item.cellIndex;
                        
                        if(item.color){
                            let c = rgbOrRgbaToArray(item.color);
        	                sprite.color = new BABYLON.Color3(c[0]/255, c[1]/255, c[2]/255);
                        }

                        sprite.size = item.size;
                        sprite.invertU = item.invertU;
                        sprite.invertV = item.invertV;
                        sprite.angle = item.angle;
                        sprite.position.x = item.position[0];
                        sprite.position.y = item.position[1];
                        sprite.position.z = item.position[2];
                        sprite.isVisible = item.isVisible;
                        sprite.disposeWhenFinishedAnimating = item.disposeWhenFinishedAnimating;
                        sprite.autoPlay = item.autoPlay;

                        sprite.playAnimation(0, 43, true, 100);
                    });

                    updateState = true;
                }
            }
            else if(p.mainType=="scene"){
                if(updateKey=="environmentTexture"){
                    let updateScene = this.updateObject;

                    let updateTexture = scene.getTextureByUniqueID(p[updateKey]);
                    updateScene[updateKey] = updateTexture;

                    updateState = true;
                }
                else if(updateKey=="enableGlow"){
                    if(p[updateKey]){
                        createGlow(p, scene);
                    }
                    else{
                        if(scene.effectLayers){
                            let glOld = scene.getGlowLayerByName(scene.id+"_glow");
                            if(glOld){
                                glOld.dispose();
                            }
                        }

                    }

                    updateState = true;
                }
                else if(updateKey in {glowIntensity:1, mainTextureFixedSize:1, mainTextureFixedSize:1,blurKernelSize:1}){
                    createGlow(p, scene);

                    updateState = true;
                }
                else if(updateKey=="enableBackground2D" || updateKey=="background2D"){
                    let enableBackground2D = p["enableBackground2D"], backgroundLayer;
                    if(scene.layers){
                        for(let i=0;i<scene.layers.length;i++){
                            let layer = scene.layers[i];
                            if(layer.name == scene.id + "_layer"){
                                backgroundLayer = layer;
                                break;
                            }
                        }

                        if(backgroundLayer){
                            backgroundLayer.dispose();
                        }
                    }
                    
                    if(enableBackground2D ||　enableBackground2D==undefined){
                        if(p["background2D"]!=null && p["background2D"].length>0){
                            new BABYLON.Layer(scene.id + "_layer",p.background2D, scene, true);
                        }
                    }

                    updateState = true;
                }
                else if(updateKey=="enableFilter" || updateKey=="filter"){
                    if(p["enableFilter"]){
                        this.changeFilterEffect(p["filter"], babylon);
                    }
                    else{
                        this.hideFilterEffect(babylon);
                    }
                    updateState = true;
                }

            }
            else if(p.mainType=="light"){
                let updateLight = this.updateObject;
                // if(updateKey=="position" || updateKey=="direction" || updateKey=="angle" || updateKey=="exponent"){

                //     // updateLight.dispose();
                //     updateLight = this.createLight(paramJson, babylon);
                //     this.updateObject = updateLight;
                //     updateState = true;
                // }
                // else 
                if(updateKey=="enableExcludedMeshesIds" || updateKey=="excludedMeshesIds" || updateKey=="includedOnlyMeshesIds" ){
                    changeLightExcludeAndInclude(p, scene, updateLight);
                    updateState = true;
                }
                else if(updateKey=="enableLensFlare" || updateKey=="lensFlareSystem"){
                    if(updateKey=="enableLensFlare"){
                        if(p[updateKey]){
                            createLensFlareSystem(p, scene, updateLight);
                        }
                        else{
                            if(scene.lensFlareSystems){
                                let oldLensId = updateLight.id + "_lensFlareSystem";
                                if(scene.lensFlareSystems){
                                    let oldLens = scene.getLensFlareSystemByID(oldLensId);
                                    if(oldLens!=null){
                                        oldLens.dispose();
                                    }
                                }
                            }
                        }
                    }
                    else{
                        createLensFlareSystem(p, scene, updateLight);
                    }
                    
                    updateState = true;
                }
                else if(updateKey in {enableShadow:1, shadowQuality:1, shadowRenderList:1, usePoissonSampling:1, useExponentialShadowMap:1, useBlurExponentialShadowMap:1, blurScale:1, blurBoxOffset:1, useKernelBlur:1, blurKernel:1, usePercentageCloserFiltering:1, filteringQuality:1}){
                     createShadowGenerator(p, scene, updateLight);
                     updateState = true;
                }
                else if(updateKey=="position"){
                    let className = updateLight.getClassName();
                    if(className=="DirectionalLight"){
                        let postion = p[updateKey];
                        let pos = new BABYLON.Vector3(postion[0], postion[1], postion[2]);
                        updateLight.position = pos;
                        updateLight.direction = pos.scale(-1).normalize();
                        updateState = true;
                    }
                }
            }
            // if(parentClass=="anisotropy" && updateKey=="direction"){

            // }


            if(!updateState){
                var updateValue = p[updateKey];
                if(updateValue instanceof Array){
                    if(updateValue.length==3){
                        this.setVect3Value(updateKey, null);
                    }
                    else if(updateValue.length==4){
                        this.setVect4Value(updateKey, null);
                    }
                }
                else if(typeof(updateValue)=="string"){
                    if(updateValue.substr(0, 4).toLocaleLowerCase()=="rgba"){
                        this.setColor4Value(updateKey);
                    }
                    else if(updateValue.substr(0, 3).toLocaleLowerCase()=="rgb"){
                        this.setColor3Value(updateKey);
                    }
                    else{
                        this.setValue(updateKey, null);
                    }
                }
                else if(updateKey.toLocaleLowerCase().indexOf("color")>-1 && (updateValue==null || updateValue.length==0)){
                    let v = null;
                    if(updateKey=="diffuseColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="specularColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="leftColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="rightColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="emissiveColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="ambientColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="albedoColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="reflectivityColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="tintColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="color"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="waterColor"){
                        v = new BABYLON.Color3(0.1,0.1,0.6);
                    }
                    else if(updateKey=="waterColor2"){
                        v = new BABYLON.Color3(0.1,0.1,0.6);
                    }
                    else if(updateKey=="fogColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="furColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="topColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="bottomColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="mainColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="lineColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="shadowColor"){
                        v = new BABYLON.Color3(1,1,1);
                    }
                    else if(updateKey=="shadeColor"){
                        v = new BABYLON.Color3(0.97,0.81,0.86);
                    }
                    else if(updateKey=="outlineColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else if(updateKey=="rimColor"){
                        v = new BABYLON.Color3(0,0,0);
                    }
                    else{
                        v = null;
                    }

                    this.updateObject[updateKey] = v;
                }
                else{
                    this.setValue(updateKey, null);
                }
            } 
        }

    


        let curUpdate = this.updateObject;
        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;

    }

    function getOptionForce(mainType, type){
        var option = {};
        if(mainType == "mesh"){
            if(type in meshDatas){
                option = meshDatas[type];
            }
        }

        return option;
    }

    // function updateObjectForce(paramJson, scene) {
        
    // }

    // function updateObjectPart(paramJson, scene) {
        
    // }

    initialize.prototype.updateload = function(paramJson, scene) {
                
    }

    function updateloadMs3D(paramJson, scene) {
        
    }

    function updateloadBabylon(paramJson, scene) {
        
    }

    function updateloadGLTF(paramJson, scene) {
        
    }

    function updateloadOthers(paramJson, scene) {
        
    }

    // initialize.prototype.download = function(paramJson, scene) {
        
    // }

    initialize.prototype.createParticle = function(particleJson, babylon, mode) {
        let scene=babylon.scene, camera = scene && scene.activeCamera;

        if(particleJson==null || scene==null){
            return;
        }

        particleJson = JSON.parse(JSON.stringify(particleJson));

        //mode表示p演示新增、b编辑新增、u编辑破坏式修改重建
        if(mode==null){
            mode = "b";
        }

        var preParam = this.p, preUpdateObject = this.updateObject;


        var p = particleJson;
        this.p = p;

        let preParticleSystem = scene.getParticleSystemByID(p.id);
        if(preParticleSystem){
            preParticleSystem.dispose();
        }

        var particleSystem = new BABYLON.ParticleSystem(p.id, p.capacity, scene, null,p.isAnimationSheetEnabled);

        this.updateObject = particleSystem;

        //延迟发射时间ms
        this.setValue("startDelay", 0);

        //粒子预热
        this.setValue("preWarmCycles", 0);
        this.setValue("preWarmStepOffset", 1);

        if(p.isAnimationSheetEnabled){
            this.updateObject.particleTexture = new BABYLON.Texture(p.textureName, scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
        }
        else{
            this.updateObject.particleTexture = new BABYLON.Texture(p.textureName, scene);
        }

        this.setColor4Value("textureMask");


        var ratioX = 1;
        var ratioY = 1;
        // if(camera.serialize().type=="ArcRotateCamera"){
        //     var curScreenSize = this.getScreenSize(scene);
        //     var screenSize = this.p["screenSize"];
        //     if(screenSize==null){
        //         screenSize = [1370, 879];
        //     }

        //     ratioX = curScreenSize[0]/screenSize[0];
        //     ratioY = curScreenSize[1]/screenSize[1];
        // }

        //粒子发射位置
        // if(p.cameraEmitter){
        //     particleSystem.emitter = camera;
        //     this.setVect3Value("minEmitBox", new BABYLON.Vector3(-0.3,0,0));
        //     this.setVect3Value("maxEmitBox", new BABYLON.Vector3(0.3,0,0));
        //     this.setVect3Value("direction1", new BABYLON.Vector3(-0.5, -1, 1));
        //     this.setVect3Value("direction2", new BABYLON.Vector3(0.5, 10, 10));
        // }
        // else{
        //     //this.setVect3Value("emitter", new BABYLON.Vector3(0,0,0));

        //     if(this.p["emitter"]==null){
        //         this.updateObject["emitter"] = new BABYLON.Vector3(0,0,0);
        //     }
        //     else{
        //         var v = this.p["emitter"];

        //         this.updateObject["emitter"] = new BABYLON.Vector3(v[0]*ratioX,v[1]*ratioY,v[2]);
        //     }
        // }

        if(p.emitterMode==1 && p.emitterObject){
            let emitter = scene.getCameraByID(p.emitterObject);
            if(emitter){
                this.setVect3Value("minEmitBox", new BABYLON.Vector3(-0.3,0,0));
                this.setVect3Value("maxEmitBox", new BABYLON.Vector3(0.3,0,0));
                this.setVect3Value("direction1", new BABYLON.Vector3(-0.5, -1, 1));
                this.setVect3Value("direction2", new BABYLON.Vector3(0.5, 10, 10));
            }
            else{
                emitter = scene.getMeshByID(p.emitterObject);

                if(!emitter){
                    emitter = scene.getLightByID(p.emitterObject);
                }
            }

            particleSystem.emitter = emitter;

        }
        else{
            //this.setVect3Value("emitter", new BABYLON.Vector3(0,0,0));

            if(this.p["emitter"]==null){
                this.updateObject["emitter"] = new BABYLON.Vector3(0,0,0);
            }
            else{
                var v = this.p["emitter"];

                this.updateObject["emitter"] = new BABYLON.Vector3(v[0]*ratioX,v[1]*ratioY,v[2]);
            }
        }

        //粒子存活时间
        this.setValue("minLifeTime", 1);
        this.setValue("maxLifeTime", 1);

        //粒子存活时间渐进
        this.setGradientValue("lifeTimeGradients", "addLifeTimeGradient");

        //粒子体积大小
        this.setValue("minSize", 1);
        this.setValue("maxSize", 2);

        //粒子X体积拉伸
        this.setValue("minScaleX", 1);
        this.setValue("maxScaleX", 2);

        //粒子Y体积拉伸
        this.setValue("minScaleY", 1);
        this.setValue("maxScaleY", 2);

        //粒子体积大小渐变
        this.setGradientValue("sizeGradients", "addSizeGradient");
        //初始体积渐变
        this.setGradientValue("startSizeGradients", "addStartSizeGradient");


        //粒子颜色
        this.setColor4Value("color1", new BABYLON.Color4(1,1,1,1));
        this.setColor4Value("color2", new BABYLON.Color4(1,1,1,1));
        this.setColor4Value("colorDead", new BABYLON.Color4(1,1,1,0));

        //粒子颜色渐变
        this.setGradientColor4Value("colorGradients", "addColorGradient");

        //渲染模式
        this.setValue("blendMode", 1);

        //发射速度
        this.setValue("emitRate", 2);
        //发射速度渐变
        this.setGradientValue("emitRateGradients", "addEmitRateGradient");

        //粒子数量限制
        this.setValue("manualEmitCount", 2);

        //重力效果
        this.setVect3Value("gravity", new BABYLON.Vector3(0, -9.81, 0));

        //旋转速度
        this.setValue("minAngularSpeed", 0);
        this.setValue("maxAngularSpeed", 0);

        //初始旋转角度
        this.setValue("minInitialRotation", 0);
        this.setValue("maxInitialRotation", 0);

        //初始旋转角度
        this.setValue("minInitialRotation", 0);
        this.setValue("maxInitialRotation", 0);

        //粒子体积大小渐变
        this.setGradientValue("angularSpeedGradients", "addAngularSpeedGradient");

        //发射强度
        this.setValue("minEmitPower", 1);
        this.setValue("maxEmitPower", 2);
        //发射更新速度
        this.setValue("updateSpeed", 0.01);
        //速度改变渐变
        this.setGradientValue("velocityGradients", "addVelocityGradient");

        //限速渐变
        this.setGradientValue("limitVelocityGradients", "addLimitVelocityGradient");

        //摩擦力渐变
        this.setGradientValue("dragGradients", "addDragGradient");

        //粒子显示面
        this.setValue("isBillboardBased", true);
        this.setValue("billboardMode", 7);

        //色彩倾斜
        this.setValue("useRampGradients", false);
        this.setGradientColor3Value("rampGradients", "addRampGradient");
        this.setGradientValue("colorRemapGradients", "addColorRemapGradient");
        this.setGradientValue("alphaRemapGradients", "addAlphaRemapGradient");
        
        var emitter1;
        if(this.p.particleEmitterType!=null){
            var pet = this.p.particleEmitterType;
            var type = pet.type;
            
            if(type=="PointParticleEmitter"){
                var direction1 = pet.direction1, direction2 = pet.direction2;

                var pointEmitter = this.updateObject.createPointEmitter(new BABYLON.Vector3(direction1[0]*ratioX,direction1[1]*ratioY,direction1[2]), new BABYLON.Vector3(direction2[0]*ratioX,direction2[1]*ratioY,direction2[2]));

                emitter1 = pointEmitter;
            }
            else if(type=="BoxParticleEmitter"){
                var direction1 = pet.direction1, direction2 = pet.direction2;
                var minEmitBox = pet.minEmitBox, maxEmitBox = pet.maxEmitBox;

                var boxEmitter = this.updateObject.createBoxEmitter(new BABYLON.Vector3(direction1[0]*ratioX,direction1[1]*ratioY,direction1[2]), new BABYLON.Vector3(direction2[0]*ratioX,direction2[1]*ratioY,direction2[2]),new BABYLON.Vector3(minEmitBox[0],minEmitBox[1],minEmitBox[2]), new BABYLON.Vector3(maxEmitBox[0],maxEmitBox[1],maxEmitBox[2]));

                this.updateObject.emitter.x -= (minEmitBox[0] + maxEmitBox[0])/2;
                this.updateObject.emitter.y -= (minEmitBox[1] + maxEmitBox[1])/2;
                this.updateObject.emitter.z -= (minEmitBox[2] + maxEmitBox[2])/2;

                emitter1 = boxEmitter;
            }
            else if(type=="SphereParticleEmitter"){
                var radius = pet.radius;

                var sphereEmitter = particleSystem.createSphereEmitter(radius);

                sphereEmitter.radiusRange = pet.radiusRange;
                sphereEmitter.directionRandomizer = pet.directionRandomizer;

                emitter1 = sphereEmitter;

            }
            else if(type=="SphereDirectedParticleEmitter"){
                var radius = pet.radius;
                var direction1 = pet.direction1, direction2 = pet.direction2;

                var sphereEmitter = particleSystem.createDirectedSphereEmitter(radius, new BABYLON.Vector3(direction1[0]*ratioX,direction1[1]*ratioY,direction1[2]), new BABYLON.Vector3(direction2[0]*ratioX,direction2[1]*ratioY,direction2[2]));

                sphereEmitter.radiusRange = pet.radiusRange;
                sphereEmitter.directionRandomizer = pet.directionRandomizer;

                emitter1 = sphereEmitter;

            }
            else if(type=="HemisphericParticleEmitter"){
                var radius = pet.radius;
                var radiusRange = pet.radiusRange;
                var hemisphericEmitter = particleSystem.createHemisphericEmitter(radius,radiusRange);

                // hemisphericEmitter.radiusRange = pet.radiusRange;
                hemisphericEmitter.directionRandomizer = pet.directionRandomizer;

                emitter1 = hemisphericEmitter;
            }
            else if(type=="CylinderParticleEmitter"){
                var radius = pet.radius,height = pet.height,radiusRange = pet.radiusRange,directionRandomizer = pet.directionRandomizer;
                var cylinderEmitter = particleSystem.createCylinderEmitter(radius,height,radiusRange,directionRandomizer);

                emitter1 = cylinderEmitter;

            }
            else if(type=="CylinderDirectedParticleEmitter"){
                var radius = pet.radius,height = pet.height,radiusRange = pet.radiusRange,directionRandomizer = pet.directionRandomizer;
                var direction1 = pet.direction1, direction2 = pet.direction2;

                var cylinderEmitter = particleSystem.createCylinderEmitter(radius,height,radiusRange,new BABYLON.Vector3(direction1[0]*ratioX,direction1[1]*ratioY,direction1[2]), new BABYLON.Vector3(direction2[0]*ratioX,direction2[1]*ratioY,direction2[2]));

                cylinderEmitter.directionRandomizer = pet.directionRandomizer;

                emitter1 = cylinderEmitter;

            }
            else if(type=="ConeParticleEmitter"){
                var radius = pet.radius,angle = pet.angle,directionRandomizer = pet.directionRandomizer;
                var coneEmitter = particleSystem.createConeEmitter(radius, angle, directionRandomizer);

                coneEmitter.heightRange = pet.heightRange;
                coneEmitter.radiusRange = pet.radiusRange;

                var height = radius / Math.tan(angle / 2);

                this.updateObject.emitter.y -= height/2;

                emitter1 = coneEmitter;
                
            }

            if(emitter1!=null){
                particleSystem.particleEmitterType = emitter1;
            }

            

        }

        this.setValue("spriteCellWidth", 64);
        this.setValue("spriteCellHeight", 64);
        this.setValue("startSpriteCellID", 0);
        this.setValue("endSpriteCellID", 100);
        this.setValue("spriteCellChangeSpeed", 1);
        this.setValue("spriteRandomStartCell", false);

        this.setValue("enableSubEmitter");
        this.setValue("subEmitterType");
        this.setValue("inheritDirection");
        this.setValue("inheritedVelocityAmount");

        var noiseTexture;
        if(this.p.noiseTexture){
        	var n = this.p.noiseTexture;
        	noiseTexture = new BABYLON.NoiseProceduralTexture("perlin", 256, scene);
			noiseTexture.animationSpeedFactor = n.animationSpeedFactor;
			noiseTexture.persistence = n.persistence;
			noiseTexture.brightness = n.brightness;
			noiseTexture.octaves = n.octaves;

			particleSystem.noiseTexture = noiseTexture;

			if(this.p.noiseStrength){
				var nt = this.p.noiseStrength;
				particleSystem.noiseStrength = new BABYLON.Vector3(nt[0], nt[1], nt[2]);
			}
			
        }

        var msParticleRomanTempX = 0, msParticleRomanTempY = 0, msParticleRomanTempZ = 0;

        if(p.msParticleRomanOn==null){
        	p.msParticleRomanOn = false;
        }

        if(p.msParticleRomanStepX==null){
        	p.msParticleRomanStepX = 0.05;
        }

        if(p.msParticleRomanStepY==null){
        	p.msParticleRomanStepY = 0.05;
        }

        if(p.msParticleRomanStepZ==null){
        	p.msParticleRomanStepZ = 0.05;
        }

        if(p.msParticleRomanSpeedX==null){
        	p.msParticleRomanSpeedX = 0;
        }
        if(p.msParticleRomanSpeedY==null){
        	p.msParticleRomanSpeedY = 0;
        }
        if(p.msParticleRomanSpeedZ==null){
        	p.msParticleRomanSpeedZ = 0;
        }

        if(p.subEmitters && p.subEmitters.length>0){
            let subEm = [];
            p.subEmitters.forEach((psID)=>{
                let ps = scene.getParticleSystemByID(psID);
                if(ps && ps.enableSubEmitter){
                    var subEmitter = new BABYLON.SubEmitter(ps);
                    subEmitter.type = ps.subEmitterType;
                    subEmitter.inheritDirection = ps.inheritDirection;
                    subEmitter.inheritedVelocityAmount = ps.inheritedVelocityAmount;

                    subEm.push(subEmitter);
                }
            });
            particleSystem.subEmitters = subEm;
        }


        particleSystem.updateFunction = function (particles) {
            var noiseTextureSize = null;
            var noiseTextureData = null;
            var _this = particleSystem;
            if (_this.noiseTexture) { // We need to get texture data back to CPU
                noiseTextureSize = _this.noiseTexture.getSize();
                noiseTextureData = (_this.noiseTexture.getContent());
            }
            var _loop_1 = function () {
                particle = particles[index];
                var scaledUpdateSpeed = _this._scaledUpdateSpeed;
                var previousAge = particle.age;
                particle.age += scaledUpdateSpeed;
                // Evaluate step to death
                if (particle.age > particle.lifeTime) {
                    var diff = particle.age - previousAge;
                    var oldDiff = particle.lifeTime - previousAge;
                    scaledUpdateSpeed = (oldDiff * scaledUpdateSpeed) / diff;
                    particle.age = particle.lifeTime;
                }
                var ratio = particle.age / particle.lifeTime;
                // Color
                if (_this._colorGradients && _this._colorGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._colorGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentColorGradient) {
                            particle._currentColor1.copyFrom(particle._currentColor2);
                            nextGradient.getColorToRef(particle._currentColor2);
                            particle._currentColorGradient = currentGradient;
                        }
                         BABYLON.Color4.LerpToRef(particle._currentColor1, particle._currentColor2, scale, particle.color);
                    });
                }
                else {
                    particle.colorStep.scaleToRef(scaledUpdateSpeed, _this._scaledColorStep);
                    particle.color.addInPlace(_this._scaledColorStep);
                    if (particle.color.a < 0) {
                        particle.color.a = 0;
                    }
                }
                // Angular speed
                if (_this._angularSpeedGradients && _this._angularSpeedGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._angularSpeedGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentAngularSpeedGradient) {
                            particle._currentAngularSpeed1 = particle._currentAngularSpeed2;
                            particle._currentAngularSpeed2 = nextGradient.getFactor();
                            particle._currentAngularSpeedGradient = currentGradient;
                        }
                        particle.angularSpeed = BABYLON["Scalar"].Lerp(particle._currentAngularSpeed1, particle._currentAngularSpeed2, scale);
                    });
                }
                particle.angle += particle.angularSpeed * scaledUpdateSpeed;
                // Direction
                var directionScale = scaledUpdateSpeed;
                /// Velocity
                if (_this._velocityGradients && _this._velocityGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._velocityGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentVelocityGradient) {
                            particle._currentVelocity1 = particle._currentVelocity2;
                            particle._currentVelocity2 = nextGradient.getFactor();
                            particle._currentVelocityGradient = currentGradient;
                        }
                        directionScale *= BABYLON["Scalar"].Lerp(particle._currentVelocity1, particle._currentVelocity2, scale);
                    });
                }
                particle.direction.scaleToRef(directionScale, _this._scaledDirection);
                /// Limit velocity
                if (_this._limitVelocityGradients && _this._limitVelocityGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._limitVelocityGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentLimitVelocityGradient) {
                            particle._currentLimitVelocity1 = particle._currentLimitVelocity2;
                            particle._currentLimitVelocity2 = nextGradient.getFactor();
                            particle._currentLimitVelocityGradient = currentGradient;
                        }
                        var limitVelocity = BABYLON["Scalar"].Lerp(particle._currentLimitVelocity1, particle._currentLimitVelocity2, scale);
                        var currentVelocity = particle.direction.length();
                        if (currentVelocity > limitVelocity) {
                            particle.direction.scaleInPlace(_this.limitVelocityDamping);
                        }
                    });
                }
                /// Drag
                if (_this._dragGradients && _this._dragGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._dragGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentDragGradient) {
                            particle._currentDrag1 = particle._currentDrag2;
                            particle._currentDrag2 = nextGradient.getFactor();
                            particle._currentDragGradient = currentGradient;
                        }
                        var drag = BABYLON["Scalar"].Lerp(particle._currentDrag1, particle._currentDrag2, scale);
                        _this._scaledDirection.scaleInPlace(1.0 - drag);
                    });
                }
                particle.position.addInPlace(_this._scaledDirection);
                // Noise
                if (noiseTextureData && noiseTextureSize && particle._randomNoiseCoordinates1) {
                    var fetchedColorR = _this._fetchR(particle._randomNoiseCoordinates1.x, particle._randomNoiseCoordinates1.y, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
                    var fetchedColorG = _this._fetchR(particle._randomNoiseCoordinates1.z, particle._randomNoiseCoordinates2.x, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
                    var fetchedColorB = _this._fetchR(particle._randomNoiseCoordinates2.y, particle._randomNoiseCoordinates2.z, noiseTextureSize.width, noiseTextureSize.height, noiseTextureData);
                    var force = BABYLON.TmpVectors.Vector3[0];
                    var scaledForce = BABYLON.TmpVectors.Vector3[1];
                    force.copyFromFloats((2 * fetchedColorR - 1) * _this.noiseStrength.x, (2 * fetchedColorG - 1) * _this.noiseStrength.y, (2 * fetchedColorB - 1) * _this.noiseStrength.z);
                    force.scaleToRef(scaledUpdateSpeed, scaledForce);
                    particle.direction.addInPlace(scaledForce);
                }
                // Gravity
                _this.gravity.scaleToRef(scaledUpdateSpeed, _this._scaledGravity);
                particle.direction.addInPlace(_this._scaledGravity);
                // Size
                if (_this._sizeGradients && _this._sizeGradients.length > 0) {
                    BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._sizeGradients, function (currentGradient, nextGradient, scale) {
                        if (currentGradient !== particle._currentSizeGradient) {
                            particle._currentSize1 = particle._currentSize2;
                            particle._currentSize2 = nextGradient.getFactor();
                            particle._currentSizeGradient = currentGradient;
                        }
                        particle.size = BABYLON["Scalar"].Lerp(particle._currentSize1, particle._currentSize2, scale);
                    });
                }
                // Remap data
                if (_this._useRampGradients) {
                    if (_this._colorRemapGradients && _this._colorRemapGradients.length > 0) {
                        BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._colorRemapGradients, function (currentGradient, nextGradient, scale) {
                            var min = BABYLON["Scalar"].Lerp(currentGradient.factor1, nextGradient.factor1, scale);
                            var max = BABYLON["Scalar"].Lerp(currentGradient.factor2, nextGradient.factor2, scale);
                            particle.remapData.x = min;
                            particle.remapData.y = max - min;
                        });
                    }
                    if (_this._alphaRemapGradients && _this._alphaRemapGradients.length > 0) {
                        BABYLON.GradientHelper.GetCurrentGradient(ratio, _this._alphaRemapGradients, function (currentGradient, nextGradient, scale) {
                            var min = BABYLON["Scalar"].Lerp(currentGradient.factor1, nextGradient.factor1, scale);
                            var max = BABYLON["Scalar"].Lerp(currentGradient.factor2, nextGradient.factor2, scale);
                            particle.remapData.z = min;
                            particle.remapData.w = max - min;
                        });
                    }
                }
                if (_this._isAnimationSheetEnabled) {
                    particle.updateCellIndex();
                }
                // Update the position of the attached sub-emitters to match their attached particle
                particle._inheritParticleInfoToSubEmitters();
                if (particle.age >= particle.lifeTime) { // Recycle by swapping with last particle
                    _this._emitFromParticle(particle);
                    if (particle._attachedSubEmitters) {
                        particle._attachedSubEmitters.forEach(function (subEmitter) {
                            subEmitter.particleSystem.disposeOnStop = true;
                            subEmitter.particleSystem.stop();
                        });
                        particle._attachedSubEmitters = null;
                    }
                    _this.recycleParticle(particle);
                    index--;
                    return "continue";
                }

                if(particleJson.msParticleRomanOn){
                	particle.position.x += Math.sin(msParticleRomanTempX)*particleJson.msParticleRomanSpeedX;
	                particle.position.y += Math.sin(msParticleRomanTempY)*particleJson.msParticleRomanSpeedY;
	                particle.position.z += Math.sin(msParticleRomanTempZ)*particleJson.msParticleRomanSpeedZ; //0.03
                }
                
            };
            var particle;
            for (var index = 0; index < particles.length; index++) {
                _loop_1();
            }

            if(particleJson.msParticleRomanOn){
	            // msParticleTemp += 0.05;
	            msParticleRomanTempX += particleJson.msParticleRomanStepX;
	            msParticleRomanTempY += particleJson.msParticleRomanStepY;
	            msParticleRomanTempZ += particleJson.msParticleRomanStepZ;
        	}
        }

        if(!p.enableSubEmitter){
            particleSystem.start();
        }
        
        var curUpdate = this.updateObject;

        this.p = preParam; 
        this.updateObject = preUpdateObject;

        return curUpdate;
    }


    initialize.prototype.getScreenSize = function(scene){
        // var _this = this;
        var engine = scene.getEngine();
        // var canvas = engine.getRenderingCanvas();
        // var origin =  BABYLON.Vector3.Unproject(
        //         new BABYLON.Vector3(0, 0, 0),
        //         canvas.width,
        //         canvas.height,
        //         new BABYLON.Matrix.Identity(),
        //         camera.getViewMatrix(),
        //         camera.getProjectionMatrix()
        // );

        // var o = [Math.round(origin.x*1000)/1000, Math.round(origin.y*1000)/1000, Math.round(origin.z*1000)/1000];
        // console.log(o);
        return [engine.getRenderWidth(), engine.getRenderHeight()];
    }

    initialize.prototype.setValue = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv==null){
            if(defualt!=null){
                this.updateObject[attr] = defualt;
            }
        }
        else{
        	this.updateObject[attr] = pv;
        }
    }

    initialize.prototype.setVect2Value = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv==null){
            if(defualt!=null){
                this.updateObject[attr] = defualt;
            }
        }
        else{
        	var v = pv;
        	this.updateObject[attr] = new BABYLON.Vector2(v[0],v[1]);
        }
    }
    
    initialize.prototype.setVect3Value = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv==null){
            if(defualt!=null){
                this.updateObject[attr] = defualt;
            }
        }
        else{
            var v = pv;
            if(attr=="rotation"){
                let x = v[0]*Math.PI/180;
                let y = v[1]*Math.PI/180;
                let z = v[2]*Math.PI/180;
                this.updateObject[attr] = new BABYLON.Vector3(x,y,z);
            }
            else{
                this.updateObject[attr] = new BABYLON.Vector3(v[0],v[1],v[2]);
            }
        	
        }
    }

    initialize.prototype.setVect4Value = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv==null){
    		if(defualt!=null){
    			this.updateObject[attr] = defualt;
    		}
        }
        else{
        	var v = pv;
        	this.updateObject[attr] = new BABYLON.Vector4(v[0],v[1],v[2],v[3]);
        }
    }

    initialize.prototype.setColor3Value = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv==null){
    		if(defualt!==undefined){
        		this.updateObject[attr] = defualt;
        	}
        }
        else{
        	var c = rgbOrRgbaToArray(pv);
        	this.updateObject[attr] = new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255);
        }
    }

    initialize.prototype.setColor4Value = function(attr, defualt, aliasName){
        var pv = this.p[aliasName?aliasName:attr];
        if(pv==null){
            if(defualt!==undefined){
                this.updateObject[attr] = defualt;
            }
        }
        else{
            var c = rgbOrRgbaToArray(pv);
            this.updateObject[attr] = new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]);
        }
    }

    initialize.prototype.setGradientValue = function(attr, func, aliasName){
    	// var p = this.p;
        var pv = this.p[aliasName?aliasName:attr];
    	// var func = this.updateObject[func];

    	if(pv!=null && pv.length>0){
        	for(var i=0;i<pv.length;i++){
        		var g = pv[i];
        		if(g.factor2==null){
        			this.updateObject[func](g.gradient, g.factor1);
        		}
        		else{
        			this.updateObject[func](g.gradient, g.factor1, g.factor2);
        		}
        	}
        }
    }

    initialize.prototype.setGradientColor3Value = function(attr, func, aliasName){
    	// var p = this.p;
        var pv = this.p[aliasName?aliasName:attr];
    	if(pv!=null && pv.length>0){
        	for(var i=0;i<pv.length;i++){
        		var g = pv[i];
        		if(g.color2==null){
        			var c = rgbOrRgbaToArray(g.color1);
        			this.updateObject[func](g.gradient, new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255));
        		}
        		else{
        			var c = rgbOrRgbaToArray(g.color1);
        			var c2 = rgbOrRgbaToArray(g.color2);
        			this.updateObject[func](g.gradient, new BABYLON.Color3(c[0]/255,c[1]/255,c[2]/255), new BABYLON.Color3(c2[0]/255,c2[1]/255,c2[2]/255));
        		}
        	}
        }
    }

    initialize.prototype.setGradientColor4Value = function(attr, func, aliasName){
    	// var p = this.p;
        var pv = this.p[aliasName?aliasName:attr];
    	// var func = this.updateObject[func];

    	if(pv!=null && pv.length>0){
        	for(var i=0;i<pv.length;i++){
        		var g = pv[i];
        		if(g.color2==null){
        			var c = rgbOrRgbaToArray(g.color1);
        			this.updateObject[func](g.gradient, new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]));
        		}
        		else{
        			var c = rgbOrRgbaToArray(g.color1);
        			var c2 = rgbOrRgbaToArray(g.color2);
        			this.updateObject[func](g.gradient, new BABYLON.Color4(c[0]/255,c[1]/255,c[2]/255,c[3]), new BABYLON.Color4(c2[0]/255,c2[1]/255,c2[2]/255,c2[3]));
        		}
        	}
        }
    }


    if (!Math.cbrt) {
        Math.cbrt = function(x) {
            var y = Math.pow(Math.abs(x), 1 / 3);
            return x < 0 ? -y : y;
        }
    }

    function convertSourceToUrl(source, type){
        if(source==null || source.length==0){
            return "";
        }

        if(type==null){
            type = "application/dds";
        }

        // if(source instanceof Uint8Array){
        //     var blob = new Blob(source);
        //     url = window.URL.createObjectURL(blob);
        // }
        // else{
        //     url = source;
        // }

        let typedArray = BABYLON.Tools.DecodeBase64(source);
        let blob = new Blob([typedArray], {type: type}); // 传入一个合适的MIME类型   
        let url = URL.createObjectURL(blob);   
        return url;
    }

    function rgbOrRgbaToArray(colorString) {
        if(colorString==null || colorString.length==0){
            return [];
        }
        var colorString = colorString.toLocaleLowerCase();
        var rgbOrgbaJudgeTag = /^([^\(]+)\([^\)]+\)$/i;
        var aaa = rgbOrgbaJudgeTag.exec(colorString);
        if (aaa !== null) {
            if (aaa[1].trim() === "rgb") {
                var str = colorString;
                var strTag = /^rgb[a]*\s*\(([^,]+),([^,]+),([^\)]+)\)$/i;
                var result = strTag.exec(str);
                if (result === null || result[1].trim() === "" || result[2].trim() === "" || result[3].trim() === "") {
                    return null;
                }
                var returnArray = [];
                for (var i = 1; i <= result.length - 1; i++) {
                    returnArray[i - 1] = Number(result[i].trim());
                }
                return returnArray;
            } else if (aaa[1].trim() === "rgba") {
                var str = colorString;
                var strTag = /^rgb[a]*\s*\(([^,]+),([^,]+),([^,]+),([^\)]+)\)$/i;
                var result = strTag.exec(str);
                if (result === null || result[1].trim() === "" || result[2].trim() === "" || result[3].trim() === "") {
                    return null;
                }
                var returnArray = [];
                for (var i = 1; i <= result.length - 1; i++) {
                    returnArray[i - 1] = Number(result[i].trim());
                }
                return returnArray;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    function arrayNonRepeatfy(arr) {
        let map = new Map();
        let array = new Array();  // 数组用于返回结果
        for (let i = 0; i < arr.length; i++) {
          if(map .has(arr[i])) {  // 如果有该key值
            map .set(arr[i], true); 
          } else { 
            map .set(arr[i], false);   // 如果没有该key值
            array .push(arr[i]);
          }
        } 
        return array ;
    }

    function easeInOutQuint(t, b, c, d) {
        t /= d / 2;
        if (t < 1) {
            return c / 2 * t * t * t * t * t + b;
        }
        return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    }


    var ret = {
        name: "3D特效", // enter quit emphasis 
        type: "effect3D",
        ini: initialize
    }

    window.particle3D = ret;
    window.msparticle3D = ret;

    return ret;
})();