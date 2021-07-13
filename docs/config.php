<?php # config.php

// Настройки
$sets = array(
	'html-minify' => false, // Минификация HTML
);

function html_minify($buffer) {

	$min_js = true; // Минификация инлайн JS
	$min_comments = true; // Удалять HTML, JavaScript и CSS комментарии
	$min_utf8 = false; // Удалять XHTML закр. теги из HTML5 элементов
	$min_xhtml = false; // Удалять домен из внетренних ссылок
	$min_relative = false; // Удалять (HTTP: и HTTPS:) со всех ссылок
	$min_scheme = false; // Поддержка multi-byte UTF-8 кодирования (if you see odd characters)

	if ( substr( ltrim( $buffer ), 0, 5) == '<?xml' ) return ( $buffer );

	if ( $min_utf8 == true && mb_detect_encoding($buffer, 'UTF-8', true) ) $mod = '/u';
	else $mod = '/s';

	$buffer = str_replace(array (chr(13) . chr(10), chr(9)), array (chr(10), ''), $buffer);
	$buffer = str_ireplace(array ('<script', '/script>', '<pre', '/pre>', '<textarea', '/textarea>', '<style', '/style>'), array ('M1N1FY-ST4RT<script', '/script>M1N1FY-3ND', 'M1N1FY-ST4RT<pre', '/pre>M1N1FY-3ND', 'M1N1FY-ST4RT<textarea', '/textarea>M1N1FY-3ND', 'M1N1FY-ST4RT<style', '/style>M1N1FY-3ND'), $buffer);
	$split = explode('M1N1FY-3ND', $buffer);
	$buffer = ''; 
	for ($i=0; $i<count($split); $i++) {
		$ii = strpos($split[$i], 'M1N1FY-ST4RT');
		if ($ii !== false) {
			$process = substr($split[$i], 0, $ii);
			$asis = substr($split[$i], $ii + 12);
			if (substr($asis, 0, 7) == '<script') {
				$split2 = explode(chr(10), $asis);
				$asis = '';
				for ($iii = 0; $iii < count($split2); $iii ++) {
					if ($split2[$iii])
						$asis .= trim($split2[$iii]) . chr(10);
					if ( $min_js != false )
						if (strpos($split2[$iii], '//') !== false && substr(trim($split2[$iii]), -1) == ';' )
							$asis .= chr(10);
				}
				if ($asis)
					$asis = substr($asis, 0, -1);
				if ( $min_comments != false )
					$asis = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $asis);
				if ( $min_js != false )
					$asis = str_replace(array (';' . chr(10), '>' . chr(10), '{' . chr(10), '}' . chr(10), ',' . chr(10)), array(';', '>', '{', '}', ','), $asis);
			} else if (substr($asis, 0, 6) == '<style') {
				$asis = preg_replace(array ('/\>[^\S ]+' . $mod, '/[^\S ]+\<' . $mod, '/(\s)+' . $mod), array('>', '<', '\\1'), $asis);
				if ( $min_comments != false )
					$asis = preg_replace('!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $asis);
				$asis = str_replace(array (chr(10), ' {', '{ ', ' }', '} ', '( ', ' )', ' :', ': ', ' ;', '; ', ' ,', ', ', ';}'), array('', '{', '{', '}', '}', '(', ')', ':', ':', ';', ';', ',', ',', '}'), $asis);
			}
		} else {
			$process = $split[$i];
			$asis = '';
		}
		$process = preg_replace(array ('/\>[^\S ]+' . $mod, '/[^\S ]+\<' . $mod, '/(\s)+' . $mod), array('>', '<', '\\1'), $process);
		if ( $min_comments != false )
			$process = preg_replace('/<!--(?!\s*(?:\[if [^\]]+]|<!|>))(?:(?!-->).)*-->' . $mod, '', $process);
		$buffer .= $process.$asis;
	}
	$buffer = str_replace(array (chr(10) . '<script', chr(10) . '<style', '*/' . chr(10), 'M1N1FY-ST4RT'), array('<script', '<style', '*/', ''), $buffer);
	
	if ( $min_xhtml == true && strtolower( substr( ltrim( $buffer ), 0, 15 ) ) == '<!doctype html>' )
		$buffer = str_replace( ' />', '>', $buffer );
	if ( $min_relative == true )
		$buffer = str_replace( array ( 'https://' . $_SERVER['HTTP_HOST'] . '/', 'http://' . $_SERVER['HTTP_HOST'] . '/', '//' . $_SERVER['HTTP_HOST'] . '/' ), array( '/', '/', '/' ), $buffer );
	if ( $min_scheme == true )
		$buffer = str_replace( array( 'http://', 'https://' ), '//', $buffer );

	return ($buffer);
}

if( $sets['html-minify'] ) ob_start('html_minify');

