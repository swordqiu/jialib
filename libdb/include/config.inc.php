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

if(!defined("MYSQL_DB_HOST")) {
	define("MYSQL_DB_HOST", "127.0.0.1");
}

if(!defined("MYSQL_DB_USER")) {
	define("MYSQL_DB_USER", "root");
}

if(!defined("MYSQL_DB_PASS")) {
	define("MYSQL_DB_PASS", "123");
}

if(!defined("MYSQL_DB_PORT")) {
	define("MYSQL_DB_PORT", "3306");
}

if(!defined("MYSQL_DB_NAME")) {
	define("MYSQL_DB_NAME", "mag");
}

if(!defined("MSSQL_DB_HOST")) {
	define("MSSQL_DB_HOST", "127.0.0.1");
}

if(!defined("MSSQL_DB_USER")) {
	define("MSSQL_DB_USER", "sa");
}

if(!defined("MSSQL_DB_PASS")) {
	define("MSSQL_DB_PASS", "123");
}

if(!defined("MSSQL_DB_PORT")) {
	define("MSSQL_DB_PORT", "1433");
}

if(!defined("MSSQL_DB_NAME")) {
	define("MSSQL_DB_NAME", "oa");
}

if(!defined("LIBDB_REMOVE_EMPTY_FIELDS")) {
	define("LIBDB_REMOVE_EMPTY_FIELDS", FALSE);
}

?>
