export type Track = "AI" | "FSD" | "GENERAL" | "BOTH";
export type Category = "CORE" | "AI_TRACK" | "FSD_TRACK" | "UNIVERSITY" | "ENTREPRENEURSHIP" | "INTERDISCIPLINARY" | "CREDENTIAL" | "ENRICHMENT" | "ELECTIVE" | "FINAL_PROJECT";
export type CourseStatus = "NOT_AVAILABLE" | "AVAILABLE" | "RECOMMENDED" | "PLANNED" | "IN_PROGRESS" | "PASSED" | "FAILED" | "BLOCKED_BY_PREREQUISITE" | "NOT_OFFERED" | "TRACK_MISMATCH";
export type Grade = "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "E";
export type RelationType = "PREREQUISITE" | "COREQUISITE" | "RECOMMENDED_BEFORE";
export interface Course { id:string; code:string; name:string; credits:number; semester:number; category:Category; track:Track; description?:string; active?:boolean; repeatable?:boolean; status:CourseStatus; prerequisites?: Prerequisite[] }
export interface Prerequisite { courseId:string; prerequisiteCourseId:string; relationshipType:RelationType; minimumGrade?:Grade }
export interface History { courseId:string; grade:Grade; status:"PASSED"|"FAILED"; period:string }
