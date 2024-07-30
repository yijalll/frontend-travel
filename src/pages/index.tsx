import { Inter } from "next/font/google";
import Hero from "@/components/Hero";
import Feature from "@/components/Feature";
import Download from "@/components/Download";
import Author from "@/components/Author";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={inter.className}>
      <Hero />
      <Feature />
      <Download />
      <Author />
      <Footer />
    </main>
  );
}
