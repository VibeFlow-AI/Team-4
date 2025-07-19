import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Benefit {
  image: string;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    title: "Personalized Learning",
    description: "We tailor the mentorship experience to fit each student's unique goals, learning style, and pace making every session impactful.",
  },
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    title: "Real Mentors, Real Guidance",
    description: "Get direct access to mentors who've walked the path before you.",
  },
  {
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80",
    title: "Growth & Career Readiness",
    description: "Whether you're exploring new directions or preparing for your next big step, our sessions are designed to equip you with the skills.",
  },
  {
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
    title: "Insights-Driven Support",
    description: "We don't rely on guesswork. Our mentors use data, progress tracking, and evidence-based approaches to deliver meaningful guidance.",
  },
];

const SLIDE_INTERVAL = 2500; // ms
const CARD_WIDTH = 340; // px
const GAP = 32; // px (gap-8)
const VISIBLE_CARDS = 4;

function BenefitsCarousel() {
  const [active, setActive] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [x, setX] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Prepare a ring of cards for infinite loop
  const getRing = () => {
    const ring = [];
    for (let i = 0; i < BENEFITS.length * 3; i++) {
      ring.push(BENEFITS[i % BENEFITS.length]);
    }
    return ring;
  };
  const ring = getRing();
  const start = BENEFITS.length; // always start in the middle ring

  useEffect(() => {
    if (isAnimating) return;
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
      setX((prev) => prev - (CARD_WIDTH + GAP));
      setTimeout(() => {
        setActive((prev) => (prev + 1) % BENEFITS.length);
        setX(-((CARD_WIDTH + GAP) * (start + active + 1 - VISIBLE_CARDS / 2)));
        setIsAnimating(false);
      }, 600); // match animation duration
    }, SLIDE_INTERVAL);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [active, isAnimating]);

  // Calculate the initial offset to center the active card
  useEffect(() => {
    setX(-((CARD_WIDTH + GAP) * (start + active - VISIBLE_CARDS / 2)));
    // eslint-disable-next-line
  }, []);

  return (
    <section className="w-full py-16 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-black">
          What's in it for Students?
        </h2>
        <p className="text-lg sm:text-xl text-center text-black/80 max-w-3xl mx-auto mb-12">
          EduVibe is a student-mentor platform designed to personalize learning journeys. It connects students with mentors who offer guidance, support, and practical industry insights.
        </p>
        <div className="relative flex justify-center items-center w-full">
          <div className="w-full max-w-5xl overflow-x-hidden">
            <motion.div
              className="flex gap-8 py-4"
              style={{ width: (CARD_WIDTH + GAP) * ring.length }}
              animate={{ x }}
              transition={isAnimating ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0 }}
            >
              {ring.map((benefit, idx) => {
                // Determine if this is the active card
                const isActive = idx === start + active;
                return (
                  <div
                    key={benefit.title + idx}
                    className={`relative flex-shrink-0 bg-white rounded-3xl overflow-hidden flex flex-col h-full min-h-[420px] border border-gray-200 shadow-md transition-all duration-300 ${isActive ? 'scale-105 ring-2 ring-blue-300 z-10' : 'scale-90 opacity-70 z-0'}`}
                    style={{ width: CARD_WIDTH }}
                  >
                    <div className="relative w-full h-64 sm:h-72 md:h-60 lg:h-64 xl:h-72 flex-shrink-0">
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-white via-white/80 to-transparent" />
                    </div>
                    <div className="flex-1 flex flex-col justify-end p-6 pt-4">
                      <div className="font-bold text-2xl md:text-xl lg:text-2xl text-black mb-2 leading-tight">
                        {benefit.title}
                      </div>
                      <div className="text-gray-800 text-base md:text-sm lg:text-base leading-snug">
                        {benefit.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BenefitsCarousel; 