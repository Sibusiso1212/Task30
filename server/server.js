const express = require('express');
const helmet = require('helmet');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// GitHub API configuration
const GITHUB_API_URL = 'https://api.github.com';
const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'github-explorer-app'
};

app.use(helmet());
app.use(cors());
app.use(express.json());

// Search users endpoint remains the same
app.get('/api/search/users/:query', async (req, res) => {
    try {
        const response = await axios.get(
            `${GITHUB_API_URL}/search/users?q=${encodeURIComponent(req.params.query)}`,
            { headers }
        );
        res.json(response.data);
    } catch (error) {
        console.error('GitHub API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Internal Server Error'
        });
    }
});

// Enhanced user details endpoint with commits
app.get('/api/users/:username', async (req, res) => {
    try {
        const [userResponse, reposResponse] = await Promise.all([
            axios.get(`${GITHUB_API_URL}/users/${req.params.username}`, { headers }),
            axios.get(`${GITHUB_API_URL}/users/${req.params.username}/repos`, { headers })
        ]);

        // Get commits for each repository
        const reposWithCommits = await Promise.all(
            reposResponse.data.map(async (repo) => {
                try {
                    const commitsResponse = await axios.get(
                        `${GITHUB_API_URL}/repos/${req.params.username}/${repo.name}/commits?per_page=5`,
                        { headers }
                    );
                    return {
                        ...repo,
                        recent_commits: commitsResponse.data.map(commit => ({
                            sha: commit.sha,
                            message: commit.commit.message,
                            description: commit.commit.body, // Adding the full commit description
                            date: commit.commit.author.date,
                            author: commit.commit.author.name,
                            html_url: commit.html_url // Adding the commit URL for reference
                        }))
                    };
                } catch (error) {
                    return {
                        ...repo,
                        recent_commits: []
                    };
                }
            })
        );
        
        res.json({
            user: userResponse.data,
            repos: reposWithCommits
        });
    } catch (error) {
        console.error('GitHub API Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            error: error.response?.data?.message || 'Internal Server Error'
        });
    }
});

if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
