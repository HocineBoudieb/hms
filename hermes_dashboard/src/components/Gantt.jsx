import React, { useState } from 'react';
import { Duration } from 'luxon';

const calculateTotalDuration = (segments) => {
    return segments.reduce((total, segment) => total + (segment.endDate - segment.startDate), 0);
};

const calculateMaxTotalDuration = (orders) => {
    return Math.max(...orders.map(order => {
        const times = order.Time;
        return calculateTotalDuration(
            times.map(time => ({
                startDate: new Date(order.startDate),
                endDate: new Date(new Date(order.startDate).getTime() + time.duration)
            }))
        );
    }));
};

const processData = (orders, maxTotalDuration) => {
    return orders.map(order => {
        // Tri des temps par date de début
        const times = order.Time.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
        let startDate = new Date(order.startDate);

        // Création des segments initiaux à partir des temps
        let segments = times.map(time => {
            const duration = time.duration;
            const endDate = new Date(startDate.getTime() + duration);
            const segment = {
                startDate: new Date(startDate),
                endDate: endDate,
                type: time.enCoursId ? 'En-Attente' : 'Atelier',
                workshopId: time.workshopId,
                enCoursId: time.enCoursId,
                duration: duration,
            };
            startDate = endDate;
            return segment;
        });

        // Fusionner les segments "EnCours" consécutifs
        const mergedSegments = [];
        segments.forEach(seg => {
            const lastSegment = mergedSegments[mergedSegments.length - 1];
            if (lastSegment && seg.type === 'En-Attente' && lastSegment.type === 'En-Attente') {
                // Fusionner en étendant la date de fin et en additionnant la durée
                lastSegment.endDate = seg.endDate;
                lastSegment.duration += seg.duration;
            } else {
                mergedSegments.push(seg);
            }
        });

        // Calcul de la durée totale après fusion (la somme reste la même)
        const totalDuration = calculateTotalDuration(mergedSegments);
        const scaleFactor = (totalDuration / maxTotalDuration) * 100;

        // Calcul du pourcentage d'affichage de chaque segment dans l'ordre
        const segmentsWithPercentage = mergedSegments.map(segment => ({
            ...segment,
            percentage: ((segment.endDate - segment.startDate) / totalDuration) * 100
        }));

        return {
            ...order,
            segments: segmentsWithPercentage,
            scaleFactor: scaleFactor
        };
    });
};

const GanttChart = ({ orders }) => {
    const [hoveredSegment, setHoveredSegment] = useState(null);
    const maxTotalDuration = calculateMaxTotalDuration(orders);
    const processedOrders = processData(orders, maxTotalDuration);

    return (
        <div className="w-full max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Suivi de la performance site</h2>
            {processedOrders.map(order => (
                <div key={order.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
                    <h3 className="font-semibold">Ordre {order.id}</h3>
                    <div
                        className="flex items-center mt-2 h-10 relative bg-gray-200 rounded-md overflow-hidden"
                        style={{ width: `${Math.log10(order.scaleFactor + 1) * 50}%` }}
                    >
                        {order.segments.map((segment, index) => (
                            <div
                                key={index}
                                className={`h-full cursor-pointer border-r border-white ${segment.type === 'En-Attente' ? 'bg-red-400' : 'bg-blue-400'}`}
                                style={{ width: `${segment.percentage}%` }}
                                onMouseEnter={() => setHoveredSegment(segment)}
                                onMouseLeave={() => setHoveredSegment(null)}
                            ></div>
                        ))}
                    </div>
                </div>
            ))}
            {hoveredSegment && (
                <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 p-4 bg-white shadow-lg rounded-lg border">
                    <p><strong>Type :</strong> {hoveredSegment.type}</p>
                    <p><strong>Début :</strong> {hoveredSegment.startDate.toLocaleString()}</p>
                    <p><strong>Fin :</strong> {hoveredSegment.endDate.toLocaleString()}</p>
                    <p>
                        <strong>Durée :</strong>{' '}
                        {Duration.fromMillis(hoveredSegment.duration)
                            .shiftTo('hours')
                            .toFormat("h 'h,' m 'm'")}
                    </p>
                </div>
            )}
        </div>
    );
};

export default GanttChart;
