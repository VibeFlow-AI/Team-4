import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";

function Hero() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Empowering Students with Personalized Mentorship
              <BookOpen className="inline-block ml-4 w-12 h-12" />
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              EduVibe connects students with experienced mentors to guide them through their academic journey.
            </p>
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              Get Started
            </Button>
          </div>
          <div className="relative">
            <div className="grid grid-cols-3 gap-4">
              
            </div>
          </div>
        </div>
      </section>
    )
}

export default Hero;