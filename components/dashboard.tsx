"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MicroCoin } from "@/components/micro-coin"
import { LeagueIndicator } from "@/components/league-indicator"
import { NodeStats } from "@/components/node-stats"
import { DailyEarningsChart } from "@/components/daily-earnings-chart"
import { formatNumber } from "@/lib/utils"

export function Dashboard() {
  const [microBalance, setMicroBalance] = useState(0)
  const [nodeActive, setNodeActive] = useState(false)
  const [nodeEndTime, setNodeEndTime] = useState(0)
  const [timeLeft, setTimeLeft] = useState("")
  const [nodeStats, setNodeStats] = useState({
    totalMined: 0,
    hoursActive: 0,
    activations: 0,
  })
  const [dailyEarnings, setDailyEarnings] = useState([0, 0, 0, 0, 0, 0, 0])
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedBalance = localStorage.getItem("micro_balance")
    const storedNodeActive = localStorage.getItem("micro_node_active")
    const storedNodeEndTime = localStorage.getItem("micro_node_end_time")
    const storedNodeStats = localStorage.getItem("micro_node_stats")
    const storedDailyEarnings = localStorage.getItem("micro_daily_earnings")

    if (storedBalance) setMicroBalance(Number.parseFloat(storedBalance))
    if (storedNodeActive) setNodeActive(storedNodeActive === "true")
    if (storedNodeEndTime) setNodeEndTime(Number.parseInt(storedNodeEndTime))
    if (storedNodeStats) setNodeStats(JSON.parse(storedNodeStats))
    if (storedDailyEarnings) setDailyEarnings(JSON.parse(storedDailyEarnings))

    // Check if node should be deactivated
    const now = Date.now()
    if (nodeActive && nodeEndTime && now > nodeEndTime) {
      setNodeActive(false)
      localStorage.setItem("micro_node_active", "false")
    }
  }, []) // Empty dependency array so it only runs once on mount

  // Separate useEffect for timer updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodeActive && nodeEndTime) {
        const now = Date.now()
        if (now > nodeEndTime) {
          setNodeActive(false)
          localStorage.setItem("micro_node_active", "false")
          toast({
            title: "Node Closed",
            description: "Your mining node has automatically closed after 8 hours.",
            className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
          })
        } else {
          const diff = nodeEndTime - now
          const hours = Math.floor(diff / (1000 * 60 * 60))
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
          const seconds = Math.floor((diff % (1000 * 60)) / 1000)
          setTimeLeft(
            `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          )
        }
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [nodeActive, nodeEndTime, toast])

  // Separate useEffect for mining rewards
  useEffect(() => {
    if (!nodeActive) return

    const miningInterval = setInterval(() => {
      // Calculate reward based on node type (demo = free, purchased = paid)
      const isDemoNode = localStorage.getItem("micro_node_type") !== "purchased"
      const hourlyRate = isDemoNode ? 0.05 : 0.5 // tokens per hour
      const intervalRate = hourlyRate / 120 // per 30 seconds (120 intervals per hour)

      // Update balance
      setMicroBalance((prevBalance) => {
        const newBalance = prevBalance + intervalRate
        localStorage.setItem("micro_balance", newBalance.toString())
        return newBalance
      })

      // Update node stats
      setNodeStats((prevStats) => {
        const updatedStats = {
          ...prevStats,
          totalMined: prevStats.totalMined + intervalRate,
        }
        localStorage.setItem("micro_node_stats", JSON.stringify(updatedStats))
        return updatedStats
      })

      // Update daily earnings (for current day)
      const today = new Date().getDay()
      setDailyEarnings((prevEarnings) => {
        const updatedEarnings = [...prevEarnings]
        updatedEarnings[today] += intervalRate
        localStorage.setItem("micro_daily_earnings", JSON.stringify(updatedEarnings))
        return updatedEarnings
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(miningInterval)
  }, [nodeActive])

  const startNode = (isPurchased = false) => {
    // Set node type
    localStorage.setItem("micro_node_type", isPurchased ? "purchased" : "demo")

    // Activate node
    setNodeActive(true)
    const endTime = Date.now() + 8 * 60 * 60 * 1000 // 8 hours
    setNodeEndTime(endTime)
    localStorage.setItem("micro_node_active", "true")
    localStorage.setItem("micro_node_end_time", endTime.toString())

    // Update node stats
    const updatedStats = {
      ...nodeStats,
      hoursActive: nodeStats.hoursActive + 8,
      activations: nodeStats.activations + 1,
    }
    setNodeStats(updatedStats)
    localStorage.setItem("micro_node_stats", JSON.stringify(updatedStats))

    toast({
      title: "Node Started!",
      description: `Your ${isPurchased ? "premium" : "standard"} mining node is now active for 8 hours.`,
      className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
    })
  }

  // Calculate displayed balance and USD value
  const usdValue = microBalance * 7 // $7 per token

  return (
    <div className="space-y-4">
      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">Total Wallet Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4">
            <MicroCoin size={60} />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{formatNumber(microBalance)} MICRO</p>
              <p className="text-lg text-green-400">${formatNumber(usdValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LeagueIndicator balance={microBalance} />

      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">Mining Node</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                {nodeActive && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-blue-400"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  />
                )}
                <div className={`w-4 h-4 rounded-full ${nodeActive ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              <span className="text-sm">Status: {nodeActive ? "Active" : "Inactive"}</span>
            </div>
            {nodeActive && (
              <div className="text-sm font-mono">
                <span className="text-blue-300">Time left: </span>
                <span className="text-white">{timeLeft}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300"
              onClick={() =>
                window.open(
                  "https://app.tonkeeper.com/transfer/UQCvyjiCs59fcgMnDUkcyKJklm7IobTHgmfHjSyOPkF_BPNJ?amount=5000000000",
                  "_blank",
                )
              }
            >
              Buy Premium Node
            </Button>

            {!nodeActive && (
              <Button
                variant="outline"
                className="border-blue-500 text-blue-300 hover:bg-blue-900 hover:text-white"
                onClick={() => startNode(false)}
              >
                Start Free Node
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <NodeStats stats={nodeStats} />

      <DailyEarningsChart data={dailyEarnings} />

      {nodeActive && (
        <div className="flex justify-center p-4">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          >
            <MicroCoin size={80} />
          </motion.div>
        </div>
      )}
    </div>
  )
}
