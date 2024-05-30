import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Nav() {

    return (
        <div className='nav'>
            <div className='nav-left'>
                <Link to='/'>Homepage</Link>
            </div>
            <div className='nav-right'>
                <Link to='/log-in'>Log in</Link>
                <Link to='/sign-up'>Sign up</Link>
            </div>
        </div>
    )
}