var _email_reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2}|edu|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;
var _ip_reg = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
var _domain_reg = /^[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2}|edu|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)$/;
var _phone_reg = /^(\d{1,4}\-)?\d{5,11}(\-\d{1,6})?$/;
var _pin_reg = /^[0-9a-fA-F]{8}$/;
var _mobile_reg = /(130|131|132|155|156|186|133|153|189|134|135|136|137|138|139|150|151|152|157|158|159|188)[0-9]{8}$/;
var _username_reg = /^[a-zA-Z0-9._%+-]{1,32}$/;
var _url_reg = /^(http|ftp|https):\/\/[a-zA-Z0-9.-]+(:\d+)?(\/+[a-zA-Z0-9.-]+)?(\/)?/;

function _email_check(str) {
	var emailReg = new RegExp(_email_reg);
	return emailReg.test(str);
}

function checkDOM(ctl, regstr, info, nonempty) {
        if((ctl.type == 'text' || ctl.type == 'textarea' || ctl.type == 'password') && (ctl.readOnly !== true)) {
		var ctl_val = ctl.value;
		if('boolean' === typeof(nonempty) && true === nonempty) {
			if(ctl_val == '' || ctl_val.length == 0) {
				showTips(ctl, info);
				return false;
			}
		}else {
			if(ctl_val == '') {
				return true;
			}
		}
                var pattern = new RegExp(regstr);
                if(!pattern.test(ctl_val)) {
                        showTips(ctl, info);
                        return false;
                }
        }
        return true;
}

function checkDOMEqual(ctl, val, info) {
	if(ctl.value == val) {
		return true;
	}else {
		showTips(ctl, info);
		return false;
	}
}
function checkDOMURL(ctl, info, nonempty) {
	return checkDOM(ctl, _url_reg, info, nonempty);
}
function checkDOMUser(ctl, info, nonempty) {
	return checkDOM(ctl, _username_reg, info, nonempty);
}
function checkDOMEmail(ctl, info, nonempty) {
	return checkDOM(ctl, _email_reg, info, nonempty);
}
function checkDOMIP(ctl, info, nonempty) {
	return checkDOM(ctl, _ip_reg, info, nonempty);
}
function checkDOMDomain(ctl, info, nonempty) {
	return checkDOM(ctl, _domain_reg, info, nonempty);
}
function checkDOMPhone(ctl, info, nonempty) {
	return checkDOM(ctl, _phone_reg, info, nonempty);
}
function checkDOMNonempty(ctl, info) {
	return checkDOM(ctl, /.+/, info, true);
}
function checkDOMInteger(ctl, info, nonempty) {
	return checkDOM(ctl, /^-*\d+$/, info, nonempty);
}
function checkDOMMobile(ctl, info, nonempty) {
	return checkDOM(ctl, _mobile_reg, info, nonempty);
}
function checkDOMDecimal(ctl, bits, info, nonempty) {
	return checkDOM(ctl, "^[0-9]{1," + bits + "}$", info, nonempty);
}
function checkDOMHex(ctl, bits, info, nonempty) {
	return checkDOM(ctl, "^[0-9a-fA-F]{1," + bits + "}$", info, nonempty);
}
function checkDOMPIN(ctl, info, nonempty) {
	return checkDOM(ctl, /^[0-9a-fA-F]{8}$/, info, nonempty);
}

function showError(id, msg) {
	document.getElementById(id).innerHTML = "<font size=2 color=red><b>" + msg + "</b></font>";
}

function resetError(id) {
	document.getElementById(id).innerHTML = "&nbsp;";
}

function encodeHTML(text) {
	if('string' !== typeof(text)) {
		return text;
	}
	encodedHtml = text;
	//encodedHtml = escape(text);
	//encodedHtml = encodedHtml.replace(/\//g,"%2F");
	//encodedHtml = encodedHtml.replace(/\?/g,"%3F");
	//encodedHtml = encodedHtml.replace(/=/g,"%3D");
	encodedHtml = encodedHtml.replace(/&/g,"%26");
	//encodedHtml = encodedHtml.replace(/@/g,"%40");
	return encodedHtml;
}

function email_username(email) {
	return email.substring(0, email.indexOf('@'));
}

function get_username(vtype, email, nick, real) {
	if(('undefined' == typeof(nick) || nick == "")
	    && ('undefined' == typeof(real) || real == "")) {
		//return email_username(email);
		return email;
	}else {
		if(vtype <= 3 && 'undefined' != typeof(real) && real != "") {
			return real;
		}
		if('undefined' != typeof(nick) && nick != "") {
			return nick;
		}else {
			//return email_username(email);
			return email;
		}
	}
}

// Internet Explorer
if( typeof XMLHttpRequest == "undefined" ) XMLHttpRequest = function() {
	try { return new ActiveXObject("Msxml2.XMLHTTP.6.0") } catch(e) {}
	try { return new ActiveXObject("Msxml2.XMLHTTP.4.0") } catch(e) {}
	try { return new ActiveXObject("Msxml2.XMLHTTP.3.0") } catch(e) {}
	try { return new ActiveXObject("Msxml2.XMLHTTP") } catch(e) {}
	try { return new ActiveXObject("Microsoft.XMLHTTP") } catch(e) {}
	throw new Error( "This browser does not support XMLHttpRequest." )
};

function getAJAXObj() {
	// Firefox, Opera 8.0+, Safari
	try { return new XMLHttpRequest(); } catch (e) {}
	throw new Error( "This browser does not support XMLHttpRequest." )
}

function getParamStr(param_str, params) {
	for(key in params) {
		if(param_str != '') {
			param_str += '&';
		}
		param_str += key + '=' + encodeHTML(params[key]);
	}
	//alert(param_str);
	return param_str;
}

function AJAXRequest(obj) {
	var pos = obj.url.indexOf('?');
	if(pos > 0) {
		var params_str = obj.url.substr(pos+1);
		var url_str = obj.url.substr(0, pos);
	}else {
		var params_str = '';
		var url_str = obj.url;
	}
	if(obj.params) {
		params_str = getParamStr(params_str, obj.params);
	}
	if(obj.onLoad) {
		obj.onLoad();
	}
	var _ajax_obj = getAJAXObj();
	if(obj.method && 'POST' == obj.method) {
		_ajax_obj.open("POST", url_str, true);
		_ajax_obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		var params = params_str;
	}else {
		_ajax_obj.open("GET", url_str + '?' + params_str, true);
		var params = null;
	}
	_ajax_obj.onreadystatechange=function() {
		//alert("readyState=" + _ajax_obj.readyState + " status=" + _ajax_obj.status);
		if (_ajax_obj.readyState==4) {
			if ( (_ajax_obj.status >= 200 && _ajax_obj.status < 300) || _ajax_obj.status == 304 || _ajax_obj.status == 1223 ){
				if(obj.onEnd) {
					obj.onEnd(_ajax_obj.responseText);
				}
			}else {
				if(obj.onError) {
					obj.onError(_ajax_obj.status, _ajax_obj.statusText);
				}else {
					//alert("Error: request " + _ajax_obj.url + " with (" + _ajax_obj.status + ") " + _ajax_obj.statusText);
					//alert("AJAX Error: request " + _ajax_obj.url + " with (" + _ajax_obj.status + ")");
				}
			}
			delete _ajax_obj;
		}
	};
	if(_ajax_obj.timeout) {
		_ajax_obj.timeout=5000;
		_ajax_obj.ontimeout = function () {
			if(obj.onTimeout) {
				obj.onTimeout();
			}else {
				alert('AJAX Request Timeout!');
			}
			delete _ajax_obj;
		};
	}
	_ajax_obj.send(params);
	return _ajax_obj;
}

function findPos(obj) {
	var curleft = 0;
	var curtop = 0;
	if (obj.offsetParent) {  
		while (obj.offsetParent)  {
			curleft += obj.offsetLeft-obj.scrollLeft;
			curtop += obj.offsetTop-obj.scrollTop;
			var position='';
			if (obj.style&&obj.style.position)
				position=obj.style.position.toLowerCase();
			/*if ((position=='absolute')||(position=='relative'))
				break; */
			while (obj.parentNode && obj.offsetParent && obj.parentNode!=obj.offsetParent) {
				obj=obj.parentNode;
				curleft -= obj.scrollLeft;
				curtop -= obj.scrollTop;
			}
			if(!obj.offsetParent) {
				break;
			}
			obj = obj.offsetParent;
		}
	} else {
		if (obj.x)
			curleft += obj.x;
		if (obj.y)
			curtop += obj.y;
	}
	return {left:curleft,top:curtop};
}

function findPosX(obj) {
	return findPos(obj).left;
}

function findPosY(obj) {
	return findPos(obj).top;
}

function findWidth(obj) {
	return obj.offsetWidth;
}

function findHeight(obj) {
	return obj.offsetHeight;
}

function getEventTarget(e) {
	var targ;
	if (!e) var e = window.event;
	if (e.target) targ = e.target;
	else if (e.srcElement) targ = e.srcElement;
	if (targ.nodeType == 3) // defeat Safari bug
		targ = targ.parentNode;
	return targ;
}

var _msgTips_timeout_id = 0;

function showTips(obj, msg, x, y) {
        if(_msgTips_timeout_id != 0) {
                hideTips();
                clearTimeout(_msgTips_timeout_id);
        }
        var tbl = newTableElement('166', 0, 0, 0, '', 3, 1, 'center', 'middle');
        tbl.id = '_msgTips';
        tbl.style.position = 'absolute';
	tbl.style.zIndex = 100;
        document.body.appendChild(tbl);
        tblCell(tbl, 0, 0).appendChild(newImageElement('', IMAGE_ROOT + '/tooltip_top.gif', 166, 6, 0, ''));
        tblCell(tbl, 1, 0).style.background = "url(" + IMAGE_ROOT + "/tooltip_bg.gif) repeat-y";
        tblCell(tbl, 1, 0).style.fontSize = '12px';
        tblCell(tbl, 1, 0).style.fontWeight = 'bold';
        tblCell(tbl, 1, 0).style.color = '#5b1515';
        tblCell(tbl, 1, 0).innerHTML = msg;
        tblCell(tbl, 2, 0).appendChild(newImageElement('', IMAGE_ROOT + '/tooltip_bot.gif', 166, 40, 0, ''));
	if('undefined' === typeof(x)) {
        	var tbl_h = findHeight(tbl);
	        var obj_x = findPosX(obj);
        	var obj_y = findPosY(obj);
	        var obj_w = findWidth(obj);
        	var obj_h = findHeight(obj);
	        var x = obj_x + obj_w/2;
        	var y = obj_y + obj_h/2 - tbl_h;
	}
	//alert(x + ':' + y);
	tbl.style.left = x + "px";
        tbl.style.top  = y + "px";
        tbl.style.visibility = 'visible';
        _msgTips_timeout_id = setTimeout('hideTips()', 2000);
	scrollWindowTo(x-50, y-50, 100, 100);
}

function scrollWindowToObj(o) {
	scrollWindowTo(findPosX(o), findPosY(o), findWidth(o), findHeight(o));
}

function scrollWindowTo(x, y, w, h) {
	if(w > 100) {
		w = 100;
	}
	if(h > 100) {
		h = 50;
	}
        if(x < f_scrollLeft() || x + w > f_scrollLeft() + f_clientWidth() || y < f_scrollTop() || y + h > f_scrollTop() + f_clientHeight()) {
                window.scrollTo(x, y);
        }
}

function hideTips() {
        var div = document.getElementById('_msgTips');
        removeChildFromNode(div, document.body);
}


function f_filterResults(n_win, n_docel, n_body) {
	var n_result = n_win ? n_win : 0;
	if (n_docel && (!n_result || (n_result > n_docel)))
		n_result = n_docel;
	return n_body && (!n_result || (n_result > n_body)) ? n_body : n_result;
}
function f_clientWidth() {
	return f_filterResults (
		window.innerWidth ? window.innerWidth : 0,
		document.documentElement ? document.documentElement.clientWidth : 0,
		document.body ? document.body.clientWidth : 0
	);
}
function f_clientHeight() {
	return f_filterResults (
		window.innerHeight ? window.innerHeight : 0,
		document.documentElement ? document.documentElement.clientHeight : 0,
		document.body ? document.body.clientHeight : 0
	);
}
function f_scrollLeft() {
	return f_filterResults (
		window.pageXOffset ? window.pageXOffset : 0,
		document.documentElement ? document.documentElement.scrollLeft : 0,
		document.body ? document.body.scrollLeft : 0
	);
}
function f_scrollTop() {
	return f_filterResults (
		window.pageYOffset ? window.pageYOffset : 0,
		document.documentElement ? document.documentElement.scrollTop : 0,
		document.body ? document.body.scrollTop : 0
	);
}

function set_opacity(obj, opa) {
	if("undefined" != typeof obj.style.filter) {
		obj.style.filter = "alpha(opacity=" + (opa*100) + ")";
	}
	if("undefined" != typeof obj.style.opacity) {
		obj.style.opacity=opa;
	}
}

function set_invisible(obj) {
        obj.style.visibility = 'hidden';
}

function set_visible(obj) {
        obj.style.visibility = 'visible';
}

var _async_msg_timeout_id = 0;
var _async_msg_max_duration = 6*1000;
var _async_msg_duration = 0;
var _async_msg_step = 30;

function _show_async_filter(x) {
	if(x < 0.5) {
		return 1;
	}else {
		x = Math.cos(x*Math.PI);
		return 1 - x*x;
	}
}

function _show_async_msg_transition() {
        var _async_div = document.getElementById('_async_msg');
        if(_async_msg_duration >= _async_msg_max_duration) {
                removeChildFromNode(_async_div, document.body);
                _async_msg_timeout_id = 0;
        }else {
		if(_async_msg_duration == 0) {
			set_visible(_async_div);
		}
                var _opa = _show_async_filter(_async_msg_duration*1.0/_async_msg_max_duration);
                set_opacity(_async_div, _opa);
                _async_msg_timeout_id = setTimeout('_show_async_msg_transition()', _async_msg_max_duration/_async_msg_step);
        	_async_msg_duration += _async_msg_max_duration/_async_msg_step;
        }
}

function showAsyncMsg(msg, stay) {
        if(_async_msg_timeout_id > 0) {
                clearTimeout(_async_msg_timeout_id);
                _async_msg_timeout_id = 0;
        }
	if(document.getElementById('_async_msg')) {
                removeChildFromNode(document.getElementById('_async_msg'), document.body);
	}
        var _async_div = document.createElement('div');
	document.body.appendChild(_async_div);
	_async_div.id = '_async_msg';
	_async_div.style.width = '240px';
	_async_div.style.height = '120px';
	_async_div.style.margin = '10px 10px';
	_async_div.style.fontWeight = 'bold';
	_async_div.style.fontSize = '13px';
	_async_div.style.color = '#444444';
	_async_div.style.background = 'url(' + IMAGE_ROOT + '/async_pane.gif) no-repeat';
	//_async_div.style.backgroundColor = '#ffffe1';
	//_async_div.style.border = '1px solid #888888';
	_async_div.style.position = 'absolute';
	_async_div.style.padding = '5px';
        _async_div.style.left = (f_scrollLeft() + f_clientWidth() - 240 - 30) + "px";
        _async_div.style.top = (f_scrollTop() + f_clientHeight() - 120 - 30) + "px";

	var tbl = newTableElement('215', 0, 2, 2, '', 2, 1, 'left', 'top');
	_async_div.appendChild(tbl);

	tblCell(tbl, 0, 0).height = 20;
	tblCell(tbl, 0, 0).align = 'right';

        tblCell(tbl, 1, 0).innerHTML = msg;

	if('undefined' === typeof stay || !stay) {
        	_async_msg_duration = 0;
		_show_async_msg_transition();
	}else {
		var del_img = newImageElement('', IMAGE_ROOT + '/delete.gif', 12, 12, 0, '关闭');
		del_img.style.cursor = 'pointer';
		tblCell(tbl, 0, 0).appendChild(del_img);

		EventManager.Add(_async_div, 'mouseover', function(ev, obj) {
			del_img.style.border = '1px solid #888888';
			del_img.style.backgroundColor = '#CCCCCC';
		});
		EventManager.Add(_async_div, 'mouseout', function(ev, obj) {
			del_img.style.border = '';
			del_img.style.backgroundColor = '';
		});
		EventManager.Add(del_img, 'click', function(ev, obj) {
        		_async_msg_duration = _async_msg_max_duration;
			_show_async_msg_transition();
			cancelFlashTitle(); // hack!
		});
	}
}

function hideAsyncMsg() {
	_async_msg_duration = _async_msg_max_duration;
	_show_async_msg_transition();
}

function diffRep(diff) {
        var min = 60*1000;
        var hour = 60*min;
        var day = 24*hour;

        if(diff > day) {
                return "" + Math.ceil(diff/day) + "天";
        }else if(diff > hour) {
                return "" + Math.ceil(diff/hour) + "小时";
        }else {
                return "" + Math.ceil(diff/min) + " 分钟";
        }
}

function isDateStr(str) {
	var _datestr_reg = /^\d{4}-\d{2}-\d{2}/;
	var date_reg = new RegExp(_datestr_reg);
	if(!date_reg.test(str)) {
		return false;
	}else {
		return true;
	}
}

function isDateTimeStr(str) {
	var _datestr_reg2 = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
	var date_reg2 = new RegExp(_datestr_reg2);
	if(!date_reg2.test(str)) {
		return false;
	}else {
		return true;
	}
}

function str2date(str) {
	if(!isDateStr(str)) {
		return null;
	}

        var year = str.substr(0, 4);
        var month = str.substr(5, 2);
	var day = str.substr(8, 2);

	if(!isDateTimeStr(str)) {
		var hour = 0;
		var min  = 0;
		var sec  = 0;
	}else {
		var hour = str.substr(11, 2);
        	var min = str.substr(14, 2);
		var sec = str.substr(17, 2);
	}

        var d = new Date();
        d.setFullYear(year);
        d.setMonth(month-1);
        d.setDate(day);
        d.setHours(hour);
        d.setMinutes(min);
        d.setSeconds(0);

        return d;
}

var chinese_weekday = new Array();
chinese_weekday[0]='周日';
chinese_weekday[1]='周一';
chinese_weekday[2]='周二';
chinese_weekday[3]='周三';
chinese_weekday[4]='周四';
chinese_weekday[5]='周五';
chinese_weekday[6]='周六';

function toChineseMonthString(d) {
	if('string' === typeof(d)) {
		d = str2date(d);
	}
	if(!d) {
		return "N/A";
	}
        return d.getFullYear() + "年" + (d.getMonth()+1) + "月";
}

function toChineseDateString(d) {
	if('string' === typeof(d)) {
		d = str2date(d);
	}
	if(!d) {
		return "N/A";
	}
        return d.getFullYear() + "年" + (d.getMonth()+1) + "月" + d.getDate() + "日 " + chinese_weekday[d.getDay()];
}

function toChineseDateTimeString(d) {
	return toChineseDateString(d) + ' ' + toChineseTimeString(d);
}

function getZodiac(d) {
	if('string' === typeof(d)) {
		d = str2date(d);
	}
        if(!d) {
                return "N/A";
        }
        var year = d.getFullYear();
        var zodiac = new Array();
        zodiac[0] = '鼠';
        zodiac[1] = '牛';
        zodiac[2] = '虎';
        zodiac[3] = '兔';
        zodiac[4] = '龙';
        zodiac[5] = '蛇';
        zodiac[6] = '马';
        zodiac[7] = '羊';
        zodiac[8] = '猴';
        zodiac[9] = '鸡';
        zodiac[10] = '狗';
        zodiac[11] = '猪';
        var baseyear = 2008;
        var index = (year - baseyear) % 12;
        if(index < 0) {
                index += 12;
        }
        return zodiac[index];
}

function getAstro(dt) {
	var m = dt.getMonth();
	var d = dt.getDate();
	var astr = new Array();
	astr[0] = '水瓶';
	astr[1] = '双鱼';
	astr[2] = '白羊';
	astr[3] = '金牛';
	astr[4] = '双子';
	astr[5] = '巨蟹';
	astr[6] = '狮子';
	astr[7] = '处女';
	astr[8] = '天平';
	astr[9] = '天蝎';
	astr[10] = '射手';
	astr[11] = '摩羯';
	if(d < 21) {
		m = m - 1;
		if(m < 0) {
			m = 11;
		}
	}
	return astr[m];
}

function toChineseTimeString(d) {
	if('string' === typeof(d)) {
		d = str2date(d);
	}
	if(!d) {
		return 'N/A';
	}
        var str = d.getHours() + "时";
        if(d.getMinutes() == 0) {
                str += "整";
        }else {
                str += d.getMinutes() + "分";
        }
        return str;
}

function parseProperties(s) {
        var ss = s.split('&');
        var ret = new Array();
        for(var i = 0; i < ss.length; i ++) {
		var sepidx = ss[i].indexOf('=');
		if(sepidx >= 0) {
			var key = ss[i].substr(0, sepidx);
			var val = ss[i].substr(sepidx+1, ss[i].length);
		}else {
			var key = ss[i];
			var val = '';
		}
		ret[key] = val;
        }
        return ret;
}

function showSizeString(s) {
        if(s > 1024*1024*1024) {
                g = Math.floor(s*10/1024/1024/1024)/10;
                return g + "GB";
        }else if(s > 1024*1024) {
                m = Math.floor(s*10/1024/1024)/10;
                return m + "MB";
        }else if(s > 1024) {
                k = Math.floor(s*10/1024)/10;
                return k + "KB";
        }else {
                return s;
        }
}

