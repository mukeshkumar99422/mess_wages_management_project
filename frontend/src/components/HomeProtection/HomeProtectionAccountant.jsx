import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function HomeProtectionAccountant({children}) {
    const navigate=useNavigate();
    const verified=useState(true); 
    //$$ change to actual verification logic

    if(!verified){
        navigate('/login');
        return null;
    }

    return (
        <>
            {children}
        </>
    )
}

export default HomeProtectionAccountant