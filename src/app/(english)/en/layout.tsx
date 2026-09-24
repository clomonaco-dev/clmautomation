import '@/app/globals.css';
import { RootDocument } from '@/components/RootDocument';
export default function Layout({children}:{children:React.ReactNode}){return <RootDocument locale="en">{children}</RootDocument>;}
