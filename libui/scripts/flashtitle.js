var _normal_title_str = null;
var _flash_title_strs = null;
var _flash_title_timer = 0;
function flashTitle(new_title) {
	if(_flash_title_timer > 0) {
		clearTimeout(_flash_title_timer);
	}
        if(_flash_title_strs == null) {
                _normal_title_str = document.title;
        }
        _flash_title_strs  = new_title;
        document.title = new_title[0];
        _flash_title_timer = setTimeout('__flashTitle2()', 500);
}
function __flashTitle2() {
        if(_flash_title_strs != null) {
                for(var i = 0; i < _flash_title_strs.length; i ++) {
                        if(document.title == _flash_title_strs[i]) {
                                if(i+1 >= _flash_title_strs.length) {
                                        i = -1;
                                }
                                document.title = _flash_title_strs[i+1];
                                break;
                        }
                }
                _flash_title_timer = setTimeout('__flashTitle2()', 500);
        }
}
function cancelFlashTitle() {
	if(_flash_title_timer > 0) {
		clearTimeout(_flash_title_timer);
		_flash_title_timer = 0;
	}
	if(_flash_title_strs != null) {
		document.title = _normal_title_str;
		_flash_title_strs = null;
	}
}

