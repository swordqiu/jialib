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

function get_date_sec($input) {
	if(preg_match('/^(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2}) (?P<hour>\d{2}):(?P<min>\d{2}):(?P<sec>\d{2})/', $input, $matches) > 0) {
		$year = $matches['year'];
		$month = $matches['month'];
		$day = $matches['day'];
		$hour = $matches['hour'];
		$min  = $matches['min'];
		$sec  = $matches['sec'];
	}elseif(preg_match('/^(?P<year>\d{4})-(?P<month>\d{2})-(?P<day>\d{2})/', $input, $matches) > 0) {
		$year = $matches['year'];
		$month = $matches['month'];
		$day = $matches['day'];
		$hour = 0;
		$min = 0;
		$sec = 0;
	}else {
		return 0;
	}
	return mktime($hour, $min, $sec, $month, $day, $year);
}

function db_format_datetime($input, &$params) {
	if(is_null($input) || empty($input)) {
		return '';
	}else {
		$epoch = get_date_sec($input);
		if($epoch > 0) {
			return date("Y年n月j日 H时i分", $epoch);
		}else {
			return $input."(unknown)";
		}
	}
}

function db_format_date($input, &$params) {
	if(is_null($input) || empty($input)) {
		return '';
	}else {
		$epoch = get_date_sec($input);
		if($epoch > 0) {
			return date("Y年n月j日", $epoch);
		}else {
			return $input."(unknown)";
		}
	}
}

function db_format_month($input, &$params) {
	if(is_null($input) || empty($input)) {
		return '';
	}else {
		$epoch = get_date_sec($input);
		if($epoch > 0) {
			return date("Y年n月", $epoch);
		}else {
			return $input."(unknown)";
		}
	}
}

function db_format_number($input, &$params) {
	if(is_null($input)) {
		return '0';
	}else {
		return $input;
	}
}

function db_format_percentage($input, &$params) {
	if(is_null($input) || !is_numeric($input)) {
		return '0';
	}else {
		return number_format($input, 0, '.', '').'%';
	}
}

function db_format_currency($input, &$params) {
	if(is_null($input) || !is_numeric($input)) {
		$input = 0;
	}
	return number_format($input, 2, '.', ',');
}

?>
