"use client";import {useEffect,useState} from "react";import {history as seed} from "@/data/courses";import type {History} from "./types";
export const IMPORT_KEY="imt-imported-history";
export function useStudentHistory(){const [history,setHistory]=useState<History[]>(seed);useEffect(()=>{try{const stored=localStorage.getItem(IMPORT_KEY);if(stored){const imported=JSON.parse(stored) as History[];setHistory(imported)}}catch{}},[]);return history}
export interface TranscriptProfile {name:string;nim:string;gpa:number|null;credits:number;importedAt:string}
export function useTranscriptProfile(){const [profile,setProfile]=useState<TranscriptProfile|null>(null);useEffect(()=>{try{const stored=localStorage.getItem("imt-transcript-summary");if(stored)setProfile(JSON.parse(stored) as TranscriptProfile)}catch{}},[]);return profile}
