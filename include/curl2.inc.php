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

if(!defined("_CURL_INC_")) {
	define("_CURL_INC_", "TRUE");

#####################

class cURL { 

	var $headers; 
	var $user_agent; 
	var $compression; 
	var $cookie_file; 
	var $proxy; 
	var $response = null;
	var $response_info = null;
	var $response_body = null;

	private function parseResponse($result) {
		$this->response = array();
		while($result != "") {
			$endpos = strpos($result, "\r");
			if($endpos < 0) {
				$endpos = strpos($result, "\n");
			}
			if($endpos >= 0) {
				$line = substr($result, 0, $endpos);
				$offset = 1;
				if(strpos($result, "\r\n") == $endpos) {
					$offset = 2;
				}
				$result = substr($result, $endpos+$offset);
			}else {
				$line = $result;
				$result = "";
			}
			if($line == "") {
				if(preg_match('/^HTTP\/1\.(0|1) /', $result) == 0) {
					$this->response_body = $result;
					break;
				}
			}else {
				$colonpos = strpos($line, ":");
				if($colonpos > 0) {
					$key = substr($line, 0, $colonpos);
					$val = trim(substr($line, $colonpos + 1));
					$this->response[$key] = $val;
				}else {
					$this->response["Status"] = $line;
				}
			}
		}
	}

	function getResponseCode() {
		if(!is_null($this->response_info) && array_key_exists("http_code", $this->response_info)) {
			return $this->response_info["http_code"];
		}else {
			return FALSE;
		}
	}

	function getContentType() {
		if(!is_null($this->response_info) && array_key_exists("content_type", $this->response_info)) {
			return $this->response_info["content_type"];
		}else {
			return FALSE;
		}
	}

	function getResponseHeader($key) {
		if(!is_null($this->response) && array_key_exists($key, $this->response)) {
			return $this->response[$key];
		}else {
			return FALSE;
		}
	}

	function getResponse() {
		return $this->response_body;
	}

	function cURL($cookies=FALSE, $cookie='cookies.txt', $compression='gzip', $proxy='') { 
		$this->reset();
		$this->compression=$compression; 
		$this->proxy=$proxy; 
		$this->cookies=$cookies; 

		if ($this->cookies == TRUE) {
			$this->cookie($cookie); 
		}
	}

	function reset() {
		//$this->headers[] = 'Accept: image/gif, image/x-bitmap, image/jpeg, image/pjpeg'; 
		//$this->headers[] = 'Accept: text/plain';
		$this->headers = array('Accept: */*', 'Connection: Close');
		$this->user_agent = 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; .NET CLR 1.0.3705; .NET CLR 1.1.4322; Media Center PC 4.0)'; 
	}

	function header($str) {
		$this->headers[] = $str;
	}

	function userAgent($str) {
		$this->user_agent = $str;
	}

	function cookie($cookie_file) {
		if (file_exists($cookie_file)) { 
			$this->cookie_file=$cookie_file; 
		} else { 
			fopen($cookie_file,'w') or $this->error('The cookie file could not be opened. Make sure this directory has the correct permissions'); 
			$this->cookie_file=$cookie_file; 
			fclose($this->cookie_file); 
		} 
	}

	function get($url) { 
		$this->response = null;
		$this->response_info = null;
		$this->response_body = null;
		$process = curl_init($url); 
		curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers); 
		curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent); 
		if ($this->cookies == TRUE) {
			curl_setopt($process, CURLOPT_COOKIEFILE, $this->cookie_file); 
			curl_setopt($process, CURLOPT_COOKIEJAR, $this->cookie_file); 
		}
		curl_setopt($process, CURLOPT_ENCODING , $this->compression); 
		curl_setopt($process, CURLOPT_TIMEOUT, 30); 
		if ($this->proxy) {
			curl_setopt($cUrl, CURLOPT_PROXY, 'proxy_ip:proxy_port');
		}
		curl_setopt($process, CURLOPT_RETURNTRANSFER, 1); 
		curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1); 
		curl_setopt($process, CURLOPT_HTTPGET, TRUE);
		curl_setopt($process, CURLOPT_HEADER, TRUE); 
		$return = curl_exec($process); 
		if($return !== FALSE) {
			$this->parseResponse($return);
			$this->response_info = curl_getinfo($process);
		}
		curl_close($process);
		return $return; 
	}

	function post($url,$data) { 
		$this->response = null;
		$this->response_info = null;
		$this->response_body = null;
		//$this->headers[] = 'Content-type: application/x-www-form-urlencoded;charset=UTF-8'; 
		$process = curl_init($url); 
		curl_setopt($process, CURLOPT_HTTPHEADER, $this->headers); 
		curl_setopt($process, CURLOPT_USERAGENT, $this->user_agent); 
		if ($this->cookies == TRUE) {
			curl_setopt($process, CURLOPT_COOKIEFILE, $this->cookie_file); 
			curl_setopt($process, CURLOPT_COOKIEJAR, $this->cookie_file); 
		}
		curl_setopt($process, CURLOPT_ENCODING , $this->compression); 
		curl_setopt($process, CURLOPT_TIMEOUT, 30); 
		if ($this->proxy) {
			curl_setopt($cUrl, CURLOPT_PROXY, 'proxy_ip:proxy_port');
		}
		curl_setopt($process, CURLOPT_POSTFIELDS, $data); 
		curl_setopt($process, CURLOPT_RETURNTRANSFER, 1); 
		curl_setopt($process, CURLOPT_FOLLOWLOCATION, 1); 
		curl_setopt($process, CURLOPT_POST, 1); 
		curl_setopt($process, CURLOPT_HEADER, TRUE); 
		$return = curl_exec($process); 
		if($return !== FALSE) {
			$this->parseResponse($return);
			$this->response_info = curl_getinfo($process);
		}
		curl_close($process); 
		return $return; 
	}

}

##################

}

?>
