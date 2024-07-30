import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import useFlight from '../hooks/useFlights';
import { getFlights } from '../services/flightService'; // Ensure this service function is implemented

const Homepage = () => {
  const { user, loading: authLoading } = useAuth();
  const { flights, loading: flightsLoading, error } = useFlight();
  const [flightList, setFlightList] = useState([]);

  useEffect(() => {
    if (!authLoading && user) {
      const fetchFlights = async () => {
        try {
          const data = await getFlights();
          setFlightList(data);
        } catch (err) {
          console.error('Error fetching flights:', err);
        }
      };

      fetchFlights();
    }
  }, [authLoading, user]);

  if (authLoading || flightsLoading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Please log in to view your flight details.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user.full_name}!</h1>
      <p className="mb-4">Here are your flight details:</p>

      {error && <div className="text-red-500 mb-4">Error fetching flights: {error}</div>}

      {flightList.length === 0 ? (
        <div>No flights found.</div>
      ) : (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Flight Number</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Departure</th>
              <th className="py-2 px-4 border-b">Arrival</th>
              <th className="py-2 px-4 border-b">Origin</th>
              <th className="py-2 px-4 border-b">Destination</th>
            </tr>
          </thead>
          <tbody>
            {flightList.map((flight) => (
              <tr key={flight._id}>
                <td className="py-2 px-4 border-b">{flight.flight_number}</td>
                <td className="py-2 px-4 border-b">{flight.status}</td>
                <td className="py-2 px-4 border-b">{flight.departure}</td>
                <td className="py-2 px-4 border-b">{flight.arrival}</td>
                <td className="py-2 px-4 border-b">{flight.origin}</td>
                <td className="py-2 px-4 border-b">{flight.destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Homepage;
