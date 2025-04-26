import React, { useState } from "react";
import axios from "axios";
import "./UserReportForm.css"; // Import the CSS file

const UserReportForm = () => {
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("Delhi");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle the description change
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    // Handle the location change
    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitting(true);

        const reportData = {
            description: description,
            location: location,
        };

        try {
            // Make the POST request to submit the report
            const response = await axios.post("http://localhost:5000/api/userreports", reportData);
            if (response.status === 201) {
                setMessage("Report submitted successfully! Thank you for your contribution.");
                setDescription(""); // Clear description
                setLocation("Delhi"); // Reset location to default
            }
        } catch (error) {
            setMessage("Error submitting report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-form">
            <h2>Submit Air Quality Report</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="description">What did you observe?</label>
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        placeholder="Describe the air quality issues you've noticed (e.g., smoke, unusual smell, breathing difficulties, etc.)"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="location">Location:</label>
                    <select
                        id="location"
                        name="location"
                        value={location}
                        onChange={handleLocationChange}
                        required
                    >
                        <option value="Delhi">Delhi</option>
                        <option value="Pondicherry">Pondicherry</option>
                        <option value="Chennai">Chennai</option>
                    </select>
                </div>

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
            </form>

            {message && <p className={message.includes("successfully") ? "success-message" : "error-message"}>{message}</p>}
        </div>
    );
};

export default UserReportForm;