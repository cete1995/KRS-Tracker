"use client";

import {useEffect,useMemo,useState} from "react";
import {AlertTriangle,Check,Plus,RotateCcw,Save,Trash2} from "lucide-react";
import {PageTitle} from "@/components/ui";
import {categoryConfig} from "@/lib/config";
import type {Course} from "@/lib/types";
import {useCurriculum2022} from "@/lib/use-curriculum-2022";
import {curriculum2022Defaults} from "@/data/curriculum-2022";

export default function CurriculumEditor(){
 const source=useCurriculum2022();
 const [draft,setDraft]=useState<Course[]>(source.courses),[saved,setSaved]=useState(false),[semester,setSemester]=useState("ALL");
 useEffect(()=>setDraft(source.courses),[source.courses]);
 const visible=useMemo(()=>draft.filter(c=>semester==="ALL"||c.semester===Number(semester)),[draft,semester]);
 const total=draft.reduce((sum,c)=>sum+c.credits,0);
 const update=(id:string,changes:Partial<Course>)=>{setSaved(false);setDraft(items=>items.map(c=>c.id===id?{...c,...changes}:c))};
 const remove=(id:string)=>{setSaved(false);setDraft(items=>items.filter(c=>c.id!==id))};
 const add=()=>{const number=draft.length+1,id=`K22-NEW-${number}`;setDraft(items=>[...items,{id,code:id,name:"Mata Kuliah Baru",credits:3,semester:1,category:"CORE",track:"GENERAL",status:"NOT_AVAILABLE",active:true}]);setSemester("ALL");setSaved(false)};
 const save=()=>{source.save(draft);setSaved(true)};
 const restore=()=>{source.reset();setDraft(curriculum2022Defaults.map(c=>({...c})));setSaved(false)};
 return <><PageTitle title="Editor Kurikulum 2022" subtitle="Perbaiki hasil pembacaan gambar sebelum dipakai untuk evaluasi mahasiswa." actions={<div className="flex flex-wrap gap-2"><button onClick={add} className="btn btn-outline"><Plus size={16}/>Tambah mata kuliah</button><button onClick={save} className="btn btn-primary">{saved?<><Check size={16}/>Tersimpan</>:<><Save size={16}/>Simpan perubahan</>}</button></div>}/>
 <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertTriangle size={18} className="mt-0.5 shrink-0"/><div><div className="font-bold">Data awal ditafsirkan dari gambar Kurikulum 2022</div><p className="mt-1 text-xs leading-5 text-amber-800">Kode menggunakan kode sementara karena gambar tidak menampilkan kode resmi. Koreksi nama, kode, SKS, semester, kategori, atau jalur lalu tekan Simpan. Hasilnya langsung muncul saat dosen memilih IMT 2022.</p></div></div>
 <div className="mb-4 grid gap-3 sm:grid-cols-3"><Metric label="Total mata kuliah" value={`${draft.length}`}/><Metric label="Total SKS" value={`${total} SKS`} valid={total===144}/><Metric label="Validasi terhadap gambar" value={total===144?"Sesuai · 144 SKS":`Selisih ${total-144} SKS`} valid={total===144}/></div>
 <div className="mb-4 flex flex-wrap items-center gap-3"><select className="field" value={semester} onChange={e=>setSemester(e.target.value)}><option value="ALL">Semua semester</option>{[1,2,3,4,5,6,7,8].map(n=><option value={n} key={n}>Semester {n}</option>)}</select><span className="text-xs text-slate-500">{visible.length} mata kuliah ditampilkan</span><button onClick={restore} className="btn btn-outline ml-auto"><RotateCcw size={15}/>Kembalikan hasil awal</button></div>
 <div className="card overflow-hidden"><div className="table-wrap"><table className="table min-w-[1040px]"><thead><tr><th>Kode sementara/resmi</th><th>Nama mata kuliah</th><th>Semester</th><th>SKS</th><th>Kategori</th><th>Jalur</th><th></th></tr></thead><tbody>{visible.map(course=><EditableRow key={course.id} course={course} update={changes=>update(course.id,changes)} remove={()=>remove(course.id)}/>)}</tbody></table></div></div></>;
}

function Metric({label,value,valid}:{label:string;value:string;valid?:boolean}){return <div className="card p-4"><div className="label">{label}</div><div className={`mt-1 text-xl font-bold ${valid===undefined?"":valid?"text-emerald-700":"text-red-600"}`}>{value}</div></div>}
function EditableRow({course,update,remove}:{course:Course;update:(changes:Partial<Course>)=>void;remove:()=>void}){return <tr><td><input className="field w-40 font-bold text-navy" value={course.code} onChange={e=>update({code:e.target.value})}/></td><td><input className="field min-w-72 w-full" value={course.name} onChange={e=>update({name:e.target.value})}/></td><td><select className="field w-28" value={course.semester} onChange={e=>update({semester:Number(e.target.value)})}>{[1,2,3,4,5,6,7,8].map(n=><option key={n} value={n}>{n}</option>)}</select></td><td><input className="field w-20" type="number" min={1} max={20} value={course.credits} onChange={e=>update({credits:Number(e.target.value)})}/></td><td><select className="field min-w-48" value={course.category} onChange={e=>update({category:e.target.value as Course["category"]})}>{Object.entries(categoryConfig).map(([key,value])=><option value={key} key={key}>{value.label}</option>)}</select></td><td><select className="field w-28" value={course.track} onChange={e=>update({track:e.target.value as Course["track"]})}><option value="GENERAL">Umum</option><option value="AI">AI</option><option value="FSD">FSD</option><option value="BOTH">AI & FSD</option></select></td><td><button onClick={remove} aria-label={`Hapus ${course.name}`} className="rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={16}/></button></td></tr>}
