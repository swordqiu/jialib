<?php
/*****************************************************************************
 *
 *  This file is part of JiaLib, a php web-UI framwork.
 *
 *  JiaLib is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Lesser General Public License (LGPL)
 *  as published by the Free Software Foundation, either version 3 of 
 *  the License, or (at your option) any later version.
 *
 *  JiaLib is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Lesser General Public License for more details.
 *
 *  You should have received a copy of the GNU Lesser General Public License
 *  along with JiaLib.  If not, see <http://www.gnu.org/licenses/>.
 *  @license GNU Lesser General Public License
 *
 *  CopyRight 2009-2012 QIU Jian (sordqiu@gmail.com)
 *
 ****************************************************************************/
?>
<?php

if(!defined("_UTIL_INC_")) {
	define("_UTIL_INC_", "true");
}else {
	die("_UTIL_INC_ has been included!");
}

function encrypt_password($str) {
	return base64_encode(crypt($str, "Anhe"));
}

function send_script($script) {
	$tmpstr = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"><meta http-equiv=\"Content-Language\" content=\"zh-cn\"></head>";
	$tmpstr .= "<script language=\"JavaScript\">";
	$tmpstr .= "<!--\n";
	$tmpstr .= $script;
	$tmpstr .= "//-->\n";
	$tmpstr .= "</script>";
	$tmpstr .= "<body></body></html>";
	return $tmpstr;
}

function jsstr($content) {
	return str_replace(array("\r\n", "\n", "\r"), "\\n", addslashes($content));
}

function tranlateUTF($str) {
	$str = str_replace("\'", "'", $str);
	return $str;
}

function invalidateCache() {
        // Date in the past
        header("Expires: Mon, 26 Jul 1972 05:00:00 GMT");
        // always modified
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        // HTTP/1.1
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        // HTTP/1.0
        header("Pragma: no-cache");
}

function redirect($url) {
	header("Location: {$url}");
}

function include_dir($dir) {
	if ($handle = opendir($dir)) {
		while (false !== ($file = readdir($handle))) {
			if ($file != "." && $file != "..") {
				require_once($dir.DIRECTORY_SEPARATOR.$file);
			}
		}
		closedir($handle);
	}
}

function _log($msg) {
	if(!defined("LOG_DIR")) {
		die("LOG_DIR is not defined!");
	}
	$filepath = LOG_DIR.DIRECTORY_SEPARATOR."mag.log.".date("Y-m-d").".txt";
	$fh = fopen($filepath, 'aw') or die("can't open log file $filepath");
	fwrite($fh, "[".date("H:i:s")."] ".$msg."\n");
	fclose($fh);
}

class RequestFileRes {
	private $__info = null;
	public function __construct($info) {
		$this->__info = $info;
	}
	public function getFileName() {
		return $this->__info['name'];
	}
	public function getTempFileName() {
		return $this->__info['tmp_name'];
	}
	public function getContentType() {
		return $this->__info['type'];
	}
	public function moveTo($dest) {
		move_uploaded_file($this->__info['tmp_name'], $dest);
	}
	public function getContents() {
		return file_get_contents($this->__info['tmp_name']);
	}
	public function getSize() {
		return $this->__info['size'];
	}
	public function getError() {
		return $this->__info['error'];
	}
	public function isSuccess() {
		if($this->getError() == 0) {
			return TRUE;
		}else {
			return FALSE;
		}
	}
}

class RequestRes {
	private $__handle = null;
	private $__msg    = null;
	private $__errMsg = null;
	private $__url    = null;
	public $__content_type = null;
	public $__content_length = null;
	public $__headers = null;
	private $__download_filename = null;
	private $__gzip = FALSE;

	public function __construct() {
		foreach($_GET as $key=>$val) {
			$this->{$key} = $val;
		}
		foreach($_POST as $key=>$val) {
			$this->{$key} = $val;
		}
		foreach($_FILES as $key=>$val) {
			#{ ["name"]=> string(19) "citics_txl_user.dat" ["type"]=> string(24) "application/octet-stream" ["tmp_name"]=> string(14) "/tmp/php6xuAPs" ["error"]=> int(0) ["size"]=> int(1736) }
			$this->{$key} = new RequestFileRes($val);
		}

		$this->__url = "{$_SERVER["SCRIPT_NAME"]}?{$_SERVER["QUERY_STRING"]}";
		$this->__msg    = "";
		if(isset($this->_action) && !is_null($this->_action) && $this->_action != "") {
			$this->__handle = $this->_action;
		}
		_log("_url: {$this->__url} _action: {$this->__handle}");
	}

	public function setContentType($type) {
		$this->__content_type = $type;
	}

	public function setContentLength($len) {
		$this->__content_length = $len;
	}

	public function setResponseHeader($name, $val) {
		if(strtoupper($name) == "CONTENT-TYPE") {
			$this->setContentType($val);
		}elseif(strtoupper($name) == "CONTENT-LENGTH") {
			$this->setContentLength($val);
		}else {
			if(is_null($this->__headers)) {
				$this->__headers = array();
			}
			$this->__headers[$name] = $val;
		}
	}

