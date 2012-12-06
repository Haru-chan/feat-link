JIRA.Dropdown=function(){var instances=[];return{addInstance:function(){instances.push(this)},hideInstances:function(){var that=this;jQuery(instances).each(function(){if(that!==this){this.hideDropdown()}})},getHash:function(){if(!this.hash){this.hash={container:this.dropdown,hide:this.hideDropdown,show:this.displayDropdown}}return this.hash},displayDropdown:function(){if(JIRA.Dropdown.current===this){return }this.hideInstances();JIRA.Dropdown.current=this;this.dropdown.css({display:"block"});this.displayed=true;var dd=this.dropdown;if(!window.top.JIRA.Dialog.current){setTimeout(function(){var win=jQuery(window);var minScrollTop=dd.offset().top+dd.attr("offsetHeight")-win.height()+10;if(win.scrollTop()<minScrollTop){jQuery("html,body").animate({scrollTop:minScrollTop},300,"linear")}},100)}},hideDropdown:function(){if(this.displayed===false){return }JIRA.Dropdown.current=null;this.dropdown.css({display:"none"});this.displayed=false},init:function(trigger,dropdown){var that=this;this.addInstance(this);this.dropdown=jQuery(dropdown);this.dropdown.css({display:"none"});jQuery(document).keydown(function(e){if(e.keyCode===9){that.hideDropdown()}});if(trigger.target){jQuery.aop.before(trigger,function(){if(!that.displayed){that.displayDropdown()}})}else{that.dropdown.css("top",jQuery(trigger).outerHeight()+"px");trigger.click(function(e){if(!that.displayed){that.displayDropdown();e.stopPropagation()}else{that.hideDropdown()}e.preventDefault()})}jQuery(document.body).click(function(){if(that.displayed){that.hideDropdown()}})}}}();JIRA.Dropdown.Standard=function(trigger,dropdown){var that=begetObject(JIRA.Dropdown);that.init(trigger,dropdown);return that};JIRA.Dropdown.AutoComplete=function(trigger,dropdown){var that=begetObject(JIRA.Dropdown);that.init=function(trigger,dropdown){this.addInstance(this);this.dropdown=jQuery(dropdown).click(function(e){e.stopPropagation()});this.dropdown.css({display:"none"});if(trigger.target){jQuery.aop.before(trigger,function(){if(!that.displayed){that.displayDropdown()}})}else{trigger.click(function(e){if(!that.displayed){that.displayDropdown();e.stopPropagation()}})}jQuery(document.body).click(function(){if(that.displayed){that.hideDropdown()}})};that.init(trigger,dropdown);return that};AJS.namespace("jira.widget.dropdown",null,JIRA.Dropdown);