import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function HomeProtectionStudent(children) {
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

export default HomeProtectionStudent