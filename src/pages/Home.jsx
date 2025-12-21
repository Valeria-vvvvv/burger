import { Hero } from "../components/ui/Hero.jsx";
import { WhyUs } from "../components/ui/WhyUs.jsx";
import { ProductsPreview } from "../components/ui/ProductsPreview.jsx";
import { ReviewsSlider } from "../components/ui/ReviewsSlider.jsx";
import { Location } from "../components/ui/Location.jsx";
export const Home = () => {
  return (
    <section id="home" className="home-page">
      <Hero />
      <WhyUs />
      <ProductsPreview />
      <ReviewsSlider />
      <Location />
    </section>
  );
};