function showDurationString(s) {
        var sec = Math.floor(s);
        var hour = 0;
        var min  = 0;
        if(sec >= 3600) {
                hour = Math.floor(sec/3600);
                sec -= hour*3600;
        }
        if(sec >= 60) {
                min = Math.floor(sec/60);
                sec -= min*60;
        }
	var ret = '';
	if(hour > 0) {
		ret += hour + ':';
	}
        return ret + zeroFill(min, 2) + ':' + zeroFill(sec, 2);
}

function showFlashObj(name, width, height, url, bgcolor, transparent, vars) {
	var html = "<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" ";
	html += "codebase=\"http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab\" ";
	html += "width=\"" + width + "\" height=\"" + height + "\" id=\"" + name + "\">";
	html += "<param name=\"movie\" value=\"" + url + "\" />";
	html += "<param name=\"allowFullScreen\" value=\"true\" />";
	html += "<param name=\"allowScriptAccess\" value=\"always\" />";
	html += "<param name=\"quality\" value=\"high\" /><param name='bgcolor' value='" + bgcolor + "' />";
	if(transparent && transparent === true) {
		html += "<param name=\"wmode\" value=\"transparent\" />";
	}
	if('undefined' !== typeof(vars) && 'null' !== typeof(vars)) {
		var flashvars = getParamStr('', vars);
	}else {
		var flashvars = '';
	}
	if(flashvars != '') {
		html += "<param name=\"FlashVars\" value=\"" + flashvars + "\" />";
	}
	html += "<embed src=\"" + url + "\" quality=\"high\" width=\"" + width + "\" height=\"" + height + "\" bgcolor='" + bgcolor + "' ";
	if(transparent && transparent === true) {
		html += " wmode=\"transparent\" ";
	}
	if(flashvars != '') {
		html += " FlashVars=\"" + flashvars + "\" ";
	}
	html += " allowFullScreen=\"true\" ";
	html += " allowScriptAccess=\"always\" ";
	html += "name=\"" + name + "\" align=\"middle\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer\"></embed></object>";
	return html;
}

function getWindowSize() {
	var myWidth = 0, myHeight = 0;
	if( typeof( window.innerWidth ) == 'number' ) {
		//Non-IE
		myWidth = window.innerWidth;
		myHeight = window.innerHeight;
	} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		//IE 6+ in 'standards compliant mode'
		myWidth = document.documentElement.clientWidth;
		myHeight = document.documentElement.clientHeight;
	} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		//IE 4 compatible
		myWidth = document.body.clientWidth;
		myHeight = document.body.clientHeight;
	}
	return {x: myWidth, y: myHeight};
}

/*

obj {
id: id_str,
is_modulor: true/false,
width: 400,
height: 200,
caption: 100,
caption_color: #FFFFFF,
caption_bgcolor: #FFFFF,
onOK: function,
okText: str,
cancelText: str,
closeText: str,
onCancel: function,
onClose: function,
contentHTML: function,
contentObject: function,
data: obj,
}

*/

function showAlert(msg, dat) {
	var conf = {
		id: 'alert',
		is_modular: true,
		//height: 120,
		width: 400
	};
	if('undefined' == typeof(dat) || dat == null) {
		conf.caption = '警告';
		conf.cancelText = '关闭';
		conf.onCancel = function() { cancelFlashTitle(); return true;};
	}else {
		if(dat.caption) {
			conf.caption = dat.caption;
		}else {
			conf.caption = '警告';
		}
		if(dat.text) {
			conf.cancelText = dat.text;
		}else {
			conf.cancelText = '关闭';
		}
		conf.onCancel = function() {
			dat.callback();
			cancelFlashTitle();
			return true;
		};
	}
	var content = showDialog(conf);
	content.appendChild(newParagraph(msg));
	content.style.padding = '10px';
	flashTitle(['【警告！】', '[Alert!]']);
}

function showConfirm(obj) {
	var content = showDialog({
		id: 'confirm',
		is_modular: true,
		width: 400,
		//height: 120,
		caption: '确认',
		onOK: function() { obj.onOK(); return true; }, 
		onCancel: function() { obj.onCancel(); return true; }
	});
	var msg = newParagraph(obj.msg);
	content.appendChild(msg);
	content.style.padding = '10px';
}

function closeDiagWindow(did) {
	if(_diag_metadata[did]) {
		_diag_metadata[did].closeDiag();
	}
}

var _diag_metadata = new Array();

function adjustDiagPosition(id) {
	var diag = document.getElementById(id);
	if(diag) {
		var winsize = getWindowSize();
		diag.style.visibility = 'visible';
		diag.style.left = (f_scrollLeft() + winsize.x/2 - findWidth(diag)/2) + 'px';
		diag.style.top  = (f_scrollTop()  + winsize.y/2 - findHeight(diag)/2) + 'px';
	}
}

function showDialog(diag_obj) {
	var winsize = getWindowSize();

	if(diag_obj.is_modular) {
		var msg_pane = document.createElement('div');
		msg_pane.style.position='absolute';
		msg_pane.style.top    = f_scrollTop() + 'px';
		msg_pane.style.left   = f_scrollLeft() + 'px';
		msg_pane.style.width  = winsize.x + 'px';
		msg_pane.style.height = winsize.y + 'px';
		msg_pane.style.backgroundColor = '#000000';
		msg_pane.style.cursor = 'not-allowed';
		set_opacity(msg_pane, 0.5);
		document.body.appendChild(msg_pane);
		hideScrollBar();
	}

	if(_diag_metadata[diag_obj.id]) {
		_diag_metadata[diag_obj.id].closeDiag();
	}

	if(diag_obj.bgcolor) {
		var diag_bgcolor = diag_obj.bgcolor;
	}else {
		var diag_bgcolor = '#FFFFFF';
	}
	var diag = newTableElement(diag_obj.width, 0, 0, 0, '', 5, 3, 'center', 'middle');
	diag.id = diag_obj.id;
	if(diag_obj.height) {
		diag.height = diag_obj.height;
		var tmp_h = diag_obj.height;
	}else {
		var tmp_h = 0;
	}
	document.body.appendChild(diag);

	diag.style.position = 'absolute';
	diag.style.visibility = 'hidden';
	diag.style.left = (f_scrollLeft() + winsize.x/2 - diag_obj.width/2) + 'px';
	diag.style.top  = (f_scrollTop() + winsize.y/2 - tmp_h/2) + 'px';

	var diag_style = "/dialog_1/";

	var trans_img = newImageElement('', IMAGE_ROOT + '/transparent.gif', 10, 10, 0, '');
	tblCell(diag, 0, 0).width = 10;
	tblCell(diag, 0, 0).height = 10;
	tblCell(diag, 0, 0).appendChild(trans_img);
	tblCell(diag, 0, 0).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_left_top.png)";
	tblCell(diag, 0, 2).width = 10;
	tblCell(diag, 0, 2).height = 10;
	tblCell(diag, 0, 2).appendChild(trans_img);
	tblCell(diag, 0, 2).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_right_top.png)";
	tblCell(diag, 4, 0).width = 10;
	tblCell(diag, 4, 0).height = 10;
	tblCell(diag, 4, 0).appendChild(trans_img);
	tblCell(diag, 4, 0).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_left_bottom.png)";
	tblCell(diag, 4, 2).width = 10;
	tblCell(diag, 4, 2).height = 10;
	tblCell(diag, 4, 2).appendChild(trans_img);
	tblCell(diag, 4, 2).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_right_bottom.png)";

	tblCell(diag, 0, 1).appendChild(trans_img);
	tblCell(diag, 0, 1).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 4, 1).appendChild(trans_img);
	tblCell(diag, 4, 1).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";

	var trans_img2 = newImageElement('', IMAGE_ROOT + '/transparent.gif', 10, 1, 0, '');
	tblCell(diag, 1, 0).appendChild(trans_img2);
	tblCell(diag, 1, 0).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 2, 0).appendChild(trans_img2);
	tblCell(diag, 2, 0).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 3, 0).appendChild(trans_img2);
	tblCell(diag, 3, 0).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 1, 2).appendChild(trans_img2);
	tblCell(diag, 1, 2).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 2, 2).appendChild(trans_img2);
	tblCell(diag, 2, 2).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";
	tblCell(diag, 3, 2).appendChild(trans_img2);
	tblCell(diag, 3, 2).style.background = "url(" + IMAGE_ROOT + diag_style + "/diag_bg.png) repeat";

	if(diag_obj.caption_bgcolor) {
		border_color = diag_obj.caption_bgcolor;
	}else {
		//border_color = '#8a0101';
		border_color = '#218a01';
	}
	//diag.style.border='1px solid ' + border_color;
	tblCell(diag, 1, 1).style.borderLeft = tblCell(diag, 1, 1).style.borderRight = tblCell(diag, 1, 1).style.borderTop = tblCell(diag, 2, 1).style.borderLeft = tblCell(diag, 2, 1).style.borderRight = tblCell(diag, 3, 1).style.borderLeft = tblCell(diag, 3, 1).style.borderRight = tblCell(diag, 3, 1).style.borderBottom = '1px solid ' + border_color;
	tblCell(diag, 1, 1).style.padding = tblCell(diag, 3, 1).style.padding = '2px';
	tblCell(diag, 1, 1).vAlign = 'top';
	tblCell(diag, 3, 1).vAlign = 'bottom';
	tblCell(diag, 1, 1).bgColor = tblCell(diag, 2, 1).bgColor = tblCell(diag, 3, 1).bgColor = diag_bgcolor;

	//diag.style.width  = diag_obj.width + 'px';
	//diag.style.height = diag_obj.height + 'px';
	//diag.style.zIndex = 10;
	//diag.style.cursor='auto';
	//diag.cellSpacing = 0;
	//diag.cellPadding = 2;

	if(diag_obj.caption) {
		if(diag_obj.caption_color) {
			caption_color = diag_obj.caption_color;
		}else {
			caption_color = '#FFFFFF';
		}
		var capt_tbl = newTableElement('100%', 0, 2, 2, border_color, 1, 2, 'left', 'middle', tblCell(diag, 1, 1));
		capt_tbl.style.color  = caption_color;
		tblCell(capt_tbl, 0, 0).style.cursor = 'move';
		tblCell(capt_tbl, 0, 0).onmousedown = function() {beginDrag({'target_id':  diag.id});};
		tblCell(capt_tbl, 0, 0).innerHTML = '<b>' + diag_obj.caption + '</b>';
	}
	var btn_cell = tblCell(diag, 3, 1);
	if(diag_obj.onOK || diag_obj.cancelText || diag_obj.onClose) {
		btn_cell.height = '30px';
	}
	if('undefined' !== typeof(diag_obj.onOK)) {
		if(diag_obj.okText) {
			var okText = diag_obj.okText;
		}else {
			var okText = '确定';
		}
		var okBtn = newInputElement('button', '', okText);
		okBtn.diag_obj = diag_obj;
		okBtn.__destructor = function() {
			this.diag_obj = null;
		}
		EventManager.Add(okBtn, 'click', function(e, obj) {
			if(obj.diag_obj.onOK()) {
				_diag_metadata[obj.diag_obj.id].closeDiag();
			}
		});
		btn_cell.appendChild(okBtn);
		if(diag_obj.defaultButton == 'ok') {
			makeSubmitButton(okBtn);
		}
	}
	if(diag_obj.onCancel) {
		if(diag_obj.cancelText) {
			var cancelText = diag_obj.cancelText;
			var btn = newInputElement('button', '', cancelText);
			EventManager.Add(btn, 'click', function(e, obj) { 
				if(diag_obj.onCancel()) {
					_diag_metadata[diag_obj.id].closeDiag();
				}
			});
			btn_cell.appendChild(btn);
		}

		if(diag_obj.caption) {
			var closeImg = newImageElement('', IMAGE_ROOT + diag_style + '/closewindow.gif', 15, 15, 0, '关闭对话框');
			closeImg.style.cursor = 'pointer';
			tblCell(capt_tbl, 0, 1).width = 15;
			tblCell(capt_tbl, 0, 1).appendChild(closeImg);
			closeImg.onclick = function(e) {
				if(diag_obj.onCancel()) {
					_diag_metadata[diag_obj.id].closeDiag();
				}
			};
		}
		if(diag_obj.defaultButton == 'cancel') {
			makeSubmitButton(btn);
		}
	}

	_diag_metadata[diag_obj.id] = {
		data: diag_obj,
		diag: diag,
		msg_pane: msg_pane,
		closeDiag: function () {
			removeChildFromNode(this.diag, document.body);
			if(this.data.is_modular) {
				removeChildFromNode(this.msg_pane, document.body);
				showScrollBar();
			}
			delete _diag_metadata[this.data.id];
		}
	};

	tblCell(diag, 2, 1).align = 'center';

	setTimeout("adjustDiagPosition('" + diag_obj.id + "')", 200);

	return tblCell(diag, 2, 1);
}

/*
function incControl(id, initval, inc_func, dec_func) {
        var ctl_html = "<table border=0 cellspacing=0 cellpadding=0><tr><td id='_inc_dec_ctl_" + id + "'>" + initval + "</td>";
        ctl_html += "<td><table border=0 cellspacing=0 cellpadding=0 style='border: 1px solid #AAAAAA'><tr><td style='cursor:pointer' onclick=\"document.getElementById('_inc_dec_ctl_" + id + "').innerHTML=" + inc_func + ";\"><img src='images/inc.gif' border=0></td></tr><tr>";
        ctl_html += "<td style='cursor:pointer' onclick=\"document.getElementById('_inc_dec_ctl_" + id + "').innerHTML=" + dec_func + ";\"><img src='images/dec.gif' border=0></td></tr></table></td></tr></table>";
        return ctl_html;
}*/

function colorControl(id, width, height, init_color, init_bgcolor, fg_func, fg_param, bg_func, bg_param) {
        var ctl_html = "<table border=0 cellpadding=0 cellspacing=0 style='border: 1px solid #AAAAAA'>";
        for(_ci = 0; _ci < 3; _ci ++) {
                ctl_html += "<tr>";
                for(_cj=0; _cj < 3; _cj ++) {
                        if(_ci <= 1 && _cj <= 1) {
                                _cbgcolor = init_color;
                                _cstyle = 'cursor: crosshair';
                                _cfunc = 'showColorPalette(this, {on_change_color_func: function(cl, o) {' + fg_func + '(cl, o); }, param: ' + fg_param + '})';
                        }else if((_ci == 1 && _cj == 2) || (_ci == 2 && _cj >= 1)) {
                                _cbgcolor = init_bgcolor;
                                _cstyle = 'cursor: crosshair';
                                _cfunc = 'showColorPalette(this, {on_change_color_func: function(cl, o) {' + bg_func + '(cl, o);}, param: ' + bg_param + '})';
                        }else {
                                _cbgcolor = '';
                                _cstyle = '';
                                _cfunc = '';
                        }
                        ctl_html += "<td id='" + id + "_" + _ci + "_" + _cj + "' bgcolor='" + _cbgcolor + "' style='" + _cstyle + "' onclick=\"" + _cfunc + "\"><img src='" + IMAGE_ROOT + "/transparent.gif' width=" + (width/3) + " height=" + (height/3) + "</td>";
                }
                ctl_html += "</tr>";
        }
        ctl_html += "<tr><td></td><td></td><td></td></tr>";
        ctl_html += "</table>";
        return ctl_html;
}

function updateColorControlFGColor(id, color) {
	document.getElementById(id + '_0_0').style.backgroundColor = color;
	document.getElementById(id + '_0_1').style.backgroundColor = color;
	document.getElementById(id + '_1_0').style.backgroundColor = color;
	document.getElementById(id + '_1_1').style.backgroundColor = color;
}

function updateColorControlBGColor(id, color) {
	document.getElementById(id + '_1_2').style.backgroundColor = color;
	document.getElementById(id + '_2_1').style.backgroundColor = color;
	document.getElementById(id + '_2_2').style.backgroundColor = color;
}

function RGB2HEX(str) { 
		if(str.indexOf('rgb') >= 0) {
		var arr = str.split(","); 
		var r = arr[0].substring(4), 
		g = arr[1], 
		b = arr[2].substring(0,arr[2].length-1); 
		var cval = r*256*256 + g*256 + b;
		return "#"+ cval.toString(16); 
	}else {
		return str;
	}
}

var _color_palette_tbl = null;
var _color_palette_owner = null;

function showColorPalette(obj, param) {
	var color_palette = [
['#FFFFFF','#FFF5EE','#FFF8DC','#FFFACD','#FFFFE0','#98FB98','#AFEEEE','#E0FFFF','#E6E6FA','#DDA0DD',],
['#D3D3D3','#FFC0CB','#FFE4C4','#FFE4B5','#F0E68C','#90EE90','#20B2AA','#87CEFA','#6495ED','#EE82EE',],
['#C0C0C0','#F08080','#F4A460','#FFA500','#EEE8AA','#7FFF00','#48D1CC','#87CEEB','#7B68EE','#DA70D6',],
['#808080','#FF0000','#FF4500','#FF8C00','#FFFF00','#32CD32','#8FBC8F','#4169E1','#6A5ACD','#BA55D3',],
['#696969','#DC143C','#D2691E','#FF7F50','#FFD700','#228B22','#2E8B57','#0000FF','#8A2BE2','#9932CC',],
['#2F4F4F','#B22222','#8B4513','#A0522D','#808000','#008000','#008B8B','#0000CD','#483D8B','#8B008B',],
['#000000','#8B0000','#800000','#A52A2A','#556B2F','#006400','#191970','#000080','#4B0082','#800080',]
	];

	if(_color_palette_tbl) {
		removeChildFromNode(_color_palette_tbl, _color_palette_owner);
	}
	_color_palette_tbl = document.createElement('table');
	_color_palette_owner = obj;
	_color_palette_tbl.border = 0;
	_color_palette_tbl.cellSpacing = 0;
	_color_palette_tbl.cellPadding = 0;
	_color_palette_tbl.style.position = 'absolute';
	_color_palette_tbl.style.left = findPosX(obj) + 'px';
	_color_palette_tbl.style.top  = findPosY(obj) + 'px';
	_color_palette_tbl.style.borderRight  = '1px solid black';
	_color_palette_tbl.style.borderBottom = '1px solid black';
	_color_palette_tbl.style.cursor = 'crosshair';
	for(var _cp_r = 0; _cp_r < color_palette.length; _cp_r ++) {
		var row = _color_palette_tbl.insertRow(-1);
		for(var _cp_c = 0; _cp_c < color_palette[_cp_r].length; _cp_c++) {
			var cell = row.insertCell(-1);
			cell.style.borderLeft = '1px solid black';
			cell.style.borderTop  = '1px solid black';
			//cell.style.backgroundColor = color_palette[_cp_r][_cp_c];
			cell.bgColor = color_palette[_cp_r][_cp_c];
			var img = document.createElement('img');
			img.src = IMAGE_ROOT + '/transparent.gif';
			img.width = 10;
			img.height = 10;
			cell.onmousedown = function(e) {
				var ret = true;
				if(param.on_change_color_func) {
					ret = param.on_change_color_func(this.bgColor, param.param);
				}
				if(ret) {
					removeChildFromNode(_color_palette_tbl, _color_palette_owner);
				}
				return false;
			};
			cell.onmouseover = function(e) {
				this.style.borderTop  = '1px solid white';
				this.style.borderLeft = '1px solid white';
				return false;
			};
			cell.onmouseout = function (e) {
				this.style.borderTop  = '1px solid black';
				this.style.borderLeft = '1px solid black';
				return false;
			};
			cell.appendChild(img);
		}
	}
	obj.appendChild(_color_palette_tbl);
}

function newInputElement(type, name, value, id) {
        var input = document.createElement('input');
        input.setAttribute('type', type);
	if (name && name != '') {
        	input.setAttribute('name', name);
	}
	if(id && id != '') {
		input.id = id;
	}else if (name && name != '') {
		input.id = name;
	}
	if (type == 'image') {
		if (value && value != '') {
			input.setAttribute('title', value);
		}
	}else {
		if(value && value != '') {
        		input.setAttribute('value', value);
		}
	}
        return input;
}

function newFormElement(action, method, target) {
        var form = document.createElement('form');
	if(action && action != '') {
        	form.action = action;
	}
	if(method && method != '') {
        	form.method = method;
	}
	if(target && target != '') {
        	form.target = target;
	}
        return form;
}

/*
 * create a new Image element
 *
 * @param name string Name and ID of this name
 * @param src  string Image URL
 * @param width string | number 
 * @param height string | number 
 * @param border number 
 * @param title string
 */
function newImageElement(name, src, width, height, border, title) {
	var img = document.createElement('img');
	if(name && name != '') {
		img.name = name;
		img.id = name;
	}
	img.src = src;
	if(width && width != '') {
		img.width = width;
	}
	if(height && height != '') {
		img.height = height;
	}
	if(border && border != '') {
		img.border = border;
	}else {
		img.border = 0;
	}
	if(title && title != '') {
		img.title = title;
	}
	return img;
}

function newTableCell(tbl, align, valign) {
	var row = tbl.insertRow(-1);
	var cell = row.insertCell(-1);
	cell.align = align;
	cell.vAlign = valign;
	return cell;
}

