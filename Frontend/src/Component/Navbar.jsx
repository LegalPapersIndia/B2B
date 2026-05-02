// src/Component/Navbar.jsx
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

  // 1. Load all countries
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

  // 3. Load states when country changes
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

  // 4. Load cities when state changes
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
            <FaFacebookF className="hover:text-blue-400 cursor-pointer transition-colors" />
            <FaTwitter className="hover:text-blue-400 cursor-pointer transition-colors" />
            <FaInstagram className="hover:text-pink-400 cursor-pointer transition-colors" />
            <FaLinkedinIn className="hover:text-blue-400 cursor-pointer transition-colors" />
          </div>
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
            <span className="flex items-center gap-1.5">
              <FaPhoneAlt className="text-orange-400" /> +91 75052 66931
            </span>
            <span className="flex items-center gap-1.5">
              <FaEnvelope className="text-orange-400" /> support@b2b.in
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <div className="flex flex-col gap-4">
          {/* Logo + Search + Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-orange-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">L</span>
              </div>
              <span className="text-3xl font-black tracking-tighter text-gray-900">
               LPI-B2B
              </span>
            </Link>
            <div className="hidden lg:flex relative flex-1 max-w-lg mx-6">
              <input
                type="text"
                placeholder="Search products (HDPE, Gloves, Spices...)"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-gray-100 border border-gray-200 rounded-2xl focus:bg-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all text-sm"
              />
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {!isSignedIn && (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all text-sm"
                >
                  <FaUserCircle className="text-lg" />
                  Login
                </Link>
              )}

              {isSignedIn && (
                <div className="flex items-center gap-4">
                  <Link
                    to="/seller-dashboard"
                    className="hidden md:flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all text-sm"
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
                      onClick={logout}
                      className="rounded-xl border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Logout
                    </button>
                  )}
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>

          {/* Filter Bar / Mobile Menu */}
          <div
            className={`${
              isMenuOpen
                ? "flex flex-col gap-4 animate-in slide-in-from-top-5"
                : "hidden"
            } lg:flex lg:flex-row lg:items-center lg:gap-4 bg-white lg:bg-transparent p-5 lg:p-0 border-t lg:border-none lg:shadow-none rounded-2xl lg:rounded-none`}
          >
            {/* Mobile Search */}
            <div className="relative lg:hidden mb-2">
              <input
                type="text"
                placeholder="What are you looking for?"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:border-orange-500"
              />
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            {/* Location Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
              {/* Country */}
              <div className="relative">
                {detectingLocation && (
                  <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" />
                )}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={loadingCountries || detectingLocation}
                  className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-2xl text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <FaGlobe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {/* State */}
              <div className="relative">
                {loadingStates && (
                  <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" />
                )}
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  disabled={!selectedCountry || loadingStates}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none disabled:bg-gray-50"
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
              <div className="relative">
                {loadingDistricts && (
                  <FaSpinner className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-orange-500" />
                )}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState || loadingDistricts}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-2xl text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all appearance-none disabled:bg-gray-50"
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
            <button className="bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white px-8 py-3 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <FaSearch className="hidden lg:inline" />
              <span>Search</span>
            </button>

            {/* Mobile Login */}
            {!isSignedIn && (
              <Link
                to="/login"
                className="sm:hidden mt-2 border-2 border-orange-600 text-orange-600 py-3 rounded-2xl font-bold w-full text-center"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;