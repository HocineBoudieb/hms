import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Workshop = () => {
    const { workshopId: id } = useParams();
    const [workshop, setWorkshop] = useState(null);
    const [encours, setEncours] = useState(null);

    useEffect(() => {
        const fetchWorkshop = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/workshops/${id}`);
                setWorkshop(response.data);
            } catch (error) {
                console.error("Failed to fetch workshop:", error);
            }
        };
        fetchWorkshop();
    }, [id]);

    useEffect(() => {
        if (!workshop) {
            return;
        }
        const fetchEncours = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/encours/${workshop.enCoursId}`);
                setEncours(response.data);
            } catch (error) {
                console.error('Failed to fetch encours:', error);
            }
        }
        
        fetchEncours();
    }, [workshop]);

    if (!workshop || !encours) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col w-full bg-[#f8f8f8] p-8">
            <h1 className="text-4xl font-bold text-center mb-8">{workshop.name}</h1>
            <div className="flex flex-row w-full">
                <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Workshop Orders</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Map over workshop orders */}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col h-full w-1/2 bg-white shadow p-8 m-4 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-4">Encours Orders</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identifiant</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produit</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Support</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {/* Map over encours orders */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Workshop;
