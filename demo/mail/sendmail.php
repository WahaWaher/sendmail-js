<?php

/**
 * jQuery.sendMail
 * Version: 2.0.0
 * Repo: https://github.com/WahaWaher/sendmail-js
 * Author: Sergey Kravchenko
 * Contacts: wahawaher@gmail.com
 * License: MIT
 */

// Основные настройки:
$recipients = ['example@gmail.com']; // Получатели писем
$subject = $_SERVER['SERVER_NAME'] . ' — Новая заявка'; // Тема письма

$before_table = '<h2 style="color:#222">'. $subject .'</h2><p style="color:#222">Данные клиента:</p>'; // HTML-содержимое до таблицы
$after_table = '<i style="color:#bbb;font-size:12px">Сообщение отправлено с сайта <b>'.$_SERVER['SERVER_NAME'].'</b></i>'; // HTML-содержимое после таблицы
$sep = ', '; // Разделитель между значениями (использ. при форм. HTML-содержимого письма)

// Настройки SMTP:
$smtp_host     = 'smtp.gmail.com'; // SMPT-адрес сервера
$smtp_port     = 465; // TCP-порт
$smtp_secure   = 'ssl'; // SMTP TLS/SSL
$smtp_auth     = true; // SMPT-аутентификация
$smtp_username = 'example@gmail.com'; // Почтовый ящик, с которого будут отправляться письма
$smtp_password = '*****'; // Пароль почтового ящика, с которого будут отправляться письма

// Перенаправления на страницы (если JS отключен):
$success_page = './success.html'; // При успешной отправке
$error_page   = './error.html'; // При Ошибке

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {

	if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {

		require './phpmailer/src/Exception.php';
		require './phpmailer/src/PHPMailer.php';
		require './phpmailer/src/SMTP.php';

		// Формирование HTML-таблицы с введенными данными:
		function createInputsTable($s) {
			$infoTable = '<table width="100%">';
			foreach ( $_POST as $key => $value ) {
				if( $value ) {
					if( $key == 'js' ) continue;
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

		$mail = new PHPMailer(true);
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
		$mail->Body = $before_table . createInputsTable($sep) . $after_table;
		$mail->setLanguage('ru');

		// Загрузка получателей:
		foreach( $recipients as $rec )
			$mail->addAddress($rec);

		// Загрузка вложений:
		if( $_FILES ) {
			foreach( $_FILES as $file) {
				// Одно вложение
				if( $file['name'] != '' && gettype($file['name']) != 'array') {
					$mail->addAttachment($file['tmp_name'], $file['name']);
				// Несколько вложений
				} else if( $file['name'] != '' && gettype($file['name']) == 'array' && $file['name'][0] != '' ) {
					for( $i=0; $i < count($file['name']); $i++ ) {
						$mail->addAttachment($file['tmp_name'][$i], $file['name'][$i]);
					}
				}
			}
		}

		// Отправка формы
		$mail->send();

		// Успешно: Отправка AJAX
		if( $_POST['js'] === 'on' ) header('sendmail: 1');

		// Успешно: Без AJAX (перенаправление)
		else if( $success_page ) header('Location: ' . $success_page);

		// Успешно: Без AJAX (по ум.)
		else echo '<strong>Форма успешно отправлена!</strong>';

	}

} catch (Exception $e) {

	// Ошибка: Отправка AJAX
	if( $_POST['js'] === 'on' ) echo $mail->ErrorInfo;

	// Ошибка: Без AJAX (перенаправление)
	else if( $error_page ) header('Location: ' . $error_page);

	// Ошибка: Без AJAX (по ум.)
	else echo '<strong>При отправке формы произошла ошибка!</strong><br><br>' . $mail->ErrorInfo;

} ?>