// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { WiStars } from "react-icons/wi";
// import {
//   FaSolarPanel,
//   FaTools,
//   FaChartLine,
//   FaCalculator,
//   FaUserTie,
// } from "react-icons/fa";
// import { MdCleaningServices } from "react-icons/md";
// import SolarBenefitCalculator from "../../Components/SolarBenefitCalculator/SolarBenefitCalculator";

// const Home = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [quizScore, setQuizScore] = useState(null);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [currentQuiz, setCurrentQuiz] = useState(null);
//   const [showCalculator, setShowCalculator] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     message: "",
//   });
//   const [formSubmitted, setFormSubmitted] = useState(false);

//   // Multiple Solar Quiz Questions
//   const solarQuizzes = [
//     {
//       question: "How much energy loss can dirty solar panels cause?",
//       options: ["5-10%", "15-25%", "30-40%", "50%+"],
//       correct: 1,
//       fact: "Dirty solar panels can reduce efficiency by 15-25%! Regular cleaning is essential for optimal performance.",
//     },
//     {
//       question: "What is the average lifespan of a quality solar panel?",
//       options: ["10-15 years", "15-20 years", "25-30 years", "40-50 years"],
//       correct: 2,
//       fact: "Quality solar panels last 25-30 years with minimal degradation, making them a long-term investment in clean energy.",
//     },
//     {
//       question: "How often should solar panels be professionally cleaned?",
//       options: [
//         "Every month",
//         "2-4 times per year",
//         "Once every 5 years",
//         "Never, rain is enough",
//       ],
//       correct: 1,
//       fact: "Solar panels should be cleaned 2-4 times per year depending on location and environmental conditions for maximum efficiency.",
//     },
//     {
//       question: "Solar panels generate electricity from:",
//       options: [
//         "Heat from the sun",
//         "Light from the sun",
//         "Wind energy",
//         "Both heat and wind",
//       ],
//       correct: 1,
//       fact: "It's light, not heat, that generates electricity. Too much heat can actually reduce solar panel efficiency!",
//     },
//     {
//       question:
//         "What percentage of CO₂ emissions can a household reduce by using solar?",
//       options: ["20-30%", "40-50%", "60-70%", "Up to 80%"],
//       correct: 3,
//       fact: "An average household can reduce carbon emissions by up to 80% by switching to solar energy, significantly combating climate change.",
//     },
//     {
//       question: "True or False: Solar panels only work on south-facing roofs.",
//       options: ["True", "False"],
//       correct: 1,
//       fact: "False! Modern solar panels are highly efficient and can be installed on roofs with various orientations or even on the ground.",
//     },
//     {
//       question: "How much can solar energy save on electricity bills annually?",
//       options: ["10-20%", "25-35%", "40-70%", "90-100%"],
//       correct: 2,
//       fact: "Solar systems can save 40-70% on electricity bills, and typically pay for themselves within 5-7 years of installation.",
//     },
//     {
//       question:
//         "What is the efficiency of most commercially available solar panels?",
//       options: ["5-10%", "15-22%", "30-40%", "50-60%"],
//       correct: 1,
//       fact: "Most commercial solar panels have 15-22% efficiency, though laboratory panels have achieved up to 47% efficiency!",
//     },
//   ];

//   // Load a random quiz question when component mounts
//   useEffect(() => {
//     const randomIndex = Math.floor(Math.random() * solarQuizzes.length);
//     setCurrentQuiz(solarQuizzes[randomIndex]);
//   }, []);

//   // Check if calculator should be shown after OTP verification
//   useEffect(() => {
//     if (location.state?.showCalculator) {
//       setShowCalculator(true);
//       // Clear the state to prevent reopening on refresh
//       window.history.replaceState({}, document.title);
//     }
//   }, [location]);

//   // Handle quiz answer selection
//   const handleQuizAnswer = (index) => {
//     setSelectedAnswer(index);
//     setQuizScore(index === currentQuiz.correct);
//   };

//   // Load a new random quiz question
//   const loadNewQuiz = () => {
//     const randomIndex = Math.floor(Math.random() * solarQuizzes.length);
//     setCurrentQuiz(solarQuizzes[randomIndex]);
//     setSelectedAnswer(null);
//     setQuizScore(null);
//   };

