import { NextRequest, NextResponse } from 'next/server';
import { getGitHubDiscussions } from '@/lib/github';

export async function GET() {
    const owner = process.env.GITHUB_OWNER || 'GridsMicro'; // Default or from env
    const repo = process.env.GITHUB_REPO || 'Open-Vote';    // Default or from env

    if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
        console.warn('GITHUB_PERSONAL_ACCESS_TOKEN is not set, returning empty discussions');
        return NextResponse.json([]);
    }

    try {
        const discussions = await getGitHubDiscussions(owner, repo);
        return NextResponse.json(discussions);
    } catch (error) {
        console.error('API Error fetching discussions:', error);
        return NextResponse.json({ error: 'Failed to fetch discussions' }, { status: 500 });
    }
}
