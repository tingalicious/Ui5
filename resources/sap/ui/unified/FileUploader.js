/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Control','./library','sap/ui/core/LabelEnablement','sap/ui/core/library','sap/ui/Device','jquery.sap.keycodes'],function(q,C,a,L,c,D){"use strict";var V=c.ValueState;var F=C.extend("sap.ui.unified.FileUploader",{metadata:{interfaces:["sap.ui.core.IFormContent","sap.ui.unified.IProcessableBlobs"],library:"sap.ui.unified",properties:{value:{type:"string",group:"Data",defaultValue:''},enabled:{type:"boolean",group:"Behavior",defaultValue:true},uploadUrl:{type:"sap.ui.core.URI",group:"Data",defaultValue:''},name:{type:"string",group:"Data",defaultValue:null},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:''},uploadOnChange:{type:"boolean",group:"Behavior",defaultValue:false},additionalData:{type:"string",group:"Data",defaultValue:null},sameFilenameAllowed:{type:"boolean",group:"Behavior",defaultValue:false},buttonText:{type:"string",group:"Misc",defaultValue:null},fileType:{type:"string[]",group:"Data",defaultValue:null},multiple:{type:"boolean",group:"Behavior",defaultValue:false},maximumFileSize:{type:"float",group:"Data",defaultValue:null},mimeType:{type:"string[]",group:"Data",defaultValue:null},sendXHR:{type:"boolean",group:"Behavior",defaultValue:false},placeholder:{type:"string",group:"Appearance",defaultValue:null},style:{type:"string",group:"Appearance",defaultValue:null},buttonOnly:{type:"boolean",group:"Appearance",defaultValue:false},useMultipart:{type:"boolean",group:"Behavior",defaultValue:true},maximumFilenameLength:{type:"int",group:"Data",defaultValue:null},valueState:{type:"sap.ui.core.ValueState",group:"Data",defaultValue:V.None},valueStateText:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:''},iconHovered:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:''},iconSelected:{type:"sap.ui.core.URI",group:"Appearance",defaultValue:''},iconFirst:{type:"boolean",group:"Appearance",defaultValue:true},iconOnly:{type:"boolean",group:"Appearance",defaultValue:false}},aggregations:{parameters:{type:"sap.ui.unified.FileUploaderParameter",multiple:true,singularName:"parameter"},headerParameters:{type:"sap.ui.unified.FileUploaderParameter",multiple:true,singularName:"headerParameter"},xhrSettings:{type:"sap.ui.unified.FileUploaderXHRSettings",multiple:false}},events:{change:{parameters:{newValue:{type:"string"},files:{type:"object[]"}}},uploadComplete:{parameters:{fileName:{type:"string"},response:{type:"string"},readyStateXHR:{type:"string"},status:{type:"string"},responseRaw:{type:"string"},headers:{type:"object"},requestHeaders:{type:"object[]"}}},typeMissmatch:{parameters:{fileName:{type:"string"},fileType:{type:"string"},mimeType:{type:"string"}}},fileSizeExceed:{parameters:{fileName:{type:"string"},fileSize:{type:"string"}}},fileAllowed:{},uploadProgress:{parameters:{lengthComputable:{type:"boolean"},loaded:{type:"float"},total:{type:"float"},fileName:{type:"string"},requestHeaders:{type:"object[]"}}},uploadAborted:{parameters:{fileName:{type:"string"},requestHeaders:{type:"object[]"}}},filenameLengthExceed:{parameters:{fileName:{type:"string"}}},uploadStart:{parameters:{fileName:{type:"string"},requestHeaders:{type:"object[]"}}}}}});F.prototype.init=function(){this.oFilePath=a.FileUploaderHelper.createTextField(this.getId()+"-fu_input");this.oBrowse=a.FileUploaderHelper.createButton();this.oFilePath.setParent(this);this.oBrowse.setParent(this);this.oFileUpload=null;this.bMobileLib=this.oBrowse.getMetadata().getName()=="sap.m.Button";if(!this.getIconOnly()){this.oBrowse.setText(this.getBrowseText());}else{this.oBrowse.setTooltip(this.getBrowseText());}if(sap.ui.getCore().getConfiguration().getAccessibility()){if(!F.prototype._sAccText){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");F.prototype._sAccText=r.getText("FILEUPLOAD_ACC");}if(this.oBrowse.addAriaDescribedBy){this.oBrowse.addAriaDescribedBy(this.getId()+"-AccDescr");}}};F.prototype.setButtonText=function(t){this.setProperty("buttonText",t,false);if(!this.getIconOnly()){this.oBrowse.setText(t||this.getBrowseText());}else{this.oBrowse.setTooltip(t||this.getBrowseText());}return this;};F.prototype.setIcon=function(i){this.oBrowse.setIcon(i);this.setProperty("icon",i,false);return this;};F.prototype.setIconHovered=function(i){this.setProperty("iconHovered",i,false);if(this.oBrowse.setIconHovered){this.oBrowse.setIconHovered(i);}return this;};F.prototype.setIconSelected=function(i){this.setProperty("iconSelected",i,false);if(this.oBrowse.setIconSelected){this.oBrowse.setIconSelected(i);}else{this.oBrowse.setActiveIcon(i);}return this;};F.prototype.setIconFirst=function(i){this.oBrowse.setIconFirst(i);this.setProperty("iconFirst",i,false);return this;};F.prototype.setIconOnly=function(i){this.setProperty("iconOnly",i,false);if(i){this.oBrowse.setText("");this.oBrowse.setTooltip(this.getButtonText()||this.getBrowseText());}else{this.oBrowse.setText(this.getButtonText()||this.getBrowseText());this.oBrowse.setTooltip("");}return this;};F.prototype.getIdForLabel=function(){return this.oBrowse.getId();};F.prototype.setFileType=function(t){var T=this._convertTypesToArray(t);this.setProperty("fileType",T,false);return this;};F.prototype.setMimeType=function(t){var T=this._convertTypesToArray(t);this.setProperty("mimeType",T,false);return this;};F.prototype.setTooltip=function(t){this._refreshTooltipBaseDelegate(t);this.setAggregation("tooltip",t,true);if(this.oFileUpload){if(typeof t==="string"){q(this.oFileUpload).attr("title",q.sap.encodeHTML(t));this.$().find(".sapUiFupInputMask").attr("title",q.sap.encodeHTML(t));}}return this;};F.prototype.setXhrSettings=function(x){this.setAggregation("xhrSettings",x,true);return this;};F.prototype._convertTypesToArray=function(t){if(typeof t==="string"){if(t===""){return[];}else{return t.split(",").map(function(T){return T.trim();});}}return t;};F.prototype.exit=function(){this.oFilePath.destroy();this.oBrowse.destroy();if(this.oIFrameRef){q(this.oIFrameRef).unbind();sap.ui.getCore().getStaticAreaRef().removeChild(this.oIFrameRef);this.oIFrameRef=null;}};F.prototype.onBeforeRendering=function(){var s=sap.ui.getCore().getStaticAreaRef();q(this.oFileUpload).appendTo(s);q(this.oFileUpload).unbind();};F.prototype.onAfterRendering=function(){this.prepareFileUploadAndIFrame();this._cacheDOMEls();this._addLabelFeaturesToBrowse();q(this.oFileUpload).change(q.proxy(this.handlechange,this));if(!this.bMobileLib){this.oFilePath.$().attr("tabindex","-1");}else{this.oFilePath.$().find('input').attr("tabindex","-1");}if((!!D.browser.internet_explorer&&D.browser.version==9)){this.oBrowse.$().attr("tabindex","-1");}if(L.isRequired(this)){this.oBrowse.$().attr("aria-required","true");}q.sap.delayedCall(0,this,this._recalculateWidth);this.oFilePath.$().find('input').removeAttr("role").attr("aria-live","polite");if(this.getValueState()==V.Error){this.oBrowse.$().attr("aria-invalid","true");}};F.prototype._cacheDOMEls=function(){this.FUEl=this.getDomRef("fu");this.FUDataEl=this.getDomRef("fu_data");};F.prototype.onfocusin=function(e){if(!this.oFilePath.shouldValueStateMessageBeOpened||this.oFilePath.shouldValueStateMessageBeOpened()){this.openValueStateMessage();}};F.prototype.onsapfocusleave=function(e){if(!e.relatedControlId||!q.sap.containsOrEquals(this.getDomRef(),sap.ui.getCore().byId(e.relatedControlId).getFocusDomRef())){this.closeValueStateMessage();}};F.prototype._recalculateWidth=function(){if(this.getWidth()){if(this.getButtonOnly()&&this.oBrowse.getDomRef()){this.oBrowse.getDomRef().style.width=this.getWidth();}this._resizeDomElements();}};F.prototype.getFocusDomRef=function(){return this.$("fu").get(0);};F.prototype._resizeDomElements=function(){var i=this.getId();this._oBrowseDomRef=this.oBrowse.getDomRef();var $=q(this._oBrowseDomRef);var _=$.parent().outerWidth(true);this._oFilePathDomRef=this.oFilePath.getDomRef();var d=this._oFilePathDomRef;var w=this.getWidth();if(w.substr(-1)=="%"&&d){while(d.id!=i){d.style.width="100%";d=d.parentNode;}d.style.width=w;}else{if(d){d.style.width=w;var b=q(this._oFilePathDomRef);var e=b.outerWidth()-_;if(e<0){this.oFilePath.getDomRef().style.width="0px";if(!D.browser.internet_explorer){this.oFileUpload.style.width=$.outerWidth(true);}}else{this.oFilePath.getDomRef().style.width=e+"px";}}}};F.prototype.onresize=function(){this._recalculateWidth();};F.prototype.onThemeChanged=function(){this._recalculateWidth();};F.prototype.setEnabled=function(e){var $=q(this.oFileUpload);this.setProperty("enabled",e,true);this.oFilePath.setEnabled(e);this.oBrowse.setEnabled(e);e?$.removeAttr('disabled'):$.attr('disabled','disabled');this.$().toggleClass("sapUiFupDisabled",!e);return this;};F.prototype.setValueState=function(v){this.setProperty("valueState",v,true);if(this.oFilePath.setValueState){this.oFilePath.setValueState(v);}else{q.sap.log.warning("Setting the valueState property with the combination of libraries used is not supported.",this);}if(this.oBrowse.getDomRef()){if(v==V.Error){this.oBrowse.$().attr("aria-invalid","true");}else{this.oBrowse.$().removeAttr("aria-invalid");}}if(q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){switch(v){case V.Error:case V.Warning:case V.Success:this.openValueStateMessage();break;default:this.closeValueStateMessage();}}return this;};F.prototype.setValueStateText=function(v){if(this.oFilePath.setValueStateText){this.oFilePath.setValueStateText(v);}else{q.sap.log.warning("Setting the valueStateText property with the combination of libraries used is not supported.",this);}return this.setProperty("valueStateText",v,true);};F.prototype.setUploadUrl=function(v,f){this.setProperty("uploadUrl",v,true);var $=this.$("fu_form");$.attr("action",this.getUploadUrl());return this;};F.prototype.setPlaceholder=function(p){this.setProperty("placeholder",p,true);this.oFilePath.setPlaceholder(p);return this;};F.prototype.setStyle=function(s){this.setProperty("style",s,true);if(s){if(s=="Transparent"){if(this.oBrowse.setLite){this.oBrowse.setLite(true);}else{this.oBrowse.setType("Transparent");}}else{if(this.oBrowse.setType){this.oBrowse.setType(s);}else{if(s=="Emphasized"){s="Emph";}this.oBrowse.setStyle(s);}}}return this;};F.prototype.setValue=function(v,f,s){var o=this.getValue();var b;if((o!=v)||this.getSameFilenameAllowed()){var u=this.getUploadOnChange()&&v;this.setProperty("value",v,u);if(this.oFilePath){this.oFilePath.setValue(v);if(this.oBrowse.getDomRef()&&!s&&q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){this.oBrowse.focus();}}var d=this.getDomRef("fu_form"),e=this.getDomRef("fu_input-inner");if(this.oFileUpload&&d&&!v){d.reset();this.getDomRef("fu_input").value="";if(e){e.value="";}q(this.FUDataEl).val(this.getAdditionalData());}if(f){if(window.File){b=this.FUEl.files;}if(!this.getSameFilenameAllowed()||v){this.fireChange({id:this.getId(),newValue:v,files:b});}}if(u){this.upload();}}return this;};F.prototype.clear=function(){var u=this.getDomRef("fu_form");if(u){u.reset();}return this.setValue("",false,true);};F.prototype.onmousedown=function(e){if(!this.bMobileLib){this.oBrowse.onmousedown(e);}};F.prototype.onmouseup=function(e){if(!this.bMobileLib){this.oBrowse.onmouseup(e);}};F.prototype.onmouseover=function(e){if(!this.bMobileLib){q(this.oBrowse.getDomRef()).addClass('sapUiBtnStdHover');this.oBrowse.onmouseover(e);}};F.prototype.onmouseout=function(e){if(!this.bMobileLib){q(this.oBrowse.getDomRef()).removeClass('sapUiBtnStdHover');this.oBrowse.onmouseout(e);}};F.prototype.setAdditionalData=function(A){this.setProperty("additionalData",A,true);var o=this.FUDataEl;if(o){A=this.getAdditionalData()||"";o.value=A;}return this;};F.prototype.sendFiles=function(x,I){var t=this;var A=true;for(var i=0;i<x.length;i++){if(!x[i].bPosted){A=false;break;}}if(A){if(this.getSameFilenameAllowed()&&this.getUploadOnChange()){t.setValue("",true);}return;}var X=x[I];var f=X.file.name?X.file.name:"MultipartFile";if((D.browser.edge||D.browser.internet_explorer)&&X.file.type&&X.xhr.readyState==1){var s=X.file.type;X.xhr.setRequestHeader("Content-Type",s);X.requestHeaders.push({name:"Content-Type",value:s});}var r=X.requestHeaders;var p=function(P){var o={lengthComputable:!!P.lengthComputable,loaded:P.loaded,total:P.total};t.fireUploadProgress({"lengthComputable":o.lengthComputable,"loaded":o.loaded,"total":o.total,"fileName":f,"requestHeaders":r});};X.xhr.upload.addEventListener("progress",p);X.xhr.onreadystatechange=function(){var R;var b;var h={};var P;var H;var d;var e;e=X.xhr.readyState;var S=X.xhr.status;if(X.xhr.readyState==4){if(X.xhr.responseXML){R=X.xhr.responseXML.documentElement.textContent;}b=X.xhr.response;P=X.xhr.getAllResponseHeaders();if(P){H=P.split("\u000d\u000a");for(var i=0;i<H.length;i++){if(H[i]){d=H[i].indexOf("\u003a\u0020");h[H[i].substring(0,d)]=H[i].substring(d+2);}}}t.fireUploadComplete({"fileName":f,"headers":h,"response":R,"responseRaw":b,"readyStateXHR":e,"status":S,"requestHeaders":r});}t._bUploading=false;};if(X.xhr.readyState===0||X.bPosted){I++;t.sendFiles(x,I);}else{X.xhr.send(X.file);X.bPosted=true;I++;t.sendFiles(x,I);}};F.prototype.upload=function(p){if(!this.getEnabled()){return;}var u=this.getDomRef("fu_form");try{this._bUploading=true;if(this.getSendXHR()&&window.File){var f=this.FUEl.files;if(p){this._sendProcessedFilesWithXHR(f);}else{this._sendFilesWithXHR(f);}}else if(u){u.submit();this._resetValueAfterUploadStart();}}catch(e){q.sap.log.error("File upload failed:\n"+e.message);}};F.prototype.abort=function(h,v){if(!this.getUseMultipart()){var s=this._aXhr.length-1;for(var i=s;i>-1;i--){if(h&&v){for(var j=0;j<this._aXhr[i].requestHeaders.length;j++){var H=this._aXhr[i].requestHeaders[j].name;var b=this._aXhr[i].requestHeaders[j].value;if(H==h&&b==v){this._aXhr[i].xhr.abort();this.fireUploadAborted({"fileName":this._aXhr[i].fileName,"requestHeaders":this._aXhr[i].requestHeaders});this._aXhr.splice(i,1);q.sap.log.info("File upload aborted.");break;}}}else{this._aXhr[i].xhr.abort();this.fireUploadAborted({"fileName":this._aXhr[i].fileName,"requestHeaders":this._aXhr[i].requestHeaders});this._aXhr.splice(i,1);q.sap.log.info("File upload aborted.");}}}else if(this._uploadXHR&&this._uploadXHR.abort){this._uploadXHR.abort();this.fireUploadAborted({"fileName":null,"requestHeaders":null});q.sap.log.info("File upload aborted.");}};F.prototype.onkeypress=function(e){this.onkeydown(e);};F.prototype.onclick=function(e){if(this.getSameFilenameAllowed()&&this.getEnabled()){this.setValue("",true);}if(this.oBrowse.getDomRef()&&q.sap.containsOrEquals(this.getDomRef(),document.activeElement)){this.oBrowse.focus();}};F.prototype.onkeydown=function(e){if(!this.getEnabled()){return;}if(this.getSameFilenameAllowed()&&this.getUploadOnChange()){this.setValue("",true);}var k=e.keyCode,b=q.sap.KeyCodes;if(k==b.DELETE||k==b.BACKSPACE){if(this.oFileUpload){this.setValue("",true);}}else if(k==b.SPACE||k==b.ENTER){if(!(!!D.browser.internet_explorer&&D.browser.version<=9)&&this.oFileUpload){this.oFileUpload.click();e.preventDefault();e.stopPropagation();}}else if(k!=b.TAB&&k!=b.SHIFT&&k!=b.F6&&k!=b.PAGE_UP&&k!=b.PAGE_DOWN&&k!=b.END&&k!=b.HOME&&k!=b.ARROW_LEFT&&k!=b.ARROW_UP&&k!=b.ARROW_RIGHT&&k!=b.ARROW_DOWN){e.preventDefault();e.stopPropagation();}};F.prototype._isFilenameTooLong=function(f){var m=this.getMaximumFilenameLength();if(m!==0&&f.length>m){q.sap.log.info("The filename of "+f+" ("+f.length+" characters)  is longer than the maximum of "+m+" characters.");return true;}return false;};F.prototype.handlechange=function(e){if(this.oFileUpload&&this.getEnabled()){var f=this.getFileType();var s='';var w,n,i,b;var u=this.getDomRef("fu_form");if(window.File){var d=e.target.files;if(this._areFilesAllowed(d)){this.fireFileAllowed();s=this._generateInputValue(d);}else{u.reset();this.setValue("",true,true);return;}}else if(f&&f.length>0){w=true;n=this.oFileUpload.value||"";i=n.lastIndexOf(".");b=n.substring(i+1);for(var l=0;l<f.length;l++){if(b==f[l]){w=false;}}if(w){q.sap.log.info("File: "+n+" is of type "+b+". Allowed types are: "+f+".");this.fireTypeMissmatch({fileName:n,fileType:b});u.reset();this.setValue("",true,true);return;}if(this._isFilenameTooLong(n)){this.fireFilenameLengthExceed({fileName:n});u.reset();this.setValue("",true,true);return;}if(n){this.fireFileAllowed();}}var v=this.oFileUpload.value||"";var I=v.lastIndexOf("\\");if(I>=0){v=v.substring(I+1);}if(this.getMultiple()){if(!(D.browser.internet_explorer&&D.browser.version<=9)){v=s;}}if(v||D.browser.chrome){this.setValue(v,true);}}};F.prototype._sendFilesWithXHR=function(f){var b,h,v,x,X=this.getXhrSettings();if(f.length>0){if(this.getUseMultipart()){b=1;}else{b=f.length;}this._aXhr=this._aXhr||[];for(var j=0;j<b;j++){this._uploadXHR=new window.XMLHttpRequest();x={xhr:this._uploadXHR,requestHeaders:[]};this._aXhr.push(x);x.xhr.open("POST",this.getUploadUrl(),true);if(X){x.xhr.withCredentials=X.getWithCredentials();}if(this.getHeaderParameters()){var H=this.getHeaderParameters();for(var i=0;i<H.length;i++){h=H[i].getName();v=H[i].getValue();x.requestHeaders.push({name:h,value:v});}}var s=f[j].name;var r=x.requestHeaders;x.fileName=s;x.file=f[j];this.fireUploadStart({"fileName":s,"requestHeaders":r});for(var k=0;k<r.length;k++){if(x.xhr.readyState===0){break;}h=r[k].name;v=r[k].value;x.xhr.setRequestHeader(h,v);}}if(this.getUseMultipart()){var d=new window.FormData();var n=this.FUEl.name;for(var l=0;l<f.length;l++){d.append(n,f[l],f[l].name);}d.append("_charset_","UTF-8");var e=this.FUDataEl.name;if(this.getAdditionalData()){var g=this.getAdditionalData();d.append(e,g);}else{d.append(e,"");}if(this.getParameters()){var p=this.getParameters();for(var m=0;m<p.length;m++){var N=p[m].getName();v=p[m].getValue();d.append(N,v);}}x.file=d;this.sendFiles(this._aXhr,0);}else{this.sendFiles(this._aXhr,0);}this._bUploading=false;this._resetValueAfterUploadStart();}return this;};F.prototype._sendProcessedFilesWithXHR=function(f){this.getProcessedBlobsFromArray(f).then(function(b){this._sendFilesWithXHR(b);}.bind(this)).catch(function(r){q.sap.log.error("File upload failed: "+r&&r.message?r.message:"no details available");});return this;};F.prototype._areFilesAllowed=function(f){var n,w,I,s,t,m=this.getMaximumFileSize(),M=this.getMimeType(),b=this.getFileType();for(var i=0;i<f.length;i++){n=f[i].name;t=f[i].type;if(!t){t="unknown";}var S=((f[i].size/1024)/1024);if(m&&(S>m)){q.sap.log.info("File: "+n+" is of size "+S+" MB which exceeds the file size limit of "+m+" MB.");this.fireFileSizeExceed({fileName:n,fileSize:S});return false;}if(this._isFilenameTooLong(n)){this.fireFilenameLengthExceed({fileName:n});return false;}if(M&&M.length>0){var W=true;for(var j=0;j<M.length;j++){if(t==M[j]||M[j]=="*/*"||t.match(M[j])){W=false;}}if(W){q.sap.log.info("File: "+n+" is of type "+t+". Allowed types are: "+M+".");this.fireTypeMissmatch({fileName:n,mimeType:t});return false;}}if(b&&b.length>0){w=true;I=n.lastIndexOf(".");s=n.substring(I+1);for(var k=0;k<b.length;k++){if(s.toLowerCase()==b[k].toLowerCase()){w=false;}}if(w){q.sap.log.info("File: "+n+" is of type "+s+". Allowed types are: "+b+".");this.fireTypeMissmatch({fileName:n,fileType:s});return false;}}}return true;};F.prototype._sendFilesFromDragAndDrop=function(f){if(this._areFilesAllowed(f)){this._sendFilesWithXHR(f);}return this;};F.prototype._generateInputValue=function(f){var s="";for(var i=0;i<f.length;i++){s=s+'"'+f[i].name+'" ';}return s;};F.prototype.getBrowseText=function(){if(!F.prototype._sBrowseText){var r=sap.ui.getCore().getLibraryResourceBundle("sap.ui.unified");F.prototype._sBrowseText=r.getText("FILEUPLOAD_BROWSE");}return F.prototype._sBrowseText?F.prototype._sBrowseText:"Browse...";};F.prototype.getShortenValue=function(){return this.getValue();};F.prototype.prepareFileUploadAndIFrame=function(){if(!this.oFileUpload){var f=[];f.push('<input ');f.push('type="file" ');f.push('aria-hidden="true" ');if(this.getName()){if(this.getMultiple()){if(!(D.browser.internet_explorer&&D.browser.version<=9)){f.push('name="'+this.getName()+'[]" ');}}else{f.push('name="'+this.getName()+'" ');}}else{if(this.getMultiple()){if(!(D.browser.internet_explorer&&D.browser.version<=9)){f.push('name="'+this.getId()+'[]" ');}}else{f.push('name="'+this.getId()+'" ');}}f.push('id="'+this.getId()+'-fu" ');if(!(!!D.browser.internet_explorer&&D.browser.version==9)){f.push('tabindex="-1" ');}f.push('size="1" ');if(this.getTooltip_AsString()){f.push('title="'+q.sap.encodeHTML(this.getTooltip_AsString())+'" ');}else if(this.getValue()!==""){f.push('title="'+q.sap.encodeHTML(this.getValue())+'" ');}if(!this.getEnabled()){f.push('disabled="disabled" ');}if(this.getMultiple()){if(!(D.browser.internet_explorer&&D.browser.version<=9)){f.push('multiple ');}}if(this.getMimeType()&&window.File){var m=this.getMimeType();var M=m.join(",");f.push('accept="'+M+'" ');}f.push('>');this.oFileUpload=q(f.join("")).prependTo(this.$().find(".sapUiFupInputMask")).get(0);}else{q(this.oFileUpload).prependTo(this.$().find(".sapUiFupInputMask"));}if(!this.oIFrameRef){var i=document.createElement("iframe");i.style.display="none";i.id=this.sId+"-frame";sap.ui.getCore().getStaticAreaRef().appendChild(i);i.contentWindow.name=this.sId+"-frame";var t=this;this._bUploading=false;q(i).load(function(e){if(t._bUploading){q.sap.log.info("File uploaded to "+t.getUploadUrl());var r;try{r=t.oIFrameRef.contentDocument.body.innerHTML;}catch(b){}t.fireUploadComplete({"response":r});t._bUploading=false;}});this.oIFrameRef=i;}};F.prototype.openValueStateMessage=function(){if(this.oFilePath.openValueStateMessage){this.oFilePath.openValueStateMessage();this.oBrowse.$().addAriaDescribedBy(this.oFilePath.getId()+"-message");}};F.prototype.closeValueStateMessage=function(){if(this.oFilePath.closeValueStateMessage){this.oFilePath.closeValueStateMessage();this.oBrowse.$().removeAriaDescribedBy(this.oFilePath.getId()+"-message");}};F.prototype._resetValueAfterUploadStart=function(){q.sap.log.info("File uploading to "+this.getUploadUrl());if(this.getSameFilenameAllowed()&&this.getUploadOnChange()&&this.getUseMultipart()){this.setValue("",true);}};F.prototype._addLabelFeaturesToBrowse=function(){var $;if(this.oBrowse&&this.oBrowse.$().length){$=this.oBrowse.$();$.attr("type', 'button");$.click(function(e){e.preventDefault();this.ontap();}.bind(this));}};F.prototype.getProcessedBlobsFromArray=function(b){return new Promise(function(r){r(b);});};return F;});
