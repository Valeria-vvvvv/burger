# Настройка Firebase для OAuth аутентификации

## Шаг 1: Создание проекта Firebase

1. Перейдите на [Firebase Console](https://console.firebase.google.com/)
2. Нажмите "Создать проект"
3. Введите название проекта и следуйте инструкциям
4. Выберите, нужен ли вам Google Analytics (рекомендуется)

## Шаг 2: Добавление веб-приложения

1. В консоли Firebase нажмите на иконку веб-приложения (</>)
2. Введите название приложения
3. Скопируйте конфигурацию Firebase

## Шаг 3: Обновление конфигурации

Замените значения в файле `src/config/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "ваш-api-key",
  authDomain: "ваш-проект.firebaseapp.com",
  projectId: "ваш-проект-id",
  storageBucket: "ваш-проект.appspot.com",
  messagingSenderId: "ваш-sender-id",
  appId: "ваш-app-id",
};
```

## Шаг 4: Включение аутентификации

1. В консоли Firebase перейдите в "Authentication" → "Sign-in method"
2. Включите следующие провайдеры:
   - **Email/Password** (для обычной регистрации)
   - **Google** (для входа через Google)
   - **GitHub** (для входа через GitHub)

## Шаг 5: Настройка Google OAuth

1. В разделе "Google" нажмите "Enable"
2. Добавьте email поддержки
3. Сохраните настройки

## Шаг 6: Настройка GitHub OAuth

1. В разделе "GitHub" нажмите "Enable"
2. Перейдите в [GitHub Developer Settings](https://github.com/settings/developers)
3. Нажмите "New OAuth App"
4. Заполните форму:
   - **Application name**: Название вашего приложения
   - **Homepage URL**: `http://localhost:5173` (для разработки)
   - **Authorization callback URL**: `http://localhost:5173` (для разработки)
5. Скопируйте **Client ID** и **Client Secret**
6. Вернитесь в Firebase и вставьте эти данные
7. Сохраните настройки

## Шаг 7: Настройка доменов (для продакшена)

В разделе "Authorized domains" добавьте ваши домены:

- `localhost` (для разработки)
- Ваш продакшен домен

## Шаг 8: Правила безопасности (опционально)

В разделе "Firestore Database" → "Rules" настройте правила доступа:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Проверка работы

1. Запустите проект: `npm run dev`
2. Откройте модальное окно входа/регистрации
3. Попробуйте войти через Google или GitHub
4. Проверьте консоль браузера на наличие ошибок

## Возможные проблемы

### Ошибка "popup_closed_by_user"

- Пользователь закрыл окно авторизации
- Это нормальное поведение

### Ошибка "auth/popup-blocked"

- Браузер заблокировал всплывающее окно
- Разрешите всплывающие окна для вашего сайта

### Ошибка "auth/unauthorized-domain"

- Домен не добавлен в разрешенные
- Добавьте домен в Firebase Console

### Ошибка "auth/operation-not-allowed"

- Провайдер не включен в Firebase
- Включите нужный провайдер в Authentication → Sign-in method

## Дополнительные настройки

### Персонализация OAuth

Вы можете настроить внешний вид OAuth окон:

```javascript
// В src/config/firebase.js
googleProvider.setCustomParameters({
  prompt: "select_account",
});

githubProvider.addScope("user:email");
githubProvider.addScope("read:user");
```

### Обработка ошибок

В компонентах уже добавлена базовая обработка ошибок. Вы можете расширить её:

```javascript
catch (error) {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      setError('Окно авторизации было закрыто');
      break;
    case 'auth/popup-blocked':
      setError('Браузер заблокировал всплывающее окно');
      break;
    default:
      setError('Произошла ошибка при авторизации');
  }
}
```
