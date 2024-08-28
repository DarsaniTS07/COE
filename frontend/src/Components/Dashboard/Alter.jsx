import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import "./Alter.css";
// import { Dialog } from "@mui/material";
const Alter = ({ onClose }) => {
  const [name, setName] = useState("");
  const [unique_id, setUnique_id] = useState("");
  const [email_alter, setEmail_alter] = useState("");
  const [date_alter, setDate_alter] = useState("");
  const [session, setSession] = useState("");
  const [venue, setVenue] = useState("");
  const [error, setError] = useState("");
  // const [isAlterOpen,setIsAlterOpen] = useState(false);

  const handleButtonClick = async (e) => {
    e.preventDefault();
    const formData = {
      name,
      unique_id,
      email_alter,
      date_alter,
      session,
      venue
    };
    console.log("Submitting form Data",formData);
    try {
      const res = await axios.post("http://localhost:5000/form", formData);
      console.log("Form submitted", res.data);
      onClose();
    } catch (err) {
      console.error(
        "Error in submitting form",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response
          ? err.response.data.message
          : "An error occurred.Please try again"
      );
    }
  };

  return (
    <>
   
    <div className="model-overlay">
        <div className="model-content">
            {/* <Dialog> */}
            <h2>ALTER SCHEDULE</h2>
    <form onSubmit={handleButtonClick}>
      <table>
        <tbody>
          <tr>
            <td>
              <label>Alter Faculty Name:</label>
            </td>
            <td>
              <input
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <label>Alter Faculty ID:</label>
            </td>
            <td>
              <input
                name="unique_id"
                type="text"
                value={unique_id}
                onChange={(e) => setUnique_id(e.target.value)}
                required
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <label>Alter Faculty Email</label>
            </td>
            <td>
              <input
                name="email_alter"
                type="email"
                value={email_alter}
                onChange={(e) => setEmail_alter(e.target.value)}
                required
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <label>Date:</label>
            </td>
            <td>
              <input
                name="date_alter"
                type="date"
                value={date_alter}
                onChange={(e) => setDate_alter(e.target.value)}
                required
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <label>Session:</label>
            </td>
            <td>
              <input
                name="session"
                type="text"
                value={session}
                onChange={(e) => setSession(e.target.value)}
              ></input>
            </td>
          </tr>
          <tr>
            <td>
              <label>Venue:</label>
            </td>
            <td>
              <input
                name="venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
              ></input>
            </td>
          </tr>
        </tbody>
      </table>
      <button type="submit">Submit</button>
      <button className="close-button" onClick={onClose}>Close</button>
      {error && <p>{error}</p>}
    </form>
    
    {/* </Dialog> */}
    </div>
    </div>
    
    </>
  );

};
Alter.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Alter;
