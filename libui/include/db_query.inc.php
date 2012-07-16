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

if(!function_exists("get_query_db")) {
	die("function get_query_db must be defined before db_query.inc.php!");
}

if(!defined(_DB_INC_)) {
	die("_DB_INC_ is not included before db_query.inc.php!");
}

include_once("get_form_data.inc.php");

invalidateCache();

$conn = get_query_db();

if(isset($_query_format) && is_string($_query_format) && strlen($_query_format) > 0) {
	#_log($_query_format);
	$_query_format = toArray(json_decode(stripslashes($_query_format)));
	if(count($_query_format) > 0) {
		if(isset($_query_params) && is_string($_query_params) && strlen($_query_params) > 0) {
			$_query_params = toArray(json_decode(stripslashes($_query_params)));
		}else {
			$_query_params = null;
		}
	}else {
		$_query_format = null;
		$_query_params = null;
	}
}else {
	$_query_format = null;
	$_query_params = null;
}

if(isset($_query_cond) && isset($_query_vars) && isset($_query_order) && isset($_query_tbls) && $_query_tbls != "") {

	$_query_cond  = stripslashes($_query_cond);
	$_query_vars  = stripslashes($_query_vars);
	$_query_tbls  = stripslashes($_query_tbls);
	$_query_order = stripslashes($_query_order);

	#_log("db_query: SELECT {$_query_vars} FROM {$_query_tbls} WHERE {$_query_cond}");

	if(isset($_export_conf)) {
		$output = $conn->query_result($_query_vars, $_query_tbls, $_query_cond, $_query_order, 0, 0, $_query_format, $_query_params);
	}else {
		$output = $conn->query_json($_query_vars, $_query_tbls, $_query_cond, $_query_order, $_query_limit, $_query_offset, $_query_format, $_query_params);
	}

}elseif(isset($_query_proc)) {
	$_query_proc = stripslashes($_query_proc);

	if(isset($_export_conf)) {
		$output = $conn->query_proc($_query_proc, 0, 0, $_query_format, $_query_params);
	}else {
		$output = $conn->proc_json($_query_proc, $_query_limit, $_query_offset, $_query_format, $_query_params);
	}

}elseif(isset($_query_func)) {
	if(!defined("LIBUI_DB_QUERY_FUNC_SCRIPT_PATH")) {
		die("die LIBUI_DB_QUERY_FUNC_SCRIPT_PATH is not defined!");
	}

	if(isset($_export_conf)) {
		$output = $conn->query_func($_query_func, $_REQUEST, 0, 0, $_query_format, $_query_params);
	}else {
		$output = $conn->func_json($_query_func, $_REQUEST, $_query_limit, $_query_offset, $_query_format, $_query_params);
	}

}else{
	echo "ERROR: Illegal request!";
}

function num2chr($num) {
	$base = 'A';
	if($num >= 26) {
		$mod = (int)($num/26);
		$lead = number2char($mod-1);
		$num = $num - $mod*26;
	}
	return $lead.chr(ord($base)+$num);
}

if(isset($_export_conf)) {
	$output = $output['data'];
	if(!defined('LIBUI_PHPEXCEL_INC_PATH')) {
		die('LIBUI_PHPEXCEL_INC_PATH is not defined!');
	}
	require_once(LIBUI_PHPEXCEL_INC_PATH.'/PHPExcel.php');
	require_once(LIBUI_PHPEXCEL_INC_PATH.'/PHPExcel/IOFactory.php');

	$objPHPExcel = new PHPExcel();

	$objPHPExcel->getProperties()->setCreator(JIALIB_NAME." ver ".JIALIB_VERSION." PHPExcel exporter");
	$objPHPExcel->getProperties()->setTitle($_export_title);
	$objPHPExcel->getProperties()->setSubject(JIALIB_NAME." exported Excel document!");
	$objPHPExcel->getProperties()->setDescription(JIALIB_NAME." exports data in DBGrid into Excel Documents.");

	// Add some data
	$objPHPExcel->setActiveSheetIndex(0);

	$head_conf = json_decode(stripslashes($_export_conf));
	#print_r($head_conf);

	$styleArray = array(
		'font' => array(
			'bold' => true,
		),
		'alignment' => array(
			'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
		),
		/*'borders' => array(
			'top' => array(
				'style' => PHPExcel_Style_Border::BORDER_THIN,
			),
		),*/
		'fill' => array(
			'type' => PHPExcel_Style_Fill::FILL_SOLID,
			'startcolor' => array(
				'argb' => 'FFDDDDDD',
			),
		),
	);

	$max_width = array();
	for($i = 0; $i < count($head_conf); $i ++) {
		$col = num2chr($i);
		#$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setAutoSize(true);
		$objPHPExcel->getActiveSheet()->getStyle($col.'1')->applyFromArray($styleArray);
		$content = $head_conf[$i]->title;
		$objPHPExcel->getActiveSheet()->setCellValue($col.'1', $content);
		$max_width[$i] = strlen($content);
		#echo $head_conf[$i]->title;
	}
	for($r = 0; $r < count($output); $r ++) {
		for($i = 0; $i < count($head_conf); $i ++) {
			$content = $output[$r][$head_conf[$i]->field];
			#if(isset($head_conf[$i]->format)) {
			#	$content = call_user_func_array($head_conf[$i]->format, $content);
			#}
			$objPHPExcel->getActiveSheet()->setCellValue(num2chr($i).($r+2), $content);
			#echo $output[$r][$head_conf[$i]->field];
			if($max_width[$i] < strlen($content)) {
				$max_width[$i] = strlen($content);
			}
		}
	}
	for($i = 0; $i < count($max_width); $i ++) {
		$col = num2chr($i);
		$objPHPExcel->getActiveSheet()->getColumnDimension($col)->setWidth($max_width[$i]*1.2);
	}

	$objPHPExcel->getDefaultStyle()->getFont()->setSize(10);

	// Rename sheet
	$objPHPExcel->getActiveSheet()->setTitle($_export_title);

	// Set active sheet index to the first sheet, so Excel opens this as the first sheet
	$objPHPExcel->setActiveSheetIndex(0);

	// Redirect output to a client’s web browser (Excel5)
	header('Content-Type: application/vnd.ms-excel');
	header('Content-Disposition: attachment;filename="'.$_export_title.'.xls"');
	header('Cache-Control: max-age=0');

	$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
	$objWriter->save('php://output');
	
}else {
	echo $output;
}

$conn->close();

?>
