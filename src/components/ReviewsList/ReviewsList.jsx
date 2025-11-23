import "./ReviewsList.css";

export const ReviewsList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="reviews-empty">
        <p>Пока нет отзывов. Будьте первым!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return "⭐".repeat(parseInt(rating));
  };

  return (
    <div className="reviews-list">
      <h3 className="reviews-title">Отзывы ({reviews.length})</h3>
      <div className="reviews-items">
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <div className="review-header">
              <div className="review-user">{review.userName}</div>
              <div className="review-rating">{renderStars(review.rating)}</div>
            </div>
            <p className="review-message">{review.message}</p>
            <div className="review-date">{formatDate(review.date)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
