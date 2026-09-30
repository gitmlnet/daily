import type { Dispatch,SetStateAction } from "react";
import { getPaper,getSubject,syllabus } from "../data/syllabus";
export function StudyFields({subjectId,setSubject,paperId,setPaper,chapterId,setChapter}:{subjectId:string;setSubject:Dispatch<SetStateAction<string>>;paperId:string;setPaper:Dispatch<SetStateAction<string>>;chapterId:string;setChapter:Dispatch<SetStateAction<string>>}){
 const subject=getSubject(subjectId),paper=getPaper(subjectId,paperId);
 return <><label className="field"><span>Subject</span><select value={subjectId} onChange={e=>{setSubject(e.target.value);setPaper("");setChapter("")}}><option value="">Choose subject</option>{syllabus.map(s=><option value={s.id} key={s.id}>{s.name}</option>)}</select></label>
 <label className="field"><span>Paper</span><select value={paperId} disabled={!subject} onChange={e=>{setPaper(e.target.value);setChapter("")}}><option value="">Choose paper</option>{subject?.papers.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>
 <label className="field"><span>Chapter</span><select value={chapterId} disabled={!paper} onChange={e=>setChapter(e.target.value)}><option value="">{paper?"Choose chapter":"Select subject and paper first"}</option>{paper?.chapters.map(c=><option value={c.id} key={c.id}>{c.name}</option>)}</select></label></>
}
export function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
