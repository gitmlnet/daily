import type { SyllabusEntry } from "../types";

const chapters=(prefix:string,names:string[])=>names.map((name,i)=>({id:`${prefix}-${i+1}`,name}));

export const syllabus:SyllabusEntry[]=[
{id:"physics",name:"Physics",papers:[
{id:"physics-1",name:"1st Paper",chapters:chapters("phy1",[
"Physical World and Measurement","Vector","Dynamics","Newtonian Mechanics","Work, Energy and Power","Gravitation and Gravity","Structural Properties of Matter","Periodic Motion","Wave","Ideal Gas and Kinetic Theory of Gases"])},
{id:"physics-2",name:"2nd Paper",chapters:chapters("phy2",[
"Thermodynamics","Electrostatics","Current Electricity","Magnetic Effect of Electric Current and Magnetism","Electromagnetic Induction and Alternating Current","Geometrical Optics","Physical Optics","Introduction to Modern Physics","Atomic Model and Nuclear Physics","Semiconductor and Electronics","Astrophysics"])}]},
{id:"chemistry",name:"Chemistry",papers:[
{id:"chemistry-1",name:"1st Paper",chapters:chapters("che1",[
"Safe Use of Laboratory","Qualitative Chemistry","Periodic Properties and Chemical Bonding of Elements","Chemical Changes","Vocational Chemistry"])},
{id:"chemistry-2",name:"2nd Paper",chapters:chapters("che2",[
"Environmental Chemistry","Organic Chemistry","Quantitative Chemistry","Electrochemistry","Economic Chemistry"])}]},
{id:"biology",name:"Biology",papers:[
{id:"biology-1",name:"1st Paper",chapters:chapters("bio1",[
"Cell and Its Structure","Cell Division","Cell Chemistry","Microorganisms","Algae and Fungi","Bryophyta and Pteridophyta","Gymnosperms and Angiosperms","Tissue and Tissue System","Plant Physiology","Plant Reproduction","Biotechnology","Environment, Distribution and Conservation of Organisms"])},
{id:"biology-2",name:"2nd Paper",chapters:chapters("bio2",[
"Animal Diversity and Classification","Introduction to Animals","Digestion and Absorption","Blood and Circulation","Breathing and Respiration","Wastes and Excretion","Locomotion and Movement","Coordination and Nervous System","Human Reproduction","Immunity","Genetics and Evolution"])}]},
{id:"higher-math",name:"Higher Mathematics",papers:[
{id:"math-1",name:"1st Paper",chapters:chapters("math1",[
"Matrices and Determinants","Vector","Straight Lines","Circle","Permutation and Combination","Trigonometric Ratios","Trigonometric Ratios of Associated Angles","Functions and Graph of Functions","Differentiation","Integration"])},
{id:"math-2",name:"2nd Paper",chapters:chapters("math2",[
"Real Numbers and Inequalities","Linear Programming","Complex Numbers","Polynomial and Polynomial Equations","Binomial Expansion","Conics","Inverse Trigonometric Functions and Trigonometric Equations","Statics","Motion of Particle in a Straight Line or Plane","Measures of Dispersion and Probability"])}]}
];

export const getSubject=(id:string)=>syllabus.find(s=>s.id===id);
export const getPaper=(subjectId:string,paperId:string)=>getSubject(subjectId)?.papers.find(p=>p.id===paperId);
export const getChapter=(subjectId:string,paperId:string,chapterId:string)=>getPaper(subjectId,paperId)?.chapters.find(c=>c.id===chapterId);