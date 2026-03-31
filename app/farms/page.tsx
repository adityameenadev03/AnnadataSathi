"use client";

import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  Pencil, 
  Plus, 
  Tractor,
  Home as HomeIcon, 
  LayoutGrid, 
  BookOpen, 
  Store 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Farm {
  id: string;
  name: string;
  location: string;
  sizeInAcres: number;
  _count: {
    crops: number;
  };
}

export default function MyFarmsPage() {
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const res = await fetch("/api/farms");
        if (res.ok) {
          const data = await res.json();
          setFarms(data);
        }
      } catch (err) {
        console.error("Failed to load farms", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFarms();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] pb-32">
      {/* Header */}
      <header className="bg-[#1e8f4c] text-white p-6 pt-12 rounded-b-[2rem] shadow-lg mb-6">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tight">My Farms</h1>
          <p className="text-green-100 opacity-90 text-sm mt-1">
            Manage your farm locations and details
          </p>
        </div>
      </header>

      <main className="px-5 flex flex-col gap-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-6 rounded-3xl animate-pulse h-32 border border-gray-100"></div>
            ))}
          </div>
        ) : farms.length > 0 ? (
          farms.map((farm) => (
            <div key={farm.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 relative group">
              <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c]">
                <MapPin className="w-7 h-7" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg truncate mb-0.5">{farm.name}</h3>
                <p className="text-xs text-gray-400 font-medium truncate mb-3">
                  {farm.sizeInAcres} Acres • {farm.location}
                </p>
                
                <div className={`inline-flex px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                   farm._count.crops > 0 ? 'bg-[#0081cc] text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {farm._count.crops} Active Crops
                </div>
              </div>

              <Link 
                href={`/farms/add?id=${farm.id}`}
                className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center text-[#1e8f4c] hover:bg-[#1e8f4c] hover:text-white transition-all shadow-sm"
              >
                <Pencil className="w-5 h-5" />
              </Link>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
               <Tractor className="w-8 h-8" />
             </div>
             <p className="text-gray-400 text-sm font-medium">No farms added yet.</p>
          </div>
        )}

        <Link 
          href="/farms/add"
          className="mt-4 flex items-center justify-center gap-2.5 w-full py-[18px] bg-[#1e8f4c] text-white rounded-[1.25rem] font-bold text-lg shadow-md hover:bg-[#1a7f43] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-6 h-6 border-2 border-white/40 rounded-full" />
          Add New Farm
        </Link>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-4 px-4 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Link href="/" className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <HomeIcon className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wide">Home</span>
        </Link>
        <Link href="/crops" className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <LayoutGrid className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wide">Crops</span>
        </Link>
        <Link href="/khata" className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <BookOpen className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wide">Khata</span>
        </Link>
        <Link href="/market" className="flex flex-col items-center gap-1.5 opacity-40 hover:opacity-100 transition-opacity">
          <Store className="w-6 h-6 text-gray-500" />
          <span className="text-[10px] font-bold text-gray-500 tracking-wide">Market</span>
        </Link>
      </nav>
    </div>
  );
}
