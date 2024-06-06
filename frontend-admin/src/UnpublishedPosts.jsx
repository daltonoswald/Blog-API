import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Nav from './Nav';

export default function UnpublishedPosts() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([])
    const url = `http://localhost:3000/posts/drafts`;

    const fetchAllPosts = async () => {
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
                const getPosts = async () => {
                    const postsData = await fetchAllPosts();
                    setPosts(postsData);
                    setIsLoading(false);  
                }
                getPosts();
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

    return (
        <>
            <Nav />
            <div className='content'>
                {posts.map((post) => (
                    <div key={post._id}>
                        <Link 
                            to={`/posts/${post._id}`}
                            key={post._id}
                            state={{ post }}
                            >
                                <h1>{post.title}</h1>
                        </Link>
                        {/* <a href={post.url}><h1>{post.title}</h1> </a> */}
                        <p>By {post.author.username}, {post.date_formatted}</p>
                        <p>{post.text}</p>
                    </div>
                ))}
            </div>
        </>
    )
}