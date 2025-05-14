const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const type = req.query.type;  // Get the type from the query string (monologue/conversational)
  
  if (!type || (type !== 'monologue' && type !== 'conversational')) {
    return res.status(400).json({ error: 'Invalid audio type' });
  }

  const folderPath = path.join(__dirname, `../public/audio/${type}`);
  
  // Ensure the folder exists
  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ error: 'Audio folder not found' });
  }

  const files = fs.readdirSync(folderPath);
  const chosen = files[Math.floor(Math.random() * files.length)];
  
  return res.json({ filename: `${type}/${chosen}` });
};
