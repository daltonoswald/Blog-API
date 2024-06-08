import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PostEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const post = location.state?.post
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState(post.title);
    const [text, setText] = useState(post.text)
    // const url = `http://localhost:3000/posts/${post._id}`;
    const url = `https://blog-api-production-6af2.up.railway.app/posts/${post._id}`;
    // const editUrl = `http://localhost:3000/posts/edit/${post._id}`;
    const editUrl = `https://blog-api-production-6af2.up.railway.app/posts/edit/${post._id}`;

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

    useEffect(() => {
            try {
                const getPost = async () => {
                    const postData = await fetchPost();
                    setIsLoading(false);  
                }
                getPost();
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title: title,
            text: text,
            published: e.target.published.value,
        };

        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(editUrl,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(postData),
                })
                const data = await response.json();
                if (response.ok) {
                    navigate('/drafts');
                }
        } catch (error) {
            console.error("Error requesting:", error)
        }
    }

        function handleTitle(e) {
            setTitle(e.target.value)
        }
        function handleText(e) {
            setText(e.target.value)
        }
            return (
                <>
                    <Nav />
                    <div className='content'>
                        <p>{post.title}</p>
                    <form onSubmit={handleSubmit} className="edit-post-form">
                    <label htmlFor='title'>Title</label>
                        <input 
                            type="text"
                            id="title"
                            name="title"
                            minLength={1}
                            maxLength={200}
                            // value={post.title}
                            defaultValue={post.title}
                            onChange={handleTitle}
                            required
                        />
                    <label htmlFor='text'>Text</label>
                        <input
                            type='text'
                            id='text'
                            name='text'
                            minLength={1}
                            maxLength={2000}
                            defaultValue={post.text}
                            onChange={handleText}
                            required
                        />
                        <label htmlFor='published'>Published</label>
                        <input
                            type='radio'
                            id='published'
                            name='published'
                            value='true'
                        />
                        <label htmlFor='published'>Save draft</label>
                        <input
                            type='radio'
                            id='published'
                            name='published'
                            value='false'
                        />
                        <button type="submit">Submit Post</button>
                    </form>             
                    </div>
                </>
            )
}