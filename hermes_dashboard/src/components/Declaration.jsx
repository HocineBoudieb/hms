import React, { useState, useEffect } from "react";
import axios from "axios";
import apiUrl from '../api';
import classNames from "classnames";

const Declaration = ({ nfcData, orderData, onClose, workshopId }) => {
    const [selectedActivity, setSelectedActivity] = useState("");
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`${apiUrl}/workshops/${workshopId}/activities`);
                setActivities(response.data);
            } catch (error) {
                console.error("Failed to fetch activities:", error);
            }
        };

        fetchActivities();
    }, [workshopId]);

    const handleTakeCharge = async () => {
        if (!selectedActivity) {
            setError("Veuillez sélectionner une activité avant de prendre en charge.");
            return;
        }
        try {
            console.log("nfc data", nfcData);
            console.log("order Data", orderData);
            // Envoi de la requête pour déclarer la prise en charge
            await axios.post(apiUrl + "/supports", {
                orderId: orderData.id,
                nfcTag: nfcData.nfcId,
                activity: selectedActivity,
            });
            onClose(); // Ferme la modale après le succès
        } catch (err) {
            console.error("Erreur lors de la prise en charge :", err);
            setError("Une erreur est survenue. Veuillez réessayer.");
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center z-10">
            <div className="bg-white w-1/2 p-8 rounded-lg shadow-lg relative">
                <h2 className="text-3xl font-bold mb-4 uppercase text-center">Prise en Charge</h2>

                <hr className="my-6 w-full" />
                <div className="mb-4 text-xl uppercase space-y-2">
                    <p>
                        <strong>Badge Scanné :</strong> {nfcData.artisan}
                    </p>
                    <p>
                        <strong>Ordre de Fabrication :</strong> {orderData.id} - {orderData.Product.material} {orderData.Product.color} {orderData.Product.option}
                        {orderData.product}
                    </p>
                </div>
                <hr className="my-6 w-full" />
                <div className="mb-4">
                    <label htmlFor="activity" className="block text-2xl font-medium text-black uppercase text-center mb-4">
                        Sélectionner une activité
                    </label>

                    <div className="grid grid-cols-2 gap-6 justify-between w-full">
                        {activities.map((activity) => (
                            <>
                                <div
                                    key={activity.id}
                                    className={classNames("flex items-center justify-center bg-gray-200 p-4 rounded-lg  h-36 text-center",
                                        { "bg-orange-500 text-white": selectedActivity === activity.id }
                                    )}
                                    onClick={() => setSelectedActivity(activity.id)}
                                >
                                    <span className="text-3xl font-bold uppercase">{activity.name}</span>
                                </div>
                            </>
                        ))}
                    </div>
                </div>
                <hr className="my-6 w-full" />

                <div>
                    {selectedActivity && (
                        <p className="my-4 text-lg font-bold text-[#ff0000] text-center uppercase">
                            <span>Enlever le chevalet avant de déclarer</span>{console.log(selectedActivity)}
                        </p>
                    )}

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                </div>



                {/* <div className="flex justify-end">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white text-xl font-bold mt-4 py-4 px-4 rounded"
                        onClick={handleTakeCharge}
                    >
                        Prendre en charge
                    </button>
                </div> */}

                <div className="flex flex-row gap-4 justify-between mt-4">
                    <button
                        className="bg-gray-200 font-bold py-2 text-2xl px-4 rounded-lg h-18 w-1/2 uppercase"
                        onClick={onClose}
                    >
                        Annuler
                    </button>

                    <button
                        className="bg-black  text-white text-2xl font-bold py-2 px-4 rounded-lg h-18 w-1/2 uppercase"
                        onClick={handleTakeCharge}
                    >
                        Déclarer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Declaration;
