import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-sm text-amber-200 mb-6">
            <i className="fas fa-flask"></i>
            Prototipo académico con datos de demostración
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Anticipamos riesgos, protegemos vidas.</h1>
          <p className="text-lg mb-8">
            FungiAlert explora cómo un producto de datos podría anticipar y comunicar riesgos fúngicos para hospitales y comunidades en Estados Unidos.
          </p>
          <Link to="/candida" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium cursor-pointer !rounded-button whitespace-nowrap">
            Explorar Enfermedades
          </Link>
        </div>
        <div className="md:w-1/2 relative">
          <div className="w-full h-[400px] relative overflow-hidden">
            <img 
              src="https://readdy.ai/api/search-image?query=A%20detailed%20map%20of%20the%20United%20States%20with%20glowing%20orange%20hotspots%20representing%20fungal%20outbreak%20locations%2C%20set%20against%20a%20deep%20blue%20background.%20The%20map%20has%20a%20modern%2C%20digital%20aesthetic%20with%20network%20lines%20connecting%20the%20hotspots%2C%20creating%20a%20visualization%20of%20disease%20spread%20monitoring%20system&width=600&height=400&seq=map1&orientation=landscape" 
              alt="Mapa de alertas fúngicas" 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12">Beneficios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Benefit Card 1 */}
          <div className="bg-gray-900 bg-opacity-50 p-8 rounded-xl border border-blue-800">
            <div className="text-blue-400 mb-4">
              <i className="fas fa-chart-line text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Arquitectura predictiva propuesta</h3>
            <p className="text-gray-300">
              El diseño plantea modelos temporales y geoespaciales; el prototipo actual no ejecuta predicciones en producción.
            </p>
          </div>

          {/* Benefit Card 2 */}
          <div className="bg-gray-900 bg-opacity-50 p-8 rounded-xl border border-blue-800">
            <div className="text-blue-400 mb-4">
              <i className="fas fa-map-marked-alt text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Visualización interactiva de mapas</h3>
            <p className="text-gray-300">
              Interfaz geoespacial que demuestra cómo podrían comunicarse zonas de riesgo y patrones de propagación.
            </p>
          </div>

          {/* Benefit Card 3 */}
          <div className="bg-gray-900 bg-opacity-50 p-8 rounded-xl border border-blue-800">
            <div className="text-blue-400 mb-4">
              <i className="fas fa-database text-3xl"></i>
            </div>
            <h3 className="text-xl font-semibold mb-3">Ecosistema de datos diseñado</h3>
            <p className="text-gray-300">
              La propuesta evalúa CDC, NASA, NOAA y otras instituciones como fuentes potenciales para una implementación futura.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Diseases Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-12">Infecciones Monitorizadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Disease Card 1 */}
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl overflow-hidden shadow-xl">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=Microscopic%20view%20of%20Candida%20auris%20fungal%20cells%2C%20showing%20the%20yeast-like%20structure%20with%20a%20blue%20scientific%20background.%20The%20image%20has%20a%20clinical%2C%20medical%20aesthetic%20with%20high%20detail%20of%20the%20cellular%20structure%20against%20a%20dark%20background%20with%20digital%20elements&width=600&height=300&seq=candida1&orientation=landscape" 
                alt="Candida auris" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3">Candida auris</h3>
              <p className="text-gray-300 mb-4">
                Hongo emergente multirresistente con alta tasa de mortalidad en pacientes hospitalizados. Monitorización constante de nuevos brotes.
              </p>
              <Link to="/candida" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium cursor-pointer !rounded-button whitespace-nowrap">
                Más información
              </Link>
            </div>
          </div>

          {/* Disease Card 2 */}
          <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl overflow-hidden shadow-xl">
            <div className="h-48 overflow-hidden">
              <img 
                src="https://readdy.ai/api/search-image?query=Microscopic%20visualization%20of%20Coccidioides%20fungal%20spores%20that%20cause%20Valley%20Fever%2C%20showing%20the%20spherical%20structures%20against%20a%20blue%20scientific%20background.%20The%20image%20has%20a%20medical%20research%20aesthetic%20with%20digital%20elements%20highlighting%20the%20fungal%20pathogen&width=600&height=300&seq=valley1&orientation=landscape" 
                alt="Fiebre del Valle" 
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-3">Fiebre del Valle</h3>
              <p className="text-gray-300 mb-4">
                Infección causada por el hongo Coccidioides, endémico en zonas áridas. Nuestro sistema predice áreas de riesgo según condiciones climáticas.
              </p>
              <Link to="/fiebre" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium cursor-pointer !rounded-button whitespace-nowrap">
                Más información
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-10 text-center">
          <h2 className="text-3xl font-bold mb-6">Del problema al diseño de un producto de datos</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Investigación, modelo de negocio, estrategia de datos, arquitectura de IA y un prototipo interactivo en una sola propuesta académica.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/candida" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 cursor-pointer !rounded-button whitespace-nowrap">
              Ver prototipo
            </Link>
            <a href="https://github.com/StevenVegaL/FungiAlert#readme" className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-800 cursor-pointer !rounded-button whitespace-nowrap">
              Conocer el proyecto
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
