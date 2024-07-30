import { useState, useEffect } from 'react';
import { getFlights } from '../services/flightService';

const useFlights = () => {
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const data = await getFlights();
                setFlights(data);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchFlights();
    }, []);

    return { flights, loading, error };
};

export default useFlights;