function newTableElement(width, border, spacing, padding, bgcolor, rows, cells, align, valign, panel, caption) 
{
    var table = document.createElement('table');

	if('undefined' !== typeof(panel)) 
    {
		panel.appendChild(table);
	}

	if(width && width != '') 
    {
        table.width = width;
	}
    table.border = border;
    table.cellSpacing = spacing;
    table.cellPadding = padding;
    if(bgcolor && bgcolor != '') {
        table.bgColor = bgcolor;
    }
    for(var ri = 0; ri < rows; ri ++) 
    {
        var row = table.insertRow(-1);
        for(var ci = 0; ci < cells; ci ++) 
        {
            var cell = row.insertCell(-1);
            if(align) 
            {
		if(is_array(align)) {
			if(align.length >= ci) {
                		cell.align = align[ci];
			}else {
				cell.align = align[align.length - 1];
			}
		}else if(align.length > 0) {
			cell.align = align;
		}
            }
	    if(valign && valign != '') 
            {
                cell.vAlign = valign;
            }
        }
    }
    return table;
}

function tblCell(tbl, row, cell) 
{
    return tbl.rows[row].cells[cell];
}

function removeChildFromNode(child, node) {
	removeAllChildNodes(child);
	if(node && node.hasChildNodes && node.removeChild && child && child.parentNode === node) {
		var a = node.removeChild(child);
		EventManager.CleanObj(a);
		delete a;
	}
}

function removeAllChildNodes(node) {
	if (node && node.hasChildNodes && node.removeChild) {
		while (node.hasChildNodes()) {
			removeAllChildNodes(node.firstChild);
			var tmp_node = node.removeChild(node.firstChild);
			if(tmp_node) {
				if ('undefined' !== typeof(tmp_node.__destructor)) {
					tmp_node.__destructor();
					tmp_node.__destructor = null;
				}
				EventManager.CleanObj(tmp_node);
				delete tmp_node;
			}
		}
	}
} // removeAllChildNodes()

function newTextArea(name, content, cols, rows, id) {
	var txt_area = document.createElement('textarea');
	txt_area.name = name;
	if(id && id != '') {
		txt_area.id = id;
	}
	txt_area.value = content;
	txt_area.cols = cols;
	txt_area.rows = rows;
	return txt_area;
}

function objectTextArea(name, width, height, content) {
	var txt_tbl = document.createElement('table');
	txt_tbl.border = 0;
	txt_tbl.cellSpacing = 0;
	txt_tbl.cellPadding = 0;
	if(document.designMode) {
		var txt_area = document.createElement('iframe');
		txt_area.id = name;
		txt_area.name = name;
		txt_area.style.width = width   + 'px';
		txt_area.width = width;
		txt_area.style.height = height + 'px';
		txt_area.height = height;
		txt_area.frameBorder = 0;
		txt_area.style.border = '1px solid #888888';
		txt_area.style.backgroundColor = '#FFFFFF';
		txt_area.marginHeight = 2;
		txt_area.marginWidth = 2;
		if(content) {
			txt_area.content = content;
		}else {
			txt_area.content = '';
		}
		cell.appendChild(txt_area);
	}else {
		var txt_area = document.createElement('textarea');
		txt_area.id = name;
		txt_area.style.width = width   + 'px';
		txt_area.style.height = height + 'px';
		txt_area.style.border = '1px solid #888888';
		txt_area.value = content;
		var row = txt_tbl.insertRow(-1);
		var cell = row.insertCell(-1);
		cell.appendChild(txt_area);
	}
	return txt_tbl;
}

function initTextAreaContent(name) {
	if(document.designMode) {
		var obj = document.getElementById(name);
		var doc = getExecDocument(name);
		doc.designMode = 'On';
		var newdoc = doc.open('text/html', 'replace');
		if(!newdoc) {
			newdoc = doc;
		}
		newdoc.write("<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><meta http-equiv=\"Content-Language\" content=\"zh-cn\"></head>");
		newdoc.write("<body leftmargin=2 topmargin=2 style='font-size:14px;cursor:text;width:" + String(obj.width - 15) + "px;height:" + String(obj.height - 15) + "px'>");
		newdoc.write(obj.content);
		newdoc.write('</body></html>');
		newdoc.close();
	}else {
		document.getElementById(name).value = content;
	}
}

function getIFrameDocument(name) {
	var iframe = document.getElementById(name);
	var doc = iframe.contentWindow || iframe.contentDocument;
	if(doc.document) {
		doc = doc.document;
	}
	return doc;
}

function onSendMessageOK() {
	//var msg = getTextAreaContent('message_editor');
	var msg = getEditorContent('message_editor');
	if(!validEditorContent('message_editor')) {
		showAlert('不能发送空白消息 :-(');
		return false;
	}
	var form = document.getElementById('_send_msg_form');
	form._msg_content.value = msg;

	if('undefined' === typeof(form._to_contacts) && form._to_id.value == '') {
		showAlert('请指定有效的收件人!');
		return false;
	}

	form.submit();
	return false;
}

function onSendMessageCancel() {
	if(validEditorContent('message_editor')) {
		showConfirm({msg: '将关闭消息窗口，您编辑的消息将会丢失，确定关闭消息窗口？', onOK: function() { closeDiagWindow('message_box'); }, onCancel: function () { return;}});
		return false;
	}else {
		return true;
	}
}

function sendMessageContent(pane, dat) {
	var form = newFormElement('send_email.php', 'post', '_ajax_iframe');
	form.id = '_send_msg_form';
	pane.appendChild(form);

	form.appendChild(newInputElement('hidden', '_type', dat.type));
	form.appendChild(newInputElement('hidden', '_callback', dat.callback));
	form.appendChild(newInputElement('hidden', '_from_id', dat.from_id));
	form.appendChild(newInputElement('hidden', '_from_email', dat.from_email));
	form.appendChild(newInputElement('hidden', '_from_name', dat.from_nickname));
	if(dat.to_id > 0) {
		form.appendChild(newInputElement('hidden', '_to_id',    dat.to_id));
		form.appendChild(newInputElement('hidden', '_to_email', dat.to_email));
	}else if('undefined' !== typeof(dat.to_contacts) && dat.to_contacts != null) {
		form.appendChild(newInputElement('hidden', '_to_contacts', JSON.stringify(dat.to_contacts)));
	}else {
		form.appendChild(newInputElement('hidden', '_to_id',    ''));
		form.appendChild(newInputElement('hidden', '_to_email', ''));
	}

	form.appendChild(newInputElement('hidden', '_msg_content', ''));
	if(dat.title) {
		form.appendChild(newInputElement('hidden', '_title', dat.title));
	}
	if(dat.topic_id) {
		form.appendChild(newInputElement('hidden', '_topic_id', dat.topic_id));
	}
	if(dat.owner_id) {
		form.appendChild(newInputElement('hidden', '_owner_id', dat.owner_id));
	}
	if(dat.owner_tbl) {
		form.appendChild(newInputElement('hidden', '_owner_tbl', dat.owner_tbl));
	}

	var pane = newTableElement('', 0, 4, 0, '', 3, 1, 'left', 'top');
	form.appendChild(pane);
	var pane1 = newTableElement('', 0, 0, 0, '', 2, 2, 'left', 'middle');
	tblCell(pane, 0, 0).appendChild(pane1);
	//tblCell(pane1, 0, 0).innerHTML = '来自：';
	//tblCell(pane1, 0, 1).innerHTML = dat.from_nickname + " &lt;" + dat.from_email + "&gt;";
	tblCell(pane1, 1, 0).innerHTML = '写给：';
	if(dat.to_id > 0) {
		tblCell(pane1, 1, 1).innerHTML = dat.to_nickname + " &lt;" + dat.to_email + "&gt;";
	}else if('undefined' !== typeof(dat.to_contacts) && null != dat.to_contacts) {
		makeButton(tblCell(pane1, 1, 1), {
			text: dat.to_contacts[0].to_nickname + ' &lt;' + dat.to_contacts[0].to_email + '&gt; 等 (共' + dat.to_contacts.length + '位联系人)',
			align: 'left',
			to_contacts: dat.to_contacts,
			onclick: function (e, obj, conf) {
				var pop = getPopupContainer(obj);
				pop.width = findWidth(obj);
				pop.style.backgroundColor = '#FFFFFF';
				pop.style.border = '1px solid #BBBBBB';
				pop.style.textAlign = 'left';
				var str = '';
				for(var i = 0; i < conf.to_contacts.length; i ++) {
					if(str != '') {
						str += ', ';
					}
					str += conf.to_contacts[i].to_nickname + ' &lt;' + conf.to_contacts[i].to_email + '&gt;';
				}
				pop.innerHTML = str;
			}
		});
	}else {
		var to_input = newInputElement('text', '_to_email_input', '');
		to_input.style.width = '300px';
		tblCell(pane1, 1, 1).appendChild(to_input);
		makeSearchBox(to_input, {
			user_type: USER_TYPE_ALL_REGIST,
			msg_form: form,
			box: to_input,
			onselect: function(rec) {
				this.msg_form._to_id.value    = rec.id;
				this.msg_form._to_email.value = rec.email;
				this.box.value = rec.email;
			},
			onblur: function(b, c) {
				b.value = c.msg_form._to_email.value;
			}
		});
	}
	makeRichTextEditor(tblCell(pane, 1, 0), 'message_editor', 400, 150, dat.content, {emotions: [img_emotion, img_chars, img_digit, img_shasha]});
	if(dat.quote && dat.quote != '') {
		var quote_chk = newInputElement('checkbox', '', '1');
		quote_chk._data = dat.quote;
		quote_chk.__destructor = function() {
			quote_chk._data = null;
		};
		tblCell(pane, 2, 0).appendChild(quote_chk);
		tblCell(pane, 2, 0).appendChild(newTextNode('引用原文'));
		tblCell(pane, 2, 0).align = 'right';
		EventManager.Add(quote_chk, 'click', function(ev, obj) {
			if(obj.checked) {
				insertQuotation('message_editor', obj._data);
			}else {
				removeQuotation('message_editor');
			}
		});
	}

	return form;
}

function enableEnterKey(form) {
	form.onkeypress = null;
}

function disableEnterKey(form) {
	form.onkeypress = function(ev) {
		if(!ev) {
			ev = window.event;
		}
		if(ev.keyCode == 13) {
			return false;
		}else {
			return true;
		}
	}
}

function showMessageBox(dat) {
	var content = showDialog({
		id: 'message_box',
		is_modular: false,
		width: 430,
		caption: '写消息',
		onOK: function() {
			return onSendMessageOK();
		},
		okText: '发送',
		defaultButton: 'ok',
		onCancel: function() {
			return onSendMessageCancel();
		},
		cancelText: '关闭窗口'
	});
	sendMessageContent(content, dat);
	//initTextAreaContent('message_editor');
}

function closeMessageBox() {
	closeDiagWindow('message_box');
}

function showChangePageControl(total, page_limit, page_offset, onChangePage, pobj) {
        var table = document.createElement('table');
	if(pobj) {
		pobj.appendChild(table);
	}
        table.border = 0;
        table.cellSpacing = 5;
        table.cellPadding = 0;
        table.style.color = '#888888';
        table.style.fontSize = '12px';
        var row = table.insertRow(-1);
        var pagenum = Math.ceil(total / page_limit);
        if(pagenum > 1) {
                var curpage = Math.floor(page_offset/page_limit);
		//alert(page_offset + ';' + page_limit + ';' + curpage);
                var show_dot = false;
                for(var pi = 0; pi < pagenum; pi ++) {
                        if(pagenum <= 5 || pi == 0 || pi == pagenum - 1 || (pi >= curpage - 2 && pi <= curpage + 2)) {
                                var page_text = '' + (pi + 1) + '';
                                var page_index = pi;
                                var cell = row.insertCell(-1);
                                cell.pagenum = page_index;
                                cell.innerHTML = page_text;
                                cell.width  = 14;
                                cell.height = 14;
                                cell.align = 'center';
                                cell.vAlign = 'middle';
                                if(pi != curpage) {
                                        //cell.style.border = '1px solid #888888';
                                        cell.style.border = '1px solid #218a01';
                                        cell.style.cursor = 'pointer';
                                        EventManager.Add(cell, 'mouseover', function(e, obj) {
                                                obj.style.backgroundColor = '#CCCCCC';
                                                return false;
                                        });
                                        EventManager.Add(cell, 'mouseout', function(e, obj) {
                                                obj.style.backgroundColor = '';
                                                return false;
                                        });
                                        EventManager.Add(cell, 'click', function (e, obj) {
                                                onChangePage(obj.pagenum);
                                                return false;
                                        });
                                }else {
					//cell.style.border = '1px solid #666666';
					cell.style.border = '1px solid #218a01';
					//cell.style.backgroundColor = '#AAAAAA';
					cell.style.backgroundColor = '#68be4e';
					cell.style.color = '#EEEEEE';
				}
                                show_dot = false;
                        }else if(!show_dot) {
                                var cell = row.insertCell(-1);
                                cell.innerHTML = '<b>&middot;&middot;&middot;</b>';
                                show_dot = true;
                        }
                }
		//var cell = row.insertCell(-1);
		//cell.innerHTML = '(共' + total + '项)';
        }
        return table;
}

function beginUpdatePanelContent(panel_name) {
        var pname = '_' + panel_name + '_content';
        var panel = document.getElementById(pname);
        if(panel) {
                removeAllChildNodes(panel);
                panel.innerHTML = "<div align=center><table width=100 height=100 border=0><tr><td valign=center align=center><img src='" + IMAGE_ROOT + "/loading22.gif'></td></tr></table></div>";
        }
}

function fileExtension(filename) {
        return filename.substr(filename.lastIndexOf('.')+1).toLowerCase();
}

function getFileType(filename) {
        var ext = fileExtension(filename);
        if('jpg' == ext || 'gif' == ext || 'png' == ext || 'jpeg' == ext) {
                return 'image';
        }else if('swf' == ext) {
                return 'flash';
        }else if('mp3' == ext || 'wav' == ext || 'wma' === ext) {
                return 'audio';
        }else if('flv' == ext || 'mpg' == ext || 'mpeg' == ext || 'mov' == ext || 'avi' == ext || 'wmv' == ext) {
                return 'video';
        }else {
                return 'unknown';
        }
}

function objectUploadControl(obj) {
        var form = newFormElement(obj.url, 'POST', '_ajax_iframe');
        form.enctype='multipart/form-data';
        form.encoding='multipart/form-data';
        for(key in obj.params) {
                form.appendChild(newInputElement('hidden', key, obj.params[key]));
        }
        form.appendChild(newInputElement('hidden', '_callback', obj.callback));
        form.appendChild(newInputElement('hidden', 'MAX_FILE_SIZE', obj.maxsize));
        var uploader = newInputElement('file', obj.name, '');
        form.appendChild(uploader);
	if(!uploader.form) {
		uploader.form = form;
	}
        uploader.onchange = function(e) {
                var ext = fileExtension(this.value);
                for(var ei = 0; ei < obj.extensions.length; ei ++) {
                        if(ext == obj.extensions[ei]) {
                                break;
                        }
                }
                if(ei < obj.extensions.length) {
			if(this.form) {
				this.form.submit();
			}else {
                        	this.parentNode.submit();
			}
                }else {
                        showAlert('不是指定的文件类型！');
                }
                return false;
        };
        return form;
}

function newParagraph(text) {
        var p = document.createElement('p');
        p.innerHTML = text;
        return p;
}

/*
 * send a request through hidden form
 *
 * @param urlobj object {url: target_url, target: target, default is _new, method: request method, default is GET, params: object}
 * @return void
 */
function sendURLRequest(urlobj, sync) {
        var form = document.getElementById('_ajax_form');
        removeAllChildNodes(form);
	if(urlobj.url) {
		form.action = urlobj.url;
        }else {
		form.action = LIBUI_REQUEST_HANDLER_SCRIPT;
	}
	if(urlobj.target) {
        	form.target = urlobj.target;
	}else {
		form.target = '_new';
	}
	if(urlobj.method) {
		form.method = urlobj.method;
	}else {
		form.method = 'GET';
	}
	for(var key in urlobj.params) {
		form.appendChild(newInputElement('hidden', key, urlobj.params[key]));
	}
	if('undefined' !== typeof(sync) && sync==true) {
		disablePageInput();
	}
	form.submit();
}

function newTableCell(tbl, align, valign) {
        var row = tbl.insertRow(-1);
        var cell = row.insertCell(-1);
        cell.align = align;
        cell.vAlign = valign;
        return cell;
}

document.getElementsByClassName=function(){
var a = new Array();
var e;
var i = 0;
while (e = document.getElementsByTagName ('*')[i++]){
if(e.className == arguments[0]){
a.push (e);
};
};
return a;
};

function makeButtonActive(obj) {
	if(obj.conf && obj.conf.bgcolor_over) {
		if(obj.conf.bordercolor_over) {
			obj.style.border = '1px solid ' + obj.conf.bordercolor_over;
		}
               	obj.style.backgroundColor = obj.conf.bgcolor_over;
	}else{
		obj.style.textDecoration = 'underline';
	}
}

function makeButtonChecked(obj) {
	obj.checked = true;
	if(obj.conf && obj.conf.bgcolor_checked) {
		if(obj.conf.bordercolor_checked) {
			obj.style.border = '1px solid ' + obj.conf.bordercolor_checked;
		}
               	obj.style.backgroundColor = obj.conf.bgcolor_checked;
	}else{
		obj.style.textDecoration = 'underline';
	}
}

function makeButtonInactive(obj) {
	if(obj.checked) {
		obj.checked = false;
	}
	if(obj.conf && obj.conf.bgcolor_out) {
		if(obj.conf.bordercolor_out) {
			obj.style.border = '1px solid ' + obj.conf.bordercolor_out;
		}
		obj.style.backgroundColor = obj.conf.bgcolor_out;
	}else {
		obj.style.textDecoration = 'none';
	}
}

function makeButton(obj, conf) {
	if(conf.text) {
		obj.innerHTML = conf.text;
	}
	if(conf.align) {
		obj.align = obj.align;
	}else {
		obj.align = 'center';
	}
	if(conf.vAlign) {
		obj.vAlign = conf.vAlign;
	}else {
		obj.vAlign = 'middle';
	}
	if(conf.width) {
		obj.width = conf.width;
	}
	if(conf.title) {
		obj.title = conf.title;
	}
	obj.style.cursor = 'pointer';
	if(conf.className) {
		obj.className = conf.className;
	}

	if(conf.image) {
		obj.style.background = "url('" + conf.image + "') no-repeat center left";
		if(conf.image_width) {
			obj.style.paddingLeft = conf.image_width + 'px';
		}else {
			obj.style.paddingLeft = '20px';
		}
	}

	if('undefined' !== typeof(conf.bgcolor_out)) {
		if(conf.bordercolor_out) {
			obj.style.border = '1px solid ' + conf.bordercolor_out;
		}
		obj.style.backgroundColor = conf.bgcolor_out;
	}
	obj.conf = conf;
	obj.__destructor = function() {
		this.conf = null;
	}
	EventManager.Add(obj, 'mouseover', function(e, obj) {
		if(obj.checked && obj.checked == true) {
			return false;
		}
		makeButtonActive(obj);
                return false;
        });
        EventManager.Add(obj, 'mouseout', function(e, obj) {
		if(obj.checked && obj.checked == true) {
			return false;
		}
		makeButtonInactive(obj);
		return false;
	});
        EventManager.Add(obj, 'click', function(e, obj) {
		if(obj.conf) {
			if(obj.className) {
				var siblings = document.getElementsByClassName(obj.className);
				//alert(siblings.length);
				for(var i = 0; i < siblings.length; i ++) {
					if(obj === siblings[i]) {
						makeButtonChecked(siblings[i]);
					}else {
						siblings[i].checked = false;
						makeButtonInactive(siblings[i]);
					}
				}
			}
			return obj.conf.onclick(e, obj, obj.conf);
		}else {
			return false;
		}
        });
}

function objectCalendarPanel(preset, year, month, callback) {
	var setdate = new Date();
	setdate.setFullYear(year);
	setdate.setMonth(month);
	setdate.setDate(1);
	setdate.setHours(1);
	var curmonth = setdate.getMonth();
	var start_tm = setdate.getTime();
	if(setdate.getDay() != 0) {
		start_tm -= setdate.getDay()*24*60*60*1000;
	}
	var end_tm = start_tm + 4*7*24*60*60*1000;
	setdate.setTime(end_tm);
	while(setdate.getMonth() == curmonth) {
		end_tm += 7*24*60*60*1000;
		setdate.setTime(end_tm);
	}
	var weeks = (end_tm - start_tm)/(7*24*60*60*1000);
	var tbl = newTableElement('', 0, 0, 1, '', weeks + 1, 7, 'center', 'middle');
	tbl.style.fontSize = '12px';
	var now = new Date();
	var week_day_str = ['日', '一', '二', '三', '四', '五', '六'];
	for(var w = -1; w < weeks; w ++) {
		for(var d = 0; d < 7; d ++) {
			var cell = tblCell(tbl, w+1, d);
			if(w == -1) {
				cell.innerHTML = week_day_str[d];
				cell.style.borderBottom = '1px dotted #BBBBBB';
				if(d == 0 || d == 6) {
					cell.bgColor = '#EEEEEE';
				}else {
					cell.bgColor = '#DDDDDD';
				}
			}else {
				setdate.setTime(start_tm + (w*7 + d)*24*60*60*1000);
				cell.weekday = setdate.getDay();
				cell.day = setdate.getDate();
				cell.month = setdate.getMonth();
				cell.year = setdate.getFullYear();
				if(setdate.getMonth() != curmonth) {
					cell.style.color = '#888888';
				}else {
					cell.style.color = '#000000';
					cell.style.fontWeight = 'bold';
				}
				var bgc = '#FFFFFF';
				if(setdate.getFullYear() == now.getFullYear() && setdate.getMonth() == now.getMonth() && setdate.getDate() == now.getDate()) {
					cell.style.color = '#BB2222';
				}
				if(setdate.getFullYear() == preset.getFullYear() && setdate.getMonth() == preset.getMonth() && setdate.getDate() == preset.getDate()) {
					bgc = '#CCCCCC';
				}
				makeButton(cell, {
					text: setdate.getDate(),
					width: 15,
					bgcolor_out: bgc,
					bgcolor_over: '#EEEEEE',
					bordercolor_out: bgc,
					bordercolor_over: '#BBBBBB',
					onclick: function(ev, obj, conf) {
						if(callback) {
							callback(obj.year, obj.month+1, obj.day, obj.weekday);
						}
						return false;
					}
				});
			}
		}
	}
	return tbl;
}


