import React, { useMemo, useState } from 'react';
import { Duration } from 'luxon';
import { max } from 'date-fns';

const GanttChartByProduct = ({ orders }) => {
  /**
   * Pour chaque produit, on calcule les moyennes de durée par ordre dans :
   * - Chaque en-cours (groupe par time.enCoursId)
   * - Chaque workshop (groupe par time.workshopId)
   */
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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">
        Gantt Chart par Produit (En-Cours et Workshop en Séquence)
      </h2>
      {Object.entries(productAverages).map(([productId, averages]) => {
        // Pour afficher les informations du produit, on récupère le premier ordre correspondant
        const productOrder = orders.find((o) => o.Product.id.toString() === productId);
        const product = productOrder.Product;

        // Constitution d'un tableau de segments :
        // - D'abord les segments en-cours
        // - Puis les segments workshop
        let segments = [
          ...Object.entries(averages.enCours).map(([id, data]) => ({
            type: 'En-Cours',
            id,
            average: data.average,
          })),
          ...Object.entries(averages.workshops).map(([id, data]) => ({
            type: 'Workshop',
            id,
            average: data.average,
          })),
        ];

        // Tri optionnel : ici on place d'abord les en-cours, puis les workshops (triés par identifiant)
        segments.sort((a, b) => {
          if (a.type === b.type) {
            return parseInt(a.id) - parseInt(b.id);
          }
          return a.type === 'En-Cours' ? -1 : 1;
        });

        // Calcul de la durée moyenne totale pour le produit (somme de toutes les moyennes)
        const totalAverage = segments.reduce((acc, seg) => acc + seg.average, 0);

        return (
          <div key={productId} className="mb-8 border p-4 rounded-lg bg-gray-50">
            <h3 className="text-xl font-bold mb-2">
              Produit : {product.material} {product.color} {product.option}
            </h3>
            {totalAverage > 0 ? (
              <div className="flex items-center h-10 relative bg-gray-200 rounded-md overflow-hidden">
                {segments.map((seg, index) => (
                  <div
                    key={index}
                    className={`h-full cursor-pointer border-r border-white ${
                      seg.type === 'En-Cours' ? 'bg-red-400' : 'bg-blue-400'
                    }`}
                    style={{ width: `${Math.max(2, (seg.average / totalAverage) * 100)}%` }}
                    onMouseEnter={() =>
                      setHoveredInfo({
                        type: seg.type,
                        id: seg.id,
                        average: seg.average,
                      })
                    }
                    onMouseLeave={() => setHoveredInfo(null)}
                  ></div>
                ))}
              </div>
            ) : (
              <p className="italic text-sm">Aucune donnée pour ce produit.</p>
            )}
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
