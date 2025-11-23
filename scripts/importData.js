import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase.js";
import { burgers } from "../src/data/burgers.js";

async function importData() {
  try {
    console.log("Начинаем импорт данных в Firestore...");

    // Импорт продуктов
    console.log("Импортируем продукты...");
    for (const product of burgers) {
      await setDoc(doc(db, "products", product.id.toString()), product);
      console.log(
        `✅ Продукт "${product.name}" импортирован с ID: ${product.id}`
      );
    }

    console.log("🎉 Импорт завершен успешно!");
    console.log(`📊 Импортировано продуктов: ${burgers.length}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка импорта:", error);
    process.exit(1);
  }
}

// Запускаем импорт
importData();
