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

if(!defined("MAG_PUSHENGINE_URI")) {
	die("MAG_PUSHENGINE_URI is not defined!");
}

function registerDevice($user, $passwd, $pin, $device, $software, $platform, $mdsserver) {
	$query = array(
		"_action" => "REGIST",
		"_user"   => $user,
		"_passwd" => $passwd,
		"_pin"    => $pin,
		"_software" => $software,
		"_platform" => $platform,
		"_device" => $device,
		"_mds" => $mdsserver
	);
	$curl = new cURL();
	magLog(MAG_PUSHENGINE_URI."?".http_build_query($query));
	$ret = $curl->post(MAG_PUSHENGINE_URI, http_build_query($query));
	#echo $curl->getResponse();
	#magLog("registerDevice".$ret);
	$result = $curl->getResponseHeader("X-Anhe-Result");
	if($result === FALSE || $result !== "TRUE") {
		return FALSE;
	}else {
		return TRUE;
	}
}

function unregisterDevice($pin) {
	$query = array(
		"_action"=>"UNREG",
		"_pin"=>$pin
	);
	$curl = new cURL();
	$ret = $curl->post(MAG_PUSHENGINE_URI, http_build_query($query));
	#magLog("registerDevice".$ret);
	$result = $curl->getResponseHeader("X-Anhe-Result");
	if($result === FALSE || $result !== "TRUE") {
		return FALSE;
	}else {
		return TRUE;
	}
}

function registerURL($pin, $url, $expire) {
	$query = array(
		"_action"=>"CACHE",
		"_pin"=>$pin,
		"_url"=>$url,
		"_expire"=>$expire
	);
	$curl = new cURL();
	#magLog(http_build_query($query));
	$ret = $curl->post(MAG_PUSHENGINE_URI, http_build_query($query));
	magLog("registerURL:".$ret);
	$result = $curl->getResponseHeader("X-Anhe-Result");
	if($result === FALSE || $result !== "TRUE") {
		return FALSE;
	}else {
		return TRUE;
	}
}

?>
