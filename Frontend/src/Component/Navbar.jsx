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
  FaStore,
  FaTimes,
  FaUserCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";
import { useAppAuth } from "../context/AuthContext";

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
  const [detected, setDetected] = useState({
    country: "",
    region: "",
    city: "",
  });

  const { user, isLoaded, isSignedIn, authType, logout } = useAppAuth();

  // 1. Load all countries once
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

  // 2. Auto-detect location using IP
  useEffect(() => {
    const detectLocation = async () => {
      setDetectingLocation(true);
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();

        if (ipData.error) throw new Error("IP detection failed");

        const detectedData = {
          country: ipData.country_name || "India",
          region: ipData.region || "",
          city: ipData.city || "",
        };

        setDetected(detectedData);
        setSelectedCountry(detectedData.country);
      } catch (err) {
        console.warn("IP detection failed:", err);
        setSelectedCountry("India");
      } finally {
        setDetectingLocation(false);
      }
    };

    if (!loadingCountries && !selectedCountry) {
      detectLocation();
    }
  }, [loadingCountries, selectedCountry]);

  // 3. Load states when country is selected
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
        const stateList = (data.data?.states || [])
          .map((item) => item.name)
          .sort();
        setStates(stateList);

        if (detected.region) {
          const match = stateList.find((name) =>
            name.toLowerCase().includes(detected.region.toLowerCase())
          );
          if (match) setSelectedState(match);
        }
      })
      .catch(() => setStates([]))
      .finally(() => setLoadingStates(false));
  }, [selectedCountry, detected.region]);

  // 4. Load cities/districts when state is selected
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    setLoadingDistricts(true);
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: selectedCountry,
        state: selectedState,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const cityList = (data.data || []).sort();
        setDistricts(cityList);

        if (detected.city) {
          const match = cityList.find((name) =>
            name.toLowerCase().includes(detected.city.toLowerCase())
          );
          if (match) setSelectedDistrict(match);
        }
      })
      .catch(() => setDistricts([]))
      .finally(() => setLoadingDistricts(false));
  }, [selectedState, selectedCountry, detected.city]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Top Bar */}
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
              <FaPhoneAlt className="text-emerald-400" /> +91 75052 66931
            </span>
            <span className="flex items-center gap-1.5">
              <FaEnvelope className="text-amber-300" /> support@b2b.in
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-3 lg:py-4">
        <div className="flex flex-col gap-4">
          {/* Logo + Search + Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link
              to="/"
              className="text-2xl sm:text-3xl font-black text-indigo-700 tracking-tighter cursor-pointer"
            >
              B2B<span className="text-gray-900"></span>
            </Link>

            {/* Desktop Search */}
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

            {/* Actions - Login / User */}
            <div className="flex items-center gap-2 sm:gap-4">
              {!isSignedIn && (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
                >
                  <FaUserCircle className="text-lg" />
                  Login
                </Link>
              )}

{isSignedIn && (
  <div className="flex items-center gap-4">
    <Link
      to="/seller-dashboard"
      className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all text-sm"
    >
      <FaStore className="text-lg" />
      Seller Dashboard
    </Link>

    <span className="hidden sm:block text-sm font-medium text-gray-700">
      Hi, {user?.firstName || "User"}
    </span>

    {authType === "clerk" ? (
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: { avatarBox: "w-9 h-9" }
        }}
      />
    ) : (
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Logout
      </button>
    )}
  </div>
)}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
              </button>
            </div>
          </div>

          {/* Filter Bar / Mobile Menu */}
          <div
            className={`${
              isMenuOpen
                ? "flex flex-col gap-5 animate-in slide-in-from-top-5 fade-in duration-300"
                : "hidden"
            } lg:flex lg:flex-row lg:items-center lg:gap-4 bg-white/95 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none p-5 lg:p-0 border-t lg:border-none shadow-xl lg:shadow-none rounded-b-2xl lg:rounded-none`}
          >
            {/* Mobile Search */}
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

            {/* Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
              {/* Country */}
              <div className="relative group">
                {detectingLocation && (
                  <FaSpinner className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
                )}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={loadingCountries || detectingLocation}
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FaGlobe className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-indigo-500" />
              </div>

              {/* State */}
              <div className="relative group">
                {loadingStates && (
                  <FaSpinner className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
                )}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || loadingStates}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none disabled:bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* District / City */}
              <div className="relative group">
                {loadingDistricts && (
                  <FaSpinner className="absolute right-8 top-1/2 -translate-y-1/2 animate-spin text-indigo-500" />
                )}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || loadingDistricts}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm appearance-none disabled:bg-gray-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-60"
                >
                  <option value="">Select City</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <FaSearch className="hidden lg:inline" />
              <span>Search B2B</span>
            </button>

            {/* Mobile Login (when signed out) */}
            {!isSignedIn && (
              <button className="sm:hidden mt-2 border-2 border-indigo-600 text-indigo-600 py-2.5 rounded-lg font-bold w-full">
                <Link to="/login">Login / Register</Link>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
