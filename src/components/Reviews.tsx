'use client';
import { useEffect, useState } from 'react';
import { dictionary } from '@/lib/content';
import { mapsUrl, type Locale } from '@/lib/routes';
type Review={author:string;authorUri?:string;text:string;rating:number;publishedAt:string};
type ReviewsData={rating:number;userRatingCount:number;googleMapsUri:string;reviews:Review[]};
const safeLink=(s?:string)=>s?.startsWith('https://')?s:undefined;
function stars(rating:number){const n=Math.min(5,Math.max(0,Math.round(rating)));return '★'.repeat(n)+'☆'.repeat(5-n);}
export function Reviews({locale}:{locale:Locale}) {
 const t=dictionary(locale); const en=locale==='en';const [data,setData]=useState<ReviewsData|null>(null);const [status,setStatus]=useState('loading');const [attempt,setAttempt]=useState(0);
 useEffect(()=>{const controller=new AbortController();setStatus('loading');setData(null);const timer=setTimeout(()=>controller.abort(),15000);
 fetch('/.netlify/functions/google-reviews?lang='+locale,{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error();return r.json();}).then(value=>{if(!Array.isArray(value.reviews)||!Number.isFinite(value.rating)||!Number.isFinite(value.userRatingCount))throw new Error();setData({...value,reviews:value.reviews.filter((r:Review)=>typeof r.author==='string'&&typeof r.text==='string'&&Number.isFinite(r.rating))});setStatus('ready');}).catch(()=>{setStatus('error');}).finally(()=>clearTimeout(timer));
 return()=>{clearTimeout(timer);controller.abort();};},[locale,attempt]);
 return <section className="section shell reviews"><div className="section-heading"><div><p className="eyebrow">Google Reviews</p><h2>{t.reviews}</h2></div><a className="text-link" href={safeLink(data?.googleMapsUri)||mapsUrl} target="_blank" rel="noopener noreferrer">{t.reviewsLink} ↗</a></div>
 {data&&data.reviews.length>0?<><p className="review-score"><strong>{data.rating.toLocaleString(locale,{minimumFractionDigits:1,maximumFractionDigits:1})}</strong> / 5 · {data.userRatingCount} {t.reviewCount} <span>Google</span></p><div className="card-grid">{data.reviews.map((r,i)=><blockquote className="review-card" key={r.author+i}><div className="review-stars" aria-label={r.rating+' / 5'}>{stars(r.rating)}</div>{r.text.length>300?<><p>{r.text.slice(0,300)}…</p><details><summary>{en?'Read the full review':'Leggi la recensione completa'}</summary><p>{r.text}</p></details></>:<p>{r.text|| (en?'Rating without written review.':'Valutazione senza commento.')}</p>}<footer><strong>{safeLink(r.authorUri)?<a href={safeLink(r.authorUri)} target="_blank" rel="noopener noreferrer">{r.author}</a>:r.author}</strong><span>{r.publishedAt}</span><span>Google</span></footer></blockquote>)}</div></>:<div className="reviews-status"><p role="status">{status==='loading'?(en?'Loading Google reviews…':'Caricamento delle recensioni Google…'):status==='error'?(en?'Reviews are temporarily unavailable. You can still read them on Google.':'Le recensioni non sono al momento disponibili qui. Puoi leggerle sul profilo Google.'):(en?'No reviews available yet.':'Non ci sono ancora recensioni disponibili.')}</p>{status==='error'&&<button className="button button-outline" onClick={()=>setAttempt(n=>n+1)}>{en?'Try again':'Riprova'}</button>}</div>}
 </section>;
}
