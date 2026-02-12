'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Database, CheckCircle2, Clock, Zap } from 'lucide-react';
import { useAppConfig } from './ConfigProvider';

interface MempoolVote {
    id: string;
    stationId: string;
    timestamp: number;
    status: 'pending' | 'batched' | 'confirmed';
}

interface MempoolStatus {
    totalPending: number;
    totalBatched: number;
    totalConfirmed: number;
    recentActivity: number;
    stationActivity: Record<string, number>;
    batchProgress: {
        current: number;
        target: number;
        percentage: number;
    };
    estimatedTimeToNextBatch: number;
}

export default function MempoolVisualization() {
    const { AGGREGATOR_URL } = useAppConfig();
    const [mempoolStatus, setMempoolStatus] = useState<MempoolStatus | null>(null);
    const [recentVotes, setRecentVotes] = useState<MempoolVote[]>([]);

    useEffect(() => {
        fetchMempoolData();

        const interval = setInterval(() => {
            fetchMempoolData();
        }, 2000); // Update every 2 seconds

        return () => clearInterval(interval);
    }, []);

    const fetchMempoolData = async () => {
        try {
            const [statusRes, streamRes] = await Promise.all([
                fetch(`${AGGREGATOR_URL}/mempool/status`),
                fetch(`${AGGREGATOR_URL}/mempool/stream?limit=20`)
            ]);

            if (statusRes.ok && streamRes.ok) {
                const status = await statusRes.json();
                const stream = await streamRes.json();

                setMempoolStatus(status);
                setRecentVotes(stream.votes || []);
            }
        } catch (error) {
            console.error('Error fetching mempool data:', error);
        }
    };

    if (!mempoolStatus) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>MEMPOOL LIVE - การไหลของข้อมูลก่อนลงบล็อกเชน</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
                    Mempool Visualization
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    ติดตามการไหลของคะแนนเสียงแบบเรียลไทม์ ก่อนที่จะถูกรวมเป็น Batch และส่งลงบล็อกเชน
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                >
                    <Clock className="w-8 h-8 text-yellow-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">Pending</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {mempoolStatus.totalPending}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20"
                >
                    <Database className="w-8 h-8 text-blue-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">Batched</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {mempoolStatus.totalBatched}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20"
                >
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">Confirmed</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {mempoolStatus.totalConfirmed}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20"
                >
                    <Zap className="w-8 h-8 text-purple-400 mb-3" />
                    <p className="text-slate-400 text-sm mb-1">Activity (1min)</p>
                    <p className="text-3xl font-bold text-white font-outfit">
                        {mempoolStatus.recentActivity}
                    </p>
                </motion.div>
            </div>

            {/* Batch Progress */}
            <div className="mb-12 p-8 rounded-2xl bg-slate-900/50 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Batch Progress</h3>
                    <span className="text-sm text-slate-400">
                        {mempoolStatus.batchProgress.current} / {mempoolStatus.batchProgress.target} votes
                    </span>
                </div>
                <div className="h-4 bg-slate-800 rounded-full overflow-hidden mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${mempoolStatus.batchProgress.percentage}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                    />
                </div>
                <p className="text-sm text-slate-400">
                    {mempoolStatus.estimatedTimeToNextBatch > 0
                        ? `Next batch in ~${mempoolStatus.estimatedTimeToNextBatch}s or when ${mempoolStatus.batchProgress.target} votes reached`
                        : 'Processing batch now...'}
                </p>
            </div>

            {/* Recent Votes Stream */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-white/10">
                <h3 className="text-xl font-bold text-white mb-6">Recent Vote Stream</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    <AnimatePresence>
                        {recentVotes.map((vote, idx) => (
                            <motion.div
                                key={vote.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: idx * 0.05 }}
                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/50 border border-white/5"
                            >
                                <div className={`w-2 h-2 rounded-full ${vote.status === 'confirmed' ? 'bg-emerald-400' :
                                    vote.status === 'batched' ? 'bg-blue-400' :
                                        'bg-yellow-400'
                                    } animate-pulse`} />
                                <div className="flex-1">
                                    <p className="text-sm text-white font-mono">{vote.id}</p>
                                    <p className="text-xs text-slate-500">Station: {vote.stationId}</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs px-2 py-1 rounded-full ${vote.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                                        vote.status === 'batched' ? 'bg-blue-500/20 text-blue-400' :
                                            'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {vote.status}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(vote.timestamp).toLocaleTimeString('th-TH')}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
