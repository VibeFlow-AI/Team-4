import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Benefit {
  image: string;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
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
  {
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
    title: "Personalized Learning",
    description: "We tailor the mentorship experience to fit each student's unique goals, learning style, and pace making every session impactful.",
  },
];

const STEP_INTERVAL = 2000; // ms
const CARD_WIDTH = 320; // px
const FEATURED_WIDTH = 640; // px (twice as wide)
const GAP = 32; // px (gap-8)

function BenefitsCarousel() {
  const [cards, setCards] = useState(BENEFITS);
  const [isAnimating, setIsAnimating] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAnimating) return;
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(true);
      setLeaving(true);
      setTimeout(() => {
        setCards((prev) => {
          const next = [...prev];
          const first = next.shift();
          if (first) next.push(first);
          return next;
        });
        setLeaving(false);
        setIsAnimating(false);
      }, 700); // match animation duration
    }, STEP_INTERVAL);
    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [cards, isAnimating]);

  return (
    <section className="w-full bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 py-16 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-4 text-black">
          What's in it for Students?
        </h2>
        <p className="text-lg sm:text-xl text-center text-black/80 max-w-3xl mx-auto mb-12">
          EduVibe is a student-mentor platform designed to personalize learning journeys. It connects students with mentors who offer guidance, support, and practical industry insights.
        </p>
        <div className="overflow-hidden">
          <div className="flex gap-8 justify-center items-stretch">
            <AnimatePresence initial={false}>
              {cards.map((benefit, idx) => {
                // Only show 4 cards at a time
                if (idx > 3) return null;
                // Leftmost card: fade out and slide left when leaving
                if (idx === 0 && leaving) {
                  return (
                    <motion.div
                      key={benefit.title + idx}
                      initial={{ opacity: 1, x: 0, width: FEATURED_WIDTH }}
                      animate={{ opacity: 0, x: -40, width: FEATURED_WIDTH }}
                      exit={{}}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0"
                      style={{ width: FEATURED_WIDTH }}
                    >
                      <BenefitCard benefit={benefit} featured />
                    </motion.div>
                  );
                }
                // Second card: stretch to featured width
                if (idx === 1 && leaving) {
                  return (
                    <motion.div
                      key={benefit.title + idx}
                      initial={{ width: CARD_WIDTH, x: 0 }}
                      animate={{ width: FEATURED_WIDTH, x: 0 }}
                      exit={{}}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0"
                      style={{ width: CARD_WIDTH }}
                    >
                      <BenefitCard benefit={benefit} featured />
                    </motion.div>
                  );
                }
                // Other cards: slide left
                if (idx > 1 && leaving) {
                  return (
                    <motion.div
                      key={benefit.title + idx}
                      initial={{ x: 0, width: CARD_WIDTH }}
                      animate={{ x: - (FEATURED_WIDTH - CARD_WIDTH), width: CARD_WIDTH }}
                      exit={{}}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="flex-shrink-0"
                      style={{ width: CARD_WIDTH }}
                    >
                      <BenefitCard benefit={benefit} />
                    </motion.div>
                  );
                }
                // Normal state
                return (
                  <motion.div
                    key={benefit.title + idx}
                    initial={false}
                    animate={{ width: idx === 0 ? FEATURED_WIDTH : CARD_WIDTH, opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-shrink-0"
                    style={{ width: idx === 0 ? FEATURED_WIDTH : CARD_WIDTH }}
                  >
                    <BenefitCard benefit={benefit} featured={idx === 0} />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ benefit, featured }: { benefit: Benefit; featured?: boolean }) {
  return (
    <div
      className={`bg-white rounded-3xl shadow-md overflow-hidden flex flex-col h-full min-h-[420px] ${featured ? 'border-2 border-blue-300' : ''}`}
      style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07)' }}
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
}

export default BenefitsCarousel; 