jQuery SendMail Plugin <sup>1.0.7</sup>
-------
_Универсальный плагин отправки HTML-форм средствами PHP, jQuery, AJAX. Плагин автоматически собирает значения всех полей формы и в виде HTML-таблицы отправляет на указанный почтовый ящик. Для удобной и надежной отправки писем через SMTP-сервер используется библиотека PHPMailer._

* Отправка форм без перезагрузки страницы - AJAX
* Поддержка всех типов полей HTML5
* Поддержка отправки вложений (single, multiple)
* Возможность задавать массив получателей, отправителя, тему, редактировать HTML-содержимое письма
* Сохраняется работоспособность форм при отключенном JS (можно создавать/задвать отдельные страницы и переправлять на них при событиях: "Форма успешная отправлена" и "Ошибка при отправке формы" + [рекомендации по оформления подобных форм](https://github.com/WahaWaher/git-test/blob/master/README.md#%D0%9E%D0%B1%D1%89%D0%B8%D0%B5-%D1%80%D0%B5%D0%BA%D0%BE%D0%BC%D0%B5%D0%BD%D0%B4%D0%B0%D1%86%D0%B8%D0%B8))

## Пакетные менеджеры:
```sh
# Bower
bower install --save sendmail-js
```

## Подключение:

1. Подключить jQuery и jquery.sendmail.js
```html
<!-- jQuery -->
<script src="libs/jquery/dist/jquery.min.js"></script>

<!-- jquery.sendmail.js -->
<script src="dist/jquery.sendmail.js"></script>
```
2. В корневую директорию сайта скопировать папку `mail/` со всем ее содержимым.
В этой же папке, в файле `mail.php` изменить основной параметр: `$recipients // Получатели писем`
Измените параметры `$smtp_username` и `$smtp_password` (логин и пароль от почтового ящика, с которого будут отправляться письма),
а также другие настройки smtp, если Ваш ящик не на gmail.com.<br>
[Все опции](https://github.com/WahaWaher/git-test/blob/master/README.md#%D0%9E%D0%BF%D1%86%D0%B8%D0%B8-mailphp)<br>
3. Создать HTML-форму:
```html
<form class="example-form" action="mail/mail.php" method="POST">
	<input type="text" name="Имя">
	<input type="email" name="E-mail">
	<input type="submit" value="Отправить">
</form>
```
4. Инициализировать плагин на форме/ах:
```javascript
$('.example-form').sendMail({
	// Параметры...
});
```

## Примеры использования:
Страница с примерами demo/index.html

## Параметры:

Опция | Тип | Поум. | Описание
------ | ------ | --------- | ---------
`url` | string | 'mail/mail.php' | Путь к PHP-обработчику
`reset` | boolean | true | Очистка полей формы после успешной отправки

## Функции обратного вызова:

Callback | Аргументы | Поум. | Описание
------ | ---- | ------- | -----------
`beforeInit` | \[sets:object\] | n/a | Перед началом инициализации.
`afterInit` | \[sets:object\] | n/a | После инициализации.
`beforeSend` | \[sets:object \] | n/a | Перед отправкой формы.
`afterSend` | \[sets:object \] | n/a | После попытки отправки формы, независимо от ответа.
`onSuccess` | \[sets:object, response:string \] | n/a | Успешная отправка AJAX-запроса.
`onAjaxError` | \[sets:object, response:object\] | n/a | Ошибка при отправке AJAX-запроса.
`onServerError` | \[sets:object, response:string\] | n/a | Ошибка на сервере при отправке формы.

```javascript
$('.example-form').sendMail({
	beforeInit:    function(sets) {},
	afterInit:     function(sets) {},
	beforeSend:    function(sets) {},
	afterSend:     function(sets) {},
	onSuccess:     function(sets, response) {},
	onAjaxError:   function(sets, response) {},
	onServerError: function(sets, response) {}
});
```
## Публичные методы:
Метод | Описание
----------- | -----------
`init` | Инициализация
`reinit` | Реинициализация
`destroy` | Вернуть состояние до инита
`send` | Отправка формы

```javascript
// Инициализация
var options = {};
$('.example-form').sendMail('init', options);

// Реинициализация
$('.example-form').sendMail('reinit'); // Реинит с текущими параметрами

var newOptions = {}; // Объект с новыми параметрами
$('.example-form').sendMail('reinit', newOptions); // Реинит с новыми параметрами

// Вернуть состояние элементa/ов до инита
$('.example-form').sendMail('destroy');

// Отправка формы
$('.example-form').sendMail('send');
```
## Опции mail.php:
Опция | Тип | Описание
------ | ------ | ---------
$recipients | array | Получатели писем
$subject | string | Тема письма
$before_table | string | HTML-содержимое до таблицы
$after_table | string | HTML-содержимое после таблицы
$sep | string | Разделитель между значениями (использ. при форм. HTML-содержимого письма). Например, при отображении нескольких выбранных занчений в select multiple
$smtp_host | string | SMPT-адрес сервера
$smtp_port | number | TCP-порт
$smtp_secure | string | SMTP TLS/SSL
$smtp_auth | boolean | SMPT-аутентификация
$smtp_username | string | Почтовый ящик, с которого будут отправляться письма
$smtp_password | string | Пароль почтового ящика, с которого будут отправляться письма
$success_page | string | Ссылка на страницу (если JS отключен): Успешная отправка формы
$error_page | string | Ссылка на страницу (если JS отключен): Ошибка при отправке формы

## Заметки:
### Дата-атрибуты:
Параметры в data-атрибуте имеют наивысший приоритет. Они переопределят параметры по умолчанию, а так же пользовательские параметры заданные при инициализации.
```javascript
	// Инициализация группы элементов
	$('.example-form').sendMail();
```
```html
	<!-- Переопределение параметров для отдельных эл-ов через Data-атрибут: -->
	<form class="example-form" data-sendmail="{
		reset: true
	}"></form>
	<form class="example-form" data-sendmail="{
		reset: false
		url: 'new-mail.php'
	}"></form>
```

### Переопределение параметров по умолчанию:
```javascript
	// Переопределение параметров по умолчанию:
	$.fn.sendMail.defaults = {};
	
	// Например:
	$.fn.sendMail.defaults = {
		reset: false // изменит станд. значение пар-ра reset
	};
```
### Общие заметки/рекомендации:
- Для поддержки работоспособности формы в случае отключенного в браузере JS, всегда указывать в теге `<form>` атрибуты `action=""` и `method=""` с актуальными значениями.
```html
<form action="mail/mail.php" method="POST"></form>
```
- Для отправки вложений, обязательно наличие аттрибута `enctype="multipart/form-data"` в теге `<form>`
```html
<form action="mail/mail.php" method="POST" enctype="multipart/form-data">
   <input type="file" name="upload">
</form>
```
- Для отправки нескольких вложений из одного поля `<input type="file">`, обязательно наличие конструкции `[]` в атрибуте `name="upload[]"`, а также наличие атрибута `multiple`.
```html
<form action="mail/mail.php" method="POST" enctype="multipart/form-data">
   <input type="file" name="upload[]" multiple>
</form>
```
- При использовании `<select multiple>`, обязательно наличие конструкции `[]` в атрибуте `name="choose-colors[]"`
```html
<select name="choose-colors[]" multiple>
   <option value="green">Зеленый</option>		
   <option value="blue">Синий</option>		
   <option value="red">Красный</option>
</select>
```
- Прикрепление файла к письму (ссылка на файл, относ. путь) PHPMailer:
```php
 $mail->addAttachment($_SERVER["DOCUMENT_ROOT"] . '/folder/file.txt', 'file.txt');
```
- Файлы `error.html` и `success.html` не обязательны (по умолчанию переменные со ссылками на эти страницы закомментированы в файле `mail.php`). Раскомментировать, если пользователя (в браузере которого отключен JS) необходимо направить на соответствующие страницы.
- Пример использования прелоадера на кнопке "Отправить"
```html
<form class="test-form" action="mail/mail.php" method="POST">
	<input type="text" name="Имя">
	<button class="test-form-submit">Отправить</button>
</form>
```
```js
$('.test-form').sendMail({
	beforeSend: function(sets) {
		sets.preloader = $('<span/>').append('<svg width="1em" height="1em" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a"><stop stop-color="#222" stop-opacity="0" offset="0%"/><stop stop-color="#222" stop-opacity=".631" offset="63.146%"/><stop stop-color="#222" offset="100%"/></linearGradient></defs><g transform="translate(1 1)" fill="none"><path d="M36 18c0-9.94-8.06-18-18-18" stroke="#222" stroke-width="2"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/></path><circle fill="#222" cx="36" cy="18" r="1"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite"/></circle></g></svg>');
		sets.preloader.appendTo( $(this).find('.test-form-submit') );
	},
	afterSend: function(sets) {
		sets.preloader.remove();
	}
});
```
- SMPT-адреса серверов наиболее популярных почтовых сервисов (`mail.php`, `$smtp_host`):

Сервис | SMTP-адрес
------ | ----
Gmail.com | smtp.gmail.com
Mail.ru  | smtp.mail.ru
Yandex.ru | smtp.yandex.ru
Rambler.ru | mail.rambler.ru

Следующие параметры зачастую у всех сервисов одни и те же.
```php
$smtp_port     = 465; // TCP-порт
$smtp_secure   = 'ssl'; // SMTP TLS/SSL
$smtp_auth     = true; // SMPT-аутентификация
```

## Требования
- jQuery 1.9.1 или выше
- PHP 5.5 или выше

## История изменений:
### 1.0.7 - 22.09.2018
- Обновление библиотеки PHPMailer до версии 6.0.5

### 1.0.6 - 21.08.2018
- Колбэк "beforeSend" прерывает отправку письма при "return false"
- Некоторые правки для комфортной работы с jQuery Validation Plugin (пример в demo/index.html)

### 1.0.3 - 20.08.2018
- Незначительные правки в коде (не повливают на работу плагина)

### 1.0.2 - 18.08.2018
- Добавлена поддержка цепочек вызовов
- Незначительные изменения в именах некоторых переменных
- Правки в readme.md

## Лицензия (MIT)
Copyright (c) 2018 Sergey Kravchenko

Данная лицензия разрешает лицам, получившим копию данного программного обеспечения и сопутствующей документации (в дальнейшем именуемыми «Программное Обеспечение»), безвозмездно использовать Программное Обеспечение без ограничений, включая неограниченное право на использование, копирование, изменение, слияние, публикацию, распространение, сублицензирование и/или продажу копий Программного Обеспечения, а также лицам, которым предоставляется данное Программное Обеспечение, при соблюдении следующих условий:

Указанное выше уведомление об авторском праве и данные условия должны быть включены во все копии или значимые части данного Программного Обеспечения.

ДАННОЕ ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ ПРЕДОСТАВЛЯЕТСЯ «КАК ЕСТЬ», БЕЗ КАКИХ-ЛИБО ГАРАНТИЙ, ЯВНО ВЫРАЖЕННЫХ ИЛИ ПОДРАЗУМЕВАЕМЫХ, ВКЛЮЧАЯ ГАРАНТИИ ТОВАРНОЙ ПРИГОДНОСТИ, СООТВЕТСТВИЯ ПО ЕГО КОНКРЕТНОМУ НАЗНАЧЕНИЮ И ОТСУТСТВИЯ НАРУШЕНИЙ, НО НЕ ОГРАНИЧИВАЯСЬ ИМИ. НИ В КАКОМ СЛУЧАЕ АВТОРЫ ИЛИ ПРАВООБЛАДАТЕЛИ НЕ НЕСУТ ОТВЕТСТВЕННОСТИ ПО КАКИМ-ЛИБО ИСКАМ, ЗА УЩЕРБ ИЛИ ПО ИНЫМ ТРЕБОВАНИЯМ, В ТОМ ЧИСЛЕ, ПРИ ДЕЙСТВИИ КОНТРАКТА, ДЕЛИКТЕ ИЛИ ИНОЙ СИТУАЦИИ, ВОЗНИКШИМ ИЗ-ЗА ИСПОЛЬЗОВАНИЯ ПРОГРАММНОГО ОБЕСПЕЧЕНИЯ ИЛИ ИНЫХ ДЕЙСТВИЙ С ПРОГРАММНЫМ ОБЕСПЕЧЕНИЕМ.
