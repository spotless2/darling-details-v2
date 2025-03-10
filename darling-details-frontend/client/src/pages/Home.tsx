import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { Testimonials } from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div>
      <Hero />
      <FeaturedCategories />
      <Testimonials />
    </div>
  );
}
