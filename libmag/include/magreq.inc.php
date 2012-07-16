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

include_once("maglog.inc.php");

function cleanAddr($addr) {
	if(preg_match("/^::ffff:/i", $addr)) {
		$addr = substr($addr, strrpos($addr, ":") + 1);
	}
	return $addr;
}

class MAGRequest {
	private $__handle = null;
	private $__msg    = null;
	private $__pin    = null;
	private $__device = null;
	private $__expire = null;
	private $__url    = null;
	private $__mds_server = null;
	private $__soft_ver = null;
	private $__platform_ver = null;
	public $__content_type = null;
	public $__content_length = null;
	public $__headers = null;

	private function getProtocol() {
		if($_SERVER["SERVER_PROTOCOL"] == "HTTP/1.1") {
			return "http";
		}elseif($_SERVER["SERVER_PROTOCOL"] == "HTTP/1.0") {
			return "http";
		}
		return "http";
	}

	private function getServer() {
		$server = $_SERVER["HTTP_HOST"];
		if($server == "localhost") {
			$server = $_SERVER["SERVER_ADDR"];
		}
		return cleanAddr($server);
	}

	private function retrieveURL() {
		$url = $this->getProtocol()."://".$this->getServer();
		if($_SERVER["SERVER_PORT"] != 80) {
			$url .= $_SERVER["SERVER_PORT"];
		}
		$url .= $_SERVER["SCRIPT_NAME"];
		if(!empty($_SERVER["QUERY_STRING"])) {
			$url .= "?".$_SERVER["QUERY_STRING"];
		}
		return $url;
	}

	public function __construct() {
		foreach($_GET as $key=>$val) {
			$this->{$key} = $val;
		}
		foreach($_POST as $key=>$val) {
			$this->{$key} = $val;
		}
		#foreach($_SERVER as $key=>$val) {
		#	_log("{$key}: {$val}");
		#}
		$this->__url = $this->retrieveURL();
		$this->__msg = "";
		if(array_key_exists("HTTP_VIA", $_SERVER)) {
			$pos = strpos($_SERVER["HTTP_VIA"], "MDS");
			if($pos !== FALSE && $pos === 0) {
				$this->__mds_server = cleanAddr($_SERVER["REMOTE_ADDR"]);
			}
		}
		if(array_key_exists("HTTP_X_ANHE_HANDHELD_INFO", $_SERVER)) {
			$info  = explode(";", $_SERVER["HTTP_X_ANHE_HANDHELD_INFO"]);
			$this->__pin = $info[0];
			$this->__device = $info[1];
			$this->__platform_ver = $info[2];
			$this->__soft_ver = $info[3];
		}
		if(array_key_exists("HTTP_X_ANHE_LINK_EXPIRE", $_SERVER)) {
			$this->__expire = $_SERVER["HTTP_X_ANHE_LINK_EXPIRE"];
		}
		if(isset($this->_action) && !is_null($this->_action) && $this->_action != "") {
			$this->__handle = $this->_action;
		}
		magLog("_url: {$this->__url} _action: {$this->__handle} _pin: {$this->__pin} _expire: {$this->__expire}");
	}

	public function isCacheable() {
		if(isset($this->__expire) && !is_null($this->__expire) && is_numeric($this->__expire) && $this->__expire > 0 && !is_null($this->__pin) && $this->__pin != "") {
			# register push handler
			return TRUE;
		}else {
			return FALSE;
		}
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
		return $this->__handle;
	}

	public function getResponse() {
		return $this->__msg;
	}

	public function redirect($url) {
		$ret = array("_redirect"=>$url);
		$this->__msg = json_encode($ret);
	}
	public function resultOK() {
		$ret = array("_result"=>"OK");
		$this->__msg = json_encode($ret);
	}

	public function response($msg) {
		$this->__msg = $msg;
	}

	public function getPIN() {
		return $this->__pin;
	}

	public function getSoftwareVersion() {
		return $this->__soft_ver;
	}

	public function getPlatformVersion() {
		return $this->__platform_ver;
	}

	public function getDevice() {
		return $this->__device;
	}

	public function getMDSServer() {
		return $this->__mds_server;
	}

	public function getExpire() {
		if(!is_null($this->__expire)) {
			return $this->__expire;
		}else {
			return 0;
		}
	}

	public function getURL() {
		return $this->__url;
	}

}

$_handler_table = array();

function registerHandler($name, $func) {
	global $_handler_table;
	$_handler_table[$name] = $func;
}

function acceptRequest() {
	global $_handler_table;
	$req = new MAGRequest();
	magLogReq($req, "Start!");
	if(is_null($req->getHandler())) {
		header("Content-type: text/plain");
		$msg = "No handler specified, please check _action parameter!";
		header("Content-length: ".strlen($msg));
		header("X-Anhe-MAG-Result: FALSE");
		echo $msg;
	}else if(array_key_exists($req->getHandler(), $_handler_table)) {
		if(call_user_func_array($_handler_table[$req->getHandler()], array(&$req))) {
			if(is_null($req->__content_type)) {
				header("Content-type: application/json");
			}else {
				header("Content-type: ".$req->__content_type);
			}
			$response = $req->getResponse();
			if(is_null($req->__content_length)) {
				header("Content-length: ".strlen($response));
			}else {
				header("Content-length: ".$req->__content_length);
			}
			if(isset($req->__headers) && !is_null($req->__headers)) {
				foreach($req->__headers as $key=>$val) {
					header($key.": ".$val);
				}
			}
			header("X-Anhe-MAG-Result: TRUE");
			if($req->isCacheable()) {
				if(FALSE === registerURL($req->getPIN(), $req->getURL(), $req->getExpire())) {
					magLogReq($req, "registerURL ".$req->getURL()." failed!");
				}
			}
			echo $response;
		}else {
			header("Content-type: text/plain");
			$response = $req->getResponse();
			header("Content-length: ".strlen($response));
			header("X-Anhe-MAG-Result: FALSE");
			echo $response;
		}
	}else {
		header("Content-type: text/plain");
		$msg = "No registered handler for ".$req->getHandler();
		header("Content-length: ".strlen($msg));
		header("X-Anhe-MAG-Result: FALSE");
		echo $msg;
	}
}

?>
