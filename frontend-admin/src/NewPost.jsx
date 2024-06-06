import { useState, useEffect } from 'react';
import Nav from './Nav';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function NewPost() {
    const navigate = useNavigate();
    const url = `http://localhost:3000/posts/new-post`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const postData = {
            title: e.target.title.value,
            text: e.target.text.value,
            published: e.target.published.value,
        };

        try {
            const token = localStorage.getItem('authenticationToken');
            const response = await fetch(url,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(postData),
                })
                const data = await response.json();
                if (response.ok) {
                    console.log(data)
                    navigate('/posts');
                }
        } catch (error) {
            console.error("Error requesting:", error)
        }
    }

    return (
        <>
            <Nav />
            <div className="content">
                    <form onSubmit={handleSubmit} className="new-post-form">
                    <label htmlFor='title'>Title</label>
                        <input 
                            type="text"
                            id="title"
                            name="title"
                            minLength={1}
                            maxLength={200}
                            required
                            className='title-input'
                        />
                    <label htmlFor='text'>Text</label>
                        <input
                            type='text'
                            id='text'
                            name='text'
                            minLength={1}
                            maxLength={2000}
                            required
                            className='text-input'
                        />
                        <div className='radio-options'>
                            <div className='published-true'>
                                <label htmlFor='published'>Published</label>
                                <input
                                    type='radio'
                                    id='published'
                                    name='published'
                                    value='true'
                                />
                            </div>
                            <div className='published-false'>
                                <label htmlFor='published'>Save draft</label>
                                <input
                                    type='radio'
                                    id='published'
                                    name='published'
                                    value='false'
                                />
                            </div>
                        </div>
                        <button className='submit-button' type="submit">Submit Post</button>
                    </form>
            </div>
        </>
    )
}