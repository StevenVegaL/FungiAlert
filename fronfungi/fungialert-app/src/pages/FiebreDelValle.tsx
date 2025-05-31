// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

import React, { useState, useEffect } from 'react';
import * as echarts from 'echarts';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedState, setSelectedState] = useState<string>('Arizona');
  const [riskLevel, setRiskLevel] = useState<string>('Alto');
  const [casesCount, setCasesCount] = useState<number>(1250);
  const [growthRate, setGrowthRate] = useState<number>(12.5);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [mapChart, setMapChart] = useState<echarts.ECharts | null>(null);
  
  const stateData = {
    'Arizona': { value: 95, risk: 'Alto', cases: 1250, growth: 12.5, aridityLevel: 'Extremo (8.7/10)', aridityPercentage: 87, dustStormLevel: 'Alto (7.8/10)', dustStormPercentage: 78 },
    'California': { value: 75, risk: 'Medio', cases: 980, growth: 8.2, aridityLevel: 'Moderado (6.5/10)', aridityPercentage: 65, dustStormLevel: 'Medio (5.5/10)', dustStormPercentage: 55 },
    'Nevada': { value: 65, risk: 'Medio', cases: 450, growth: 6.8, aridityLevel: 'Alto (7.2/10)', aridityPercentage: 72, dustStormLevel: 'Medio (4.8/10)', dustStormPercentage: 48 },
    'New Mexico': { value: 85, risk: 'Alto', cases: 890, growth: 11.3, aridityLevel: 'Muy Alto (8.1/10)', aridityPercentage: 81, dustStormLevel: 'Alto (7.2/10)', dustStormPercentage: 72 },
    'Texas': { value: 70, risk: 'Medio-Alto', cases: 760, growth: 9.5, aridityLevel: 'Moderado (6.8/10)', aridityPercentage: 68, dustStormLevel: 'Medio (5.2/10)', dustStormPercentage: 52 },
    'Colorado': { value: 45, risk: 'Bajo', cases: 320, growth: 4.2, aridityLevel: 'Bajo (4.5/10)', aridityPercentage: 45, dustStormLevel: 'Bajo (3.2/10)', dustStormPercentage: 32 },
    'Utah': { value: 55, risk: 'Medio-Bajo', cases: 280, growth: 5.1, aridityLevel: 'Medio (5.5/10)', aridityPercentage: 55, dustStormLevel: 'Bajo (3.8/10)', dustStormPercentage: 38 }
  };
  
  useEffect(() => {
    if (activeTab === 'prediction') {
      const initMap = async () => {
        const mapElement = document.getElementById('usa-map');
        if (!mapElement) return;
        
        const chart = echarts.init(mapElement);
        setMapChart(chart);
        
        const usaJson = await fetch('https://raw.githubusercontent.com/pissang/starbucks/gh-pages/example/asset/usa.json').then(res => res.json());
        echarts.registerMap('USA', usaJson, {});
        
        const option = {
          animation: false,
          backgroundColor: 'transparent',
          tooltip: {
            trigger: 'item',
            formatter: (params: any) => {
              const data = stateData[params.name];
              if (data) {
                return `${params.name}<br/>Riesgo: ${data.risk}<br/>Casos: ${data.cases}<br/>Crecimiento: +${data.growth}%`;
              }
              return params.name;
            }
          },
          visualMap: {
            left: 'right',
            min: 0,
            max: 100,
            inRange: {
              color: ['#22c55e', '#eab308', '#ef4444']
            },
            text: ['Alto', 'Bajo'],
            calculable: true,
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              name: 'Nivel de Riesgo',
              type: 'map',
              roam: true,
              map: 'USA',
              emphasis: {
                label: {
                  show: true,
                  color: '#fff'
                },
                itemStyle: {
                  areaColor: '#3b82f6'
                }
              },
              data: Object.entries(stateData).map(([name, data]) => ({
                name,
                value: data.value
              }))
            }
          ]
        };
        
        chart.setOption(option);
        chart.on('click', (params) => {
          const data = stateData[params.name];
          if (data) {
            setSelectedState(params.name);
            setRiskLevel(data.risk);
            setCasesCount(data.cases);
            setGrowthRate(data.growth);
          }
        });
        
        window.addEventListener('resize', () => {
          chart.resize();
        });
      };
      
      initMap();
      
      return () => {
        if (mapChart) {
          mapChart.dispose();
        }
      };
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (activeTab === 'prediction') {
      const chartDom = document.getElementById('risk-chart');
      if (chartDom) {
        const myChart = echarts.init(chartDom);
        const option = {
          animation: false,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['2020', '2021', '2022', '2023', '2024', '2025', '2026'],
            axisLine: {
              lineStyle: {
                color: '#8392A5'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#8392A5'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(131, 146, 165, 0.2)'
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}: {c} casos'
          },
          series: [
            {
              data: [320, 480, 750, 890, 1100, 1250, 1420],
              type: 'line',
              smooth: true,
              lineStyle: {
                width: 3,
                color: '#3B82F6'
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(59, 130, 246, 0.5)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(59, 130, 246, 0.05)'
                  }
                ])
              },
              symbol: 'circle',
              symbolSize: 8
            }
          ]
        };
        
        myChart.setOption(option);
        window.addEventListener('resize', () => {
          myChart.resize();
        });
        
        return () => {
          myChart.dispose();
          window.removeEventListener('resize', () => {
            myChart.resize();
          });
        };
      }
    }

    if (activeTab === 'home') {
      const casesChartDom = document.getElementById('cases-trend-chart');
      if (casesChartDom) {
        const casesChart = echarts.init(casesChartDom);
        const casesOption = {
          animation: false,
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['Casos Confirmados', 'Hospitalizaciones'],
            textStyle: {
              color: '#fff'
            },
            top: 0
          },
          xAxis: {
            type: 'category',
            data: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
            axisLine: {
              lineStyle: {
                color: '#8392A5'
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#8392A5'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(131, 146, 165, 0.2)'
              }
            }
          },
          series: [
            {
              name: 'Casos Confirmados',
              type: 'bar',
              data: [5200, 6800, 8500, 10200, 12500, 15800, 18200, 20500, 22800, 24567],
              itemStyle: {
                color: '#3B82F6'
              }
            },
            {
              name: 'Hospitalizaciones',
              type: 'bar',
              data: [780, 1020, 1275, 1530, 1875, 2370, 2730, 3075, 3420, 3685],
              itemStyle: {
                color: '#8B5CF6'
              }
            }
          ]
        };
        
        casesChart.setOption(casesOption);
        window.addEventListener('resize', () => {
          casesChart.resize();
        });
        
        return () => {
          casesChart.dispose();
          window.removeEventListener('resize', () => {
            casesChart.resize();
          });
        };
      }

      const distributionChartDom = document.getElementById('distribution-chart');
      if (distributionChartDom) {
        const distributionChart = echarts.init(distributionChartDom);
        const distributionOption = {
          animation: false,
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: ['Arizona', 'California', 'Nevada', 'New Mexico', 'Texas', 'Otros'],
            textStyle: {
              color: '#fff'
            }
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#0F172A',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: 16,
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 8250, name: 'Arizona', itemStyle: { color: '#EF4444' } },
                { value: 5680, name: 'California', itemStyle: { color: '#F59E0B' } },
                { value: 2340, name: 'Nevada', itemStyle: { color: '#10B981' } },
                { value: 3890, name: 'New Mexico', itemStyle: { color: '#3B82F6' } },
                { value: 3120, name: 'Texas', itemStyle: { color: '#8B5CF6' } },
                { value: 1287, name: 'Otros', itemStyle: { color: '#6B7280' } }
              ]
            }
          ]
        };
        
        distributionChart.setOption(distributionOption);
        window.addEventListener('resize', () => {
          distributionChart.resize();
        });
        
        return () => {
          distributionChart.dispose();
          window.removeEventListener('resize', () => {
            distributionChart.resize();
          });
        };
      }
    }
  }, [activeTab, selectedState]);
  
  const states = [
    { name: 'Arizona', risk: 'Alto', cases: 1250, growth: 12.5 },
    { name: 'California', risk: 'Medio', cases: 980, growth: 8.2 },
    { name: 'Nevada', risk: 'Medio', cases: 450, growth: 6.8 },
    { name: 'Nuevo México', risk: 'Alto', cases: 890, growth: 11.3 },
    { name: 'Texas', risk: 'Medio-Alto', cases: 760, growth: 9.5 }
  ];
  
  const handleStateSelect = (state: string) => {
    const stateData = states.find(s => s.name === state);
    if (stateData) {
      setSelectedState(state);
      setRiskLevel(stateData.risk);
      setCasesCount(stateData.cases);
      setGrowthRate(stateData.growth);
      setIsDropdownOpen(false);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('state-dropdown');
      const button = document.getElementById('state-button');
      if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const [selectedYear, setSelectedYear] = useState<string>('2025');
  const [selectedClimate, setSelectedClimate] = useState<string>('Seco');
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">

      
      {/* Tabs */}
      <div className="bg-gray-800 px-8 py-4">
        <div className="container mx-auto">
          <div className="flex space-x-6 border-b border-gray-700">
            <button 
              className={`py-3 px-4 font-medium transition-colors duration-200 !rounded-button cursor-pointer whitespace-nowrap ${activeTab === 'home' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('home')}
            >
              Información General
            </button>
            <button 
              className={`py-3 px-4 font-medium transition-colors duration-200 !rounded-button cursor-pointer whitespace-nowrap ${activeTab === 'prediction' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setActiveTab('prediction')}
            >
              Sistema de Predicción
            </button>
          </div>
        </div>
      </div>
      
      {activeTab === 'home' && (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-8 py-16">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Fiebre del Valle</h1>
                  <p className="text-xl mb-6">Una infección fúngica endémica del suroeste de Estados Unidos causada por el hongo <span className="italic">Coccidioides</span>.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 ease-in-out transform hover:scale-105 !rounded-button cursor-pointer whitespace-nowrap">
                    Conocer más
                  </button>
                </div>
                <div className="md:w-1/2">
                  <img 
                    src="https://readdy.ai/api/search-image?query=A%20microscopic%20view%20of%20Coccidioides%20fungus%20spores%20with%20a%20professional%20medical%20illustration%20style.%20The%20image%20shows%20the%20spherical%20structures%20of%20the%20fungus%20with%20detailed%20cellular%20features%20against%20a%20dark%20blue%20background%2C%20highlighting%20the%20pathogen%20that%20causes%20Valley%20Fever&width=600&height=400&seq=fungus1&orientation=landscape"
                    alt="Coccidioides fungus"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-gray-800 py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Casos Anuales (EE.UU.)</span>
                    <i className="fas fa-users text-blue-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">24,567</div>
                  <div className="text-sm text-green-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>7.8% vs 2023</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Hospitalizaciones</span>
                    <i className="fas fa-hospital text-red-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">3,685</div>
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>+7.7% vs 2023</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Tasa de Mortalidad</span>
                    <i className="fas fa-heartbeat text-yellow-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">1%</div>
                  <div className="text-sm text-yellow-500 flex items-center mt-1">
                    <i className="fas fa-minus mr-1"></i>
                    <span>Sin cambios</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Costo Anual Estimado</span>
                    <i className="fas fa-dollar-sign text-green-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">$392M</div>
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>+12.3% vs 2023</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            {/* About the Disease */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">¿Qué es la Fiebre del Valle?</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <p className="text-lg mb-4">
                      La Fiebre del Valle (coccidioidomicosis) es una infección causada por el hongo <span className="italic">Coccidioides</span> que vive en el suelo de regiones áridas y semiáridas del suroeste de Estados Unidos, partes de México, Centroamérica y Sudamérica.
                    </p>
                    <p className="text-lg mb-4">
                      Se contrae al respirar esporas del hongo que están en el aire, especialmente después de actividades que perturban el suelo como construcción, agricultura o durante tormentas de polvo.
                    </p>
                    <p className="text-lg mb-4">
                      Aproximadamente el 60% de las personas infectadas no desarrollan síntomas. Quienes sí los presentan, suelen experimentar síntomas similares a la gripe que pueden durar semanas o meses.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-blue-400 mb-2">Síntomas comunes</h4>
                        <ul className="space-y-1 text-gray-300">
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Fiebre</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Fatiga</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Tos</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Dolor de cabeza</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Dolor en el pecho</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-blue-500 mt-1.5 mr-2"></i>
                            <span>Dolores musculares</span>
                          </li>
                        </ul>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <h4 className="font-medium text-red-400 mb-2">Complicaciones graves</h4>
                        <ul className="space-y-1 text-gray-300">
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-red-500 mt-1.5 mr-2"></i>
                            <span>Neumonía</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-red-500 mt-1.5 mr-2"></i>
                            <span>Meningitis</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-red-500 mt-1.5 mr-2"></i>
                            <span>Infección diseminada</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-red-500 mt-1.5 mr-2"></i>
                            <span>Lesiones óseas</span>
                          </li>
                          <li className="flex items-start">
                            <i className="fas fa-circle text-xs text-red-500 mt-1.5 mr-2"></i>
                            <span>Lesiones cutáneas</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
                    <h3 className="text-xl font-semibold mb-4">Grupos de Riesgo</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-500 p-2 rounded-full mr-3">
                            <i className="fas fa-user-md text-sm"></i>
                          </div>
                          <h4 className="font-medium">Personas con sistema inmune debilitado</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Incluye pacientes con VIH/SIDA, trasplantados o en tratamiento con inmunosupresores.
                        </p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-500 p-2 rounded-full mr-3">
                            <i className="fas fa-user-friends text-sm"></i>
                          </div>
                          <h4 className="font-medium">Adultos mayores</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Especialmente mayores de 60 años con condiciones médicas preexistentes.
                        </p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-500 p-2 rounded-full mr-3">
                            <i className="fas fa-female text-sm"></i>
                          </div>
                          <h4 className="font-medium">Mujeres embarazadas</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Especialmente en el tercer trimestre y período postparto inmediato.
                        </p>
                      </div>
                      <div className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-500 p-2 rounded-full mr-3">
                            <i className="fas fa-hard-hat text-sm"></i>
                          </div>
                          <h4 className="font-medium">Trabajadores al aire libre</h4>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Construcción, agricultura, arqueología y otras actividades que perturban el suelo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Epidemiology */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Epidemiología</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Tendencia de Casos (2015-2024)</h3>
                  <div id="cases-trend-chart" style={{ height: '400px' }}></div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Distribución por Estados (2024)</h3>
                  <div id="distribution-chart" style={{ height: '400px' }}></div>
                </div>
              </div>
            </div>
            
            {/* Endemic Regions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Regiones Endémicas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img
                      src="https://readdy.ai/api/search-image?query=A%20panoramic%20view%20of%20the%20Arizona%20desert%20landscape%20with%20saguaro%20cacti%2C%20red%20rock%20formations%2C%20and%20arid%20terrain%20under%20a%20clear%20blue%20sky.%20The%20image%20shows%20the%20typical%20environment%20where%20Coccidioides%20fungus%20thrives%2C%20with%20dusty%20soil%20and%20sparse%20vegetation%20characteristic%20of%20the%20American%20Southwest&width=600&height=300&seq=arizona1&orientation=landscape"
                      alt="Desierto de Arizona"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Suroeste de Estados Unidos</h3>
                    <p className="text-gray-300 mb-4">
                      La Fiebre del Valle es endémica en regiones áridas y semiáridas del suroeste de Estados Unidos, particularmente en Arizona y California. El Valle de San Joaquín en California dio nombre a la enfermedad debido a la alta prevalencia en esta región.
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">Estados con mayor incidencia</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-red-500 mr-2"></i>
                          <span>Arizona</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-yellow-500 mr-2"></i>
                          <span>California</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-green-500 mr-2"></i>
                          <span>Nevada</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-blue-500 mr-2"></i>
                          <span>Nuevo México</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-purple-500 mr-2"></i>
                          <span>Texas</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-map-marker-alt text-pink-500 mr-2"></i>
                          <span>Utah</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img
                      src="https://readdy.ai/api/search-image?query=A%20landscape%20view%20of%20northern%20Mexico%20and%20parts%20of%20Central%20America%20showing%20arid%20and%20semi-arid%20regions%20with%20mountains%2C%20valleys%2C%20and%20desert%20terrain.%20The%20image%20depicts%20the%20geographical%20areas%20where%20Valley%20Fever%20is%20endemic%20outside%20the%20United%20States%2C%20with%20similar%20soil%20conditions%20that%20support%20Coccidioides%20fungus%20growth&width=600&height=300&seq=mexico1&orientation=landscape"
                      alt="Regiones áridas de México"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">México y América Latina</h3>
                    <p className="text-gray-300 mb-4">
                      La enfermedad también es endémica en el norte de México y partes de América Central y del Sur. En estas regiones, la enfermedad está subdiagnosticada debido a la limitada capacidad de pruebas diagnósticas y la baja conciencia sobre la enfermedad.
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-400 mb-2">Países con casos reportados</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-red-500 mr-2"></i>
                          <span>México</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-yellow-500 mr-2"></i>
                          <span>Guatemala</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-green-500 mr-2"></i>
                          <span>Honduras</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-blue-500 mr-2"></i>
                          <span>Venezuela</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-purple-500 mr-2"></i>
                          <span>Brasil</span>
                        </div>
                        <div className="flex items-center">
                          <i className="fas fa-globe-americas text-pink-500 mr-2"></i>
                          <span>Argentina</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Prevention */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Prevención y Tratamiento</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-500 p-3 rounded-full mr-4">
                      <i className="fas fa-shield-alt text-xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold">Medidas Preventivas</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-2 mt-0.5 mr-3">
                        <i className="fas fa-mask text-blue-400"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Usar mascarillas protectoras</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          En áreas con mucho polvo o durante tormentas de polvo, use mascarillas N95 que pueden filtrar las pequeñas esporas del hongo.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-2 mt-0.5 mr-3">
                        <i className="fas fa-wind text-blue-400"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Evitar actividades en días ventosos</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          Reduzca el tiempo al aire libre cuando hay mucho viento o durante tormentas de polvo en áreas endémicas.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-2 mt-0.5 mr-3">
                        <i className="fas fa-seedling text-blue-400"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Reducir el polvo alrededor de su hogar</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          Mantenga el suelo húmedo al realizar jardinería, cubra áreas de tierra con plantas o césped, y use mantillo en jardines.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-gray-700 rounded-full p-2 mt-0.5 mr-3">
                        <i className="fas fa-home text-blue-400"></i>
                      </div>
                      <div>
                        <h4 className="font-medium">Sellar su hogar</h4>
                        <p className="text-gray-300 text-sm mt-1">
                          Mantenga puertas y ventanas bien selladas durante condiciones de viento y considere usar purificadores de aire con filtros HEPA.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                  <div className="flex items-center mb-6">
                    <div className="bg-green-500 p-3 rounded-full mr-4">
                      <i className="fas fa-pills text-xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold">Diagnóstico y Tratamiento</h3>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">Métodos de diagnóstico</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <i className="fas fa-vial text-green-500 mt-1 mr-2"></i>
                          <span>Pruebas serológicas (anticuerpos en sangre)</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-microscope text-green-500 mt-1 mr-2"></i>
                          <span>Cultivo de esputo o tejido</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-dna text-green-500 mt-1 mr-2"></i>
                          <span>Pruebas de PCR</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-lungs text-green-500 mt-1 mr-2"></i>
                          <span>Radiografías o tomografías de tórax</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-400 mb-2">Tratamiento</h4>
                      <p className="text-gray-300 mb-3">
                        La mayoría de las personas con síntomas leves se recuperan sin tratamiento específico. Para casos más graves:
                      </p>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start">
                          <i className="fas fa-capsules text-green-500 mt-1 mr-2"></i>
                          <span>Antifúngicos como fluconazol, itraconazol o anfotericina B</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-bed text-green-500 mt-1 mr-2"></i>
                          <span>Hospitalización para casos severos</span>
                        </li>
                        <li className="flex items-start">
                          <i className="fas fa-calendar-alt text-green-500 mt-1 mr-2"></i>
                          <span>Tratamiento prolongado (meses o años) para infecciones diseminadas</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Research */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8">Investigación y Avances</h2>
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-500 p-3 rounded-full mr-4">
                        <i className="fas fa-syringe text-xl"></i>
                      </div>
                      <h4 className="text-lg font-medium">Desarrollo de Vacunas</h4>
                    </div>
                    <p className="text-gray-300 mb-3">
                      Investigadores están trabajando en el desarrollo de vacunas contra la Fiebre del Valle, con varios candidatos en etapas preclínicas y tempranas de ensayos clínicos.
                    </p>
                    <div className="text-sm text-purple-300 mt-4">
                      <span className="font-medium">Estado actual:</span> Fase I/II de ensayos clínicos
                    </div>
                  </div>
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-500 p-3 rounded-full mr-4">
                        <i className="fas fa-flask text-xl"></i>
                      </div>
                      <h4 className="text-lg font-medium">Nuevos Antifúngicos</h4>
                    </div>
                    <p className="text-gray-300 mb-3">
                      Se están investigando nuevos medicamentos antifúngicos con mayor eficacia y menos efectos secundarios para el tratamiento de infecciones graves por <span className="italic">Coccidioides</span>.
                    </p>
                    <div className="text-sm text-purple-300 mt-4">
                      <span className="font-medium">Avance reciente:</span> Identificación de 3 compuestos prometedores
                    </div>
                  </div>
                  <div className="bg-gray-700 p-5 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="bg-purple-500 p-3 rounded-full mr-4">
                        <i className="fas fa-laptop-medical text-xl"></i>
                      </div>
                      <h4 className="text-lg font-medium">Diagnóstico Rápido</h4>
                    </div>
                    <p className="text-gray-300 mb-3">
                      Desarrollo de pruebas de diagnóstico rápido que pueden detectar la infección en etapas tempranas, permitiendo un tratamiento más oportuno y mejores resultados.
                    </p>
                    <div className="text-sm text-purple-300 mt-4">
                      <span className="font-medium">Innovación:</span> Prueba de antígeno con resultados en 15 minutos
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-8 text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Conozca nuestro Sistema de Predicción</h2>
              <p className="text-xl mb-6 max-w-3xl mx-auto">
                Explore nuestra plataforma avanzada de monitoreo y predicción para la Fiebre del Valle, con datos en tiempo real y alertas tempranas.
              </p>
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                onClick={() => setActiveTab('prediction')}
              >
                Ver Sistema de Predicción
              </button>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'prediction' && (
        <>
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-gray-900 to-blue-900 px-8 py-16">
            <div className="container mx-auto">
              <div className="flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 mb-10 md:mb-0">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">Fiebre del Valle: Monitoreo Inteligente</h1>
                  <p className="text-xl mb-6">Sistema avanzado de predicción y alerta temprana para la coccidioidomicosis en zonas endémicas.</p>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 ease-in-out transform hover:scale-105 !rounded-button cursor-pointer whitespace-nowrap">
                    Explorar Datos
                  </button>
                </div>
                <div className="md:w-1/2">

                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="bg-gray-800 py-10">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Casos Totales</span>
                    <i className="fas fa-users text-blue-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">24,567</div>
                  <div className="text-sm text-green-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>12.3% vs 2024</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Nivel de Riesgo</span>
                    <i className="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">Alto</div>
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>+2 niveles</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Estados Afectados</span>
                    <i className="fas fa-map-marker-alt text-red-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">7</div>
                  <div className="text-sm text-yellow-500 flex items-center mt-1">
                    <i className="fas fa-minus mr-1"></i>
                    <span>Sin cambios</span>
                  </div>
                </div>

                <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400">Predicción 2026</span>
                    <i className="fas fa-chart-line text-blue-500 text-xl"></i>
                  </div>
                  <div className="text-3xl font-bold">+18%</div>
                  <div className="text-sm text-red-500 flex items-center mt-1">
                    <i className="fas fa-arrow-up mr-1"></i>
                    <span>vs 2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="container mx-auto px-4 py-12">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Mapa de Riesgo de Fiebre del Valle</h2>
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-xl p-6">
                <div className="relative">
                  <div id="usa-map" style={{ height: '600px' }}></div>
                  <div className="absolute bottom-4 right-4 bg-gray-900 bg-opacity-80 p-3 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">Riesgo Bajo</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">Riesgo Medio</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">Riesgo Alto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              {/* State Selection */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Seleccionar Estado</h3>
                <div className="relative">
                  <button
                    id="state-button"
                    className="w-full bg-gray-700 text-left px-4 py-3 rounded-lg flex justify-between items-center !rounded-button cursor-pointer whitespace-nowrap"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {selectedState}
                    <i className={`fas fa-chevron-down transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`}></i>
                  </button>
                  {isDropdownOpen && (
                    <div
                      id="state-dropdown"
                      className="absolute z-50 w-full mt-2 bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                    >
                      {states.map((state) => (
                        <button
                          key={state.name}
                          className="w-full px-4 py-3 text-left hover:bg-gray-600 transition-colors duration-200 !rounded-button cursor-pointer whitespace-nowrap"
                          onClick={() => handleStateSelect(state.name)}
                        >
                          {state.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <h4 className="text-lg font-medium mb-3">Información General</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nivel de Riesgo:</span>
                      <span className="font-medium text-red-500">{riskLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Casos Estimados (2025):</span>
                      <span className="font-medium">{casesCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tasa de Crecimiento:</span>
                      <span className="font-medium text-red-500">+{growthRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Última Actualización:</span>
                      <span className="font-medium">26/05/2025</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Chart */}
              <div className="bg-gray-800 p-6 rounded-xl shadow-lg lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Proyección Temporal</h3>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <select
                        className="bg-gray-700 text-sm rounded-lg px-3 py-2 border-none !rounded-button cursor-pointer whitespace-nowrap appearance-none pr-8"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                      >
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        className="bg-gray-700 text-sm rounded-lg px-3 py-2 border-none !rounded-button cursor-pointer whitespace-nowrap appearance-none pr-8"
                        value={selectedClimate}
                        onChange={(e) => setSelectedClimate(e.target.value)}
                      >
                        <option value="Seco">Escenario Seco</option>
                        <option value="Lluvioso">Escenario Lluvioso</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                        <i className="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="risk-chart" className="w-full h-64"></div>
              </div>
            </div>
            
            {/* Recommendations */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-12">
              <h3 className="text-2xl font-semibold mb-6">Recomendaciones para Zonas de Alto Riesgo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-700 p-5 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 p-3 rounded-full mr-4">
                      <i className="fas fa-user-md text-xl"></i>
                    </div>
                    <h4 className="text-lg font-medium">Para Profesionales Médicos</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Considerar diagnóstico en pacientes con síntomas respiratorios persistentes</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Solicitar pruebas serológicas específicas para coccidioidomicosis</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Reportar casos confirmados al sistema de vigilancia</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-700 p-5 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 p-3 rounded-full mr-4">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <h4 className="text-lg font-medium">Para la Población General</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Evitar actividades que generan polvo en días ventosos</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Usar mascarillas N95 durante tormentas de polvo</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Buscar atención médica ante síntomas similares a la gripe que persisten</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gray-700 p-5 rounded-lg">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 p-3 rounded-full mr-4">
                      <i className="fas fa-building text-xl"></i>
                    </div>
                    <h4 className="text-lg font-medium">Para Autoridades Locales</h4>
                  </div>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Implementar sistemas de alerta temprana durante condiciones favorables</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Educar a la comunidad sobre síntomas y medidas preventivas</span>
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check-circle text-green-500 mt-1 mr-2"></i>
                      <span>Coordinar con centros médicos para vigilancia activa</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Environmental Factors */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Factores Ambientales Críticos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img
                      src="https://readdy.ai/api/search-image?query=A%20dramatic%20landscape%20photograph%20of%20arid%20desert%20terrain%20in%20Arizona%20with%20cracked%20earth%20and%20sparse%20vegetation%20under%20a%20bright%20blue%20sky.%20The%20image%20shows%20the%20harsh%2C%20dry%20conditions%20that%20promote%20fungal%20growth%20in%20the%20soil%2C%20with%20dust%20particles%20visible%20in%20the%20air&width=600&height=300&seq=desert1&orientation=landscape"
                      alt="Condiciones áridas"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Condiciones Áridas</h3>
                    <p className="text-gray-300 mb-4">
                      El hongo Coccidioides prospera en suelos áridos y secos del suroeste de Estados Unidos. Los períodos prolongados de sequía seguidos de lluvias breves crean condiciones ideales para su crecimiento y dispersión.
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Índice de Aridez Actual:</span>
                        <span className="font-medium text-red-400">{stateData[selectedState]?.aridityLevel || 'N/A'}</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div 
                          className="bg-red-500 h-2.5 rounded-full transition-all duration-500" 
                          style={{ width: `${stateData[selectedState]?.aridityPercentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
                  <div className="h-48 overflow-hidden">
                    <img
                      src="https://readdy.ai/api/search-image?query=A%20powerful%20dust%20storm%20sweeping%20across%20a%20southwestern%20US%20landscape%20with%20swirling%20clouds%20of%20dust%20and%20soil%20particles%20being%20carried%20by%20strong%20winds.%20The%20image%20shows%20how%20fungal%20spores%20can%20be%20transported%20through%20air%20during%20dust%20storms%2C%20with%20dramatic%20lighting%20and%20atmospheric%20conditions&width=600&height=300&seq=dust1&orientation=landscape"
                      alt="Tormentas de polvo"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Tormentas de Polvo</h3>
                    <p className="text-gray-300 mb-4">
                      Las esporas del hongo se transportan a través del aire durante tormentas de polvo, aumentando significativamente el riesgo de exposición e infección en poblaciones cercanas a zonas endémicas.
                    </p>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Predicción de Tormentas (próximos 30 días):</span>
                        <span className="font-medium text-yellow-400">Moderado (5.3/10)</span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2.5">
                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '53%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-xl p-8 text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">¿Trabajas en salud pública o investigación?</h2>
              <p className="text-xl mb-6 max-w-3xl mx-auto">
                Accede a nuestros datos completos, herramientas de predicción avanzadas y API para integrar con tus sistemas.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300 !rounded-button cursor-pointer whitespace-nowrap">
                  Solicitar Acceso Profesional
                </button>
                <button className="bg-transparent border border-white hover:bg-white hover:text-blue-900 text-white px-6 py-3 rounded-lg font-medium transition duration-300 !rounded-button cursor-pointer whitespace-nowrap">
                  Ver Documentación
                </button>
              </div>
            </div>
            
            {/* FAQ Section */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-8 text-center">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-5">
                  <button className="flex justify-between items-center w-full text-left !rounded-button cursor-pointer whitespace-nowrap">
                    <span className="text-lg font-medium">¿Qué es exactamente la Fiebre del Valle?</span>
                    <i className="fas fa-chevron-down text-blue-400"></i>
                  </button>
                  <div className="mt-4">
                    <p className="text-gray-300">
                      La Fiebre del Valle (coccidioidomicosis) es una infección causada por el hongo Coccidioides que vive en el suelo de ciertas regiones. Se contrae al respirar esporas del hongo que están en el aire. Afecta principalmente los pulmones y puede causar síntomas similares a la gripe, aunque algunas personas desarrollan problemas más graves.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-5">
                  <button className="flex justify-between items-center w-full text-left !rounded-button cursor-pointer whitespace-nowrap">
                    <span className="text-lg font-medium">¿Cómo funciona el sistema de predicción?</span>
                    <i className="fas fa-chevron-down text-blue-400"></i>
                  </button>
                  <div className="mt-4">
                    <p className="text-gray-300">
                      Nuestro sistema utiliza modelos de aprendizaje automático entrenados con datos históricos de casos, variables climáticas (temperatura, precipitación, viento), características del suelo y patrones de actividad humana. Estos modelos identifican condiciones favorables para la proliferación del hongo y predicen posibles brotes con semanas de anticipación.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-5">
                  <button className="flex justify-between items-center w-full text-left !rounded-button cursor-pointer whitespace-nowrap">
                    <span className="text-lg font-medium">¿Qué precisión tienen las predicciones?</span>
                    <i className="fas fa-chevron-down text-blue-400"></i>
                  </button>
                  <div className="mt-4">
                    <p className="text-gray-300">
                      Nuestros modelos actuales tienen una precisión del 87% para predicciones a 30 días y del 76% para predicciones a 90 días. La precisión varía según la región y la disponibilidad de datos históricos. Continuamente refinamos nuestros algoritmos con nuevos datos y técnicas de modelado avanzadas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">FungiAlert</h3>
              <p className="text-gray-400">
                Sistema inteligente de alerta temprana para infecciones fúngicas en España y Europa.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Inicio</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Candida auris</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Fiebre del Valle</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">API Documentación</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Publicaciones Científicas</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Datos Abiertos</a></li>
                <li><a href="#" className="hover:text-blue-400 cursor-pointer">Colaboradores</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                  <span>info@fungialert.org</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone mr-2"></i>
                  <span>+34 91 123 45 67</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  <span>Madrid, España</span>
                </li>
              </ul>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 cursor-pointer">
                  <i className="fab fa-github text-xl"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 FungiAlert. Todos los derechos reservados.
            </p>
            <div className="flex space-x-4 text-gray-500 text-sm">
              <a href="#" className="hover:text-blue-400 cursor-pointer">Política de Privacidad</a>
              <a href="#" className="hover:text-blue-400 cursor-pointer">Términos de Servicio</a>
              <a href="#" className="hover:text-blue-400 cursor-pointer">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
