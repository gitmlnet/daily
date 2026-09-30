import type { AppData, StudySession } from "../types";
import { getSubject,getPaper,getChapter } from "../data/syllabus";

function download(name:string,body:string,type:string){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
export function exportJson(data:AppData){download("hsc-study-tracker-backup.json",JSON.stringify(data,null,2),"application/json")}
export function exportCsv(rows:StudySession[]){const head=["Date","Subject","Paper","Chapter","From","To","Duration (min)","Topic"];const q=(v:unknown)=>`"${String(v??"").replaceAll('"','""')}"`;const lines=rows.map(s=>{const paper=getPaper(s.subjectId,s.paperId);return [s.date,getSubject(s.subjectId)?.name,paper?.name,getChapter(s.subjectId,s.paperId,s.chapterId)?.name,s.start,s.end,s.duration,s.topic].map(q).join(",")});download("hsc-study-history.csv",[head.map(q).join(","),...lines].join("\n"),"text/csv;charset=utf-8")}
export function parseBackup(raw:string):AppData{
 const parsed=JSON.parse(raw);
 if(!parsed||parsed.version!==1||!Array.isArray(parsed.sessions)||!Array.isArray(parsed.plans))throw new Error("Invalid backup structure");
 const safePlan=(p:any)=>p&&typeof p.id==="string"&&typeof p.date==="string"&&typeof p.subjectId==="string"&&typeof p.paperId==="string"&&typeof p.chapterId==="string"&&typeof p.topic==="string"&&Number.isInteger(p.progress)&&p.progress>=0&&p.progress<=100&&p.reminder&&typeof p.reminder.enabled==="boolean";
 const safeSession=(s:any)=>s&&typeof s.id==="string"&&typeof s.date==="string"&&typeof s.subjectId==="string"&&typeof s.paperId==="string"&&typeof s.chapterId==="string"&&typeof s.start==="string"&&typeof s.end==="string"&&Number.isFinite(s.duration)&&s.duration>0&&typeof s.topic==="string";
 if(!parsed.sessions.every(safeSession)||!parsed.plans.every(safePlan))throw new Error("Backup contains invalid records");
 return {version:1,sessions:parsed.sessions,plans:parsed.plans,settings:{theme:parsed.settings?.theme==="dark"?"dark":"light"}};
}
