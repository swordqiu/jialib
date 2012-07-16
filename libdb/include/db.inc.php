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

define("DB_RESULT_NUM", 0);
define("DB_RESULT_ASSOC", 1);

function convertCharset($array, $charset1, $charset2) { 
	if(is_array($array)) {
		foreach ($array as  $key=>$item) { 
			if(is_array($item)) {
				$array[$key]=convertCharset($item, $charset1, $charset2); 
			} elseif(is_string($item)) {
				$array[$key]=iconv($charset1, $charset2, $item);
			}
    		}
	}elseif(is_string($array)) {
		$array = iconv($charset1, $charset2, $array);
	}
	return $array; 
}

include_once("db_conn.inc.php");
include_once("db_mssql.inc.php");
include_once("db_mysql.inc.php");

function db_escape($str) {
	return str_replace(array("%", "_"), array("\\%", "\\_"), $str);
}

function db_get_date() {
	$microtime = gettimeofday();
	$datetime = date('Y-m-d H:i:s', $microtime['sec']);
	$micro = $microtime['usec'];
	return array($datetime, $micro);
}

function db_data_encode($num_row, $rows) {
	if($num_row > 0) {
		$json_dat = array('data_len' => $num_row, 'data'=>$rows);
	}else {
		$json_dat = array('data_len' => 0, 'data'=>array());
	}
	if(LIBDB_REMOVE_EMPTY_FIELDS) {
		$json_dat = removeEmptyFields($json_dat);
	}
	return $json_dat;
}

class DBLink {
	private $__db = null;

	public function __construct($engine, $charset=SYSTEM_CHARSET) {
		if($engine == DB_ENGINE_MSSQL) {
			$this->__db = new MSSqlConn($charset);
		}elseif($engine == DB_ENGINE_MYSQL) {
			$this->__db = new MYSqlConn($charset);
		}else {
			die("unsupported DB engine {$engine}\n");
		}
	}

	public function open($host, $user, $passwd, $dbname, $port) {
		return $this->__db->open($host, $user, $passwd, $dbname, $port);
	}

	public function close() {
		if(!is_null($this->__db)) {
			$this->__db->close();
		}
	}

	public function query($sql) {
		return $this->__db->query($sql);
	}

	public function getCharset() {
		return $this->__db->getCharset();
	}

	public function setCharset($charset) {
		$this->__db->setCharset($charset);
	}

	function get_items($colstr, $table, $condition, $order, $limit, $offset, $type, $format=NULL, &$params=NULL) {
		if($colstr == "") {
			$colstr = "*";
		}
		$sql = "SELECT $colstr FROM $table";
		if(!is_null($condition) && $condition != "") {
			$sql.=" WHERE $condition";
		}
		if(!is_null($order) && $order != "") {
			$sql.= " ORDER BY $order";
		}
		return $this->__db->fetch_data($sql, $limit, $offset, $type, $format, $params);
	}

	function get_item_count($table, $condition) {
		$sql = "select count(*) from $table";
		if($condition != "") {
			$sql.= " where $condition";
		}
		$row = $this->__db->fetch_data($sql, 1, 0, DB_RESULT_NUM);
		if(!is_null($row) && count($row) == 1) {
			return $row[0][0];
		}else {
			return 0;
		}
	}

	function get_single_assoc($colstr, $table, $condition, $order="", $offset=0, $format=NULL, &$params=NULL) {
		$rows = $this->get_items($colstr, $table, $condition, $order, 1, $offset, DB_RESULT_ASSOC, $format, $params);
		if(!is_null($rows) && count($rows) == 1) {
			return $rows[0];
		}else {
			return null;
		}
	}

	function get_assocs($colstr, $table, $condition, $order="", $limit=0, $offset=0, $format=NULL, &$params=NULL) {
		return $this->get_items($colstr, $table, $condition, $order, $limit, $offset, DB_RESULT_ASSOC, $format, $params);
	}

	function get_single_array($colstr, $table, $condition, $order="", $offset=0, $format=NULL, &$params=NULL) {
		$rows = $this->get_items($colstr, $table, $condition, $order, 1, $offset, DB_RESULT_NUM, $format, $params);
		if(!is_null($rows) && count($rows) == 1) {
			return $rows[0];
		}else {
			return null;
		}
	}

	function get_arrays($colstr, $table, $condition, $order="", $limit=0, $offset=0, $format=NULL, &$params=NULL) {
		return $this->get_items($colstr, $table, $condition, $order, $limit, $offset, DB_RESULT_NUM, $format, $params);
	}

	function last_id() {
		return $this->__db->last_id();
	}

	function update($setstr, $table, $condition) {
		$sql = "UPDATE {$table} SET {$setstr}";
		if($condition != "") {
			$sql.=" WHERE {$condition}";
		}
		#_log("update {$sql}");
		return ($this->__db->query($sql) !== false);
	}

	function delete($table, $condition) {
		$sql = "DELETE FROM $table";
		if($condition != "") {
			$sql.= " WHERE $condition";
		}
		return ($this->__db->query($sql) !== false);
	}

