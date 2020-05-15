import React, { useContext, useState, useCallback, useEffect } from 'react';
import { animated, useTransition } from 'react-spring';

const TOAST_DURATION = 1500;

const ToastContext = React.createContext(null);

import './ToastManager.css';

let id = 1;

const Toast = ({ children, id, style }) => {
    const { removeToast } = useToastManager();

    useEffect(() => {
        const timer = setTimeout(() => {
            removeToast(id);
        }, TOAST_DURATION);

        return () => {
            clearTimeout(timer);
        }
    }, [id, removeToast]);

    return (
        <animated.div className="toast" style={style}>{children}</animated.div>
    )
}

const ToastContainer = ({ toasts }) => {
    const transitions = useTransition(toasts, toast => toast.id, {
        from: { transform: 'translate3d(0,-40px,0)' },
        enter: { transform: 'translate3d(0,0px,0)' },
        leave: { transform: 'translate3d(0,-40px,0)' },
        config: { duration: 100 }
    })

    return (
        <div className="toastContainer">
            {
                transitions.map(( { item, key, props }) => (
                    <Toast key={key} id={item.id} style={props}>{item.message}</Toast>
                ))
            }
        </div>
    )
}

const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([])

    const addToast = useCallback(message => {
        setToasts(toasts => [
            ...toasts,
            { id: id++, message }
        ])
    }, [setToasts])
    
    const removeToast = useCallback(id => {
        setToasts(toasts => toasts.filter(t => t.id !== id));
    }, [setToasts]);

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            <ToastContainer toasts={toasts} />
            {children}
        </ToastContext.Provider>
    )
}

export const useToastManager = (props) => {
    const toastHelpers = useContext(ToastContext);
    return toastHelpers;
}

export default ToastProvider;