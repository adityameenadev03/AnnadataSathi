"use client";

import { ArrowLeft, MapPin, Tractor, ArrowRight, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export default function AddFarmPage() {
  const router = useRouter();
  
  const [waterSource, setWaterSource] = useState("Tube well");
  const [ownership, setOwnership] = useState("Owned");

  // Farm Basic Details State
  const [farmName, setFarmName] = useState("");
  const [totalSize, setTotalSize] = useState("");

  // Location State
  const [locationQuery, setLocationQuery] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  
  // Autocomplete UI State
  const [locationResults, setLocationResults] = useState<any[]>([]);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);
  const [isGettingGPS, setIsGettingGPS] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const locationRef = useRef<HTMLDivElement>(null);

  // Form Submission State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Debounce and search for locations (Nominatim)
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (locationQuery.length >= 3 && showDropdown) {
        setIsSearchingLocation(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
              locationQuery
            )}&countrycodes=in&format=json&addressdetails=1&limit=5&accept-language=en`
          );
          if (res.ok) {
            const data = await res.json();
            setLocationResults(data);
          }
        } catch (error) {
          console.error("Error fetching location data:", error);
        } finally {
          setIsSearchingLocation(false);
        }
      } else if (locationQuery.length < 3) {
        setLocationResults([]);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [locationQuery, showDropdown]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle GPS Button Click
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setErrors(prev => ({ ...prev, locationQuery: '' }));
    setIsGettingGPS(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lon);

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
          );
          if (res.ok) {
            const data = await res.json();
            const cleanName = data.display_name
              .split(", ")
              .filter((part: string) => !part.match(/^\d+$/) && part !== "India")
              .slice(0, 3)
              .join(", ");
            
            setLocationQuery(cleanName || data.display_name);
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
        } finally {
          setIsGettingGPS(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setIsGettingGPS(false);
      }
    );
  };

  // Handle Dropdown Selection
  const selectLocation = (place: any) => {
    const cleanName = place.display_name
      .split(", ")
      .filter((part: string) => !part.match(/^\d+$/) && part !== "India")
      .slice(0, 3)
      .join(", ");
    
    setLocationQuery(cleanName || place.display_name);
    setLatitude(parseFloat(place.lat));
    setLongitude(parseFloat(place.lon));
    setShowDropdown(false);
    setErrors(prev => ({ ...prev, locationQuery: '' }));
  };

  // Validate form fields
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!farmName.trim()) newErrors.farmName = "Please enter a farm name";
    if (!locationQuery.trim()) newErrors.locationQuery = "Please locate your farm";
    
    if (!totalSize.trim()) {
      newErrors.totalSize = "Please enter the total size";
    } else if (isNaN(parseFloat(totalSize)) || parseFloat(totalSize) <= 0) {
      newErrors.totalSize = "Size must be a valid number (e.g. 8.5)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Save
  const handleSave = async () => {
    if (!validateForm()) return;

    setIsSaving(true);
    setErrors({});
    
    const farmData = {
      name: farmName,
      location: locationQuery,
      latitude: latitude,
      longitude: longitude,
      sizeInAcres: totalSize,
      waterSource: waterSource,
      ownershipType: ownership,
    };

    try {
      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(farmData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/home"); // Redirect to home on success
        }, 1500);
      } else {
        const errorData = await res.json();
        setErrors({ submit: errorData.error || "Failed to save farm." });
      }
    } catch (err) {
      console.error(err);
      setErrors({ submit: "A network error occurred while saving." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-slate-800 pb-24 font-sans relative flex flex-col items-center">
      <div className="w-full max-w-md mx-auto relative">
        
        {/* Success Overlay */}
        {success && (
          <div className="absolute inset-0 z-50 bg-[#F8FAF7]/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-[#238B50] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <CheckCircle2 size={40} className="text-white" strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Farm Added!</h2>
            <p className="text-slate-600 mt-2 font-medium">Redirecting you to home...</p>
          </div>
        )}

        {/* Header */}
        <div className="px-5 pt-6 pb-2 mb-2 w-full">
          <Link 
            href="/home" 
            className="w-11 h-11 bg-white rounded-[14px] flex items-center justify-center border border-slate-200/60 shadow-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
          </Link>
          <div className="mt-5">
            <h1 className="text-[28px] font-bold tracking-tight text-slate-900">Add Farm</h1>
            <p className="text-slate-500 text-[15px] mt-1.5 leading-snug pr-4">
              Enter your basic farm details to get started.
            </p>
          </div>
          
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[14.5px] font-medium flex items-center gap-2">
              <AlertCircle size={18} />
              {errors.submit}
            </div>
          )}
        </div>

        {/* Basic Details Form */}
        <div className="px-4 py-2 w-full">
          <div className={`bg-white rounded-2xl p-5 border shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-6 ${Object.keys(errors).length > 0 && !errors.submit ? 'border-red-100' : 'border-slate-100/80'}`}>
            
            {/* Farm Name */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-slate-800 flex justify-between">
                <span>Farm name <span className="text-red-500">*</span></span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500/80">
                  <Tractor size={20} strokeWidth={2} className={errors.farmName ? 'text-red-400' : ''} />
                </div>
                <input 
                  type="text" 
                  value={farmName}
                  onChange={(e) => {
                    setFarmName(e.target.value);
                    if (errors.farmName) setErrors(prev => ({ ...prev, farmName: '' }));
                  }}
                  placeholder="Rampur Farm" 
                  className={`w-full pl-[42px] pr-4 py-3.5 bg-white border rounded-xl text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.farmName 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                      : 'border-slate-200/80 focus:border-green-600 focus:ring-green-500/20'
                  }`}
                />
              </div>
              {errors.farmName && <span className="text-red-500 text-[13px] font-medium pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.farmName}</span>}
            </div>

            {/* Location (Autocomplete & GPS) */}
            <div className="flex flex-col gap-2 relative" ref={locationRef}>
              <label className="text-[15px] font-bold text-slate-800">
                <span>Location <span className="text-red-500">*</span></span>
              </label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500/80">
                  <MapPin size={20} strokeWidth={2} className={errors.locationQuery ? 'text-red-400' : ''} />
                </div>
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    setShowDropdown(true);
                    if (errors.locationQuery) setErrors(prev => ({ ...prev, locationQuery: '' }));
                  }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="Search village, town, or city" 
                  className={`w-full pl-[42px] pr-10 py-3.5 bg-white border rounded-xl text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                    errors.locationQuery 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                      : 'border-slate-200/80 focus:border-green-600 focus:ring-green-500/20'
                  }`}
                />
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  {isSearchingLocation && (
                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                  )}
                </div>
              </div>
              {errors.locationQuery && <span className="text-red-500 text-[13px] font-medium pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.locationQuery}</span>}

              {/* Get Current Location Action */}
              <button 
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingGPS}
                className="flex items-center gap-2 mt-1 text-[15px] font-bold text-[#238B50] hover:text-[#1E7A45] transition-colors self-start px-1"
              >
                {isGettingGPS ? <Loader2 className="w-[18px] h-[18px] animate-spin" /> : <span>📍</span>}
                Use my current location
              </button>

              {/* Dropdown Results */}
              {showDropdown && (locationQuery.length >= 3) && (
                <div className="absolute top-[80px] left-0 right-0 bg-white rounded-xl shadow-[0_8px_30px_-4px_rgba(0,0,0,0.15)] border border-slate-200/60 overflow-hidden z-20 max-h-60 overflow-y-auto">
                  {locationResults.length > 0 ? (
                    <ul className="py-1">
                      {locationResults.map((place) => (
                        <li 
                          key={place.place_id}
                          onClick={() => selectLocation(place)}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0 transition-colors"
                        >
                          <div className="text-[14.5px] font-bold text-slate-800 line-clamp-1 flex items-center gap-2">
                            <MapPin size={14} className="text-slate-400" />
                            {place.name || place.address.village || place.address.town || place.address.city || place.display_name.split(",")[0]}
                          </div>
                          <div className="text-[13px] text-slate-500 line-clamp-1 mt-1 pl-5">
                            {place.display_name}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : !isSearchingLocation && (
                    <div className="px-4 py-4 text-[14px] text-slate-500 text-center">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Total size */}
            <div className="flex flex-col gap-2">
              <label className="text-[15px] font-bold text-slate-800">
                <span>Total size (Acres) <span className="text-red-500">*</span></span>
              </label>
              <input 
                type="text" 
                inputMode="decimal"
                value={totalSize}
                onChange={(e) => {
                  setTotalSize(e.target.value);
                  if (errors.totalSize) setErrors(prev => ({ ...prev, totalSize: '' }));
                }}
                placeholder="8.5" 
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-[15px] font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-colors ${
                  errors.totalSize 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50/30' 
                    : 'border-slate-200/80 focus:border-green-600 focus:ring-green-500/20'
                }`}
              />
              {errors.totalSize && <span className="text-red-500 text-[13px] font-medium pl-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.totalSize}</span>}
            </div>

          </div>
        </div>

        {/* Additional Details */}
        <div className="px-4 py-3 pb-8 w-full">
          <h2 className="text-[17px] font-bold text-slate-900 mb-3 px-1">Additional Details</h2>
          <div className="bg-white rounded-2xl p-5 border border-slate-100/80 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col gap-6">
            
            {/* Water Source */}
            <div className="flex flex-col gap-3">
              <label className="text-[15px] font-bold text-slate-800">Main water source</label>
              <div className="flex flex-wrap gap-[10px]">
                {['Tube well', 'Canal', 'Rainfed'].map(source => (
                  <button
                    key={source}
                    onClick={() => setWaterSource(source)}
                    className={`px-4 py-[10px] rounded-[10px] text-[15px] font-bold transition-all ${
                      waterSource === source 
                        ? 'bg-[#238B50] text-white shadow-sm' 
                        : 'bg-[#ECF5EE] text-slate-800 hover:bg-[#d9ecd] active:scale-[0.98]'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </div>

            {/* Ownership Type */}
            <div className="flex flex-col gap-3">
              <label className="text-[15px] font-bold text-slate-800">Ownership type</label>
              <div className="flex flex-wrap gap-[10px]">
                {['Owned', 'Leased', 'Shared'].map(type => (
                  <button
                    key={type}
                    onClick={() => setOwnership(type)}
                    className={`px-4 py-[10px] rounded-[10px] text-[15px] font-bold transition-all ${
                      ownership === type 
                        ? 'bg-[#238B50] text-white shadow-sm' 
                        : 'bg-[#ECF5EE] text-slate-800 hover:bg-[#d9ecd] active:scale-[0.98]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Fixed Bottom Button Space Match */}
        <div className="h-[90px] w-full"></div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#F8FAF7] via-[#F8FAF7] to-white/0 pt-8 pb-6 flex justify-center pointer-events-none">
          <div className="w-full max-w-md pointer-events-auto">
            <button 
              onClick={handleSave}
              disabled={isSaving || success}
              className="w-full bg-[#238B50] text-white font-bold text-[17px] py-[18px] rounded-[14px] shadow-[0_4px_14px_rgba(35,139,80,0.3)] flex items-center justify-center gap-2 hover:bg-[#1E7A45] transition-all active:scale-[0.98] disabled:opacity-70">
              {isSaving ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Save Farm</span>
                  <ArrowRight size={20} className="stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
