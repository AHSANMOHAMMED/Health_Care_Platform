import { useState } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Clock, 
  Phone, 
  CheckCircle2, 
  ShieldCheck, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  Filter,
  Star,
  Activity
} from 'lucide-react';

interface Pharmacy {
  id: number;
  name: string;
  address: string;
  distance: string;
  isOpen: boolean;
  closingTime: string;
  rating: number;
  deliveryAvailable: boolean;
  phone: string;
  stockLevel: 'high' | 'medium' | 'low';
}

export default function PharmacyLocator() {
  const [pharmacies] = useState<Pharmacy[]>([
    { id: 1, name: "City Health Pharmacy", address: "45 Galle Road, Colombo 03", distance: "0.8 km", isOpen: true, closingTime: "10:00 PM", rating: 4.8, deliveryAvailable: true, phone: "+94 11 234 5678", stockLevel: 'high' },
    { id: 2, name: "MediStore Galle", address: "12 Main St, Galle", distance: "2.5 km", isOpen: true, closingTime: "09:00 PM", rating: 4.5, deliveryAvailable: false, phone: "+94 91 222 3344", stockLevel: 'medium' },
    { id: 3, name: "24/7 Wellness Pharamcy", address: "89 hospital lane, Kandy", distance: "5.1 km", isOpen: true, closingTime: "Open 24/7", rating: 4.9, deliveryAvailable: true, phone: "+94 81 555 6677", stockLevel: 'high' }
  ]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <MapPin className="text-indigo-600" /> Pharmacy Locator
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Find nearby certified pharmacies and check medication availability.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-bold shadow-md flex items-center gap-2">
              <MapPin size={20}/> Map View
           </button>
           <button className="px-6 py-3 text-slate-500 font-bold hover:text-slate-700">List View</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Search & List Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex gap-4">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="text" placeholder="Search by area or medication..." className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-indigo-100 outline-none shadow-sm" />
             </div>
             <button className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
                <Filter size={20} />
             </button>
          </div>

          <div className="grid gap-6">
             {pharmacies.map(pharmacy => (
               <div key={pharmacy.id} className="premium-glass p-8 group hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                     <div className="flex gap-6">
                        <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 shadow-inner group-hover:scale-105 transition-transform duration-500">
                           <ShoppingBag size={32} />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{pharmacy.name}</h3>
                              {pharmacy.isOpen && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 animasi-pulse">Open Now</span>}
                           </div>
                           <p className="text-slate-500 font-bold flex items-center gap-2 mb-3">
                              <MapPin size={16} className="text-slate-400" /> {pharmacy.address}
                           </p>
                           <div className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-widest">
                              <span className="flex items-center gap-1.5 text-slate-400"><Navigation size={14}/> {pharmacy.distance}</span>
                              <span className="flex items-center gap-1.5 text-slate-400"><Clock size={14}/> {pharmacy.closingTime}</span>
                              <span className="flex items-center gap-1.5 text-amber-500"><Star size={14} fill="currentColor"/> {pharmacy.rating}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex md:flex-col justify-end gap-3 min-w-[140px]">
                        <button className="flex-1 md:flex-none py-3 px-6 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                           Navigate
                        </button>
                        <div className="flex gap-2">
                           {pharmacy.deliveryAvailable && (
                             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl" title="Delivery Available">
                                <Truck size={20} />
                             </div>
                           )}
                           <div className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 hover:bg-slate-100 transition-colors">
                              <Phone size={20} />
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Availability Bar snippet */}
                  <div className="mt-8 pt-8 border-t border-slate-100 flex items-center justify-between">
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">In-Stock Availability</span>
                     <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className={`w-3 h-1.5 rounded-full ${i <= (pharmacy.stockLevel === 'high' ? 5 : pharmacy.stockLevel === 'medium' ? 3 : 1) ? 'bg-emerald-500' : 'bg-slate-100'}`}></div>
                           ))}
                        </div>
                        <span className={`text-[10px] font-black uppercase ${pharmacy.stockLevel === 'high' ? 'text-emerald-500' : 'text-amber-500'}`}>{pharmacy.stockLevel} STOCK</span>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="premium-glass p-8 bg-slate-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
              <ShieldCheck className="h-12 w-12 text-indigo-400 mb-6" />
              <h2 className="text-2xl font-black mb-4">Upload Prescription</h2>
              <p className="text-slate-400 font-medium mb-8">Send your digital prescription directly to a nearby pharmacy for instant fulfillment.</p>
              <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl transition-all shadow-xl text-lg flex items-center justify-center gap-2">
                 Upload Paper <ArrowRight size={20} />
              </button>
           </div>

           <div className="premium-glass p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Activity className="text-emerald-500" /> Current Services
              </h3>
              <div className="space-y-4">
                 {[ 
                   'E-Pharmacy Delivery', 
                   'Senior Citizen Discount', 
                   'Insurance Claim Processing',
                   'Medication History Sync'
                 ].map((service, i) => (
                   <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <CheckCircle2 size={16} className="text-emerald-500" /> {service}
                   </div>
                 ))}
              </div>
           </div>

           <div className="premium-glass p-8 bg-white border-2 border-indigo-50 text-center">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 scale-110">
                 <Truck size={28} />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">Express Delivery</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">Medications delivered to your doorstep within <span className="font-black text-indigo-600">90 Minutes</span> in Colombo areas.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
