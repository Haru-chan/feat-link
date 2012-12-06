JIRA.ViewIssue=(function(){var modules={domReady:function(){headerDropdowns()}};function headerDropdowns(){AJS.Dropdown.create({trigger:AJS.$(".mod-header .aui-dropdown-trigger")})}function setFocusConfiguration(){if(parseUri(window.location.href).anchor!=="summary"){var triggerConfig=new JIRA.setFocus.FocusConfiguration();triggerConfig.excludeParentSelector="#"+FORM_ID+",.dont-default-focus";JIRA.setFocus.pushConfiguration(triggerConfig)}else{AJS.$("#summary").focus()}}function listenForEvents(){var subtaskTrigger;JIRA.bind("QuickCreateSubtask.sessionComplete",function(e,issues){JIRA.Issue.getSubtaskModule().addClass("updating");JIRA.Issue.refreshSubtasks().done(function(){subtaskTrigger=document.getElementById("stqc_show");if(subtaskTrigger){subtaskTrigger.onclick=null}JIRA.Issue.highlightSubtasks(issues);JIRA.Issue.getSubtaskModule().removeClass("updating")})});JIRA.bind("QuickEdit.sessionComplete",function(){JIRA.Issue.reload()})}var FORM_ID="stqcform";var subtasks={domReady:function(){setFocusConfiguration()}};var STALKER_SELECTOR="#stalker.stalker";var stalker={init:function(){new JIRA.OffsetAnchors(STALKER_SELECTOR+", .stalker-placeholder");AJS.$(STALKER_SELECTOR).stalker()}};function setupMouseoverBehaviour(context){if(jQuery.browser.msie&&parseInt(jQuery.browser.version,10)===7){jQuery("a.twixi").bind("focus",function(e){e.preventDefault()})}else{jQuery(document).bind("moveToFinished",function(event,target){jQuery("a.twixi:visible",target).focus()})}}var issueTabs={domReady:function(){JIRA.ViewIssueTabs.onTabReady(setupMouseoverBehaviour);JIRA.ViewIssueTabs.onTabReady(JIRA.userhover);JIRA.ViewIssueTabs.domReady()}};return{init:function(){stalker.init()},domReady:function(){modules.domReady();subtasks.domReady();issueTabs.domReady();listenForEvents()}}})();JIRA.ViewIssue.init();AJS.$(JIRA.ViewIssue.domReady);AJS.namespace("jira.app.viewissue",null,JIRA.ViewIssue);jQuery(function(){var STALKER_COMMENT_SELECTOR="textarea#comment";var FOOTER_COMMENT_SELECTOR="#addcomment textarea";var openInNewWindow=function(e){e.preventDefault();e.stopPropagation();var $this=jQuery(this);jQuery(document).click();new JIRA.ScreenshotDialog({trigger:$this}).openWindow()};var cancelCommentInput=function($commentButton,textAreaSelector){$commentButton.click();setTimeout(function(){AJS.$(textAreaSelector).val("")},100);AJS.$("#comment-preview_link.selected").click()};var preventEscClosingComments=false;jQuery(document).bind("keydown",function(e){if(e.keyCode===jQuery.ui.keyCode.ESCAPE&&AJS.InlineLayer.current){preventEscClosingComments=true;jQuery(document).one("Mention.afterHide",function(e){preventEscClosingComments=false})}if(e.keyCode===jQuery.ui.keyCode.ESCAPE&&!AJS.InlineLayer.current&&!preventEscClosingComments){if(jQuery("#comment-issue.active").length>0){jQuery("#comment-issue.active").click()}}});function setCaretAtEndOfCommentField(){var $field=AJS.$("#comment"),field=$field[0],length;if($field.length){length=$field.val().length;$field.scrollTop($field.attr("scrollHeight"));if(field.setSelectionRange&&length>0){field.setSelectionRange(length,length)}}}AJS.$("#comment-issue").click(function(e){var elem=jQuery(this);if(elem.hasClass("active")){elem.removeClass("active");jQuery("#stalker").removeClass("action");jQuery("form#issue-comment-add").appendTo("#addcomment .mod-content")}else{if(AJS.$("#addcomment").hasClass("active")){AJS.$("#footer-comment-button").click()}elem.addClass("active");jQuery("#stalker").addClass("action");jQuery("form#issue-comment-add").appendTo(".ops-cont");AJS.$("#comment").focus().trigger("keyup");setCaretAtEndOfCommentField()}jQuery("#stalker").trigger("stalkerHeightUpdated");e.preventDefault()});var addCommentContainer=jQuery("#addcomment .mod-content");AJS.$("#footer-comment-button").click(function(e){var elem=jQuery("#addcomment");if(elem.hasClass("active")){elem.removeClass("active")}else{if(AJS.$("#comment-issue").hasClass("active")){AJS.$("#comment-issue").click()}elem.addClass("active");jQuery("form#issue-comment-add").appendTo("#addcomment .mod-content");setTimeout(function(){AJS.$("#comment").trigger("keyup").focus();setCaretAtEndOfCommentField()},0)}e.preventDefault()});jQuery(document).bind("showWikiInput",function(e,previewElem){var $commentField=jQuery("#comment:visible:enabled");jQuery("#stalker").trigger("stalkerHeightUpdated");if($commentField.length>0){$commentField.focus()}return arguments.callee}());jQuery(document).bind("showWikiInput",function(){setCaretAtEndOfCommentField()});jQuery(document).bind("showWikiPreview",function(){jQuery("#stalker").trigger("stalkerHeightUpdated")});jQuery("#issue-comment-add-cancel").click(function(e){var $stalkerCommentButton=AJS.$("#comment-issue"),$footerCommentModule=AJS.$("#addcomment");if($stalkerCommentButton.hasClass("active")){cancelCommentInput($stalkerCommentButton,STALKER_COMMENT_SELECTOR)}else{if($footerCommentModule.hasClass("active")){var $footerCommentButton=AJS.$("#footer-comment-button");cancelCommentInput($footerCommentButton,FOOTER_COMMENT_SELECTOR)}}e.preventDefault()});AJS.$("#issue-comment-add").submit(function(){var $this=AJS.$(this);$this.find("textarea").attr("readonly","readonly");$this.find(":submit").attr("disabled","disabled")});AJS.$("#commentDiv input[type='submit']").click(function(e){if(AJS.$("#comment").val()===""){e.preventDefault();AJS.$("#emptyCommentErrMsg").show()}});AJS.$("#attach-screenshot").click(openInNewWindow);AJS.$("#tt_include_subtasks input").click(function(e){if(AJS.$(this).is(":checked")){AJS.$("#tt_info_single").hide();AJS.$("#tt_info_aggregate").show()}else{AJS.$("#tt_info_aggregate").hide();AJS.$("#tt_info_single").show()}});var toggleVotingAndWatching=function(trigger,className,resultContainer,issueOpTrigger,i18n){var classNameOn=className+"-on",classNameOff=className+"-off",icon=trigger.find(".icon"),restPath="/voters",data,method="POST";if(icon.hasClass(classNameOn)){method="DELETE"}if(className.indexOf("watch")!==-1){restPath="/watchers"}icon.removeClass(classNameOn).removeClass(classNameOff);if(method==="POST"){data={dummy:true}}AJS.$(JIRA.SmartAjax.makeRequest({url:contextPath+"/rest/api/1.0/issues/"+trigger.attr("rel")+restPath,type:method,dataType:"json",data:data,contentType:"application/json",complete:function(xhr,textStatus,smartAjaxResult){if(smartAjaxResult.successful){if(method==="POST"){icon.addClass(classNameOn);trigger.attr("title",i18n.titleOn).find(".action-text").text(i18n.actionTextOn);issueOpTrigger.attr("title",i18n.titleOn).text(i18n.textOn)}else{icon.addClass(classNameOff);trigger.attr("title",i18n.titleOff).find(".action-text").text(i18n.actionTextOff);issueOpTrigger.attr("title",i18n.titleOff).text(i18n.textOff)}resultContainer.text(smartAjaxResult.data.count)}else{alert(JIRA.SmartAjax.buildSimpleErrorContent(smartAjaxResult,{alert:true}));if(method==="POST"){icon.addClass(classNameOff);trigger.attr("title",i18n.titleOff).find(".action-text").text(i18n.actionTextOff);issueOpTrigger.attr("title",i18n.titleOff).text(i18n.textOff)}else{icon.addClass(classNameOn);trigger.attr("title",i18n.titleOn).find(".action-text").text(i18n.actionTextOn);issueOpTrigger.attr("title",i18n.titleOn).text(i18n.textOn)}}}})).throbber({target:icon})};function toggleWatch(){AJS.$("#watching-toggle").click()}AJS.$("#toggle-vote-issue").click(function(e){e.preventDefault();AJS.$("#vote-toggle").click()});AJS.$("#toggle-watch-issue").click(function(e){e.preventDefault();toggleWatch()});var addI18nErrorCodes=function(i18n){AJS.$("input[type=hidden][id|=error]").each(function(index,elem){var i18n_id=elem.id.replace("error-","");i18n[i18n_id]=elem.value})};AJS.$("#vote-toggle").click(function(e){e.preventDefault();var i18n={titleOn:AJS.I18n.getText("issue.operations.simple.voting.alreadyvoted"),titleOff:AJS.I18n.getText("issue.operations.simple.voting.notvoted"),textOn:AJS.I18n.getText("issue.operations.simple.unvote"),textOff:AJS.I18n.getText("issue.operations.simple.vote"),actionTextOff:AJS.I18n.getText("common.concepts.vote"),actionTextOn:AJS.I18n.getText("common.concepts.voted")};addI18nErrorCodes(i18n);toggleVotingAndWatching(AJS.$(this),"icon-vote",AJS.$("#vote-data"),AJS.$("#toggle-vote-issue"),i18n)});AJS.$("#watching-toggle").click(function(e){e.preventDefault();var i18n={titleOn:AJS.I18n.getText("issue.operations.simple.stopwatching"),titleOff:AJS.I18n.getText("issue.operations.simple.startwatching"),textOn:AJS.I18n.getText("issue.operations.unwatch"),textOff:AJS.I18n.getText("issue.operations.watch"),actionTextOff:AJS.I18n.getText("common.concepts.watch"),actionTextOn:AJS.I18n.getText("common.concepts.watching")};addI18nErrorCodes(i18n);toggleVotingAndWatching(AJS.$(this),"icon-watch",AJS.$("#watcher-data"),AJS.$("#toggle-watch-issue"),i18n)});if(AJS.$.browser.mozilla&&AJS.$.browser.version.indexOf("1.9.0")===0){AJS.$("#peoplemodule .shorten").removeClass("shorten")}AJS.$(".shorten").shorten();AJS.moveInProgress=false;AJS.$(document).bind("moveToStarted",function(){AJS.moveInProgress=true}).bind("moveToFinished",function(){AJS.moveInProgress=false});if(parseUri(window.location.href).anchor==="add-comment"){AJS.$("#footer-comment-button").click()}});jQuery(function(){if(jQuery.browser.msie&&jQuery.browser.version<7){return }var initFancyBoxForClass=function(aClassName){var closeFancyBox=function(){jQuery(aClassName).fancybox.close()};var isFireFoxLinux=function(){return jQuery.os.linux&&jQuery.browser.mozilla};var useOverlay=true;if(isFireFoxLinux()){useOverlay=false}var fancyBoxOptions={"imageScale":true,"centerOnScroll":false,"overlayShow":useOverlay,callbackOnStart:function(){jQuery("#header").css("zIndex","-1");if(useOverlay){jQuery("body").addClass("fancybox-show")}},"callbackOnShow":function(){jQuery(document).click(function(){closeFancyBox()})},"onComplete":function(){var title=AJS.$("#fancybox-title");var mainWidth=AJS.$("#fancybox-title-main").outerWidth();var leftWidth=AJS.$("#fancybox-title-left").outerWidth();var rightWidth=AJS.$("#fancybox-title-right").outerWidth();title.width(mainWidth+leftWidth+rightWidth+5);var imageDivWidth=AJS.$("#fancybox-inner").width();title.css("marginLeft",-(title.width()/2)+(imageDivWidth/2));title.css("bottom",title.outerHeight(true)*-1)},"callbackOnClose":function(){jQuery("#header").css("zIndex","");if(useOverlay){jQuery("body").removeClass("fancybox-show")}jQuery(document).unbind("click",closeFancyBox);if(jQuery.browser.safari){var top=AJS.$(window).scrollTop();AJS.$(window).scrollTop(10+5*(top==10)).scrollTop(top)}}};if(AJS.$.browser.msie){fancyBoxOptions.transitionIn="none";fancyBoxOptions.transitionOut="none"}jQuery(aClassName).fancybox(fancyBoxOptions)};initFancyBoxForClass("a.gallery");AJS.$("a.issueaction-viewworkflow").each(function(){AJS.$(this).fancybox({type:"image",href:this.href,title:AJS.escapeHTML(AJS.$(this).attr("rel")),titlePosition:"outside",imageScale:true,centerOnScroll:true,overlayShadow:true})})});jQuery(function(){AJS.$("#customfield-tabs li a").click(function(e){e.preventDefault();var $this=AJS.$(this);var rel=$this.attr("rel");AJS.$("#customfield-tabs li.active").removeClass("active");AJS.$("#tabCell"+rel).addClass("active");AJS.$("#customfieldmodule ul.property-list:not(hidden)").addClass("hidden");AJS.$("#tabCellPane"+rel).removeClass("hidden")})});jQuery(function(){var toggle=new JIRA.ToggleBlock({blockSelector:".toggle-wrap",triggerSelector:".mod-header h3",storageCollectionName:"block-states",originalTargetIgnoreSelector:"a"})});