//   // Handle contact form input changes
//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // Handle contact form submission
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form submitted:", formData);
//     setFormSubmitted(true);
//     setTimeout(() => {
//       setFormSubmitted(false);
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         message: "",
//       });
//     }, 3000);
//   };

//   // Handle Calculate Savings button click - checks if user is verified
//   const handleCalculateSavings = () => {
//     const isVerified = localStorage.getItem("isVerified");

//     if (isVerified === "true") {
//       // User is already verified, show calculator modal directly
//       setShowCalculator(true);
//     } else {
//       // User not verified, redirect to OTP verification page
//       navigate("/user-data", { state: { from: "calculator" } });
//     }
//   };

//   // Return null if quiz hasn't loaded yet
//   if (!currentQuiz) return null;

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-blue-900 via-black to-green-900 text-white">
//       {/* Solar Benefit Calculator Modal */}
//       {showCalculator && (
//         <SolarBenefitCalculator onClose={() => setShowCalculator(false)} />
//       )}

//       {/* Hero Section - Main landing area */}
//       <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
//         {/* Background Image */}
//         <img
//           src="/Home-bg.jpg"
//           alt="Solar Background"
//           className="absolute inset-0 w-full h-full object-cover opacity-25"
//         />

//         {/* Decorative Grid Pattern */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,200,150,0.2)_1px,transparent_1px)] [background-size:26px_26px]"></div>

//         {/* Dark Gradient Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80"></div>

//         <div className="relative z-10 text-center px-6 sm:px-12 max-w-5xl mx-auto">
//           {/* Main Headline */}
//           <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight bg-gradient-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg animate-fade-in">
//             Your Renewable Journey Starts with Choosing Solar Energy!
//           </h1>

//           {/* Subheading */}
//           <p className="mt-6 text-lg sm:text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
//             Complete lifecycle support for your Solar PV system – from
//             installation to maintenance, we ensure peak performance and
//             sustainability.
//           </p>

//           {/* Call-to-Action Buttons Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-12 max-w-4xl mx-auto">
//             {/* Button 1: Calculate Savings */}
//             <button
//               onClick={handleCalculateSavings}
//               className="group relative overflow-hidden bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-600 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-violet-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
//             >
//               {/* Shimmer Effect on Hover */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

//               <span className="relative flex items-center justify-center gap-3">
//                 <FaCalculator className="text-xl" />
//                 <span className="group-hover:tracking-wide transition-all">
//                   Calculate Savings
//                 </span>
//               </span>
//             </button>

//             {/* Button 2: Explore Solar Health Score */}
//             <button
//               onClick={() => navigate("/user-data")}
//               className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
//             >
//               {/* Shimmer Effect on Hover */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

//               <span className="relative flex items-center justify-center gap-3">
//                 {/* <WiStars className="text-yellow-200 text-2xl animate-pulse drop-shadow-md" /> */}
//                 <FaCalculator className="text-xl" />
//                 <span className="group-hover:tracking-wide transition-all">
//                   Explore Solar Health
//                 </span>
//               </span>
//             </button>

//             {/* Button 3: Register for Services (Client Registration) */}
//             <button
//               onClick={() => navigate("/registration")}
//               className="group relative overflow-hidden bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 hover:from-yellow-500 hover:via-orange-500 hover:to-red-600 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
//             >
//               {/* Shimmer Effect on Hover */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

//               <span className="relative flex items-center justify-center gap-3">
//                 <FaSolarPanel className="text-xl" />
//                 <span className="group-hover:tracking-wide transition-all">
//                   Register for Services
//                 </span>
//               </span>
//             </button>

//             {/* Button 4: Technician Registration (Guest Technician) */}
//             <button
//               onClick={() => navigate("/technician-registration")}
//               className="group relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 hover:from-cyan-600 hover:via-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-2xl text-base sm:text-lg shadow-xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 active:scale-95"
//             >
//               {/* Shimmer Effect on Hover */}
//               <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