function changeCalendarDate(calendar) {
	var cell = tblCell(calendar, 1, 0);
	var year_cell = tblCell(tblCell(calendar, 0, 0).firstChild, 0, 2);
	var month_cell = tblCell(tblCell(calendar, 0, 0).firstChild, 0, 4);
	year_cell.innerHTML = calendar.curyear;
	month_cell.innerHTML = (calendar.curmonth + 1);
	removeAllChildNodes(cell);
	cell.appendChild(objectCalendarPanel(calendar.preset_date, calendar.curyear, calendar.curmonth, calendar.callback));
}

function objectCalendar(preset_date, callback) {
	var tbl = newTableElement('', 0, 0, 0, '#FFFFFF', 2, 1, 'center', 'top');
	tbl.style.border = '1px solid #BBBBBB';
	tbl.style.margin = '2px';

	var current = new Date();
	if(typeof preset_date === 'undefined' || preset_date.getFullYear() < current.getFullYear() - 100) {
		preset_date = new Date();
	}
	tbl.callback = callback;
	tbl.preset_date = preset_date;
	tbl.curyear = preset_date.getFullYear();
	tbl.curmonth = preset_date.getMonth();

	var year_month_tbl = newTableElement('', 0, 0, 0, '', 1, 8, 'center', 'middle');
	year_month_tbl.style.fontSize = '13px';
	//if(!style || style != 'droplist') {
		var p_y_btn = newImageElement('', IMAGE_ROOT + '/ppreview.gif', 12, 12, 0, '前一年');
		tblCell(year_month_tbl, 0, 0).appendChild(p_y_btn);
		tblCell(year_month_tbl, 0, 0).width = 16;
		makeButton(p_y_btn, {
			bgcolor_out: '#FFFFFF',
			bordercolor_out: '#FFFFFF',
			bgcolor_over: '#CCCCCC',
			bordercolor_over: '#AAAAAA',
			params: tbl,
			onclick: function(ev, obj, conf) {
				conf.params.curyear --;
				changeCalendarDate(conf.params);
			}
		});
		var n_y_btn = newImageElement('', IMAGE_ROOT + '/fforward.gif', 12, 12, 0, '下一年');
		tblCell(year_month_tbl, 0, 7).appendChild(n_y_btn);
		tblCell(year_month_tbl, 0, 7).width = 16;
		makeButton(n_y_btn, {
			bgcolor_out: '#FFFFFF',
			bordercolor_out: '#FFFFFF',
			bgcolor_over: '#CCCCCC',
			bordercolor_over: '#AAAAAA',
			params: tbl,
			onclick: function(ev, obj, conf) {
				conf.params.curyear ++;
				changeCalendarDate(conf.params);
			}
		});
		var p_m_btn = newImageElement('', IMAGE_ROOT + '/preview.gif', 12, 12, 0, '前一月');
		tblCell(year_month_tbl, 0, 1).appendChild(p_m_btn);
		tblCell(year_month_tbl, 0, 1).width = 16;
		makeButton(p_m_btn, {
			bgcolor_out: '#FFFFFF',
			bordercolor_out: '#FFFFFF',
			bgcolor_over: '#CCCCCC',
			bordercolor_over: '#AAAAAA',
			params: tbl,
			onclick: function(ev, obj, conf) {
				conf.params.curmonth --;
				if(conf.params.curmonth < 0) {
					conf.params.curyear --;
					conf.params.curmonth = 11;
				}
				changeCalendarDate(conf.params);
			}
		});
		var n_m_btn = newImageElement('', IMAGE_ROOT + '/forward.gif', 12, 12, 0, '下一月');
		tblCell(year_month_tbl, 0, 6).appendChild(n_m_btn);
		tblCell(year_month_tbl, 0, 6).width = 16;
		makeButton(n_m_btn, {
			bgcolor_out: '#FFFFFF',
			bordercolor_out: '#FFFFFF',
			bgcolor_over: '#CCCCCC',
			bordercolor_over: '#AAAAAA',
			params: tbl,
			onclick: function(ev, obj, conf) {
				conf.params.curmonth ++;
				if(conf.params.curmonth > 11) {
					conf.params.curyear ++;
					conf.params.curmonth = 0;
				}
				changeCalendarDate(conf.params);
			}
		});
	//}
	tblCell(year_month_tbl, 0, 2).width = 32;
	tblCell(year_month_tbl, 0, 2).height = 24;
	tblCell(year_month_tbl, 0, 2).style.fontWeight = 'bold';
	tblCell(year_month_tbl, 0, 3).innerHTML = '年';
	tblCell(year_month_tbl, 0, 4).width = 16;
	tblCell(year_month_tbl, 0, 4).height = 24;
	tblCell(year_month_tbl, 0, 4).style.fontWeight = 'bold';
	tblCell(year_month_tbl, 0, 5).innerHTML = '月';

	//if(style && style === 'droplist') {
		var now = new Date();
		var year_box = tblCell(year_month_tbl, 0, 2);
		var year_sel_range = makeNumberRange(now.getFullYear() - 60, now.getFullYear() + 5, 1);
		makeDroplistSelector(year_box, {
			options: year_sel_range, 
			params: tbl,
			title: '点击修改年',
			onchange_callback: function(ev, value, conf) {
				conf.params.curyear = Number(value);
				changeCalendarDate(conf.params);
			}
		});
		var month_box = tblCell(year_month_tbl, 0, 4);
		var month_sel_range = makeNumberRange(1, 12, 1);
		makeDroplistSelector(month_box, {
			options: month_sel_range,
			params: tbl,
			title: '点击修改月份',
			onchange_callback: function(ev, value, conf) {
				conf.params.curmonth = Number(value) - 1;
				changeCalendarDate(conf.params);
			}
		});
	//}

	tblCell(tbl, 0, 0).appendChild(year_month_tbl);
	changeCalendarDate(tbl);

	return tbl;
}

function makeNumberRange(start, end, step) {
	var numbers = new Array();
	for(var i = start; i <= end; i += step) {
		numbers[numbers.length] = i;
	}
	return numbers;
}

function makeDroplistSelector(tdobj, conf) {
	tdobj.style.cursor = 'pointer';
	tdobj.options = conf.options;
	tdobj.onchange_func = conf.onchange_callback;
	tdobj.title = conf.title;
	tdobj.style.background = "url(" + IMAGE_ROOT + "/icon_dropdown.gif) no-repeat right center";
	tdobj.style.padding = '0px';
	tdobj.style.paddingRight = '15px';
	//tdobj.style.border = '1px solid #BBBBBB';
	if(conf.value) {
		tdobj.innerHTML = conf.value;
	}
	//tdobj.style.border = '1px solid #CCCCCC';
	//EventManager.Add(tdobj, 'mouseover', function(ev, obj) {
		//obj.style.border = '1px solid #FFFFFF';
	//	obj.style.textDecoration = 'underline';
	//});
	//EventManager.Add(tdobj, 'mouseout', function(ev, obj) {
		//obj.style.border = '1px solid #CCCCCC';
	//	obj.style.textDecoration = 'none';
	//});
	EventManager.Add(tdobj, 'click', function(e, obj) {
		if(obj !== tdobj || (obj.firstChild && obj.firstChild.nodeName == 'SELECT')) {
			return false;
		}
		var default_val = obj.innerHTML;
		obj.innerHTML = '';
		obj.style.background = "";
		obj.style.padding = '0px';
		var sel = newSelector(obj.options, default_val);
		obj.appendChild(sel);
		sel.focus();
		EventManager.Add(sel, 'blur', function(e, selobj) {
			var cell = selobj.parentNode;
			var default_val = selobj.options[selobj.selectedIndex].text;
			removeAllChildNodes(cell);
			cell.innerHTML = default_val;
			cell.style.background = "url(" + IMAGE_ROOT + "/icon_dropdown.gif) no-repeat right center";
			cell.style.paddingRight = '15px';
			return false;
		});
		EventManager.Add(sel, 'change', function(e, selobj) {
			var cell = selobj.parentNode;
			var default_val = selobj.options[selobj.selectedIndex].text;
			removeAllChildNodes(cell);
			cell.innerHTML = default_val;
			cell.style.background = "url(" + IMAGE_ROOT + "/icon_dropdown.gif) no-repeat right center";
			cell.style.paddingRight = '15px';
			cell.onchange_func(e, default_val, conf);
			return false;
		});
		return false;
	});
}

function is_array(mixed_var) {  
	// Returns true if variable is an array    
	//   
	var key = '';  

	if (!mixed_var) {  
		return false;  
	}

	if('object' === typeof mixed_var) {
		if (mixed_var.hasOwnProperty) {
			for (key in mixed_var) {
				// Checks whether the object has the specified property  
				// if not, we figure it's not an object in the sense of a php-associative-array.  
				if (false === mixed_var.hasOwnProperty(key)) {
					return false;
				}
			}
		}

		// Uncomment to enable strict JavsScript-proof type checking  
		// This will not support PHP associative arrays (JavaScript objects), however  
		// Read discussion at: http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_is_array/  
		//  
		if (mixed_var.propertyIsEnumerable('length') || typeof mixed_var.length !== 'number') {  
			return false;  
		}  

		return true;  
	}
	return false;  
}

/*
 * Reset the value of a selector control
 *
 * @param sel DOM object, the selector to reset
 * @param val string|number, the value to reset
 * @return boolean true is set else false
 */
function resetSelector(sel, val) {
	for(var i = 0; i < sel.options.length; i ++) {
		if(sel.options[i].value === String(val)) {
			sel.options[i].selected = true;
			return true;
		}
	}
	return false;
}

/*
 * Create a selector control
 *
 * @param options object|array 
 */
function newSelector(options, default_value, name, id) {
	var sel = document.createElement('select');
	if('undefined' !== typeof(name) && name != '') {
		sel.name = name;
		if('undefined' === typeof(id)) {
			sel.id = name;
		}
	}
	if('undefined' !== typeof(id) && id != '') {
		sel.id = id;
	}
	// disable mouse wheel, so options won't be changed by mouse wheel
	sel.onmousewheel=function(){return false};
	if(is_array(options)) {
		for(var i = 0; i < options.length; i++) {
			var opt = document.createElement('option');
			if("object" !== typeof options[i]) {
				opt.text = options[i];
				opt.value = options[i];
			}else {
				opt.text = options[i].txt;
				opt.value = options[i].val;
			}
			try{
				sel.add(opt, null);
			}catch(ex) {
				sel.add(opt);
			}
			if(("object" !== typeof(options[i]) && String(options[i]) == String(default_value)) ||
			   (String(options[i].val) === String(default_value))) {
				opt.defaultSelected = true;
				opt.selected = true;
			}
		}
	}else {
		for(var key in options) {
			var opt = document.createElement('option');
			opt.text = options[key];
			opt.value = key;
			try {
				sel.add(opt, null);
			}catch(ex) {
				sel.add(opt);
			}
			if(String(default_value) === String(opt.value)) {
				opt.selected = true;
				opt.defaultSelected = true;
			}
		}
	}
	return sel;
}

var _popup_container = null;

function getPopupContainer(obj) {
	clearPopupContainer();
	_popup_container = document.createElement('div');
	_popup_container.style.position = 'absolute';
	if(obj.x && obj.y && 'undefined' === typeof(obj.nodeName)) {
		_popup_container.style.left = obj.x + 'px';
		_popup_container.style.top  = obj.y + 'px';
		_popup_container.master = null;
	}else {
		_popup_container.style.left = findPosX(obj) + 'px';
		_popup_container.style.top  = findPosY(obj) + findHeight(obj) + 'px';
		_popup_container.master = obj;
	}
	//_popup_container.style.zIndex = 10;
	document.body.appendChild(_popup_container);
	return _popup_container;
	var tbl = newTableElement('', 0, 0, 0, '', 1, 2, 'center', 'top', _popup_container);
	//_popup_container.appendChild(tbl);
	var close_icon = newImageElement('', IMAGE_ROOT + '/icon_pclose.gif', 13, 13, 0, '关闭浮动面板');
	tblCell(tbl, 0, 1).appendChild(close_icon);
	tblCell(tbl, 0, 1).vAlign = 'bottom';
	makeThinButton(close_icon);
	EventManager.Add(close_icon, 'click', function(ev, obj) {
		clearPopupContainer();
	});
	EventManager.Add(tblCell(tbl, 0, 1), 'click', function(ev, obj) {
		clearPopupContainer();
	});
	//return _popup_container;
	return tblCell(tbl, 0, 0);
}

function clearPopupContainer() {
	if(_popup_container) {
		removeChildFromNode(_popup_container, document.body);
		_popup_container = null;
	}
}

function inPopupContainer(obj) {
	if(!_popup_container) {
		return false;
	}
	if(obj.x && obj.y && 'undefined' === typeof(obj.nodeName)) {
		if(obj.x >= findPosX(_popup_container) && obj.x < findPosX(_popup_container) + findWidth(_popup_container) 
		   && obj.y >= findPoxY(_popup_container) && obj.y < findPosY(_popup_container) + findHeight(_popup_container)) {
			return true;
		}else {
			return false;
		}
	}
	var node = obj;
	while(node && node.nodeName !== 'BODY' && node !== _popup_container && node != _popup_container.master) {
		node = node.parentNode;
	}
	if(node === _popup_container || node === _popup_container.master) {
		return true;
	}else {
		return false;
	}
}

EventManager.Add(document, 'click', function(e, obj) {
	if(!inPopupContainer(obj)) {
		clearPopupContainer();
	}
	return true;
});


/*
 *
 * New calendar control
 *
 * @param pobj object Panel to create calendar control
 * @param name string Name of the control
 * @param date_str string String of initial date string, in the format of YYYY-MM-DD HH:II:SS
 * @param style string 'datetime' | 'date'
 * @param read_only boolean the control is readonly
 * @return object Calendar control
 */
function newCalendarControl(pobj, name, date_str, style, read_only) {
	if(date_str == null || date_str == '') {
		var now = new Date();
		date_str = zeroFill(now.getFullYear(), 4) + '-' + zeroFill(now.getMonth()+1, 2) + '-' + zeroFill(now.getDate(), 2);
		if(style == 'datetime') {
			date_str += ' ' + zeroFill(now.getHours(), 2) + ':' + zeroFill(now.getMinutes(), 2) + ':' + zeroFill(now.getSeconds(), 2);
		}
	}
	var input = newInputElement('hidden', name, date_str);
	pobj.appendChild(input);
	if('boolean' === typeof(read_only) && read_only === true) {
		if(style == 'datetime') {
			var str = toChineseDateTimeString(date_str);
		}else {
			var str = toChineseDateString(date_str);
		}
		pobj.appendChild(newTextNode(str));
	}else {
		var cur_date = str2date(date_str);
		var tbl = newTableElement('', 0, 0, 0, '', 1, 6, 'center', 'middle', pobj);
		tblCell(tbl, 0, 0).style.border = '1px solid #888888';
		tblCell(tbl, 0, 0).style.padding = '3px';
		tblCell(tbl, 0, 0).style.fontSize = '12px';

		var reset_conf = {
			text: '现在',
			style: style,
			field: input,
			date_ctl: tblCell(tbl, 0, 0),
			onclick: function(ev, obj, conf) {
				var reset_date = new Date();
				var reset_date_str = zeroFill(reset_date.getFullYear(), 4) + '-' + zeroFill(reset_date.getMonth()+1, 2) + '-' + zeroFill(reset_date.getDate(), 2);
				conf.date_ctl.innerHTML = toChineseDateString(reset_date);
				if(conf.style == 'datetime') {
					reset_date_str += ' ' + zeroFill(reset_date.getHours(), 2) + ':' + zeroFill(reset_date.getMinutes(), 2) + ':' + zeroFill(reset_date.getSeconds(), 2);
					resetSelector(conf.hour_ctl, reset_date.getHours());
					resetSelector(conf.min_ctl,  reset_date.getMinutes());
				}
				conf.field.value = reset_date_str;
			}
		};

		makeButton(tblCell(tbl, 0, 0), {
			text: toChineseDateString(cur_date),
			field: input,
			style: style,
			onclick: function(e, obj, conf) {
				var pane = getPopupContainer(obj);
				var preset = str2date(conf.field.value);
				pane.appendChild(objectCalendar(preset, function(y, m, d, w) {
					var od = str2date(conf.field.value);
					conf.field.value = zeroFill(y, 4) + '-' + zeroFill(m, 2) + '-' + zeroFill(d, 2);
					if(conf.style == 'datetime') {
						conf.field.value += ' ' + zeroFill(od.getHours(), 2) + ':' + zeroFill(od.getMinutes(), 2) + ':' + zeroFill(od.getSeconds(), 2);
					}
					obj.innerHTML = toChineseDateString(conf.field.value);
					clearPopupContainer(); 
				}));
			}
		});
		if(style == 'datetime') {
			var hour_sel = newSelector(makeNumberRange(0, 23, 1), cur_date.getHours(), '');
			tblCell(tbl, 0, 1).appendChild(hour_sel);
			hour_sel.field = input;
			hour_sel.__destructor = function() {
				this.field = null;
			};
			EventManager.Add(hour_sel, 'change', function(ev, obj) {
				var od = str2date(obj.field.value);
				obj.field.value = zeroFill(od.getFullYear(), 4) + '-' + zeroFill(od.getMonth()+1, 2) + '-' + zeroFill(od.getDate(), 2) + ' ' + zeroFill(Number(obj.options[obj.selectedIndex].value), 2) + ':' + zeroFill(od.getMinutes(), 2) + ':' + zeroFill(od.getSeconds(), 2);
			});
			tblCell(tbl, 0, 2).innerHTML = '时';
			var minute_sel = newSelector(makeNumberRange(0, 59, 1), cur_date.getMinutes(), '');
			tblCell(tbl, 0, 3).appendChild(minute_sel);
			minute_sel.field = input;
			minute_sel.__destructor = function() {
				this.field = null;
			};
			EventManager.Add(minute_sel, 'change', function(ev, obj) {
				var od = str2date(obj.field.value);
				obj.field.value = zeroFill(od.getFullYear(), 4) + '-' + zeroFill(od.getMonth()+1, 2) + '-' + zeroFill(od.getDate(), 2) + ' ' + zeroFill(od.getHours(), 2) + ':' + zeroFill(Number(obj.options[obj.selectedIndex].value), 2) + ':' + zeroFill(od.getSeconds(), 2);
			});
			tblCell(tbl, 0, 4).innerHTML = '分';

			reset_conf.hour_ctl = hour_sel;
			reset_conf.min_ctl = minute_sel;
		}
		tblCell(tbl, 0, 5).style.fontSize = '10px';
		tblCell(tbl, 0, 5).style.color = '#880000';
		makeButton(tblCell(tbl, 0, 5), reset_conf);
	}
	return input;
}

function showDropDownMenu(obj, items) {
	var container = getPopupContainer(obj);
	var menu_pane = newTableElement('', 0, 0, 0, '#e9e9e9', items.length, 1, 'left', 'middle');
	container.appendChild(menu_pane);
	menu_pane.style.border = '1px outset #BBBBBB';
	menu_pane.style.fontSize = '10px';
	for(var menu_i = 0; menu_i < items.length; menu_i ++) {
		var cell = tblCell(menu_pane, menu_i, 0);
		cell.innerHTML = items[menu_i].menu;
		cell.style.padding = '4px';
		//var normal_style = '1px solid #FFFFFF';
		//cell.style.border = normal_style;
		if (menu_i < items.length - 1) {
			cell.style.borderBottom = '1px solid #a0a0a0';
		}
		cell.style.cursor = 'pointer';
		cell.axis= menu_i;
		EventManager.Add(cell, 'mouseout', function(e, obj) {
			//getEventTarget(e).style.border = normal_style;
			obj.bgColor = '#e9e9e9';
			return false;
		});
		EventManager.Add(cell, 'mousedown', function(e, obj) {
			//getEventTarget(e).style.border = '1px inset #888888';
			obj.bgColor = '#ecf6eb';
			return false;
		});
		EventManager.Add(cell, 'mouseover', function(e, obj) {
			//getEventTarget(e).style.border = '1px outset #888888'
			obj.bgColor = '#f4f4f4';
			return false;
		});
		EventManager.Add(cell, 'click', function (e, obj) {
			if(items[obj.axis].func(items[obj.axis])) {
				clearPopupContainer();
			}
			return false;
		});
	}
}

