// import React, { useEffect, useState } from 'react';
// import laptopImage from '../assets/laptop.jpg';

// const Laptop = () => {
//   const [laptopInfo, setLaptopInfo] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [rating, setRating] = useState(null);
//   const [topReviews, setTopReviews] = useState([]);
//   const [summary, setSummary] = useState('');

//   useEffect(() => {
//     fetch('http://localhost:5000/api/laptop-data')
//       .then(res => res.json())
//       .then(data => setLaptopInfo(data))
//       .catch(err => console.error('Laptop info fetch error:', err));

//     fetch('http://localhost:5000/api/top-reviews?product=laptop')
//       .then(res => res.json())
//       .then(data => setTopReviews(data));

//     fetch('http://localhost:5000/api/review-summary?product=laptop')
//       .then(res => res.json())
//       .then(data => setSummary(data.summary));
//   }, []);

//   const handleAnalyze = () => {
//     fetch('http://localhost:5000/api/analyze', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ text: userInput, product: 'laptop' }),
//     })
//       .then(res => res.json())
//       .then(data => setRating(data.stars))
//       .catch(err => console.log('Analysis error:', err));
//   };

//   return (
//     <div className="min-h-screen bg-slate-100 p-10 pt-30">
//       <div className="flex flex-col md:flex-row gap-10">
//         <div className="md:w-1/2">
//           <img src={laptopImage} alt="laptop" className="w-full rounded-xl shadow-lg" />
//         </div>
//         <div className="md:w-1/2 space-y-4">
//           <h1 className="text-4xl font-bold mb-2">MacBook Pro 16" M3</h1>
//           <ul className="list-disc pl-6 text-lg">
//             <li><strong>Display:</strong> 16.2" Liquid Retina XDR</li>
//             <li><strong>Processor:</strong> Apple M3 Pro chip</li>
//             <li><strong>Battery Life:</strong> Up to 22 hours</li>
//             <li><strong>Storage:</strong> Up to 8TB SSD</li>
//             <li><strong>Ports:</strong> HDMI, SDXC, MagSafe</li>
//           </ul>

//           <h2 className="text-2xl font-semibold mt-6">Top Reviews</h2>
//           <ul className="list-disc pl-6 text-md">
//             {topReviews.map((r, idx) => (
//               <li key={idx}>{r.text} - {'⭐️'.repeat(r.stars)}</li>
//             ))}
//           </ul>

//           <p className="text-md italic">{summary}</p>

//           <div className="mt-6">
//             <input
//               type="text"
//               placeholder="Type your review here"
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

//             {rating && (
//               <p className="mt-4 text-xl font-semibold">
//                 Rating: {'⭐️'.repeat(rating)} ({rating}/5)
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Laptop;

import React, { useEffect, useState } from 'react';
import laptopImage from '../assets/laptop.jpg';

const Laptop = () => {
  const [laptopInfo, setLaptopInfo] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [rating, setRating] = useState(null);
  const [topReviews, setTopReviews] = useState([]);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/laptop-data')
      .then(res => res.json())
      .then(data => setLaptopInfo(data))
      .catch(err => console.error('Laptop info fetch error:', err));

    fetch('http://localhost:5000/api/top-reviews?product=laptop')
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        setTopReviews(shuffled.slice(0, 5));  // pick 5 random ones
      });

    fetch('http://localhost:5000/api/review-summary?product=laptop')
      .then(res => res.json())
      .then(data => setSummary(data.summary));
  }, []);

  const handleAnalyze = () => {
    fetch('http://localhost:5000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput, product: 'laptop' }),
    })
      .then(res => res.json())
      .then(data => setRating(data.stars))
      .catch(err => console.log('Analysis error:', err));
  };

  return (
    <div className="min-h-screen bg-slate-100 p-10 pt-30">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <img src={laptopImage} alt="laptop" className="w-full rounded-xl shadow-lg" />
        </div>
        <div className="md:w-1/2 space-y-4">
          <h1 className="text-4xl font-bold mb-2">MacBook Pro 16" M3</h1>
          <ul className="list-disc pl-6 text-lg">
            <li><strong>Display:</strong> 16.2" Liquid Retina XDR</li>
            <li><strong>Processor:</strong> Apple M3 Pro chip</li>
            <li><strong>Battery Life:</strong> Up to 22 hours</li>
            <li><strong>Storage:</strong> Up to 8TB SSD</li>
            <li><strong>Ports:</strong> HDMI, SDXC, MagSafe</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Top Reviews</h2>
          <ul className="list-disc pl-6 text-md">
            {topReviews.map((r, idx) => (
              <li key={idx}>
                {r.text} - <span className="text-yellow-500">{'⭐️'.repeat(r.stars)}</span>
              </li>
            ))}
          </ul>

          <p className="text-md italic mt-2">{summary}</p>

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

export default Laptop;
