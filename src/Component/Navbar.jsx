import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaSearch,
  FaGlobe,
  FaSpinner,
  FaBars,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [productType, setProductType] = useState("");

  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(true);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [detected, setDetected] = useState({ country: "", state: "", city: "" });

  // --- Logic remains the same for data fetching ---
  useEffect(() => {
    setLoadingCountries(true);
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then((res) => res.json())
      .then((data) => {
        const list = data.data || [];
        setCountries(list.map((c) => c.name || c.country || "").sort());
        setLoadingCountries(false);
      })
      .catch(() => {
        setCountries(["India"]);
        setLoadingCountries(false);
      });
  }, []);

  useEffect(() => {
    const detect = async () => {
      setDetectingLocation(true);
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ip = await ipRes.json();
        setDetected({ country: ip.country_name, state: ip.region, city: ip.city });
        setSelectedCountry(ip.country_name);
      } catch (e) {
        setSelectedCountry("India");
      } finally {
        setDetectingLocation(false);
      }
    };
    if (!loadingCountries && !selectedCountry) detect();
  }, [loadingCountries]);

  useEffect(() => {
    if (!selectedCountry) return;
    setLoadingStates(true);
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry }),
    })
      .then((res) => res.json())
      .then((data) => {
        const st = (data.data?.states || []).map((item) => item.name).sort();
        setStates(st);
        setLoadingStates(false);
        const match = st.find((name) => name.toLowerCase().includes(detected.state.toLowerCase()));
        if (match) setSelectedState(match);
      })
      .catch(() => setLoadingStates(false));
  }, [selectedCountry, detected.state]);

  useEffect(() => {
    if (!selectedState || !selectedCountry) return;
    setLoadingDistricts(true);
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry, state: selectedState }),
    })
      .then((res) => res.json())
      .then((data) => {
        const dist = (data.data || []).sort();
        setDistricts(dist);
        setLoadingDistricts(false);
        const match = dist.find((d) => d.toLowerCase().includes(detected.city.toLowerCase()));
        if (match) setSelectedDistrict(match);
      })
      .catch(() => setLoadingDistricts(false));
  }, [selectedState, selectedCountry, detected.city]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* 1. Top Bar: Adaptive Visibility */}
      <div className="bg-gray-900 text-gray-300 text-[10px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex justify-between items-center">
          <div className="hidden md:flex items-center gap-4">
            <FaFacebookF className="hover:text-white cursor-pointer transition-colors" />
            <FaTwitter className="hover:text-white cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-white cursor-pointer transition-colors" />
            <FaLinkedinIn className="hover:text-white cursor-pointer transition-colors" />
          </div>
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
            <span className="flex items-center gap-1.5">
              <FaPhoneAlt className="text-emerald-400" />+91 7505266931
            </span>
            <span className="flex items-center gap-1.5">
              <FaEnvelope className="text-amber-300" /> support@b2b.in
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Area */}
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-3 lg:py-4">
        <div className="flex flex-col gap-4">
          
          {/* Brand & Search & Actions Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="text-2xl sm:text-3xl font-black text-indigo-700 tracking-tighter cursor-pointer">
              B2B<span className="text-gray-900"></span>
            </div>

            {/* Desktop Search - Hidden on mobile, appears on Large screens */}
            <div className="hidden lg:flex relative flex-1 max-w-lg mx-4">
              <input
                type="text"
                placeholder="Search products (Medicine, Rice, Steel...)"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-full focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm">
                <FaUserCircle className="text-lg" />
                Login
              </button>
              
              {/* Mobile Menu Toggle */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* 3. Filter Bar: Collapsible on Mobile */}
          <div
  className={`${
    isMenuOpen 
      ? "flex flex-col gap-5 animate-in slide-in-from-top-5 fade-in duration-300" 
      : "hidden"
  } lg:flex lg:flex-row lg:items-center lg:gap-4 bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 lg:p-0 border-t lg:border-none shadow-xl lg:shadow-none rounded-b-2xl lg:rounded-none`}
>
            {/* Mobile Only: Search Input inside the toggle menu */}
            <div className="relative lg:hidden">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm"
              />
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Cascading Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
              <div className="relative group">
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <FaGlobe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo-500" />
              </div>

              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none disabled:bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select State</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {loadingStates && <FaSpinner className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />}
              </div>

              <div className="relative">
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none disabled:bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="">Select City</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                {loadingDistricts && <FaSpinner className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />}
              </div>
            </div>

            {/* CTA Search Button */}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <FaSearch className="hidden lg:inline" />
              <span>Search B2B</span>
            </button>
            
            {/* Mobile Only: Login Button inside Menu */}
            <button className="sm:hidden mt-2 border-2 border-indigo-600 text-indigo-600 py-2.5 rounded-lg font-bold">
              Login / Register
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;


// import React, { useEffect, useState } from "react";
// import {
//   FaFacebookF,
//   FaTwitter,
//   FaInstagram,
//   FaLinkedinIn,
//   FaPhoneAlt,
//   FaEnvelope,
//   FaSearch,
//   FaGlobe,
// } from "react-icons/fa";

