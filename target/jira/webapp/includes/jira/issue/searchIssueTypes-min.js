var lookupTable=new Array();function addEntry(projectId,configId){lookupTable[projectId]=configId}function lookup(projectId){return lookupTable[projectId]}function getInputValues(elem){return getMultiSelectValuesAsArray(elem)}function dynamicMultiIssueTypeSelect(id1,id2){if(document.getElementById&&document.getElementsByTagName){var sel1=document.getElementById(id1);var sel2=document.getElementById(id2);var clone=AJS.$(sel2).clone(true,true);var clonedOptions=clone.find("option");refreshDynamicMultiIssueTypeOptions(sel1,sel2,clonedOptions);sel1.onchange=function(){refreshDynamicMultiIssueTypeOptions(sel1,sel2,clonedOptions);toggleRefresh();scrollToTop(sel2)}}}function scrollToTop(issueTypeSel){if(AJS.$.browser.msie&&AJS.$.browser.version==8){}else{issueTypeSel.scrollTop=0}}var lastArray;function selectOption(option){try{option.selected=true}catch(e){option.setAttribute("selected","true")}}function unselectOption(option){try{option.selected=false}catch(e){option.setAttribute("selected","false")}}function refreshDynamicMultiIssueTypeOptions(sel1,sel2,clonedOptions){var selectedProjects=getInputValues(sel1);var lastSelected=getInputValues(sel2);while(sel2.options.length){sel2.remove(0)}var pattern1=/( |^)(headerOption)( |$)/;for(var i=0;i<clonedOptions.length;i++){if(clonedOptions[i].className.match(pattern1)||matchAnyRegex(clonedOptions[i].className,selectedProjects)){addOption(clonedOptions[i],sel2)}}for(var i=0;i<sel2.options.length;i++){var currentOpt=sel2.options[i];if(arrayContains(lastSelected,currentOpt.value)){selectOption(currentOpt)}else{unselectOption(currentOpt)}}}function matchAnyRegex(s,array){if(array.length==0||(array.length==1&&array[0]=="-1")){return true}for(var i=0;i<array.length;i++){var pattern=new RegExp("( |^)("+lookup(array[i])+")( |$)");if(s.match(pattern)){return true}}return false}function addOption(clonedOption,sel2){if(navigator.userAgent.indexOf("Safari")>=0||navigator.userAgent.indexOf("Konqueror")>0){sel2.appendChild(clonedOption.cloneNode(true))}else{var doc=sel2.ownerDocument;if(!doc){doc=sel2.document}var opt=doc.createElement("OPTION");opt.value=clonedOption.value;opt.text=clonedOption.text;opt.className=clonedOption.className;opt.style.backgroundImage=clonedOption.style.backgroundImage;sel2.options.add(opt,sel2.options.length);if(clonedOption.selected||clonedOption.getAttribute("selected")){opt.selected=true}}};