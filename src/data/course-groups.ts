import {courses} from "./courses";
export type RequirementGroupType="INTERDISCIPLINARY"|"ELECTIVE";
export interface CourseRequirementGroup {id:string;code:string;name:string;type:RequirementGroupType;requiredCredits:number;description:string;courseIds:string[]}
export const requirementGroups:CourseRequirementGroup[]=[
 {id:"interdisciplinary",code:"INT",name:"Mata Kuliah Interdisipliner",type:"INTERDISCIPLINARY",requiredCredits:6,description:"Mata kuliah lintas disiplin yang diakui sebagai pemenuhan komponen interdisipliner kurikulum.",courseIds:courses.filter(c=>c.category==="INTERDISCIPLINARY").map(c=>c.id)},
 {id:"elective",code:"ELC",name:"Mata Kuliah Elektif",type:"ELECTIVE",requiredCredits:9,description:"Mata kuliah pilihan yang diakui untuk memenuhi komponen elektif program studi.",courseIds:courses.filter(c=>c.category==="ELECTIVE").map(c=>c.id)},
];
