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

define("TYPE_INPUT", "INPUT");
define("TYPE_DOCUMENT", "DOCUMENT");
define("TYPE_PANEL", "PANEL");
define("TYPE_TEXT", "TEXT");
define("TYPE_LINK", "LINK");
define("TYPE_FILELINK", "FILELINK");
define("TYPE_NOTE", "NOTE");
define("TYPE_SCRIPT", "SCRIPT");

# LINK
define("LINK_TARGET_SELF", "__self_");
define("LINK_TARGET_NEW",  "__new_");

# INPUT
define("SUBTYPE_INPUT_TEXT", "TEXT");
define("SUBTYPE_INPUT_PASSWORD", "PASSWORD");
define("SUBTYPE_INPUT_DATE", "DATE");
define("SUBTYPE_INPUT_SELECT", "SELECT");
define("SUBTYPE_INPUT_MULTISELECT", "MSELECT");
define("SUBTYPE_INPUT_SUBMIT", "SUBMIT");
define("SUBTYPE_INPUT_CUSTOM", "CUSTOM");
define("SUBTYPE_INPUT_HIDDEN", "HIDDEN");

#
define("MAGDATE_UI_DATE",     "__date_");
define("MAGDATE_UI_TIME",     "__time_");
define("MAGDATE_UI_DATETIME", "__datetime_");

#
define("MAGSELECT_UI_RADIO", "__radio_");
define("MAGSELECT_UI_LIST",  "__list_");
define("MAGSELECT_UI_AUTO",  "__auto_");

# EmailAddressTextFilter, FilenameTextFilter, HexadecimalTextFilter, IPTextFilter, LowercaseTextFilter, NumericTextFilter, PhoneTextFilter, UppercaseTextFilter, URLTextFilter 
define("TEXTINPUT_FILTER_EMAIL",      "_email");
define("TEXTINPUT_FILTER_FILENAME",   "_filename");
define("TEXTINPUT_FILTER_HEXDECIMAL", "_hexdecimal");
define("TEXTINPUT_FILTER_IP",         "_ip");
define("TEXTINPUT_FILTER_LOWERCASE",  "_lowercase");
define("TEXTINPUT_FILTER_NUMERIC",    "_numeric");
define("TEXTINPUT_FILTER_PHONE",      "_phone");
define("TEXTINPUT_FILTER_UPPERCASE",  "_uppercase");
define("TEXTINPUT_FILTER_URL",        "_url");

class MAGStyle {
	var $dat;
	public function __construct() {
		$this->dat = array();
	}
	public function setStyle($name, $val) {
		$this->dat[$name] = $val;
	}
	public function setAlignLeft() {
		$this->setStyle("align", "left");
	}
	public function setAlignCenter() {
		$this->setStyle("align", "center");
	}
	public function setAlignRight() {
		$this->setStyle("align", "right");
	}
	public function setVAlignTop() {
		$this->setStyle("valign", "top");
	}
	public function setVAlignMiddle() {
		$this->setStyle("valign", "middle");
	}
	public function setVAlignBottom() {
		$this->setStyle("valign", "bottom");
	}
	public function setWidth($width) {
		if(is_numeric($width) && $width >= 0 && $width <= 1) {
			$this->setStyle("width", $width);
		}
	}
	public function setHeight($height) {
		$this->setStyle("height", $height);
	}
	public function setBorder($clr) {
		$this->setStyle("border", $clr);
	}
	public function setBorderLeft($clr) {
		$this->setStyle("border-left", $clr);
	}
	public function setBorderTop($clr) {
		$this->setStyle("border-top", $clr);
	}
	public function setBorderRight($clr) {
		$this->setStyle("border-right", $clr);
	}
	public function setBorderBottom($clr) {
		$this->setStyle("border-bottom", $clr);
	}
	public function setBgcolor($val) {
		$this->setStyle("bgcolor", $val);
	}
	public function setColor($val) {
		$this->setStyle("color", $val);
	}
	public function setBold($val) {
		$this->setStyle("fontweight", $val);
	}
	public function &getStyle() {
		return $this->dat;
	}
}

class MAGComponent {
	var $dat;
	public function __construct($type, $title, $id="") {
		$this->dat = array("_type" => $type, "_title" => $title, "_id"=>$id);
	}
	public function &getAttr($key) { /* return by reference */
		if(array_key_exists($key, $this->dat)) {
			return $this->dat[$key];
		}else {
			return null;
		}
	}
	public function setStyle($style) {
		$val = &$style->getStyle();
		if(count($val) > 0) {
			$this->setAttr("_style", $val);
		}
	}
	public function setAttr($key, $val) {
		$this->dat[$key] = $val;
	}
	public function setTitle($val) {
		$this->dat["_title"] = $val;
	}
	public function setId($val) {
		$this->dat["_id"] = $val;
	}
	public function content() {
		return $this->dat;
	}
	public function toJSON() {
		return json_encode($this->dat);
	}
}