// const Navbar = () => {
//   const [countries, setCountries] = useState([]);
//   const [states, setStates] = useState([]);
//   const [districts, setDistricts] = useState([]);

//   const [selectedCountry, setSelectedCountry] = useState("");
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [productType, setProductType] = useState("");

//   // Load countries
//   useEffect(() => {
//     fetch("https://countriesnow.space/api/v0.1/countries")
//       .then((res) => res.json())
//       .then((data) => {
//         const list = data.data || [];
//         setCountries(list.map((c) => c.name || c.country || "").sort());
//       })
//       .catch(() => {
//         setCountries(["India", "United States", "Singapore"]);
//       });
//   }, []);

//   // Country → States
//   useEffect(() => {
//     if (!selectedCountry) {
//       setStates([]);
//       setSelectedState("");
//       setDistricts([]);
//       setSelectedDistrict("");
//       return;
//     }

//     fetch("https://countriesnow.space/api/v0.1/countries/states", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ country: selectedCountry }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const st = data.data?.states?.map((item) => item.name) || [];
//         setStates(st.sort());
//       })
//       .catch(() => setStates([]));
//   }, [selectedCountry]);

//   // State → Districts
//   useEffect(() => {
//     if (!selectedState || !selectedCountry) {
//       setDistricts([]);
//       setSelectedDistrict("");
//       return;
//     }

//     fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ country: selectedCountry, state: selectedState }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         const dist = data.data || [];
//         setDistricts(dist.sort());
//       })
//       .catch(() => setDistricts([]));
//   }, [selectedState, selectedCountry]);

//   return (
//     <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
//       {/* Top bar */}
//       <div className="bg-gray-900 text-gray-300 py-2 px-5 lg:px-12 text-sm">
//         <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
//           <div className="flex items-center gap-5">
//             <a href="#" className="hover:text-white transition-colors"><FaFacebookF /></a>
//             <a href="#" className="hover:text-white transition-colors"><FaTwitter /></a>
//             <a href="#" className="hover:text-white transition-colors"><FaInstagram /></a>
//             <a href="#" className="hover:text-white transition-colors"><FaLinkedinIn /></a>
//           </div>
//           <div className="flex items-center gap-6">
//             <div className="flex items-center gap-2">
//               <FaPhoneAlt className="text-green-400" />
//               <span>+91 7505266931</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <FaEnvelope className="text-amber-300" />
//               <span>support@b2bplatform.in</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Navbar - single row search area */}
//       <nav className="py-4 px-5 lg:px-12">
//         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6">
//           {/* Logo */}
//           <div className="text-3xl font-extrabold text-indigo-700 tracking-tight shrink-0">
//             B2B
//           </div>

//           {/* Search + Filters - forced single row */}
//           <div className="w-full lg:flex-1 flex items-center gap-2 lg:gap-3 flex-nowrap overflow-x-auto pb-1">
//             {/* Product Type */}
//             <div className="relative min-w-[220px] flex-1">
//               <input
//                 type="text"
//                 placeholder="Product type or keyword..."
//                 value={productType}
//                 onChange={(e) => setProductType(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow text-sm"
//               />
//               <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
//             </div>

//             {/* Country */}
//             <div className="relative min-w-[160px]">
//               <select
//                 value={selectedCountry}
//                 onChange={(e) => setSelectedCountry(e.target.value)}
//                 className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow appearance-none cursor-pointer text-sm"
//               >
//                 <option value="">Country</option>
//                 {countries.map((c, i) => (
//                   <option key={i} value={c}>{c}</option>
//                 ))}
//               </select>
//               <FaGlobe className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
//             </div>

//             {/* State */}
//             <div className="relative min-w-[140px]">
//               <select
//                 value={selectedState}
//                 onChange={(e) => setSelectedState(e.target.value)}
//                 disabled={!selectedCountry}
//                 className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow appearance-none cursor-pointer disabled:opacity-50 text-sm"
//               >
//                 <option value="">State</option>
//                 {states.map((s, i) => (
//                   <option key={i} value={s}>{s}</option>
//                 ))}
//               </select>
//             </div>

//             {/* District / City */}
//             <div className="relative min-w-[140px]">
//               <select
//                 value={selectedDistrict}
//                 onChange={(e) => setSelectedDistrict(e.target.value)}
//                 disabled={!selectedState}
//                 className="w-full px-3 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm hover:shadow appearance-none cursor-pointer disabled:opacity-50 text-sm"
//               >
//                 <option value="">City</option>
//                 {districts.map((d, i) => (
//                   <option key={i} value={d}>{d}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Search Button */}
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all whitespace-nowrap flex items-center gap-2 text-sm">
//               <FaSearch size={14} /> Search
//             </button>
//           </div>

//           {/* Auth Buttons */}
//           <div className="hidden lg:flex items-center gap-4 shrink-0">
//             <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
//               Login as Seller
//             </button>
//             <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm">
//               Login as Buyer
//             </button>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// };

// export default Navbar;