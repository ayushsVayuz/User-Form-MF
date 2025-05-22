import React, { useState, useEffect } from 'react'

const CheckInternetConnection = (props) => {

    const [isOnline, setOnline] = useState(true);

    /**
     * Updates the online status by checking navigator.onLine once when the component mounts.
     * @return {void} Sets the online status based on the browser's connection state.
     */
    useEffect(() => {
        setOnline(navigator.onLine);
    }, []);

    window.addEventListener('online', () => {
        setOnline(true)
    })

    window.addEventListener('offline', () => {
        setOnline(false)
    })

    if (isOnline) {
        return (
            props.children
        )
    }
    else {
        return (<h1>Please check your internet connection.</h1>)
    }
}

export default CheckInternetConnection
