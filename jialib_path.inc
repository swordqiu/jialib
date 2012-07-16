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

$cur_dir = dirname(__FILE__);
$root_dir = $_SERVER["DOCUMENT_ROOT"];
$cur_url = substr($cur_dir, strlen($root_dir));
if(substr($cur_url, 0, 1) != '/') {
        $cur_url = "/".$cur_url;
}
if(substr($cur_url, strlen($cur_url)-1) != '/') {
        $cur_url .= "/";
}
if(substr($cur_dir, strlen($cur_dir)-1) != '/') {
        $cur_dir .= "/";
}

#echo $cur_url."<br>";
#echo $cur_dir."<br>";

define("_JIALIB_INC_PATH_", $cur_dir);
define("_JIALIB_INC_URL_",  $cur_url);

#define("_JIALIB_INC_PATH_", "/var/www/jialib/");
#define("_JIALIB_INC_URL_", "/jialib/");

?>
