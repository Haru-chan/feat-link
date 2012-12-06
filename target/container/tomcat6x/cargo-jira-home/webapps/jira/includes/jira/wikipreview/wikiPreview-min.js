JIRA.wikiPreview=function(prefs,ctx){var field,editField,trigger,inPreviewMode=false,origText,setFields=function(){field=AJS.$("#"+prefs.fieldId,ctx),editField=AJS.$("#"+prefs.fieldId+"-wiki-edit",ctx),trigger=AJS.$("#"+prefs.trigger,ctx)},scrollSaver=function(){var elem;return{show:function(){if(!elem){elem=AJS.$("<div>").html("&nbsp;").css({height:"300px"}).insertBefore(editField)}elem.css({display:"block"})},hide:function(){elem.css({display:"none"})}}}(),toggleRenderPreview=function(){if(!inPreviewMode){editField.find(".content-inner").css({maxHeight:field.css("maxHeight")});this.showPreview()}else{editField.find(".content-inner").css({maxHeight:""});this.showInput()}},renderData=function(data){editField.originalHeight=editField.height();scrollSaver.show();editField.addClass("previewClass");origText=field.val();field.hide();trigger.removeClass("loading").addClass("selected");editField.find(".content-inner").html(data);scrollSaver.hide();inPreviewMode=true;AJS.$(document).trigger("showWikiPreview",[editField]);setTimeout(function(){trigger.focus()},0)},handleError=function(previewer){return function(XMLHttpRequest,textStatus,errorThrown){trigger.removeClass("loading");origText=field.val();if(textStatus){alert(textStatus)}if(errorThrown){alert(errorThrown)}previewer.showInput()}};return{showPreview:function(){var that=this;var pid=AJS.$("#pid",ctx).val(),issueType=AJS.$("#issuetype",ctx).val();if(AJS.$.isArray(pid)){pid=pid[0]}if(AJS.$.isArray(issueType)){issueType=issueType[0]}AJS.$("#"+prefs.trigger,ctx).addClass("loading");AJS.$.ajax({url:contextPath+"/rest/api/1.0/render",contentType:"application/json",type:"POST",data:JSON.stringify({rendererType:prefs.rendererType,unrenderedMarkup:field.val(),issueKey:prefs.issueKey,projectId:pid,issueType:issueType}),dataType:"html",success:renderData,error:handleError(that)})},showInput:function(e){if(editField){scrollSaver.show();editField.css({height:""});editField.removeClass("previewClass").find(".content-inner").empty();field=AJS.$("#"+prefs.fieldId,ctx);field.val(origText);field.show();trigger.removeClass("selected");scrollSaver.hide();inPreviewMode=false;AJS.$(document).trigger("showWikiInput",[editField])}},init:function(){var that=this,$trigger;prefs=AJS.$.readData(prefs);$trigger=AJS.$("#"+prefs.trigger,ctx);$trigger.click(function(e){if(!$trigger.hasClass("loading")){setFields();toggleRenderPreview.call(that)}e.preventDefault()})}}};AJS.namespace("jira.app.wikiPreview",null,JIRA.wikiPreview);