import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const POSTS_FILE = path.join(process.cwd(), 'data', 'community-posts.json');

// Ensure data directory exists
const ensureDataDir = () => {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(POSTS_FILE)) {
        fs.writeFileSync(POSTS_FILE, JSON.stringify([], null, 2));
    }
};

interface Post {
    id: string;
    user: string;
    userId: string;
    userAvatar?: string;
    role: string;
    content: string;
    timestamp: number;
    likes: number;
    likedBy: string[];
}

// GET - Fetch all posts
export async function GET() {
    try {
        ensureDataDir();
        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        const posts: Post[] = JSON.parse(data);

        // Sort by timestamp (newest first)
        posts.sort((a, b) => b.timestamp - a.timestamp);

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error reading posts:', error);
        return NextResponse.json([], { status: 500 });
    }
}

// POST - Create new post
export async function POST(request: NextRequest) {
    try {
        ensureDataDir();
        const body = await request.json();
        const { user, userId, userAvatar, role, content } = body;

        if (!content || !user || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        const posts: Post[] = JSON.parse(data);

        const newPost: Post = {
            id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            user,
            userId,
            userAvatar,
            role: role || 'Citizen',
            content,
            timestamp: Date.now(),
            likes: 0,
            likedBy: []
        };

        posts.push(newPost);
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Error creating post:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a post
export async function DELETE(request: NextRequest) {
    try {
        ensureDataDir();
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('id');
        const userId = searchParams.get('userId');

        if (!postId || !userId) {
            return NextResponse.json(
                { error: 'Missing post ID or user ID' },
                { status: 400 }
            );
        }

        const data = fs.readFileSync(POSTS_FILE, 'utf8');
        let posts: Post[] = JSON.parse(data);

        const post = posts.find(p => p.id === postId);
        if (!post) {
            return NextResponse.json(
                { error: 'Post not found' },
                { status: 404 }
            );
        }

        // Only allow deletion by post owner
        if (post.userId !== userId) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        posts = posts.filter(p => p.id !== postId);
        fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting post:', error);
        return NextResponse.json(
            { error: 'Failed to delete post' },
            { status: 500 }
        );
    }
}
