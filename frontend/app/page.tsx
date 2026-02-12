'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Zap,
  Code2,
  ChevronRight,
  Vote,
  CheckCircle2,
  Lock,
  Search,
  Cpu,
  Globe2,
  Users,
  Github
} from 'lucide-react';
import MerkleVerifier from '@/components/MerkleVerifier';
import CommunityHub from '@/components/CommunityHub';
import NetworkStatus from '@/components/NetworkStatus';
import NodeLeaderboard from '@/components/NodeLeaderboard';
import ThaiDPromotion from '@/components/ThaiDPromotion';
import LiveResults from '@/components/LiveResults';
import MempoolVisualization from '@/components/MempoolVisualization';

export default function LandingPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-cyan-500/30 font-prompt overflow-x-hidden">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Vote className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-outfit tracking-tight">
            Open-Vote
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#vision" className="hover:text-cyan-400 transition-colors">วิสัยทัศน์</a>
          <a href="#traps" className="hover:text-cyan-400 transition-colors">นวัตกรรม</a>
          <a href="#verifier" className="hover:text-cyan-400 transition-colors">ตรวจสอบ</a>
          <a href="#results" className="hover:text-cyan-400 transition-colors">ผลคะแนนสด</a>
          <a href="#leaderboard" className="hover:text-cyan-400 transition-colors">ทำดี</a>
          <a href="#community" className="hover:text-cyan-400 transition-colors">ชุมชน</a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">Q&A</a>
          <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all backdrop-blur-md">
            ดู Code บน GitHub
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="vision" className="relative z-10 pt-20 pb-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            {...fadeIn}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-8 backdrop-blur-xl"
          >
            <Zap className="w-3 h-3" />
            <span>THAILAND'S FIRST VERIFIABLE E-VOTING</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold font-outfit tracking-tight text-white mb-8 leading-[1.1]"
          >
            เมื่อความเชื่อใจ ถูกแทนที่ด้วย <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
              ความจริงเชิงคณิตศาสตร์
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-2xl mx-auto text-slate-400 text-lg md:text-xl mb-12 leading-relaxed"
          >
            Open-Vote คือโครงสร้างพื้นฐานการลงคะแนนที่ตรวจสอบได้จริง 100%
            ทลายเงื่อนไข "กล่องดำ" ของระบอบเดิม คืนอำนาจการตรวจสอบให้ประชาชน
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl font-bold text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all active:scale-95 flex items-center gap-2 overflow-hidden">
              <span className="relative z-10">เริ่มโปรเจกต์นวัตกรรม</span>
              <ChevronRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all backdrop-blur-md">
              อ่าน Manifesto
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 mb-12">
        <NetworkStatus />
      </section>

      {/* ThaiD Promotion Section */}
      <ThaiDPromotion />

      {/* Traps Section */}
      <section id="traps" className="py-24 px-6 relative z-10 bg-slate-900/40 backdrop-blur-3xl border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white mb-4">ทลาย 3 กับดักเลือกตั้งยุคเก่า</h2>
            <p className="text-slate-400">ก้าวข้ามขีดจำกัดที่ระบบเดิมทำไม่ได้ ด้วยเทคโนโลยีระดับโลก</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-8 h-8 text-cyan-400" />,
                title: "Privacy vs Transparency",
                desc: "ใช้ ZK-Proof เพื่อปกปิดตัวตนโหวตเตอร์ แต่ผลลัพธ์สามารถตรวจสอบได้แม่นยำด้วยคณิตศาสตร์ชั้นสูง",
                color: "cyan"
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-400" />,
                title: "Scalability",
                desc: "โครงสร้าง Batching + Layer 2 รองรับประชาชน 35 ล้านคนอย่างไร้รอยต่อตั้งแต่วันแรก",
                color: "amber"
              },
              {
                icon: <Code2 className="w-8 h-8 text-emerald-400" />,
                title: "Real Open Source",
                desc: "เปิดซอร์สโค้ด 100% บน GitHub เพื่อความบริสุทธิ์ใจ มั่นใจได้ว่าไม่มีประตูลับ (Backdoor)",
                color: "emerald"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-3xl bg-slate-800/20 border border-white/5 hover:border-white/20 transition-all backdrop-blur-sm"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${item.color}-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-outfit">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Merkle Verifier Section */}
      <section id="verifier" className="py-24 px-6 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-outfit text-white mb-4 uppercase tracking-tighter">
            Proof of <span className="text-cyan-400">Validity</span>
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">ลองสัมผัสเทคโนโลยีที่จะทำให้ทุกคะแนนเสียงมี "ความจริง" ที่โต้แย้งไม่ได้</p>
        </div>
        <MerkleVerifier />
      </section>

      {/* Node Leaderboard Section */}
      <section id="leaderboard" className="py-24 relative z-10 overflow-hidden">
        <NodeLeaderboard />
      </section>

      {/* Mempool Visualization Section */}
      <section id="mempool" className="py-24 relative z-10 bg-slate-900/40">
        <MempoolVisualization />
      </section>

      {/* Live Results Section */}
      <section id="results" className="py-24 relative z-10">
        <LiveResults />
      </section>

      {/* Community Section */}
      <section id="community" className="py-24 relative z-10 bg-slate-900/40 border-y border-white/5">
        <CommunityHub />
      </section>
      <section id="faq" className="py-24 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-outfit text-white mb-4">Q&A ถึงความโปร่งใสและ Scalability</h2>
            <p className="text-slate-400 text-sm">ตอบข้อสงสัยด้วยเทคโนโลยีและมาตรฐานสากล</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "ระบบนี้ป้องกันการ 'เวียนเทียน' หรือโหวตซ้ำ (Double Voting) ได้อย่างไร?",
                a: "เราใช้เทคโนโลยี 'ThaiD Hash Mapping' บนสมาร์ทคอนแทรค โดยทันทีที่คุณโหวต รหัสยืนยันตัวตนจาก ThaiD จะถูกเข้ารหัสเป็นรหัสสุ่มที่ย้อนกลับไม่ได้ (Hash) และบันทึกลงบล็อกเชนถาวร หากมีการพยายามใช้รหัสเดิมโหวตซ้ำ บล็อกเชนจะ 'Revert' หรือสั่งยกเลิกธุรกรรมนั้นทันทีด้วยคณิตศาสตร์ที่ไม่มีใครข้ามได้"
              },
              {
                q: "ถ้าผู้ดูแลระบบแอบแก้คะแนน หรือเพิ่มคะแนนปลอมล่ะ?",
                a: "ทำไม่ได้ครับ เพราะคะแนนทุกลูกจะถูกมัดรวมกันเป็นโครงสร้าง Merkle Tree ซึ่งมี 'รากแก้ว' (Root Hash) เพียงหนึ่งเดียวบนบล็อกเชน หากมีการแก้แม้แต่คะแนนเดียว รากแก้วจะไม่ตรงกัน และเครื่องตรวจคะแนน (Validator Nodes) ของสื่อมวลชนและประชาชนนับพันเครื่องจะตรวจพบความผิดปกติทันทีภายในไม่กี่วินาที"
              },
              {
                q: "ทำไมถึงต้องใช้ ThaiD และต้องไปที่หน่วยเลือกตั้ง?",
                a: "เพื่อปิดช่องโหว่การ 'สวมสิทธิ์' หรือการบังคับโหวตจากทางบ้าน การใช้ ThaiD ณ จุดเลือกตั้งคือการพิสูจน์ว่า 'คนโหวตคือตัวจริง' ขั้นตอนนี้คือการรวมพลังระหว่าง 'บัตรประชาชนคนเป็น' และ 'สมาร์ทคอนแทรคที่ไม่เคยโกหก' เข้าด้วยกัน"
              },
              {
                q: "ระบบป้องกันการดักแก้ไขข้อมูลกลางทาง (Man-in-the-Middle) อย่างไร?",
                a: "เราใช้ 3 ชั้นความปลอดภัย: (1) Digital Signature - ทุกโหวตถูกเซ็นด้วยกุญแจส่วนตัวของผู้โหวต ถ้ามีการแก้ไขแม้แต่ 1 บิต ลายเซ็นจะไม่ตรงกัน (2) End-to-End Encryption - ข้อมูลถูกเข้ารหัสตั้งแต่ต้นทางถึงปลายทาง (3) Merkle Proof Verification - ประชาชนสามารถตรวจสอบด้วยตัวเองว่าคะแนนของตนไม่ถูกแก้ไขโดยใช้ Merkle Proof ที่ได้รับมา ถ้าใครพยายามแก้ไขกลางทาง การตรวจสอบจะล้มเหลวทันที"
              },
              {
                q: "ระบบนี้รองรับคนจำนวนมากได้จริงไหม หรือจะล่มเหมือนระบบเก่า?",
                a: "เราใช้มาตรฐาน 'Batching Transaction' ซึ่งสามารถรวบรวม 1,000 โหวตส่งลงบล็อกเชนในครั้งเดียว ทำให้ระบบมีความเร็วสูงกว่าบล็อกเชนทั่วไปหลายพันเท่า และทำงานแบบกระจายศูนย์ (Distributed) จึงไม่มีจุดอ่อนที่จะทำให้ระบบล่มทั้งประเทศได้"
              }
            ].map((faq, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all">
                <h4 className="text-white font-bold mb-3 flex items-start gap-3">
                  <span className="text-cyan-400">Q:</span>
                  {faq.q}
                </h4>
                <p className="text-slate-400 text-sm leading-relaxed pl-7">
                  <span className="text-slate-500 mr-2">A:</span>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 px-6 mt-12 bg-slate-900/60 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 opacity-30" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 font-outfit uppercase tracking-tighter">
              A Gift <span className="text-cyan-400">to Society</span>
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 mx-auto rounded-full mb-8" />
          </div>
          <p className="text-slate-400 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
            Open-Vote มอบให้เป็นสาธารณประโยชน์สำหรับสังคมไทย
            เพื่อความยุติธรรมที่ทุกคนตรวจสอบได้ด้วยนวัตกรรมที่โปร่งใสที่สุด
          </p>

          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2 text-slate-300">
                <Code2 className="w-4 h-4 text-cyan-400" />
                Developed by <span className="text-white font-bold">Microtronic Co., Ltd.</span>
              </span>
              <span className="hidden md:inline text-slate-700">|</span>
              <p>© 2026 Open-Vote Initiative. All Rights Reserved.</p>
              <span className="hidden md:inline text-slate-700">•</span>
              <a href="https://github.com/GridsMicro/Open-Vote" target="_blank" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <Github size={14} /> GitHub Source
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
