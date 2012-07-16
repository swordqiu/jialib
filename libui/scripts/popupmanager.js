// a simplified version of step2 popuplib.js
var PopupManager = {
	popup_window:null,
	interval:null,
	conf:null,
	interval_time:100,
	waitForPopupClose: function() {
		if(PopupManager.isPopupClosed()) {
			PopupManager.destroyPopup();
			if(PopupManager.conf != null) {
				redrawPanelContent(PopupManager.conf.name, true, false);
			}else {
				window.location.reload();
			}
			PopupManager.conf = null;
		}
	},
	destroyPopup: function() {
		this.popup_window = null;
		window.clearInterval(this.interval);
		this.interval = null;
		//this.conf = null;
	},
	isPopupClosed: function() {
		//alert(this.popup_window);
		//alert(this.popup_window.closed);
		return (null == this.popup_window || 'boolean' !== typeof(this.popup_window.closed) || this.popup_window.closed);
	},
	open: function(url, width, height, conf) {
		//alert(this.popup_window);
		if(this.popup_window != null) {
			this.popup_window.close();
			this.destroyPopup();
		}
		this.popup_window = window.open(url,"",this.getWindowParams(width,height));
		this.interval = window.setInterval(this.waitForPopupClose, this.interval_time);
		if('undefined' !== typeof(conf)) {
			if('string' === typeof(conf)) {
				this.conf = getContentPanelConf(conf);
			}else {
				this.conf = conf;
			}
		}
		//alert(this.conf);
		
		return this.popup_window;
	},
	getWindowParams: function(width,height) {
		var center = this.getCenterCoords(width,height);
		return "width="+width+",height="+height+",status=0,location=0,resizable=yes,scrollbars=yes,left="+center.x+",top="+center.y;
	},
	getCenterCoords: function(width,height) {
		var parentPos = this.getParentCoords();
		var parentSize = this.getWindowInnerSize();
		
		var xPos = parentPos.width + Math.max(0, Math.floor((parentSize.width - width) / 2));
		var yPos = parentPos.height + Math.max(0, Math.floor((parentSize.height - height) / 2));
		
		return {x:xPos,y:yPos};
	},
	getWindowInnerSize: function() {
		var w = 0;
		var h = 0;
		
		if ('innerWidth' in window) {
			// For non-IE
			w = window.innerWidth;
			h = window.innerHeight;
		} else {
			// For IE
			var elem = null;
			if (('BackCompat' === window.document.compatMode) && ('body' in window.document)) {
				elem = window.document.body;
			} else if ('documentElement' in window.document) {
				elem = window.document.documentElement;
			}
			if (elem !== null) {
				w = elem.offsetWidth;
				h = elem.offsetHeight;
			}
		}
		return {width:w, height:h};
	},
	getParentCoords: function() {
		var w = 0;
		var h = 0;
		
		if ('screenLeft' in window) {
			// IE-compatible variants
			w = window.screenLeft;
			h = window.screenTop;
		} else if ('screenX' in window) {
			// Firefox-compatible
			w = window.screenX;
			h = window.screenY;
	  	}
		return {width:w, height:h};
	}
}
