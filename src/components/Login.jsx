import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'
import { motion, AnimatePresence } from 'framer-motion'

export default function Login() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const { login, signup } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        try {
            if (isLogin) {
                await login(email, password)
                toast.success("Welcome back!")
            } else {
                await signup(email, password)
                toast.success("Account created! You are now logged in.")
            }
        } catch (error) {
            console.error(error)
            toast.error(error.message)
        }
        setLoading(false)
    }

    return (
        <motion.div
            className="glass-panel login-panel"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence mode="wait">
                <motion.h2
                    key={isLogin ? "login" : "signup"}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                >
                    {isLogin ? 'Login' : 'Sign Up'}
                </motion.h2>
            </AnimatePresence>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <motion.button
                    type="submit"
                    className="btn-primary"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
                </motion.button>
            </form>
            <p className="toggle-text">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <span onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? 'Sign Up' : 'Login'}
                </span>
            </p>
        </motion.div>
    )
}
