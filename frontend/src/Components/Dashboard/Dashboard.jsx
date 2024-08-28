import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import Alter from './Alter';
import './Dashboard.css';

const Dashboard = () => {
    const [isAlterOpen, setIsAlterOpen] = useState(false);
    const [error, setError] = useState('');
    const [userData, setUserData] = useState([]); 
    const [allData, setAllData] = useState([]); 
    const [userEmail, setUserEmail] = useState(''); 
    const [receiverId, setReceiverId] = useState(null); 
    const [isSender, setIsSender] = useState(true);

    const fetchUserData = useCallback(async () => {
        try {
            if (userEmail) {
                const response = await axios.get(`http://localhost:5000/requests/${userEmail}`);
                setUserData(response.data);
            }
        } catch (err) {
            console.error('Error fetching user data', err);
            setError('Error fetching user data');
        }
    }, [userEmail]);
    console.log(userEmail); 

    const fetchAllData = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:5000/form_add');
            setAllData(response.data);
        } catch (err) {
            console.error('Error fetching all data', err);
            setError('Error fetching all data');
        }
    }, []);

    useEffect(() => {
        fetchUserData();
        fetchAllData();
        const intervalId = setInterval(() => {
            fetchUserData();
            fetchAllData();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [fetchUserData, fetchAllData]);

    const handleOpenAlter = () => {
        if (userEmail) {
            fetchReceiverId(userEmail);
        }
        setIsAlterOpen(true);
    };

    const handleCloseAlter = () => {
        setIsAlterOpen(false);
    };

    const fetchReceiverId = async (email) => {
        try {
            const encodedEmail = encodeURIComponent(email); // Encode the email to handle special characters
            const response = await axios.get(`http://localhost:5000/receiver_id/${encodedEmail}`);
            console.log('Response data:', response.data); // Debugging line
            setReceiverId(response.data.receiver_id);
        } catch (err) {
            console.error('Error fetching receiver ID:', err.response ? err.response.data : err.message);
            setError('Error fetching receiver ID');
        }
    };
    const handleUpdateStatus = async (formId, status) => {
        try {
            await axios.post('http://localhost:5000/form/update', {
                formId,
                status
            });
            fetchUserData();
            fetchAllData();
        } catch (err) {
            console.error('Error updating form status', err);
        }
    };

    return (
        <div className='dashboard'>
            <h1>Dashboard</h1>

            <button onClick={handleOpenAlter}>Alter Schedule</button>
            {isAlterOpen && (
                <Alter onClose={handleCloseAlter} receiverId={receiverId} />
            )}

            {!isSender && (
                <div className='data-container'>
                    {userData.length > 0 ? (
                        userData.map((item, index) => (
                            <div key={index} className='data-card'>
                                <p>Requested Faculty: {item.name}</p>
                                <p>Faculty ID: {item.unique_id}</p>
                                <p>Faculty Email: {item.email_alter}</p>
                                <p>Date: {(new Date(item.date_alter)).toLocaleDateString()}</p>
                                <p>Session: {item.session}</p>
                                <p>Venue: {item.venue}</p>
                                <p>Status: {item.status}</p>

                                {item.status === 'pending' && (
                                    <div className="action-buttons">
                                        <button onClick={() => handleUpdateStatus(item.id, 'accepted')}>Accept</button>
                                        <button onClick={() => handleUpdateStatus(item.id, 'declined')}>Decline</button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>{error ? error : 'No user data available'}</p>
                    )}
                </div>
            )}

            {isSender && (
                <div className='data-container'>
                    {allData.length > 0 ? (
                        allData.map((item, index) => (
                            <div key={index} className='data-card'>
                                <p>Requested Faculty: {item.name}</p>
                                <p>Faculty ID: {item.unique_id}</p>
                                <p>Faculty Email: {item.email_alter}</p>
                                <p>Date: {(new Date(item.date_alter)).toLocaleDateString()}</p>
                                <p>Session: {item.session}</p>
                                <p>Venue: {item.venue}</p>
                                <p>Status: {item.status}</p>
                            </div>
                        ))
                    ) : (
                        <p>{error ? error : 'No form data available'}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
