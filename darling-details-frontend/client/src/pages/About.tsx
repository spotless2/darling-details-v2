import { SITE_CONFIG } from "@/lib/constants";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";

export default function About() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <PageHeader
        title="Despre Noi"
        description="Transformăm evenimentele speciale prin detalii care încântă."
      />

      {/* Story section with gradient background */}
      <div className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 gap-12 items-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-md border border-primary/10">
              <h2 className="text-2xl font-display mb-4 text-primary">Povestea Noastră</h2>
              <p className="text-gray-700 mb-4">
                Darling Details a luat naștere în 2025 din pasiunea pentru frumos și atenția la detalii. 
                Am pornit cu viziunea de a aduce un suflu nou în lumea mărturiilor și decorațiunilor pentru evenimente.
              </p>
              <p className="text-gray-700">
                Deși suntem la început de drum, punem suflet în fiecare creație și ne dedicăm să transformăm 
                evenimentele importante din viața dumneavoastră în amintiri de neuitat, prin detalii atent alese și personalizate.
              </p>
            </div>
            <motion.div
              className="aspect-video rounded-lg overflow-hidden shadow-lg border-4 border-white"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&auto=format&fit=crop"
                alt="Mărturii și decorațiuni pentru evenimente"
                className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mission section with pattern background */}
      <div className="bg-white py-16 relative">
        <div className="absolute inset-0 bg-primary/5 opacity-50" 
          style={{
            backgroundImage: "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
            backgroundSize: "20px 20px"
          }}>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
              <h2 className="text-2xl font-display text-center mb-6 text-primary">Misiunea Noastră</h2>
              <div className="text-center">
                <p className="text-gray-700">
                  Ne-am propus să oferim mărturii și decorațiuni care reflectă personalitatea și stilul fiecărui client.
                  Credem că sunt detaliile care fac diferența și transformă un eveniment obișnuit într-unul memorabil.
                  Fiecare eveniment are povestea sa unică, iar noi suntem aici să o evidențiem prin creațiile noastre.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values section with accent color */}
      <div className="bg-primary/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-2xl font-display mb-8 text-primary">Valorile Noastre</h2>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              {[
                {
                  title: "Creativitate",
                  description: "Aducem idei proaspete și originale pentru a crea mărturii și decorațiuni unice care reflectă personalitatea fiecărui client."
                },
                {
                  title: "Calitate",
                  description: "Selectăm cu grijă materialele și acordăm atenție fiecărui detaliu pentru a oferi produse care impresionează și rezistă în timp."
                },
                {
                  title: "Personalizare",
                  description: "Înțelegem că fiecare eveniment este unic, de aceea adaptăm fiecare creație pentru a se potrivi perfect cu viziunea clientului."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-lg bg-white shadow-md border-t-4 border-primary transition-all duration-300 hover:shadow-lg"
                >
                  <h3 className="text-lg font-medium mb-2 text-primary">{value.title}</h3>
                  <p className="text-gray-700">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
        
      {/* Vision section with gradient background */}
      <div className="bg-gradient-to-t from-primary/5 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white p-8 rounded-lg shadow-md border border-primary/20 max-w-3xl mx-auto">
              <h2 className="text-2xl font-display mb-6 text-primary">Viziunea de Viitor</h2>
              <p className="text-gray-700">
                Ne dorim să devenim parteneri de încredere pentru cele mai frumoase momente din viața clienților noștri.
                Deși suntem la început de drum, avem planuri ambițioase de a crește și de a aduce bucurie prin creațiile noastre
                în cât mai multe evenimente speciale.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}