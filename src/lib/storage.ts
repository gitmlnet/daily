import type { AppData } from "../types";

const DB_NAME="hsc-study-tracker";
const STORE="state";
const KEY="app";
export const emptyData:AppData={version:1,sessions:[],plans:[],settings:{theme:"light"}};

function openDb(){return new Promise<IDBDatabase>((resolve,reject)=>{const req=indexedDB.open(DB_NAME,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);})}
export async function loadData():Promise<AppData>{
 try{const db=await openDb();return await new Promise((resolve,reject)=>{const req=db.transaction(STORE).objectStore(STORE).get(KEY);req.onsuccess=()=>resolve(req.result||emptyData);req.onerror=()=>reject(req.error)}) as AppData}
 catch{const raw=localStorage.getItem("hsc-study-tracker-fallback");return raw?JSON.parse(raw) as AppData:emptyData}
}
export async function saveData(data:AppData){try{const db=await openDb();await new Promise<void>((resolve,reject)=>{const req=db.transaction(STORE,"readwrite").objectStore(STORE).put(data,KEY);req.onsuccess=()=>resolve();req.onerror=()=>reject(req.error)})}catch{localStorage.setItem("hsc-study-tracker-fallback",JSON.stringify(data))}}
export const uid=()=>globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`;
export const localDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`};
export function addDays(date:string,days:number){const d=new Date(date+"T12:00:00");d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
export function minutesBetween(start:string,end:string){const [sh,sm]=start.split(":").map(Number),[eh,em]=end.split(":").map(Number);let a=sh*60+sm,b=eh*60+em;if(b<=a)b+=1440;return b-a}
export function formatDuration(total:number){const h=Math.floor(total/60),m=total%60;return h?m?`${h} hr ${m} min`:`${h} hr`:`${m} min`}
export function formatTime(value:string){const [h,m]=value.split(":").map(Number);return `${h%12||12}:${String(m).padStart(2,"0")} ${h>=12?"PM":"AM"}`}
