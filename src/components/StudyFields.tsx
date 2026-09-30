import { useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import { Search, ChevronDown, Check } from "lucide-react";
import { getPaper, getSubject, syllabus } from "../data/syllabus";

function Picker({label,value,placeholder,disabled,items,onChange}:{label:string;value:string;placeholder:string;disabled?:boolean;items:{id:string;label:string}[];onChange:(id:string)=>void}){
  const [open,setOpen]=useState(false),[q,setQ]=useState("");
  const selected=items.find(x=>x.id===value);
  const filtered=items.filter(x=>x.label.toLowerCase().includes(q.toLowerCase()));
  return <div className="field picker-field">
    <span>{label}</span>
    <div className="picker">
      <button type="button" className={"picker-trigger "+(open?"open":"")} disabled={disabled} onClick={()=>{setOpen(v=>!v);setQ("")}} aria-haspopup="listbox" aria-expanded={open}>
        <span>{selected?.label||placeholder}</span><ChevronDown size={17}/>
      </button>
      {open&&!disabled&&<div className="picker-menu" role="listbox">
        <div className="picker-search"><Search size={15}/><input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder={"Search "+label.toLowerCase()+"…"} onKeyDown={e=>{if(e.key==="Escape")setOpen(false)}}/></div>
        <div className="picker-options">{filtered.length?filtered.map(item=><button type="button" role="option" aria-selected={item.id===value} key={item.id} onClick={()=>{onChange(item.id);setOpen(false);setQ("")}}><span>{item.label}</span>{item.id===value&&<Check size={15}/>}</button>):<div className="picker-empty">No matches found.</div>}</div>
      </div>}
    </div>
  </div>
}

const subjectPaperItems=syllabus.flatMap(subject=>subject.papers.map(paper=>({
  id:`${subject.id}::${paper.id}`,
  subjectId:subject.id,
  paperId:paper.id,
  label:`${subject.name} ${paper.name}`
})));

export function subjectPaperOptions(){return subjectPaperItems.map(({id,label})=>({id,label}))}

export function StudyFields({subjectId,setSubject,paperId,setPaper,chapterId,setChapter}:{subjectId:string;setSubject:Dispatch<SetStateAction<string>>;paperId:string;setPaper:Dispatch<SetStateAction<string>>;chapterId:string;setChapter:Dispatch<SetStateAction<string>>}){
  const subject=getSubject(subjectId),paper=getPaper(subjectId,paperId);
  const combinedValue=subjectId&&paperId?`${subjectId}::${paperId}`:"";
  return <>
    <Picker label="Subject" value={combinedValue} placeholder="Choose subject" items={subjectPaperItems.map(({id,label})=>({id,label}))} onChange={id=>{
      const item=subjectPaperItems.find(x=>x.id===id);
      if(!item)return;
      setSubject(item.subjectId);setPaper(item.paperId);setChapter("");
    }}/>
    <Picker label="Chapter" value={chapterId} placeholder={paper?"Choose chapter":"Choose a subject first"} disabled={!paper} items={paper?.chapters.map(c=>({id:c.id,label:c.name}))||[]} onChange={setChapter}/>
  </>;
}

export function Field({label,children}:{label:string;children:ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
