import "./globals.css";import type {Metadata} from "next";import {AppShell} from "@/components/nav";
export const metadata:Metadata={title:"IMT KRS Planner",description:"Perencanaan studi mahasiswa Informatika"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id"><body><AppShell>{children}</AppShell></body></html>}
