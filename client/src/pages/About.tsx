import { SITE_CONFIG } from "@/lib/constants";

const MILESTONES = [
  {
    year: "2020",
    title: "Începutul Călătoriei",
    description:
      "Am pornit cu pasiunea de a transforma evenimentele în momente magice.",
  },
  {
    year: "2021",
    title: "Extinderea Serviciilor",
    description:
      "Am adăugat servicii noi și am crescut echipa pentru a satisface cererea tot mai mare.",
  },
  {
    year: "2022",
    title: "Premii și Recunoaștere",
    description:
      "Am fost recunoscuți pentru excelență în domeniul decorațiunilor pentru evenimente.",
  },
];

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-serif mb-6">Despre Noi</h1>
        <p className="text-lg text-gray-600">
          {SITE_CONFIG.description}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-serif mb-4">Misiunea Noastră</h2>
          <p className="text-gray-600 mb-4">
            Ne dedicăm să transformăm fiecare eveniment într-o experiență unică și memorabilă.
            Prin atenția la detalii și pasiunea pentru frumos, aducem magie în cele mai
            importante momente din viața clienților noștri.
          </p>
        </div>
        <div className="aspect-video rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
            alt="Echipa noastră la lucru"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-2xl font-serif text-center mb-8">Parcursul Nostru</h2>
        <div className="space-y-12">
          {MILESTONES.map((milestone, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row gap-4 items-start"
            >
              <div className="flex-shrink-0 w-24">
                <div className="text-xl font-bold text-primary">
                  {milestone.year}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">{milestone.title}</h3>
                <p className="text-gray-600">{milestone.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-serif mb-4">Valorile Noastre</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-8">
          <div>
            <h3 className="text-lg font-medium mb-2">Calitate</h3>
            <p className="text-gray-600">
              Folosim materiale premium și acordăm atenție fiecărui detaliu.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Creativitate</h3>
            <p className="text-gray-600">
              Aducem idei inovatoare pentru a face fiecare eveniment unic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Profesionalism</h3>
            <p className="text-gray-600">
              Oferim servicii impecabile și comunicare transparentă.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
