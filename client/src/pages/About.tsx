import { SITE_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Despre Noi"
        description={SITE_CONFIG.description}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid md:grid-cols-2 gap-12 items-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <h2 className="text-2xl font-display mb-4">Misiunea Noastră</h2>
            <p className="text-gray-600 mb-4">
              Ne dedicăm să transformăm fiecare eveniment într-o experiență unică și memorabilă.
              Prin atenția la detalii și pasiunea pentru frumos, aducem magie în cele mai
              importante momente din viața clienților noștri.
            </p>
          </div>
          <motion.div
            className="aspect-video rounded-lg overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
              alt="Echipa noastră la lucru"
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
            />
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-display text-center mb-8">Parcursul Nostru</h2>
          <div className="space-y-12">
            {MILESTONES.map((milestone, index) => (
              <motion.div
                key={index}
                className="flex flex-col md:flex-row gap-4 items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex-shrink-0 w-24">
                  <div className="text-xl font-bold text-primary">
                    {milestone.year}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-2xl font-display mb-4">Valorile Noastre</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-8">
            {[
              {
                title: "Calitate",
                description: "Folosim materiale premium și acordăm atenție fiecărui detaliu."
              },
              {
                title: "Creativitate",
                description: "Aducem idei inovatoare pentru a face fiecare eveniment unic."
              },
              {
                title: "Profesionalism",
                description: "Oferim servicii impecabile și comunicare transparentă."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="p-6 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors duration-300"
              >
                <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}