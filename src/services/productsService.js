import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";

const PRODUCTS_COLLECTION = "products";

/**
 * Получает все продукты из Firestore
 * @returns {Promise<Array>} - массив продуктов
 */
export const fetchProducts = async () => {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const productsSnapshot = await getDocs(productsCollection);
    const productsList = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return productsList;
  } catch (error) {
    console.error("Ошибка при получении продуктов:", error);
    throw error;
  }
};

/**
 * Добавляет новый продукт в Firestore
 * @param {Object} productData - данные продукта
 * @returns {Promise<Object>} - добавленный продукт с id
 */
export const addProductToDB = async (productData) => {
  try {
    const productsCollection = collection(db, PRODUCTS_COLLECTION);
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date().toISOString(),
    });
    return {
      id: docRef.id,
      ...productData,
    };
  } catch (error) {
    console.error("Ошибка при добавлении продукта:", error);
    throw error;
  }
};

/**
 * Обновляет существующий продукт в Firestore
 * @param {Object} productData - данные продукта с id
 * @returns {Promise<Object>} - обновленный продукт
 */
export const updateProductInDB = async (productData) => {
  try {
    const { id, ...dataToUpdate } = productData;
    const productDoc = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(productDoc, {
      ...dataToUpdate,
      updatedAt: new Date().toISOString(),
    });
    return productData;
  } catch (error) {
    console.error("Ошибка при обновлении продукта:", error);
    throw error;
  }
};

/**
 * Удаляет продукт из Firestore
 * @param {string} productId - id продукта
 * @returns {Promise<void>}
 */
export const deleteProductFromDB = async (productId) => {
  try {
    const productDoc = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(productDoc);
  } catch (error) {
    console.error("Ошибка при удалении продукта:", error);
    throw error;
  }
};
