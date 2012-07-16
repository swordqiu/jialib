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

function getTempFilename($dirPath, $name) {
	$filename = basename($name);
	if(strlen($filename) > 30) {
		$filename = substr($filename, strlen($filename) - 30);
	}
	do $path = $dirPath . DIRECTORY_SEPARATOR . md5(rand(1000, 9999).gettimeofday(TRUE)).strtolower($filename);
	while (file_exists($path));
	return $path;
}

function upload_file($field, $dirPath, $maxSize, &$msg) {
	foreach ($_FILES[$field] as $key => $val) {
		$$key = $val; 
	}

	if (($size > $maxSize)) {
		$msg = "文件尺寸超过 {$maxSize} 字节";    // file failed basic validation checks
		return false;
	}

	if (($size == 0)) {
		$msg = "该文件为空文件，请您确认是否为您想上传的文件!";    // file failed basic validation checks
		return false;
	}

	if ((!is_uploaded_file($tmp_name)) || ($error != 0)) {
		$msg = "文件尺寸超过 {$maxSize} 字节，请您压缩后上传!";    // file failed basic validation checks
		return false;
	}

	$path = getTempFilename($dirPath, $name);

	if (move_uploaded_file($tmp_name, $path)) {
		return basename($path);
	}

	$msg = "服务器移动文件过程中出错，请您再试一次！";
	return FALSE;
}

function parsecsv($str) {
	$vals = array();
	$tmpval = "";
	$i = 0;
	$in_quote = false;
	while($i < strlen($str)) {
		if($str[$i] == '"') {
			if($in_quote) {
				$in_quote = false;
			}else {
				$in_quote = true;
			}
		}elseif($str[$i] == ',') {
			if(!$in_quote) {
				$vals[] = trim($tmpval);
				$tmpval = "";
			}else {
				$tmpval.=$str[$i];
			}
		}else {
			$tmpval.=$str[$i];
		}
		$i ++;
	}
	$vals[] = trim($tmpval);
	return $vals;
}

function rgb2webcolor($rgb) {
	return sprintf("#%02X%02X%02X", $rgb[0], $rgb[1], $rgb[2]);
}

function color_name_to_hex($cname) {
	$color_map = array('aqua'=>'#00FFFF',
	'green'=>'#008000',
	'navy'=>'#000080',
	'silver'=>'#C0C0C0',
	'black'=>'#000000',
	'gray'=>'#808080',
	'olive'=>'#808000',
	'teal'=>'#008080',
	'blue'=>'#0000FF',
	'lime'=>'#00FF00',
	'purple'=>'#800080',
	'white'=>'#FFFFFF',
	'fuchsia'=>'#FF00FF',
	'maroon'=>'#800000',
	'red'=>'#FF0000',
	'yellow'=>'#FFFF00');
	return $color_map[$cname];
}


function webcolor2rgb($color) {
	if(substr($color, 0, 1) == '#') {
		return sscanf($color, "#%02x%02x%02x"); 
	}else {
		$webcolor = array();
		$webcolor['white'] = array(255, 255, 255);
		$webcolor['black'] = array(0, 0, 0);
		$webcolor['red'] = array(255, 0, 0);
		$webcolor['green'] = array(0, 255, 0);
		$webcolor['blue'] = array(0, 0, 255);
		$webcolor['yellow'] = array(255, 255, 0);
		$webcolor['pink'] = array(255, 0, 255);
		$webcolor['turquoise'] = array(0, 255, 255);
		if(array_key_exists(strtolower($color), $webcolor)) {
			return $webcolor[$color];
		}else {
			die("unknown color $color");
		}
	}
}

function getLine(&$result) {
        $endpos = strpos($result, "\n");
        if($endpos !== FALSE) {
                $line = trim(substr($result, 0, $endpos));
                if(substr($result, $endpos, 2) == "\n\r") {
                        $offset = 2;
                }else {
                        $offset = 1;
                }
                $result = substr($result, $endpos+$offset);
        }else {
                $line = trim($result);
                $result = "";
        }
        return $line;
}

?>