function sizeString(size) {
	if(size > 1024*1024) {
		return Math.round(size/1024/1024) + '兆';
	}else if(size > 1024) {
		return Math.round(size/1024) + '千';
	}else {
		return size;
	}
}

// obj: {process: LIBUI_REQUEST_HANDLER_SCRIPT, action: 'DELETE', callback: 'callbackFunc', content_id: 'message', maxsize: 1024*1024, params: {}, extensions: ['jpg', 'gif', 'png'], file: 'name'}
function newUploadControl(obj, panel) {
	var req_method = 'POST';
	var target_win = '_ajax_iframe';
	if(LIBUI_AJAX_DEBUG.length > 0 || Number(LIBUI_AJAX_DEBUG) != 0) {
		target_win = '_new';
	}
        var form = newFormElement(obj.process, req_method, target_win);
	panel.appendChild(form);
        form.enctype  = 'multipart/form-data';
        form.encoding = 'multipart/form-data';
	if(obj.params) {
		for(key in obj.params) {
			form.appendChild(newInputElement('hidden', key, obj.params[key]));
        	}
	}
        form.appendChild(newInputElement('hidden', '_action', obj.action));
        form.appendChild(newInputElement('hidden', '_callback', obj.callback));
        form.appendChild(newInputElement('hidden', '_callback_id', obj.callback_id));
        form.appendChild(newInputElement('hidden', 'MAX_FILE_SIZE', obj.maxsize));
        var uploader = newInputElement('file', obj.file, '');
        form.appendChild(uploader);
	uploader.size = 4;
	var ext_str = '文件名后缀为：';
	for(var i = 0; i < obj.extensions.length; i ++) {
		if(i == obj.extensions.length - 1) {
			if(obj.extensions.length > 1) {
				ext_str += '或';
			}
			ext_str += obj.extensions[i] + '。';
		}else {
			ext_str += obj.extensions[i];
			if (i < obj.extensions.length - 2) {
				ext_str += '，';
			}
		}
	}
	form.appendChild(newParagraph('提示: ' + ext_str + '允许上传' + sizeString(obj.maxsize) + '字节。'));
	/*if(!uploader.form) {
		uploader.form = form;
	}*/
	EventManager.Add(uploader, 'change', function(e, fctl) {
                var ext = fileExtension(fctl.value);
                for(var ei = 0; ei < obj.extensions.length; ei ++) {
			if(ext === obj.extensions[ei]) {
                                break;
                        }
                }
                if(ei < obj.extensions.length) {
			if(fctl.form) {
				if('undefined' === typeof(obj.onsubmit) || obj.onsubmit(form, fctl)) {
					fctl.form.submit();
					showProgressBar(fctl.form);
				}
			}else {
				alert('Cannot find the form of this upload control!');
			}
                }else {
                        showAlert('请上传指定后缀的文件。');
                }
                return true;
	});
	return form;
}

function newDefaultUploadControl(panel, action_name, file_name, maxsize, extensions, confname, cb_func, onsubmit) {
	if('string' !== typeof cb_func) {
		cb_func = '_config_content_panel_callback';
	}
	var obj = {process: LIBUI_REQUEST_HANDLER_SCRIPT, action: action_name, callback: cb_func, maxsize: maxsize, file: file_name, extensions: extensions, callback_id: confname};
	if('undefined' !== typeof(onsubmit) && null !== onsubmit) {
		obj.onsubmit = onsubmit;
	}
	var form = newUploadControl(obj, panel);
	return form;
}

function ajaxRPC(func, params, succ_callback, error_callback, sync) {
        params._action = func;
	if('boolean' === typeof(sync) && sync) {
                disablePageInput();
        }
        AJAXRequest({
        url: LIBUI_RPC_SCRIPT,
        method: 'POST',
        params: params,
        onEnd: function(text) {
		if(LIBUI_AJAX_DEBUG.length > 0 || Number(LIBUI_AJAX_DEBUG) != 0) {
			alert(text);
		}
		enablePageInput();
                if(text.indexOf('ERROR:') == 0) {
                        if(error_callback) {
                                error_callback(text);
                        }else {
                                showAlert(text);
                        }
                }else {
                        if(text == '') {
                                var records = new Array();
                        }else {
                                var records = JSON.parse(text);
                        }
                        succ_callback(records);
                        records = null;
                }
        }
        });
}

window.onbeforeunload = confirmExit;

function confirmExit() {
	var objs = document.getElementsByClassName('_progress_bar_class');
	if(objs.length > 0) {
		return '你现在正准备离开当前页面，你正在上传的信息将会丢失，是否继续？';
	}
}

function showProgressBar(form, nobar) {
	var prog_pane = newTableElement('100%', 0, 0, 0, '#888888', 1, 1, 'center', 'middle');
	prog_pane.className = '_progress_bar_class';
	form.progress_bar = prog_pane;
	form.appendChild(prog_pane);
	prog_pane.style.position = 'absolute';
	var x = findPosX(form);
	var y = findPosY(form);
	var w = findWidth(form);
	var h = findHeight(form);
	prog_pane.style.left = x + 'px';
	prog_pane.style.top = y + 'px';
	prog_pane.style.width = w + 'px';
	prog_pane.style.height = h + 'px';
	prog_pane.style.cursor = 'wait';
	prog_pane.style.overflow = 'hidden';
	set_opacity(prog_pane, 0.5);

	if('undefined' !== typeof(nobar) && nobar) {
		return;
	}

	var prog_w = 180;
	var prog_h = 12;
	if(prog_w > w) {
		prog_w = w;
	}
	var prog_bar = newImageElement('', IMAGE_ROOT + '/progress.gif', prog_w, prog_h, 0, '');
	tblCell(prog_pane, 0, 0).appendChild(prog_bar);
	set_opacity(prog_bar, 1);
}

function newRPCForm(obj, panel) 
{
	var form_action = LIBUI_REQUEST_HANDLER_SCRIPT;
	if(obj.process) 
    {
		form_action = obj.process;
	}
	var target_win = '_ajax_iframe';
	var req_method = 'POST';
	if(LIBUI_AJAX_DEBUG.length > 0 || Number(LIBUI_AJAX_DEBUG) != 0) 
    {
		target_win = '_new';
		req_method = 'GET';
	}
	var form = newFormElement(form_action, req_method, target_win);
	if(panel) 
    {
		panel.appendChild(form);
	}
	if(obj.params)
    {
		for(key in obj.params) 
        {
			form.appendChild(newInputElement('hidden', key, obj.params[key]));
        }
	}
    form.appendChild(newInputElement('hidden', '_action', obj.action));
    form.appendChild(newInputElement('hidden', '_callback', obj.callback));
	if('undefined' !== typeof(obj.callback_id)) 
    {
        form.appendChild(newInputElement('hidden', '_callback_id', obj.callback_id));
	}
	form.onsubmit = function(ev) 
    {
		for(var i = 0; i < this.elements.length; i ++) 
        {
			var ele = this.elements[i];
			if(ele.type === 'text' && ele.readOnly === false) 
            {
				ele.value = trimString(ele.value);
			}
		}
		if(obj.onsubmit) 
        {
			if(!obj.onsubmit(this)) 
            {
				return false;
			}
		}
		showProgressBar(this);
		return true;
	};
	return form;
}

function newDefaultRPCForm(panel, action_name, conf_name, onsubmit, cb_func) {
	if('string' !== typeof cb_func) {
		cb_func = '_config_content_panel_callback';
	}
	var params = {
	process: LIBUI_REQUEST_HANDLER_SCRIPT,
	action: action_name,
	callback: cb_func,
	callback_id: conf_name
	};
	if(onsubmit) {
		params.onsubmit = onsubmit;
	}
	var form = newRPCForm(params, panel);
	return form;
}

function getChildNodesByTagName(obj, tagname) {
	var nodes = [];
	var objstack = [obj];
	while(objstack.length > 0) {
		var cur_obj = objstack[objstack.length - 1];
		objstack.splice(objstack.length-1, 1);
		if('undefined' !== typeof(cur_obj.nodeName) && cur_obj.nodeName.toUpperCase() === tagname.toUpperCase()) {
			nodes[nodes.length] = cur_obj;
		}
		if('undefined' !== typeof(cur_obj.childNodes)) {
			for(var i = 0; i < cur_obj.childNodes.length; i ++) {
				objstack[objstack.length] = cur_obj.childNodes[i];
			}
		}
	}
	return nodes;
}

function clearFormProgressBar(form) {
	if(form.progress_bar) {
		//alert('find!');
		removeChildFromNode(form.progress_bar, form);
		form.progress_bar = null;
		//delete form.progress_bar;
		/*for(var i = 0; form.elements.length; i ++) {
			var ele = form.elements[i];
			if(ele && ele.nodeName.toLowerCase()=='input' && ele.type.toLowerCase()=='password' && ele.readOnly !== true) {
				//ele.focus();
				ele.value = "";
			}
		}*/
	}
}

function clearAnyFormProgressBar() {
	for(var i = 0; i < document.forms.length; i ++) {
		clearFormProgressBar(document.forms[i]);
	}
}

function _config_content_panel_callback(cid, msg) {
	var conf = getContentPanelConf(cid);
	var config_div = document.getElementById(conf.name + '_config');
	if(msg != '' && msg.substr(0, 1) != '{') {
		conf.onsuccess = null;
		showAlert(msg);
		if(config_div) {
			var forms = getChildNodesByTagName(config_div, 'form');
			for(var i = 0; i < forms.length; i ++) {
				clearFormProgressBar(forms[i]);
			}
		}
	}else {
		if(conf.onchange) {
			conf.onchange(conf);
		}
		if(conf.onsuccess) {
			conf.onsuccess(conf, msg);
			conf.onsuccess = null;
		}
		if(config_div && config_div.innerHTML != '') {
			_cancel_show_config_panel(conf);
		}
		var content_div = document.getElementById(conf.name + '_content');
		resetPanelContentPage(cid);
		if(content_div.innerHTML != '') {
			_rerequest_panel_content(conf);
		}else {
			_expand_panel_content(conf);
		}
	}
}

function __clean_content_panel_callback_success(cid) {
	var conf = getContentPanelConf(cid);
	conf.onsuccess = null;
}

function onContentPanelUpdateSuccess(confname, onsucc) {
	if('string' === typeof(confname)) {
		var conf = getContentPanelConf(confname);
	}else {
		var conf = confname;
	}
	conf.onsuccess = onsucc;
}

function updatePanelContentRPC(name, action_id, dat, onsucc, sync) {
	if('function' === typeof(onsucc)) {
		var conf = getContentPanelConf(name);
		conf.onsuccess = onsucc;
	}
	var params = {
		_callback: '_config_content_panel_callback',
		_callback_id: name,
		_action: action_id
	};
	for(var key in dat) {
		params[key] = dat[key];
	}
	var req_obj = {
		url: LIBUI_REQUEST_HANDLER_SCRIPT,
		params: params
	};
	if(LIBUI_AJAX_DEBUG.length > 0 || Number(LIBUI_AJAX_DEBUG) != 0) {
		req_obj['target'] = '_new';
		req_obj['method'] = 'GET';
	}else {
		req_obj['target'] = '_ajax_iframe';
		req_obj['method'] = 'POST';
	}
	sendURLRequest(req_obj, sync);
}

function refreshPanelContent(name) {
	var conf = getContentPanelConf(name);
	_request_panel_content(conf);
}

function hideContentPanel(conf) {
	if(typeof(conf) === 'string') {
		var name = conf;
	}else {
		var name = conf.name;
	}
	var div = document.getElementById(name + '_frame');
	removeAllChildNodes(div);
}

function redrawPanelContent(name, silent, reset) {
	var conf = getContentPanelConf(name);
	if('boolean' === typeof(reset) && true === reset) {
		resetPanelContentPage(name);
	}
	_rerequest_panel_content(conf, silent);
}

function _rerequest_panel_content(conf, silent) {
	conf.json_data = null;
	_request_panel_content(conf, silent);
}

function resetPanelContentPage(name) {
	var conf = getContentPanelConf(name);
	if('undefined' !== typeof(conf.page_offset)) {
		conf.page_offset = 0;
	}
}

function _panel_content_request_params(conf) {
	if(conf.query_proc) {
		var params = {
			_query_proc: conf.query_proc
		};
	}else if(conf.query_tables) {
		var params = {
			_query_vars: conf.query_vars,
			_query_tbls: conf.query_tables,
			_query_cond: conf.query_conditions,
			_query_order: conf.query_order,
			_query_limit: conf.page_limit,
			_query_offset: conf.page_offset
		};
	}else if(conf.query_func) {
		var params = {
			_query_func: conf.query_func,
			_query_limit: conf.page_limit,
			_query_offset: conf.page_offset
		};
		for(var key in conf.query_params) {
			params[key] = conf.query_params[key];
		}
	}
	if(conf.query_format) {
		params._query_format = JSON.stringify(conf.query_format);
		if(conf.query_format_params) {
			params._query_params = JSON.stringify(conf.query_format_params);
		}
	}
	return params;
}

function _request_panel_content(conf, silent) {
	if('undefined' === typeof conf.json_data || !conf.json_data) {
		AJAXRequest({
		url: LIBUI_DB_QUERY_SCRIPT,
		params: _panel_content_request_params(conf),
		onEnd: function(text) {
			if(LIBUI_DB_QUERY_DEBUG.length > 0 || Number(LIBUI_DB_QUERY_DEBUG) != 0) {
				alert(text);
			}
			if(text.indexOf('ERROR:') == 0) {
				alert(text);
			}else {
				conf.json_data = JSON.parse(text);
				_display_panel_content(conf);
			}
		},
		method: 'POST'
		});

		if(typeof(silent) !== 'undefined' && silent) {
			return;
		}

		var content_div = document.getElementById(conf.name + '_content');
		var winsize = getWindowSize();
		var w_top = f_scrollTop();
		var w_left = f_scrollLeft();
		var x = findPosX(content_div);
		var y = findPosY(content_div);
		var w = findWidth(content_div);
		var h = findHeight(content_div);

		if(y+h < w_top || y > w_top + winsize.y || x > w_left + winsize.x || x+w < w_left) {
			return;
		}

		var prog_div = document.createElement('div');
		content_div.appendChild(prog_div);
		prog_div.style.position = 'absolute';
		prog_div.style.left = x + 'px';
		prog_div.style.top  = y + 'px';
		prog_div.style.width  = w + 'px';
		prog_div.style.height = h + 'px';
		prog_div.style.background = '#FFFFFF';
		prog_div.style.cursor = 'wait';
		set_opacity(prog_div, 0.7);
		
		/*prog_div.style.left = (x + w/2 - 45) + 'px';
		prog_div.style.top = y + 'px';
		prog_div.style.width = '120px';
		prog_div.style.backgroundColor = '#444444'; //'#fdc51b';
		prog_div.style.color = '#EEEEEE';
		prog_div.innerHTML = "<table border=0><tr><td valign=middle><img src='images/loading.gif'></td><td valign=middle>更新中...</td></tr></table>";
		prog_div.style.textAlign = 'center';
		prog_div.style.padding = '8px';
		prog_div.style.fontWeight = 'bold';*/
	}else {
		_display_panel_content(conf);
	}
}

function hidePanelContent(name) {
	var div = document.getElementById(name + '_content');
	removeAllChildNodes(div);
}

function _display_panel_content(conf) {
	var div = document.getElementById(conf.name + '_content');
	removeAllChildNodes(div);
	if(conf.page_position && (conf.page_position === 'both' || conf.page_position === 'top')) {
		var header = document.createElement('div');
		div.appendChild(header);
		header.align = 'right';
		//alert(conf.json_data.data_len + ':' + conf.page_limit + ':' + conf.page_offset);
		if('undefined' !== conf.json_data.data_len && Number(conf.json_data.data_len) > 0) {
			showChangePageControl(conf.json_data.data_len, conf.page_limit, conf.page_offset, 
			function(pnum) {
				conf.page_offset = Number(pnum) * Number(conf.page_limit);
	        		_rerequest_panel_content(conf);
			}, header);
		}
	}

	var records = conf.json_data.data;
	var rec_len = conf.json_data.data_len;
	if(rec_len == 0) {
		rec_len = records.length;
	}

	var pager_area = document.getElementById(conf.name + '_title_item_count');
	pager_area.innerHTML = '共' + rec_len + '项';

	if (conf.page_position) {
		var limit_area = document.getElementById(conf.name + '_title_item_per_page');
		var page_limit_conf = [10, 25, 50, 100];
		if(rec_len > page_limit_conf[0]) {
			if(limit_area.innerHTML == '') {
				var page_limit_opt = {};
				for(var i = 0; i < page_limit_conf.length; i ++) {
					page_limit_opt['' + page_limit_conf[i]] = '每页' + page_limit_conf[i] + '项';
				}
				page_limit_opt['-1'] = '显示全部';
				var limit_selector = newSelector(page_limit_opt, conf.page_limit, '');
				limit_area.appendChild(limit_selector);
				limit_selector.conf = conf;
				limit_selector.__destructor = function() {
					this.conf = null;
				};
				EventManager.Add(limit_selector, 'change', function(ev, obj) {
					obj.conf.page_limit = Number(obj.options[obj.selectedIndex].value);
					redrawPanelContent(obj.conf.name, false, true);
				});
			}
		}else {
			removeAllChildNodes(limit_area);
		}
	}

	var content = document.createElement('div');
	div.appendChild(content);
	if('undefined' === typeof(conf.panel_scheme)) {
		var scheme_id = -1;
		//content.style.padding = '5px';
		//content.style.backgroundColor = '#FFFFFF';
	}else {
		var scheme_id = conf.panel_scheme;
	}
	var sub_content = newSimpleStylishPanel(content, scheme_id);
	conf.content_func(records, sub_content, conf);
	if(conf.page_position && (conf.page_position === 'both' || conf.page_position === 'bottom')) {
		var footer = document.createElement('div');
		div.appendChild(footer);
		footer.align = 'right';
		if('undefined' !== typeof(conf.json_data.data_len) && Number(conf.json_data.data_len) > 0) {
			showChangePageControl(conf.json_data.data_len, conf.page_limit, conf.page_offset, 
			function(pnum) {
				conf.page_offset = pnum * conf.page_limit;
	        		_rerequest_panel_content(conf);
			}, footer);
		}
	}
}

function _expand_panel_content(conf) {
	var content_div = document.getElementById(conf.name + '_content');
	var icon = tblCell(document.getElementById(conf.name + '_title_tbl'), 0, 0);
	removeAllChildNodes(icon);
	if(content_div.innerHTML != '') {
		removeAllChildNodes(content_div);
		var img_icon = newImageElement('', IMAGE_ROOT + '/toexpand.gif', 14, 14, 0, '展开面板');
	} else {
		_rerequest_panel_content(conf);
		var img_icon = newImageElement('', IMAGE_ROOT + '/expanded.gif', 14, 14, 0, '折叠面板');
	}
	icon.appendChild(img_icon);
	img_icon.style.cursor = 'pointer';
	EventManager.Add(img_icon, 'click', function(e, o) {
		_expand_panel_content(conf);
	});
	content_div = null;
	icon = null;
}

function hideContentConfigPanel(confname) {
	if('string' === typeof(confname)) {
		var conf = getContentPanelConf(confname);
	}else {
		var conf = confname;
	}
	_cancel_show_config_panel(conf);
}

function getNode(id) {
	if('string' === typeof(id)) {
		return document.getElementById(id);
	}else {
		return id;
	}
}

function isDescendent(id1, id2) {
	var node1 = getNode(id1);
	var node2 = getNode(id2);
	var pa = node1.parentNode;
	while(null !== pa && pa !== node2) {
		pa = pa.parentNode;
	}
	return (null !== pa);
}

function getParentNodeByTag(node, tagname) {
	var pa=node.parentNode;
	while(null !== pa && pa.tagName.toLowerCase() != tagname.toLowerCase()){
		pa=pa.parentNode;
	}
	return pa;
}

function getInlineEditArea(cell) {
	var row = getParentNodeByTag(cell, 'tr');
	if(null == row) {
		return null;
	}
	var ridx = row.rowIndex;
	var tbl = getParentNodeByTag(row, 'table');
	var colnum = row.cells.length;
	while(row.cells.length > 0) {
		row.removeChild(row.lastChild);
	}
	var c = row.insertCell(0);
	c.colSpan = colnum;
	c.style.padding = '5px';
	removeAllChildNodes(c);
	var pane = newSimpleStylishPanel(c, 1);
	pane.style.padding = '5px';
	return pane;
}

function newCancelConfigButton(confname) {
	if(typeof(confname) === 'string') {
		var conf = getContentPanelConf(confname);
	}else {
		var conf = confname;
	}
	var cancel_btn = newInputElement('button', '', '取消');
	EventManager.Add(cancel_btn, 'click', function(ev, obj) {
		var config_div = document.getElementById(conf.name + '_config');
		if(isDescendent(obj, config_div)) {
			_cancel_show_config_panel(conf);
		}else {
			_request_panel_content(conf);
		}
	});
	return cancel_btn;
}

