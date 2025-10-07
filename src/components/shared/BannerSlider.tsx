import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import ButtonFilled from '@/components/shared/button/ButtonFilled';

interface BannerSlide {
    id: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    buttonText: string;
    buttonLink: string;
    backgroundColor?: string;
}

interface BannerSliderProps {
    slides: BannerSlide[];
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

/**
 * BannerSlider: Component slider banner responsive cho homepage
 * Hỗ trợ auto-play, navigation buttons, dots indicator và responsive design
 */
export default function BannerSlider({
    slides,
    autoPlay = true,
    autoPlayInterval = 5000
}: BannerSliderProps) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || slides.length <= 1) return;

        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
                setIsTransitioning(false);
            }, 300);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, slides.length]);

    const goToSlide = (index: number) => {
        if (index === currentSlide) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide(index);
            setIsTransitioning(false);
        }, 300);
    };

    const goToPrevious = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
            setIsTransitioning(false);
        }, 300);
    };

    const goToNext = () => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
            setIsTransitioning(false);
        }, 300);
    };

    if (!slides || slides.length === 0) {
        return (
            <div className="w-full h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">☕</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Đang tải banner...
                    </h3>
                </div>
            </div>
        );
    }

    const currentSlideData = slides[currentSlide];

    return (
        <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-2xl group">
            {/* Background Image */}
            <div
                className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${isTransitioning ? 'scale-110 blur-sm' : 'scale-100 blur-0'}`}
                style={{
                    backgroundImage: `url(${currentSlideData.image})`,
                    backgroundColor: currentSlideData.backgroundColor || '#006241'
                }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className={`relative z-10 h-full flex items-center px-6 sm:px-8 lg:px-12 transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0'}`}>
                <div className="max-w-2xl">
                    <div className="text-primary-100 text-sm sm:text-base font-medium mb-2">
                        {currentSlideData.subtitle}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight">
                        {currentSlideData.title}
                    </h1>
                    <p className="text-gray-200 text-sm sm:text-base lg:text-lg mb-6 max-w-xl">
                        {currentSlideData.description}
                    </p>
                    <ButtonFilled
                        className="bg-white text-primary hover:bg-gray-100 px-6 py-3 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        onClick={() => window.open(currentSlideData.buttonLink, '_blank')}
                    >
                        {currentSlideData.buttonText}
                    </ButtonFilled>
                </div>
            </div>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                        aria-label="Previous slide"
                    >
                        <ChevronLeftIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 sm:p-3 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                        aria-label="Next slide"
                    >
                        <ChevronRightIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </button>
                </>
            )}

            {/* Dots Indicator */}
            {slides.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress Bar */}
            {autoPlay && slides.length > 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{
                            width: `${((Date.now() % autoPlayInterval) / autoPlayInterval) * 100}%`
                        }}
                    />
                </div>
            )}
        </div>
    );
}