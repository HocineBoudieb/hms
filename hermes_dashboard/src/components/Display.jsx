import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageWS from '../assets/workshop.png';
import ImageEC from '../assets/encours.png';

const Display = () => {
    const [workshops, setWorkshops] = useState([]);
    const [encours, setEncours] = useState([]);

    // Fetch workshops
    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get('http://localhost:8081/workshops');
                setWorkshops(response.data);
            } catch (error) {
                console.error('Failed to fetch workshops:', error);
            }
        };

        fetchWorkshops();
    }, []);

    // Fetch encours
    useEffect(() => {
        const fetchEncours = async () => {
            try {
                const response = await axios.get('http://localhost:8081/encours');
                setEncours(response.data);
            } catch (error) {
                console.error('Failed to fetch encours:', error);
            }
        };

        fetchEncours();
    }, []);

    return (
        <div className="flex flex-wrap justify-evenly items-center w-11/12 mx-auto bg-white p-4 mb-8 mt-8 gap-4 rounded-lg ">
            {workshops.map((workshop) => {
                // Trouver l'encours correspondant
                const encoursItem = encours.find((item) => item.id === workshop.EnCours.id);

                return (
                    <div className='flex flex-col items-center w-1/3'>
                        <p className="text-1xl first-letter:text-2xl font-thin tracking-[0.1em] ml-8">{workshop.name}</p>
                        <div key={workshop.id} className="relative w-full flex flex-row items-center">
                            {/* Première image (EnCours) */}
                            <div className="relative w-full">
                                <img src={ImageEC} alt={`En Cours ${workshop.EnCours.name}`} className="w-full rounded-lg" />
                                {encoursItem && (
                                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-base font-bold px-4 py-3 rounded-full shadow-lg" onClick={() => console.log(encoursItem)}>
                                        {encoursItem.Rfid.length}
                                    </div>
                                )}
                            </div>

                            {/* Deuxième image (Workshop) */}
                            <div className="relative w-full mt-4">
                                <img src={ImageWS} alt={`Workshop ${workshop.name}`} className="w-full rounded-lg" />
                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-base font-bold px-4 py-3 rounded-full shadow-lg">
                                    {workshop.Rfid.length}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Display;