function _cancel_show_config_panel(conf) {
	var config_div = document.getElementById(conf.name + '_config');
	if(!config_div) {
		return;
	}
	removeAllChildNodes(config_div);
	if('undefined' !== typeof(config_div.menuCell) && config_div.menuCell != null) {
		config_div.menuCell.style.backgroundColor = '';
		config_div.menuCell.style.color = '';
		var prev_cell = config_div.menuCell;
		config_div.menuCell = null;
		if(conf.config_show_always) {
			_onclick_show_config_panel_menu(conf, prev_cell);
		}
	}
	var master = document.getElementById(conf.name);
	scrollWindowToObj(master);
	//if(f_scrollTop() > findPosY(document.body) + findHeight(document.body)) {
	//	window.scrollTo(0, 0);
	//}
}

function getContentPanelConfigArea(conf) {
	var config_div = document.getElementById(conf.name + '_config');
	return _prepare_config_workingarea(config_div);
}

function _prepare_config_workingarea(panel) {
	removeAllChildNodes(panel);
	var new_panel = document.createElement('div');
	new_panel.style.padding = '5px';
	panel.appendChild(new_panel);
	var working_area = newStylishPanel(new_panel, 4);
	working_area.style.padding = '5px';
	return working_area;
}

function _onclick_show_config_panel_menu(conf, cell) {
	var config_div = document.getElementById(conf.name + '_config');
	if(config_div.menuCell && config_div.menuCell === cell) {
		removeAllChildNodes(config_div);
		config_div.menuCell.style.backgroundColor = '';
		config_div.menuCell.style.color = '';
		var prev_cell = config_div.menuCell;
		config_div.menuCell = null;
		if(conf.config_show_always) {
			_onclick_show_config_panel_menu(conf, prev_cell);
		}
	}else {
		if(config_div.menuCell && config_div.menuCell !== null) {
			config_div.menuCell.style.backgroundColor = '';
			config_div.menuCell.style.color = '';
			config_div.menuCell = null;
		}
		config_div.menuCell = cell;
		config_div.menuCell.style.backgroundColor = '#dadada';
		config_div.menuCell.style.color = '#1b9705';
		removeAllChildNodes(config_div);

		//var working_area = newTableElement('100%', 0, 0, 10, '', 1, 1, 'left', 'top');
		//config_div.appendChild(working_area);
		var working_area = _prepare_config_workingarea(config_div);
		working_area.style.padding = '5px';

		conf.config_func(conf, config_div.menuCell.menuText, working_area);
		if(conf.config_show_always) {
		}else {
			scrollWindowToObj(config_div);
		}
		//var pos_y = findPosY(config_div);
		//if(pos_y < f_scrollTop() || pos_y > f_scrollTop() + f_clientHeight() - 60) {
		//	window.scrollTo(0, pos_y);
		//}
	}
}

function getContentPanelConf(name) {
	if(typeof name === 'string') {
		return document.getElementById(name).conf;
	}else {
		return name.conf;
	}
}

function getContentPanelTitleShoulder(conf) {
	if('string' === typeof(conf)) {
		var name = conf;
	}else {
		var name = conf.name;
	}
	return document.getElementById(name + '_title_shoulder');
}

// conf: {bgcolor: '#FFFFFF', menu: ['str', 'str'], }

function getContentPanelTitle(confname) {
	if('string' === typeof(confname)) {
		var conf = getContentPanelConf(confname);
	}else {
		var conf = confname;
	}
	return document.getElementById(conf.name + '_title');
}

function makeContentPanel(pane, conf) {
	if('string' === typeof(pane)) {
		var pane_ctl = document.getElementById(pane);
	}else {
		var pane_ctl = pane;
	}
	var idstr = pane_ctl.id;
	conf.name = '' + idstr + '';
	pane_ctl.id = idstr + '_frame';
	//pane_ctl.conf = conf;
	//pane_ctl.style.backgroundColor = conf.bgcolor;

	var ppane = newStylishPanel(pane_ctl, conf.frame_scheme, conf.name);
	ppane.conf = conf;

	var tbl = newTableElement('100%', 0, 0, 0, '', 3, 1, 'left', 'middle', ppane);
	//tbl.style.border = '1px solid ' + conf.bgcolor;

	var header_tbl = newTableElement('100%', 0, 0, 0, '', 1, 4, 'left', 'middle', tblCell(tbl, 0, 0));
	header_tbl.id = conf.name + '_title_tbl';
	var bg_desc = "url('" + IMAGE_ROOT + "/nav_title_bg.jpg')";
	if(conf.title_img) {
		bg_desc += ", " + "url(" + conf.title_img + ") no-repeat left center";
	}
	header_tbl.style.background = bg_desc;
	tblCell(header_tbl, 0, 1).height = 39;
	tblCell(header_tbl, 0, 1).id = conf.name + '_title';
	tblCell(header_tbl, 0, 1).align = 'left';

	tblCell(header_tbl, 0, 2).align = 'right';
	var acc_tbl = newTableElement('', 0, 0, 0, '', 1, 4, '', '', tblCell(header_tbl, 0, 2));
	tblCell(acc_tbl, 0, 0).id = conf.name + '_title_shoulder';
	tblCell(acc_tbl, 0, 1).id = conf.name + '_menus';
	tblCell(acc_tbl, 0, 2).id = conf.name + '_title_item_count';
	tblCell(acc_tbl, 0, 2).style.padding = '2px';
	tblCell(acc_tbl, 0, 2).style.color = '#666666';
	tblCell(acc_tbl, 0, 3).id = conf.name + '_title_item_per_page';
	tblCell(acc_tbl, 0, 3).style.padding = '2px';

	if(conf.expand !== 'none') {
		tblCell(header_tbl, 0, 0).style.width = '14px';
		if(conf.expand === 'collapse') {
			var img_icon = newImageElement('', IMAGE_ROOT + '/toexpand.gif', 14, 14, 0, '展开面板');
		}else {
			var img_icon = newImageElement('', IMAGE_ROOT + '/expanded.gif', 14, 14, 0, '折叠面板');
		}
		tblCell(header_tbl, 0, 0).appendChild(img_icon);
		img_icon.style.cursor = 'pointer';
		EventManager.Add(img_icon, 'click', function(ev, obj) {
			_expand_panel_content(conf);
		});
	}else {
		tblCell(header_tbl, 0, 0).style.width = '0px';
	}

	if(conf.title && conf.title != '') {
		tblCell(header_tbl, 0, 1).innerHTML = conf.title;
		tblCell(header_tbl, 0, 1).className = 'panel_title';
	}

	if(conf.menus && conf.menus.length > 0) {
		var menu_tbl = newTableElement('', 0, 0, 3, '', 1, conf.menus.length+1, 'center', 'middle', tblCell(acc_tbl, 0, 1));
		menu_tbl.style.color = '#1b9705';
		var default_menu_idx = 0;
		for(var i = 0; i < conf.menus.length; i ++) {
			tblCell(menu_tbl, 0, i).style.cursor = 'pointer';
			if('string' === typeof(conf.menus[i])) {
				tblCell(menu_tbl, 0, i).innerHTML = conf.menus[i];
				tblCell(menu_tbl, 0, i).menuText = conf.menus[i];
			}else {
				if(typeof(conf.menus[i]['default']) != 'undefined') {
					default_menu_idx = i;
				}
				tblCell(menu_tbl, 0, i).innerHTML = conf.menus[i].txt;
				tblCell(menu_tbl, 0, i).menuText = conf.menus[i].txt;
				tblCell(menu_tbl, 0, i).style.background = 'url(' + conf.menus[i].url + ') no-repeat center left';
				tblCell(menu_tbl, 0, i).style.paddingLeft = '25px';
				tblCell(menu_tbl, 0, i).style.paddingRight = '15px';
			}
			EventManager.Add(tblCell(menu_tbl, 0, i), 'mouseover', function(ev, obj) {
				obj.style.textDecoration = 'underline';
			});
			EventManager.Add(tblCell(menu_tbl, 0, i), 'mouseout', function(ev, obj) {
				obj.style.textDecoration = 'none';
			});
			EventManager.Add(tblCell(menu_tbl, 0, i), 'click', function(ev, obj) {
				_onclick_show_config_panel_menu(conf, obj);
			});
		}

		if(conf.config_show_always) {
			_onclick_show_config_panel_menu(conf, tblCell(menu_tbl, 0, default_menu_idx));
		}
	}

	var refresh_icon = newImageElement('', IMAGE_ROOT + '/refresh.png', 0, 0, 0, '刷新面板');
	tblCell(header_tbl, 0, 3).width = 12;
	tblCell(header_tbl, 0, 3).appendChild(refresh_icon);
	refresh_icon.style.cursor = 'pointer';
	EventManager.Add(refresh_icon, 'click', function(ev, obj) {
		_rerequest_panel_content(conf, false);
	});

	tblCell(tbl, 1, 0).id = conf.name + '_config';

	tblCell(tbl, 2, 0).id = conf.name + '_content';
	if(conf.expand !== 'collapse') {
		_request_panel_content(conf);
	}
}

function newTextNode(text) {
	return document.createTextNode(text);
}

function displayObj(obj) {
  var innerHTML = '';
  var objstack = [{myobject: obj, text: 'root'}];
  while(objstack.length > 0) {
     var cur_obj = objstack[objstack.length - 1];
     objstack.splice(objstack.length-1, 1);
     if(typeof cur_obj.myobject === 'object') {
         for(k in cur_obj.myobject) {
             objstack[objstack.length] = {myobject: cur_obj.myobject[k], text: cur_obj.text + '/' + k};
         }
     }
     innerHTML += cur_obj.text + ':' + cur_obj.myobject + '<br />';
  }
  return innerHTML;
}

function loadScript(sScriptSrc, callbackfunction) {
	//gets document head element   
	var jsReq = new JSHttpRequest();
	jsReq.open(sScriptSrc);
	if('undefined' !== typeof(callbackfunction) && null !== callbackfunction) {
		jsReq.onreadystatechange = function() {
			if(this.readyState == 4) {
				callbackfunction();
			}
		}
	}
	jsReq.send();
}

function removeQuote(str) {
        str = str.replace(/\'/, "\\\'");
        str = str.replace(/\"/, "\\\"");
        return str;
}

function trimString(str) {
        while(str.search(/^\s/) >= 0) {
                str = str.substr(1, str.length - 1);
        }
        while(str.search(/\s$/) >= 0) {
                str = str.substr(0, str.length - 1);
        }
        return str;
}

function newAnchorElement(src, text, title) {
        var a = document.createElement('a');
        a.href = src;
        a.innerHTML = text;
        a.title = title;
        return a;
}

function splitHTMLbyTag(str) {
        var start = 0;
        var end = 0;
	var ele = new Array();
        do {
                start = str.indexOf('<');
                if(start < 0) {
                        break;
                }
                end = str.indexOf('>', start);
                if(end < 0) {
                        break;
                }
		if(start > 0) {
			ele[ele.length] = str.substr(0, start);
		}
		ele[ele.length] = str.substr(start, end - start + 1);
		str = str.substr(end+1, str.length - end - 1);
        }while(true);
	if(str != '') {
		ele[ele.length] = str;
	}
        return ele;
}

function isHTMLTag(str) {
	if(str.indexOf('<') == 0) {
		return true;
	}else {
		return false;
	}
}

function isCloseHTMLTag(str) {
	if(str.indexOf('</') == 0) {
		return true;
	}else {
		return false;
	}
}

function getHTMLTag(str) {
	var s = str.indexOf(' ');
	if(s < 0) {
		s = str.indexOf('>');
	}
	return str.substr(1, s - 1).toUpperCase();
}

function findPairingTagIndex(eles, t) {
	var target = getHTMLTag(eles[t]);
	var level = 1;
	for(var i = t+1; i < eles.length; i ++) {
		if(isHTMLTag(eles[i])) {
			if(getHTMLTag(eles[i]) == target) {
				level++;
			}else if(getHTMLTag(eles[i]) == '/' + target) {
				level--;
				if(level == 0) {
					return i;
				}
			}
		}
	}
	return -1;
}

function inArray(ele, arr) {
	for(var i = 0; i < arr.length; i ++) {
		if(ele == arr[i]) {
			return true;
		}
	}
	return false;
}

function removeArray(ele, arr) {
	for(var i = 0; i < arr.length; i ++) {
		if(ele == arr[i]) {
			arr.splice(i, 1);
			return;
		}
	}
}

function _url_check(s) {
	var regexp = /^(http|https)\:\/\/[a-zA-Z0-9.-]+\.(?:[a-zA-Z]{2}|edu|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)($|\/)/;
	return regexp.test(s);
}

function removeRedundantHTMLTags(str) {
	var ele = splitHTMLbyTag(str);
	var single = ['META', 'INPUT'];
	var pairs  = ['TITLE', 'HEAD', 'SCRIPT', 'SELECT', 'TEXTAREA', 'IFRAME', 'STYLE'];
	var epairs = ['DIV', 'P', 'B', 'SPAN', 'I', 'STRONG', 'EM', 'FONT']; 
	var fpairs = ['B', 'I', 'U', 'STRONG', 'EM'];
	for(var i = 0; i < ele.length; i ++) {
		if(isHTMLTag(ele[i])) {
			var tag = getHTMLTag(ele[i]);
			if(inArray(tag, single)) {
				ele.splice(i, 1);
				i --;
			}else if(inArray(tag, pairs)) {
				var j = findPairingTagIndex(ele, i);
				ele.splice(i, j - i + 1);
				i --;
			}else if(inArray(tag, epairs)) {
				var j = findPairingTagIndex(ele, i);
				if(i+1 == j) {
					ele.splice(i, 2);
					i --;
				}
			}else if(isCloseHTMLTag(ele[i]) && i < ele.length - 1 && isHTMLTag(ele[i+1]) && tag.substr(1) == getHTMLTag(ele[i+1]) && inArray(getHTMLTag(ele[i+1]), fpairs)) {
				ele.splice(i, 2);
				i --;
			}
		}else {
			ele[i] = trimString(ele[i]);
			var txt_str = trimString(ele[i].replace(/&nbsp;/, ' '));
			if(txt_str == '') {
				ele.splice(i, 1);
				i --;
			}else {
				var change = false;
				var txt_words = ele[i].split(' ');
				for(var j = 0; j < txt_words.length; j ++) {
					var txt_words2 = txt_words[j].split('&nbsp;');
					for(var k = 0; k < txt_words2.length; k ++) {
						if(_url_check(txt_words2[k]) && (j>0 || k>0 || i==0 || !isHTMLTag(ele[i-1]) || getHTMLTag(ele[i-1])!='A')) {
							txt_words2[k] = "<a target=_new href=" + txt_words2[k] + ">" + txt_words2[k] + "</a>";
							change = true;
						}
					}
					if(change) {
						txt_words[j] = txt_words2.join('&nbsp;');
					}
				}
				if(change) {
					ele[i] = txt_words.join(' ');
				}
			}
		}
	}
	var ret = ele.join('');
	return trimString(ret);
}

function removeQuoteStr(str) {
	var ele = splitHTMLbyTag(str);
	for(var i = 0; i < ele.length; i ++) {
		if(isHTMLTag(ele[i]) && getHTMLTag(ele[i]) == 'DIV' && ele[i].indexOf('quote_div') > 0) {
			var j = findPairingTagIndex(ele, i);
			ele.splice(i, j - i + 1);
			i --;
		}
	}
	var ret = ele.join('');
	return trimString(ret);
}

function HTML2TXT(str, noimg) {
	var ele = splitHTMLbyTag(str);
	for(var i = 0; i < ele.length; i ++) {
		//alert(i + ':' + ele[i]);
		if(isHTMLTag(ele[i])) {
			if(getHTMLTag(ele[i]) == 'DIV' && ele[i].indexOf('quote_div') > 0) {
				var j = findPairingTagIndex(ele, i);
				//alert('remove right tag ' + ele[i] + ele[j]);
				ele.splice(i, j - i + 1);
				i --;
			}else if(getHTMLTag(ele[i]) == 'IMG' && (typeof(noimg) === 'undefined' || noimg === false)) {
			}else {
				//alert('remove ' + ele[i]);
				ele.splice(i, 1);
				i --;
			}
		}
	}
	var ret = ele.join('');
	ret = ret.replace(/&nbsp;/g, ' ');
	return trimString(ret);
}

var PANEL_STYLES = [
{
        'dir': 'panel_style_1',
        'radius': 5,
        'bgcolor': '#fdf7f9',
        'border': true
},
{
        'dir': 'panel_style_2',
        'radius': 5,
        'bgcolor': '#ffd0d8',
        'border': true
},
{
        'dir': 'panel_style_3',
        'radius': 5,
        'bgcolor': '#fdf9fa',
        'border': true
},
{
        'dir': 'panel_style_4',
        'radius': 6,
        'bgcolor': '#ffd0d8',
        'border': false
},
{
        'dir': 'panel_style_5',
        'radius': 5,
        'bgcolor': '#f4f4f4',
        'border': true
}
];

function newStylishPanel(pane, style_id, id) 
{
    var style = PANEL_STYLES[style_id];
    if('undefined' === typeof(style)) 
    {
        if(id && id != '') 
        {
            pane.id = id;
        }
        return pane;
    }
    var tbl = newTableElement('100%', 0, 0, 0, '', 3, 3, 'left', 'top');
    pane.appendChild(tbl);
    tblCell(tbl, 0, 0).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/left_top.gif', style.radius, style.radius, 0, ''));
    tblCell(tbl, 0, 0).width = style.radius;
    if(style.border) 
    {
        tblCell(tbl, 0, 1).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/top.gif', 1, style.radius, 0, ''));
        tblCell(tbl, 0, 1).style.background = "url(" + IMAGE_ROOT + style.dir + "/top.gif) repeat-x";
    }
    else 
    {
        tblCell(tbl, 0, 1).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, style.radius, 0, ''));
        tblCell(tbl, 0, 1).style.backgroundColor = style.bgcolor;
    }
    tblCell(tbl, 0, 2).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/right_top.gif', style.radius, style.radius, 0, ''));
    tblCell(tbl, 0, 2).width = style.radius;
    if(style.border) 
    {
        tblCell(tbl, 1, 0).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/left.gif', style.radius, 1, 0, ''));
        tblCell(tbl, 1, 0).style.background = "url(" + IMAGE_ROOT + style.dir + "/left.gif) repeat-y";
        tblCell(tbl, 1, 2).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/right.gif', style.radius, 1, 0, ''));
        tblCell(tbl, 1, 2).style.background = "url(" + IMAGE_ROOT + style.dir + "/right.gif) repeat-y";
    }
    else 
    {
        tblCell(tbl, 1, 0).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', style.radius, 1, 0, ''));
        tblCell(tbl, 1, 0).style.backgroundColor = style.bgcolor;
        tblCell(tbl, 1, 2).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', style.radius, 1, 0, ''));
        tblCell(tbl, 1, 2).style.backgroundColor = style.bgcolor;
    }
    tblCell(tbl, 2, 0).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/left_bot.gif', style.radius, style.radius, 0, ''));
    if(style.border) 
    {
        tblCell(tbl, 2, 1).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/bot.gif', 1, style.radius, 0, ''));
        tblCell(tbl, 2, 1).style.background = "url(" + IMAGE_ROOT + style.dir + "/bot.gif) repeat-x";
    }
    else 
    {
        tblCell(tbl, 2, 1).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, style.radius, 0, ''));
        tblCell(tbl, 2, 1).style.backgroundColor = style.bgcolor;
    }
    tblCell(tbl, 2, 2).appendChild(newImageElement('', IMAGE_ROOT + style.dir + '/right_bot.gif', style.radius, style.radius, 0, ''));
    if(id && id != '') 
    {
            tblCell(tbl, 1, 1).id = id;
    }
    tblCell(tbl, 1, 1).bgColor = style.bgcolor;
    return tblCell(tbl, 1, 1);
}

var SIMPLE_PANEL_STYLE = [
{
        'border': '#fbb1c2',
        'shadow': '#fc9090',
        'bgcolor': '#ffffff'
},
{
        'border': '#c8c8c8',
        'shadow': '#a8a8a8',
        'bgcolor': '#ffffff'
},
];

function newSimpleStylishPanel(pane, style_id, id) 
{
    var style = SIMPLE_PANEL_STYLE[style_id];
    if('undefined' === typeof(style)) 
    {
        if(id && id != '') 
        {
                pane.id = id;
        }
        return pane;
    }
    var tbl = newTableElement('100%', 0, 0, 0, '', 5, 5, 'left', 'top');
    tbl.height = '100%';
    pane.appendChild(tbl);
    tblCell(tbl, 0, 0).width = 1;
    tblCell(tbl, 0, 1).width = 1;
    tblCell(tbl, 0, 3).width = 1;
    tblCell(tbl, 0, 4).width = 1;
    tblCell(tbl, 0, 2).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 0, 2).style.backgroundColor = style.border;
    tblCell(tbl, 1, 1).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 1, 1).style.backgroundColor = style.border;
    tblCell(tbl, 1, 2).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 1, 2).style.backgroundColor = style.bgcolor;
    tblCell(tbl, 1, 3).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 1, 3).style.backgroundColor = style.border;
    tblCell(tbl, 2, 0).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 2, 0).style.backgroundColor = style.border;
    tblCell(tbl, 2, 1).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 2, 1).style.backgroundColor = style.bgcolor;
    tblCell(tbl, 2, 3).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 2, 3).style.backgroundColor = style.bgcolor;
    tblCell(tbl, 2, 4).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 2, 4).style.backgroundColor = style.border;
    tblCell(tbl, 3, 1).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 3, 1).style.backgroundColor = style.border;
    tblCell(tbl, 3, 2).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 3, 2).style.backgroundColor = style.bgcolor;
    tblCell(tbl, 3, 3).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 3, 3).style.backgroundColor = style.border;
    tblCell(tbl, 4, 2).appendChild(newImageElement('', IMAGE_ROOT + '/transparent.gif', 1, 1, 0, ''));
    tblCell(tbl, 4, 2).style.backgroundColor = style.border;

    tblCell(tbl, 2, 2).style.backgroundColor = style.bgcolor;
    if(id && id != '') 
    {
            tblCell(tbl, 2, 2).id = id;
    }
    return tblCell(tbl, 2, 2);
}

