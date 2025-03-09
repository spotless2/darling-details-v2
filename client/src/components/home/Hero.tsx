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
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&auto=format&fit=crop&q=80",
    title: "Decorațiuni Elegante pentru Evenimente Speciale",
    description: "Transformăm visele în realitate pentru nunțile și evenimentele tale memorabile",
  },
  {
    image: "https://images.unsplash.com/photo-1470204963738-e7c0c9bc0e1d?w=1600&auto=format&fit=crop&q=80",
    title: "Cabină Foto și Mărturii Unice",
    description: "Creează amintiri de neuitat cu serviciile noastre personalizate",
  },
];

export function Hero() {
  return (
    <section className="relative h-[600px] md:h-[700px]">
      <Carousel className="w-full h-full">
        <CarouselContent>
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="relative w-full h-full">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-black/50" />
              </div>
              <div className="relative h-full flex items-center">
                <div className="mx-auto px-4 max-w-4xl text-center">
                  <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-8 text-white leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-12 text-gray-100 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <div className="space-x-6">
                    <Link href="/products">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                        Vezi Produsele
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20 text-lg px-8 py-6">
                        Contactează-ne
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-8" />
        <CarouselNext className="hidden md:flex right-8" />
      </Carousel>
    </section>
  );
}