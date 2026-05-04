# Лабораторна робота №3: Інтерактивний Web-додаток
**Розробка клієнтської частини на Vue.js та інтеграція з REST API**

## Інформація про студента
- **ПІБ:** Іваха Богдан Миколайович
- **Група:** КВ-32

## Завдання
1. Ознайомитись із принципами роботи JavaScript-фреймворку **Vue.js**.
2. Реалізувати реактивний інтерфейс користувача з використанням компонентного підходу.
3. Налаштувати асинхронну взаємодію з сервером через **Fetch API**.
4. Забезпечити збереження та відображення даних (пости, коментарі) за допомогою зв'язки **Node.js + SQLite**.
5. Тематика додатка: **Блог з коментарями**.

## Технологічний стек
* **Frontend:** Vue.js, Tailwind CSS.
* **Backend:** Node.js, Express.js.
* **Database:** SQLite.
* **Інструменти:** Fetch API для запитів, LocalStorage для зберігання сесії.

## Посилання
- **GitHub Pages (Frontend):** [https://ivakhabohdan.github.io/web-design-lab1/](https://ivakhabohdan.github.io/web-design-lab1/)
- **URL на документ звіту:** [Google Drive Folder]([https://drive.google.com/drive/folders/1Iy395ZgZAKappJe5Hfcwzf9OYo9nF-3f?hl=ru](https://docs.google.com/document/d/1ih5i1cK6hftY1D_7Ti9ZnYtl0dgZ4Y_3-vGUa0uipOM/edit?usp=sharing))
- **Telegram:** [@ivakha_b](https://t.me/bohdanivakha)

## Функціональні можливості
* **Feed Manager:** Динамічне завантаження постів та коментарів з бази даних.
* **Interactive UI:** Додавання, редагування та видалення публікацій у реальному часі без перезавантаження сторінки.
* **User Profile:** Відображення персональної статистики та даних користувача.
* **Responsive Design:** Адаптивна верстка для зручної роботи на мобільних пристроях та ПК.

## Склад проєкту
- `app.html` — головна робоча сторінка з логікою Vue.js (блог та коментарі).
- `server.js` — серверний код на Node.js для обробки API-запитів.
- `profile.html` — сторінка профілю користувача.
- `index.html` — інформаційна сторінка про додаток.
- `login.html` / `register.html` — форми автентифікації.
- `style.css` — користувацькі стилі та конфігурація Tailwind.
- `readme.md` — опис проєкту.
