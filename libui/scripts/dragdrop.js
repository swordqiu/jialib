
var _dragObject  = null;
var _dragObjPos  = null;
var _mouseOffset = null;
var _mousePos = null;
var _dragContainer = null;
var _dragContainerStyle = null;
var _drop_to_func = null;
var _drop_container_id = null;

function getContainer(pos) {
        if(_drop_container_id == undefined || _drop_container_id == null || _drop_container_id == '') {
                return null;
        }
        var conts = document.getElementsByTagName('td');
        for(i = 0; i < conts.length; i ++) {
                if(conts[i].id.indexOf(_drop_container_id) >= 0) {
                        var _cont_x = findPosX(conts[i]);
                        var _cont_y = findPosY(conts[i]);
                        var _cont_w = findWidth(conts[i]);
                        var _cont_h = findHeight(conts[i]);
                        if(pos.x >= _cont_x && pos.x < _cont_x + _cont_w && pos.y >= _cont_y && pos.y < _cont_y + _cont_h) {
                                return conts[i];
                        }
                }
        }
        return null;
}

function mouseDragMove(ev, obj){
        if(_dragObject) {
                ev           = ev || window.event;
                _mousePos = mouseCoords(ev);
                if(!_mouseOffset) {
                        _mouseOffset = {x: _mousePos.x - _dragObjPos.x, y: _mousePos.y - _dragObjPos.y};
                }
		_dragObject.style.position = 'absolute';
                _dragObject.style.top      = (_mousePos.y - _mouseOffset.y) + "px";
                _dragObject.style.left     = (_mousePos.x - _mouseOffset.x) + "px";
                var container = getContainer(_mousePos);
                if(_dragContainer != container) {
                        if(_dragContainer != null) {
                                _dragContainer.style.backgroundColor = _dragContainerStyle;
                        }
                        _dragContainer = container;
                        if(_dragContainer != null) {
                                _dragContainerStyle = _dragContainer.style.backgroundColor;
                                _dragContainer.style.backgroundColor = '#BBBBBB';
                        }
                }
                /*return false;*/
        }
}

function mouseDragUp(ev, obj){
        if(_dragObject) {
                var obj = _dragObject;
                /*document.onmousemove = null;
                document.onmouseup   = null;*/
		set_opacity(_dragObject, 1);
		if(_drop_to_func != undefined && _drop_to_func != null) {
                	_drop_to_func(_dragObject, _dragContainer);
		}
                _dragObject  = null;
                _dragObjPos  = null;
                _mouseOffset = null;
                _mousePos = null;
                _dragContainer = null;
                _dragContainerStyle = null;
                _drop_to_func = null;
                _drop_container_id = null;
        }
}

// idstr: id of the object to be dragged
// dropfunc: function onDrop(obj, cont)
// container: container_id

function beginDrag(drag_obj) {
	// idstr, dropfunc, container) {
	var obj = null;
	if(drag_obj.target_id) {
        	obj = document.getElementById(drag_obj.target_id);
	}else {
		obj = drag_obj.target;
	}
        _dragObjPos = {x: findPosX(obj), y: findPosY(obj)};
        /*obj.style.top      = _dragObjPos.y + "px";
        obj.style.left     = _dragObjPos.x + "px";
        obj.style.position = 'absolute';*/
	set_opacity(obj, 0.6);
        _drop_to_func      = drag_obj.drop_func;
        _drop_container_id = drag_obj.container_id;
        _dragObject = obj;
        /*document.onmousemove = mouseDragMove;
        document.onmouseup   = mouseDragUp;*/
        /*return false;*/
}

EventManager.Add(document, 'mousemove', mouseDragMove);
EventManager.Add(document, 'mouseup',   mouseDragUp);
