import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
    const [reports, setReports] = useState([]);
    const [email, setEmail] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedEmail = localStorage.getItem("adminEmail");
        console.log("Retrieved email from localStorage:", storedEmail);
        setEmail(storedEmail);
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            if (!email) {
                console.log("Email not available, skipping fetch");
                setIsLoading(false);
                return;
            }
            
            try {
                console.log("Fetching reports for email:", email);
                setIsLoading(true);
                setError(null);
                
                const response = await axios.get(
                    `http://localhost:5000/api/admin/reports?email=${email}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            // Add authentication headers if needed
                            // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                );
                
                console.log("API Response:", response);
                setReports(response.data);
            } catch (error) {
                console.error("Failed to fetch reports", error);
                setError("Failed to load reports. Please try again later.");
                setReports([]); // Clear any previous data
            } finally {
                setIsLoading(false);
            }
        };

        fetchReports();
    }, [email]);

    return (
        <div style={{ padding: "2rem" }}>
            <div className="report-form">
                <h3>Admin: {email || "Not Logged In"}</h3>
                <h2>City Reports</h2>
                
                {isLoading ? (
                    <p>Loading reports...</p>
                ) : error ? (
                    <p style={{ color: "red" }}>{error}</p>
                ) : reports.length === 0 ? (
                    <p>No reports available.</p>
                ) : (
                    reports.map((report, index) => (
                        <div 
                            key={report.reportId || index} 
                            style={{ 
                                border: "1px solid gray", 
                                padding: "1rem", 
                                marginBottom: "1rem",
                                borderRadius: "5px"
                            }}
                        >
                            <p><strong>Report ID:</strong> {report.reportId}</p>
                            <p><strong>Location:</strong> {report.location}</p>
                            <p><strong>Description:</strong> {report.description}</p>
                            <p><strong>Created At:</strong> {new Date(report.createdAt).toLocaleString()}</p>
                            <p>
                                <strong>Alert:</strong> 🚨{" "}
                                {report.description.toLowerCase().includes("pollution") 
                                    ? "High Pollution Alert!" 
                                    : "General Alert"}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;