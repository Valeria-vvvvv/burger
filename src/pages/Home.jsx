import { Hero } from "../components/Hero/Hero.jsx";
import { WhyUs } from "../components/WhyUs/WhyUs.jsx";
import { ProductsPreview } from "../components/ProductsPreview/ProductsPreview.jsx";
import { ReviewsSlider } from "../components/ReviewsSlider/ReviewsSlider.jsx";
import { Order } from "../components/Order/Order.jsx";

export const HomePage = () => {
  return (
    <section id="home" className="home-page">
      <Hero />
      <WhyUs />
      <ProductsPreview />
      <ReviewsSlider />
      <Order />
    </section>
  );
};
