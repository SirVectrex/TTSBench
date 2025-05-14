const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
  const metadataPath = path.join(__dirname, '..', '/data/audio_metadata.json');
  const ratingsPath = path.join(__dirname, '..', '/data/ratings.json');

  const metadata = JSON.parse(fs.readFileSync(metadataPath));
  const ratings = JSON.parse(fs.readFileSync(ratingsPath));

  const modelStats = {};

  ratings.forEach(({ file, rating, isHuman }) => {
    const info = metadata[file];
    if (!info || info.style !== 'conversational') return;

    const { model, label } = info;
    if (!modelStats[model]) {
      modelStats[model] = { ratings: [], correct: 0, total: 0 };
    }

    modelStats[model].ratings.push(Number(rating));
    if (label === isHuman) modelStats[model].correct++;
    modelStats[model].total++;
  });

  const leaderboard = Object.entries(modelStats).map(([model, stats]) => ({
    model,
    avgRating: (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2),
    correctness: ((stats.correct / stats.total) * 100).toFixed(1) + '%',
    totalVotes: stats.total
  }));

  res.status(200).json(leaderboard);
};
