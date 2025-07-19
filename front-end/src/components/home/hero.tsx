import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import SignUpModal from "../ui/sign-up-modal";

const MENTOR_IMAGES = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/men/33.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/34.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
  "https://randomuser.me/api/portraits/men/45.jpg",
  "https://randomuser.me/api/portraits/men/41.jpg",
  "https://randomuser.me/api/portraits/men/51.jpg",
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/23.jpg",
  "https://randomuser.me/api/portraits/women/47.jpg",
  "https://randomuser.me/api/portraits/men/36.jpg",
];

function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetStarted = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Split images into two columns
  const col1 = MENTOR_IMAGES.filter((_, i) => i % 2 === 0);
  const col2 = MENTOR_IMAGES.filter((_, i) => i % 2 === 1);

  return (
    <>
      <section className="w-full py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-16">
          {/* Left: Heading, subtitle, button */}
          <div className="flex-1 w-full max-w-2xl flex flex-col items-start">
            <h1 className="text-[2.8rem] sm:text-6xl md:text-7xl lg:text-8xl font-normal text-black leading-[1.05] mb-8 tracking-tight text-left">
              Empowering Students with<br />
              Personalized Mentorship <BookOpen className="inline-block align-middle w-12 h-12 ml-2" />
            </h1>
            <p className="text-lg md:text-xl text-black/80 mb-8 max-w-md text-left">
              EduVibe connects students with experienced mentors to guide them through their academic journey.
            </p>
            <Button
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-3 text-lg font-semibold rounded-md shadow text-left"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Right: Manually scrollable vertical grid of images, both columns scroll together */}
          <div className="flex-1 flex justify-center w-full">
            <div className="relative h-[540px] md:h-[700px] flex gap-x-8 overflow-y-auto scrollbar-hide">
              {/* Column 1 */}
              <div className="w-44">
                <div className="flex flex-col gap-8">
                  {col1.map((img, i) => (
                    <img
                      key={img + i}
                      src={img}
                      alt="mentor"
                      className="rounded-[2rem] w-40 h-64 object-cover shadow-md mb-2"
                    />
                  ))}
                </div>
              </div>
              {/* Column 2 */}
              <div className="w-44 mt-16">
                <div className="flex flex-col gap-8">
                  {col2.map((img, i) => (
                    <img
                      key={img + i}
                      src={img}
                      alt="mentor"
                      className="rounded-[2rem] w-40 h-64 object-cover shadow-md mb-2"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}

export default Hero;