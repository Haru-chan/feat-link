JIRA.Share={i18n:{}};AJS.namespace("atlassian.jira.share",null,JIRA.Share);JIRA.Share.toggleElements=function(idShow,idHide){var elementHide=document.getElementById(idHide);var elementShow=document.getElementById(idShow);if(elementHide&&elementShow){elementHide.style.display="none";elementShow.style.display=""}};JIRA.Share.i18n.getMessage=function(key){if(this[key]){return this[key]}return"unknown"};JIRA.Share.i18n._formatMessage=function(message,escapeFunc,parameters){var regex,currentValue;for(var i=0;i<parameters.length;i++){currentValue=String(parameters[i]);if(escapeFunc){currentValue=escapeFunc(currentValue)}regex=new RegExp("\\{"+i+"\\}","g");while(message.search(regex)>=0){message=message.replace(regex,currentValue)}}return message};JIRA.Share.i18n.formatMessage=function(message){var parameters=Array.prototype.slice.call(arguments,1);return JIRA.Share.i18n._formatMessage(message,htmlEscape,parameters)};JIRA.Share.i18n.formatMessageUnescaped=function(message){var parameters=Array.prototype.slice.call(arguments,1);return JIRA.Share.i18n._formatMessage(message,null,parameters)};JIRA.Share.EditSharesController=function(submitButtonId){this.shares=new Array();this.displayDiv=document.getElementById("share_display_div");this.emptyDiv=document.getElementById("empty_share");this.shareDiv=document.getElementById("share_div");this.submitButtonId=submitButtonId;this.shareTypes={};this.counter=0;this.singleton=false;this.dirty=false};JIRA.Share.EditSharesController.prototype={registerShareType:function(shareType){if(!shareType||!shareType.type){return }this.shareTypes[String(shareType.type)]=shareType},initialise:function(){var i,shareTypeName,shareType,busy,that=this;for(shareTypeName in this.shareTypes){shareType=this.shareTypes[shareTypeName];jQuery("#share_add_"+shareType.type).click((function(shareTypeRef){return function(e){that.addShareCallback(e,shareTypeRef)}})(shareType));if(shareType.initialise){shareType.initialise(this.setDescription)}}var dataSpan=document.getElementById("shares_data"),shares;try{shares=JSON.parse(dataSpan.firstChild.nodeValue);if(!(shares instanceof Array)){shares=[]}}catch(ignored){shares=[]}for(i=0;i<shares.length;i++){if(shares[i].type!==undefined){shareType=this.shareTypes[shares[i].type];if(shareType){var display=shareType.getDisplayFromPermission(shares[i]);if(display){this.addDisplay(display)}}}}if(this.shares.length==0){var noShares=this.emptyDiv.cloneNode(true);noShares.removeAttribute("id");noShares.style.display="";this.displayDiv.appendChild(noShares)}this.recalculateHiddenValue();busy=document.getElementById("share_busy");if(busy){busy.style.display="none";if(busy.parentNode){busy.parentNode.removeChild(busy)}}this.shareDiv.style.display="";jQuery("#share_type_selector").change(function(e){that.selectShareTypeCallback(e)});var selectList=document.getElementById("share_type_selector"),options=selectList.options;var selectedType=options[selectList.selectedIndex].value;document.getElementById("share_"+selectedType).style.display="";var currentShareType=this.shareTypes[selectedType];this.setDescription(currentShareType.getDisplayDescriptionFromUI());this.setWarning(currentShareType.getDisplayWarning());if(this.submitButtonId){jQuery("#"+this.submitButtonId).click(function(e){that.saveCallback(e)})}},addDisplay:function(shareDisplay){var that=this;if(!shareDisplay){return }var index=this.findShare(shareDisplay.permission);if(index>=0){this.animateShare(index);return }var newCount=this.counter++,newDiv=null;if(shareDisplay.singleton){if(this.shares.length!=0){var isOk=confirm(JIRA.Share.i18n.getMessage("common.sharing.remove.shares"));if(!isOk){return }}newDiv=this.clearDiv()}else{if(this.singleton){newDiv=this.clearDiv()}else{if(this.shares.length==0){newDiv=this.clearDiv()}}}if(!newDiv){newDiv=document.createElement("DIV")}else{while(newDiv.firstChild){newDiv.removeChild(newDiv.firstChild)}}newDiv.className="shareItem";newDiv.id="share_div_"+newCount;var shareDiv=document.createElement("DIV");shareDiv.id="share_div_"+newCount+"_inner";shareDiv.title=shareDisplay.description;var filterIcon=this.cloneImage("share_icon");if(filterIcon){shareDiv.appendChild(filterIcon)}var dataSpan=document.createElement("SPAN");dataSpan.innerHTML=shareDisplay.display;shareDiv.appendChild(dataSpan);var newTrash=this.cloneImage("share_trash");if(newTrash){jQuery(newTrash).click(function(e){that.removeCallback(e,newCount)});shareDiv.appendChild(newTrash)}newDiv.appendChild(shareDiv);this.singleton=shareDisplay.singleton;this.displayDiv.appendChild(newDiv);this.shares.push({id:newCount,permission:shareDisplay.permission});this.recalculateHiddenValue()},cloneImage:function(id){var iconImage=document.getElementById(id);if(iconImage){iconImage=iconImage.cloneNode(true);iconImage.removeAttribute("id");iconImage.style.display=""}return iconImage},findShare:function(sharePermission){for(var i=0;i<this.shares.length;i++){if(sharePermission.equals(this.shares[i].permission)){return this.shares[i].id}}return -1},selectShareTypeCallback:function(){var selectList=document.getElementById("share_type_selector"),options=selectList.options,selectedElement;for(var i=0;i<options.length;i++){var element=document.getElementById("share_"+options[i].value);if(element){if(i==selectList.selectedIndex){selectedElement=element}else{element.style.display="none"}}}selectedElement.style.display="";var selectedType=options[selectList.selectedIndex].value;var currentShareType=this.shareTypes[selectedType];this.setDescription(currentShareType.getDisplayDescriptionFromUI());this.setWarning(currentShareType.getDisplayWarning());this.dirty=true},saveCallback:function(e){if(this.dirty){var currentShareType=this.getCurrentShareType();if(currentShareType){var display=currentShareType.getDisplayFromUI();if(display&&display.permission&&this.findShare(display.permission)<0){if(!confirm(JIRA.Share.i18n.getMessage("common.sharing.dirty.warning"))){e.preventDefault()}}}}},addShareCallback:function(ignoredEvent,shareType){this.addDisplay(shareType.getDisplayFromUI())},removeCallback:function(event,id){this.remove(id)},remove:function(id){for(var i=0;i<this.shares.length;i++){if(this.shares[i].id==id){this.shares.splice(i,1);break}}var removeDiv=document.getElementById("share_div_"+id);if(this.shares.length>=1){this.displayDiv.removeChild(removeDiv)}else{removeDiv.innerHTML=this.emptyDiv.innerHTML;removeDiv.className=this.emptyDiv.className;removeDiv.removeAttribute("id")}this.recalculateHiddenValue()},clearDiv:function(){this.shares=new Array();var returnValue=null;while(!returnValue&&this.displayDiv.firstChild){if(this.displayDiv.firstChild.nodeName.toLowerCase()=="div"){returnValue=this.displayDiv.firstChild}else{this.displayDiv.removeChild(this.displayDiv.firstChild)}}if(returnValue){while(returnValue.nextSibling){this.displayDiv.removeChild(returnValue.nextSibling)}}return returnValue},setDescription:function(description){var descriptionDiv=document.getElementById("share_type_description");if(descriptionDiv){descriptionDiv.innerHTML=description}},setWarning:function(warning){var warningDiv=document.getElementById("share_warning");if(warningDiv){if(warning.length>0){warningDiv.className="filter-share-warning aui-message warning";warningDiv.innerHTML=warning}else{warningDiv.className="";warningDiv.innerHTML=""}}},recalculateHiddenValue:function(){var hidden=document.getElementById("share_type_hidden");if(hidden){var valueArray=new Array();for(var i=0;i<this.shares.length;i++){valueArray.push(this.shares[i].permission)}hidden.value=JSON.stringify(valueArray)}},animateShare:function(index){var div=document.getElementById("share_div_"+index+"_inner");if(div){var currentElement=div.parentNode;var bgColor=null;while(!bgColor&&currentElement&&currentElement!=document.body.parentNode){if(currentElement.style){bgColor=currentElement.style.backgroundColor}if(!bgColor&&currentElement.bgColor){bgColor=currentElement.bgColor}currentElement=currentElement.parentNode}if(!bgColor){bgColor="#FFFFFF"}if(!jQuery(div).hasClass("fading")){jQuery(div).addClass("fading");jQuery(div).css({backgroundColor:"#FFCCCC"}).animate({backgroundColor:"#FFFFFF"},2000,function(){jQuery(div).removeClass("fading")})}}},getCurrentShareType:function(){var selectList=document.getElementById("share_type_selector");if(selectList){return this.shareTypes[selectList.options[selectList.selectedIndex].value]}else{return null}}};JIRA.Share.SelectSingleShareTypeController=function(){this.shares=new Array();this.shareTypes={};this.singleton=false};JIRA.Share.SelectSingleShareTypeController.prototype={registerShareType:function(shareType){if(!shareType||!shareType.type){return }this.shareTypes[String(shareType.type)]=shareType},initialise:function(){var shareTypeName,shareType,that=this;for(shareTypeName in this.shareTypes){shareType=this.shareTypes[shareTypeName];if(shareType.initialise){shareType.initialise(this.setDescription)}}var dataSpan=document.getElementById("shares_data"),shares;try{var dataStr=dataSpan.firstChild.nodeValue;shares=JSON.parse(dataStr);if(!(shares instanceof Array)){shares=[]}}catch(ex){shares=[]}var type=null;var sharePermission=null;if(shares.length==0){type="any";shareType=this.shareTypes[type];sharePermission=null}else{type=shares[0].type;shareType=this.shareTypes[type];sharePermission=shares[0]}if(shareType.updateSelectionFromPermission){shareType.updateSelectionFromPermission(sharePermission)}var selectList=document.getElementById("share_type_selector");if(selectList){this.updateShareTypeSelectorList(selectList,type);this.setDescription(shareType.getDisplayDescriptionFromUI());jQuery(selectList).change(function(e){that.selectShareTypeCallback(e)})}var node=document.getElementById("share_busy");if(node){node.style.display="none";if(node.parentNode){node.parentNode.removeChild(node)}}node=document.getElementById("share_div");if(node){node.style.display=""}},updateShareTypeSelectorList:function(selectBox,selectedShareType){var options=selectBox.options;var selectedIndex=0;for(var i=0;i<options.length;i++){var optVal=options[i].value;if(optVal==selectedShareType){selectedIndex=i}document.getElementById("share_"+optVal).style.display="none"}options[selectedIndex].selected=true;var childSelectBox=document.getElementById("share_"+options[selectedIndex].value);if(childSelectBox){childSelectBox.style.display=""}},selectShareTypeCallback:function(){var selectList=document.getElementById("share_type_selector"),options=selectList.options,selectedElement;for(var i=0;i<options.length;i++){var element=document.getElementById("share_"+options[i].value);if(element){if(i==selectList.selectedIndex){selectedElement=element}else{element.style.display="none"}}}selectedElement.style.display="";var selectedType=options[selectList.selectedIndex].value;var ShareType=this.shareTypes[selectedType];this.setDescription(ShareType.getDisplayDescriptionFromUI())},setDescription:function(description){var descriptionDiv=document.getElementById("share_type_description");if(descriptionDiv){descriptionDiv.innerHTML=description}},setWarning:function(warning){var warningDiv=document.getElementById("share_warning");if(warningDiv){if(warning.length>0){warningDiv.className="aui-message warning";warningDiv.innerHTML=warning}else{warningDiv.className="";warningDiv.innerHTML=""}}}};JIRA.Share.GlobalShare=function(){this.type="global";this.singleton=true};JIRA.Share.GlobalShare.prototype={getDisplayFromUI:function(){var newPermission=new JIRA.Share.SharePermission(this.type,null,null);var inner=JIRA.Share.i18n.getMessage("share_global_display");return new JIRA.Share.Display(inner,this.getDisplayDescriptionFromUI(),this.singleton,newPermission)},getDisplayDescriptionFromUI:function(){return JIRA.Share.i18n.getMessage("share_global_description")},getDisplayFromPermission:function(permission){if(!permission||permission.type!=this.type){return null}var newPermission=new JIRA.Share.SharePermission(this.type,null,null);var inner=JIRA.Share.i18n.getMessage("share_global_display");return new JIRA.Share.Display(inner,this.getDisplayDescriptionFromUI(),this.singleton,newPermission)},getDisplayWarning:function(){return atlassian.jira.share.i18n.getMessage("share_global_warning")}};JIRA.Share.GroupShare=function(){this.type="group";this.singleton=false};JIRA.Share.GroupShare.prototype={initialise:function(setDescription){var that=this;this.setDescription=setDescription;this.groupSelect=document.getElementById("groupShare");if(this.groupSelect){jQuery(this.groupSelect).change(function(e){that.groupChangeCallback(e)})}},getDisplayFromUI:function(){if(!this.groupSelect){return }var value=this.groupSelect.options[this.groupSelect.selectedIndex].value;var newPermission=new JIRA.Share.SharePermission(this.type,value,null);return new JIRA.Share.Display(this.getDisplayString(value),this.getDescriptionString(value,true),this.singleton,newPermission)},getDisplayDescriptionFromUI:function(){if(!this.groupSelect){return }var group=this.groupSelect.options[this.groupSelect.selectedIndex].value;return this.getDescriptionString(group,false)},getDisplayFromPermission:function(permission){if(!permission||permission.type!=this.type||!permission.param1){return null}var newPermission=new JIRA.Share.SharePermission(this.type,permission.param1,null);return new JIRA.Share.Display(this.getDisplayString(newPermission.param1),this.getDescriptionString(permission.param1,true),this.singleton,newPermission)},getDisplayString:function(group){var inner=JIRA.Share.i18n.getMessage("share_group_display");return JIRA.Share.i18n.formatMessage(inner,group)},getDescriptionString:function(group,unescaped){var inner=JIRA.Share.i18n.getMessage("share_group_description");if(unescaped){return JIRA.Share.i18n.formatMessageUnescaped(inner,group)}else{return JIRA.Share.i18n.formatMessage(inner,group)}},updateSelectionFromPermission:function(sharePermission){if(!this.groupSelect){return }var groupName=sharePermission.param1;var options=this.groupSelect.options;for(var i=0;i<options.length;i++){if(options[i].value==groupName){options[i].selected=true}}},groupChangeCallback:function(){if(this.setDescription){this.setDescription(this.getDisplayDescriptionFromUI())}},getDisplayWarning:function(){return""}};JIRA.Share.ProjectShare=function(){this.roleMap={};this.projectMap={};this.type="project";this.singleton=false};JIRA.Share.ProjectShare.prototype={initialise:function(setDescription){var that=this;this.setDescription=setDescription;this.projectSelect=document.getElementById("projectShare-project");this.roleSelect=document.getElementById("projectShare-role");this.roleSelectGroup=document.getElementById("projectShare-role-group");if(!this.roleSelect||!this.projectSelect||!this.roleSelectGroup){return }var option,i;for(i=1;i<this.roleSelect.options.length;i++){option=this.roleSelect.options[i];this.roleMap[option.value]=option.text}for(i=0;i<this.projectSelect.options.length;i++){option=this.projectSelect.options[i];this.projectMap[option.value]=option.text}this.setRoles();jQuery(this.projectSelect).change(function(e){that.changeCallbackForProject(e)});jQuery(this.roleSelect).change(function(e){that.updateDescription(e)})},getDisplayFromUI:function(){if(!this.projectSelect||!this.roleSelect){return }var selectedProjectOption=this.projectSelect.options[this.projectSelect.selectedIndex];var projectValue=selectedProjectOption.value;var projectDisplay=selectedProjectOption.text;var selectedRoleOption=this.roleSelect.options[this.roleSelect.selectedIndex];var roleValue=selectedRoleOption.value;var roleDisplay=selectedRoleOption.text;var inner;if(roleValue==""){inner=JIRA.Share.i18n.getMessage("share_project_display_all");inner=JIRA.Share.i18n.formatMessage(inner,projectDisplay)}else{inner=JIRA.Share.i18n.getMessage("share_project_display");inner=JIRA.Share.i18n.formatMessage(inner,projectDisplay,roleDisplay)}var newPermission=new JIRA.Share.SharePermission(this.type,projectValue,roleValue);return new JIRA.Share.Display(inner,this.getDescriptionString(projectDisplay,roleValue,roleDisplay,true),this.singleton,newPermission)},getDisplayDescriptionFromUI:function(){if(!this.projectSelect||!this.roleSelect){return }var selectedProjectOption=this.projectSelect.options[this.projectSelect.selectedIndex];var projectDisplay=selectedProjectOption.text;var selectedRoleOption=this.roleSelect.options[this.roleSelect.selectedIndex];var roleValue=selectedRoleOption.value;var roleDisplay=selectedRoleOption.text;return this.getDescriptionString(projectDisplay,roleValue,roleDisplay,false)},getDescriptionString:function(project,roleValue,roleDisplay,unescaped){var inner;if(!roleValue||roleValue==""){roleValue=null;inner=JIRA.Share.i18n.getMessage("share_project_description");if(unescaped){inner=JIRA.Share.i18n.formatMessageUnescaped(inner,project)}else{inner=JIRA.Share.i18n.formatMessage(inner,project)}}else{inner=JIRA.Share.i18n.getMessage("share_role_description");if(unescaped){inner=JIRA.Share.i18n.formatMessageUnescaped(inner,roleDisplay,project)}else{inner=JIRA.Share.i18n.formatMessage(inner,roleDisplay,project)}}return inner},getDisplayFromPermission:function(permission){var inner,newPermission,description,projectName,roleName;if(!permission||permission.type!=this.type||!permission.param1){return null}if(permission.param2){projectName=this.getProject(permission.param1);roleName=this.getRole(permission.param2);inner=JIRA.Share.i18n.getMessage("share_project_display");inner=JIRA.Share.i18n.formatMessage(inner,projectName,roleName);newPermission=new JIRA.Share.SharePermission(this.type,permission.param1,permission.param2);description=this.getDescriptionString(projectName,permission.param2,roleName,true)}else{projectName=this.getProject(permission.param1);inner=JIRA.Share.i18n.getMessage("share_project_display_all");inner=JIRA.Share.i18n.formatMessage(inner,projectName);newPermission=new JIRA.Share.SharePermission(this.type,permission.param1,null);description=this.getDescriptionString(projectName,null,null,true)}return new JIRA.Share.Display(inner,description,this.singleton,newPermission)},getDisplayWarning:function(){return""},changeCallbackForProject:function(){this.setRoles();this.updateDescription()},updateDescription:function(){if(this.setDescription){this.setDescription(this.getDisplayDescriptionFromUI())}},setProject:function(selectedProjectId){if(!this.projectSelect){return }var options=this.projectSelect.options;for(var i=0;i<options.length;i++){if(options[i].value==selectedProjectId){options[i].selected=true}}},setRoles:function(selectedRoleId){if(!this.projectSelect||!this.roleSelect||!this.roleSelectGroup){return }var option=this.projectSelect.options[this.projectSelect.selectedIndex];var roles=option.getAttribute("roles");var rolesArray;if(roles){try{rolesArray=JSON.parse(roles);if(!rolesArray){rolesArray=[]}}catch(ex){rolesArray=[]}}else{rolesArray=[]}if(this.roleSelectGroup.parentNode){this.roleSelect.removeChild(this.roleSelectGroup);this.roleSelectGroup=this.roleSelectGroup.cloneNode(false)}var selOpt=null;if(rolesArray.length>0){for(var i=0;i<rolesArray.length;i++){var newOption=document.createElement("OPTION");newOption.appendChild(document.createTextNode(this.roleMap[rolesArray[i]]));var roleId=rolesArray[i];newOption.value=roleId;if(roleId==selectedRoleId){selOpt=newOption}this.roleSelectGroup.appendChild(newOption)}this.roleSelect.appendChild(this.roleSelectGroup)}if(selOpt){selOpt.selected=true}},getProject:function(id){var project=this.projectMap[id];if(!project){project=JIRA.Share.i18n.getMessage("share_invalid_project");if(!project){project="[Invalid Project]"}}return project},getRole:function(id){var role=this.roleMap[id];if(!role){role=JIRA.Share.i18n.getMessage("share_invalid_role");if(!role){role="[Invalid Role]"}}return role},updateSelectionFromPermission:function(sharePermission){this.setProject(sharePermission.param1);this.setRoles(sharePermission.param2)}};JIRA.Share.AnyShare=function(){this.type="any";this.singleton=true};JIRA.Share.AnyShare.prototype={getDisplayDescriptionFromUI:function(){return JIRA.Share.i18n.getMessage("share_any_description")}};JIRA.Share.Display=function(display,description,singleton,permission){this.display=display;this.singleton=singleton;this.permission=permission;this.description=description};JIRA.Share.SharePermission=function(type,param1,param2){this.type=type;if(param1){this.param1=param1}if(param2){this.param2=param2}};JIRA.Share.SharePermission.prototype.equals=function(otherPermission){return this.type===otherPermission.type&&this.param1===otherPermission.param1&&this.param2===otherPermission.param2};JIRA.Share.registerEditShareTypes=function(submitButtonId){var editController=new JIRA.Share.EditSharesController(submitButtonId);editController.registerShareType(new JIRA.Share.GlobalShare());editController.registerShareType(new JIRA.Share.GroupShare());editController.registerShareType(new JIRA.Share.ProjectShare());jQuery(document).ready(function(){editController.initialise()})};JIRA.Share.registerSelectShareTypes=function(){var selectController=new JIRA.Share.SelectSingleShareTypeController();selectController.registerShareType(new JIRA.Share.AnyShare());selectController.registerShareType(new JIRA.Share.GroupShare());selectController.registerShareType(new JIRA.Share.ProjectShare());jQuery(document).ready(function(){selectController.initialise()})};