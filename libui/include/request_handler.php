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
<?

include "include/config.php";
include "include/db.inc.php";
include "include/utils.inc.php";
include "include/relation.inc.php";
include "include/image.inc.php";
include "include/mail.inc.php";
include "include/message.inc.php";
include "include/wedding.inc.php";
include "include/partner.inc.php";
include "include/get_form_data.inc.php";

$_db_conn = db_open();

if(!isset($_action) || !isset($_callback)) {
	echo "Unknown action!";
	exit();
}

$success = 0;

if($_action=="ADD_COMMENT" && isset($_visitor_id) && isset($_obj_id) && isset($_comment_texts) && $_comment_texts != "") {
}

db_close($_db_conn);

if($success == 1) {
	if($_callback == '__nocallback') {
		echo "---jiajia__nocallback_boundary---\n\r";
		echo $msg;
	}else {
		if(isset($_callback_id)) {
			$script = "parent.$_callback('{$_callback_id}', '{$msg}');\n";
		}else {
			$script = "parent.$_callback('{$msg}');\n";
		}
		send_script($script);
	}
}

?>
