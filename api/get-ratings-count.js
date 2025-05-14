const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  try {
    // Read the ratings.json file
    const ratingsPath = path.join(__dirname, '..', '/data/ratings.json');
    const data = fs.readFileSync(ratingsPath, 'utf8');
    const ratings = JSON.parse(data);

    // Count the ratings
    const ratingsCount = ratings.length;

    // Return the count
    res.status(200).json({ count: ratingsCount });
  } catch (error) {
    console.error('Error reading ratings file:', error);
    res.status(500).json({ error: 'Error fetching ratings count' });
  }
};
