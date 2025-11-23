import "./WhyUs.css";
import burgerImg from "../../assets/img/burger.png";
import imgImg from "../../assets/img/img.png";
import foodImg from "../../assets/img/food.png";

export const WhyUs = () => {
  const imageMap = {
    "burger.png": burgerImg,
    "img.png": imgImg,
    "food.png": foodImg,
  };

  const features = [
    {
      image: "burger.png",
      title: "Авторские рецепты",
      text: "Наши бургеры обладают уникальным сочетанием вкусов и не похожи ни на какие другие. Мы тщательно отбираем лучшие ингредиенты и сочетания вкусов для нашего меню.",
    },
    {
      image: "img.png",
      title: "Мраморная говядина",
      text: "Для наших бургеров мы используем отборную 100% мраморную говядину, которую закупаем исключительно у фермеров. Мы уверены в качестве нашего мяса.",
    },
    {
      image: "food.png",
      title: "Быстрая доставка",
      text: "Мы доставляем в пределах МКАД за 30 минут, а если не успеем — доставка бесплатно. Мы тщательно упаковываем наши бургеры, чтобы по дороге они не остыли.",
    },
  ];

  return (
    <section className="why" id="why">
      <div className="container">
        <div className="why-title common-title">почему нас выбирают?</div>
        <div className="why-items">
          {features.map((feature, index) => (
            <div key={index} className="why-item">
              <img
                src={imageMap[feature.image]}
                alt={feature.title}
                className="why-item-image"
              />
              <div className="why-item-title">{feature.title}</div>
              <div className="why-item-text">{feature.text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
