JIRA.ToggleBlock=Class.extend({getDefautOptions:function(){return{blockSelector:".twixi-block",triggerSelector:".twixi",eventType:"click",collapsedClass:"collapsed",expandedClass:"expanded",storageCollectionName:"twixi-blocks",autoFocusTrigger:true}},_collapseTwiciBlocksFromStorage:function(){var block,val=localStorage.getItem(this.options.storageCollectionName)||"";val=val.replace(/\./g,"\\.");if(/#\w+/.test(val)){block=AJS.$(val);if(block.is(this.options.blockSelector)){if(!this.isPermlink()){block.removeClass(this.options.expandedClass).addClass(this.options.collapsedClass)}}}return this},_updateTwixiBlockIdInStorage:function(blockId){if(!this.isPermlink()){if(!/#\w+/.test(blockId)){return this}var val=localStorage.getItem(this.options.storageCollectionName)||"",blockLength=(","+val+",").indexOf(","+blockId+",")+1;if(blockLength){if(val.indexOf(","+blockId)+1){val=val.replace(","+blockId,"")}else{val=val.replace(blockId,"")}}else{val=val.length?val+","+blockId:blockId}localStorage.setItem(this.options.storageCollectionName,val)}return this},contract:function(block){block=jQuery(block);if(block.is(this.options.blockSelector)){block.removeClass(this.options.expandedClass).addClass(this.options.collapsedClass);if(this.options.persist!==false){this._updateTwixiBlockIdInStorage("#"+block.attr("id"))}}AJS.$(block).trigger("contractBlock");return this},expand:function(block){block=jQuery(block);if(block.is(this.options.blockSelector)){block.removeClass(this.options.collapsedClass).addClass(this.options.expandedClass);if(this.options.persist!==false){this._updateTwixiBlockIdInStorage("#"+block.attr("id"))}}AJS.$(block).trigger("expandBlock");return this},toggle:function(twikiBlockChild){var block=AJS.$(twikiBlockChild).closest(this.options.blockSelector);if(!block.hasClass(this.options.collapsedClass)){this.contract(block)}else{this.expand(block)}if(this.options.autoFocusTrigger){block.find(this.options.triggerSelector+":visible").focus()}return this},isPermlink:function(){return this.checkIsPermlink(location.href)},checkIsPermlink:function(url){var query=parseUri(url).queryKey;return(query.hasOwnProperty("focusedCommentId")||query.hasOwnProperty("focusedWorklogId"))},addTrigger:function(triggerSelector,eventType){var thisInstance=this,$doc=AJS.$(document),lastMousedown=0;if(triggerSelector){eventType=eventType||"click";if(eventType==="dblclick"){if(document.selection){$doc.delegate(triggerSelector,"dblclick",function(){document.selection.empty()})}else{$doc.delegate(triggerSelector,"mousedown",function(){var now=new Date().getTime(),allowSelection=now-lastMousedown>750;lastMousedown=now;return allowSelection})}}$doc.delegate(triggerSelector,eventType,function(){thisInstance.toggle(this)})}return this},addCallback:function(methodName,callback){jQuery.aop.after({target:this,method:methodName},callback);return this},init:function(options){var thisInstance=this;options=options||{};this.options=jQuery.extend(this.getDefautOptions(),options);AJS.$(document).delegate(this.options.triggerSelector,this.options.eventType,function(e){if(!(thisInstance.options.originalTargetIgnoreSelector&&jQuery(e.originalTarget).is(thisInstance.options.originalTargetIgnoreSelector))){thisInstance.toggle(this);e.preventDefault()}});if(this.options.persist!==false){jQuery(function(){thisInstance._collapseTwiciBlocksFromStorage()})}}});