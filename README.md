# Meow-LP

Meow LP - LongPoll дежурный для вашей страницы.

# УСТАНОВКА:

1. Получаем токен от Kate Mobile -> https://oauth.vk.com/authorize?client_id=2685278&scope=1073737727&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1
2. Скачиваем сам LP.
3. Открываем файл LPBOT.js через удобный редактор текста. В моём случае это Sublime Text. 
4. Ищем строчки: 8-11. Токен что получили от Kate Mobile мы вставляем в 8 строчку вместо "ТУТВАШТОКЕН". 
5. На строке 10 и 11 Меняем на своё. На 11 строке ваш id вк. 
Готово теперь, к расширенным настройкам.

6. Открываем файл profiles.json через удобный редактор текста. В моём случае это Sublime Text. Находится тут: \Base
7. На 4 строке меняем на свой id vk.
8. На 6 строке ваше Имя, на 7 Фамилия.
9. На 8 строке вставить СТРОГО: 👼 Пользователь Meow LP 👼.
10.На строках 11-13 вставляете ссылку на вас

# ОБЩИЙ ШАГ:

11. Сохраняем оба файла.

12. Заходим в корень папки (/) и запускаем LP.

# ЗАПУСК: 

Если вы на LINUX/macOS/Debian/Kali/и т.д.:

apt-get install nodejs

apt-get update

cd /путь/

npm i google-tts-api

npm i vk-io

npm i fs

npm i request

node LPBOT.js

Если вы на Windows:

Жмите WIN+R и вводите cmd. Там указываете путь к папке. Потом пишите:

npm i google-tts-api

npm i vk-io

npm i fs

npm i request

После:

Открываем папку, там видим файл: "LPBOT.bat", его открываете и всё.

# * ТЕСТ *

ЕСЛИ ВЫ С ANDROID [NEW]

Скачиваете Termux в Play Market.

Заходите в Termux.

В термуксе пишите:

apt-get install nodejs

apt-get update

cd /путь/

npm i google-tts-api

npm i vk-io

npm i fs

npm i request

node LPBOT.js

# ВНИМАНИЕ/WARNING: ЕСЛИ У ВАС В TERMUX НА КЛАВИАТУРЕ НАЖИМАЮТСЯ НЕ ТЕ КЛАВИШИ СКАЧАЙТЕ ТАК-ЖЕ В ПЛЕЙ МАРКЕТЕ: Hacker Keyboard.

Готово. Вы запустили свой LP.

# ВНИМАНИЕ/WARNING: Если вы оставите статус агента, это нарушит правила пользования продуктом. МЫ ПРЕДОСТАВЛЯЕМ ВАМ ДАННУЮ ВЕРСИЮ ДЛЯ ОЗНАКОМЛЕНИЯ.

# P.S. LP БЫЛ ОБНОВЛЁН ДО ВЕРСИИ 1.3.3, И ОБНОВЛЁН!
# P.S.S. Была исправлена установка ЛП. (Были не верные шаги)
