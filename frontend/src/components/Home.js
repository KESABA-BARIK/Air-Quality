import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';
import './home.css';

const Home = () => {
    const [data, setData] = useState([]);
    const [filteredCity, setFilteredCity] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/cities')
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then((result) => {
                if (Array.isArray(result)) {
        setData(result);
    } else if (result.status === 'success' && Array.isArray(result.data)) {
        setData(result.data);
    }else {
                    setError('Invalid data structure received from the server');
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('Fetch error:', err);
                setError('Failed to fetch data from the server');
                setLoading(false);
            });
    }, []);

    const filteredData = filteredCity
        ? data.filter((item) =>
            item.city.toLowerCase().includes(filteredCity.toLowerCase())
        )
        : data;

    const getAQIStatus = (aqi) => {
        if (aqi > 150) return 'Ugly';
        if (aqi > 100) return 'Bad';
        if (aqi > 50) return 'Moderate';
        return 'Good';
    };

    const cityData = filteredData.map((item) => ({
        city: `${item.city} (${item.station})`,
        aqi: item.aqi,
        status: getAQIStatus(item.aqi),
    }));

    return (
        <div className="home-container">
            <h1>City AQI Overview</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <input
                type="text"
                placeholder="Filter by city..."
                className="filter-input"
                value={filteredCity}
                onChange={(e) => setFilteredCity(e.target.value)}
            />

            {loading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    <h2>AQI Table View</h2>
                    <table className="home-table">
                        <thead>
                            <tr>
                                <th>City</th>
                                <th>Station</th>
                                <th>AQI</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.city}</td>
                                        <td>{item.station}</td>
                                        <td>{item.aqi}</td>
                                        <td>{getAQIStatus(item.aqi)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No data found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <h2>AQI by City</h2>
                    <div className="chart-section">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={cityData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="city" />
                                <YAxis />
                                <Tooltip
                                    content={({ payload }) => {
                                        const { aqi, status } =
                                            payload && payload[0] ? payload[0].payload : {};
                                        return (
                                            <div>
                                                <p>AQI: {aqi}</p>
                                                <p>Status: {status}</p>
                                            </div>
                                        );
                                    }}
                                />
                                <Bar dataKey="aqi" fill="#ff7300" barSize={8} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </>
            )}
        </div>
    );
};

export default Home;
