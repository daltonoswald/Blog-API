import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PostDetail() {
    const navigate = useNavigate();
    const location = useLocation();
    const post = location.state?.post
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState(null);
    const url = `http://localhost:3000/posts/${post._id}`;
    const commentUrl = `http://localhost:3000/posts/${post._id}/comments`;
    const addCommentUrl = `http://localhost:3000/posts/${post._id}/comments/new-comment`

    const fetchPost = async () => {
        try {
            const response = await fetch(url);
            const data = await response.json();
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
            <Nav />
            <p>Loading...</p>
        </>
    )
    if (error) return (
        <>
            <Nav />
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
            return (
                <div className='comments'>
                {comments.map((comment) => (
                    <div className='comment' key={comment._id}>
                        <div>
                            <p>{comment.author.username}</p>
                            <p>{comment.text}</p>
                        </div>
                    </div>
                ))}
                </div>
            )
        }
        }

        const addComment = async (e) => {
            e.preventDefault();
            const commentData = {
                text: e.target.text.value,
            };

            try {
                const token = localStorage.getItem('authenticationToken');
                const response = await fetch(addCommentUrl,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(commentData),
                    })
                    const data = await response.json();
                    if (response.ok) {
                        console.log(data)
                        window.location.reload();
                    }
            } catch (error) {
                console.error("Error requesting:", error)
            }
        }
            return (
                <>
                    <Nav />
                    <div className='content'>
                            <div key={post._id} className='post-detail'>
                                <h1>{post.title}</h1>
                                <p>By {post.author.username}, {post.date_formatted}</p>
                                <p>{post.text}</p>
                                {/* <button onClick={navigate('/edit/:post._id')}>Edit Post</button> */}
                                <Link 
                                    to={`/edit/${post._id}`}
                                    key={post._id}
                                    state={{ post }}
                                >
                                    <p className='edit-button'>Edit</p>
                                </Link>
                                <Link
                                    to={`/delete/${post._id}`}
                                    key={post.id}
                                    state={{ post }}
                                >
                                    <p className='delete-button'>Delete Post</p>
                                </Link>
                            </div>
                            <div className='comment-section'>
                                {renderComments(comments)}
                                <form onSubmit={addComment} className='comment-form'>
                                    <label className='comment-label' htmlFor='text'>Comment:</label>
                                    <input 
                                        type='textarea'
                                        id='text'
                                        name='text'
                                        minLength={1}
                                        maxLength={200}
                                        required
                                        className='comment-input'
                                    />
                                    <button className='submit-button' type="submit">Post Comment</button>
                                </form>
                            </div>
                                
                    </div>
                </>
            )
}