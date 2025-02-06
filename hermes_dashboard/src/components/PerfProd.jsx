import React, { useEffect, useMemo, useState } from 'react';
import { Duration } from 'luxon';
import axios from 'axios';
import apiUrl from 'api';

const GanttChartByProduct = ({ orders }) => {
  /**
   * Pour chaque produit, on calcule les moyennes de durée par ordre dans :
   * - Chaque en-cours (groupe par time.enCoursId)
   * - Chaque workshop (groupe par time.workshopId)
   */

  const workshopColors = {
    1: 'red-400',
    2: 'green-400',
    3: 'blue-400',
  }
  const productAverages = useMemo(() => {
    const result = {};
    orders.forEach((order) => {
      const productId = order.Product.id;
      if (!result[productId]) {
        result[productId] = { enCours: {}, workshops: {} };
      }

      // --- Regroupement pour les en-cours ---
      const orderEnCoursSums = {};
      order.Time.forEach((time) => {
        if (time.enCoursId) {
          if (!orderEnCoursSums[time.enCoursId]) {
            orderEnCoursSums[time.enCoursId] = 0;
          }
          orderEnCoursSums[time.enCoursId] += time.duration;
        }
      });
      Object.keys(orderEnCoursSums).forEach((enCoursId) => {
        if (!result[productId].enCours[enCoursId]) {
          result[productId].enCours[enCoursId] = { totalDuration: 0, count: 0 };
        }
        result[productId].enCours[enCoursId].totalDuration += orderEnCoursSums[enCoursId];
        result[productId].enCours[enCoursId].count += 1;
      });

      // --- Regroupement pour les workshops ---
      const orderWorkshopSums = {};
      order.Time.forEach((time) => {
        if (time.workshopId) {
          if (!orderWorkshopSums[time.workshopId]) {
            orderWorkshopSums[time.workshopId] = 0;
          }
          orderWorkshopSums[time.workshopId] += time.duration;
        }
      });
      Object.keys(orderWorkshopSums).forEach((workshopId) => {
        if (!result[productId].workshops[workshopId]) {
          result[productId].workshops[workshopId] = { totalDuration: 0, count: 0 };
        }
        result[productId].workshops[workshopId].totalDuration += orderWorkshopSums[workshopId];
        result[productId].workshops[workshopId].count += 1;
      });
    });

    // Calcul de la moyenne pour chaque groupe
    for (const productId in result) {
      for (const enCoursId in result[productId].enCours) {
        const data = result[productId].enCours[enCoursId];
        data.average = data.totalDuration / data.count;
      }
      for (const workshopId in result[productId].workshops) {
        const data = result[productId].workshops[workshopId];
        data.average = data.totalDuration / data.count;
      }
    }
    return result;
  }, [orders]);
  // État pour gérer l'affichage d'une info-bulle lors du hover sur un segment
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const [showEnAttente, setShowEnAttente] = useState(true);
  const [std, setStd] = useState(null)

  // Calcul du maximum global de la somme des moyennes pour pouvoir scaler les segments
  const maxTotalAverage = useMemo(() => {
    let max = 0;
    Object.keys(productAverages).forEach((productId) => {
      const averages = productAverages[productId];
      const totalAverage =
        (showEnAttente ? Object.values(averages.enCours).reduce((acc, d) => acc + d.average, 0) : 0 )+
        Object.values(averages.workshops).reduce((acc, d) => acc + d.average, 0);
      if (totalAverage > max) {
        max = totalAverage;
      }
    });
    return max;
  }, [productAverages,showEnAttente]);

  useEffect(() => {
    const fetchStd = async () => {
        try {
                const res = await axios.get(`${apiUrl}/stdtime`);
                console.log("res:",res.data);
                setStd(res.data);
                
        } catch (error) {
            console.error("Failed to fetch workshop:", error);
        }
    };
    fetchStd();
}, []);

  return (
    <div className="flex flex-col w-3/4 bg-[#f8f8f8] p-8 mt-4 ml-64 overflow-x-hidden">
      <button
        className="bg-orange-200 hover:bg-orange-300 rounded-md px-4 py-2 mb-4 w-1/4"
        onClick={() => setShowEnAttente(!showEnAttente)}
      >
        {showEnAttente ? 'Temps de traversée' : 'Temps de production'}
      </button>
      {Object.entries(productAverages).map(([productId, averages]) => {
        // Récupérer les infos du produit à partir du premier ordre trouvé
        const productOrder = orders.find((o) => o.Product.id.toString() === productId);
        const product = productOrder.Product;

        // Constitution d'un tableau de segments :
        // - D'abord les segments en-cours (nommés "En-Attente")
        // - Puis les segments workshop (nommés "Atelier")
        
          let segments = [
            ...Object.entries(averages.workshops).map(([id, data]) => ({
              type: 'Atelier',
              id,
              average: data.average,
            })),
          ];
          if(showEnAttente){
          segments.push(...Object.entries(averages.enCours).map(([id, data]) => ({
            type: 'En-Attente',
            id,
            average: data.average,
          })))}

        // Tri des segments : on place d'abord les "En-Attente", puis les "Atelier", triés par identifiant
        segments.sort((a, b) => {
          if (a.type === b.type) {
            return parseInt(a.id) - parseInt(b.id);
          }
          return a.type === 'En-Attente' ? -1 : 1;
        });

        // Calcul du temps total pour chaque type
        const totalAtelier = segments
          .filter((seg) => seg.type === 'Atelier')
          .reduce((acc, seg) => acc + seg.average, 0);
        const totalEnAttente = segments
          .filter((seg) => seg.type === 'En-Attente')
          .reduce((acc, seg) => acc + seg.average, 0);

        // Formatage des durées avec Luxon
        const formattedAtelier = Duration.fromMillis(totalAtelier)
          .shiftTo('hours', 'minutes')
          .toFormat("h 'h,' m 'm'");
        const formattedEnAttente = Duration.fromMillis(totalEnAttente)
          .shiftTo('hours', 'minutes')
          .toFormat("h 'h,' m 'm'");

        // Somme totale pour le produit (utilisée pour déterminer si on affiche le graphique)
        const productTotalAverage = segments.reduce((acc, seg) => acc + seg.average, 0);

        return (
          <div key={productId} className="mb-8 flex space-x-4">
            {/* Card récapitulative à gauche */}
            <div className="w-1/3 p-4 border rounded-lg bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">
                {product.material} {product.color} {product.option}
              </h3>
              <p>
                <strong>Temps en atelier :</strong> {formattedAtelier}
              </p>
              <p>
                <strong>Temps d'attente :</strong> {formattedEnAttente}
              </p>
            </div>
            
            
            <div className='flex flex-col w-2/3 p-4'>
            {showEnAttente &&(
              <div className="w-full border p-4 rounded-lg bg-white shadow-md">
                <h3 className="text-xl font-bold mb-2">Temps Standard</h3>
                <div className="flex items-center h-5 relative rounded-md overflow-hidden">
                    <div className='h-full cursor-pointer border-r border-white bg-green-400' style={{ width: `${Math.max(2, (product.stdTraversalTime / maxTotalAverage) * 100)}%` }}></div>
                </div>
              </div>
            )}
            {!showEnAttente && (
              <div className="w-full border p-4 rounded-lg bg-white shadow-md">
              <h3 className="text-xl font-bold mb-2">Temps cibles</h3>
              <div className="flex items-center h-5 relative bg-gray-200 rounded-md overflow-hidden">
                  {//map into product std time, and change color of the div every
                  std.filter((stdtime) => stdtime.productId === product.id).map((stdtime) => (
                    <div className={`h-full cursor-pointer border-r border-white bg-${workshopColors[stdtime.workshopId]}`} style={{ width: `${Math.max(2, (stdtime.value / maxTotalAverage) * 100)}%` }}></div>
                  ))}
              </div>
            </div>
            )}
            
              
            {/* Card du produit et graphique à droite */}
              <div className="w-full border p-4 rounded-lg bg-white shadow-md">

              <h3 className="text-xl font-bold mb-2">Temps Produit</h3>
                {productTotalAverage > 0 ? (
                  <div className="flex items-center h-10 relative bg-gray-200 rounded-md overflow-hidden">
                    {segments.map((seg, index) => ((
                      <div
                        key={index}
                        className={`h-full cursor-pointer border-r border-white ${
                          seg.type === 'En-Attente' ? 'bg-orange-400' : `bg-${workshopColors[seg.id]}`
                        }`}
                        style={{ width: `${Math.max(2, (seg.average / maxTotalAverage) * 100)}%` }}
                        onMouseEnter={() =>
                          setHoveredInfo({
                            type: seg.type,
                            id: seg.id,
                            average: seg.average,
                          })
                        }
                        onMouseLeave={() => setHoveredInfo(null)}
                      ></div>)
                    ))}
                  </div>
                ) : (
                  <p className="italic text-sm">Aucune donnée pour ce produit.</p>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {hoveredInfo && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 bg-white shadow-lg rounded-lg border">
          <p>
            <strong>Type :</strong> {hoveredInfo.type}
          </p>
          <p>
            <strong>ID :</strong> {hoveredInfo.id}
          </p>
          <p>
            <strong>Durée moyenne :</strong>{' '}
            {Duration.fromMillis(hoveredInfo.average)
              .shiftTo('hours', 'minutes')
              .toFormat("h 'h,' m 'm'")}
          </p>
        </div>
      )}
    </div>
  );
};

export default GanttChartByProduct;
