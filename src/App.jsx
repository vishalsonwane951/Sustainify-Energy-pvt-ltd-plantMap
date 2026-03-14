import { BrowserRouter, Routes, Route } from "react-router-dom";
import BillAnalysis from "./pages/bill";
import PlantMap from "./pages/PlantMap";
import PVProtectServices from "./pages/services.jsx";
import BlogsPage from "./pages/blogs.jsx";

function App() {
  return (

    <BrowserRouter>

      <Routes>
        <Route path="/" element={<BillAnalysis />} />
        <Route path="/map" element={<PlantMap />} />
        <Route path="/service" element={<PVProtectServices/>} />
        <Route path="/blogs" element={<BlogsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;











// import React, { Suspense, lazy } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './Context/AuthContext.jsx';
// import { PackageProvider } from './Context/PackageContext.jsx';
// import Header from './Components/Header/Header';
// import './App.css';
// import BlogsPage from './pagessss/blogs.jsx';

// // Lazy load all pages for better performance
// const Start = lazy(() => import('./Pages/Start'));
// const Services = lazy(() => import('./Pages/Services'));
// const Domestic = lazy(() => import('./Pages/Domestic'));
// const International = lazy(() => import('./Pages/International'));
// const Maharashtra = lazy(() => import('./Pages/Domestic/Maharashtra'));

// // Tour Package Pages
// const BaseTourPage = lazy(() => import('./Pages/Packages/BaseTourPage'));
// const CustomTourP = lazy(() => import('./Pages/Packages/CustomTourP'));
// const AdventureTourP = lazy(() => import('./Pages/Packages/AdventureTourP'));
// const FamilyTourP = lazy(() => import('./Pages/Packages/FamilyTourP'));
// const GroupTourP = lazy(() => import('./Pages/Packages/GroupTourP'));
// const CityTourP = lazy(() => import('./Pages/Packages/CityTourP'));
// const PackageDetail = lazy(() => import('./Pages/Packages/PackageDetail'));

// // Explore Packages
// const Manali = lazy(() => import('./Pages/Explore-Packages/Manali'));
// const Goa = lazy(() => import('./Pages/Explore-Packages/Goa'));
// const Kerala = lazy(() => import('./Pages/Explore-Packages/Kerala'));
// const Rajasthan = lazy(() => import('./Pages/Explore-Packages/Rajasthan'));
// const Sikkim = lazy(() => import('./Pages/Explore-Packages/Sikkim'));
// const Kashmir = lazy(() => import('./Pages/Explore-Packages/Kashmir'));
// const Rishikesh = lazy(() => import('./Pages/Explore-Packages/Rishikesh'));
// const Andman = lazy(() => import('./Pages/Explore-Packages/Andman'));
// const Udaipur = lazy(() => import('./Pages/Explore-Packages/Udaipur'));
// const Ladakh = lazy(() => import('./Pages/Explore-Packages/Ladakh'));
// const Ooty = lazy(() => import('./Pages/Explore-Packages/Ooty'));

// // User
// const BookingForm = lazy(() => import('./Components/BookingForm/BookingForm'));
// const MyBookings = lazy(() => import('./Components/BookingForm/MyBookings'));
// const UserProfilePopup = lazy(() => import('./Components/Profile/Profile'));
// const UploadImagesByTitle = lazy(() => import('./Components/ImageUpload'));
// const AdminInquiries = lazy(() => import('./Pages/Admin/AdminInquiries'));
// const PageNotFound = lazy(() => import('./Pages/PageNotFound'));

// // Spinner fallback
// const Spinner = () => (
//   <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//     <div style={{
//       width: '44px', height: '44px', borderRadius: '50%',
//       border: '4px solid #e2e8f0', borderTopColor: '#F4841F',
//       animation: 'spin 0.8s linear infinite',
//     }} />
//     <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//   </div>
// );

// const App = () => {
//   return (
//     <AuthProvider>
//       <Header />
//       <PackageProvider>
//         <Suspense fallback={<Spinner />}>
//           <Routes>
//             <Route path="/" element={<Start />} />
//             <Route path="/services" element={<Services />} />

//             {/* Tour Type Pages */}
//             <Route path="/tourcard/:type" element={<BaseTourPage />} />
//             <Route path="/adventure-tours" element={<AdventureTourP />} />
//             <Route path="/family-tours" element={<FamilyTourP />} />
//             <Route path="/group-tours" element={<GroupTourP />} />
//             <Route path="/city-tours" element={<CityTourP />} />
//             <Route path="/custom-tours" element={<CustomTourP />} />

//             {/* Package Detail */}
//             <Route path="/package/:location" element={<PackageDetail />} />
//             <Route path="/custom-tours/:packageId" element={<PackageDetail />} />
//             <Route path="/adventure-tours/:packageId" element={<PackageDetail />} />
//             <Route path="/family-tours/:packageId" element={<PackageDetail />} />
//             <Route path="/group-tours/:packageId" element={<PackageDetail />} />
//             <Route path="/city-tours/:packageId" element={<PackageDetail />} />

//             {/* Explore Packages */}
//             <Route path="/manali-Packages" element={<Manali />} />
//             <Route path="/goa-Packages" element={<Goa />} />
//             <Route path="/kerala-Packages" element={<Kerala />} />
//             <Route path="/rajasthan-Packages" element={<Rajasthan />} />
//             <Route path="/sikkim-Packages" element={<Sikkim />} />
//             <Route path="/kashmir-Packages" element={<Kashmir />} />
//             <Route path="/rishikesh-Packages" element={<Rishikesh />} />
//             <Route path="/andaman-Packages" element={<Andman />} />
//             <Route path="/Udaipur-Packages" element={<Udaipur />} />
//             <Route path="/ladakh-Packages" element={<Ladakh />} />
//             <Route path="/Ooty-Packages" element={<Ooty />} />

//             {/* User Pages */}
//             <Route path="/booking/:packageId" element={<BookingForm />} />
//             <Route path="/my-bookings" element={<MyBookings />} />
//             <Route path="/my-profile" element={<UserProfilePopup />} />

//             {/* Domestic */}
//             <Route path="/Maharashtra" element={<Maharashtra />} />

//             {/* Admin */}
//             <Route path="/admin" element={<AdminInquiries />} />
//             <Route path="/update" element={<UploadImagesByTitle />} />
//             <Route path="/blogs" element={<BlogsPage />} />

//             {/* 404 */}
//             <Route path="*" element={<PageNotFound />} />
//           </Routes>
//         </Suspense>
//       </PackageProvider>
//     </AuthProvider>
//   );
// };

// export default App;
