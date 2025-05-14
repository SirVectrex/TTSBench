const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../db.json')));
  const result = {};

  for (const { file, rating } of db.ratings) {
    if (!result[file]) result[file] = { count: 0, total: 0 };
    result[file].count++;
    result[file].total += parseInt(rating);
  }

  const leaderboard = Object.entries(result)
    .map(([file, { count, total }]) => ({
      file,
      count,
      avg: (total / count).toFixed(2)
    }))
    .sort((a, b) => b.avg - a.avg);

  res.json(leaderboard);
};
