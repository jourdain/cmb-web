(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){require("./simput/SimPut.js");require("./simput/module.js");require("./simput/core/module.js");require("./simput/core/main-controller.js");require("./simput/core/io-controller.js");require("./simput/core/simput-input-controller.js");require("./simput/core/simput-input-directive.js");require("./simput/core/simput-input-content-directive.js");require("./simput/core/simput-input-property-directive.js");angular.module("SimPut",["kitware.SimPut"])},{"./simput/SimPut.js":2,"./simput/core/io-controller.js":3,"./simput/core/main-controller.js":4,"./simput/core/module.js":5,"./simput/core/simput-input-content-directive.js":6,"./simput/core/simput-input-controller.js":7,"./simput/core/simput-input-directive.js":8,"./simput/core/simput-input-property-directive.js":9,"./simput/module.js":10}],2:[function(require,module,exports){(function(window){var module={},templateModules={},templateList=[];if(window.hasOwnProperty("SimPut")){module=window.SimPut||{}}else{window.SimPut=module}function getTemplate(name){return templateModules[name]}function isArray(obj){return Array.isArray(obj)}function findParamaterById(parameterList,id){var count=parameterList.length;while(count--){if(parameterList[count].id===id){return parameterList[count]}}return null}function extractOrSelection(viewInstance){var templateObject=this,attributeDef=templateObject.definition.definitions,attrMap={},result=[];for(var key in attributeDef){attrMap[attributeDef[key].label]=key}for(var idx=0;idx<viewInstance.or.length;++idx){if(viewInstance.or[idx].active){result.push(attrMap[viewInstance.or[idx].active])}}return result}function extractEnumValues(attributeName,parameterId,viewInstance,externalData){var templateObject=this,activeLabels=viewInstance[attributeName][parameterId],parameter=findParamaterById(templateObject.definition.definitions[attributeName].parameters,parameterId),enumData=parameter.enum.external?externalData[parameter.enum.external]:parameter.enum;if(isArray(activeLabels)){var result=[],count=activeLabels.length;while(count--){var idx=enumData.labels.indexOf(activeLabels[count]);if(idx!==-1){result.push(enumData.values[idx])}else{console.log("Could not find "+activeLabels[count].toString()+" inside "+enumData.labels.toString())}}return result}else{var idx=enumData.labels.indexOf(activeLabels);if(idx!==-1){return enumData.values[idx]}else{console.log("Could not find "+activeLabels+" inside "+enumData.labels.toString())}}return null}function extractDefault(parameter,viewModel){var templateObject=this,value=parameter.default,size=Number(parameter.size),type=parameter.type;if(type==="enum"){var enumValues=parameter.enum.external?viewModel.external[parameter.enum.external].labels:parameter.enum.labels;if(enumValues===undefined){console.log("No enum value for "+parameter.id);console.log(parameter)}if(isArray(value)){var result=[];for(var idx=0;idx<value.length;++idx){result.push(enumValues[value[idx]])}return result}else if(value>=0&&value<enumValues.length){return enumValues[value]}}return value}function generateAttributeData(definitions,attributeName,viewModel){var templateObject=this,params=definitions[attributeName].parameters,pCount=params?params.length:0,data={};while(pCount--){data[params[pCount].id]=this.extractDefault(params[pCount],viewModel)}return data}function generateViewDataModel(viewId,viewIndex,viewModel){var templateObject=this,definitions=templateObject.definition.definitions,attributes=templateObject.definition.views[viewId].attributes,viewNames=templateObject.definition.views[viewId].names,count=attributes.length,viewData={name:"New view",or:[]};if(viewNames&&viewIndex<viewNames.length){viewData.name=viewNames[viewIndex]}while(count--){viewData.or.push({});if(isArray(attributes[count])){var attrList=attributes[count],orItem={active:"",labels:[],values:[],collapsed:false};for(var idx=0;idx<attrList.length;++idx){viewData[attrList[idx]]=templateObject.generateAttributeData(definitions,attrList[idx],viewModel);orItem.labels.push(definitions[attrList[idx]].label);orItem.values.push(attrList[idx])}orItem.active=orItem.labels[0];viewData.or.pop();viewData.or.push(orItem)}else{if(!definitions[attributes[count]].parameters){console.log("No parameters for "+attributes[count]);continue}viewData[attributes[count]]=templateObject.generateAttributeData(definitions,attributes[count],viewModel)}}viewData.or.reverse();return viewData}function registerTemplateLibrary(name,templateLib){templateList.push(name);templateModules[name]=templateLib;templateLib.generateViewDataModel=generateViewDataModel;templateLib.generateAttributeData=generateAttributeData;templateLib.extractDefault=extractDefault;templateLib.extractEnumValues=extractEnumValues;templateLib.extractOrSelection=extractOrSelection}module.registerTemplateLibrary=registerTemplateLibrary;module.templateList=templateList;module.getTemplate=getTemplate;module.isArray=isArray})(window)},{}],3:[function(require,module,exports){angular.module("kitware.SimPut.core").controller("SimPut.IOController",["$scope","$window","$timeout",function($scope,$window,$timeout){var dropTarget=document.getElementById("drop-data-model");function consumeEvent(event){event.stopPropagation();event.preventDefault();if(event.type=="dragover"){dropTarget.classList.add("drag-over")}else{dropTarget.classList.remove("drag-over")}return false}function processFile(event){var files=event.target.files||event.dataTransfer.files,reader=new FileReader,updateModel=$scope.updateDataModel;consumeEvent(event);if(files[0]){reader.onloadend=function(event){updateModel(JSON.parse(reader.result))};reader.readAsText(files[0])}}dropTarget.addEventListener("dragover",consumeEvent,false);dropTarget.addEventListener("dragenter",consumeEvent,false);dropTarget.addEventListener("drop",processFile,false);function saveFile(fileName,content){var newFileContent=new Blob([content],{type:"application/octet-binary"}),downloadURL=$window.URL.createObjectURL(newFileContent),downloadLink=document.getElementById("file-download-link");downloadLink.href=downloadURL;downloadLink.download=fileName;downloadLink.click();$timeout(function(){$window.URL.revokeObjectURL(downloadURL)},1e3)}$scope.$on("save-file",function(event,arg){saveFile(arg.name,arg.content)});$scope.SaveFile=saveFile}])},{}],4:[function(require,module,exports){angular.module("kitware.SimPut.core").controller("SimPut.MainController",["$scope","$window","$timeout",function($scope,$window,$timeout){var SimPut=$window.SimPut;$scope.title="SimPut";$scope.viewModel=null;$scope.template=null;$scope.updateDataModel=function(data){$scope.template=data.type?SimPut.getTemplate(data.type):null;$scope.viewModel=data;$scope.$apply()}}])},{}],5:[function(require,module,exports){angular.module("kitware.SimPut.core",[])},{}],6:[function(require,module,exports){angular.module("kitware.SimPut.core").directive("simputInputContentPanel",function(){return{restrict:"AE",scope:{viewId:"@",viewIndex:"@",viewData:"=",viewModel:"=",template:"="},controller:["$scope",function($scope){$scope.isArray=SimPut.isArray;$scope.toggleHelp=function($event){var list=$event.target.parentElement.parentElement.getElementsByClassName("help-content"),count=list.length,show=count>0?list[0].style.display==="none":false;while(count--){list[count].style.display=show?"":"none"}}}],template:templatizer.simput.core.tpls["simput-input-content"]()}})},{}],7:[function(require,module,exports){angular.module("kitware.SimPut.core").controller("SimPut.InputController",["$rootScope","$scope","$window","$timeout","$mdDialog",function($rootScope,$scope,$window,$timeout,$mdDialog){$scope.activeSection=null;$scope.errors=[];$scope.removeView=function(viewId,index){$scope.viewModel.data[viewId].splice(index,1);$scope.activateSection(null,0)};$scope.addView=function(event,viewId){var controllerScope=$scope,title=$scope.template.definition.views[viewId].label;$mdDialog.show({controller:["$scope","$mdDialog",function($scope,$mdDialog){$scope.title=title;$scope.namePlaceHolder="Name for the new view";$scope.ok=function(response){$mdDialog.hide(response)};$scope.cancel=function(){$mdDialog.cancel()}}],template:templatizer.simput.core.tpls["create-input-view-dialog"](),targetEvent:event}).then(function(formData){if($scope.viewModel.data===undefined){$scope.viewModel.data={}}if($scope.viewModel.data[viewId]===undefined){$scope.viewModel.data[viewId]=[]}var viewModel=$scope.template.generateViewDataModel(viewId,controllerScope.viewModel.data[viewId].length,controllerScope.viewModel);viewModel.name=formData.name;controllerScope.viewModel.data[viewId].push(viewModel);controllerScope.activateSection(viewId,controllerScope.viewModel.data[viewId].length-1)},function(){})};$scope.activateSection=function(viewId,index){var viewSubDataModel=null;if(!viewId){$scope.activeSection={view:null,idx:0,data:{}};return}if($scope.viewModel.data===undefined){$scope.viewModel.data={}}if($scope.viewModel.data[viewId]===undefined){$scope.viewModel.data[viewId]=[]}if(index<$scope.viewModel.data[viewId].length){viewSubDataModel=$scope.viewModel.data[viewId][index]}else{viewSubDataModel=$scope.template.generateViewDataModel(viewId,$scope.viewModel.data[viewId]?$scope.viewModel.data[viewId].length:0,$scope.viewModel);$scope.viewModel.data[viewId].push(viewSubDataModel)}$scope.activeSection={view:viewId,idx:index,data:viewSubDataModel}};$scope.saveDataModel=function(){$rootScope.$broadcast("simput-click","save-model");$rootScope.$broadcast("save-file",{name:$scope.template.files[0],content:JSON.stringify($scope.viewModel,null,4)})};$scope.saveOutput=function(){$rootScope.$broadcast("simput-click","save-output");try{var jadeModel=$scope.template.extract($scope.template,$scope.viewModel),outputContent="";$scope.errors=jadeModel.errors;if(jadeModel.valid){try{outputContent=$scope.template.template(jadeModel.data);$rootScope.$broadcast("save-file",{name:$scope.template.files[1],content:outputContent})}catch(error){$scope.errors.push("Output generation failed when applying template.");$scope.errors.push(error.message);console.log(jadeModel);$rootScope.$broadcast("simput-error")}}else{$rootScope.$broadcast("simput-error")}}catch(error){console.log(error.message);$rootScope.$broadcast("simput-error")}};$scope.showErrors=function(event){var errors=$scope.errors;$mdDialog.show({controller:["$scope","$mdDialog",function($scope,$mdDialog){$scope.quit=function(){$mdDialog.cancel()};$scope.errors=errors}],template:templatizer.simput.core.tpls["error-view-dialog"](),targetEvent:event})}}])},{}],8:[function(require,module,exports){angular.module("kitware.SimPut.core").directive("simputInputPanel",function(){return{restrict:"AE",scope:{viewModel:"=",template:"="},controller:"SimPut.InputController",template:templatizer.simput.core.tpls["simput-input"]()}})},{}],9:[function(require,module,exports){angular.module("kitware.SimPut.core").directive("simputInputPropertyPanel",["$templateCache","$compile",function($templateCache,$compile){return{restrict:"AE",scope:{data:"=",property:"=",viewModel:"=",template:"="},controller:["$scope",function($scope){$scope.toggleLocalHelp=function(id){var domElem=document.getElementsByClassName("help-"+id)[0],display=domElem?domElem.style.display:null;if(domElem){if(display==="none"){domElem.style.display=""}else{domElem.style.display="none"}}}}],link:function(scope,element,attrs){var htmlCode=null,templateKey=scope.property.type+"-"+scope.property.size,template=scope.template;if(scope.property.layout){templateKey+="-"+scope.property.layout}if(templatizer.simput.core.tpls.properties[templateKey]){if(scope.data[scope.property.id]===undefined){scope.data[scope.property.id]=template.extractDefault(scope.property,scope.viewModel)}htmlCode=templatizer.simput.core.tpls.properties[templateKey]();if(scope.template.help[scope.property.id]){htmlCode+='<md-card style="display:none;" class="help-content help-'+scope.property.id+'"><md-card-content>'+scope.template.help[scope.property.id]+"</md-card-content></md-card>"}else{console.log("missing help for: "+scope.property.id)}element.replaceWith($compile(htmlCode)(scope));if(scope.template.help[scope.property.id]){document.getElementsByClassName("help-"+scope.property.id)[0].display="none"}}else{element.replaceWith($compile(templatizer.simput.core.tpls.properties["error"]())(scope))}}}}])},{}],10:[function(require,module,exports){angular.module("kitware.SimPut",["ngMaterial","kitware.SimPut.core"])},{}]},{},[1]);
//# sourceMappingURL=dist/js/simput-min.js.map