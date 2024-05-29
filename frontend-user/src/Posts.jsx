import { useState, useEffect } from 'react';

// const fetchAllPosts = async () => {
//     const url = `http://localhost:3000/posts`;
//     try {
//         const response = await fetch(url);
//         const data = await response.json();
//         return data
//     } catch (error) {
//         console.log(error);
//         throw error
//     }
// }

export default function FetchPosts() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState([])
    const url = `http://localhost:3000/posts`;

    const fetchAllPosts = async () => {
        // const url = `http://localhost:3000/posts`;
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
                    console.log(postsData);
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
            <p>Loading...</p>
        </>
    )
    if (error) return (
        <>
            <p>Error</p>
        </>
    )

    return (
        <>
            <div>
                {posts.map((post) => (
                    <div key={post._id}>
                        <a href={post.url}><h1>{post.title}</h1> </a>
                        <p>By {post.author.username}, {post.date_formatted}</p>
                        <p>{post.text}</p>
                    </div>
                ))}
            </div>
        </>
    )
}