	function query_result($_query_str, $_table_name, $_query_cond, $_query_order, $_query_limit=0, $_query_offset=0, $format=NULL, &$params=NULL) {
		if(is_numeric($_query_limit) && $_query_limit > 0) {
			$sub_query = "SELECT {$_query_str} FROM {$_table_name}";
			if(strlen($_query_cond) > 0) {
				$sub_query .= " WHERE {$_query_cond}";
			}
			$row_num = $this->get_item_count("({$sub_query}) sub_tbl", "");
		}else {
			$_query_limit = 0;
			$_query_offset = 0;
			$row_num = 0;
		}
		if($_query_limit == 0 || $row_num > 0) {
			$db_rows = $this->get_assocs($_query_str, $_table_name, $_query_cond, $_query_order, $_query_limit, $_query_offset, $format, $params);
			if(!is_null($db_rows) && count($db_rows) > 0) {
				$rows = $db_rows;
				if($row_num == 0) {
					$row_num = count($db_rows);
				}
				return db_data_encode($row_num, $rows);
			}else {
				_log("Query ".$_query_str." error!");
			}
		}
		return db_data_encode(0, null);
	}

	function query_json($_query_str, $_table_name, $_query_cond="", $_query_order="", $_query_limit=0, $_query_offset=0, $format=NULL, &$params=NULL) {
		$json_dat = $this->query_result($_query_str, $_table_name, $_query_cond, $_query_order, $_query_limit, $_query_offset, $format, $params);
		return json_encode($json_dat);
	}

	function query_proc($proc, $_query_limit=0, $_query_offset=0, $format=NULL, &$params=NULL) {
		$sql= "SELECT * FROM (CALL {$proc}) subtbl";
		if(is_numeric($_query_limit) && $_query_limit > 0) {
			if(!is_numeric($_query_offset) || $_query_offset < 0) {
				$_query_offset = 0;
			}
			$sql .= " LIMIT {$_query_limit} OFFSET {$_query_offset}";
		}
		$row = $this->__db->fetch_data($sql, 0, 0, DB_RESULT_ASSOC, $format, $params);
		return db_data_encode(count($row), $row);
	}

	function proc_json($proc, $limit, $offset, $format=NULL, &$params=NULL) {
		$json_dat = $this->query_proc($proc, $limit, $offset, $format, $params);
		return josn_encode($json_dat);
	}

	function query_func($func_name, $params, $limit=0, $offset=0, $format=NULL, &$format_params=NULL) {
		list($num_row, $rows) = call_user_func_array($func_name, array($this, $params, $limit, $offset, $format, $format_params));
		return db_data_encode($num_row, $rows);
	}

	function func_json($func_name, $params, $limit=0, $offset=0, $format=NULL, &$format_params=NULL) {
		$json_dat = $this->query_func($func_name, $params, $limit, $offset, $format, $format_params);
		return json_encode($json_dat);
	}

}

$__db__ = null;

function db_open($host, $user, $passwd, $dbname, $port, $engine, $charset=SYSTEM_CHARSET) {
	global $__db__;
	$__db__ = new DBLink($engine, $charset);
	if(false === $__db__->open($host, $user, $passwd, $dbname, $port)) {
		$__db__ = null;
	}
	return $__db__;
}

function db_close() {
	global $__db__;
	$__db__->close();
}

function db_query($sql) {
	global $__db__;
	return $__db__->query($sql);
}

function db_get_item_count($table, $condition) {
	global $__db__;
	return $__db__->get_item_count($table, $condition);
}

function db_query_json($_query_str, $_table_name, $_query_cond="", $_query_order="", $limit=0, $offset=0, $format=NULL, &$params=NULL) {
	global $__db__;
	return $__db__->query_json($_query_str, $_table_name, $_query_cond, $_query_order, $limit, $offset, $format, $params);
}

function db_proc_json($proc, $limit=0, $offset=0, $format=NULL, &$params=NULL) {
	global $__db__;
	return $__db__->proc_json($proc, $limit, $offset, $format, $params);
}

function db_func_json($func, $param, $limit=0, $offset=0, $format=NULL, &$params=NULL) {
	global $__db__;
	return $__db__->func_json($func, $param, $limit, $offset, $format, $params);
}

function mysql_open($host=MYSQL_DB_HOST, $user=MYSQL_DB_USER, $passwd=MYSQL_DB_PASS, $dbname=MYSQL_DB_NAME, $port=MYSQL_DB_PORT, $charset=SYSTEM_CHARSET) {
	if(!defined("MYSQL_DB_HOST")) {
		die("MYSQL_DB_HOST is not defined!");
	}
	return db_open($host, $user, $passwd, $dbname, $port, DB_ENGINE_MYSQL, $charset);
}

function mssql_open($host=MSSQL_DB_HOST, $user=MSSQL_DB_USER, $passwd=MSSQL_DB_PASS, $dbname=MSSQL_DB_NAME, $port=MSSQL_DB_PORT, $charset=SYSTEM_CHARSET) {
	if(!defined("MSSQL_DB_HOST")) {
		die("MSSQL_DB_HOST is not defined!");
	}
	return db_open($host, $user, $passwd, $dbname, $port, DB_ENGINE_MSSQL, $charset);
}

?>
