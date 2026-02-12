'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Heart, Share2, Globe2, Loader2, Github, ExternalLink, ThumbsUp } from 'lucide-react';

interface Discussion {
    id: string;
    title: string;
    body: string;
    url: string;
    author: {
        login: string;
        avatarUrl: string;
    };
    createdAt: string;
    upvoteCount: number;
    commentCount: number;
}

export default function CommunityHub() {
    const [discussions, setDiscussions] = useState<Discussion[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const fetchDiscussions = async () => {
        try {
            const res = await fetch('/api/community/discussions');
            if (res.ok) {
                const data = await res.json();
                setDiscussions(data);
            }
        } catch (error) {
            console.error('Failed to fetch discussions:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'เมื่อสักครู่';
        if (minutes < 60) return `${minutes} นาทีที่แล้ว`;
        if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
        return `${days} วันที่แล้ว`;
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-6 py-12">
            {/* Header */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold mb-6">
                    <Github className="w-4 h-4" />
                    <span>GITHUB DISCUSSIONS</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
                    Open-Vote Community
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                    พื้นที่สำหรับนักพัฒนาและพลเมืองเพื่อขับเคลื่อนโปรโตคอลการเลือกตั้งดิจิทัลที่โปร่งใสที่สุดในโลก
                </p>
            </div>

            {/* CTA to GitHub */}
            <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                    <Github size={120} />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-white mb-2">มาร่วมเป็นส่วนหนึ่งของประวัติศาสตร์</h3>
                    <p className="text-slate-300 mb-6 max-w-lg">
                        คุณสามารถตั้งกระทู้ถาม เสนอฟีเจอร์ใหม่ หรือพูดคุยเรื่องแนวคิดความโปร่งใสได้โดยตรงที่ GitHub Discussions ของเรา
                    </p>
                    <a
                        href="https://github.com/GridsMicro/Open-Vote/discussions"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold hover:bg-cyan-400 transition-colors"
                    >
                        <span>เปิดกระทู้ใหม่บน GitHub</span>
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>

            {/* Discussions List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-cyan-400" />
                        กระทู้ล่าสุด
                    </h4>
                    <button
                        onClick={fetchDiscussions}
                        className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                        รีเฟรชข้อมูล
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mb-4" />
                        <p className="text-slate-500 animate-pulse text-sm font-medium">กำลังดึงข้อมูลจาก GitHub...</p>
                    </div>
                ) : discussions.length === 0 ? (
                    <div className="text-center py-20 rounded-3xl bg-slate-900/30 border border-dashed border-white/10">
                        <Github className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p className="text-slate-400">ยังไม่มีการพูดคุยในขณะนี้ หรืออาจจะลืมตั้งค่า GitHub Token</p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {discussions.map((discussion) => (
                            <motion.a
                                key={discussion.id}
                                href={discussion.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="block p-6 rounded-2xl bg-slate-900/50 border border-white/10 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all group"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={discussion.author.avatarUrl}
                                        alt={discussion.author.login}
                                        className="w-12 h-12 rounded-full border border-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-cyan-500 uppercase tracking-wider">
                                                @{discussion.author.login}
                                            </span>
                                            <span className="text-xs text-slate-500">
                                                {formatTime(discussion.createdAt)}
                                            </span>
                                        </div>
                                        <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-1">
                                            {discussion.title}
                                        </h4>
                                        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
                                            {discussion.body.replace(/[#*`]/g, '')}
                                        </p>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <ThumbsUp className="w-4 h-4" />
                                                <span>{discussion.upvoteCount} votes</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                <MessageSquare className="w-4 h-4" />
                                                <span>{discussion.commentCount} comments</span>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-cyan-400 text-xs font-bold">
                                                <span>อ่านต่อ</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.a>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}
