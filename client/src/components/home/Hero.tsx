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
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop",
    title: "Decorațiuni Elegante pentru Evenimente Speciale",
    description: "Transformăm visele în realitate pentru nunțile și evenimentele tale memorabile",
  },
  {
    image: "https://images.unsplash.com/photo-1470204963738-e7c0c9bc0e1d?w=800&auto=format&fit=crop",
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
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-3xl">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-6">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-100">
                    {slide.description}
                  </p>
                  <div className="space-x-4">
                    <Link href="/products">
                      <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Vezi Produsele
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="bg-white/10 text-white hover:bg-white/20">
                        Contactează-ne
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}
