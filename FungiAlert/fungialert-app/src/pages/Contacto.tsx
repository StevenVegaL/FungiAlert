// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState } from 'react';

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    department: 'general'
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      department: 'general'
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0">
            <img
              src="https://readdy.ai/api/search-image?query=A%2520modern%2520office%2520interior%2520with%2520blue%2520and%2520purple%2520gradient%2520lighting%252C%2520minimalist%2520design%2520with%2520glass%2520walls%2520and%2520workstations%252C%2520professional%2520corporate%2520environment%2520with%2520subtle%2520medical%2520and%2520technology%2520elements%252C%2520clean%2520and%2520sophisticated%2520atmosphere&width=1400&height=400&seq=4&orientation=landscape"
              alt="Contact Hero Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e1a] to-transparent"></div>
          </div>
          <div className="relative py-20 px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl">Estamos aquí para ayudarte</h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-8">
              Contacta con nuestro equipo de expertos para resolver tus dudas sobre patógenos emergentes y recibir asistencia especializada.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-phone-alt mr-2"></i>
                Llamar ahora
              </button>
              <button className="bg-transparent hover:bg-white/10 text-white border border-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium backdrop-blur-sm cursor-pointer !rounded-button whitespace-nowrap">
                <i className="fas fa-calendar-alt mr-2"></i>
                Agendar reunión
              </button>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-8 border border-gray-800 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Envíanos un mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="Tu nombre"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Departamento</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="general">Consulta general</option>
                  <option value="technical">Soporte técnico</option>
                  <option value="research">Investigación</option>
                  <option value="press">Prensa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Asunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Asunto de tu mensaje"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full bg-[#0a0e1a] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Escribe tu mensaje aquí..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 cursor-pointer !rounded-button whitespace-nowrap"
              >
                <i className="fas fa-paper-plane mr-2"></i>
                Enviar mensaje
              </button>
            </form>
            {showSuccess && (
              <div className="mt-4 bg-green-500 bg-opacity-20 text-green-400 p-4 rounded-lg flex items-center">
                <i className="fas fa-check-circle mr-2"></i>
                Mensaje enviado correctamente
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-8 border border-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Información de contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-500 bg-opacity-20 p-3 rounded-lg">
                    <i className="fas fa-phone-alt text-purple-400"></i>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Teléfono</h3>
                    <p className="text-gray-400">+1 (312) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-green-500 bg-opacity-20 p-3 rounded-lg">
                    <i className="fas fa-envelope text-green-400"></i>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-400">contact@fungialert.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-500 bg-opacity-20 p-3 rounded-lg">
                    <i className="fas fa-clock text-yellow-400"></i>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Horario de atención</h3>
                    <p className="text-gray-400">Lunes - Viernes: 9:00 AM - 6:00 PM<br/>Sábado: 9:00 AM - 2:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-8 border border-gray-800 shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Síguenos</h2>
              <div className="grid grid-cols-2 gap-4">
                <a href="#" className="flex items-center space-x-3 bg-[#0a0e1a] p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <i className="fab fa-twitter text-blue-400 text-xl"></i>
                  <span>Twitter</span>
                </a>
                <a href="#" className="flex items-center space-x-3 bg-[#0a0e1a] p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <i className="fab fa-linkedin text-blue-600 text-xl"></i>
                  <span>LinkedIn</span>
                </a>
                <a href="#" className="flex items-center space-x-3 bg-[#0a0e1a] p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <i className="fab fa-facebook text-blue-500 text-xl"></i>
                  <span>Facebook</span>
                </a>
                <a href="#" className="flex items-center space-x-3 bg-[#0a0e1a] p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                  <i className="fab fa-instagram text-pink-500 text-xl"></i>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-8">Preguntas frecuentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-6 border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">¿Cómo puedo reportar un caso sospechoso?</h3>
              <p className="text-gray-400">
                Puedes reportar casos sospechosos a través de nuestro sistema de alertas en línea o contactando directamente con nuestro equipo de respuesta rápida.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-6 border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">¿Ofrecen consultas para instituciones?</h3>
              <p className="text-gray-400">
                Sí, proporcionamos servicios de consultoría especializados para hospitales, clínicas y otras instituciones de salud.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-6 border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">¿Cuál es el tiempo de respuesta típico?</h3>
              <p className="text-gray-400">
                Nuestro equipo responde a todas las consultas dentro de 24 horas hábiles. Para casos urgentes, contamos con una línea de atención prioritaria.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#111527] to-[#1a1f3d] rounded-xl p-6 border border-gray-800 shadow-lg">
              <h3 className="text-lg font-semibold mb-3">¿Tienen recursos educativos disponibles?</h3>
              <p className="text-gray-400">
                Ofrecemos una amplia biblioteca de recursos educativos, webinars y materiales de capacitación para profesionales de la salud.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0e1a] border-t border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FungiAlert</h3>
              <p className="text-gray-400 text-sm">
                Sistema de alerta temprana para detección y monitoreo de infecciones fúngicas emergentes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces rápidos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Inicio</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Mapa de casos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Recursos médicos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Patógenos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Candida auris</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Aspergillus fumigatus</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Cryptococcus gattii</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors cursor-pointer">Coccidioides immitis</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suscríbete</h3>
              <p className="text-gray-400 text-sm mb-4">Recibe alertas y actualizaciones importantes.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu correo electrónico"
                  className="bg-gray-800 border-none text-sm rounded-l-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-r-lg transition-colors cursor-pointer !rounded-button whitespace-nowrap">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 FungiAlert. Todos los derechos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
