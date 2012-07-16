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

function loadScript($src, $embed, $debug = false)
{
    if ($debug == true)
    {
        if ($embed)
        {
            $script_dir = DEBUG_SCRIPT_ROOT_DIR;
        }
        else
        {
            $script_dir = DEBUG_SCRIPT_ROOT;
        }
    }
    else
    {
        if ($embed)
        {
            $script_dir = SCRIPT_ROOT_DIR;
        }
        else
        {
            $script_dir = SCRIPT_ROOT;
        }
    }
    if (true == $embed)
    {
        echo "<script language=JavaScript type=\"text/javascript\"><!--\n";
        include ("{$script_dir}/{$src}");
        echo "\n//--></script>\n";
    }
    else
    {
        echo "<script language=JavaScript type=\"text/javascript\" src=\"{$script_dir}/{$src}\"></script>";
    }
}

function includeScript($script_dir, $script_dir_url, $src, $embed)
{
    #_log("includeScript: embed={$embed}");
    if (true == $embed)
    {
        echo "<script language=JavaScript type=\"text/javascript\"><!--\n";
        include ("{$script_dir}/{$src}");
        echo "\n//--></script>\n";
    }
    else
    {
        echo "<script language=JavaScript type=\"text/javascript\" src=\"{$script_dir_url}/{$src}\"></script>";
    }
}

function printGlobalJSVars()
{
    echo "<script language='JavaScript' type='text/javascript'><!--\n";

    echo "var LIB_ROOT=\"" . LIB_ROOT . "/\";";
    echo "var IMAGE_ROOT=\"" . IMAGE_ROOT . "\";";
    echo "var SCRIPT_ROOT=\"" . SCRIPT_ROOT . "\";";
    echo "var DEBUG_SCRIPT_ROOT=\"" . DEBUG_SCRIPT_ROOT . "\";";
    echo "var LIBUI_DB_QUERY_SCRIPT=\"" . LIBUI_DB_QUERY_SCRIPT . "\";";
    #echo "var LIBUI_REQUEST_SCRIPT=\"".LIBUI_REQUEST_SCRIPT."\";";
    echo "var LIBUI_RPC_SCRIPT=\"" . LIBUI_RPC_SCRIPT . "\";";
    echo "var LIBUI_REQUEST_HANDLER_SCRIPT = \"" . LIBUI_REQUEST_HANDLER_SCRIPT . "\";";
    echo "var LIBUI_AJAX_DEBUG = \"" . LIBUI_AJAX_DEBUG . "\";";
    echo "var LIBUI_DB_QUERY_DEBUG = \"" . LIBUI_DB_QUERY_DEBUG . "\";";

    foreach ($_SESSION as $key => $val)
    {
        echo "var _session{$key}='{$val}';";
    }

    echo "\n//-->\n</script>\n";
}

function isIntegerIndexedArray($var)
{
    for ($i = 0; $i < count($var); $i++)
    {
        if (false === array_key_exists($i, $var))
        {
            return false;
        }
    }
    return true;
}

function varPHP2JS($var)
{
    if (is_array($var))
    {
        $str = "";
        if (isIntegerIndexedArray($var))
        {
            foreach ($var as $val)
            {
                if (!empty($str))
                {
                    $str .= ",";
                }
                $str .= varPHP2JS($val);
            }
            return "[" . $str . "]";
        }
        else
        {
            foreach ($var as $key => $val)
            {
                if (!empty($str))
                {
                    $str .= ",";
                }
                $str .= "\"" . jsstr($key) . "\":" . varPHP2JS($val);
            }
            return "{" . $str . "}";
        }
    } elseif (is_bool($var))
    {
        if ($var === true)
        {
            return 'true';
        }
        else
        {
            return 'false';
        }
    } elseif (is_numeric($var))
    {
        return $var;
    }
    else
    {
        return "'" . jsstr($var) . "'";
    }
}

