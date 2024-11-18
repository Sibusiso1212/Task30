import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/UserDetails.css';

// Component to display detailed information about a GitHub user and their repositories
const UserDetails = () => {
    // Extract username from URL parameters
    const { username } = useParams();
    // State for storing user and repository data
    const [userData, setUserData] = useState(null);
    // State for managing loading state
    const [loading, setLoading] = useState(true);

    // Effect hook to fetch user data when component mounts or username changes
    useEffect(() => {
        // Async function to fetch user data from the backend
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${username}`);
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error(error);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [username]);

    // Helper function to format dates in a readable format
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Show loading state while data is being fetched
    if (loading) return <div className="loader">Loading...</div>;
    // Show error message if user data is not found
    if (!userData) return <div>User not found</div>;

    return (
        <div className="user-details">
            {/* User Profile Section */}
            <div className="profile-section">
                <img src={userData.user.avatar_url} alt={userData.user.login} />
                <h2>{userData.user.name || userData.user.login}</h2>
                <p className="bio">{userData.user.bio}</p>
                {/* User Statistics */}
                <div className="stats">
                    <span>Followers: {userData.user.followers}</span>
                    <span>Following: {userData.user.following}</span>
                    <span>Public Repos: {userData.user.public_repos}</span>
                </div>
                <a href={userData.user.html_url} target="_blank" rel="noopener noreferrer" className="external-link">
                    View on GitHub
                </a>
            </div>
            
            {/* Repositories Section */}
            <div className="repos-section">
                <h3>Repositories</h3>
                <div className="repos-grid">
                    {/* Map through repositories and display them as cards */}
                    {userData.repos.map(repo => (
                        <div key={repo.id} className="repo-card">
                            <h4>{repo.name}</h4>
                            <p className="description">{repo.description || 'No description available'}</p>
                            {/* Repository Details */}
                            <div className="repo-details">
                                <p><strong>Created:</strong> {formatDate(repo.created_at)}</p>
                                <p><strong>Last Updated:</strong> {formatDate(repo.updated_at)}</p>
                                <p><strong>Last Push:</strong> {formatDate(repo.pushed_at)}</p>
                                <p><strong>Language:</strong> {repo.language || 'Not specified'}</p>
                                <p><strong>Stars:</strong> {repo.stargazers_count}</p>
                                <p><strong>Forks:</strong> {repo.forks_count}</p>
                            </div>
                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-link">
                                View Repository
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserDetails;