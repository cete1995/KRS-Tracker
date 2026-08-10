import type {Course} from "@/lib/types";

type Initial=[string,string,number,number,Course["category"]];
const rows:Initial[]=[
 ["K22-1-01","Algoritma & Pemrograman",5,1,"CORE"],["K22-1-02","Pengantar Teknologi Informasi dan Komunikasi",2,1,"CORE"],["K22-1-03","Organisasi dan Arsitektur Komputer",3,1,"CORE"],["K22-1-04","Aljabar Linier",3,1,"CORE"],["K22-1-05","Agama",2,1,"UNIVERSITY"],["K22-1-06","Entrepreneurship Essential",3,1,"ENTREPRENEURSHIP"],
 ["K22-2-01","Pemrograman Berorientasi Obyek",4,2,"CORE"],["K22-2-02","Pemrograman Web",4,2,"CORE"],["K22-2-03","Basis Data",3,2,"CORE"],["K22-2-04","Kalkulus",2,2,"CORE"],["K22-2-05","Pancasila",2,2,"UNIVERSITY"],["K22-2-06","Menjadi Indonesia",3,2,"UNIVERSITY"],
 ["K22-3-01","Pemrograman Visual",5,3,"CORE"],["K22-3-02","Pengembangan Web",4,3,"CORE"],["K22-3-03","Sistem Operasi",3,3,"CORE"],["K22-3-04","Matematika Diskrit",3,3,"CORE"],["K22-3-05","Kewarganegaraan",2,3,"UNIVERSITY"],["K22-3-06","Etika di Era Informasi",3,3,"UNIVERSITY"],
 ["K22-4-01","Pengembangan Aplikasi Mobile",5,4,"CORE"],["K22-4-02","Rekayasa Perangkat Lunak",3,4,"CORE"],["K22-4-03","Jaringan Komputer",3,4,"CORE"],["K22-4-04","Statistika dan Probabilitas",4,4,"CORE"],["K22-4-05","Bahasa Indonesia",2,4,"UNIVERSITY"],["K22-4-06","Entrepreneurship Global Innovation (MKE)",3,4,"ENTREPRENEURSHIP"],
 ["K22-5-01","Pengembangan Produk Entrepreneurship Digital",5,5,"ENTREPRENEURSHIP"],["K22-5-02","Grafika Komputer",3,5,"CORE"],["K22-5-03","Keamanan Siber",3,5,"CORE"],["K22-5-04","Kecerdasan Buatan",3,5,"CORE"],["K22-5-05","MK Pilihan / Pengembangan Konsentrasi",3,5,"ELECTIVE"],["K22-5-06","MK Pilihan Interdisiplin",3,5,"INTERDISCIPLINARY"],
 ["K22-6-01A","MK Pilihan (2 SKS)",2,6,"ELECTIVE"],["K22-6-01B","MK Pilihan (3 SKS)",3,6,"ELECTIVE"],["K22-6-02","MK Pilihan / Pengembangan Konsentrasi I",3,6,"ELECTIVE"],["K22-6-03","MK Pilihan / Pengembangan Konsentrasi II",3,6,"ELECTIVE"],["K22-6-04","MK Pilihan Tambahan",3,6,"ELECTIVE"],["K22-6-05","Research Methodology",3,6,"CORE"],["K22-6-06","MK Pilihan Interdisiplin",3,6,"INTERDISCIPLINARY"],
 ["K22-7-01","Magang: Pengembangan Produk",9,7,"ENRICHMENT"],["K22-7-02","Magang: Pengembangan Profesional",9,7,"ENRICHMENT"],
 ["K22-8-01","Tugas Akhir",8,8,"FINAL_PROJECT"],["K22-8-02","Kredensial Mikro",2,8,"CREDENTIAL"],
];

export const curriculum2022Defaults:Course[]=rows.map(([code,name,credits,semester,category])=>({id:code,code,name,credits,semester,category,track:"GENERAL",status:"NOT_AVAILABLE",active:true}));
export const CURRICULUM_2022_STORAGE="imt-curriculum-2022-courses";

export function migrateCurriculum2022(stored:Course[]):Course[]{
 if(stored.some(course=>course.id==="K22-6-01A"||course.id==="K22-6-01B"))return stored;
 return stored.flatMap(course=>course.id!=="K22-6-01"?[course]:[
  {...course,id:"K22-6-01A",code:"K22-6-01A",name:"MK Pilihan (2 SKS)",credits:2},
  {...course,id:"K22-6-01B",code:"K22-6-01B",name:"MK Pilihan (3 SKS)",credits:3},
 ]);
}
