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

define("DB_ENGINE_MSSQL", "MSSQL");

class MSSqlConn extends DBConn {
	public function __construct($charset=SYSTEM_CHARSET) {
		parent::__construct($charset);
	}

	public function open($host, $user, $passwd, $dbname, $port="", $charset=SYSTEM_CHARSET) {
		@ini_set('mssql.charset', $charset);
		@ini_set('mssql.textlimit', 2147483647);
		@ini_set('mssql.textsize', 2147483647);
		$connectionInfo = array("UID"=>$user, "PWD"=>$passwd, "Database"=>$dbname, 'MultipleActiveResultSets'=>false);
		if(empty($port)) {
			$servername = "{$host}, {$port}";
		}else {
			$servername = $host;
		}
		$this->__db_link = sqlsrv_connect($servername, $connectionInfo);
		if($this->__db_link === false) {
			$this->__db_link = null;
			print_r( sqlsrv_errors());
			return false;
		}
		return true;
	}

	public function close() {
		if(!is_null($this->__db_link)) {
			sqlsrv_close($this->__db_link);
		}
	}

	public function query($sql) {
		#echo "Query: ".$sql."<br />";
		if($this->getCharset() != SYSTEM_CHARSET) {
			$sql = iconv(SYSTEM_CHARSET, $this->getCharset(), $sql);
		}
		$stmt = sqlsrv_query($this->__db_link, $sql);
		if($stmt === false) {
			echo "Error in statement execution.\n";
			print_r(sqlsrv_errors(), true);
		}
		return $stmt;
	}

	public function fetch_data($sql, $limit, $offset, $type) {
		if($this->getCharset() != SYSTEM_CHARSET) {
			$sql = iconv(SYSTEM_CHARSET, $this->getCharset(), $sql);
		}
		if(is_numeric($limit) && $limit > 0) {
			if(is_numeric($offset) && $offset > 0) {
				$top = $offset + $limit;
			}else {
				$top = $limit;
			}
			$sql = preg_replace('/select/i', "SELECT TOP {$top}", $sql, 1); 
		}
		#echo "Select: ".$sql."<br />";
		$stmt = sqlsrv_query($this->__db_link, $sql, array(), array("Scrollable" => SQLSRV_CURSOR_FORWARD));

		if(is_null($stmt)) {
			return null;
		}

		if($type == DB_RESULT_NUM) {
			$ttype = SQLSRV_FETCH_NUMERIC;
		}else {
			$ttype = SQLSRV_FETCH_ASSOC;
		}

		if(is_numeric($offset) && $offset > 0) {
			for($i = 0; $i < $offset; $i ++) {
				sqlsrv_fetch_array($stmt, $ttype, SQLSRV_SCROLL_NEXT);
			}
		}

		$result = array();
		do {
			$row = sqlsrv_fetch_array($stmt, $ttype, SQLSRV_SCROLL_NEXT);
			if($row !== false && !is_null($row)) {
				$result[] = $row;
			}elseif(is_null($row)) {
				break;
			}else {
				die(print_r(sqlsrv_errors(), true));
			}
		}while(1);

		sqlsrv_free_stmt($stmt);

		if($this->getCharset() != SYSTEM_CHARSET) {
			$result = convertCharset($result, $this->getCharset(), SYSTEM_CHARSET);
		}
		return $result;
	}
}

?>
