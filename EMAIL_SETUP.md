# Настройка Email уведомлений для Firebase

## Способ 1: EmailJS (Рекомендуемый для быстрого старта)

### 1. Регистрация в EmailJS
1. Перейдите на [emailjs.com](https://www.emailjs.com/)
2. Создайте аккаунт
3. Подтвердите email

### 2. Настройка Email сервиса
1. В панели EmailJS перейдите в **Email Services**
2. Добавьте новый сервис (Gmail, Outlook, etc.)
3. Следуйте инструкциям для настройки

### 3. Создание шаблона
1. Перейдите в **Email Templates**
2. Создайте новый шаблон с переменными:
   ```
   Тема: {{subject}}
   
   Привет, {{to_name}}!
   
   {{message}}
   
   С уважением,
   Команда приложения
   ```

### 4. Обновление конфигурации
В файле `src/services/emailService.js` замените:
```javascript
const EMAILJS_CONFIG = {
  serviceId: 'your_service_id',     // Из Email Services
  templateId: 'your_template_id',    // Из Email Templates  
  publicKey: 'your_public_key'      // Из Account → API Keys
};
```

## Способ 2: Firebase Functions

### 1. Установка Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### 2. Инициализация проекта
```bash
firebase init functions
```

### 3. Установка зависимостей
```bash
cd functions
npm install nodemailer
```

### 4. Настройка переменных окружения
```bash
firebase functions:config:set email.user="your-email@gmail.com" email.pass="your-app-password"
```

### 5. Деплой функций
```bash
firebase deploy --only functions
```

## Способ 3: Встроенные шаблоны Firebase

### 1. Настройка в Firebase Console
1. Перейдите в **Authentication** → **Templates**
2. Настройте шаблоны для:
   - Email address verification
   - Password reset
   - Email change

### 2. Включение уведомлений
1. В **Authentication** → **Settings** → **User actions**
2. Включите нужные уведомления

## Тестирование

После настройки протестируйте:
1. Регистрацию нового пользователя
2. Вход в систему
3. Проверьте получение email уведомлений

## Безопасность

- Никогда не храните email пароли в коде
- Используйте переменные окружения
- Настройте CORS для EmailJS
- Ограничьте количество отправляемых писем
