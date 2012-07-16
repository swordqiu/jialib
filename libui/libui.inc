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

if(!defined("_UI_INC_")) {
	define("_UI_INC_", "true");

	$__libui_path = dirname(__FILE__).DIRECTORY_SEPARATOR;
	$__inc_path = $__libui_path."include".DIRECTORY_SEPARATOR;

	include_once($__inc_path."config.inc.php");
	include_once($__inc_path."const.inc.php");
	include_once($__inc_path."format.inc.php");
	include_once($__inc_path."cookie.inc.php");
	include_once($__inc_path."utils.inc.php");
	include_once($__inc_path."get_form_data.inc.php");
}

?>
