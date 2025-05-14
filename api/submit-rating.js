const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    const { file, rating, isHuman, type } = req.body;

    if (!file || !rating || !isHuman || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Prepare the data to save
    const ratingData = {
      file,
      rating,
      isHuman,
      type,
      timestamp: new Date().toISOString(),
    };

    // Path to the JSON file where ratings will be saved
    const ratingsFilePath = path.join(__dirname, '../data/ratings.json');

    // Read existing ratings (if any)
    let existingRatings = [];
    try {
      const data = fs.readFileSync(ratingsFilePath, 'utf8');
      existingRatings = JSON.parse(data);
    } catch (err) {
      console.error('Error reading ratings file:', err);
    }

    // Add the new rating to the existing ones
    existingRatings.push(ratingData);

    // Save updated ratings back to the file
    try {
      fs.writeFileSync(ratingsFilePath, JSON.stringify(existingRatings, null, 2));
      console.log('Rating saved:', ratingData);
      return res.status(200).json({ message: 'Rating submitted successfully' });
    } catch (err) {
      console.error('Error saving ratings file:', err);
      return res.status(500).json({ error: 'Failed to save rating' });
    }
  } else {
    // If the request method is not POST
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
};
