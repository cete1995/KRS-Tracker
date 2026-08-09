import { compareGrades } from "./grades";
import type { Course, CourseStatus, History, Prerequisite, Track } from "./types";
export interface EligibilityInput { course:Course; history:History[]; plannedIds:string[]; offeredIds:string[]; studentTrack:Track; currentCredits:number; creditLimit:number; allCourses?:Course[] }
export interface EligibilityResult { eligible:boolean; status:CourseStatus; reasons:string[]; warnings:string[] }
export function evaluateCourseEligibility(i:EligibilityInput):EligibilityResult {
 const reasons:string[]=[]; const warnings:string[]=[]; let status:CourseStatus="AVAILABLE";
 if(i.course.active===false){reasons.push("Mata kuliah tidak aktif");status="NOT_AVAILABLE"}
 if(!i.offeredIds.includes(i.course.id)){reasons.push("Tidak ditawarkan pada periode yang dipilih");status="NOT_OFFERED"}
 const passed=i.history.find(h=>h.courseId===i.course.id&&h.status==="PASSED");
 if(passed&&!i.course.repeatable){reasons.push("Mata kuliah sudah pernah lulus");status="NOT_AVAILABLE"}
 if(!["GENERAL","BOTH",i.studentTrack].includes(i.course.track)){reasons.push(`Mata kuliah khusus jalur ${i.course.track}`);status="TRACK_MISMATCH"}
 for(const p of i.course.prerequisites??[]){const prior=i.history.find(h=>h.courseId===p.prerequisiteCourseId&&h.status==="PASSED");const name=i.allCourses?.find(c=>c.id===p.prerequisiteCourseId)?.name??p.prerequisiteCourseId; if(p.relationshipType==="PREREQUISITE"&&(!prior||!compareGrades(prior.grade,p.minimumGrade??"C"))){reasons.push(`Belum lulus ${name} dengan nilai minimal ${p.minimumGrade??"C"}`);status="BLOCKED_BY_PREREQUISITE"} if(p.relationshipType==="COREQUISITE"&&!prior&&!i.plannedIds.includes(p.prerequisiteCourseId)){reasons.push(`${name} harus pernah lulus atau direncanakan bersama`);status="BLOCKED_BY_PREREQUISITE"} if(p.relationshipType==="RECOMMENDED_BEFORE"&&!prior)warnings.push(`Disarankan menempuh ${name} lebih dahulu`)}
 if(i.currentCredits+i.course.credits>i.creditLimit){reasons.push(`Melebihi batas ${i.creditLimit} SKS`)}
 return {eligible:reasons.length===0,status:reasons.length?status:(i.course.status==="RECOMMENDED"?"RECOMMENDED":"AVAILABLE"),reasons,warnings};
}
export const calculateCreditLimit=(ips:number,rules={under2:18,under25:20,under3:22,atLeast3:24})=>ips<2?rules.under2:ips<2.5?rules.under25:ips<3?rules.under3:rules.atLeast3;
export const calculateGraduationProgress=(passed:number,required:number)=>({passed,required,percentage:Math.min(100,Math.round(passed/required*100))});
export function detectPrerequisiteCycle(relations:Pick<Prerequisite,"courseId"|"prerequisiteCourseId">[],candidate?:Pick<Prerequisite,"courseId"|"prerequisiteCourseId">){const rs=candidate?[...relations,candidate]:relations;const graph=new Map<string,string[]>();rs.forEach(r=>graph.set(r.prerequisiteCourseId,[...(graph.get(r.prerequisiteCourseId)??[]),r.courseId]));const visiting=new Set<string>(),visited=new Set<string>();function dfs(n:string):boolean{if(visiting.has(n))return true;if(visited.has(n))return false;visiting.add(n);for(const next of graph.get(n)??[])if(dfs(next))return true;visiting.delete(n);visited.add(n);return false}return [...graph.keys()].some(dfs)}
