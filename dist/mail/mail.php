<?php

/**
 * jQuery.sendMail
 * Version: 1.0.6
 * Repo: https://github.com/WahaWaher/sendmail-js
 * Author: Sergey Kravchenko
 * Contacts: wahawaher@gmail.com
 * License: MIT
 */

// Настройки:
$recipients = ['mailsend.js@gmail.com']; // Получатели писем
$subject   = 'Тема письма'; // Тема письма

$before_table = ''; // HTML-содержимое до таблицы
$after_table  = ''; // HTML-содержимое после таблицы
$sep          = ', '; // Разделитель между значениями (использ. при форм. HTML-содержимого письма)

// Настройки SMTP:
$smtp_host     = 'smtp.gmail.com'; // SMPT-адрес сервера
$smtp_port     = 465; // TCP-порт
$smtp_secure   = 'ssl'; // SMTP TLS/SSL
$smtp_auth     = true; // SMPT-аутентификация
$smtp_username = 'mailsend.js@gmail.com'; // Почтовый ящик, с которого будут отправляться письма
$smtp_password = 'PH7Xu5uUnZ'; // Пароль почтового ящика, с которого будут отправляться письма

// Перенаправления на страницы (если JS отключен): 
// $success_page = $_SERVER['HTTP_ORIGIN'] . '/mail/success.html'; // Успешная отправка формы
// $error_page   = $_SERVER['HTTP_ORIGIN'] . '/mail/error.html'; // Ошибка при отправке формы


if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

	// Формирование HTML-таблицы с введенными данными:
	function inputsTable($s) {
		$infoTable = '<table width="100%">';
		foreach ( $_POST as $key => $value ) {
			if( $value ) {
				if( $key == 'errorReport' ) continue;
				// Склеивание значений мультиполей
				if( gettype($value) == 'array' ) {
					foreach( $value as $sub_value ) {
						if( !next($value) ) $new_value .= $sub_value;
						else $new_value .= $sub_value . $s;
					} 
					$value = $new_value;
				} 
				$infoTable .= '
					<tr style="background-color: #f8f8f8; color: #757575; font-size: 14px;">
						<td style="padding: 10px; border: #e9e9e9 1px solid; font-weight: bold; width: 30%;">' . preg_replace("/_/", " ", $key) . '</td>
						<td style="padding: 10px; border: #e9e9e9 1px solid;">' . trim(htmlspecialchars($value)) . '</td>
					</tr>';
			}
		}
		return $infoTable .= '</table>';
	}

	require_once('phpmailer/PHPMailerAutoload.php');
	$mail = new PHPMailer;
	$mail->CharSet = 'utf-8';
	$mail->isSMTP();
	$mail->Host = $smtp_host;
	$mail->Port = $smtp_port;
	$mail->SMTPSecure = $smtp_secure;
	$mail->SMTPAuth = $smtp_auth;
	$mail->Username = $smtp_username;
	$mail->Password = $smtp_password;
	$mail->setFrom($smtp_username);
	$mail->isHTML(true);
	$mail->Subject = $subject;
	$mail->Body = $before_table.inputsTable($sep).$after_table;

	// Загрузка получателей:
	foreach( $recipients as $rec )
		$mail->addAddress($rec);

	// Загрузка вложений:
	if( $_FILES ) {
		foreach( $_FILES as $file) {
			// SingleFile
			if( $file['name'] != '' && gettype($file['name']) != 'array') {
				$mail->addAttachment($file['tmp_name'], $file['name']);
			// Multiple
			} else if( $file['name'] != '' && gettype($file['name']) == 'array' && $file['name'][0] != '' ) {
				for( $i=0; $i < count($file['name']); $i++ ) {
					$mail->addAttachment($file['tmp_name'][$i], $file['name'][$i]);
				}
			}
		}
	}

	// Отправка формы:
	if( !$mail->send() ) {

		// Ошибка при отправке формы:
		if( $_POST['errorReport'] ) echo 'sendmail-server-error'; // Возвращ. строку с ошибкой клиенту

		if( isset($error_page) ) {
			header('Location: ' . $error_page);
		} else {
			header('Content-Type: text/html; charset=utf-8');
			echo 'Ошибка при отправке формы!';
		}

	} else {
		
		// Форма успешно отправлена:
		if( isset($success_page) ) {
			header('Location: ' . $success_page);
		} else {
			header('Content-Type: text/html; charset=utf-8');
			echo 'Форма успешно отправлена!';
		}

	}

}

 ?>