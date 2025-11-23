import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase";

const PRODUCTS_COLLECTION = "products";

/**
 * Добавляет отзыв к продукту
 * @param {string} productId - ID продукта
 * @param {Object} reviewData - данные отзыва {userName, message, rating}
 * @returns {Promise<Object>} - добавленный отзыв
 */
export const addReviewToProduct = async (productId, reviewData) => {
  try {
    const review = {
      id: Date.now().toString(),
      userName: reviewData.userName,
      message: reviewData.message,
      rating: reviewData.rating,
      date: new Date().toISOString(),
    };

    const productDoc = doc(db, PRODUCTS_COLLECTION, productId.toString());
    await updateDoc(productDoc, {
      reviews: arrayUnion(review),
    });

    return review;
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error);
    throw error;
  }
};
