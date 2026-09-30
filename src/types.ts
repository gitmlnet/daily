export type SyllabusEntry={id:string;name:string;papers:{id:string;name:string;chapters:{id:string;name:string}[]}[]};
export type StudySession={id:string;date:string;subjectId:string;paperId:string;chapterId:string;start:string;end:string;duration:number;topic:string;progress?:number;createdAt:string;updatedAt:string};
export type Reminder={enabled:boolean;time?:string;repeat:"none"|"hourly"};
export type StudyPlan={id:string;date:string;subjectId:string;paperId:string;chapterId:string;topic:string;reminder:Reminder;createdAt:string;updatedAt:string};
export type AppData={version:1;sessions:StudySession[];plans:StudyPlan[];settings:{theme:"light"|"dark"}};