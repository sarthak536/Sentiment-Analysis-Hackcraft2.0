// import React, { useEffect, useState } from 'react';
// import phoneImage from '../assets/phone.jpg';

// const phone = () => {
//   const [phoneInfo, setphoneInfo] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [sentiment, setSentiment] = useState('');

//   // Example: Fetch data from your backend (dummy route here)
//   useEffect(() => {
//     fetch('http://localhost:5000/api/phone-data') // Backend should return JSON list
//       .then(res => res.json())
//       .then(data => setphoneInfo(data))
//       .catch(err => console.log('Error fetching phone info:', err));
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
//           <img src={phoneImage} alt="phone" className="w-full rounded-xl shadow-lg" />
//         </div>

//         {/* Info Right */}
//         <div className="md:w-1/2 space-y-4">
//         <h1 className="text-4xl font-bold mb-2">Samsung Galaxy S24 Ultra</h1>
//           <ul className="list-disc pl-6 text-lg">
//             <li><strong>Brand:</strong> Samsung Galaxy S Series</li>
//             <li><strong>Display:</strong> 6.8" Quad HD+ AMOLED, 120Hz refresh rate</li>
//             <li><strong>Camera:</strong> 200MP Quad Camera with laser autofocus</li>
//             <li><strong>Processor:</strong> Snapdragon 8 Gen 3</li>
//             <li><strong>Special Feature:</strong> Built-in S Pen & AI-enhanced capabilities</li>
//           </ul>
//           <ul className="list-disc pl-6 text-lg">
//             {phoneInfo.slice(0, 5).map((item, index) => (
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

// export default phone;

// Phone.jsx
import React, { useEffect, useState } from 'react';
import phoneImage from '../assets/phone.jpg';

const Phone = () => {
  const [phoneInfo, setPhoneInfo] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [rating, setRating] = useState(null);
  const [topReviews, setTopReviews] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/phone-data')
      .then(res => res.json())
      .then(data => setPhoneInfo(data))
      .catch(err => console.error('Phone info fetch error:', err));

    fetch('http://localhost:5000/api/top-reviews?product=phone')
      .then(res => res.json())
      .then(data => setTopReviews(data));

    fetch('http://localhost:5000/api/review-summary?product=phone')
      .then(res => res.json())
      .then(data => setSummary(data.summary));
  }, []);

  const handleAnalyze = () => {
    fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput, product: 'phone' }),
    })
      .then(res => res.json())
      .then(data => setRating(data.stars))
      .catch(err => console.log('Analysis error:', err));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10 pt-30">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <img src={phoneImage} alt="phone" className="w-full rounded-xl shadow-lg" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold mb-2">Samsung Galaxy S24 Ultra</h1>
          <ul className="list-disc pl-6 text-lg">
            <li><strong>Camera:</strong> 200MP Main, AI Nightography</li>
            <li><strong>Display:</strong> 6.8" QHD+ Dynamic AMOLED 2X, 120Hz</li>
            <li><strong>Processor:</strong> Snapdragon 8 Gen 3</li>
            <li><strong>Battery:</strong> 5000mAh, Fast Charging</li>
            <li><strong>Extras:</strong> S-Pen, Gorilla Armor</li>
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

export default Phone;
