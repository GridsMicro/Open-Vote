'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Smartphone, CheckCircle, ArrowRight, ExternalLink } from 'lucide-react';

export default function ThaiDPromotion() {
    return (
        <section id="thaid-promo" className="py-24 px-6 relative z-10 overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">
                <div className="p-1 px-4 mb-8 inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
                    <Smartphone className="w-4 h-4" />
                    <span>Identity Modernization</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-6xl font-bold font-outfit text-white mb-6 leading-tight">
                            ยกระดับความเชื่อมั่นด้วย <br />
                            <span className="text-blue-500 italic">ThaiD</span>
                        </h2>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Open-Vote ผสานระบบการยืนยันตัวตนดิจิทัลผ่านแอปพลิเคชัน **ThaiD**
                            เพื่อสร้างมาตรฐานใหม่ในการพิสูจน์ "ตัวตนจริง" ณ หน่วยเลือกตั้ง
                            ทลายปัญหาการสวมสิทธิ์และเพิ่มความสะดวกสบายให้กับประชาชนยุคใหม่
                        </p>

                        <div className="space-y-4 mb-10">
                            {[
                                "ยืนยันตัวตนจากสมาร์ทโฟน รวดเร็ว ปลอดภัย ไม่ต้องพกบัตร",
                                "มาตรฐานความปลอดภัยระดับสูงจากกรมการปกครอง",
                                "ลดขั้นตอนการทำงานของเจ้าหน้าที่ ณ หน่วยเลือกตั้ง",
                                "สร้างประวัติการเข้าถึงที่ตรวจสอบได้ย้อนหลังแบบดิจิทัล"
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="shrink-0 w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                        <CheckCircle className="w-3.5 h-3.5 text-blue-400" />
                                    </div>
                                    <span className="text-slate-300 font-medium">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://www.bora.dopa.go.th/app-thaid/"
                                target="_blank"
                                className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
                            >
                                <span>ดาวน์โหลด ThaiD</span>
                                <ExternalLink className="w-5 h-5" />
                            </a>
                            <button className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                <span>ดูวิธียืนยันตัวตน</span>
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        {/* Mock Phone UI */}
                        <div className="relative z-10 mx-auto w-full max-w-[320px] aspect-[9/19] bg-slate-950 rounded-[3rem] border-8 border-slate-800 overflow-hidden shadow-2xl">
                            <div className="h-6 bg-slate-800 flex items-center justify-center gap-1.5 pt-1">
                                <div className="w-16 h-4 bg-slate-900 rounded-full" />
                            </div>

                            <div className="p-6 pt-12 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-blue-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                                    <ShieldCheck className="w-12 h-12 text-white" />
                                </div>
                                <h3 className="text-white text-2xl font-bold mb-2">ThaiD</h3>
                                <p className="text-slate-500 text-sm mb-12 uppercase tracking-widest font-bold">Verified Identity</p>

                                <div className="w-full space-y-4">
                                    <div className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-400 text-xs text-left px-4">
                                        ชื่อ-นามสกุล: <span className="text-white ml-2">นายประชา สุจริตธรรม</span>
                                    </div>
                                    <div className="w-full py-4 bg-white/[0.03] border border-white/5 rounded-2xl text-slate-400 text-xs text-left px-4">
                                        เลขประจำตัว: <span className="text-white ml-2">1-XXXX-XXXXX-XX-X</span>
                                    </div>
                                    <div className="w-full py-5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl text-white font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                        <span>ยืนยันตัวตนเพื่อเข้าคูหา</span>
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                            </div>

                            {/* Glow behind phone */}
                            <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />
                        </div>

                        {/* Floating Tech Accents */}
                        <div className="absolute top-0 right-0 p-4 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-md shadow-xl -rotate-6 translate-x-12 -translate-y-4">
                            <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-tighter">Blockchain Verified</p>
                            <div className="w-10 h-1 bg-blue-500 rounded-full" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