	public function getHandler() {
		if(is_null($this->__handle) || empty($this->__handle)) {
			return null;
		}else {
			return $this->__handle;
		}
	}

	public function getResponse() {
		return $this->__msg;
	}

	public function response($msg) {
		$this->__msg = $msg;
	}

	public function responseJSON($json) {
		$this->setContentType("application/json");
		$this->__msg = $json;
	}

	public function getURL() {
		return $this->__url;
	}

	public function error($msg) {
		$this->__errMsg = "ERROR: {$msg}";
	}

	public function getErrMsg() {
		return $this->__errMsg;
	}

	public function setDownloadFileName($name) {
		$this->__download_filename = $name;
	}

	public function getDownloadFileName() {
		return $this->__download_filename;
	}

	public function enableGZip() {
		$this->__gzip = TRUE;
	}

	public function isGZip() {
		return $this->__gzip;
	}

	public function getBaseURL() {
		$base_url = "";
		if(isset($_SERVER["HTTPS"]) && !empty($_SERVER["HTTPS"]) && $_SERVER["HTTPS"] != "off") {
			$base_url .= "https";
		}else {
			$base_url .= "http";
		}
		$base_url .= "://".$_SERVER["HTTP_HOST"].$_SERVER["SCRIPT_NAME"];
		return $base_url;
	}

}

Class RequestHandler {
	private $_handler_table = null;
	public function __construct() {
		$this->_handler_table = array();
	}

	public function register($name, $func) {
		$this->_handler_table[$name] = $func;
	}

	public function addFunction($func) {
		$this->register($func, $func);
	}

	public function accept() {
		$req = new RequestRes();
		$clean_progressbar = "parent.clearAnyFormProgressBar();\nparent.enablePageInput();\n";
		invalidateCache();
		if(is_null($req->getHandler())) {
			$req->error("No handler specified, please check _action parameter!");
			#echo $req->getErrMsg();
			header("Content-type: text/plain");
			header("Content-length: ".strlen($req->getErrMsg()));
			header("X-Anhe-Result: FALSE");
			echo $req->getErrMsg();
		}else if(array_key_exists($req->getHandler(), $this->_handler_table)) {
			#echo "Call handler for ".$req->getHandler();
			if(call_user_func_array($this->_handler_table[$req->getHandler()], array(&$req))) {
				if(isset($req->_callback)) {
					if($req->_callback == '__nocallback') {
						$req->response("---jiajia__nocallback_boundary---\n\r".$req->getResponse());
					}else {
						$msg = addslashes($req->getResponse());
						if(!empty($req->_callback_id)) {
							$script = "parent.{$req->_callback}('{$req->_callback_id}', '{$msg}');\n";
						}else {
							$script = "parent.{$req->_callback}('{$msg}');\n";
						}
						$req->response(send_script($clean_progressbar.$script));
					}
					$req->setContentType('text/html');
				}
				if(is_null($req->__content_type)) {
					header("Content-type: text/plain");
				}else {
					header("Content-type: ".$req->__content_type);
				}
				$response = $req->getResponse();
				$compressed = FALSE;
				if($req->isGZip()) {
					header("X-Anhe-Content-Encoding: gzip");
					$response = gzencode($response, 9);
					$compressed = TRUE;
				}
				if(is_null($req->__content_length) || $compressed) {
					header("Content-length: ".mb_strlen($response,'8bit'));
				}else {
					header("Content-length: ".$req->__content_length);
				}
				if(!is_null($req->getDownloadFileName())) {
					header("Content-Disposition: attachment;filename=\"{$req->getDownloadFileName()}\"");
					header('Cache-Control: max-age=0');
				}
				if(isset($req->__headers) && !is_null($req->__headers)) {
					foreach($req->__headers as $key=>$val) {
						header($key.": ".$val);
					}
				}
				header("X-Anhe-Result: TRUE");
				echo $response;
			}else {
				if(isset($req->_callback)) {
					header('Content-type: text/html');
					if($req->_callback == '__nocallback') {
						$req->response("---jiajia__nocallback_boundary---\n\r".$req->getErrMsg());
					}else {
						$err = addslashes($req->getErrMsg());
						if(!empty($req->_callback_id)) {
							$script = "parent.{$req->_callback}('{$req->_callback_id}', '{$err}');\n";
						}else {
							$script = "parent.{$req->_callback}('{$err}');\n";
						}
						$req->response(send_script($clean_progressbar.$script));
					}
					$response = $req->getResponse();
				}else {
					header("Content-type: text/plain");
					if($req->getErrMsg() == "") {
						$req->error("Unknown Error!");
					}
					$response = $req->getErrMsg();
				}
				header("Content-length: ".strlen($response));
				header("X-Anhe-Result: FALSE");
				echo $response;
			}
		}else {
			#echo "NO handler for ".$req->getHandler();
			header("Content-type: text/plain");
			$req->error("No registered handler for ".$req->getHandler());
			header("Content-length: ".strlen($req->getErrMsg()));
			header("X-Anhe-Result: FALSE");
			echo $req->getErrMsg();
		}
	}

}

?>
