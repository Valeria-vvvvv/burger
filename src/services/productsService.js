import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

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
  // Убеждаемся, что ID является строкой
  const productId = String(form.id);

  // Создаем копию формы без ID для обновления
  const { id, ...updateData } = form;

  await updateDoc(doc(db, "products", productId), updateData);
  return { ...updateData, id: productId };
}

/**
 * Удаляет продукт.
 * @param {string} productId - id продукта
 */
export async function deleteProductFromDB(productId) {
  // Убеждаемся, что ID является строкой
  const id = String(productId);
  await deleteDoc(doc(db, "products", id));
}
/**
 * Добавляет отзыв к продукту
 * @param {string} productId - ID продукта
 * @param {Object} review - данные отзыва
 * @returns {Promise<Object>} - обновленный продукт с отзывами
 */
export async function addReviewToProduct(productId, review) {
  try {
    // Получаем текущий продукт
    const productRef = doc(db, "products", productId);
    const productDoc = await getDoc(productRef);
    const product = productDoc.data();

    // Получаем текущие отзывы или создаем пустой массив
    const currentReviews = product.reviews || [];

    const newReview = {
      id: `rev-${productId}-${Date.now()}`,
      userName: review?.userName || "Гость",
      productName: review?.productName || product?.name || "Продукт",
      message: review?.message || "",
      rating: review?.rating?.toString() || "5",
      date: review?.date || new Date().toISOString(),
    };

    // Добавляем новый отзыв к существующим
    const updatedReviews = [...currentReviews, newReview];

    // Обновляем продукт с новым массивом отзывов
    await updateDoc(productRef, {
      reviews: updatedReviews,
    });

    return { ...product, reviews: updatedReviews, id: productId };
  } catch (error) {
    console.error("Error adding review to product:", error);
    throw error;
  }
}
