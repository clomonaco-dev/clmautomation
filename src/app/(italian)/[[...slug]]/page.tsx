import { notFound } from 'next/navigation';
import { Site } from '@/components/Site';
import { routes, isRoute } from '@/lib/routes';
import { metadataFor } from '@/lib/metadata';
type Props={params:Promise<{slug?:string[]}>};
export const dynamicParams=false;
export function generateStaticParams(){return routes.map(route=>({slug:route?[route]:[]}));}
export async function generateMetadata({params}:Props){const route=(await params).slug?.join('/')??'';if(!isRoute(route))notFound();return metadataFor('it',route);}
export default async function Page({params}:Props){const route=(await params).slug?.join('/')??'';if(!isRoute(route))notFound();return <Site locale="it" route={route}/>;}
