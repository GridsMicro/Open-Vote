'use client';

import React, { useState, useEffect } from 'react';
import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShieldCheck, CheckCircle2, XCircle, ChevronRight, Hash, Database } from 'lucide-react';

export default function MerkleVerifier() {
    const [vote, setVote] = useState('Voter: 001 | Candidate: A');
    const [root, setRoot] = useState('');
    const [proof, setProof] = useState<string[]>([]);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);

    // จำลองโหวตในระบบ 4 โหวต
    const mockVotes = [
        'Voter: 001 | Candidate: A',
        'Voter: 002 | Candidate: B',
        'Voter: 003 | Candidate: A',
        'Voter: 004 | Candidate: C'
    ];

    useEffect(() => {
        // คำนวณ Root เบื้องต้นสำหรับ UI
        const leaves = mockVotes.map(v => keccak256(v));
        const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
        setRoot(tree.getHexRoot());
    }, []);

    const handleVerify = () => {
        setIsVerifying(true);
        setIsValid(null);

        setTimeout(() => {
            const leaves = mockVotes.map(v => keccak256(v));
            const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
            const leaf = keccak256(vote);
            const hexProof = tree.getHexProof(leaf);

            setProof(hexProof);
            const verified = tree.verify(hexProof, leaf, root);
            setIsValid(verified);
            setIsVerifying(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white font-outfit">ระบบพิสูจน์ผลโหวต (Merkle Verifier)</h3>
                    <p className="text-slate-400 text-sm">ตรวจสอบความถูกต้องด้วยความจริงเชิงคณิตศาสตร์</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Side: Input */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-3 tracking-wider uppercase">
                            1. เนื้อหาโหวตของคุณ (Vote Content)
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={vote}
                                onChange={(e) => setVote(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm"
                            />
                            <Search className="absolute right-4 top-3.5 w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-400 text-xs font-semibold mb-3 tracking-wider uppercase">
                            2. Merkle Root (จากบล็อกเชน)
                        </label>
                        <div className="group relative">
                            <div className="w-full bg-slate-950 border border-white/5 rounded-xl px-4 py-3 text-slate-500 font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                                {root || 'Calculating...'}
                            </div>
                            <Database className="absolute right-4 top-3.5 w-4 h-4 text-slate-600" />
                        </div>
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={isVerifying}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${isVerifying ? 'bg-slate-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/20 active:scale-95'
                            }`}
                    >
                        {isVerifying ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                                <Hash className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <>
                                <span>ตรวจสอบคะแนน</span>
                                <ChevronRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>

                {/* Right Side: Visualizing the Proof */}
                <div className="flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {isValid === null && !isVerifying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-center p-8 border border-dashed border-white/10 rounded-3xl"
                            >
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShieldCheck className="w-8 h-8 text-slate-500" />
                                </div>
                                <p className="text-slate-500 text-sm">กรอกข้อมูลโหวตด้านซ้าย <br />เพื่อเริ่มกระบวนการพิสูจน์ทางคณิตศาสตร์</p>
                            </motion.div>
                        )}

                        {isVerifying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key="verifying"
                                className="space-y-4"
                            >
                                <div className="flex items-center gap-3 text-cyan-400">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-2 h-2 bg-cyan-400 rounded-full"
                                    />
                                    <span className="text-sm font-medium">Hashing Vote Content...</span>
                                </div>
                                <div className="flex items-center gap-3 text-blue-400 delay-75">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                        className="w-2 h-2 bg-blue-400 rounded-full"
                                    />
                                    <span className="text-sm font-medium">Fetching Merkle Proof Path...</span>
                                </div>
                                <div className="flex items-center gap-3 text-indigo-400 delay-150">
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                        className="w-2 h-2 bg-indigo-400 rounded-full"
                                    />
                                    <span className="text-sm font-medium">Validating mathematical truth...</span>
                                </div>
                            </motion.div>
                        )}

                        {isValid !== null && !isVerifying && (
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`p-8 rounded-3xl text-center ${isValid ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
                            >
                                {isValid ? (
                                    <>
                                        <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold text-white mb-2">ยืนยันสำเร็จ!</h4>
                                        <p className="text-slate-400 text-sm">
                                            โหวตนี้ถูกนับใน Merkle Root ปัจจุบัน <br />และไม่เคยถูกแก้ไขตั้งแต่ถูกบันทึกลงบล็อกเชน
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                        <h4 className="text-xl font-bold text-white mb-2">พิสูจน์ไม่ผ่าน!</h4>
                                        <p className="text-slate-400 text-sm">
                                            ข้อมูลโหวตนี้ไม่ตรงกับ Root ในระบบ <br />หรืออาจถูกลอบแก้ไขข้อมูลระหว่างทาง
                                        </p>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Leaves in Tree</p>
                    <p className="text-xl font-bold text-white font-outfit">35,000,000</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/50">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Proof Complexity</p>
                    <p className="text-xl font-bold text-white font-outfit">Log2(n)</p>
                </div>
            </div>
        </div>
    );
}
