if (!Array.prototype.push)
{
    Array.prototype.push = function(elem)
    {
        this[this.length] = elem;
    }
}

var EventManager =
{
    _registry: null,

    Initialise: function()
    {
        if (this._registry == null)
        {
            this._registry = [];

            // Register the cleanup handler on page unload.
            EventManager.Add(window, "unload", this.CleanUp);
        }
    },

    /**
     * Registers an event and handler with the manager.
     *
     * @param  obj         Object handler will be attached to.
     * @param  type        Name of event handler responds to.
     * @param  fn          Handler function.
     * @param  useCapture  Use event capture. False by default.
     *                     If you don't understand this, ignore it.
     *
     * @return True if handler registered, else false.
     */
    Add: function(obj, type, fn, useCapture)
    {
        this.Initialise();

        // If a string was passed in, it's an id.
        if (typeof obj == "string")
            obj = document.getElementById(obj);
        if (obj == null || fn == null)
            return false;

	var afn = function(ev) {
		if(!ev) {
			ev = window.event;
		}
		var ret = fn(ev, ev.srcElement? ev.srcElement:ev.target);
		if(false === ret && ev.preventDefault) {
			ev.preventDefault();
			ev.stopPropagation();
		}
		return ret;
	};

        // Mozilla/W3C listeners?
        if (obj.addEventListener)
        {
            obj.addEventListener(type, afn, useCapture);
            this._registry.push({obj: obj, type: type, fn: afn, useCapture: useCapture});
            return true;
        }

        // IE-style listeners?
        if (obj.attachEvent && obj.attachEvent("on" + type, afn))
        {
            this._registry.push({obj: obj, type: type, fn: afn, useCapture: false});
            return true;
        }

        return false;
    },

    /**
     * Cleans up all the registered event handlers.
     */
    CleanUp: function()
    {
        for (var i = 0; i < EventManager._registry.length; i++)
        {
            with (EventManager._registry[i])
            {
                // Mozilla/W3C listeners?
                if (obj.removeEventListener)
                    obj.removeEventListener(type, fn, useCapture);
                // IE-style listeners?
                else if (obj.detachEvent)
                    obj.detachEvent("on" + type, fn);
            }
        }

        // Kill off the registry itself to get rid of the last remaining
        // references.
        EventManager._registry = null;
    },
    CleanObj: function(owner) {
        var i = 0;
        while(i < EventManager._registry.length) {
	    if(EventManager._registry[i].obj === owner) {
	        with(EventManager._registry[i]) {
		    if (obj.removeEventListener)
		        obj.removeEventListener(type, fn, useCapture);
		    else if (obj.detachEvent)
		        obj.detachEvent("on" + type, fn);
		}
	        EventManager._registry.splice(i, 1);
	    }else {
	        i++;
	    }
	}
    }
};

