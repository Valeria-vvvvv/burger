# Настройка Firestore Database в Firebase

## Шаг 1: Включение Firestore Database

1. В консоли Firebase перейдите в раздел "Firestore Database"
2. Нажмите "Создать базу данных"
3. Выберите режим безопасности:
   - **Начать в тестовом режиме** (для разработки)
   - **Начать в заблокированном режиме** (для продакшена)
4. Выберите расположение базы данных (ближайшее к вашим пользователям)

## Шаг 2: Создание коллекций и документов

### Создание коллекции "products"

1. В консоли Firestore нажмите "Начать коллекцию"
2. Введите ID коллекции: `products`
3. Добавьте первый документ с ID: `0`

#### Структура документа продукта:

```json
{
  "id": "0",
  "name": "Poäng Armchair",
  "alias": "poäng-armchair",
  "category": "Chair",
  "description": "A comfortable armchair with a unique design, perfect for relaxation.",
  "details": {
    "features": [
      "Durable frame made of high-quality materials.",
      "Comfortable cushioning for extended seating.",
      "Ergonomic design for optimal support.",
      "Available in multiple upholstery options.",
      "Assembly required; tools and instructions included."
    ],
    "dimensions": {
      "width": "75 cm",
      "height": "95 cm",
      "depth": "80 cm"
    },
    "materials": ["Fabric upholstery", "Wooden frame"],
    "careInstructions": "Regularly vacuum or brush to remove dust. Clean with a damp cloth if necessary.",
    "colors": ["Blue", "Gray", "Beige"]
  },
  "rating": "4.7",
  "price": "79.99",
  "imgSrc": "../assets/products/product-1.avif",
  "isFavorite": true,
  "cartQuantity": 1
}
```

## Шаг 3: Импорт данных из JSON

### Программный импорт

Создайте скрипт для импорта данных:

```javascript
// scripts/importData.js
import { db } from "../src/config/firebase.js";
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import data from "../db.json";

async function importData() {
  try {
    // Импорт продуктов
    for (const product of data.products) {
      await setDoc(doc(db, "products", product.id), product);
      console.log(`Продукт ${product.name} импортирован`);
    }

    // Импорт пользователей
    for (const user of data.users) {
      await setDoc(doc(db, "users", user.id), user);
      console.log(`Пользователь ${user.email} импортирован`);
    }

    console.log("Импорт завершен успешно!");
  } catch (error) {
    console.error("Ошибка импорта:", error);
  }
}

importData();
```

## Шаг 4: Настройка правил безопасности

В разделе "Правила" настройте доступ к данным:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Разрешить чтение продуктов всем пользователям
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }

    // Разрешить доступ к пользователям только аутентифицированным
    match /users/{userId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == userId || request.auth.token.role == 'admin');
    }
  }
}
```
