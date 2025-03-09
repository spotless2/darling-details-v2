import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const HERO_SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&h=900&fit=crop&q=80",
    title: "Decorațiuni pentru Nunți",
    subtitle: "Elegante și Rafinate",
    description: "Transformăm locația nunții tale într-un spațiu de poveste cu decorațiuni atent selecționate",
  },
  {
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1600&h=900&fit=crop&q=80",
    title: "Mărturii Personalizate",
    subtitle: "Amintiri de Neuitat",
    description: "Oferă invitaților tăi mărturii unice care vor păstra vie amintirea acestei zile speciale",
  },
  {
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=1600&h=900&fit=crop&q=80",
    title: "Cabină Foto Premium",
    subtitle: "Momente Vesele Imortalizate",
    description: "Surprinde bucuria și voia bună cu cabina noastră foto profesională",
  },
  {
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&h=900&fit=crop&q=80",
    title: "Aranjamente Florale",
    subtitle: "Prospețime și Culoare",
    description: "Creăm aranjamente florale care adaugă eleganță și rafinament evenimentului tău",
  },
  {
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&h=900&fit=crop&q=80",
    title: "Lumini și Efecte",
    subtitle: "Atmosferă Magică",
    description: "Iluminat ambiental și efecte speciale pentru o atmosferă de neuitat",
  },
];

export function Hero() {
  return (
    <section className="mt-20 relative h-[calc(100vh-5rem)] min-h-[600px] max-h-[800px]">
      <Carousel className="w-full h-full" opts={{ loop: true }}>
        <CarouselContent>
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-full">
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transform scale-105 animate-ken-burns"
                  style={{ backgroundImage: `url(${slide.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />
              </div>
              <div className="relative h-full flex items-center">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl w-full">
                  <div className="text-center space-y-6 pb-24">
                    <h2 className="text-white text-lg md:text-xl font-light tracking-wide uppercase">
                      {slide.subtitle}
                    </h2>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl text-white leading-tight font-display">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-light">
                      {slide.description}
                    </p>
                    <div className="pt-8">
                      <Link href="/products">
                        <Button 
                          size="lg" 
                          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 mr-6"
                        >
                          Vezi Produsele
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="border-2 bg-transparent text-white hover:bg-white/10 text-lg px-8 py-6"
                        >
                          Contactează-ne
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-12 text-white border-white/30 bg-black/20 hover:bg-black/40" />
        <CarouselNext className="hidden md:flex right-12 text-white border-white/30 bg-black/20 hover:bg-black/40" />
      </Carousel>
    </section>
  );
}