import React, { useState } from "react";
import "./ConfigurationForm.css";
import { motion } from "framer-motion";
import axios from "axios";

const container = (delay) => ({
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: delay },
  },
});

const ConfigurationForm = () => {
  const [formData, setFormData] = useState({
    totalTickets: "",
    ticketReleaseRate: "",
    customerRetrievalRate: "",
    maxTicketCapacity: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleUpdate = async () => {
    const {
      totalTickets,
      ticketReleaseRate,
      customerRetrievalRate,
      maxTicketCapacity,
    } = formData;

    if (
      !totalTickets ||
      !ticketReleaseRate ||
      !customerRetrievalRate ||
      !maxTicketCapacity
    ) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    try {
      const response = await axios.post("https://test-backend-production-e391.up.railway.app/api/config", {
        totalTickets: parseInt(totalTickets),
        ticketReleaseRate: parseInt(ticketReleaseRate),
        customerRetrievalRate: parseInt(customerRetrievalRate),
        maxTicketCapacity: parseInt(maxTicketCapacity),
      });

      setMessage({ type: "success", text: response.data });
    } catch (error) {
      const errorText =
        error.response?.data || "Failed to update configuration.";
      setMessage({ type: "error", text: errorText });
    }
  };

  const handleCheckConfig = async () => {
    try {
      const response = await axios.get("https://test-backend-production-e391.up.railway.app/api/config");
      const config = response.data;
      
      // Format the config into a readable string
      const configString = Object.entries(config)
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");
      
      setMessage({
        type: "success",
        text: `Current Configuration: \n${configString}`,
      });
      
      alert(`Current Configuration:\n${configString}`);
    } catch (error) {
      const errorText =
        error.response?.data || "Failed to fetch configuration.";
      setMessage({ type: "error", text: errorText });
    }
  };

  return (
    <motion.div
      variants={container(0.3)}
      initial="hidden"
      animate="visible"
      className="form-container"
    >
      <h2>Create Configuration</h2>
      <form>
        <div className="form-group">
          <label htmlFor="totalTickets">Total Tickets</label>
          <input
            type="number"
            id="totalTickets"
            value={formData.totalTickets}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
        </div>

        <div className="form-group">
          <label htmlFor="ticketReleaseRate">Ticket Release Rate</label>
          <input
            type="number"
            id="ticketReleaseRate"
            value={formData.ticketReleaseRate}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerRetrievalRate">Customer Retrieval Rate</label>
          <input
            type="number"
            id="customerRetrievalRate"
            value={formData.customerRetrievalRate}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
        </div>

        <div className="form-group">
          <label htmlFor="maxTicketCapacity">Max Ticket Capacity</label>
          <input
            type="number"
            id="maxTicketCapacity"
            value={formData.maxTicketCapacity}
            onChange={handleInputChange}
            placeholder="Enter a value"
          />
        </div>

        {message.text && (
          <p
            className={
              message.type === "error" ? "error-message" : "success-message"
            }
          >
            {message.text}
          </p>
        )}

        <div className="form-buttons">
          <button
            type="button"
            className="update-button"
            onClick={handleUpdate}
          >
            Update Configuration
          </button>
          <button
            type="button"
            className="get-button"
            onClick={handleCheckConfig}
          >
            Check Configuration
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ConfigurationForm;
