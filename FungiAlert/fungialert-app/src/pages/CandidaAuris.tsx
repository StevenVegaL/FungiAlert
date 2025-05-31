// Only the text content is translated. Variable names and logic remain unchanged.
import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import "leaflet.heat";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState("prediction");
  const [datosPrediccion, setDatosPrediccion] = useState<any>({});
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string | null>(null);
  const [dataEstado, setDataEstado] = useState<any | null>(null);

  useEffect(() => {
    fetch('/datos_prediccion_candida_auris.json')
      .then(res => res.json())
      .then(json => setDatosPrediccion(json));
  }, []);

  useEffect(() => {
    if (activeTab !== 'prediction') return;

    if (!datosPrediccion || !Object.keys(datosPrediccion).length) return;

    const map = L.map('mapa-prediccion').setView([37.8, -96], 4);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://carto.com/">CartoDB</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    Object.entries(datosPrediccion).forEach(([estado, datos]: any) => {
      // ⚠️ Validación segura para evitar caída
      if (
      !datos ||
      typeof datos.lat !== 'number' ||
      typeof datos.lon !== 'number'
      ) {
      console.warn(`Saltando ${estado} por falta de coordenadas`, datos);
      return;
      }

      const marker = L.circleMarker([datos.lat, datos.lon], {
      radius: 10,
      fillColor:
        datos.riesgo === 'Alto'
        ? '#dc2626'
        : datos.riesgo === 'Medio'
        ? '#facc15'
        : '#22c55e',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
      })
      .addTo(map)
      .on('click', () => {
        setEstadoSeleccionado(estado);
        setDataEstado(datos);
      })
      .bindTooltip(`${estado}: Riesgo ${datos.riesgo}`, {
        permanent: false,
        direction: 'top',
        className: 'tooltip-map'
      });
    });

    return () => {
      map.remove();
    };
  }, [datosPrediccion, activeTab]);

  useEffect(() => {
    if (!dataEstado || !estadoSeleccionado || activeTab !== 'prediction') return;

    const chartDom = document.getElementById('serie-prediccion');
    if (!chartDom) return;

    const chart = echarts.init(chartDom);
    const anios = Object.keys(dataEstado.predicciones);
    const valores = Object.values(dataEstado.predicciones);

    chart.setOption({
      xAxis: {
        type: 'category',
        data: anios,
        axisLabel: { color: '#aaa' },
        axisLine: { lineStyle: { color: '#555' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#aaa' },
        axisLine: { lineStyle: { color: '#555' } },
        splitLine: { lineStyle: { color: '#222' } }
      },
      series: [
        {
          data: valores,
          type: 'line',
          smooth: true,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#60a5fa' },
              { offset: 1, color: '#1e40af' }
            ])
          },
          lineStyle: { color: '#3b82f6', width: 3 }
        }
      ],
      tooltip: { trigger: 'axis' },
      grid: { left: '5%', right: '5%', bottom: '10%', containLabel: true }
    });

    const handleResize = () => chart.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      chart.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [dataEstado, estadoSeleccionado, activeTab]);


  
  // Chart initialization for statistics tab
  useEffect(() => {
    if (activeTab === "statistics") {
      // Cases by region chart
      const regionChartDom = document.getElementById("cases-by-region-chart");
      if (regionChartDom) {
        const regionChart = echarts.init(regionChartDom);
        const regionOption = {
          animation: false,
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            top: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "value",
            axisLine: {
              lineStyle: {
                color: "#445566",
              },
            },
            axisLabel: {
              color: "#8899aa",
            },
            splitLine: {
              lineStyle: {
                color: "#223344",
              },
            },
          },
          yAxis: {
            type: "category",
            data: ["Noreste", "Sureste", "Oeste", "Centro", "Suroeste"],
            axisLine: {
              lineStyle: {
                color: "#445566",
              },
            },
            axisLabel: {
              color: "#8899aa",
            },
          },
          series: [
            {
              name: "Casos",
              type: "bar",
              data: [120, 200, 150, 80, 70],
              itemStyle: {
                color: "#0088ff",
              },
            },
          ],
        };
        regionChart.setOption(regionOption);

        // Age distribution chart
        const ageChartDom = document.getElementById("age-distribution-chart");
        if (ageChartDom) {
          const ageChart = echarts.init(ageChartDom);
          const ageOption = {
            animation: false,
            tooltip: {
              trigger: "item",
            },
            color: ["#0088ff", "#00aaff", "#33bbff", "#66ccff", "#99ddff"],
            series: [
              {
                name: "Distribución por edad",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                  borderRadius: 10,
                  borderColor: "#111a28",
                  borderWidth: 2,
                },
                label: {
                  show: false,
                  position: "center",
                },
                emphasis: {
                  label: {
                    show: true,
                    fontSize: "14",
                    fontWeight: "bold",
                    color: "#ffffff",
                  },
                },
                labelLine: {
                  show: false,
                },
                data: [
                  { value: 35, name: "0-18" },
                  { value: 80, name: "19-35" },
                  { value: 120, name: "36-50" },
                  { value: 160, name: "51-65" },
                  { value: 100, name: "65+" },
                ],
              },
            ],
          };
          ageChart.setOption(ageOption);
        }

        // Monthly trend chart
        const trendChartDom = document.getElementById("monthly-trend-chart");
        if (trendChartDom) {
          const trendChart = echarts.init(trendChartDom);
          const trendOption = {
            animation: false,
            tooltip: {
              trigger: "axis",
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
              ],
              axisLine: {
                lineStyle: {
                  color: "#445566",
                },
              },
              axisLabel: {
                color: "#8899aa",
              },
            },
            yAxis: {
              type: "value",
              axisLine: {
                lineStyle: {
                  color: "#445566",
                },
              },
              axisLabel: {
                color: "#8899aa",
              },
              splitLine: {
                lineStyle: {
                  color: "#223344",
                },
              },
            },
            series: [
              {
                name: "Casos 2024",
                type: "line",
                stack: "Total",
                data: [20, 32, 41, 54, 60, 80, 85, 90, 95, 100, 110, 120],
                lineStyle: {
                  width: 3,
                  color: "#0088ff",
                },
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(0, 136, 255, 0.4)",
                      },
                      {
                        offset: 1,
                        color: "rgba(0, 136, 255, 0.1)",
                      },
                    ],
                  },
                },
              },
              {
                name: "Casos 2025",
                type: "line",
                stack: "Total",
                data: [
                  120,
                  132,
                  141,
                  154,
                  190,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                ],
                lineStyle: {
                  width: 3,
                  color: "#ff5500",
                },
                areaStyle: {
                  color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(255, 85, 0, 0.4)",
                      },
                      {
                        offset: 1,
                        color: "rgba(255, 85, 0, 0.1)",
                      },
                    ],
                  },
                },
              },
            ],
          };
          trendChart.setOption(trendOption);
        }

        const handleResize = () => {
          regionChart.resize();
          if (ageChartDom) {
            const ageChart = echarts.getInstanceByDom(ageChartDom);
            ageChart?.resize();
          }
          if (trendChartDom) {
            const trendChart = echarts.getInstanceByDom(trendChartDom);
            trendChart?.resize();
          }
        };

        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener("resize", handleResize);
          regionChart.dispose();
          if (ageChartDom) {
            const ageChart = echarts.getInstanceByDom(ageChartDom);
            ageChart?.dispose();
          }
          if (trendChartDom) {
            const trendChart = echarts.getInstanceByDom(trendChartDom);
            trendChart?.dispose();
          }
        };
      }
    }
  }, [activeTab]);














  const renderTabContent = () => {
    switch (activeTab) {
      case 'prediction':
          return (
    <>
      {/* Mapa + Tarjetas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div id="mapa-prediccion" className="w-full h-[500px] bg-[#0a1220] rounded-lg"></div>
        <div className="space-y-6">
          {estadoSeleccionado && dataEstado ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-[#111a28] p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-2">Estado</p>
                  <h3 className="text-2xl font-bold">{estadoSeleccionado}</h3>
                </div>
                <div className="bg-[#111a28] p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-2">Riesgo</p>
                  <h3
                    className={`text-2xl font-bold ${
                      dataEstado.riesgo === "Alto"
                        ? "text-red-400"
                        : dataEstado.riesgo === "Medio"
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {dataEstado.riesgo}
                  </h3>
                </div>
                <div className="bg-[#111a28] p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-2">2025</p>
                  <h3 className="text-2xl font-bold">
                    {dataEstado.predicciones?.["2025"] ?? "N/D"} casos
                  </h3>
                </div>
                <div className="bg-[#111a28] p-6 rounded-lg text-center">
                  <p className="text-sm text-gray-400 mb-2">2026</p>
                  <h3 className="text-2xl font-bold">
                    {dataEstado.predicciones?.["2026"] ?? "N/D"} casos
                  </h3>
                </div>
              </div>
              {!dataEstado.factores ? (
                <div className="bg-[#1f2937] p-6 rounded-lg border border-blue-700 text-sm text-white">
                  <h4 className="text-lg font-semibold mb-2">
                    ¿Por qué esta alerta?
                  </h4>
                  <p className="text-gray-400">
                    No hay datos ambientales disponibles para esta zona.
                  </p>
                </div>
              ) : (
                <div className="bg-[#1f2937] p-6 rounded-lg border border-blue-700 text-sm text-white">
                  <h4 className="text-lg font-semibold mb-2">
                    ¿Por qué esta alerta?
                  </h4>
                  <p>
                    En {estadoSeleccionado}, se detecta un{" "}
                    <span className="font-bold">
                      {dataEstado.riesgo?.toLowerCase()}
                    </span>{" "}
                    riesgo debido a:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-gray-300 space-y-1">
                    <li>Humedad relativa baja ({dataEstado.factores.humedad}%)</li>
                    <li>
                      Temperatura elevada ({dataEstado.factores.temperatura} °C)
                    </li>
                    <li>
                      Saturación hospitalaria alta (
                      {dataEstado.factores.saturacion_hospitalaria}%)
                    </li>
                  </ul>
                  <p className="mt-3 text-gray-400">
                    Estos factores aumentan el riesgo de brote. Se recomienda
                    vigilancia y acción médica local.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#111a28] p-6 rounded-lg text-gray-400">
              Selecciona un estado en el mapa para ver detalles.
            </div>
          )}
        </div>
      </div>

      {/* Gráfica */}
      {dataEstado && (
        <div className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">
            Proyección temporal de casos en {estadoSeleccionado}
          </h3>
          <div
            id="serie-prediccion"
            className="w-full h-[400px] bg-[#0a1220] rounded-lg"
          ></div>
        </div>
      )}

      {/* Secciones informativas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="bg-[#111a28] p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Síntomas comunes</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <i className="fas fa-circle text-xs text-red-500 mr-3"></i>Fiebre y
              escalofríos persistentes
            </li>
            <li className="flex items-center">
              <i className="fas fa-circle text-xs text-red-500 mr-3"></i>Fatiga
              extrema
            </li>
            <li className="flex items-center">
              <i className="fas fa-circle text-xs text-red-500 mr-3"></i>Dolor
              muscular y articular
            </li>
            <li className="flex items-center">
              <i className="fas fa-circle text-xs text-red-500 mr-3"></i>
              Infecciones en heridas que no sanan
            </li>
            <li className="flex items-center">
              <i className="fas fa-circle text-xs text-red-500 mr-3"></i>Confusión o
              cambios en el estado mental
            </li>
          </ul>
        </div>
        <div className="bg-[#111a28] p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Factores de riesgo</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              Hospitalización prolongada
            </li>
            <li className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              Sistema inmunológico debilitado
            </li>
            <li className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              Uso reciente de antibióticos o antifúngicos
            </li>
            <li className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              Presencia de dispositivos médicos invasivos
            </li>
            <li className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-500 mr-3"></i>
              Contacto con pacientes infectados
            </li>
          </ul>
        </div>
        <div className="bg-[#111a28] p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Medidas preventivas</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>Higiene
              estricta de manos
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>Aislamiento
              de pacientes infectados
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>Limpieza y
              desinfección de superficies
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>Uso
              adecuado de equipo de protección
            </li>
            <li className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>Monitoreo
              activo en entornos de alto riesgo
            </li>
          </ul>
        </div>
      </div>

      {/* Alerta sanitaria */}
      <div className="bg-gradient-to-r from-red-900/40 to-red-800/20 border border-red-700/30 rounded-lg p-6 mb-12">
        <div className="flex items-start">
          <div className="mr-4">
            <i className="fas fa-exclamation-circle text-3xl text-red-500"></i>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Alerta sanitaria</h3>
            <p className="text-gray-300">
              Candida auris es altamente resistente a múltiples medicamentos
              antifúngicos comúnmente utilizados para tratar infecciones por
              Candida. Algunos casos han sido resistentes a los tres tipos
              principales de antifúngicos, lo que limita severamente las opciones de
              tratamiento.
            </p>
            <button className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
              Ver recomendaciones oficiales
            </button>
          </div>
        </div>
      </div>

      {/* Últimas actualizaciones */}
      <div className="mb-12">
        <h3 className="text-2xl font-semibold mb-6">Últimas actualizaciones</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-[#111a28] rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="bg-blue-600 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  Nuevo
                </span>
                <span className="text-gray-400 text-sm">20 May, 2025</span>
              </div>
              <h4 className="text-lg font-medium mb-2">
                Identificado nuevo foco en región central
              </h4>
              <p className="text-gray-400 mb-4">
                Las autoridades sanitarias han confirmado 12 nuevos casos en
                hospitales de la región central, elevando la alerta en la zona.
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                Leer más <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
          <div className="bg-[#111a28] rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-400 text-sm">18 May, 2025</span>
              </div>
              <h4 className="text-lg font-medium mb-2">
                Estudio revela nueva variante con mayor resistencia
              </h4>
              <p className="text-gray-400 mb-4">
                Investigadores han identificado una nueva variante de Candida auris
                con resistencia aumentada a los tratamientos estándar.
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                Leer más <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
          <div className="bg-[#111a28] rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <span className="text-gray-400 text-sm">15 May, 2025</span>
              </div>
              <h4 className="text-lg font-medium mb-2">
                Aprobado nuevo protocolo de detección rápida
              </h4>
              <p className="text-gray-400 mb-4">
                La FDA ha aprobado un nuevo método de diagnóstico que permite
                identificar Candida auris en menos de 2 horas.
              </p>
              <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                Leer más <i className="fas fa-arrow-right ml-1"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

      case 'statistics':
        return (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Estadísticas de Candida auris</h2>
              <p className="text-xl text-gray-300 mb-8">
                Análisis detallado de la distribución y tendencias de casos de Candida auris a nivel nacional.
              </p>
              
              {/* Statistics Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111a28] p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Total de casos</h3>
                    <i className="fas fa-chart-line text-blue-400 text-xl"></i>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">450</span>
                    <span className="text-green-500 ml-3 text-sm">+12.5% <i className="fas fa-arrow-up"></i></span>
                  </div>
                  <p className="text-gray-400 mt-2 text-sm">Desde el último mes</p>
                </div>
                
                <div className="bg-[#111a28] p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Tasa de mortalidad</h3>
                    <i className="fas fa-heartbeat text-red-400 text-xl"></i>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">32%</span>
                    <span className="text-red-500 ml-3 text-sm">+2.1% <i className="fas fa-arrow-up"></i></span>
                  </div>
                  <p className="text-gray-400 mt-2 text-sm">En pacientes con comorbilidades</p>
                </div>
                
                <div className="bg-[#111a28] p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Resistencia a antifúngicos</h3>
                    <i className="fas fa-shield-virus text-yellow-400 text-xl"></i>
                  </div>
                  <div className="flex items-end">
                    <span className="text-4xl font-bold">78%</span>
                    <span className="text-red-500 ml-3 text-sm">+5.3% <i className="fas fa-arrow-up"></i></span>
                  </div>
                  <p className="text-gray-400 mt-2 text-sm">De las cepas analizadas</p>
                </div>
              </div>
              
              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Cases by Region */}
                <div className="bg-[#111a28] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-6">Casos por región</h3>
                  <div id="cases-by-region-chart" className="w-full h-80"></div>
                </div>
                
                {/* Age Distribution */}
                <div className="bg-[#111a28] p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-6">Distribución por edad</h3>
                  <div id="age-distribution-chart" className="w-full h-80"></div>
                </div>
              </div>
              
              {/* Monthly Trend */}
              <div className="bg-[#111a28] p-6 rounded-lg mb-12">
                <h3 className="text-xl font-semibold mb-6">Tendencia mensual de casos</h3>
                <div id="monthly-trend-chart" className="w-full h-80"></div>
              </div>
              
              {/* Data Table */}
              <div className="bg-[#111a28] rounded-lg overflow-hidden mb-12">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-6">Datos por estado</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-[#0a1220] text-gray-300">
                        <tr>
                          <th className="px-6 py-3">Estado</th>
                          <th className="px-6 py-3">Casos</th>
                          <th className="px-6 py-3">Muertes</th>
                          <th className="px-6 py-3">Tasa de resistencia</th>
                          <th className="px-6 py-3">Nivel de alerta</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        <tr className="hover:bg-[#1a2535]">
                          <td className="px-6 py-4">Nueva York</td>
                          <td className="px-6 py-4">87</td>
                          <td className="px-6 py-4">28</td>
                          <td className="px-6 py-4">82%</td>
                          <td className="px-6 py-4"><span className="bg-red-900/50 text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Alto</span></td>
                        </tr>
                        <tr className="hover:bg-[#1a2535]">
                          <td className="px-6 py-4">California</td>
                          <td className="px-6 py-4">65</td>
                          <td className="px-6 py-4">19</td>
                          <td className="px-6 py-4">75%</td>
                          <td className="px-6 py-4"><span className="bg-red-900/50 text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Alto</span></td>
                        </tr>
                        <tr className="hover:bg-[#1a2535]">
                          <td className="px-6 py-4">Florida</td>
                          <td className="px-6 py-4">58</td>
                          <td className="px-6 py-4">21</td>
                          <td className="px-6 py-4">79%</td>
                          <td className="px-6 py-4"><span className="bg-red-900/50 text-red-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Alto</span></td>
                        </tr>
                        <tr className="hover:bg-[#1a2535]">
                          <td className="px-6 py-4">Texas</td>
                          <td className="px-6 py-4">52</td>
                          <td className="px-6 py-4">15</td>
                          <td className="px-6 py-4">68%</td>
                          <td className="px-6 py-4"><span className="bg-yellow-900/50 text-yellow-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Medio</span></td>
                        </tr>
                        <tr className="hover:bg-[#1a2535]">
                          <td className="px-6 py-4">Illinois</td>
                          <td className="px-6 py-4">43</td>
                          <td className="px-6 py-4">12</td>
                          <td className="px-6 py-4">71%</td>
                          <td className="px-6 py-4"><span className="bg-yellow-900/50 text-yellow-400 text-xs font-medium px-2.5 py-0.5 rounded-full">Medio</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
              {/* Download Section */}
              <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <h3 className="text-xl font-semibold mb-2">Descargar datos completos</h3>
                    <p className="text-gray-300">
                      Accede a los datos completos de Candida auris para análisis detallado e investigación.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                      <i className="fas fa-file-csv mr-2"></i> CSV
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                      <i className="fas fa-file-excel mr-2"></i> Excel
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                      <i className="fas fa-file-pdf mr-2"></i> PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'prevention':
        return (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Prevención de Candida auris</h2>
              <p className="text-xl text-gray-300 mb-8">
                Estrategias y protocolos para prevenir la propagación de Candida auris en entornos sanitarios y comunitarios.
              </p>
              
              {/* Hero Prevention Image */}
              <div className="relative mb-12 overflow-hidden rounded-lg">
                <div className="aspect-[16/9] w-full bg-[#0a1220]">
                  <img 
                    src="https://readdy.ai/api/search-image?query=Healthcare%20workers%20in%20protective%20equipment%20performing%20disinfection%20procedures%20in%20a%20hospital%20setting%2C%20with%20blue%20lighting%20and%20modern%20medical%20environment%2C%20showing%20infection%20control%20protocols%20against%20fungal%20pathogens%2C%20professional%20clinical%20setting%20with%20high%20attention%20to%20detail&width=1200&height=675&seq=2&orientation=landscape" 
                    alt="Profesionales sanitarios implementando medidas de prevención" 
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              </div>
              
              {/* Prevention Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Close-up%20of%20hands%20being%20washed%20thoroughly%20with%20soap%20and%20water%20under%20running%20water%2C%20with%20blue%20tones%20and%20clean%20clinical%20appearance%2C%20showing%20proper%20hand%20hygiene%20technique%20with%20foam%20and%20bubbles%2C%20detailed%20and%20professional%20medical%20setting&width=400&height=300&seq=3&orientation=landscape" 
                      alt="Higiene de manos" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Higiene de manos</h3>
                    <p className="text-gray-300 mb-4">
                      La higiene adecuada de manos es la medida más importante para prevenir la propagación de Candida auris. Lávese las manos con agua y jabón o use desinfectante a base de alcohol.
                    </p>
                    <ul className="space-y-2 text-gray-400 mb-4">
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Antes y después del contacto con pacientes</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Después de tocar superficies en habitaciones de pacientes</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Después de quitarse el equipo de protección</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Healthcare%20worker%20wearing%20full%20personal%20protective%20equipment%20including%20gown%2C%20gloves%2C%20mask%20and%20face%20shield%20in%20a%20hospital%20setting%2C%20with%20blue%20lighting%20and%20professional%20medical%20environment%2C%20showing%20infection%20control%20measures%20against%20pathogens%2C%20detailed%20clinical%20setting&width=400&height=300&seq=4&orientation=landscape" 
                      alt="Equipo de protección personal" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Equipo de protección</h3>
                    <p className="text-gray-300 mb-4">
                      El uso adecuado del equipo de protección personal (EPP) es esencial para prevenir la transmisión de Candida auris en entornos sanitarios.
                    </p>
                    <ul className="space-y-2 text-gray-400 mb-4">
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Guantes desechables</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Batas de aislamiento</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Mascarillas cuando sea necesario</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Protección ocular para procedimientos específicos</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src="https://readdy.ai/api/search-image?query=Professional%20cleaning%20staff%20disinfecting%20hospital%20room%20surfaces%20with%20specialized%20equipment%20and%20chemicals%2C%20with%20blue%20lighting%20and%20modern%20medical%20environment%2C%20showing%20thorough%20environmental%20cleaning%20protocols%20against%20fungal%20contamination%2C%20detailed%20clinical%20setting%20with%20high%20attention%20to%20detail&width=400&height=300&seq=5&orientation=landscape" 
                      alt="Limpieza y desinfección" 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Limpieza ambiental</h3>
                    <p className="text-gray-300 mb-4">
                      La limpieza y desinfección minuciosa de superficies y equipos es crucial para eliminar Candida auris del entorno.
                    </p>
                    <ul className="space-y-2 text-gray-400 mb-4">
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Usar desinfectantes efectivos contra C. auris</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Limpiar frecuentemente las superficies de alto contacto</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Seguir protocolos específicos para habitaciones de pacientes infectados</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-check text-green-500 mt-1 mr-2"></i>
                        <span>Desechar o desinfectar adecuadamente los equipos compartidos</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Prevention Protocol */}
              <div className="bg-[#111a28] rounded-lg p-6 mb-12">
                <h3 className="text-2xl font-semibold mb-6">Protocolo de prevención en centros sanitarios</h3>
                
                <div className="relative">
                  <div className="absolute left-4 h-full w-0.5 bg-blue-800"></div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 -translate-x-1/2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <h4 className="text-xl font-medium mb-3">Identificación temprana</h4>
                    <p className="text-gray-300 mb-4">
                      Implementar protocolos de detección para identificar rápidamente a pacientes colonizados o infectados con Candida auris.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Realizar pruebas de detección a pacientes de alto riesgo</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Establecer sistemas de alerta para laboratorios</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Comunicar resultados positivos inmediatamente</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 -translate-x-1/2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <h4 className="text-xl font-medium mb-3">Aislamiento de pacientes</h4>
                    <p className="text-gray-300 mb-4">
                      Colocar a los pacientes con Candida auris en habitaciones individuales con precauciones de contacto.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Habitación individual o cohorte con otros pacientes con C. auris</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Señalización clara de precauciones de aislamiento</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Limitar el movimiento de pacientes fuera de la habitación</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative pl-12 pb-8">
                    <div className="absolute left-2 -translate-x-1/2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <h4 className="text-xl font-medium mb-3">Uso prudente de antimicrobianos</h4>
                    <p className="text-gray-300 mb-4">
                      Implementar programas de administración de antimicrobianos para reducir el uso innecesario de antibióticos y antifúngicos.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Revisar regularmente la necesidad de terapia antimicrobiana</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Ajustar tratamientos basados en resultados de cultivos</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Consultar con especialistas en enfermedades infecciosas</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="relative pl-12">
                    <div className="absolute left-2 -translate-x-1/2 bg-blue-600 rounded-full w-6 h-6 flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <h4 className="text-xl font-medium mb-3">Educación y comunicación</h4>
                    <p className="text-gray-300 mb-4">
                      Educar al personal sanitario, pacientes y visitantes sobre Candida auris y las medidas de prevención.
                    </p>
                    <ul className="space-y-2 text-gray-400">
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Proporcionar capacitación regular al personal</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Informar a pacientes y familiares sobre precauciones necesarias</span>
                      </li>
                      <li className="flex items-start">
                        <i className="fas fa-arrow-right text-blue-400 mt-1 mr-2"></i>
                        <span>Establecer comunicación clara entre instalaciones durante transferencias</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Prevention Resources */}
              <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-lg p-6">
                <h3 className="text-2xl font-semibold mb-6">Recursos de prevención</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#0a1220]/50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-file-pdf text-red-400 text-2xl mr-3"></i>
                      <h4 className="text-lg font-medium">Guías y protocolos</h4>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center justify-between">
                        <span>Guía de prevención para centros sanitarios</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Protocolo de limpieza y desinfección</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Recomendaciones para laboratorios</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-[#0a1220]/50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-video text-blue-400 text-2xl mr-3"></i>
                      <h4 className="text-lg font-medium">Videos formativos</h4>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center justify-between">
                        <span>Técnica correcta de higiene de manos</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Colocación y retirada de EPP</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Desinfección de superficies de alto contacto</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'resources':
        return (
          <>
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Recursos sobre Candida auris</h2>
              <p className="text-xl text-gray-300 mb-8">
                Información, herramientas y materiales educativos para profesionales sanitarios y público general.
              </p>
              
              {/* Resource Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-[#111a28] rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-book-medical text-blue-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Guías clínicas</h3>
                  <p className="text-gray-400 mb-4">Protocolos y directrices para el diagnóstico y tratamiento</p>
                  <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                    Ver recursos <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
                
                <div className="bg-[#111a28] rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-graduation-cap text-green-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Materiales educativos</h3>
                  <p className="text-gray-400 mb-4">Recursos formativos para profesionales y pacientes</p>
                  <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                    Ver recursos <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
                
                <div className="bg-[#111a28] rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-microscope text-purple-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Investigación</h3>
                  <p className="text-gray-400 mb-4">Estudios científicos y avances recientes</p>
                  <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                    Ver recursos <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
                
                <div className="bg-[#111a28] rounded-lg p-6 text-center">
                  <div className="w-16 h-16 bg-red-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-clipboard-list text-red-400 text-2xl"></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Herramientas</h3>
                  <p className="text-gray-400 mb-4">Instrumentos para vigilancia y control de infecciones</p>
                  <button className="text-blue-400 hover:text-blue-300 font-medium cursor-pointer whitespace-nowrap !rounded-button">
                    Ver recursos <i className="fas fa-arrow-right ml-1"></i>
                  </button>
                </div>
              </div>
              
              {/* Latest Publications */}
              <div className="bg-[#111a28] rounded-lg p-6 mb-12">
                <h3 className="text-2xl font-semibold mb-6">Publicaciones recientes</h3>
                <div className="space-y-6">
                  <div className="border-b border-gray-800 pb-6">
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          src="https://readdy.ai/api/search-image?query=Scientific%20journal%20cover%20with%20abstract%20representation%20of%20fungal%20cells%20in%20blue%20and%20white%2C%20professional%20medical%20publication%20design%20with%20clean%20layout%2C%20showing%20microscopic%20view%20of%20Candida%20auris%20with%20high%20detail%20and%20contrast%20against%20dark%20background&width=200&height=280&seq=6&orientation=portrait" 
                          alt="Portada de publicación científica" 
                          className="w-full md:w-40 h-56 object-cover object-top rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-2">Mecanismos de resistencia emergentes en Candida auris: un análisis genómico</h4>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Autores:</span> Rodríguez M, Smith J, Chen L, et al.
                        </p>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Revista:</span> Journal of Medical Mycology
                        </p>
                        <p className="text-gray-400 mb-4">
                          Este estudio analiza los mecanismos moleculares que contribuyen a la resistencia antifúngica en cepas de Candida auris aisladas en diferentes regiones geográficas, identificando nuevas mutaciones asociadas con resistencia a equinocandinas.
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-external-link-alt mr-2"></i> Acceder
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-download mr-2"></i> PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-b border-gray-800 pb-6">
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          src="https://readdy.ai/api/search-image?query=Medical%20journal%20cover%20showing%20hospital%20infection%20control%20procedures%20with%20healthcare%20workers%20in%20protective%20equipment%2C%20professional%20clinical%20publication%20with%20clean%20layout%2C%20blue%20tones%20and%20high%20contrast%20against%20dark%20background%2C%20detailed%20medical%20imagery&width=200&height=280&seq=7&orientation=portrait" 
                          alt="Portada de publicación sobre control de infecciones" 
                          className="w-full md:w-40 h-56 object-cover object-top rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-2">Eficacia de protocolos de desinfección ambiental contra Candida auris en entornos hospitalarios</h4>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Autores:</span> Johnson K, García P, Williams T, et al.
                        </p>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Revista:</span> Infection Control & Hospital Epidemiology
                        </p>
                        <p className="text-gray-400 mb-4">
                          Evaluación comparativa de diferentes protocolos de limpieza y desinfección para eliminar Candida auris de superficies hospitalarias, con recomendaciones específicas para optimizar la eficacia de los procedimientos.
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-external-link-alt mr-2"></i> Acceder
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-download mr-2"></i> PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex flex-col md:flex-row md:items-start">
                      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          src="https://readdy.ai/api/search-image?query=Clinical%20research%20journal%20cover%20showing%20epidemiological%20data%20visualization%20with%20maps%20and%20charts%2C%20professional%20medical%20publication%20with%20clean%20layout%2C%20blue%20and%20red%20data%20visualization%20against%20dark%20background%2C%20detailed%20statistical%20imagery%20of%20disease%20spread&width=200&height=280&seq=8&orientation=portrait" 
                          alt="Portada de publicación sobre epidemiología" 
                          className="w-full md:w-40 h-56 object-cover object-top rounded-lg"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl font-medium mb-2">Epidemiología molecular y factores de riesgo asociados con brotes de Candida auris en unidades de cuidados intensivos</h4>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Autores:</span> Lee S, Patel N, Fernández A, et al.
                        </p>
                        <p className="text-gray-400 mb-3">
                          <span className="font-medium">Revista:</span> Clinical Infectious Diseases
                        </p>
                        <p className="text-gray-400 mb-4">
                          Análisis de múltiples brotes de Candida auris en UCIs, identificando patrones de transmisión, factores de riesgo específicos y estrategias efectivas de contención que redujeron significativamente la incidencia.
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-external-link-alt mr-2"></i> Acceder
                          </button>
                          <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                            <i className="fas fa-download mr-2"></i> PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Educational Materials */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-file-powerpoint text-red-400 text-2xl mr-3"></i>
                      <h3 className="text-xl font-semibold">Presentaciones</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center justify-between">
                        <span>Introducción a Candida auris</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Diagnóstico y tratamiento</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Control de infecciones</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-file-alt text-blue-400 text-2xl mr-3"></i>
                      <h3 className="text-xl font-semibold">Infografías</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center justify-between">
                        <span>Factores de riesgo y prevención</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Transmisión y propagación</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Resistencia antifúngica</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-download"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-[#111a28] rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <i className="fas fa-video text-green-400 text-2xl mr-3"></i>
                      <h3 className="text-xl font-semibold">Videos educativos</h3>
                    </div>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-center justify-between">
                        <span>¿Qué es Candida auris?</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Medidas de prevención</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                      <li className="flex items-center justify-between">
                        <span>Testimonios de expertos</span>
                        <button className="text-blue-400 hover:text-blue-300 cursor-pointer whitespace-nowrap !rounded-button">
                          <i className="fas fa-play-circle"></i>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Contact Experts */}
              <div className="bg-gradient-to-r from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-lg p-6">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-6 md:mb-0 md:mr-6">
                    <h3 className="text-2xl font-semibold mb-2">Consulta con expertos</h3>
                    <p className="text-gray-300 max-w-2xl">
                      ¿Necesitas asesoramiento especializado sobre Candida auris? Nuestro equipo de expertos en micología médica y control de infecciones está disponible para consultas.
                    </p>
                  </div>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                    Solicitar consulta
                  </button>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
<div className="min-h-screen bg-[#0a0e1a] text-white">
  <div className="max-w-7xl mx-auto px-4 py-8">
    {/* Header Título */}
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-6 tracking-wide">Candida Auris</h1>

      {/* Tabs de navegación estilo moderno */}
      <div className="bg-[#111527] rounded-xl p-1">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('prediction')}
            className={`flex-1 py-3 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'prediction'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f3d]'
            }`}
          >
            <i className="fas fa-chart-line"></i>
            <span>Predicción</span>
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-3 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'statistics'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f3d]'
            }`}
          >
            <i className="fas fa-chart-bar"></i>
            <span>Estadísticas</span>
          </button>
          <button
            onClick={() => setActiveTab('prevention')}
            className={`flex-1 py-3 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'prevention'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f3d]'
            }`}
          >
            <i className="fas fa-shield-virus"></i>
            <span>Prevención</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`flex-1 py-3 px-6 font-medium text-sm whitespace-nowrap transition-all duration-300 rounded-lg flex items-center justify-center space-x-2 cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f3d]'
            }`}
          >
            <i className="fas fa-book-medical"></i>
            <span>Recursos</span>
          </button>
        </nav>
      </div>
    </header>


        {/* Main Content */}
        <main>
<section className="mb-12 bg-gradient-to-r from-[#111527] to-[#1a1f3d] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
  <div className="flex flex-col md:flex-row">
    <div className="md:w-1/2 p-8 md:p-10">
      <div className="inline-block bg-blue-500 bg-opacity-20 p-2 rounded-lg mb-4">
        <i className="fas fa-microscope text-blue-400 text-xl"></i>
      </div>
      <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        Candida auris
      </h2>
      <p className="text-gray-300 text-lg leading-relaxed mb-6">
        Un hongo emergente que se propaga fácilmente en entornos sanitarios y puede causar infecciones graves
        en pacientes vulnerables. Su resistencia a múltiples antimicóticos lo convierte en una amenaza seria para la salud pública.
      </p>
      <div className="flex space-x-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
          <i className="fas fa-map-marker-alt mr-2"></i>
          Ver mapa de casos
        </button>
        <button className="bg-transparent hover:bg-gray-800 text-white border border-gray-600 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 text-sm font-medium cursor-pointer !rounded-button whitespace-nowrap">
          <i className="fas fa-info-circle mr-2"></i>
          Más información
        </button>
      </div>
    </div>
    <div className="md:w-1/2 relative">
      <img
        src="https://readdy.ai/api/search-image?query=A%20microscopic%20close-up%20of%20Candida%20auris%20fungus%20cells%2C%20highly%20detailed%20scientific%20visualization%20with%20blue%20and%20purple%20tones%2C%20medical%20research%20imagery%20on%20dark%20background%2C%20professional%20healthcare%20visualization&width=700&height=500&seq=3&orientation=landscape"
        alt="Candida auris microscopic view"
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
        <span className="text-xs text-gray-300">© Microscopía electrónica</span>
      </div>
    </div>
  </div>
</section>





          {renderTabContent()}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-8 mt-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">FungiAlert</h4>
              <p className="text-gray-400">Sistema de monitoreo y alerta temprana para infecciones fúngicas emergentes y resistentes.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Inicio</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Patógenos</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Mapa global</a></li>
                <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Recursos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  <a href="mailto:info@fungialert.org" className="hover:text-white transition-colors cursor-pointer">info@fungialert.org</a>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2"></i>
                  <a href="tel:+1234567890" className="hover:text-white transition-colors cursor-pointer">+1 (234) 567-890</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Suscríbete</h4>
              <p className="text-gray-400 mb-4">Recibe alertas y actualizaciones sobre patógenos emergentes.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="bg-[#1a2535] text-white p-2 rounded-l-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-r-lg transition-colors cursor-pointer whitespace-nowrap !rounded-button">
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 pb-8 text-center text-gray-500">
            <p>© 2025 FungiAlert. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;

