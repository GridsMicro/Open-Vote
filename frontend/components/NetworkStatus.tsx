'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Shield, Activity, Globe, Zap, Cpu } from 'lucide-react';

export default function NetworkStatus() {
    const [nodes, setNodes] = useState(1);
    const [uptime, setUptime] = useState('99.99%');
    const [tps, setTps] = useState(0);

    // จำลองการดึงข้อมูลจาก Network จริง
    useEffect(() => {
        const interval = setInterval(() => {
            setNodes(prev => prev < 1240 ? prev + Math.floor(Math.random() * 5) : prev);
            setTps(Math.floor(Math.random() * 2500));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full max-w-7xl mx-auto py-12 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Active Nodes */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Server className="w-16 h-16 text-cyan-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
                            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Active Nodes</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-outfit mb-1">{nodes.toLocaleString()}</h3>
                        <p className="text-slate-500 text-sm italic">พิทักษ์โดยประชาชน</p>
                    </div>
                </motion.div>

                {/* Network Strength (Health) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Shield className="w-16 h-16 text-emerald-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">Security Level</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-outfit mb-1">MAXIMAL</h3>
                        <p className="text-slate-500 text-sm">ยากต่อการโจมตี 51%</p>
                    </div>
                </motion.div>

                {/* TPS / Scalability */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity className="w-16 h-16 text-blue-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => <div key={i} className="w-1 h-3 bg-blue-400/50 rounded-full" />)}
                            </div>
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Throughput</span>
                        </div>
                        <h3 className="text-4xl font-bold text-white font-outfit mb-1">{tps.toLocaleString()} <span className="text-sm font-normal text-slate-500">TPS</span></h3>
                        <p className="text-slate-500 text-sm italic">Batching System Active</p>
                    </div>
                </motion.div>

                {/* Decentralization Score */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="p-6 rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-md relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Globe className="w-16 h-16 text-indigo-400" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Cpu className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">Zero-Trust Score</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <h3 className="text-4xl font-bold text-white font-outfit mb-1">98/100</h3>
                        </div>
                        <p className="text-slate-500 text-sm italic">Satoshi Compliance</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
