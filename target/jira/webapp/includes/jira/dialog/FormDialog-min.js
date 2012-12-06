JIRA.FormDialog=JIRA.Dialog.extend({_getDefaultOptions:function(){return AJS.$.extend(this._super(),{autoClose:false,targetUrl:"",handleRedirect:false,onUnSuccessfulSubmit:function(){},onSuccessfulSubmit:function(){},onDialogFinished:function(){var targetUrl=this._getTargetUrlValue();this.hide();if(targetUrl){AJS.$(AJS).trigger("page-unload.location-change.from-dialog",[this.$popup]);window.location.href=targetUrl}else{AJS.$(AJS).trigger("page-unload.refresh.from-dialog",[this.$popup]);AJS.reloadViaWindowLocation(window.location.href)}},submitAjaxOptions:{type:"post",data:{inline:true,decorator:"dialog"},dataType:"html"}})},_getFormDataAsObject:function(){var fieldValues={};AJS.$(this.$form.serializeArray()).each(function(){var fieldVal=fieldValues[this.name];if(!fieldVal){fieldVal=this.value}else{if(AJS.$.isArray(fieldVal)){fieldVal.push(this.value)}else{fieldVal=[fieldVal,this.value]}}fieldValues[this.name]=fieldVal});return fieldValues},_getRelativePath:function(){var ajaxOptions=this._getRequestOptions();return parseUri(ajaxOptions.url).directory},_getPath:function(action){var relPath=this._getRelativePath();if(action.indexOf(relPath)==0){return action}else{return relPath+action}},_submitForm:function(e){this.cancelled=false;this.xhr=null;this.redirected=false;this.serverIsDone=false;var instance=this,defaultRequestOptions=AJS.$.extend(true,{},this.options.submitAjaxOptions),requestOptions=AJS.$.extend(true,defaultRequestOptions,{url:this._getPath(this.$form.attr("action")),data:this._getFormDataAsObject(),complete:function(xhr,textStatus,smartAjaxResult){instance.hideFooterLoadingIndicator();if(!instance.cancelled){if(smartAjaxResult.successful){instance.$form.trigger("fakesubmit");instance._handleServerSuccess(smartAjaxResult.data,xhr,textStatus,smartAjaxResult);if(!instance.redirected){instance._handleSubmitResponse(smartAjaxResult.data,xhr,smartAjaxResult)}}else{instance._handleServerError(xhr,textStatus,smartAjaxResult.errorThrown,smartAjaxResult)}}instance.$form.removeClass("submitting")}});this.showFooterLoadingIndicator();this.xhr=JIRA.SmartAjax.makeRequest(requestOptions);e.preventDefault()},_handleServerError:function(xhr,textStatus,errorThrown,smartAjaxResult){if(this.options.onUnSuccessfulSubmit){this.options.onUnSuccessfulSubmit.call(xhr,textStatus,errorThrown,smartAjaxResult)}var errorContent=JIRA.SmartAjax.buildDialogErrorContent(smartAjaxResult,true);var content$=this.get$popupContent().find(".form-body");if(content$.length!==1){content$=this.get$popupContent()}var insertErrMsg=content$.length==1&&!smartAjaxResult.hasData;if(insertErrMsg){content$.prepend(errorContent)}else{this.setSubmitResponseContent(errorContent)}},setSubmitResponseContent:function(content){if(this.options.formatSubmitResponseContent){content=this.options.formatSubmitResponseContent.call(this,content)}this._setContent(content)},_handleServerSuccess:function(data,xhr,textStatus,smartAjaxResult){var msgInstructions=this._detectMsgInstructions(xhr);if(msgInstructions){JIRA.Messages.showMsgOnReload(msgInstructions.msg,{type:msgInstructions.type,closeable:msgInstructions.closeable,target:msgInstructions.target})}var instructions=this._detectRedirectInstructions(xhr);this.serverIsDone=instructions.serverIsDone;if(instructions.redirectUrl){if(this.options.onSuccessfulSubmit){this.options.onSuccessfulSubmit.call(this,data,xhr,textStatus,smartAjaxResult)}this._performRedirect(instructions.redirectUrl)}else{this.setSubmitResponseContent(data)}},_detectMsgInstructions:function(xhr){var instructions={msg:xhr.getResponseHeader("X-Atlassian-Dialog-Msg-Html")};if(instructions.msg){instructions.type=xhr.getResponseHeader("X-Atlassian-Dialog-Msg-Type").toUpperCase();instructions.closeable=(xhr.getResponseHeader("X-Atlassian-Dialog-Msg-Closeable")==="true");instructions.target=xhr.getResponseHeader("X-Atlassian-Dialog-Msg-Target");return instructions}},_handleInitialDoneResponse:function(data,xhr,smartAjaxResult){this._handleSubmitResponse(data,xhr,smartAjaxResult)},_handleSubmitResponse:function(data,xhr,smartAjaxResult){if(this.serverIsDone){if(this.options.onSuccessfulSubmit){this.options.onSuccessfulSubmit.call(this,data,xhr,smartAjaxResult)}if(this.options.autoClose){this.hide()}if(this.options.onDialogFinished){this.options.onDialogFinished.call(this,data,xhr,smartAjaxResult)}}},_performRedirect:function(url){this.hide();this.redirected=true;this._super(url)},_hasTargetUrl:function(){return this._getTargetUrlHolder().length>0},_getTargetUrlHolder:function(){return AJS.$(this.options.targetUrl)},_getTargetUrlValue:function(){return this._getTargetUrlHolder().val()},decorateContent:function(){var instance=this,$formHeading,$buttons,$cancel,$buttonContainer,$closeLink;this.$form=AJS.$("form",this.get$popupContent());$formHeading=AJS.$(":header:first",this.get$popupContent());if($formHeading.length>0){this.addHeading($formHeading.contents());$formHeading.remove()}this.$form.submit(function(e){if(instance.$form.trigger("before-submit",[e,instance])){instance.$form.addClass("submitting");var submitButtons=AJS.$(":submit",instance.$form);submitButtons.attr("disabled","disabled");if(instance.options.submitHandler){instance.showFooterLoadingIndicator();instance.options.submitHandler.call(instance,e,function(){instance.hideFooterLoadingIndicator();instance.$form.removeClass("submitting")})}else{instance._submitForm(e)}}});$cancel=AJS.$(".cancel",this.get$popupContent());$cancel.click(function(e){if(instance.xhr){instance.xhr.abort()}instance.xhr=null;instance.cancelled=true;instance.hide(true,{reason:JIRA.Dialog.HIDE_REASON.cancel});e.preventDefault()});if(AJS.$.browser.msie){$cancel.focus(function(e){if(e.altKey){$cancel.click()}})}var $popupContent=this.get$popupContent();$buttons=AJS.$(".button",$popupContent);$buttonContainer=AJS.$("div.buttons",$popupContent);if($cancel.length==0&&$buttons.length==0){if($buttonContainer.length==0){$buttonContainer=AJS.$('<div class="buttons-container form-footer"><div class="buttons"/></div>').appendTo($popupContent)}AJS.populateParameters();$closeLink=AJS.$("<a href='#' class='cancel' id='aui-dialog-close'>"+AJS.I18n.getText("admin.common.words.close")+"</a>");AJS.$($popupContent).find(".buttons").append($closeLink);$closeLink=AJS.$(".cancel",this.get$popupContent());$closeLink.click(function(e){instance.hide(true,{reason:JIRA.Dialog.HIDE_REASON.cancel});e.preventDefault()})}$buttonContainer.prepend(AJS.$("<span class='icon throbber'/>"));AJS.$(".shortcut-tip-trigger",$popupContent).click(function(e){e.preventDefault();if(!$popupContent.isDirty()||confirm(AJS.I18n.getText("common.forms.dirty.dialog.message"))){instance.hide();AJS.$("#keyshortscuthelp").click()}})},_setContent:function(content,decorate){this._super(content,decorate);if(content&&JIRA.Dialog.current===this){if(AJS.$.browser.msie){this.$form.bind("keypress",function(e){var $target=AJS.$(e.target);if($target.is(":input")&&!$target.is("textarea")&&e.keyCode===13){AJS.$(this).submit()}})}if(JIRA.Dialog.current===this){this._focusFirstField()}}},_focusFirstField:function(focusElementSelector){var triggerConfig=new JIRA.setFocus.FocusConfiguration();if(focusElementSelector){triggerConfig.focusElementSelector=focusElementSelector}else{if(this.$activeTrigger&&this.$activeTrigger.attr("data-field")){triggerConfig.focusElementSelector="[name='"+this.$activeTrigger.attr("data-field")+"']"}}triggerConfig.context=this.get$popup()[0];if(AJS.$.browser.msie){var $focusHack=AJS.$(".trigger-hack",triggerConfig.context);if($focusHack.length===0){$focusHack=AJS.$("<input Class='trigger-hack' type='text' value=''/>").css({position:"absolute",left:-9000}).appendTo(triggerConfig.context)}$focusHack.focus()}JIRA.setFocus.pushConfiguration(triggerConfig);JIRA.setFocus.triggerFocus();JIRA.setFocus.triggerFocus()},hide:function(undim,options){if(this._super(undim,options)===false){return false}JIRA.setFocus.popConfiguration()}});AJS.namespace("AJS.FormPopup",null,JIRA.FormDialog);