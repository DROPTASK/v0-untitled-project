"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MicroCoin } from "@/components/micro-coin"

interface SpinGameProps {
  onComplete: () => void
}

export function SpinGame({ onComplete }: SpinGameProps) {
  const [isSpinning, setIsSpinning] = useState(false)
  const [reward, setReward] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [cards, setCards] = useState<number[]>([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Generate possible rewards
  useEffect(() => {
    // Adjusted rewards to max 5 tokens with average around 0.5
    const possibleRewards = [0.01, 0.05, 0.1, 0.2, 0.5, 1, 2, 5]

    // Create a set of cards with rewards
    const newCards = []
    for (let i = 0; i < 10; i++) {
      // Weight the distribution to favor smaller rewards
      const randomValue = Math.random()
      let rewardIndex

      if (randomValue < 0.4) {
        // 40% chance for very small rewards (0.01-0.1)
        rewardIndex = Math.floor(Math.random() * 3)
      } else if (randomValue < 0.8) {
        // 40% chance for medium rewards (0.2-0.5)
        rewardIndex = 3 + Math.floor(Math.random() * 2)
      } else if (randomValue < 0.95) {
        // 15% chance for good rewards (1-2)
        rewardIndex = 5 + Math.floor(Math.random() * 2)
      } else {
        // 5% chance for max reward (5)
        rewardIndex = 7
      }

      newCards.push(possibleRewards[rewardIndex])
    }

    setCards(newCards)
  }, [])

  const startSpin = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowResult(false)

    // Animate cards shuffling
    const shuffleInterval = setInterval(() => {
      setCards((prevCards) => {
        const newCards = [...prevCards]
        // Shift cards to create shuffling effect
        const first = newCards.shift()
        if (first !== undefined) newCards.push(first)
        return newCards
      })
    }, 100)

    // Stop spinning after 2 seconds
    setTimeout(() => {
      clearInterval(shuffleInterval)

      // Select a random card and its reward
      const randomIndex = Math.floor(Math.random() * cards.length)
      setSelectedCardIndex(randomIndex)
      const winAmount = cards[randomIndex]
      setReward(winAmount)

      // Add reward to balance
      const storedBalance = localStorage.getItem("micro_balance")
      const currentBalance = storedBalance ? Number.parseFloat(storedBalance) : 0
      const newBalance = currentBalance + winAmount // Direct token amount
      localStorage.setItem("micro_balance", newBalance.toString())

      // Show result
      setTimeout(() => {
        setShowResult(true)
        setIsSpinning(false)
        onComplete()
      }, 500)
    }, 2000)
  }

  return (
    <div className="space-y-4">
      {!showResult ? (
        <>
          <div
            ref={cardsContainerRef}
            className="relative h-24 overflow-hidden bg-blue-950 rounded-lg border border-blue-500"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full flex space-x-2 px-2">
                {cards.map((card, index) => (
                  <motion.div
                    key={`${index}-${card}`}
                    className={`flex-shrink-0 w-16 h-20 rounded-md flex items-center justify-center 
                      ${selectedCardIndex === index ? "bg-blue-600" : "bg-blue-800"} 
                      text-white font-bold`}
                    animate={isSpinning ? { x: [0, -20, 0, 20, 0] } : {}}
                    transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
                  >
                    {card}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300"
            onClick={startSpin}
            disabled={isSpinning}
          >
            {isSpinning ? "Spinning..." : "Spin Now"}
          </Button>
        </>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-4 space-y-3"
          >
            <h3 className="text-xl font-bold text-white">Hurray! You won!</h3>
            <MicroCoin size={60} />
            <p className="text-2xl font-bold text-green-400">{reward} MICRO</p>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
