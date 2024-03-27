import React, { useEffect, useState } from 'react';

const TipBar = ({ message, duration = 3000 }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShow(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!show) return null;

    return (
        <div className='fixed flex items-center justify-center top-0 left-0 right-0 z-10'>
            <div className='text-white py-2 text-center shadow-sm rounded-t-none rounded-b-lg h-full w-4/5' style={{"backgroundColor": "rgb(56,117,198)"}}>{message}</div>
        </div>
    );
};

export default TipBar;