import { Octokit } from 'octokit';

const octokit = new Octokit({
    auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN
});

export interface DiscussionPost {
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

export async function getGitHubDiscussions(owner: string, repo: string) {
    const query = `
    query ($owner: String!, $repo: String!) {
      repository(owner: $owner, name: $repo) {
        discussions(first: 10, orderBy: {field: CREATED_AT, direction: DESC}) {
          nodes {
            id
            title
            body
            url
            createdAt
            author {
              login
              avatarUrl
            }
            upvoteCount
            comments {
              totalCount
            }
          }
        }
      }
    }
  `;

    try {
        const response: any = await octokit.graphql(query, { owner, repo });

        return response.repository.discussions.nodes.map((node: any) => ({
            id: node.id,
            title: node.title,
            body: node.body,
            url: node.url,
            author: node.author,
            createdAt: node.createdAt,
            upvoteCount: node.upvoteCount,
            commentCount: node.comments.totalCount
        }));
    } catch (error) {
        console.error('Error fetching GitHub discussions:', error);
        return [];
    }
}
