'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Medal, Shield, Award, ExternalLink, Users, Loader2 } from 'lucide-react';

interface Partner {
    id: string;
    rank: number;
    name: string;
    type: string;
    nodes: number;
    uptime: string;
    color: string;
    logo: string;
}

export default function NodeLeaderboard() {
    const [leaders, setLeaders] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const res = await fetch('http://localhost:3001/partners');
                const data = await res.json();
                // Assign operational ranks
                const ranked = data.map((p: any, idx: number) => ({
                    ...p,
                    rank: idx + 1
                }));
                setLeaders(ranked);
            } catch (error) {
                console.error('Failed to fetch partners:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPartners();
    }, []);
    const registerPartner = async () => {
        const name = prompt('กรุณาระบุชื่อหน่วยงาน/สื่อของคุณ:');
        const type = prompt('ประเภทหน่วยงาน (เช่น Media, University, NGO):');
        if (!name || !type) return;

        try {
            const res = await fetch('http://localhost:3001/partners/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, type })
            });
            if (res.ok) {
                alert('ลงทะเบียนสำเร็จ! ข้อมูลของคุณจะปรากฏบน Leaderboard ทันที');
                window.location.reload();
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาดในการลงทะเบียน');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
                <p className="text-slate-400 font-medium">กำลังดึงข้อมูลพันธมิตรผู้พิทักษ์...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-6">
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4"
                >
                    <Award className="w-3 h-3" />
                    <span>NETWORK GUARDIANS</span>
                </motion.div>
                <h2 className="text-3xl md:text-5xl font-bold text-white font-outfit uppercase tracking-tighter mb-4">
                    Node <span className="text-slate-500">Leaderboard</span>
                </h2>
                <p className="text-slate-400 max-w-xl mx-auto">ขอสดุดีแด่ผู้ที่อุทิศทรัพยากรเครื่องเพื่อร่วมเป็นพยานให้กับความบริสุทธิ์ของการเลือกตั้งไทย</p>
            </div>

            <div className="space-y-4">
                {leaders.map((leader, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative p-6 rounded-3xl bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all backdrop-blur-md flex items-center gap-6"
                    >
                        {/* Rank & Logo */}
                        <div className="relative shrink-0">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${leader.color} p-0.5 shadow-lg ring-4 ring-white/5 overflow-hidden`}>
                                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden">
                                    <img src={leader.logo} alt={leader.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                            <div className={`absolute -top-2 -left-2 w-7 h-7 rounded-full bg-gradient-to-br ${leader.color} flex items-center justify-center text-white text-xs font-bold border-2 border-slate-900 shadow-xl`}>
                                {leader.rank}
                            </div>
                        </div>

                        {/* Name & Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{leader.name}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/5 font-medium uppercase">
                                    {leader.type}
                                </span>
                            </div>
                            <div className="flex items-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5" />
                                    <span>{leader.nodes} Active Nodes</span>
                                </div>
                                <div className="flex items-center gap-1.5 font-mono">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    <span>Uptime: {leader.uptime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <button className="p-3 rounded-2xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                            <ExternalLink className="w-5 h-5" />
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 p-10 rounded-[40px] border border-dashed border-white/10 bg-white/[0.02] text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-white mb-2">เปิดรับพันธมิตรเครือข่ายความโปร่งใส</h4>
                    <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                        หน่วยงาน หรือ สื่อมวลชน ที่สนใจรันโหนดเพื่อเป็นพยานร่วมกัน
                        เรายินดีขึ้นโลโก้และระบุชื่อเป็นผู้สนับสนุนหลักในระบบตรวจสอบของเรา
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={registerPartner}
                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl text-white font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all active:scale-95"
                        >
                            ลงทะเบียนหน่วยงาน
                        </button>
                        <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-white font-bold hover:bg-white/10 transition-all">
                            ดาวน์โหลด Node Config
                        </button>
                    </div>
                    <p className="mt-8 text-slate-600 text-sm">และขอบคุณประชาชนรายย่อยอีกกว่า 1,200 โหนดทั่วประเทศ</p>
                </div>
            </div>
        </div>
    );
}
