"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Check } from "lucide-react"

export function DailyCheckin() {
  const [streak, setStreak] = useState(0)
  const [checkedIn, setCheckedIn] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedStreak = localStorage.getItem("micro_checkin_streak")
    const lastCheckinDate = localStorage.getItem("micro_last_checkin_date")

    if (storedStreak) setStreak(Number.parseInt(storedStreak))

    // Check if already checked in today
    const today = new Date().toDateString()
    if (lastCheckinDate === today) {
      setCheckedIn(true)
    } else {
      // Check if streak should be reset (missed a day)
      if (lastCheckinDate) {
        const lastDate = new Date(lastCheckinDate)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        if (lastDate.toDateString() !== yesterday.toDateString() && lastCheckinDate !== today) {
          // Missed a day, reset streak
          setStreak(0)
          localStorage.setItem("micro_checkin_streak", "0")
        }
      }
    }
  }, []) // Empty dependency array to run only on mount

  const handleCheckin = () => {
    if (checkedIn) return

    const today = new Date().toDateString()
    const newStreak = streak + 1
    setStreak(newStreak)
    setCheckedIn(true)

    // Save to localStorage
    localStorage.setItem("micro_checkin_streak", newStreak.toString())
    localStorage.setItem("micro_last_checkin_date", today)

    // Add reward
    const storedBalance = localStorage.getItem("micro_balance")
    const currentBalance = storedBalance ? Number.parseFloat(storedBalance) : 0

    // Regular reward is 0.1, bonus on 7th day is 0.5
    const isSeventhDay = newStreak % 7 === 0
    const reward = isSeventhDay ? 0.5 : 0.1

    const newBalance = currentBalance + reward
    localStorage.setItem("micro_balance", newBalance.toString())

    toast({
      title: isSeventhDay ? "Streak Bonus!" : "Daily Check-in",
      description: `You earned ${reward} MICRO tokens${isSeventhDay ? " for your 7-day streak!" : "."}`,
      className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
    })
  }

  // Generate the 7 day streak display
  const days = Array.from({ length: 7 }, (_, i) => i + 1)
  const currentDay = streak % 7 || 7 // Map 0 to 7 for display purposes

  return (
    <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center text-blue-100">Daily Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-blue-300">Current Streak: {streak} days</div>
          {streak >= 7 && <div className="text-xs text-green-400">Every 7th day: +0.5 MICRO bonus!</div>}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => (
            <div
              key={day}
              className={`relative flex items-center justify-center p-2 rounded-md border ${
                day === 7 ? "border-yellow-500 bg-blue-900/60" : "border-blue-700 bg-blue-900/30"
              } ${day <= currentDay && checkedIn ? "border-green-500" : ""}`}
            >
              <span className={`text-xs font-medium ${day === 7 ? "text-yellow-400" : "text-blue-200"}`}>
                Day {day}
              </span>
              {day < currentDay && checkedIn && (
                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              {day === currentDay && checkedIn && (
                <motion.div
                  className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300"
          onClick={handleCheckin}
          disabled={checkedIn}
        >
          {checkedIn ? "Already Checked In Today" : "Check In Now"}
        </Button>
      </CardContent>
    </Card>
  )
}
