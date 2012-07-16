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

define("LIB_ROOT",    _JIALIB_INC_URL_."/libui/");

define("IMAGE_ROOT",  _JIALIB_INC_URL_."/libui/images/");

define("SCRIPT_ROOT", _JIALIB_INC_URL_."/libui/scripts/");
define("DEBUG_SCRIPT_ROOT", _JIALIB_INC_URL_."/libui/scripts/");

define("SCRIPT_ROOT_DIR",       $__libui_path."scripts/");
define("DEBUG_SCRIPT_ROOT_DIR", $__libui_path."scripts/");

define("SITE_KEYWORDS", "");
define("SITE_DESCRIPTIONS", "");

if(!defined("LIBUI_DB_QUERY_SCRIPT")) {
	die("LIBUI_DB_QUERY_SCRIPT is not defined!");
}

if(!defined("LIBUI_REQUEST_HANDLER_SCRIPT")) {
	die("LIBUI_REQUEST_HANDLER_SCRIPT is not defined!");
}

if(!defined("LIBUI_RPC_SCRIPT")) {
	die("LIBUI_RPC_SCRIPT is not defined!");
}

if(!defined("LIBUI_AJAX_DEBUG")) {
	define("LIBUI_AJAX_DEBUG", FALSE);
}

if(!defined("LIBUI_DB_QUERY_DEBUG")) {
	define("LIBUI_DB_QUERY_DEBUG", FALSE);
}

if(!defined("LIBUI_SCRIPTS_EMBEDDED")) {
	define("LIBUI_SCRIPTS_EMBEDDED", FALSE);
}

if(defined("LIBUI_DB_QUERY_FUNC_SCRIPT_PATH")) {
	include_once(LIBUI_DB_QUERY_FUNC_SCRIPT_PATH);
}

?>
