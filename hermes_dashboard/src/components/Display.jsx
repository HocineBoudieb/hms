import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ImageWS from '../assets/workshop.png';
import ImageEC from '../assets/encours.png';
import ImageQC from '../assets/quality.png';
import ModalTable from './ModalTable';
import apiUrl from '../api';


const Display = () => {
    const [workshops, setWorkshops] = useState([]);
    const [encours, setEncours] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState([]);//Orders

    // Fetch workshops
    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const response = await axios.get(apiUrl+'/workshops');
                setWorkshops(response.data);
            } catch (error) {
                console.error('Failed to fetch workshops:', error);
            }
        };

        fetchWorkshops();

        //fetch every 2 seconds
        const interval = setInterval(fetchWorkshops, 2000);


        //clear Timer when component unmount
        return () => clearInterval(interval);
    }, []);

    // Fetch encours
    useEffect(() => {
        const fetchEncours = async () => {
            try {
                const response = await axios.get(apiUrl+'/encours');
                setEncours(response.data);
            } catch (error) {
                console.error('Failed to fetch encours:', error);
            }
        };

        fetchEncours();

        //fetch every 2 seconds
        const interval = setInterval(fetchEncours, 2000);
        //clear Timer when component unmount
        return () => clearInterval(interval);

    }, [encours]);

    const handleClick = async (item) => {
        try {
            // Determine if the item is a workshop or an encours
            const isWorkshop = item.hasOwnProperty('name');
            let response;

            if (isWorkshop) {
                // Fetch orders for the workshop
                response = await axios.get(apiUrl+`/workshops/${item.id}/orders`);
            } else {
                // Fetch orders for the encours
                response = await axios.get(`${apiUrl}/encours/${item.id}/orders`);
            }

            // Update modal data and display the modal
            setModalData(response.data);
            setIsModalVisible(true);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    };

    return (
        <div className="flex flex-wrap justify-evenly items-center w-11/12 mx-auto bg-white p-4 mb-8 mt-8 gap-4 rounded-lg ">
            {workshops.map((workshop) => {
                // Find the corresponding encours
                const encoursItem = encours.find((item) => item.id === workshop.EnCours.id);

                return (
                    <div className="flex flex-col items-center w-1/5" key={workshop.id}>
                        <p className="text-1xl first-letter:text-2xl font-thin tracking-[0.1em] ml-8">{workshop.name}</p>
                        <div className="relative w-full flex flex-row items-center">
                            {/* First Image (EnCours) */}
                            <div className="relative w-full">
                                <img src={ImageEC} alt={`En Cours ${workshop.EnCours.name}`} className="w-full rounded-lg" />
                                {encoursItem && (
                                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-base font-bold px-4 py-3 rounded-full shadow-lg" onClick={() => handleClick(encoursItem)}>
                                        {encoursItem.Order.length}
                                    </div>
                                )}
                            </div>

                            {/* Second Image (Workshop) */}
                            <div className="relative w-full mt-4">
                                <img src={ImageWS} alt={`Workshop ${workshop.name}`} className="w-full rounded-lg" />
                                <div className="absolute top-2 right-2 bg-orange-500 text-white text-base font-bold px-4 py-3 rounded-full shadow-lg" onClick={() => handleClick(workshop)}>
                                    {workshop.Order.length}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
            {/*Last encours*/}
            <div className="flex flex-col items-center w-1/6">
                <p className="text-1xl first-letter:text-2xl font-thin tracking-[0.1em] ml-8">Qualité</p>
                <div className="relative w-full flex flex-row items-center">
                    {/* First Image (EnCours) */}
                    <div className="relative w-full">
                        <img src={ImageQC} alt={`En Cours`} className="w-full rounded-lg" />
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-base font-bold px-4 py-3 rounded-full shadow-lg" onClick={() => handleClick(encours.find((item) => item.id ===7))}>
                            {encours.find((item) => item.id === 7)?.Order.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <ModalTable isModalVisible={isModalVisible} modalData={modalData} setIsModalVisible={setIsModalVisible} />
        </div>
    );
};

export default Display;
