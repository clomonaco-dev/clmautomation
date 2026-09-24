'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
export function NavigationReset(){
 const pathname=usePathname();
 useEffect(()=>{if(location.hash)return;window.scrollTo({top:0,left:0,behavior:'instant'});},[pathname]);
 return null;
}
