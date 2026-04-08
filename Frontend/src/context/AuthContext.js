    import React, { createContext, useContext, useEffect, useState, useReducer } from 'react';
    import axios from 'axios';

    const AuthContext = createContext();

    const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
        return {
            ...state,
            user: action.payload.user,
            token: action.payload.token,
            isAuthenticated: true
        };
        case 'LOGOUT':
        return {
            ...state,
            user: null,
            token: null,
            isAuthenticated: false
        };
        case 'LOAD_USER':
        return {
            ...state,
            user: action.payload,
            isAuthenticated: true
        };
        default:
        return state;
    }
    };

    export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: localStorage.getItem('token'),
        isAuthenticated: false
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        loadUser();
        }
    }, []);

    const loadUser = async () => {
        try {
        const res = await axios.get('/api/auth/me');
        dispatch({ type: 'LOAD_USER', payload: res.data });
        } catch (error) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        }
    };

    const login = async (credentials) => {
        const res = await axios.post('/api/auth/login', credentials);
        const { token, user } = res.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN', payload: { token, user } });
        return res.data;
    };

    const register = async (userData) => {
        const res = await axios.post('/api/auth/register', userData);
        const { token, user } = res.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN', payload: { token, user } });
        return res.data;
    };

    const googleLogin = async (userData) => {
        const res = await axios.post('/api/auth/google-login', userData);
        const { token, user } = res.data;
        
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        dispatch({ type: 'LOGIN', payload: { token, user } });
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider value={{
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        login,
        register,
        googleLogin,
        logout,
        loadUser
        }}>
        {children}
        </AuthContext.Provider>
    );
    };

    export const useAuth = () => useContext(AuthContext);