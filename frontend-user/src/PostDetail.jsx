import { useState, useEffect } from 'react';
import Nav from './Nav';
import { useLocation } from 'react-router-dom';

export default function PostDetail({ username }) {
    const location = useLocation();
    const post = location.state?.post
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState(null);
    const url = `http://localhost:3000/posts/${post._id}`;
    const commentUrl = `http://localhost:3000/posts/${post._id}/comments`;

    const fetchPost = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);
            return data
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    const fetchComments = async () => {
        try {
            const response = await fetch(commentUrl);
            const data = await response.json()
            return data
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    useEffect(() => {
            try {
                const getPost = async () => {
                    const postData = await fetchPost();
                    setIsLoading(false);  
                }
                getPost();
                const getComments = async () => {
                    const commentData = await fetchComments();
                    setComments(commentData);
                }
                getComments();
            } catch (error) {
                setIsLoading(false);
                console.log(error);
                throw error;
            }
    }, []);

    if (isLoading) return (
        <>
            <Nav username={username} />
            <p>Loading...</p>
        </>
    )
    if (error) return (
        <>
            <Nav username={username} />
            <p>Error</p>
        </>
    )

    function renderComments(comments) {
        if (!comments || comments.length === 0) {
            console.log(comments)
            return(
                <p>No comments yet...</p>
            )
        } else {
            console.log(comments);
            return (
                comments.map((comment) => {
                    <div key={comment._id}>
                        <div>
                            <p>{comment.author}</p>
                            <p>{comment.text}</p>
                        </div>
                </div>
                })
            )
        }

        }

    return (
        <>
            <Nav username={username} />
            <div className='content'>
                    <div key={post._id}>
                        <h1>{post.title}</h1>
                        <p>By {post.author.username}, {post.date_formatted}</p>
                        <p>{post.text}</p>
                    </div>
                    <div className='comments'>
                        {renderComments(comments)}
                    </div>
            </div>
        </>
    )
}