jQuery SendMail Plugin <sup>2.0.5</sup>
-------
[![](https://data.jsdelivr.com/v1/package/npm/flextabs-js/badge)](https://www.jsdelivr.com/package/npm/flextabs-js) <br><br>
_Универсальный плагин отправки HTML-форм средствами PHP, jQuery, AJAX. Плагин автоматически собирает значения всех полей формы и в виде HTML-таблицы отправляет на указанный почтовый ящик. Для удобной и надежной отправки писем через SMTP-сервер используется библиотека PHPMailer._

* Отправка форм без перезагрузки страницы - AJAX
* Поддержка всех типов полей HTML5
* Поддержка отправки вложений (single, multiple)
* Возможность задавать массив получателей, отправителя, тему, редактировать HTML-содержимое письма
* Сохраняется работоспособность форм при отключенном JS (можно создавать/задвать отдельные страницы и переправлять на них при событиях: "Форма успешная отправлена" и "Ошибка при отправке формы")

<br>

[Документация](https://wahawaher.github.io/flextabs-js)

## CDN:
[https://cdn.jsdelivr.net/gh/WahaWaher/sendmail-js/dist/](https://cdn.jsdelivr.net/gh/WahaWaher/sendmail-js/dist/)


## Пакетные менеджеры:
```sh
# NPM
npm i sendmails-js
# YARN
yarn add sendmails-js
```

## Подключение:

1. Подключить последнюю версию  **jQuery**  и  **jquery.sendmail.js**
```html
<!-- jQuery -->
<script src="libs/jquery/dist/jquery.min.js"></script>

<!-- jquery.sendmail.js -->
<script src="dist/jquery.sendmail.js"></script>
```
2. В корневую директорию сайта скопировать папку **mail/** со всем ее содержимым. В файле **mail/sendmail.php** отредактировать значения следующих обязательных параметров:
```php
$recipients    // Получатели писем
$smtp_host     // SMPT-адрес сервера
$smtp_port     // TCP-порт
$smtp_secure   // SMTP TLS/SSL
$smtp_auth     // SMPT-аутентификация
$smtp_username // Почтовый ящик, с которого будут отправляться письма
$smtp_password // Пароль почтового ящика, с которого будут отправляться письма

// Остальные параметры по необходимости...
```
Значения параметров: `SMPT-адрес сервера`, `TCP-порт`, `SMTP TLS/SSL`, `SMPT-аутентификация` будут зависить от почтового ящика, который будет выбран в качестве отправителя. По умолчанию все настройки заданы для `gmail.com`.<br><br>
[Настройки SMTP для наиболее популярных почтовых сервисов](http://wahawaher.ru/sendmail-js/#ref-smtp)<br>
[Если возникли ошибки при отправке через SMTP Google](http://wahawaher.ru/sendmail-js/#google-smtp-errors)<br>

3. Создать HTML-форму:
```html
<form class="example" action="mail/sendmail.php" method="POST">
  <input type="text" name="Имя">
  <input type="email" name="E-mail">
  <input type="submit" value="Отправить">
</form>
```

4. Инициализировать плагин на форме/ах:
```javascript
$('form.example').sendMail({
	// Параметры...
});
```

## Требования:
- [jQuery](http://jquery.com/download/) (версия 1.9.1 или выше)
- PHP 5.5 или выше

## Поддержка
Решение проблем/багов плагина, а также замечания и пожелания в [соответствующей теме](http://github.com/WahaWaher/sendmail-js/issues)

По всем другим вопросам:  [wahawaher@gmail.com](mailto:wahawaher@gmail.com "Написать на wahawaher@gmail.com")

## Лицензия (MIT)
Copyright (c) 2018-2020 Sergey Kravchenko

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, а также лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторском праве и данные условия должны быть включены во все копии или значимые части данного Программного Обеспечения.

ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ ГАРАНТИИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ, НО НЕ ОГРАНИЧИВАЯСЬ ИМИ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ТРЕБОВАНИЯМ, В ТОМ ЧИСЛЕ, ПРИ ДЕЙСТВИИ КОНТРАКТА, ДЕЛИКТЕ ИЛИ ИНОЙ СИТУАЦИИ, ВОЗНИКШИМ ИЗ-ЗА ИСПОЛЬЗОВАНИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫХ ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
