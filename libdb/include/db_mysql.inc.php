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

define("DB_ENGINE_MYSQL", "MYSQL");

class MYSqlConn extends DBConn {

	public function __construct($charset=SYSTEM_CHARSET) {
		parent::__construct($charset);
	}

	public function open($host, $user, $passwd, $dbname, $port="") {
		if(empty($port)) {
			$port = 3306;
		}
		$this->__db_link = new mysqli($host, $user, $passwd, $dbname, $port);
		if (mysqli_connect_errno()) {
			$this->__db_link = null;
			printf("Connect failed: %s\n", mysqli_connect_error());
			return false;
		}
		return true;
	}

	public function close() {
		if(!is_null($this->__db_link)) {
			$this->__db_link->close();
		}
	}

	public function query($sql) {
		if($this->getCharset() != SYSTEM_CHARSET) {
			$sql = iconv(SYSTEM_CHARSET, $this->getCharset(), $sql);
		}
		$result = $this->__db_link->query($sql, MYSQLI_USE_RESULT);
		if(FALSE === $result) {
			_log("Qeury String {$sql} Error ".$this->__db_link->error);
		}
		return $result;
	}

	public function last_id() {
		$sql = "SELECT LAST_INSERT_ID()";
		$result = $this->fetch_data($sql, 0, 0, DB_RESULT_NUM);
		if(!is_null($result)) {
			return $result[0][0];
		}else {
			return -1;
		}
	}

	public function fetch_data($sql, $limit, $offset, $type, $format=NULL, &$params=NULL) {
		if(!is_null($limit) && $limit != "" && is_numeric($limit)) {
			$sql.= " LIMIT $limit";
		}
		if(!is_null($offset) && $offset != "" && is_numeric($offset)) {
			$sql.= " OFFSET $offset";
		}
		$result = $this->query($sql);
		if(false === $result) {
			return null;
		}else {
			$rows = array();
			if($type == DB_RESULT_NUM) {
				$ttype = MYSQLI_NUM;
			}else {
				$ttype = MYSQLI_ASSOC;
			}
			while($row = $result->fetch_array($ttype)) {
				if($this->getCharset() != SYSTEM_CHARSET) {
					$row = convertCharset($row, $this->getCharset(), SYSTEM_CHARSET);
				}
				if(!is_null($format) && is_array($format)) {
					foreach($format as $key=>$val) {
						if(array_key_exists($key, $row)) {
							$row[$key] = call_user_func_array($val, array($row[$key], $params));
						}
					}
				}
				$rows[] = $row;
			}
			$this->free_result($result);
			return $rows;
		}
	}

	private function free_result($result) {
		$result->close();
		while($this->__db_link->more_results()) {
			$l_result = $this->__db_link->store_result();
			if(false !== $l_result) {
				$l_result->close();
			}
		}
	}

}

?>
