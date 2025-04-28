"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

interface LeagueIndicatorProps {
  balance: number
}

export function LeagueIndicator({ balance }: LeagueIndicatorProps) {
  const [showLeagueDetails, setShowLeagueDetails] = useState(false)

  // League thresholds
  const leagues = [
    {
      name: "Bronze League",
      threshold: 0,
      max: 10,
      color: "from-amber-700 to-amber-900",
      textColor: "text-amber-300",
      icon: "🥉",
    },
    {
      name: "Silver League",
      threshold: 10,
      max: 50,
      color: "from-gray-400 to-gray-600",
      textColor: "text-gray-200",
      icon: "🥈",
    },
    {
      name: "Gold League",
      threshold: 50,
      max: 100,
      color: "from-yellow-500 to-yellow-700",
      textColor: "text-yellow-300",
      icon: "🥇",
    },
    {
      name: "Platinum League",
      threshold: 100,
      max: 500,
      color: "from-slate-300 to-slate-500",
      textColor: "text-white",
      icon: "💎",
    },
  ]

  // Determine current league
  const currentLeagueIndex = leagues.findIndex((league, index) => {
    const nextLeague = leagues[index + 1]
    return balance >= league.threshold && (!nextLeague || balance < nextLeague.threshold)
  })

  const currentLeague = leagues[currentLeagueIndex]
  const nextLeague = leagues[currentLeagueIndex + 1]

  // Calculate progress to next league
  let progress = 0
  if (nextLeague) {
    progress = ((balance - currentLeague.threshold) / (nextLeague.threshold - currentLeague.threshold)) * 100
  } else {
    // If in highest league, calculate progress within that league's range
    progress = Math.min(
      ((balance - currentLeague.threshold) / (currentLeague.max - currentLeague.threshold)) * 100,
      100,
    )
  }

  return (
    <>
      <Card
        className={`border-blue-500 bg-gradient-to-r ${currentLeague.color} shadow-lg cursor-pointer`}
        onClick={() => setShowLeagueDetails(true)}
      >
        <CardHeader className="pb-2">
          <CardTitle
            className={`text-lg text-center flex items-center justify-center gap-2 ${currentLeague.textColor}`}
          >
            <span className="text-xl">{currentLeague.icon}</span>
            {currentLeague.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-white opacity-80">
            {nextLeague
              ? `${nextLeague.threshold - balance} more MICRO to reach ${nextLeague.name}`
              : "You've reached the highest league!"}
          </p>
        </CardContent>
      </Card>

      <Dialog open={showLeagueDetails} onOpenChange={setShowLeagueDetails}>
        <DialogContent className="bg-gradient-to-b from-blue-900 to-blue-950 border-blue-500 text-white">
          <DialogHeader>
            <DialogTitle className="text-center text-xl text-blue-100">League Progress</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold flex items-center gap-2">
                <span className="text-xl">{currentLeague.icon}</span>
                {currentLeague.name}
              </span>
              <span className="text-blue-300">{balance} MICRO</span>
            </div>

            <Progress value={progress} className="h-2 bg-blue-950" indicatorClassName="bg-green-500" />

            {nextLeague && (
              <div className="text-sm text-blue-300 flex justify-between">
                <span>{currentLeague.threshold} MICRO</span>
                <span>{nextLeague.threshold} MICRO</span>
              </div>
            )}

            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium text-blue-100">All Leagues</h3>

              {leagues.map((league, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    index === currentLeagueIndex ? "bg-blue-800 border border-blue-500" : "bg-blue-900/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{league.icon}</span>
                    <span className={index === currentLeagueIndex ? "font-bold" : ""}>{league.name}</span>
                  </div>
                  <div className="text-sm text-blue-300">{league.threshold}+ MICRO</div>
                </div>
              ))}

              <div className="text-sm text-blue-300 mt-4">
                <p>Earn more MICRO tokens to advance to higher leagues and unlock exclusive rewards!</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
