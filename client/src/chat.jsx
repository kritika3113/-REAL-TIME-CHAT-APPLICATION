import React, { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:4000'

function Chat() {
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [connectionState, setConnectionState] = useState('Connecting...')
    const [nameInput, setNameInput] = useState('')
    const [username, setUsername] = useState('')
    const [hasJoined, setHasJoined] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const socketRef = useRef(null)

    useEffect(() => {
        const activeSocket = io(SOCKET_URL)
        socketRef.current = activeSocket

        activeSocket.on('connect', () => {
            setConnectionState('Connected')
        })

        activeSocket.on('disconnect', () => {
            setConnectionState('Disconnected')
        })

        activeSocket.on('connect_error', () => {
            setConnectionState('Disconnected')
        })

        activeSocket.on('receivemessage', (incoming) => {
            const base =
                typeof incoming === 'string'
                    ? { text: incoming, sender: 'Anonymous', timestamp: new Date().toISOString() }
                    : {
                          text: typeof incoming?.text === 'string' ? incoming.text : '',
                          sender:
                              typeof incoming?.sender === 'string' && incoming.sender.trim()
                                  ? incoming.sender.trim()
                                  : 'Anonymous',
                          timestamp:
                              typeof incoming?.timestamp === 'string'
                                  ? incoming.timestamp
                                  : new Date().toISOString(),
                      }

            const normalizedText = base.text.trim()
            if (!normalizedText) {
                return
            }

            const time = new Date(base.timestamp)
            setMessages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    text: normalizedText,
                    sender: base.sender,
                    timestamp: time.toISOString(),
                    displayTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
            ])
        })

        return () => {
            activeSocket.removeAllListeners()
            activeSocket.disconnect()
        }
    }, [])

    const joinChat = (event) => {
        event.preventDefault()
        const chosenName = nameInput.trim()
        setUsername(chosenName || 'Anonymous')
        setHasJoined(true)

        const activeSocket = socketRef.current
        if (!activeSocket) {
            return
        }

        activeSocket.emit('join', { name: chosenName || 'Anonymous' })
    }

    const sendMessage = (event) => {
        event.preventDefault()

        const trimmed = inputValue.trim()
        if (!trimmed || !socketRef.current) {
            return
        }

        socketRef.current.emit('sendmessage', {
            text: trimmed,
            sender: username || 'Anonymous',
        })
        setInputValue('')
    }

    const toggleHistory = () => {
        setShowHistory((previous) => !previous)
    }

    const closeHistory = () => {
        setShowHistory(false)
    }

    const isConnected = connectionState === 'Connected'

    if (!hasJoined) {
        return (
            <div className="login-wrapper">
                <form className="login-card" onSubmit={joinChat}>
                    <h1>Join The Chat</h1>
                    <p>Pick a display name to start messaging.</p>
                    <label className="visually-hidden" htmlFor="display-name">
                        Display name
                    </label>
                    <input
                        id="display-name"
                        type="text"
                        value={nameInput}
                        onChange={(event) => setNameInput(event.target.value)}
                        placeholder="Enter your name"
                        maxLength={32}
                        autoFocus
                    />
                    <button type="submit">Enter Chat</button>
                </form>
            </div>
        )
    }

    return (
        <div className="chat-wrapper">
            <header className="chat-header">
                <div className="chat-header-info">
                    <h1>Realtime Chat</h1>
                    <p className="chat-subtitle">Logged in as {username}</p>
                </div>
                <div className="chat-header-actions">
                    <span data-status={connectionState.toLowerCase()}>{connectionState}</span>
                    <button type="button" onClick={toggleHistory} className="history-button">
                        History
                    </button>
                </div>
            </header>

            <section className="chat-messages" aria-live="polite">
                <h2 className="visually-hidden">Message History</h2>
                {messages.length === 0 ? (
                    <p className="placeholder">No messages yet. Say hello!</p>
                ) : (
                    messages.map((message) => {
                        const ownership = message.sender === username ? 'own' : 'remote'
                        const label = ownership === 'own' ? 'Your message' : `Message from ${message.sender}`
                        return (
                            <article key={message.id} className={`message ${ownership}`} aria-label={label}>
                                <header className="message-meta">
                                    <span className="message-author">{message.sender}</span>
                                    <time dateTime={message.timestamp}>{message.displayTime}</time>
                                </header>
                                <p>{message.text}</p>
                            </article>
                        )
                    })
                )}
            </section>

            <form className="chat-input" onSubmit={sendMessage}>
                <label className="visually-hidden" htmlFor="chat-message">
                    Type your message
                </label>
                <input
                    id="chat-message"
                    type="text"
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder="Type your message..."
                    aria-label="Message"
                    autoComplete="off"
                />
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!socketRef.current || !isConnected || !inputValue.trim()}
                >
                    Send
                </button>
            </form>

            {showHistory && (
                <>
                    <button type="button" className="history-backdrop" aria-label="Close history" onClick={closeHistory} />
                    <aside className="history-panel" aria-live="polite" aria-label="Message history">
                        <header className="history-header">
                            <h2>Chat History</h2>
                            <button type="button" onClick={closeHistory} aria-label="Close history view">
                                Close
                            </button>
                        </header>
                        {messages.length === 0 ? (
                            <p className="history-empty">No messages yet.</p>
                        ) : (
                            <ul className="history-list">
                                {messages
                                    .slice()
                                    .reverse()
                                    .map((message) => (
                                        <li key={message.id}>
                                            <span className="history-time">{message.displayTime}</span>
                                            <span className="history-author">{message.sender}:</span>
                                            <span className="history-text">{message.text}</span>
                                        </li>
                                    ))}
                            </ul>
                        )}
                    </aside>
                </>
            )}
        </div>
    )
}

export default Chat