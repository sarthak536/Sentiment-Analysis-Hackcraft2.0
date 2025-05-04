// import React, { useEffect, useState } from 'react';
// import watchImage from '../assets/watch.jpg';

// const watch = () => {
//   const [watchInfo, setwatchInfo] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [sentiment, setSentiment] = useState('');

//   // Example: Fetch data from your backend (dummy route here)
//   useEffect(() => {
//     fetch('http://localhost:5000/api/watch-data') // Backend should return JSON list
//       .then(res => res.json())
//       .then(data => setwatchInfo(data))
//       .catch(err => console.log('Error fetching watch info:', err));
//   }, []);

//   // Submit input to backend for sentiment analysis
//   const handleAnalyze = () => {
//     fetch('http://localhost:5000/api/analyze', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text: userInput }),
//     })
//       .then(res => res.json())
//       .then(data => setSentiment(data.sentiment))
//       .catch(err => console.log('Analysis error:', err));
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-10 pt-30">
//       <div className="flex flex-col md:flex-row gap-10">
//         {/* Image Left */}
//         <div className="md:w-1/2">
//           <img src={watchImage} alt="watch" className="w-full rounded-xl shadow-lg" />
//         </div>

//         {/* Info Right */}
//         <div className="md:w-1/2 space-y-4">
//         <h1 className="text-4xl font-bold mb-2">Smart Fitness Watch – Series 7</h1>
//           <ul className="list-disc pl-6 text-lg">
//             <li><strong>Display:</strong> 1.75" HD Full Touch Screen</li>
//             <li><strong>Health:</strong> Heart Rate & SpO2 Monitor, Sleep Tracker</li>
//             <li><strong>Fitness:</strong> Multiple Sports Modes, Step Counter</li>
//             <li><strong>Smart Features:</strong> Call/SMS Alerts, Weather, Music Control</li>
//             <li><strong>Battery:</strong> Up to 5 Days Use, Magnetic Charger</li>
//           </ul>
//           <ul className="list-disc pl-6 text-lg">
//             {watchInfo.slice(0, 5).map((item, index) => (
//               <li key={index}>{item}</li>
//             ))}
//           </ul>

//           {/* Input for Sentiment */}
//           <div className="mt-6">
//             <input
//               type="text"
//               placeholder="Type something to analyze sentiment"
//               value={userInput}
//               onChange={(e) => setUserInput(e.target.value)}
//               className="w-full p-3 rounded-lg border border-gray-300"
//             />
//             <button
//               onClick={handleAnalyze}
//               className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//             >
//               Analyze
//             </button>

//             {sentiment && (
//               <p className="mt-4 text-xl font-semibold">
//                 Sentiment: <span className="capitalize">{sentiment}</span>
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default watch;

// Watch.jsx
import React, { useEffect, useState } from 'react';
import watchImage from '../assets/watch.jpg';

const Watch = () => {
  const [watchInfo, setWatchInfo] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [rating, setRating] = useState(null);
  const [topReviews, setTopReviews] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/watch-data')
      .then(res => res.json())
      .then(data => setWatchInfo(data))
      .catch(err => console.error('Watch info fetch error:', err));

    fetch('http://localhost:5000/api/top-reviews?product=watch')
      .then(res => res.json())
      .then(data => setTopReviews(data));

    fetch('http://localhost:5000/api/review-summary?product=watch')
      .then(res => res.json())
      .then(data => setSummary(data.summary));
  }, []);

  const handleAnalyze = () => {
    fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput, product: 'watch' }),
    })
      .then(res => res.json())
      .then(data => setRating(data.stars))
      .catch(err => console.log('Analysis error:', err));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10 pt-30">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <img src={watchImage} alt="watch" className="w-full rounded-xl shadow-lg" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold mb-2">Apple Watch Series 9</h1>
          <ul className="list-disc pl-6 text-lg">
            <li><strong>Chip:</strong> S9 SiP with 64-bit dual-core</li>
            <li><strong>Display:</strong> Always-On Retina LTPO OLED</li>
            <li><strong>Sensors:</strong> Blood Oxygen, ECG, Temperature</li>
            <li><strong>Battery:</strong> Up to 18 hours</li>
            <li><strong>Features:</strong> Crash Detection, Fitness+</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Top Reviews</h2>
          <ul className="list-disc pl-6 text-md">
            {topReviews.map((r, idx) => (
              <li key={idx}>{r.text} - {'⭐️'.repeat(r.stars)}</li>
            ))}
          </ul>

          <p className="text-md italic">{summary}</p>

          <div className="mt-6">
            <input
              type="text"
              placeholder="Type your review here"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
            <button
              onClick={handleAnalyze}
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Analyze
            </button>

            {rating && (
              <p className="mt-4 text-xl font-semibold">
                Rating: {'⭐️'.repeat(rating)} ({rating}/5)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
