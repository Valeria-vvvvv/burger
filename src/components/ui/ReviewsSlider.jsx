import { useEffect, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { useProducts } from "../../store/useProducts";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ReviewsSlider.css";

export const ReviewsSlider = () => {
  const { products, getProducts } = useProducts();

  useEffect(() => {
    getProducts();
  }, []);

  // Получаем все отзывы из всех продуктов
  const allReviews = useMemo(() => {
    const reviews = products.flatMap((product) => {
      if (!product.reviews || product.reviews.length === 0) return [];
      return product.reviews.map((review) => ({
        id: review.id,
        name: review.userName,
        rating: Number(review.rating),
        date: new Date(review.date).toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        text: review.message,
        avatar: review.userName?.split(" ").map(n => n[0]).join("").toUpperCase() || "??",
      }));
    });
    
    // Сортируем по дате (новые сначала) и берем только первые 6
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [products]);
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  // Не показываем слайдер если нет отзывов
  if (allReviews.length === 0) {
    return null;
  }

  return (
    <section className="reviews-slider-section">
      <div className="container">
        <h2 className="section-title common-title">Отзывы наших клиентов</h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="reviews-swiper"
        >
          {allReviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="review-slide">
                <div className="review-header">
                  <div className="review-avatar">{review.avatar}</div>
                  <div className="review-info">
                    <h3 className="review-name">{review.name}</h3>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};
