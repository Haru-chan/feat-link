AJS.Dropdown=AJS.Control.extend({CLASS_SIGNATURE:"AJS_DROPDOWN",init:function(options){var layerProperties,instance=this;if(!(options instanceof AJS.Dropdown.OptionsDescriptor)){this.options=new AJS.Dropdown.OptionsDescriptor(options)}else{this.options=options}layerProperties=this.options.allProperties();if(!layerProperties.offsetTarget){layerProperties.offsetTarget=layerProperties.trigger}this.layerController=new AJS.InlineLayer(this.options.allProperties());this.layerController._validateClickToClose=function(e){if(e.target===this.offsetTarget()[0]){return false}else{if(e.target===this.layer()[0]){return false}else{if(this.offsetTarget().has(e.target).length>0){return false}}}return true};this.listController=this.options.listController();this.listEnabler=function(e){instance.listController._handleKeyEvent(e)};this.layerController.onhide(function(){instance.hide()});this.layerController.contentChange(function(){instance.listController.removeAllItems();instance.layerController.layer().find("div > ul > li:visible:has(a)").each(function(){instance.listController.addItem(new AJS.Dropdown.ListItem({element:this,autoScroll:instance.options.autoScroll()}))});if(instance.options.focusFirstItem()){instance.listController.shiftFocus(0)}else{instance.listController.prepareForInput()}});this.trigger(this.options.trigger());this._applyIdToLayer()},show:function(){var instance=this;this.trigger().addClass(AJS.ACTIVE_CLASS);jQuery(this).trigger("showLayer");this.layerController.show();if(this.options.focusFirstItem()){this.listController.shiftFocus(0)}else{this.listController.prepareForInput()}},hide:function(){jQuery(this).trigger("hideLayer");this.trigger().removeClass(AJS.ACTIVE_CLASS);this.layerController.hide();this.listController.trigger("blur")},toggle:function(){if(this.layerController.isVisible()){this.hide()}else{this.show()}},content:function(content){if(content){this.layerController.content(content)}else{return this.layerController.content()}},trigger:function(trigger){if(trigger){if(this.options.trigger()){this._unassignEvents("trigger",this.options.trigger())}this.options.trigger(AJS.$(trigger));if(!this.layerController.offsetTarget()){this.layerController.offsetTarget(this.options.trigger())}this._assignEvents("trigger",this.options.trigger())}else{return this.options.trigger()}},_applyIdToLayer:function(){if(this.trigger().attr("id")){this.layerController.layer().attr("id",this.trigger().attr("id")+"_drop")}},_events:{trigger:{click:function(e){e.preventDefault();this.toggle()}}}});AJS.Dropdown.TRIGGER_SELECTOR=".aui-dropdown-trigger";AJS.Dropdown.CONTENT_SELECTOR=".aui-dropdown-content";AJS.DropDown=AJS.Dropdown;AJS.Dropdown.create=function(options){var dropdowns=[];if(options.content&&!options.trigger){options.content=AJS.$(options.content);AJS.$.each(options.content,function(){var instanceOptions=AJS.copyObject(options);instanceOptions.content=AJS.$(this);dropdowns.push(new AJS.Dropdown(instanceOptions))})}else{if(!options.content&&options.trigger){options.trigger=AJS.$(options.trigger);AJS.$.each(options.trigger,function(){var instanceOptions=AJS.copyObject(options);instanceOptions.trigger=AJS.$(this);dropdowns.push(new AJS.Dropdown(instanceOptions))})}else{if(options.content&&options.trigger){options.content=AJS.$(options.content);options.trigger=AJS.$(options.trigger);if(options.content.length===options.trigger.length){options.trigger.each(function(i){var instanceOptions=AJS.copyObject(options);instanceOptions.trigger=AJS.$(this);instanceOptions.content=options.content.eq(i);dropdowns.push(new AJS.Dropdown(instanceOptions))})}else{throw new Error("AJS.Dropdown.create: Expected the same number of content elements as trigger elements")}}}}return dropdowns};