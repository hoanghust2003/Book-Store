import React from 'react'

import { Navigate } from 'react-router-dom'

const PrivateRoute = ({children}) => {

    if(loading) {
        return <div>Loading..</div>
    }
    if(currentUser) {
        return children;
    }
  
    return <Navigate to="/login" replace/>
}

export default PrivateRoute