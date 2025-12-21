import "./Hero.css";
// Используем путь из public папки
const mainBurger = "/images/main_burger.png";

export const Hero = () => {
  const scrollToProducts = () => {
    const element = document.getElementById("products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="mein">
      <div className="container">
        <div className="main-content">
          <div className="mein-info">
            <span className="mein-small-info">Новое меню</span>
            <h1 className="mein-title">Бургер чеддер</h1>
            <p className="mein-text">
              Мы обновили наше меню, спешите попробовать сезонные новинки и
              насладиться отличным вкусом наших бургеров. Готовим для вас лучшие
              бургеры в городе из отборной мраморной говядины.
            </p>
            <div className="mein-action">
              <button className="button" onClick={scrollToProducts}>
                Смотреть меню
              </button>
            </div>
          </div>
          <img src={mainBurger} alt="Big Burger" className="main-image" />
        </div>
      </div>
    </section>
  );
};
