import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

// Тестовые данные продуктов
const testProducts = [
  {
    name: "Бургер чеддер & бекон",
    description:
      "Котлета из говядины криспи, булочка, томат, сыр Чеддер, грудинка, лук красный, салат айсбер, майонез, кетчуп, сырный соус",
    price: 520,
    weight: "360 гр",
    image: "1.png",
  },
  {
    name: "BBQ с беконом и курицей",
    description:
      "Булочка бриошь с кунжутом, куриная котлета, сыр чеддер, томат, огурец маринованный, лук маринованный, салат Ромен, бекон, соус BBQ",
    price: 480,
    weight: "390 гр",
    image: "2.png",
  },
  {
    name: "Дабл биф бургер",
    description:
      "Две говяжьи котлеты, сыр чеддер, салат романо, маринованные огурцы, свежий томат, бекон, красный лук, соус бургер, горчица",
    price: 750,
    weight: "420 гр",
    image: "3.png",
  },
];

/**
 * Добавляет тестовые данные в Firestore
 */
export const seedFirestoreData = async () => {
  try {
    console.log("Начинаем добавление тестовых данных в Firestore...");

    const productsCollection = collection(db, "products");

    for (const product of testProducts) {
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: new Date().toISOString(),
      });
      console.log(`Добавлен продукт: ${product.name} с ID: ${docRef.id}`);
    }

    console.log("✅ Все тестовые данные успешно добавлены!");
    return true;
  } catch (error) {
    console.error("❌ Ошибка при добавлении данных:", error);
    return false;
  }
};

// Функция для вызова из консоли браузера
window.seedData = seedFirestoreData;
