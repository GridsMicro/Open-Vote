'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, MapPin, Users, CheckCircle, Clock, ChevronDown, ChevronUp, Activity } from 'lucide-react';

interface PollingStation {
    id: string;
    name: string;
    province: string;
    district: string;
    totalVoters: number;
    votedCount: number;
    results: {
        candidate: string;
        votes: number;
        percentage: number;
    }[];
    lastUpdate: string;
    merkleRoot: string;
}

export default function LiveResults() {
    const [viewLevel, setViewLevel] = useState<'zone' | 'province' | 'district' | 'station'>('zone');
    const [selectedZone, setSelectedZone] = useState<string>('');
    const [selectedProvince, setSelectedProvince] = useState<string>('');
    const [selectedDistrict, setSelectedDistrict] = useState<string>('');
    const [expandedStation, setExpandedStation] = useState<string | null>(null);
    const [liveData, setLiveData] = useState<PollingStation[]>([]);
    const [totalStats, setTotalStats] = useState({
        totalVoters: 0,
        votedCount: 0,
        turnoutPercentage: 0
    });

    // Zone mapping
    const zoneMap: Record<string, string[]> = {
        'กรุงเทพและปริมณฑล': ['กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ'],
        'ภาคเหนือ': ['เชียงใหม่', 'เชียงราย', 'ลำปาง', 'พิษณุโลก'],
        'ภาคตะวันออกเฉียงเหนือ': ['นครราชสีมา', 'ขอนแก่น', 'อุดรธานี', 'อุบลราชธานี'],
        'ภาคกลาง': ['นครสวรรค์', 'พระนครศรีอยุธยา', 'ลพบุรี'],
        'ภาคตะวันออก': ['ชลบุรี', 'ระยอง', 'จันทบุรี'],
        'ภาคใต้': ['สงขลา', 'ภูเก็ต', 'สุราษฎร์ธานี', 'นครศรีธรรมราช']
    };

    const getZoneForProvince = (province: string): string => {
        for (const [zone, provinces] of Object.entries(zoneMap)) {
            if (provinces.includes(province)) return zone;
        }
        return 'อื่นๆ';
    };

    // Fetch real data from aggregator API
    useEffect(() => {
        fetchLiveResults();

        // Auto-refresh every 5 seconds
        const interval = setInterval(() => {
            fetchLiveResults();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const fetchLiveResults = async () => {
        try {
            const res = await fetch('http://localhost:3001/results/live');
            if (!res.ok) {
                console.error('Failed to fetch live results');
                return;
            }

            const data = await res.json();

            // Transform API data to match our interface
            const stations: PollingStation[] = data.stations || [];
            setLiveData(stations);

            // Calculate totals
            if (stations.length > 0) {
                const totals = stations.reduce((acc, station) => ({
                    totalVoters: acc.totalVoters + station.totalVoters,
                    votedCount: acc.votedCount + station.votedCount,
                    turnoutPercentage: 0
                }), { totalVoters: 0, votedCount: 0, turnoutPercentage: 0 });

                totals.turnoutPercentage = totals.totalVoters > 0
                    ? (totals.votedCount / totals.totalVoters) * 100
                    : 0;

                setTotalStats(totals);
            }
        } catch (error) {
            console.error('Error fetching live results:', error);
            // Fallback to empty data on error
            setLiveData([]);
        }
    };

    const provinces = ['all', ...Array.from(new Set(liveData.map(s => s.province)))];
    const filteredData = selectedProvince === 'all'
        ? liveData
        : liveData.filter(s => s.province === selectedProvince);

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>LIVE RESULTS - อัพเดททุก 5 วินาที</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
                    ผลคะแนนสด Real-time
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    ตรวจสอบผลคะแนนแบบเรียลไทม์จากทุกหน่วยเลือกตั้งทั่วประเทศ
                    พร้อมยืนยันความถูกต้องด้วย Merkle Root บนบล็อกเชน
                </p>
            </div>

            {/* National Stats */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                >
                    <Users className="w-8 h-8 text-blue-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">ผู้มีสิทธิ์ทั้งหมด</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {totalStats.totalVoters.toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
                >
                    <CheckCircle className="w-8 h-8 text-emerald-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">ใช้สิทธิ์แล้ว</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {totalStats.votedCount.toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
                >
                    <TrendingUp className="w-8 h-8 text-amber-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">อัตราการใช้สิทธิ์</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {totalStats.turnoutPercentage.toFixed(1)}%
                    </p>
                </motion.div>
            </div>

            {/* Province Filter */}
            <div className="mb-8 flex flex-wrap gap-3">
                {provinces.map(province => (
                    <button
                        key={province}
                        onClick={() => setSelectedProvince(province)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all ${selectedProvince === province
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 border border-white/5'
                            }`}
                    >
                        {province === 'all' ? 'ทั้งหมด' : province}
                    </button>
                ))}
            </div>

            {/* Polling Stations List */}
            <div className="space-y-4">
                {filteredData.map((station, idx) => (
                    <motion.div
                        key={station.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden hover:border-cyan-500/30 transition-all"
                    >
                        {/* Station Header */}
                        <div
                            onClick={() => setExpandedStation(expandedStation === station.id ? null : station.id)}
                            className="p-6 cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <MapPin className="w-5 h-5 text-cyan-400" />
                                        <h3 className="text-lg font-bold text-white">{station.name}</h3>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        {station.district}, {station.province}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{station.lastUpdate}</span>
                                    </div>
                                    {expandedStation === station.id ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-xs text-slate-500 mb-1">ใช้สิทธิ์แล้ว</p>
                                    <p className="text-xl font-bold text-white">
                                        {station.votedCount} / {station.totalVoters}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-white/5">
                                    <p className="text-xs text-slate-500 mb-1">อัตราการใช้สิทธิ์</p>
                                    <p className="text-xl font-bold text-emerald-400">
                                        {((station.votedCount / station.totalVoters) * 100).toFixed(1)}%
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Expanded Details */}
                        <AnimatePresence>
                            {expandedStation === station.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-white/5"
                                >
                                    <div className="p-6 space-y-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                            ผลคะแนนแยกตามผู้สมัคร
                                        </h4>
                                        {station.results.map((result, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white font-medium">{result.candidate}</span>
                                                    <span className="text-cyan-400 font-bold">
                                                        {result.votes.toLocaleString()} คะแนน ({result.percentage}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${result.percentage}%` }}
                                                        transition={{ duration: 1, delay: idx * 0.1 }}
                                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                                                    />
                                                </div>
                                            </div>
                                        ))}

                                        {/* Merkle Root Verification */}
                                        <div className="mt-6 p-4 rounded-xl bg-slate-950/50 border border-emerald-500/20">
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-400 uppercase">
                                                    Blockchain Verified
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-1">Merkle Root:</p>
                                            <p className="text-sm text-slate-300 font-mono">{station.merkleRoot}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
