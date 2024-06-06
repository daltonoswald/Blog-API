import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function PostDelete() {
    const navigate = useNavigate();
    const location = useLocation();
    const post = location.state?.post
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const url = `http://localhost:3000/posts/delete/${post._id}`

//     const fetchPost = async () => {
//         try {
//             const response = await fetch(url);
//             const data = await response.json();
//             console.log(data);
//             return data
//         } catch (error) {
//             console.log(error);
//             throw error
//         }
//     }

//     useEffect(() => {
//         try {
//             const getPost = async () => {
//                 const postData = await fetchPost();
//                 setIsLoading(false);  
//             }
//             getPost();
//         } catch (error) {
//             setIsLoading(false);
//             console.log(error);
//             throw error;
//         }
// }, []);

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    mode: "cors",
                });
                const data = await response.json();
                if (response.ok) {
                    navigate(`/posts/`);
                } else {
                    console.log("Error deleting post:", data.message)
                }
        } catch (error) {
            console.error("Error requesting:", error);
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
                </div>
                <button className='delete-button' onClick={handleDelete}>Delete Post</button>
            </div>
        </>
    )

}