function showCity(val) 
{
	if(typeof(val) === 'undefined' || val == null || val == '') 
    {
		return '';
	}
    var vals = val.split(',');
    if(vals.length == 9) 
    {
        var c_code = vals[0];
        var r_code = vals[1];
        var i_code = vals[2];
        var c_name = vals[3];
        var r_name = vals[4];
        var i_name = vals[5];
        var lat = Number(vals[6]);
        var lng = Number(vals[7]);
        var scale = Number(vals[8]);
        return c_name + r_name + i_name;
    }
    else 
    {
        return '';
    }
}

function makeColorPalette(pane, param) {
        var color_palette = [
['#FFFFFF','#FFF5EE','#FFF8DC','#FFFACD','#FFFFE0','#98FB98','#AFEEEE','#E0FFFF','#E6E6FA','#DDA0DD'],
['#D3D3D3','#FFC0CB','#FFE4C4','#FFE4B5','#F0E68C','#90EE90','#20B2AA','#87CEFA','#6495ED','#EE82EE'],
['#C0C0C0','#F08080','#F4A460','#FFA500','#EEE8AA','#7FFF00','#48D1CC','#87CEEB','#7B68EE','#DA70D6'],
['#808080','#FF0000','#FF4500','#FF8C00','#FFFF00','#32CD32','#8FBC8F','#4169E1','#6A5ACD','#BA55D3'],
['#696969','#DC143C','#D2691E','#FF7F50','#FFD700','#228B22','#2E8B57','#0000FF','#8A2BE2','#9932CC'],
['#2F4F4F','#B22222','#8B4513','#A0522D','#808000','#008000','#008B8B','#0000CD','#483D8B','#8B008B'],
['#000000','#8B0000','#800000','#A52A2A','#556B2F','#006400','#191970','#000080','#4B0082','#800080']
        ];

        var tbl = newTableElement('', 0, 0, 0, '', color_palette.length, color_palette[0].length, 'center', 'middle');
        pane.appendChild(tbl);
        tbl.style.borderRight  = '1px solid black';
        tbl.style.borderBottom = '1px solid black';
        tbl.style.cursor = 'crosshair';
        for(var _cp_r = 0; _cp_r < color_palette.length; _cp_r ++) {
                for(var _cp_c = 0; _cp_c < color_palette[_cp_r].length; _cp_c++) {
                        var cell = tblCell(tbl, _cp_r, _cp_c);
                        cell.style.borderLeft = '1px solid black';
                        cell.style.borderTop  = '1px solid black';
                        cell.bgColor = color_palette[_cp_r][_cp_c];
			var img = newImageElement('', IMAGE_ROOT + '/transparent.gif', 15, 15, 0, '点击选择颜色');
			cell.appendChild(img);
                        EventManager.Add(img, 'click', function(ev, obj) {
                                if(param.on_change_color_func) {
                                        param.on_change_color_func(obj.parentNode.bgColor, param);
                                }
                        });
                        EventManager.Add(img, 'mouseover', function(ev, obj) {
                                obj.parentNode.style.borderTop  = '1px solid white';
                                obj.parentNode.style.borderLeft = '1px solid white';
                        });
                        EventManager.Add(img, 'mouseout', function(ev, obj) {
                                obj.parentNode.style.borderTop  = '1px solid black';
                                obj.parentNode.style.borderLeft = '1px solid black';
                        });
                }
        }
}

function makeColorPicker(obj, color, onchange) {
        var tbl = newTableElement(15, 0, 0, 0, '', 1, 1, 'center', 'middle');
        tbl.style.height = '15px';
        tbl.style.border = '1px solid #000000';
        obj.appendChild(tbl);
        var cell = tblCell(tbl, 0, 0);
        cell.style.border = '1px solid #FFFFFF';
        cell.bgColor = color;
        cell.style.cursor = 'pointer';
        cell.title = '点击选择颜色';
        EventManager.Add(cell, 'click', function(ev, obj) {
                var pop = getPopupContainer(obj);
                makeColorPalette(pop, {
                        on_change_color_func: function(clr_str, param) {
                                onchange(clr_str);
                                clearPopupContainer();
                        }
                });
        });
}

function newFixedSizeImagePane(parent, width, height) {
        var div = document.createElement('div');
        parent.appendChild(div);
        div.style.overflow = 'hidden';
        div.style.width = width + 'px';
        div.style.height = height + 'px';
        var tbl = newTableElement('', 0, 0, 0, '', 1, 1, 'center', 'middle');
        div.appendChild(tbl);
        tblCell(tbl, 0, 0).widht = width;
        tblCell(tbl, 0, 0).height = height;
        return tblCell(tbl, 0, 0);
}

function hightLightSubstr(text, niddle) {
        if(niddle == '') {
                return text;
        }
        var pos = 0;
        var tmp = '';
        while((pos = text.toLowerCase().indexOf(niddle.toLowerCase())) >= 0) {
                tmp += text.substr(0, pos) + '<b>' + text.substr(pos, niddle.length) + '</b>';
                text = text.substr(pos + niddle.length);
        }
        tmp += text;
        return tmp;
}

/*
function onSearchBoxShowResult(box, records) {
        box._search_in_progress = false;
        box._search_result_index = -1;
        var pane = getPopupContainer(box);
        pane.style.border = '1px solid #888888';
        pane.style.backgroundColor = '#ffffe1';
        pane.style.fontSize = '12px';
        var tbl = newTableElement('', 0, 2, 2, '', records.length-1, 2, 'left', 'middle');
        pane.appendChild(tbl);
	box._tbl = tbl;
        box._search_result_count = records[0].count;
        for(var i = 1; i < records.length; i ++) {
                var rec = records[i];
                var imgurl = rec.picture;
                if(imgurl == '') {
                        imgurl = 'anonymous.gif';
                }
                tblCell(tbl, i-1, 0).appendChild(newImageElement('', UPLOAD_IMG_DIR_URL + THUMB_PREFIX + imgurl, 18, 24, 0, ''));
                var show_name = hightLightSubstr(rec.realname, box._search_str);
                if(rec.nickname != '') {
                        show_name += '(' + hightLightSubstr(rec.nickname, box._search_str) + ')';
                }
                show_name += '&lt;' + hightLightSubstr(rec.email, box._search_str) + '&gt;';
                makeButton(tblCell(tbl, i-1, 1), {
                        text: show_name,
                        align: 'left',
                        bordercolor_over: '#888888',
                        bordercolor_out: '#DDDDDD',
                        bgcolor_over: '#CCCCCC',
                        bgcolor_out: '#FFFFFF',
                        data: rec,
                        box: box,
                        onclick: function(ev, td, conf) {
				if('undefined' === typeof(conf.box.conf.onselect)) {
                                	conf.box.value = conf.data.email;
				}else {
					conf.box.conf.onselect(conf.data);
				}
                                clearPopupContainer();
                        }
                });
        }
        pane.appendChild(newTextNode('共找到' + box._search_result_count + '条匹配记录'));
}

var USER_TYPE_ALL_USER = 'u';
var USER_TYPE_ALL_REGIST = 'r';

function onSearchBoxTextChange(ev, box) {
        if(null != ev && (ev.keyCode == 13 || ev.keyCode == 27 || (ev.keyCode >= 37 && ev.keyCode <= 40))) {
                if(_popup_container) {
			var tbl = box._tbl;
			if(tbl) {
	                        if(ev.keyCode == 40) { // down
                                	box._search_result_index++;
                        	        if(box._search_result_index >= tbl.rows.length) {
                	                        box._search_result_index = tbl.rows.length - 1;
        	                        }
	                        }else if(ev.keyCode == 38) { // up
                                	box._search_result_index--;
                        	        if(box._search_result_index < 0) {
                	                        box._search_result_index = 0;
        	                        }
	                        }else if(ev.keyCode == 13 || ev.keyCode == 27 || ev.keyCode == 37 || ev.keyCode == 39) { // left || right
                        	        clearPopupContainer();
                	                return false;
        	                }
	                        for(var i = 0; i < tbl.rows.length; i ++) {
                        	        if(box._search_result_index == i) {
						if('undefined' === typeof(box.conf.onselect)) {
        	                                	box.value = tblCell(tbl, i, 1).conf.data.email;
						}else {
							box.conf.onselect(tblCell(tbl, i, 1).conf.data);
						}
                        	                tblCell(tbl, i, 1).style.backgroundColor = '#CCCCCC';
                	                        tblCell(tbl, i, 1).style.border = '1px solid #888888';
        	                        }else {
	                                        tblCell(tbl, i, 1).style.backgroundColor = '#FFFFFF';
                                        	tblCell(tbl, i, 1).style.border = '1px solid #DDDDDD';
                                	}
                        	}
			}
                }
                return;
        }
        if(true === box._search_in_progress) {
                return;
        }
        if(box.value.length < 6) {
                box._search_str = '';
                box._search_result_count = 0;
                box._search_in_progress = false;
                clearPopupContainer();
                return;
        }
        if(box._search_str != '' && box.value.indexOf(box._search_str) >= 0 && box._search_result_count == 0) {
                return;
        }
        box._search_str = box.value;
        box._request_inprogress = true;
	box._tbl = null;
        //alert('search.php?q=' + encodeHTML(box._search_str) + '&t=u&k=' + box.id + '&a=' + _visitor_id);
        AJAXRequest({
        'url': 'search.php?q=' + encodeHTML(box._search_str) + '&t=' + box.conf.user_type + '&k=' + box.id + '&a=' + _visitor_id,
        'onEnd': function(text) {
                if(text != '') {
                        var records = JSON.parse(text);
                        var search_box = document.getElementById(records[0].key);
                        if(search_box) {
                                onSearchBoxShowResult(search_box, records);
				if(search_box.value != records[0].query) {
					onSearchBoxTextChange(null, search_box);
				}
                        }
                        records = null;
                }else {
                        clearPopupContainer();
                }
        }
        },
        'POST');
}

var _search_box_pompt = '输入Email、姓名或用户名';

function onSearchBoxFocus(ev, box) {
        var d = new Date();
        box.id = '_search_box_' + d.getTime();
        box._search_str = '';
        box._search_result_count = 0;
        box._search_in_progress = false;
        box._search_result_index = -1;
	box._tbl = null;

	if(box.value === _search_box_pompt) {
		box.value = '';
	}
	box.style.color = '';

	disableEnterKey(box.form);
}

function onSearchBoxBlur(ev, obj) {
	if(obj.value == '') {
		obj.style.color = '#BBBBBB';
		obj.value = _search_box_pompt;
	}else {
		obj.style.color = '';
	}
}

function makeSearchBox(box, conf) {
        box.setAttribute('autocomplete', 'off');
	box.conf = conf;
	box.__destructor = function() {
		this.conf = null;
	}
        EventManager.Add(box, 'focus', onSearchBoxFocus);
        EventManager.Add(box, 'keyup', onSearchBoxTextChange);
	EventManager.Add(box, 'blur',  function(ev, obj) {
		onSearchBoxBlur(ev, obj);
		if(conf.onblur) {
			conf.onblur(obj, obj.conf);
		}
		enableEnterKey(obj.form);
	});

	onSearchBoxBlur(null, box);
}*/

function newSearchBox(panel, name, value, hint, size) {
        var tbl = newTableElement('', 0, 1, 0, '', 1, 2, 'center', 'middle');
        panel.appendChild(tbl);
        tbl.style.border = '1px solid #666666';
        tblCell(tbl, 0, 0).appendChild(newImageElement('', IMAGE_ROOT + '/icon_search.gif', 16, 16, 0, ''));
        var box = newInputElement('text', name, value);
        box.size = size;
        if(hint === null || hint == '') {
                hint = '输入搜索关键词';
        }
        if(value === null || value == '') {
                box.style.color = '#DDDDDD';
                box.value = hint;
        }
        box.style.border = '0px';
        EventManager.Add(box, 'blur', function(ev, obj) {
                if(trimString(obj.value) == '') {
                        obj.value = hint;
                        obj.style.color = '#DDDDDD';
                }
        });
        EventManager.Add(box, 'focus', function(ev, obj) {
                if(obj.value == hint) {
                        obj.value = '';
                        obj.style.color = '';
                }else {
			obj.select();
		}
        });
        tblCell(tbl, 0, 1).appendChild(box);
	return box;
}

function hideScrollBar() {
        document.body.scroll = "no";
        document.body.setAttribute('scroll', 'no');
        document.body.style.overflow = "hidden";
}

function showScrollBar() {
        document.body.scroll = "";
        document.body.setAttribute('scroll', '');
        document.body.style.overflow = "";
}

function showChatBox2(panel, msg) {
        var html = '<table cellspacing=0 cellpadding=0 border=0>';
        html += "<tr><td>";
        html += "<table cellspacing=0 cellpadding=0 border=0>";
        html += "<tr><td width=8 height=8><img src='" + IMAGE_ROOT + "/chat_box2/left_top.gif' width=8 height=8 border=0></td>";
        html += "<td bgcolor='#e0e0e0'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td>";
        html += "<td width=8 height=8><img src='" + IMAGE_ROOT + "/chat_box2/right_top.gif' width=8 height=8 border=0></td></tr>";
        html += "<tr><td bgcolor='#e0e0e0'><img src='" + IMAGE_ROOT + "/transprent.gif' width=1 height=1 border=0></td>";
        html += "<td bgcolor='#e0e0e0' align='left' valign='middle'>" + msg + "</td>";
        html += "<td bgcolor='#e0e0e0'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td></tr>";
        html += "<tr><td width=8 height=8><img src='" + IMAGE_ROOT + "/chat_box2/left_bot.gif' width=8 height=8 border=0></td>";
        html += "<td bgcolor='#e0e0e0'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td>";
        html += "<td width=8 height=8><img src='" + IMAGE_ROOT + "/chat_box2/right_bot.gif' width=8 height=8 border=0></td></tr>";
        html += "</table>";
        html += "</td><td width=16 valign=bottom><img src='" + IMAGE_ROOT + "/chat_box2/arrow.gif' width=16 height=20 border=0></td></tr></table>";
        panel.innerHTML = html;
}

function showChatBox(panel, msg) {
        var html = '<table cellspacing=0 cellpadding=0 border=0>';
        html += "<tr><td width=15 valign=top><img src='" + IMAGE_ROOT + "/chat_box1/arrow.gif' width=15 height=20 border=0></td><td>";
        html += "<table cellspacing=0 cellpadding=0 border=0>";
        html += "<tr><td width=11 height=8><img src='" + IMAGE_ROOT + "/chat_box1/left_top.gif' width=11 height=8 border=0></td>";
        html += "<td bgcolor='#fdd0ef'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td>";
        html += "<td width=11 height=8 align=left><img src='" + IMAGE_ROOT + "/chat_box1/right_top.gif' width=11 height=8 border=0></td></tr>";
        html += "<tr><td bgcolor='#fdd0ef'><img src='" + IMAGE_ROOT + "/transprent.gif' width=1 height=1 border=0></td>";
        html += "<td bgcolor='#fdd0ef' align='left' valign='middle'>" + msg + "</td>";
        html += "<td style='background: url(" + IMAGE_ROOT + "/chat_box1/right.gif) repeat-y;'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td></tr>";
        html += "<tr><td width=11 height=9><img src='" + IMAGE_ROOT + "/chat_box1/left_bot.gif' width=11 height=9 border=0></td>";
        html += "<td style='background: url(" + IMAGE_ROOT + "/chat_box1/bottom.gif) repeat-x;'><img src='" + IMAGE_ROOT + "/transparent.gif' width=1 height=1 border=0></td>";
        html += "<td width=11 height=9><img src='" + IMAGE_ROOT + "/chat_box1/right_bot.gif' width=11 height=9 border=0></td></tr>";
        html += "</table>";
        html += '</td></tr></table>';
        panel.innerHTML = html;
}

function mouseCoords(ev){
        if(ev.pageX || ev.pageY){
                return {x:ev.pageX, y:ev.pageY};
        }
        return {
                //x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
                //y:ev.clientY + document.body.scrollTop  - document.body.clientTop
                x: ev.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                y: ev.clientY + document.body.scrollTop + document.documentElement.scrollTop
        };
}

var _field_table = new Array();

function updateFieldContent(field, fieldname, funcname, params, callback) {
	if(field != null) {
		field.setAttribute('className', fieldname);
		field.className = fieldname;
	}
        _field_table[fieldname] = {func: funcname, callback: callback, params: params};
}

function _update_field_callback(msg) {
        if(typeof(msg) === 'string') {
                showAlert(msg);
        }else {
                var fn = msg._fn;
                if(_field_table[fn]) {
                        var objs = document.getElementsByClassName(fn);
                        for(var i = 0; i < objs.length; i ++) {
                                removeAllChildNodes(objs[i]);
                                _field_table[fn].callback(objs[i], msg, _field_table[fn].params);
                        }
                        delete _field_table[fn];
                }
        }
}

function commitUpdateFieldContent() {
        for(var fn in _field_table) {
                var objs = document.getElementsByClassName(fn);
                //alert(fn + ':' + objs.length);
                for(var i = 0; i < objs.length; i ++) {
                        removeAllChildNodes(objs[i]);
                        objs[i].appendChild(newImageElement('', IMAGE_ROOT + '/loading.gif', 0, 0, 0, ''));
                }
                _field_table[fn].params._fn = fn;
                ajaxRPC(_field_table[fn].func, _field_table[fn].params, _update_field_callback);
        }
}

function getFlashObj(name) {
        if (navigator.appName.indexOf ("Microsoft") !=-1) {
                return window[name];
        } else {
                return window.document[name];
        }
}

function zeroFill(num, wid) {
        var numstr = String(num);
        while(numstr.length < wid) {
                numstr = '0' + numstr;
        }
        return numstr;
}

function getRecentDate(datestr) {
        var dat = str2date(datestr);
        var now = new Date();
        if(now.getFullYear() != dat.getFullYear()) {
                return dat.getFullYear() + '年' + (dat.getMonth()+1) + '月';
        }else if(now.getMonth() != dat.getMonth()) {
                return (dat.getMonth()+1) + '月' + dat.getDate() + '日';
        }else if(now.getDate() != dat.getDate()) {
                return dat.getDate() + '日' + dat.getHours() + '时';
        }else {
                return dat.getHours() + '时' + zeroFill(dat.getMinutes(), 2) + '分';
        }
}

function makeSubmitButton(btn) {
	btn.style.background = '#419147';
	btn.style.border = '2px outset #f3d3d2';
	btn.style.color = '#FFFFFF';
	btn.style.marginLeft = btn.style.marginRight = '10px';
	EventManager.Add(btn, 'mouseover', function(ev, obj) {
		btn.style.background = '#83c095';
	});
	EventManager.Add(btn, 'mouseout', function(ev, obj) {
		btn.style.background = '#419147';
	});
}

function newSubmitButton(txt) {
	var btn = newInputElement('submit', '', txt);
	makeSubmitButton(btn);
	return btn;
}

function isValidUserID(id) {
	return (id>=1000);
}

function newHintTextInput(id, value, hint, width) {
        var input = newInputElement('text', id, value);
	input.style.width = width;
        if(value == '') {
                input.value = hint;
                input.style.color = '#AAAAAA';
        }
        input.hint = hint;
        input.__destructor = function() {
                this.hint = null;
        }
        EventManager.Add(input, 'focus', function(ev, obj) {
                if(trimString(obj.value) == obj.hint) {
                        obj.value = '';
                        obj.style.color = '';
                }
        });
        EventManager.Add(input, 'blur', function(ev, obj) {
                if(trimString(obj.value) == '') {
                        obj.value = obj.hint;
                        obj.style.color = '#AAAAAA';
                }
        });
        return input;
}

function _new_hintpassword_textinput(id, hint, width) {
	var input = newInputElement('text', id, '');
	input.style.width = width;
	input.value = hint;
	input.style.color = '#AAAAAA';
	input.hint = hint;
	input.__destructor = function() {
		this.hint = null;
	}
	EventManager.Add(input, 'focus', function(ev, obj) {
		var newobj = _new_hintpassword_passwordinput(obj.id, obj.hint, obj.style.width);
		obj.parentNode.replaceChild(newobj, obj);
		setTimeout("document.getElementById('" + obj.id + "').focus();", 50);
	});
	return input;
}

function _new_hintpassword_passwordinput(id, hint, width) {
	var input = newInputElement('password', id, '');
	input.style.width = width;
	input.hint = hint;
	input.__destructor = function() {
		this.hint = null;
	};
	EventManager.Add(input, 'blur', function(ev, obj) {
		if(trimString(obj.value) == '') {
			var newobj = _new_hintpassword_textinput(obj.id, obj.hint, obj.style.width);
			obj.parentNode.replaceChild(newobj, obj);
		}
	});
	return input;
}

function newHintPasswordInput(id, hint, width) {
	return _new_hintpassword_textinput(id, hint, width);
}

