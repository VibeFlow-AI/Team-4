
import HomeLayout from "@/layouts/HomeLayout";
import Hero from "@/components/home/hero";
import BenefitsCarousel from "@/components/home/benefits-carousel";
import SessionHighlights from "@/components/home/session-highlights";

function HomePage() {
  return (
    <HomeLayout>
      <main className="flex-1">
        <Hero />
        <BenefitsCarousel />
        <SessionHighlights />
      </main>
    </HomeLayout>
  );
}

export default HomePage;
