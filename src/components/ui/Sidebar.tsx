"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, PlusCircle, LogOut, Map, Wallet } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { twMerge } from 'tailwind-merge';

const LINKS = [
  { name: "Inicio", href: "/dashboard", icon: Home },
  { name: "Mis Rutinas", href: "/dashboard/routines", icon: PlusCircle },
  { name: "Explorar", href: "/dashboard/explore", icon: Compass },
  { name: "Mis Viajes", href: "/dashboard/trips", icon: Map },
  { name: "Billetera", href: "/dashboard/wallet", icon: Wallet },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-[#050505] border-r border-white/5 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-neon-cyan flex items-center justify-center">
          <span className="font-bold text-white text-lg">C</span>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">Carpol</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {LINKS.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard');
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={twMerge(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-brand/10 text-brand-light font-medium border border-brand/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-white/5">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-3 w-full rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