function printGlobalVar2JS($name)
{
    if (array_key_exists($name, $GLOBALS))
    {
        $var = $GLOBALS[$name];
        echo "var {$name} = " . varPHP2JS($var) . ";";
    }
}

function print_header($title)
{
    echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">";
    echo "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\">";
    echo "<head><meta http-equiv=\"Content-Language\" content=\"zh-cn\" />";
    echo "<meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />";
    echo "<meta name=\"keywords\" content=\"" . SITE_KEYWORDS . "\" />";
    echo "<meta name=\"description\" content=\"" . SITE_DESCRIPTIONS . "\" />";
    echo "<title>$title</title>\n";
    printGlobalJSVars();
    loadScript("EventManager.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("json2.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("flashtitle.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("utils.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("dragdrop.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("md5.js", LIBUI_SCRIPTS_EMBEDDED);
    loadScript("popupmanager.js", LIBUI_SCRIPTS_EMBEDDED);

    if(defined("LIBUI_USER_SCRIPTS_DIR") && defined("LIBUI_USER_SCRIPTS_DIR_URL")) {
        if ($handle = opendir(LIBUI_USER_SCRIPTS_DIR)) {
            while (FALSE !== ($file = readdir($handle))) {
                if ($file != "." && $file != ".." && preg_match('/\.js$/', $file) > 0) {
                    includeScript(LIBUI_USER_SCRIPTS_DIR, LIBUI_USER_SCRIPTS_DIR_URL, $file, LIBUI_SCRIPTS_EMBEDDED);
                }
            }
            closedir($handle);
        }
    }

    printStyleSheet();
    echo "</head><body>\n";
    echo "<iframe name=\"_ajax_iframe\" id=\"_ajax_iframe\" src=\"\" style=\"border: 0; height: 0; width: 0; padding: 0; position: absolute;\" ></iframe>\n";
    echo "<form name=\"_ajax_form\" id=\"_ajax_form\" action=\"\" method=\"POST\" target=\"\"></form>\n";
}

function printStyleSheet()
{

?>
<style type="text/css">
body 
{
	margin-left: 0px;
	margin-top: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
	background-image: url(images/bg.jpg);
	background-repeat: repeat;
	font-size: 12px ;
}
#maindiv
{
    margin: 10% auto;
    width: 100%;
    height: 100%;
}
A:link {
    TEXT-DECORATION: none;
    color:#000000;
}

A:visited 
{
    color:#000000;
    TEXT-DECORATION: underline;
}
A:hover 
{
    color:#000000;
    TEXT-DECORATION: underline;
}
A:active 
{
    color:#000000;
    TEXT-DECORATION: none;
}
h1, h2, h3, h4, h5, h6 
{
    margin:0; 
    padding:0;
}
ul, ol, li, dl, dt, dd 
{
    list-style:none;
     margin:0; 
     padding:0; 
     text-align:left; 
}
img, fieldset, form 
{
    border:0;
}
.clear
{
    clear:both;
}
a, a:link, a:visited, a:active 
{
    text-decoration:none; 
    color: #636363;/*原颜色color:#b31e41; 38AF00*/
}
a:hover 
{
    text-decoration:underline; 
    color: #636363;/*原颜色color:#b31e41;*/
}
.menu_list li 
{
    float:right; 
    padding-left: 20px; 
    font-size: 12px; 
    padding-top:3px;
    padding-bottom:3px;
}
input, select, textarea 
{
    border: 1px solid #888; 
    margin:1px; 
    padding:1px;
    font-size:13px;
}
.panel_title 
{
    color: #333333; 
    padding-top: 5px; 
    padding-bottom:5px; 
    padding-left: 6px; 
    padding-right: 6px; 
    font-weight: bold
}
.error 
{
    color: #880000; 
    font-weight: bold
}
#_submit_button
{
    font-size:12px;
    cursor: pointer;
    width: 101px;
    height: 32px;
    background-image: url('images/submit.png');
    background-repeat: repeat;
    background-attachment: scroll;
    background-position: center;
    border: 0 solid #000000;
    text-align: center;
    padding-top: 3px
}
.menu_bar_n 
{
	padding-top: 12px;
}
.menu_bar_n a, td
{
	font-size: 14px; 
}

</style>
<?php

}

function print_footer()
{
    echo "</body></html>";
}

#function jsstr($content) {
#	return str_replace(array("\r\n", "\n", "\r"), "\\n", addslashes($content));
#}

function showSearchBox($confname, $hint, $general_search_fields, $size = 20, $advfunc = null)
{
    $pane_id = "_{$confname}_searchbox_pane";
    if (is_array($advfunc) && null !== $advfunc)
    {
        $advfunc_str = ", {layout: {$advfunc['layout']}, callback: {$advfunc['callback']}, fields: " .
            varPHP2JS($advfunc['fields']) . "}";
    }
    else
    {
        $advfunc_str = '';
    }
    if(is_string($general_search_fields)) {
        $fields_str = $general_search_fields;
    }else {
        $fields_str = varPHP2JS($general_search_fields);
    }
    echo "<script language='JavaScript'><!--
function _init_{$confname}_searchbox() {
	makeContentPanelSearchBox('{$confname}', document.getElementById('{$pane_id}'), '" .
        jsstr($hint) . "', {$fields_str}, {$size}{$advfunc_str});
}
EventManager.Add(window, 'load', _init_{$confname}_searchbox);
//--></script>
<div style='padding-left: 10px; padding-top:10px;' width='100%' align='left' id='{$pane_id}'></div>";
}

function showPanel2($scheme, $name, $title, $expand, $config_conf, $content_func, $query, $page_conf, $onchange = null, $params = null)
{
    if (is_array($scheme))
    {
        $frame_id = $scheme['frame'];
        if (array_key_exists('panel', $scheme))
        {
            $panel_id = $scheme['panel'];
        }
        if (array_key_exists('title_img', $scheme))
        {
            $bgtitle = $scheme['title_img'];
        }
    }
    else
    {
        $frame_id = $scheme;
    }
    $scheme_str = "frame_scheme: $frame_id";
    if (isset($panel_id))
    {
        $scheme_str .= ",panel_scheme:$panel_id";
    }
    if (isset($bgtitle))
    {
        $scheme_str .= ",title_img: '$bgtitle'";
    }
    if ($expand == PANEL_UNEXPANDABLE)
    {
        $expand_str = 'none';
    } 
    elseif ($expand == PANEL_EXPANDABLE_EXPAND)
    {
        $expand_str = 'expand';
    }
    else
    {
        $expand_str = 'collapse';
    }
    if (!is_null($onchange))
    {
        $onchange_str = "onchange: {$onchange},";
    }
    else
    {
        $onchange_str = '';
    }
    if (!is_null($page_conf))
    {
        if (array_key_exists('limit', $page_conf))
        {
            $page_limit = $page_conf['limit'];
        }
        else
        {
            echo "ERROR: if page_conf is provided, limit must be present!\n";
            exit;
        }
        if (array_key_exists('position', $page_conf))
        {
            switch ($page_conf['position'])
            {
                case PAGE_POSITION_TOP:
                    $page_position = 'top';
                    break;
                case PAGE_POSITION_BOTTOM:
                    $page_position = 'bottom';
                    break;
                case PAGE_POSITION_BOTH:
                    $page_position = 'both';
                    break;
                case PAGE_POSITION_NONE:
                    $page_position = 'none';
                    break;
            }
        }
        else
        {
            $page_position = 'none';
        }
        $page_offset = 0;
        $pagestr = "page_limit: {$page_limit}, page_offset: {$page_offset}, page_position: '{$page_position}', ";
    }
    else
    {
        $page_limit = 0;
        $page_offset = 0;
        $pagestr = '';
    }
    if (array_key_exists('query_format', $query))
    {
        $db_format = $query['query_format'];
        if (array_key_exists('query_format_params', $query))
        {
            $db_format_params = $query['query_format_params'];
        }
        else
        {
            $db_format_params = null;
        }
        $formatstr = "query_format: " . json_encode($db_format);
        if (!is_null($db_format_params))
        {
            $formatstr .= ", query_format_params: " . json_encode($db_format_params);
        }
        $formatstr .= ",";
    }
    else
    {
        $db_format = null;
        $db_format_params = null;
        $formatstr = '';
    }
    if (array_key_exists('query_proc', $query))
    {
        $querystr = "query_proc: \"" . jsstr($query['query_proc']) . "\"";
        if ($expand != PANEL_EXPANDABLE_NOEXPAND)
        {
            $json_str = db_proc_json($query['query_proc'], $page_limit, $page_offset, $db_format,
                $db_format_params);
            $querystr .= ", json_data: {$json_str}";
        }
    } 
    elseif (array_key_exists('query_tables', $query))
    {
        $querystr = "query_vars: \"" . jsstr($query['query_vars']) . "\"";
        $querystr .= ",query_tables: \"" . jsstr($query['query_tables']) . "\"";
        $querystr .= ",query_conditions: \"" . jsstr($query['query_conditions']) . "\"";
        $querystr .= ",query_order: \"" . jsstr($query['query_order']) . "\"";
        if ($expand != PANEL_EXPANDABLE_NOEXPAND)
        {
            $json_str = db_query_json($query['query_vars'], $query['query_tables'], $query['query_conditions'],
                $query['query_order'], $page_limit, $page_offset, $db_format, $db_format_params);
            $querystr .= ", json_data: {$json_str}";
        }
    }
    elseif (array_key_exists('query_func', $query))
    {
        $pstr = '';
        foreach ($query['query_params'] as $pname => $pval)
        {
            if ($pstr != '')
            {
                $pstr .= ', ';
            }
            $pstr .= "$pname:\"" . jsstr($pval) . "\"";
        }
        $querystr = "query_func: \"" . jsstr($query['query_func']) . "\"";
        $querystr .= ",query_params: { $pstr }";
        if ($expand != PANEL_EXPANDABLE_NOEXPAND)
        {
            $json_str = db_func_json($query['query_func'], $query['query_params'], $page_limit,
                $page_offset, $db_format, $db_format_params);
            $querystr .= ", json_data: {$json_str}";
        }
    }
    else
    {
        echo "ERROR: No query string provided for panel {$name}!";
        exit;
    }
    if (!is_null($config_conf))
    {
        $menustr = 'menus: [';
        for ($i = 0; $i < count($config_conf['menus']); $i++)
        {
            if (is_array($config_conf['menus'][$i]))
            {
                $menustr .= "{txt: '" . jsstr($config_conf['menus'][$i]['text']) . "', url: '" . $config_conf['menus'][$i]['icon'] . "'}";
            }
            else
            {
                $menustr .= "'" . jsstr($config_conf['menus'][$i]) . "'";
            }
            if ($i == count($config_conf['menus']) - 1)
            {
                $menustr .= '], ';
            }
            else
            {
                $menustr .= ', ';
            }
        }
        $menustr .= "config_func: {$config_conf['func']}, ";
        if (array_key_exists('show_always', $config_conf) && $config_conf['show_always'] === true)
        {
            $menustr .= "config_show_always: true, ";
        }
    }
    else
    {
        $menustr = '';
    }
    $params_str = '';
    if (!is_null($params))
    {
        $params_str = 'params: ' . json_encode($params) . ', ';
    }
    $contentstr = "content_func: {$content_func}, ";
    $title = jsstr($title);
    echo "<script language='JavaScript'><!--
function _init_{$name}_content(ev, obj) {
        makeContentPanel('{$name}', { {$scheme_str}, expand: '{$expand_str}', title: '{$title}', {$params_str} {$formatstr} {$contentstr} {$menustr} {$pagestr} {$onchange_str} {$querystr}});
}
EventManager.Add(window, 'load', _init_{$name}_content);
//--></script>
<div id='${name}' style='margin:5px;'></div>
";
}

/*
* Show tab control
*
* @param $name string Name of the tab control
* @param $items array array(id=>array(text, width, onclick_funcname), ...)
* @param $default string
*/
function showTableControl($name, $items, $default)
{
    $sel_bg = '#FFFFFF';
    $unsel_bg = '#CCCCCC';
    $border_color = '#BBBBBB';
    $highlight_bg = '#f0f0f0';

    echo "
<script language=\"JavaScript\">
<!--

var _{$name}_selected = '';

function _{$name}_select(id) {
	if(_{$name}_selected != '') {
		var td = document.getElementById(_{$name}_selected);
		td.style.backgroundColor='$unsel_bg';
		td.style.borderBottom='1px solid $border_color';
		var div = document.getElementById(_{$name}_selected + '_div');
		if(div) {
			div.style.height = '0px';
			div.style.overflow = 'hidden';
		}
	}
	var td = document.getElementById(id);
	td.style.borderBottom='';
	td.style.backgroundColor='$sel_bg';
	var div = document.getElementById(id + '_div');
	if(div) {
		div.style.height = 'auto';
		div.style.overflow = 'visible';
	}
	_{$name}_selected = id;
}

var _{$name}_divs = new Array();
";
    $item_keys = array_keys($items);
    for ($i = 0; $i < count($item_keys); $i++)
    {
        echo "_{$name}_divs[$i] = '{$item_keys[$i]}';\n";
    }
    if (isset($items[$default][2]) && $items[$default][2] != '')
    {
        $click_default = $items[$default][2] . "('" . $default . "');";
    }
    else
    {
        $click_default = '';
    }

    echo "
function _init_{$name}_divs(ev) {
	_{$name}_select('$default');
	for(i = 0; i < _{$name}_divs.length; i ++) {
		if(_{$name}_divs[i] != '$default') {
			var div = document.getElementById(_{$name}_divs[i] + '_div');
			if(div) {
				div.style.overflow = 'hidden';
				div.style.height = '0px';
			}
		}else {
			//{$click_default}
		}
	}
}

EventManager.Add(window, 'load', _init_{$name}_divs);

//-->
</script>
";
    echo "<table border=0 cellspacing=0 cellpadding=3 width=100%><tr>";
    echo "<td width='15' style='border-bottom: 1px solid $border_color; border-right: 1px solid $border_color'>&nbsp;</td>";
    foreach ($items as $id => $val)
    {
        if ($id == $default)
        {
            $bgcolor = $sel_bg;
            $style = "border-top: 1px solid $border_color; border-right: 1px solid $border_color;";
        }
        else
        {
            $bgcolor = $unsel_bg;
            $style = "border-top: 1px solid $border_color; border-right: 1px solid $border_color; border-bottom: 1px solid $border_color";
        }
        if (isset($val[2]) && $val[2] != '')
        {
            $onclick = $val[2] . "('$id');";
        }
        else
        {
            $onclick = '';
        }
        echo "<td id=$id style='$style' bgcolor='$bgcolor' align=center width='{$val[1]}' onclick=\"_{$name}_select('$id');{$onclick}\" onmouseover=\"this.style.backgroundColor='$highlight_bg';\" onmouseout=\"if(_{$name}_selected == '$id') this.style.backgroundColor='$sel_bg'; else this.style.backgroundColor='$unsel_bg';\"><span style='cursor:pointer'>{$val[0]}</span></td>";
    }
    echo "<td style='border-bottom: 1px solid $border_color;' align='right' id='_{$name}_shoulder'>&nbsp;</td></tr></table>";
}

?>
