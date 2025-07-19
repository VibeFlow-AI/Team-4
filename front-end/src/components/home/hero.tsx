import { useState } from "react";
import { BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import SignUpModal from "../ui/sign-up-modal";

function Hero() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGetStarted = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-4 sm:mb-6">
                            Empowering Students with Personalized Mentorship
                            <BookOpen className="inline-block ml-2 sm:ml-4 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0">
                            EduVibe connects students with experienced mentors to guide them through their academic journey.
                        </p>
                        <Button 
                            size="lg" 
                            className="bg-black text-white hover:bg-gray-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                            onClick={handleGetStarted}
                        >
                            Get Started
                        </Button>
                    </div>
                    <div className="relative hidden lg:block">
                        <div className="grid grid-cols-3 gap-4">
                            
                        </div>
                    </div>
                </div>
            </section>
            
            <SignUpModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    )
}

export default Hero;