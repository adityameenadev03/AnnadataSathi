import { auth } from "@/lib/auth/server";
import Link from "next/link";
import Image from "next/image";
import { 
  Tractor, 
  CloudSun, 
  AlertTriangle, 
  PlusCircle, 
  Sprout, 
  Wallet, 
  Scan, 
  MapPin,
  Home as HomeIcon, 
  LayoutGrid, 
  BookOpen, 
  Store 
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-white min-h-screen p-6">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[#1e8f4c] rounded-2xl flex items-center justify-center shadow-lg mb-8 rotate-3">
             <Tractor className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Annadata Sathi</h1>
          <p className="text-gray-600 mb-10 leading-relaxed text-lg">
            Empowering farmers with smart insights, simplified tracking, and expert agricultural advice.
          </p>
          
          <div className="flex flex-col w-full gap-4">
            <Link 
              href="/sign-in" 
              className="w-full py-4 bg-[#1e8f4c] text-white rounded-xl font-bold text-lg shadow-md hover:bg-[#1a7f43] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In to Your Farm
            </Link>
            <Link 
              href="/auth/sign-up" 
              className="w-full py-4 border-2 border-gray-100 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Join Our Community
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8faf8] pb-24">
      {/* Header */}
      <header className="bg-[#1e8f4c] text-white p-6 pt-12 rounded-b-[2.5rem] shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">Good Morning, {session.user.name?.split(' ')[0]}!</h1>
            <p className="text-green-100 opacity-90 text-sm flex items-center gap-1.5 mt-0.5">
              Rampur Farm • <span className="font-medium text-white italic">22°C Clear</span>
            </p>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-white/30 overflow-hidden shadow-inner">
               <Image 
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100" 
                alt="Profile" 
                width={48} 
                height={48} 
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="px-5 py-6 flex flex-col gap-8">
        {/* Weather Section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 ml-1">Today&apos;s Weather</h2>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
                  <CloudSun className="w-8 h-8" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-gray-900 tracking-tighter">22°C</span>
                  <span className="text-xs text-gray-400 font-medium leading-none">Clear sky with light breeze</span>
                </div>
              </div>
              <div className="bg-[#e8f5ed] px-3 py-1.5 rounded-full text-[10px] font-bold text-[#1e8f4c] uppercase tracking-wider">
                Good for field work
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { day: "Tomorrow", rain: "20", color: "bg-green-50 text-green-600" },
                { day: "Day 2", rain: "80", color: "bg-blue-50 text-blue-600" },
                { day: "Day 3", rain: "60", color: "bg-blue-50 text-blue-600" }
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-2xl p-3 flex flex-col items-center gap-1 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{item.day}</span>
                  <span className={`text-sm font-black ${item.color.split(' ')[1]}`}>{item.rain}% rain</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Priority Alert Banner */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#f2994a] to-[#f2c94c] rounded-[2rem] p-7 shadow-md">
          <div className="absolute top-[-10%] right-[-5%] opacity-10">
             <AlertTriangle className="w-40 h-40" />
          </div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest shadow-sm">Priority Alert</span>
          </div>
          <h3 className="text-white text-xl font-extrabold mb-2 leading-tight">
            Heavy rain expected in 2 days
          </h3>
          <p className="text-white/90 text-xs font-medium leading-relaxed mb-6 max-w-[85%]">
            Plan spraying early and protect open inputs before the rain arrives.
          </p>
          <button className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold text-sm shadow-sm hover:scale-[1.02] transition-transform active:scale-[0.98]">
            View What To Do
          </button>
        </section>

        {/* Active Crop Summary */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center ml-1">
            <h2 className="text-lg font-bold text-gray-900">Active Crop Summary</h2>
            <Link href="/crops" className="text-[#1e8f4c] text-xs font-bold hover:underline">View All Crops</Link>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden relative">
                   <Image 
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=150" 
                    alt="Wheat" 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-gray-900">Wheat (Plot A)</h4>
                    <div className="bg-[#0081cc] px-2.5 py-1 rounded-lg text-[9px] font-bold text-white uppercase tracking-wider">Tillering</div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-medium">Day 21 / 120</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-[10px] font-bold text-gray-400">
                  <span>Progress</span>
                  <span className="text-gray-900">99 days left</span>
                </div>
                <div className="w-full h-1.5 bg-green-50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#1e8f4c] rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-[#f0f4f0] rounded-2xl p-4 flex items-center justify-between border border-gray-100">
              <div className="flex flex-col">
                <h4 className="font-bold text-gray-900 text-sm">Mustard (Plot B)</h4>
                <span className="text-[10px] text-gray-500 font-medium mt-0.5">Day 34 / 110 • Vegetative stage</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-[#1e8f4c]">31%</span>
                <div className="w-16 h-1 bg-white rounded-full mt-1.5 overflow-hidden">
                   <div className="h-full bg-[#1e8f4c]" style={{ width: '31%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900 ml-1">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/farms" className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c] group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-sm">My Farms</span>
            </Link>
            <Link href="/farms/add" className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c] group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-sm">Add Farm</span>
            </Link>
            <Link href="/crops/add" className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c] group-hover:scale-110 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-sm">Add Crop</span>
            </Link>
            <Link href="/khata/add" className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c] group-hover:scale-110 transition-transform">
                <Wallet className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-sm">Add Expense</span>
            </Link>
            <Link href="/ai-check" className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-4 group hover:border-green-200 transition-colors">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-[#1e8f4c] group-hover:scale-110 transition-transform">
                <Scan className="w-6 h-6" />
              </div>
              <span className="font-bold text-gray-800 text-sm">AI Check</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around py-4 px-4 z-50 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <Link href="/" className="flex flex-col items-center gap-1.5">
          <HomeIcon className="w-6 h-6 text-[#1e8f4c]" />
          <span className="text-[10px] font-bold text-[#1e8f4c] tracking-wide">Home</span>
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
