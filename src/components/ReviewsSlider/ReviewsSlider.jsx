import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./ReviewsSlider.css";

const reviewsData = [
  {
    id: 1,
    name: "Александр Петров",
    rating: 5,
    date: "15 января 2025",
    text: "Лучшие бургеры в городе! Особенно понравился Дабл биф бургер. Сочная котлета, свежие овощи, идеальный соус.",
    avatar: "АП",
  },
  {
    id: 2,
    name: "Мария Иванова",
    rating: 5,
    date: "12 января 2025",
    text: "Заказывала BBQ с беконом и курицей. Очень вкусно! Доставка быстрая, бургер приехал горячим.",
    avatar: "МИ",
  },
  {
    id: 3,
    name: "Дмитрий Сидоров",
    rating: 4,
    date: "10 января 2025",
    text: "Хорошее качество, большие порции. Единственное - хотелось бы больше вариантов соусов.",
    avatar: "ДС",
  },
  {
    id: 4,
    name: "Елена Смирнова",
    rating: 5,
    date: "8 января 2025",
    text: "Вегги бургер просто огонь! Не ожидала, что вегетарианский бургер может быть таким вкусным.",
    avatar: "ЕС",
  },
  {
    id: 5,
    name: "Игорь Козлов",
    rating: 5,
    date: "6 января 2025",
    text: "Заказал Двойной чиз бургер - просто бомба! Много сыра, сочные котлеты, все очень вкусно.",
    avatar: "ИК",
  },
  {
    id: 6,
    name: "Анна Волкова",
    rating: 4,
    date: "4 января 2025",
    text: "Попробовала Индиана бургер - очень необычно и вкусно! Особенно понравился криспи лук.",
    avatar: "АВ",
  },
];

export const ReviewsSlider = () => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

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
          {reviewsData.map((review) => (
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
