"use client";
import { useEffect, useState } from 'react'
import styles from './page.module.css'
import { ethers } from 'ethers';

export default function Home() {
  const [balance, setBalance] = useState('')
  const [updates, setUpdates] = useState(0)

  useEffect(() => {
    const socket = new WebSocket(
      `${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`
    )

    socket.onopen = () => {
      console.debug('connected')
      socket.send(
        JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_getBalance',
          params: ['0xee6be79f80c26ce956f845ed8e71b0c65f2c7a4d'],
        })
      )
    }

    socket.onmessage = (event) => {
      console.debug(event.data)

      const data = JSON.parse(event.data)
      const balance = data?.result

      setBalance(ethers.formatEther(balance))
      setUpdates(updates + 1)
    }

    socket.onclose = () => {
      console.debug('disconnected')
    }

    return () => {
      socket.close()
    }
  }, [])

  return (
    <main className={styles.main}>
      <h1>Alchemy Websockets Test</h1>
      <h2>Balance: {balance}</h2>
      <h2>Updates: {updates}</h2>
      <p>Api Key: {process.env.NEXT_PUBLIC_ALCHEMY_KEY}</p>
    </main>
  )
}
