import { useState } from "react";
import type { Dispatch,SetStateAction } from "react";
import { Search,ChevronDown,Check } from "lucide-react";
import { getPaper,getSubject,syllabus } from "../data/syllabus";

function Picker({label,value,placeholder,disabled,items,onChange}:{label:string;value:string;placeholder:string;disabled?:boolean;items:{id:string;label:string}[];onChange:(id:string)=>void}){
 const [open,setOpen]=useState(false),[q,setQ]=useState("");
 const selected=items.find(x=>x.id===value),filtered=items.filter(x=>x.label.toLowerCase().includes(q.toLowerCase()));
 return <div className="field picker-field"><span>{label}</span><div className="picker">
 <button type="button" className={"picker-trigger "+(open?"open":"")} disabled={disabled} onClick={()=>{setOpen(v=>!v);setQ("")}} aria-haspopup="listbox" aria-expanded={open}><span>{selected?.label||placeholder}</span><ChevronDown size={17}/></button>
 {open&&!disabled&&<div className="picker-menu" role="listbox"><div className="picker-search"><Search size={15}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={"Search "+label.toLowerCase()+"…"} onKeyDown={e=>{if(e.key==="Escape")setOpen(false)}}/></div><div className="picker-options">{filtered.length?filtered.map(item=><button type="button" role="option" aria-selected={item.id===value} key={item.id} onClick={()=>{onChange(item.id);setOpen(false);setQ("")}}><span>{item.label}</span>{item.id===value&&<Check size={15}/>}</button>):<div className="picker-empty">No matches found.</div>}</div></div>}
 </div></div>
}
export function StudyFields({subjectId,setSubject,paperId,setPaper,chapterId,setChapter}:{subjectId:string;setSubject:Dispatch<SetStateAction<string>>;paperId:string;setPaper:Dispatch<SetStateAction<string>>;chapterId:string;setChapter:Dispatch<SetStateAction<string>>}){
 const subject=getSubject(subjectId),paper=getPaper(subjectId,paperId);
 return <><Picker label="Subject" value={subjectId} placeholder="Choose subject" items={syllabus.map(s=>({id:s.id,label:s.name}))} onChange={id=>{setSubject(id);setPaper("");setChapter("")}}/>
 <Picker label="Paper" value={paperId} placeholder="Choose paper" disabled={!subject} items={subject?.papers.map(p=>({id:p.id,label:p.name}))||[]} onChange={id=>{setPaper(id);setChapter("")}}/>
 <Picker label="Chapter" value={chapterId} placeholder={paper?"Choose chapter":"Select subject and paper first"} disabled={!paper} items={paper?.chapters.map(c=>({id:c.id,label:c.name}))||[]} onChange={setChapter}/></>
}