//               <span className="relative flex items-center justify-center gap-3">
//                 <FaUserTie className="text-xl" />
//                 <span className="group-hover:tracking-wide transition-all">
//                   Register As Technician
//                 </span>
//               </span>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* Why Solar Matters Section */}
//       {/* <section className="py-20 px-6 bg-gradient-to-b from-black to-blue-950 bg-black">
//         <div className="max-w-7xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-green-400 bg-clip-text text-transparent">
//             Why Solar Energy Matters
//           </h2>
//           <p className="text-center text-blue-200 text-lg mb-12 max-w-3xl mx-auto">
//             Solar energy is the cleanest, most abundant renewable resource
//             available. Here's why it's transforming the energy landscape.
//           </p>

//           <div className="grid md:grid-cols-3 gap-8">
//             <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 p-8 rounded-2xl border border-green-500/30 hover:border-green-400 transition-all hover:scale-105">
//               <div className="text-5xl mb-4">🌱</div>
//               <h3 className="text-2xl font-bold mb-3">Eco-Friendly</h3>
//               <p className="text-blue-100">
//                 Solar panels produce zero emissions, reducing your carbon
//                 footprint by up to 80% and combating climate change effectively.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-400 transition-all hover:scale-105">
//               <div className="text-5xl mb-4">💰</div>
//               <h3 className="text-2xl font-bold mb-3">Cost Savings</h3>
//               <p className="text-blue-100">
//                 Save 40-70% on electricity bills. Solar systems typically pay
//                 for themselves in 5-7 years with 25+ years of clean energy.
//               </p>
//             </div>

//             <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-8 rounded-2xl border border-blue-500/30 hover:border-blue-400 transition-all hover:scale-105">
//               <div className="text-5xl mb-4">⚡</div>
//               <h3 className="text-2xl font-bold mb-3">Energy Independence</h3>
//               <p className="text-blue-100">
//                 Generate your own power, protect against rising energy costs,
//                 and enjoy reliable electricity even during grid outages.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section> */}

//       {/* Our Services Section */}
//       {/* Services + Quiz + Why Us + Facts (Combined Section) */}
//       <section className="py-20 px-6 bg-gradient-to-b from-slate-950 via-black to-slate-900">
//         <div className="max-w-7xl mx-auto space-y-16">
//           {/* Our Services */}
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
//               Our Solar Services
//             </h2>
//             <p className="text-center text-slate-200 text-base md:text-lg mb-10 max-w-3xl mx-auto">
//               Comprehensive solutions to maximize your solar investment
//               throughout its entire lifecycle.
//             </p>

//             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {/* Service 1: Panel Cleaning */}
//               <div className="bg-slate-900/60 p-6 rounded-2xl border border-emerald-500/30 hover:border-emerald-400 transition-all hover:scale-105">
//                 <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                   <MdCleaningServices className="text-3xl text-emerald-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">Panel Cleaning</h3>
//                 <p className="text-slate-200 text-sm">
//                   Professional cleaning services that restore panel efficiency
//                   by removing dust, bird droppings, and debris. Boost output by
//                   15–25%.
//                 </p>
//               </div>

//               {/* Service 2: Operations & Maintenance */}
//               <div className="bg-slate-900/60 p-6 rounded-2xl border border-sky-500/30 hover:border-sky-400 transition-all hover:scale-105">
//                 <div className="bg-sky-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                   <FaTools className="text-3xl text-sky-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">O&M Services</h3>
//                 <p className="text-slate-200 text-sm">
//                   Complete operations and maintenance solutions including
//                   preventive care, system monitoring, and rapid troubleshooting.
//                 </p>
//               </div>

//               {/* Service 3: Performance Testing */}
//               <div className="bg-slate-900/60 p-6 rounded-2xl border border-amber-500/30 hover:border-amber-400 transition-all hover:scale-105">
//                 <div className="bg-amber-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                   <FaChartLine className="text-3xl text-amber-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">
//                   Performance Testing
//                 </h3>
//                 <p className="text-slate-200 text-sm">
//                   Advanced diagnostics with thermal imaging, IV curve testing,
//                   and efficiency analysis to identify issues before they impact
//                   output.
//                 </p>
//               </div>

