import { connection as db } from "../config/dbConfig.js";

const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}



export const addSchoolController = async (req, res) => {
    const { name, address, latitude, longitude } = req.body;

  // Input validation
  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  // SQL query for inserting the school
  const sql = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';

  try {
    // Perform the database query using a promise-based approach
    const [results] = await db.promise().query(sql, [name, address, latitude, longitude]);

    // Return success response
    res.status(201).json({ message: 'School added successfully!', schoolId: results.insertId });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error inserting school.', error: err.message });
  }
};




export const listSchoolsController = async (req, res) => {
    const { userLatitude, userLongitude } = req.query;

  // Validation for latitude and longitude
  if (!userLatitude || !userLongitude) {
    return res.status(400).json({ message: 'User latitude and longitude are required.' });
  }

  // SQL query to fetch all schools
  const sql = 'SELECT * FROM schools';

  try {
    // Fetch all schools from the database
    const [results] = await db.promise().query(sql);

    // Calculate distance from user's location for each school
    results.forEach(school => {
      school.distance = calculateDistance(userLatitude, userLongitude, school.latitude, school.longitude);
    });

    // Sort the schools by distance
    results.sort((a, b) => a.distance - b.distance);

    // Send the sorted list of schools as the response
    res.status(200).json(results);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error fetching schools.', error: err.message });
  }
};