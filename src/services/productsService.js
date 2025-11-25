import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { doc } from "firebase/firestore";

// Получает все продукты из Firebase
export async function fetchProducts() {
  // 1. Создаем ссылку на коллекцию "products"
  const productsCollection = collection(db, "products");
  // 2. Получаем все документы из коллекции
  const querySnapshot = await getDocs(productsCollection);
  // 3. Преобразуем результат в массив объектов
  return querySnapshot.docs.map((doc) => ({
    id: doc.id, // ID документа
    ...doc.data(), // Все данные документа
  }));
}

/**
 * Добавляет продукт.
 * @param {Object} form - Данные продукта
 */
export async function addProductToDB(form) {
  const docRef = await addDoc(collection(db, "products"), form);
  return { ...form, id: docRef.id };
}

/**
 * Обновляет продукт.
 * @param {Object} form - Данные продукта
 */
export async function updateProductInDB(form) {
  await updateDoc(doc(db, "products", form.id), form);
  return { ...form, id: form.id };
}

/**
 * Удаляет продукт.
 * @param {string} productId - id продукта
 */
export async function deleteProductFromDB(productId) {
  await deleteDoc(doc(db, "products", productId));
}