//               {/* Service 4: System Upgrades */}
//               <div className="bg-slate-900/60 p-6 rounded-2xl border border-violet-500/30 hover:border-violet-400 transition-all hover:scale-105">
//                 <div className="bg-violet-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
//                   <FaSolarPanel className="text-3xl text-violet-400" />
//                 </div>
//                 <h3 className="text-lg font-semibold mb-2">System Upgrades</h3>
//                 <p className="text-slate-200 text-sm">
//                   Modernize aging systems with new inverters, monitoring tech,
//                   and optimization solutions to extend system life and improve
//                   ROI.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Quiz */}
//           <div className="max-w-4xl mx-auto">
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-yellow-300 to-emerald-400 bg-clip-text text-transparent">
//               Test Your Solar Knowledge
//             </h2>
//             <p className="text-center text-slate-200 mb-8">
//               Think you know solar? Take our quick quiz!
//             </p>

//             <div className="bg-slate-900/70 p-8 md:p-10 rounded-2xl border border-slate-700/60">
//               <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">
//                 {currentQuiz.question}
//               </h3>

//               <div className="grid md:grid-cols-2 gap-4 mb-6">
//                 {currentQuiz.options.map((option, index) => (
//                   <button
//                     key={index}
//                     onClick={() => handleQuizAnswer(index)}
//                     disabled={selectedAnswer !== null}
//                     className={`p-4 rounded-xl text-base md:text-lg font-semibold transition-all ${
//                       selectedAnswer === null
//                         ? "bg-slate-800/60 hover:bg-slate-700/60 border border-slate-600/80"
//                         : selectedAnswer === index
//                         ? index === currentQuiz.correct
//                           ? "bg-emerald-600 border-2 border-emerald-400"
//                           : "bg-rose-600 border-2 border-rose-400"
//                         : index === currentQuiz.correct
//                         ? "bg-emerald-600 border-2 border-emerald-400"
//                         : "bg-slate-700/60 border border-slate-600"
//                     }`}
//                   >
//                     {option}
//                   </button>
//                 ))}
//               </div>

//               {selectedAnswer !== null && (
//                 <div
//                   className={`p-6 rounded-xl border ${
//                     quizScore
//                       ? "bg-emerald-900/40 border-emerald-500/70"
//                       : "bg-sky-900/40 border-sky-500/70"
//                   }`}
//                 >
//                   <p className="text-lg md:text-xl font-bold mb-2">
//                     {quizScore ? "🎉 Correct!" : "📚 Good Try!"}
//                   </p>
//                   <p className="text-slate-100 mb-4 text-sm md:text-base">
//                     {currentQuiz.fact}
//                   </p>
//                   <button
//                     onClick={loadNewQuiz}
//                     className="group relative overflow-hidden bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md"
//                   >
//                     <span className="relative">Next Question</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Why Choose Us + Facts */}
//           <div>
//             <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-gradient-to-r from-blue-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
//               Why Choose Our Services
//             </h2>

//             <div className="grid lg:grid-cols-1 gap-10">
//               {/* Why Choose Us Cards */}
//               <div className="grid sm:grid-cols-2 gap-6">
//                 <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105">
//                   <div className="bg-blue-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/70">
//                     <span className="text-3xl">🏆</span>
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2 text-center">
//                     Certified Experts
//                   </h3>
//                   <p className="text-slate-200 text-sm text-center">
//                     Industry-certified technicians with 10+ years of solar
//                     experience.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105">
//                   <div className="bg-violet-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/70">
//                     <span className="text-3xl">🛡️</span>
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2 text-center">
//                     Guaranteed Results
//                   </h3>
//                   <p className="text-slate-200 text-sm text-center">
//                     Performance guarantees on all services with comprehensive
//                     warranties.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105">
//                   <div className="bg-emerald-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/70">
//                     <span className="text-3xl">👥</span>
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2 text-center">
//                     200+ Happy Clients
//                   </h3>
//                   <p className="text-slate-200 text-sm text-center">
//                     Trusted by residential and commercial solar owners.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105">
//                   <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/70">
//                     <span className="text-3xl">⏰</span>
//                   </div>
//                   <h3 className="text-lg font-semibold mb-2 text-center">
//                     24/7 Support
//                   </h3>
//                   <p className="text-slate-200 text-sm text-center">
//                     Round-the-clock monitoring and emergency response services.
//                   </p>
//                 </div>
//               </div>

