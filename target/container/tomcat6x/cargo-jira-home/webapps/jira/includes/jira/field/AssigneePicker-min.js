JIRA.AssigneePicker=AJS.SingleSelect.extend({init:function(options){var element=options.element;function data(query){return{username:query,projectKeys:AJS.params.projectKeys,issueKey:AJS.params.assigneeEditIssueKey,maxResults:10}}function formatResponse(response){var ret=[];if(response.length){var groupDescriptor=new AJS.GroupDescriptor({weight:1,id:"assignee-group-search",uniqueItemScope:"container",replace:true,label:AJS.I18n.getText("assignee.picker.group.search")});for(var i=0,len=response.length;i<len;i++){var user=response[i];var username=user.name;var displayName=user.displayName;var emailAddress=user.emailAddress;var label=displayName+" - "+emailAddress+" ("+username+")";groupDescriptor.addItem(new AJS.ItemDescriptor({value:username,fieldText:displayName,label:label,allowDuplicate:false,icon:user.avatarUrls["16x16"]}))}ret.push(groupDescriptor)}return ret}AJS.$.extend(options,{showDropdownButton:!!element.attr("data-show-dropdown-button"),errorMessage:AJS.I18n.getText("assignee.picker.invalid.user"),localDataGroupId:"assignee-group-suggested",serverDataGroupId:"assignee-group-search",ajaxOptions:{url:function(){AJS.params.assigneeEditIssueKey=undefined;AJS.populateParameters();var path=AJS.params.assigneeEditIssueKey?"search":"multiProjectSearch";return contextPath+"/rest/api/latest/user/assignable/"+path},query:true,minQueryLength:1,noQueryNoRequest:true,data:data,formatResponse:formatResponse}});this._super(options)},getAjaxOptions:function(){var ajaxOptions=this._super();if(typeof ajaxOptions.url==="function"){this.options.ajaxOptions.url=ajaxOptions.url();ajaxOptions.url=this.options.ajaxOptions.url}return ajaxOptions},handleFreeInput:function(){var value=AJS.$.trim(this.$field.val());if(!value&&this.$container.hasClass("aui-ss-editing")){value="-1";this.$field.val(value)}this._super(value)},cleanUpModel:function(){}});