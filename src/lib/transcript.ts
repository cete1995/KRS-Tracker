import { z } from "zod";
import type { Course, Grade, History } from "./types";

export const transcriptRowSchema = z.object({
  externalCode: z.string(), subjectName: z.string(), period: z.string(), credits: z.number().int().positive(),
  grade: z.enum(["A","A-","B+","B","B-","C+","C","D","E"]), qualityPoints: z.number(),
  mappedCourseId: z.string().nullable(), confidence: z.enum(["MATCHED","REVIEW"]),
});
export type TranscriptRow = z.infer<typeof transcriptRowSchema>;
export interface TranscriptResult { student:{name:string;nim:string}; rows:TranscriptRow[]; summary:{credits:number;gpa:number|null;matched:number;review:number} }

const aliases:Record<string,string>={
 "computer organization and architecture":"computer organization architecture", "micro services":"microservices",
 "indonesian":"bahasa indonesia", "ethics for the information age":"profession ethics in it",
 "introduction to entrepreneurship and innovation":"introduction to entrepreneurship innovation",
 "introduction to venture creation and scalling":"entrepreneurship venture creation scaling",
};
const normalize=(s:string)=>s.toLowerCase().replace(/&/g,"and").replace(/[^a-z0-9]+/g," ").trim();
function mapCourse(name:string,courses:Course[]){const normalized=aliases[normalize(name)]??normalize(name);return courses.find(c=>{const candidate=normalize(c.name);return candidate===normalized||candidate.replace(/\band\b/g,"").replace(/\s+/g," ").trim()===normalized.replace(/\band\b/g,"").replace(/\s+/g," ").trim()})?.id??null}

export function parseTranscriptText(text:string,courses:Course[]):TranscriptResult {
 const flat=text.replace(/-- \d+ of \d+ --/g," ").replace(/\s+/g," ");
 const rowRegex=/\b([A-Z]{3}\d{8})\s+(.+?)\s+(\d{5})\s+(\d+)\s+(A-|A|B\+|B-|B|C\+|C|D|E|T)\s+(\d+\.\d{2})/g;
 const rows:TranscriptRow[]=[];let m:RegExpExecArray|null;
 while((m=rowRegex.exec(flat))){if(m[5]==="T")continue;const mappedCourseId=mapCourse(m[2],courses);rows.push({externalCode:m[1],subjectName:m[2].trim(),period:m[3],credits:Number(m[4]),grade:m[5] as Grade,qualityPoints:Number(m[6]),mappedCourseId,confidence:mappedCourseId?"MATCHED":"REVIEW"})}
 const name=flat.match(/Name\s+(.+?)\s+Student Identification Number/)?.[1]?.trim()??"Tidak terbaca";
 const nim=flat.match(/Student Identification Number\s+(\d+)/)?.[1]??"Tidak terbaca";
 const summaryMatch=flat.match(/Cum\. Credits\s+(\d+).*?Cum\. GPA\s+([\d.]+)/);
 return {student:{name,nim},rows,summary:{credits:summaryMatch?Number(summaryMatch[1]):rows.reduce((n,r)=>n+r.credits,0),gpa:summaryMatch?Number(summaryMatch[2]):null,matched:rows.filter(r=>r.mappedCourseId).length,review:rows.filter(r=>!r.mappedCourseId).length}};
}

export function transcriptRowsToHistory(rows:TranscriptRow[]):History[]{return rows.filter(r=>r.mappedCourseId).map(r=>({courseId:r.mappedCourseId!,grade:r.grade,status:["D","E"].includes(r.grade)?"FAILED":"PASSED",period:formatAcademicPeriod(r.period)}))}
export function formatAcademicPeriod(code:string){const year=Number(code.slice(0,4)),term=code.slice(4);return `${year}/${year+1} ${term==="1"?"Ganjil":term==="2"?"Genap":"Pendek"}`}