//               {/* Facts */}
//               <div className="grid sm:grid-cols-3 gap-6">
//                 <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105 text-center">
//                   <div className="text-4xl font-bold text-sky-400 mb-1">
//                     25+
//                   </div>
//                   <p className="text-sm font-semibold mb-1 text-slate-100">
//                     Years Lifespan
//                   </p>
//                   <p className="text-xs text-slate-300">
//                     Quality solar panels last 25–30 years with minimal
//                     degradation.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105 text-center">
//                   <div className="text-4xl font-bold text-emerald-400 mb-1">
//                     80%
//                   </div>
//                   <p className="text-sm font-semibold mb-1 text-slate-100">
//                     CO₂ Reduction
//                   </p>
//                   <p className="text-xs text-slate-300">
//                     Average household reduces carbon emissions by up to 80%.
//                   </p>
//                 </div>

//                 <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-600/60 hover:border-slate-400 transition-all hover:scale-105 text-center">
//                   <div className="text-4xl font-bold text-violet-400 mb-1">
//                     15%
//                   </div>
//                   <p className="text-sm font-semibold mb-1 text-slate-100">
//                     Annual Growth
//                   </p>
//                   <p className="text-xs text-slate-300">
//                     Solar energy adoption is growing at 15% per year globally.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="py-20 px-6 bg-gradient-to-b from-slate-900 via-black to-slate-900 text-white text-center">
//         <div className="max-w-5xl mx-auto">
//           <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-300 via-green-400 to-blue-400 bg-clip-text text-transparent">
//             Get the PVProtect App
//           </h2>
//           <p className="text-slate-200 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
//             Monitor your solar performance on the go. Download our mobile app
//             for real-time insights, maintenance updates, and instant
//             notifications.
//           </p>

//           {/* Download Buttons - DARK NAVY/GRAY THEME - NO BLUE */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
//             {/* Android - Play Store Button - PURE DARK THEME */}
//             <a
//               href="http://play.google.com/store/apps/details?id=com.umakant3525.PV_PROTECT&hl=en_IN"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="group relative p-6 hover:p-7 w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-gray-700/50 transition-all duration-400 transform hover:-translate-y-2 hover:scale-105 active:scale-95 bg-gradient-to-br from-slate-800/30 to-gray-900/30 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
//               <div className="relative mx-auto max-w-[14rem]">
//                 <img
//                   src="/PlayStoreDownload.png"
//                   alt="Get it on Google Play"
//                   className="w-full h-16 object-contain drop-shadow-2xl hover:drop-shadow-[0_20px_40px_rgba(107,114,128,0.5)] transition-all duration-300"
//                 />
//               </div>
//               <span className="block text-md mt-4 tracking-wide text-slate-300 group-hover:text-slate-200 transition-all font-[600]">
//                 Android
//               </span>
//             </a>

//             {/* iOS - App Store Button - PURE DARK THEME */}
//             <a
//               href="https://apps.apple.com/in/app/pvprotech/id6744603579"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="group relative p-6 hover:p-7 w-full max-w-xs sm:max-w-sm rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-gray-800/50 transition-all duration-400 transform hover:-translate-y-2 hover:scale-105 active:scale-95 bg-gradient-to-br from-slate-800/30 to-gray-900/30 backdrop-blur-sm border border-slate-600/40 hover:border-slate-500/60"
//             >
//               <div className="absolute inset-0 bg-gradient-to-r from-slate-400/10 to-gray-400/10 rounded-2xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
//               <div className="relative mx-auto max-w-[14rem]">
//                 <img
//                   src="/AppStoreDownload.png"
//                   alt="Download on the App Store"
//                   className="w-full h-16 object-contain drop-shadow-2xl hover:drop-shadow-[0_20px_40px_rgba(107,114,128,0.5)] transition-all duration-300"
//                 />
//               </div>
//               <span className="block text-md mt-4 tracking-wide text-slate-300 group-hover:text-slate-200 transition-all font-[600]">
//                 iOS
//               </span>
//             </a>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;