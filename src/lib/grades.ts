import type { Grade } from "./types";
const gradePoints: Record<Grade,number> = {A:4,"A-":3.7,"B+":3.3,B:3,"B-":2.7,"C+":2.3,C:2,D:1,E:0};
export const compareGrades=(actual:Grade,minimum:Grade)=>gradePoints[actual]>=gradePoints[minimum];
export const isPassingGrade=(grade:Grade,minimum:Grade="C")=>compareGrades(grade,minimum);
export const sortGrades=(grades:Grade[])=>[...grades].sort((a,b)=>gradePoints[b]-gradePoints[a]);