function subscribePartySpace(tbl, id, uid) {
	ajaxRPC('subscribePartySpace', {_owner_tbl: tbl, _owner_id: id, _visitor_id: uid}, onSubscriptionSuccess);
}

function onSubscriptionSuccess(msg) {
	if('string' === typeof(msg)) {
		showAlert(msg);
	}else {
		showAsyncMsg('收藏成功！');
	}
}

function makeThinButton(img) {
	img.style.margin = '2px';
	img.style.cursor = 'pointer';
	img.style.borderRight = img.style.borderBottom = '1px solid #FFFFFF';
	EventManager.Add(img, 'mouseover', function(ev, obj) {
		obj.style.borderRight = obj.style.borderBottom = '1px solid #BBBBBB';
	});
	EventManager.Add(img, 'mouseout', function(ev, obj) {
		obj.style.borderRight = obj.style.borderBottom = '1px solid #FFFFFF';
	});
}

function shortCutURL(tbl, id, url, params) {
	var url = 'shortcut.php?__t=' + tbl + '&__i=' + id + '&__u=' + url;
	for(var k in params) {
		url += '&' + k + '=' + escape(params[k]);
	}
	var r = escape(window.location);
	url += '&__r=' + r;
	return url;
}

function invalidDate(str) {
        if('undefined' === typeof(str) ||
            str === '' ||
            str === '0000-00-00 00:00:00') {
                return true;
        }else {
                return false;
        }
}

/*
 *
 * @param records object ContentPanel records
 * @param conf    object ContentPanel Configuration
 * @param width   string/number ContentPanel Grid width, either % string or number in pixels
 * @param panel   DOM object optional the container panel
 * @param style   string optional 
 */
function newDBGrid(records, conf, width, panel, panel_conf, style) {
	var order_col_bg = '#ecf6eb';
        var tbl = newTableElement(width, 0, 0, 0, "", records.length + 1, conf.length, "", "");
        if(panel != null) {
                panel.appendChild(tbl);
        }
	var order_index = -1;
        for(var i = 0; i < conf.length; i ++) {
	        tblCell(tbl, 0, i).style.fontWeight   = 'bold';
		tblCell(tbl, 0, i).align = 'center';
		tblCell(tbl, 0, i).style.background = "url('" + IMAGE_ROOT + "/content_bg.jpg')";
		tblCell(tbl, 0, i).height = 38;
		if (i < conf.length - 1) {
			tblCell(tbl, 0, i).style.borderRight = '1px solid #a0a0a0';
		}
                //tblCell(tbl, 0, i).style.borderBottom = '1px solid #000000';
		if('string' === typeof(conf[i].title) && conf[i].title.length > 0) {
			if('string' === typeof(conf[i].field) && 'object' === typeof(panel_conf)) {
				var up_img_url = 'up.png';
				var down_img_url = 'down.png';
				if(panel_conf.query_order == conf[i].field) {
					up_img_url = 'up_sel.png';
					order_index = i;
					tblCell(tbl, 0, i).bgColor = order_col_bg;
					tblCell(tbl, 0, i).style.background = "url('" + IMAGE_ROOT + "/content_bg_m.jpg')";
				}else if(panel_conf.query_order == conf[i].field + ' desc') {
					down_img_url = 'down_sel.png';
					order_index = i;
					tblCell(tbl, 0, i).bgColor = order_col_bg;
					tblCell(tbl, 0, i).style.background = "url('" + IMAGE_ROOT + "/content_bg_m.jpg')";
				}
				var subtbl = newTableElement('', 0, 0, 0, '', 2, 2, 'center', 'middle', tblCell(tbl, 0, i));
				mergeCell(subtbl, 0, 0, 2, 1);
				tblCell(subtbl, 0, 1).vAlign = 'bottom';
				tblCell(subtbl, 1, 0).vAlign = 'top';
                		tblCell(subtbl, 0, 0).innerHTML = conf[i].title;
				var up_img = newImageElement('', IMAGE_ROOT + '/' + up_img_url, 0, 0, 0, '按' + conf[i].title + '升序排列');
				tblCell(subtbl, 0, 1).appendChild(up_img);
				up_img.url = up_img_url;
				up_img.style.cursor = 'pointer';
				up_img.panel_conf = panel_conf;
				up_img.field = conf[i].field;
				up_img.__destructor = function() {
					this.panel_conf = null;
					this.field = null;
					this.url = null;
				};
				EventManager.Add(up_img, 'mouseover', function(ev, obj) {
					obj.src = IMAGE_ROOT + '/up_m.png';
				});
				EventManager.Add(up_img, 'mouseout', function(ev, obj) {
					obj.src = IMAGE_ROOT + '/' + obj.url;
				});
				EventManager.Add(up_img, 'click', function(ev, obj) {
					obj.panel_conf.query_order = obj.field;
					redrawPanelContent(obj.panel_conf.name, false, true);
				});
				var down_img = newImageElement('', IMAGE_ROOT + '/' + down_img_url, 0, 0, 0, '按' + conf[i].title + '降序排列');
				tblCell(subtbl, 1, 0).appendChild(down_img);
				down_img.url = down_img_url;
				down_img.style.cursor = 'pointer';
				down_img.panel_conf = panel_conf;
				down_img.field = conf[i].field;
				down_img.__destructor = function() {
					this.panel_conf = null;
					this.field = null;
					this.url = null;
				};
				EventManager.Add(down_img, 'mouseover', function(ev, obj) {
					obj.src = IMAGE_ROOT + '/down_m.png';
				});
				EventManager.Add(down_img, 'mouseout', function(ev, obj) {
					obj.src = IMAGE_ROOT + '/' + obj.url;
				});
				EventManager.Add(down_img, 'click', function(ev, obj) {
					obj.panel_conf.query_order = obj.field + ' desc';
					redrawPanelContent(obj.panel_conf.name, false, true);
				});
			}else {
                		tblCell(tbl, 0, i).innerHTML = conf[i].title;
			}
		}else {
			tblCell(tbl, 0, i).align = 'center';
			if('boolean' === typeof(conf[i].title.exportExcel) && conf[i].title.exportExcel && 'object' === typeof(panel_conf)) {
				var header_conf = [];
				for(var h = 0; h < conf.length; h ++) {
					if('string' === typeof(conf[h].title) && 'string' === typeof(conf[h].field)) {
						header_conf[header_conf.length] = {title: conf[h].title, field: conf[h].field};
						if('string' === typeof(conf[h].format)) {
							header_conf[header_conf.length-1].format = conf[h].format;
						}
					}
				}
				var xsl_img = newImageElement('', IMAGE_ROOT + '/icon_xsl.png', 0, 0, 0, '将表格内容导出为Excel');
				tblCell(tbl, 0, i).appendChild(xsl_img);
				xsl_img.style.cursor = 'pointer';
				xsl_img.panel_conf = panel_conf;
				xsl_img.header_conf = header_conf;
				xsl_img.__destructor = function() {
					this.panel_conf  = null;
					this.header_conf = null;
				};
				EventManager.Add(xsl_img, 'click', function(ev, obj) {
					exportContentPanelExcel(obj.panel_conf, obj.header_conf);
				});
			}
		}
        }
        for(var i = 0; i < records.length; i ++) {
                for(var j = 0; j < conf.length; j ++) {
			if(parseInt(i/2)*2 == i) {
				tblCell(tbl, i+1, j).bgColor = '#f4f4f4';
			}else {
				tblCell(tbl, i+1, j).bgColor = '#e9e9e9';
			}
			if (j < conf.length - 1) {
                		tblCell(tbl, i+1, j).style.borderRight = '1px solid #c8c8c8';
			}
			if (i == records.length-1) {
                		tblCell(tbl, i+1, j).style.borderBottom = '1px solid #c8c8c8';
			}
			if('string' === typeof(style)) {
				if(parseInt(j/2)*2 == j) {
					tblCell(tbl, i+1, j).bgColor = style;
				}
			}
			if(j == order_index) {
				tblCell(tbl, i+1, j).bgColor = order_col_bg;
			}

			tblCell(tbl, i+1, j).style.padding = '3px';

                        conf[j].value(tblCell(tbl, i+1, j), records[i]);
                }
        }
        return tbl;
}

function exportContentPanelExcel(conf, header) {
	var params = _panel_content_request_params(conf);
	params._export_title = conf.title;
	params._export_conf = JSON.stringify(header);
	sendURLRequest({
		url: LIBUI_DB_QUERY_SCRIPT,
		method: 'POST',
		target: '_new',
		params: params
	});
}

function isErrorMsg(msg) {
	if('string' === typeof msg && msg.indexOf("ERROR:") === 0) {
		return true;
	}else {
		return false;
	}
}

function refresh(delay) {
	disablePageInput();
	if('undefined' === typeof delay || delay < 300) {
		delay = 300;
	}
	setTimeout("window.location = window.location.href", delay);
}

var DISABLE_PAGE_INPUT_PANE_ID = '_disable_page_input_pane_';

function disablePageInput() {
	var prog_pane = newTableElement('100%', 0, 0, 0, '#FFFFFF', 1, 1, 'center', 'middle');
	prog_pane.id = DISABLE_PAGE_INPUT_PANE_ID;
	document.body.appendChild(prog_pane);
	prog_pane.style.position = 'absolute';
        var x = f_scrollLeft();
        var y = f_scrollTop();
        var w = f_clientWidth();
        var h = f_clientHeight();
        prog_pane.style.left = x + 'px';
        prog_pane.style.top = y + 'px';
        prog_pane.style.width = w + 'px';
        prog_pane.style.height = h + 'px';
        prog_pane.style.cursor = 'wait';
        prog_pane.style.overflow = 'hidden';
        set_opacity(prog_pane, 0.5);

        var prog_w = 180;
        var prog_h = 12;
        if(prog_w > w) {
                prog_w = w;
        }
        var prog_bar = newImageElement('', IMAGE_ROOT + '/progress.gif', prog_w, prog_h, 0, '');
        tblCell(prog_pane, 0, 0).appendChild(prog_bar);
        set_opacity(prog_bar, 1);
}

function enablePageInput() {
        var prog_pane = document.getElementById(DISABLE_PAGE_INPUT_PANE_ID);
        if(prog_pane != null) {
                removeChildFromNode(prog_pane, document.body);
                prog_pane = null;
        }
}

function __sortedArrayOperation(cmd, arr, ele, comp) {
	var start = 0;
	var end = arr.length - 1;
	var findidx = -1;
	while(start <= end) {
		var j = parseInt((start + end)/2);
		if('function' === typeof(comp)) {
			var result = comp(ele, arr[j]);
			if(result == 0) {
				if(cmd == 'insert') {
					return false;
				}else {
					findidx = j;
					break;
				}
			}else if(result > 0) {
				start = j + 1;
			}else {
				end = j - 1;
			}
		}else {
			if(ele == arr[j]) {
				if(cmd == 'insert') {
					return false;
				}else {
					findidx = j;
					break;
				}
			}else if(ele > arr[j]) {
				start = j + 1;
			}else {
				end = j - 1;
			}
		}
	}
	if(cmd == 'insert') {
		arr.splice(start, 0, ele);
		return true;
	}else if(cmd == 'remove') {
		if(findidx >= 0) {
			arr.splice(findidx, 1);
			return true;
		}else {
			return false;
		}
	}else {
                if(findidx >= 0) {
			return findidx;
		}else {
			return false;
		}
	}
}

function sortedInsert(arr, ele, comp) {
	return __sortedArrayOperation('insert', arr, ele, comp);
}
function sortedRemove(arr, ele, comp) {
	return __sortedArrayOperation('remove', arr, ele, comp);
}
function sortedSearch(arr, ele, comp) {
	return __sortedArrayOperation('search', arr, ele, comp);
}

function isCJK(str) {
	if(str.length > 0) {
		var code = str.charCodeAt(0);
		if(code >= 19968 && code <= 40959) {
			return true;
		}else {
			return false;
		}
	}else {
		return false;
	}
}

var _default_content_panel_title  = Array();
var _default_content_panel_cookie = Array();

function saveContentPanelSearch(conf) {
	var title = getContentPanelTitle(conf);
	if('undefined' === typeof(_default_content_panel_title[conf.name]) || null === _default_content_panel_title[conf.name]) {
		_default_content_panel_title[conf.name] = title.innerHTML;
		_default_content_panel_cookie[conf.name] = conf.query_conditions;
	}
}

function clearContentPanelSearch(confname) {
	if('string' === typeof(confname)) {
		var conf = getContentPanelConf(confname);
	}else {
		var conf = confname;
	}
	var title = getContentPanelTitle(conf);
	if('string' === typeof(_default_content_panel_title[conf.name])) {
		title.innerHTML = _default_content_panel_title[conf.name];
		conf.query_conditions = _default_content_panel_cookie[conf.name];
		redrawPanelContent(conf.name);
		_default_content_panel_title[conf.name] = null;
		_default_content_panel_cookie[conf.name] = null;
	}
}

function cancelContentPanelSearchStr(conf) {
	return "<input onclick=\"clearContentPanelSearch('" + conf.name + "');\" value='取消' type='button' />";
}

function quoteString(str) {
	str = str.replace(/\\/g, "\\\\");
	str = str.replace(/\'/g, "\\\'");
	str = str.replace(/\"/g, "\\\"");
	return str;
}

function mergeCell(tbl, row, col, rowspan, colspan) {
	for(var r = row; r < row + rowspan; r++) {
		var tr = tblCell(tbl, r, col).parentNode;
		var startcol = col;
		if(r == row) {
			startcol = col + 1;
		}
		for(var c = startcol; c < col + colspan; c ++) {
			tr.removeChild(tr.lastChild);
		}
	}
	tblCell(tbl, row, col).colSpan = colspan;
	tblCell(tbl, row, col).rowSpan = rowspan;
}

function emailDomain(email) {
	return email.substr(email.indexOf('@')+1);
}

function emailAccount(email) {
	return email.substr(0, email.indexOf('@'));
}

function showInfoDetail(panel, rec, title, header, colnum, width) {
	var fieldnum = header.length;
	var row = parseInt(fieldnum/colnum);
	if(row*colnum != fieldnum) {
		row ++;
	}
	var offset = 0;
	if('string' === typeof(title) && title != '') {
		offset ++;
	}
	var tbl = newTableElement(width, 0, 0, 2, '', row + offset, colnum*2, 'left', 'top', panel);
	tbl.style.margin = '5px';
	if('string' === typeof(title) && title != '') {
		mergeCell(tbl, 0, 0, 1, colnum*2);
		tblCell(tbl, 0, 0).innerHTML = title;
		tblCell(tbl, 0, 0).style.fontWeight = 'bold';
		tblCell(tbl, 0, 0).style.textAlign = 'left';
		tblCell(tbl, 0, 0).style.paddingTop = '5px';
		tblCell(tbl, 0, 0).style.borderBottom = '1px solid #666666';
	}
	for(var i = 0; i < header.length; i ++) {
		var ridx = parseInt(i/colnum);
		var cidx = i - ridx*colnum;
		tblCell(tbl, ridx + offset, cidx*2).innerHTML = header[i].title;
		tblCell(tbl, ridx + offset, cidx*2).align     = 'right';
		tblCell(tbl, ridx + offset, cidx*2).style.color = '#333333';
		tblCell(tbl, ridx + offset, cidx*2).bgColor = '#EEEEEE';
		tblCell(tbl, ridx + offset, cidx*2).style.paddingLeft = '20px';
		tblCell(tbl, ridx + offset, cidx*2).style.paddingRight = '10px';
		tblCell(tbl, ridx + offset, cidx*2).style.fontSize = '95%';
                header[i].value(tblCell(tbl, ridx + offset, cidx*2+1), rec);
	}
}

function composeGeneralSearchQuery(fields, niddle) {
	var str = '';
	for(var i = 0; i < fields.length; i ++) {
		if(str.length > 0) {
			str += ' OR ';
		}
		str += fields[i] + " REGEXP '" + niddle + "'";
	}
	return str;
}

function makeContentPanelSearchBox(confname, box_pane, hint, fields, size, advfunc) {
	removeAllChildNodes(box_pane);
	var form = newFormElement('.', 'GET', '_self');
	box_pane.appendChild(form);
	var tbl = newTableElement('', 0, 0, 0, '', 1, 3, 'left', 'middle', form);
	var box = newSearchBox(tblCell(tbl, 0, 0), '_' + confname + '_searchbox', '', hint, size);
	var btn = newInputElement('submit', '', '搜索');
	tblCell(tbl, 0, 1).appendChild(btn);
	makeSubmitButton(btn);
	btn.style.margin='2px';

	form.fields = fields;
	form.hint = hint;
	form.box = box;
	form.confname = confname;
	form.__destructor = function() {
		this.hint = null;
		this.box = null;
		this.fields = null;
		this.confname = null;
	};

	form.onsubmit = function(ev) {
		var obj = this;
		var searchstr = trimString(obj.box.value);
		if(searchstr != obj.hint && searchstr != '') {
			var conf = getContentPanelConf(obj.confname);
			saveContentPanelSearch(conf);
			if(typeof(obj.fields) === 'function') {
				obj.fields(conf, searchstr);
			}else {
				conf.query_conditions = composeGeneralSearchQuery(obj.fields, searchstr);
			}
			var title = getContentPanelTitle(conf);
			title.innerHTML = "包含字符串 <span style='color:#880000;text-decoration:underline;'>" + searchstr + '</span> 的结果' + cancelContentPanelSearchStr(conf);
			redrawPanelContent(conf.name);
		}
		return false;
	};

	if('object' === typeof(advfunc) && null !== advfunc) {
		tblCell(tbl, 0, 2).style.fontSize = '11px';
		tblCell(tbl, 0, 2).style.color = '#888888';
		makeButton(tblCell(tbl, 0, 2), {
			text: '精确搜索',
			confname: confname,
			box_pane: box_pane,
			simple_search_data: {hint: hint, fields: fields, size: size},
			advfunc: advfunc,
			onclick: function(ev, obj, conf) {
				makeAdvancedContentPanelSearchBox(conf.confname, conf.box_pane, conf.advfunc, conf.simple_search_data);
			}
		});
	}
}

function makeAdvancedContentPanelSearchBox(confname, box_pane, advfunc, simple_search_data) {
	removeAllChildNodes(box_pane);
	var form = newFormElement('.', 'GET', '_self');
	box_pane.appendChild(form);
	var tbl = newTableElement('', 0, 0, 0, '', 2, 1, 'center', 'middle', form);

	advfunc.layout(tblCell(tbl, 0, 0));

	var btn_tbl = newTableElement('', 0, 0, 0, '', 1, 4, 'center', 'middle', tblCell(tbl, 1, 0));

	var match_all = newInputElement('checkbox', '_match_all', '');
	tblCell(btn_tbl, 0, 0).appendChild(match_all);
	match_all.checked = true;
	tblCell(btn_tbl, 0, 0).appendChild(newTextNode('满足所有条件'));

	var btn = newInputElement('submit', '', '搜索');
	tblCell(btn_tbl, 0, 2).appendChild(btn);
	makeSubmitButton(btn);

	tblCell(btn_tbl, 0, 3).style.fontSize = '11px';
	tblCell(btn_tbl, 0, 3).style.color = '#888888';
	makeButton(tblCell(btn_tbl, 0, 3), {
		text: '模糊搜索',
		confname: confname,
		box_pane: box_pane,
		simple_search_data: simple_search_data,
		advfunc: advfunc,
		onclick: function(ev, obj, conf) {
			makeContentPanelSearchBox(conf.confname, conf.box_pane, conf.simple_search_data.hint, conf.simple_search_data.fields, conf.simple_search_data.size, conf.advfunc);
		}
	});

	form.confname = confname;
	form.callback = advfunc.callback;
	form.params = advfunc.fields;
	form.__destruct = function() {
		this.confname = null;
		this.callback = null;
		this.params   = null;
	};
	form.onsubmit = function(ev) {
		var obj = this;
		var conf = getContentPanelConf(obj.confname);
		saveContentPanelSearch(conf);
		var match_all = false;
		if(obj._match_all.checked) {
			match_all = true;
		}
		if(obj.callback(conf, obj, match_all)) {
			var title = getContentPanelTitle(conf);
			title.innerHTML = "精确搜索结果" + cancelContentPanelSearchStr(conf);
			redrawPanelContent(conf.name);
		}
		return false;
	};
}

function makeDropDownMenuButton(title_text, items, unsel_img, sel_img) {
	var more_btn = newInputElement('image', '', title_text);
	if (!unsel_img || unsel_img == '') {
		unsel_img = IMAGE_ROOT + '/arrow_down_unselected.png';
	}
	if (!sel_img || sel_img == '') {
		sel_img = IMAGE_ROOT + '/arrow_down_selected.png';
	}
	more_btn.unselect_icon = unsel_img;
	more_btn.selected_icon = sel_img;
	more_btn.src = more_btn.unselect_icon;
	more_btn.items = items;
	more_btn.style.border = '0px';
	//more_btn.style.verticalAlign = 'middle';
	EventManager.Add(more_btn, 'mouseover', function(ev, obj) {
		obj.src = obj.selected_icon;
	});
	EventManager.Add(more_btn, 'mouseout', function(ev, obj) {
		obj.src = obj.unselect_icon;
	});
	EventManager.Add(more_btn, 'click', function(ev, obj) {
		showDropDownMenu(obj, obj.items);
	});
	return more_btn;
}
