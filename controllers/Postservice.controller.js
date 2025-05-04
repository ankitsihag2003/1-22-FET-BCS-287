import axios from 'axios';

// Fetch posts based on type (popular or latest)
async function fetchPosts({ type = "popular" }) {
    try {
        const response = await axios.get('http://hostname/posts', {
            params: { type } // Type can be 'popular' or 'latest'
        });
        return response.data.posts;
    } catch (error) {
        throw new Error('Error fetching posts');
    }
}

// Helper function to fetch comments for a post
async function fetchComments(postId) {
    try {
        const response = await axios.get(`http://hostname/posts/${postId}/comments`);
        return response.data.comments;
    } catch (error) {
        throw new Error(`Error fetching comments for post ${postId}`);
    }
}

// Get popular posts (highest number of comments)
async function getPopularPosts() {
    let posts = await fetchPosts({ type: 'popular' }); // Fetch popular posts
    let postsWithCommentCount = await Promise.all(posts.map(async (post) => {
        let comments = await fetchComments(post.id); // Fetch comments for each post
        return { post, commentCount: comments.length };
    }));

    postsWithCommentCount.sort((a, b) => b.commentCount - a.commentCount); // Sort by comment count
    return postsWithCommentCount.slice(0, 5); // Return top 5 posts
}

// Get latest posts (newest first)
async function getLatestPosts() {
    let latestPosts = await fetchPosts({ type: 'latest' }); // Fetch latest posts
    return latestPosts.slice(0, 5); // Return the most recent 5 posts
}

// Controller function to handle requests
async function getPosts(req, res) {
    const { type } = req.query; // Get 'type' query parameter (popular or latest)

    try {
        if (type === 'popular') {
            const popularPosts = await getPopularPosts(); // Get popular posts
            return res.status(200).json(popularPosts); // Return top popular posts
        } else if (type === 'latest') {
            const latestPosts = await getLatestPosts(); // Get latest posts
            return res.status(200).json(latestPosts); // Return latest posts
        } else {
            return res.status(400).json({ error: "Invalid 'type' query parameter. Accepted values are 'popular' or 'latest'." });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export default getPosts;
