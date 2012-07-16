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

function system_check() {
	$exts = array("json", "curl", "mysqli", "gd", "xml");
	if(defined("REQUIRED_EXTENSIONS")) {
		$exts = array_merge($exts, REQUIRED_EXTENSIONS); 
	}

	foreach($exts as $ext) {
		if(!extension_loaded($ext)) {
			return "PHP Extension {$ext} not loaded!";
		}
	}

	$OS = strtoupper(substr(PHP_OS, 0, 3));
	if($OS == 'LIN' || $OS == 'DAR') {
		# Linux or Darwin
		$php_exe = "php";
		$mysql_exe = "mysql";
	}elseif($OS == 'WIN') {
		# Windows
		$php_exe = "php.exe";
		$mysql_exe = "mysql.exe";
	}else {
		return "Unsupported Operating System!".PHP_OS;
	}

	$php_path = null;
	$mysql_path = null;
	$server_path = null;
	foreach($_SERVER as $key=>$val) {
		if(strtoupper($key) == "PATH") {
			$server_path = $val;
		}
	}
	if(is_null($server_path)) {
		return "Cannot find environment variable PATH";
	}

	$paths = explode(PATH_SEPARATOR, $server_path);
	foreach($paths as $syspath) {
		$syspath = trim($syspath);
		if(!empty($syspath)) {
			if(is_null($php_path) && file_exists($syspath.DIRECTORY_SEPARATOR.$php_exe)) {
				$php_path = $syspath.DIRECTORY_SEPARATOR.$php_exe;
			}
			if(is_null($mysql_path) && file_exists($syspath.DIRECTORY_SEPARATOR.$mysql_exe)) {
				$mysql_path = $syspath.DIRECTORY_SEPARATOR.$mysql_exe;
			}
		}
	}

	if(is_null($php_path)) {
		return "Cannot find php executive in PATH";
	}
	if(is_null($mysql_path)) {
		return "Cannot find mysql executive in PATH";
	}

	if($OS == "LIN") {
		if(!file_exists("/usr/bin/php")) {
			return "No /usr/bin/php presents, please make a symbol link of php executive to /usr/bin/php";
		}
	}

	return TRUE;
}

function verify_env() {
	if(!defined("LOCAL_CONFIG_DIR")) {
		echo "No LOCAL_CONFIG_DIR defined!";
	}

	$ret = system_check();
	if ($ret !== TRUE) {
		return $ret;
	}

	$log_dirs = array("log", "tmp", "etc");
	foreach ($log_dirs as $log_dir) {
		$dir = LOCAL_CONFIG_DIR . DIRECTORY_SEPARATOR . $log_dir;
		if (file_exists($dir) && !is_writable($dir)) {
			return "{$dir} is not writable!";
		}elseif(!file_exists($dir)) {
			if (!mkdir($dir, 0777, TRUE)) {
				return "Cannot create {$dir}, please make sure ".LOCAL_CONFIG_DIR." is writable!";
			}
		}
	}
	$custom_config = CUSTOM_CONFIG;
	if (file_exists($custom_config)) {
		if (!is_writable($custom_config)) {
			return "{$custom_config} is not writable!";
		}
	}elseif (!touch($custom_config)){
		return "Failed to create {$custom_config}, which is not writable!";
	}
	return TRUE;
}

?>