class MAGInput extends MAGComponent {
	public function __construct($subtype, $title, $id) {
		parent::__construct(TYPE_INPUT, $title, $id);
		$this->setAttr("_subtype", $subtype);
	}
}

class MAGDocument extends MAGComponent {
	public function __construct($title, $id="") {
		parent::__construct(TYPE_DOCUMENT, $title, $id);
		$this->setAttr("_body", array());
	}

	public function add($comp) {
		$content = &$this->getAttr("_body");
		$content[] = $comp->content();
	}
}

class MAGPanel extends MAGComponent {
	public function __construct($title, $id="") {
		parent::__construct(TYPE_PANEL, $title, $id);
		$this->setAttr("_content", array());
	}

	public function add($component) {
		$content = &$this->getAttr("_content");
		$content[] = $component->content();
	}
}

class MAGText extends MAGComponent {
	public function __construct($title, $text, $id="") {
		parent::__construct(TYPE_TEXT, $title, $id);
		$this->setAttr("_text", $text);
	}
	public function setTitleWidth($width) {
		$this->setAttr("_titlewidth", $width);
	}
}

class MAGLink extends MAGComponent {
	public function __construct($title, $icon, $link, $expire=0, $target=LINK_TARGET_SELF, $id="") {
		parent::__construct(TYPE_LINK, $title, $id);
		$this->setAttr("_icon", $icon);
		$this->setAttr("_target", $target);
		$this->setAttr("_link", $link);
		$this->setAttr("_expire", $expire);
	}
}

class MAGFileLink extends MAGComponent {
	public function __construct($title, $icon, $link, $id="") {
		parent::__construct(TYPE_FILELINK, $title, $id);
		$this->setAttr("_icon", $icon);
		$this->setAttr("_link", $link);
	}
}

class MAGNote extends MAGComponent {
	public function __construct($title, $note, $id="") {
		parent::__construct(TYPE_NOTE, $title, $id);
		$this->setAttr("_note", $note);
	}
}

class MAGScript extends MAGComponent {
	public function __construct($scripts, $id="") {
		parent::__construct(TYPE_SCRIPT, "MAGScript", $id);
		$this->setAttr("_scripts", $scripts);
	}
}

class MAGTextinput extends MAGInput {
	public function __construct($title, $id, $value="", $filter="") {
		parent::__construct(SUBTYPE_INPUT_TEXT, $title, $id);
		$this->setAttr("_value", $value);
		$this->setAttr("_filter", $filter);
	}
}

class MAGPassword extends MAGInput {
	public function __construct($title, $id, $value="") {
		parent::__construct(SUBTYPE_INPUT_PASSWORD, $title, $id);
		$this->setAttr("_value", $value);
	}
}

class MAGDate extends MAGInput {
	# $date: in milliseconds
	public function __construct($title, $id, $date=0, $ui=MAGDATE_UI_DATETIME) {
		parent::__construct(SUBTYPE_INPUT_DATE, $title, $id);
		#if($date == 0) {
		#	$date = time()*1000;
		#}
		$this->setAttr("_date", $date);
		$this->setAttr("_ui", $ui);
	}
}

class MAGSelect extends MAGInput {
	public function __construct($title, $id, $value, $ui=MAGSELECT_UI_AUTO) {
		parent::__construct(SUBTYPE_INPUT_SELECT, $title, $id);
		$this->setAttr("_value", $value);
		$this->setAttr("_options", array());
		$this->setAttr("_ui", $ui);
	}

	public function addOption($text, $val) {
		$options = &$this->getAttr("_options");
		$options[] = array("_text"=>$text, "_value"=>$val);
	}
}

class MAGMultiselect extends MAGInput {
	public function __construct($title, $id) {
		parent::__construct(SUBTYPE_INPUT_MULTISELECT, $title, $id);
		$this->setAttr("_options", array());
	}

	public function addOption($text, $val, $checked) {
		$options = &$this->getAttr("_options");
		if(!is_bool($checked)) {
			$checked = false;
		}
		$options[] = array("_text"=>$text, "_value"=>$val, "_checked"=>$checked);
	}
}

class MAGSubmit extends MAGInput {
	public function __construct($title, $action, $url, $target=LINK_TARGET_SELF, $id="") {
		parent::__construct(SUBTYPE_INPUT_SUBMIT, $title, $id);
		$this->setAttr("_action", $action);
		$this->setAttr("_url", $url);
		$this->setAttr("_target", $target);
	}
}

class MAGCustominput extends MAGInput {
	public function __construct($title, $classname, $value, $id) {
		parent::__construct(SUBTYPE_INPUT_CUSTOM, $title, $id);
		$this->setAttr("_classname", $classname);
		$this->setAttr("_value", $value);
	}
}

class MAGHiddenInput extends MAGInput {
	public function __construct($id, $value) {
		parent::__construct(SUBTYPE_INPUT_HIDDEN, "", $id);
		$this->setAttr("_value", $value);
	}
}

?>
