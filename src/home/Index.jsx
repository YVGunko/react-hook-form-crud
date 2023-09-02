import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Стиль-Пласт</h1>
            <p>Корпоративный портал.</p>
            <p><Link to="customers">&gt;&gt; Manage Users</Link></p>
        </div>
    );
}

export { Home };