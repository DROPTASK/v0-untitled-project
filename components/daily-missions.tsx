"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { SpinGame } from "@/components/spin-game"
import { DailyCheckin } from "@/components/daily-checkin"
import { Check, ExternalLink } from "lucide-react"

export function DailyMissions() {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({})
  const [spinUsed, setSpinUsed] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedTasks = localStorage.getItem("micro_completed_tasks")
    const storedSpinUsed = localStorage.getItem("micro_daily_spin_used")
    const lastSpinDate = localStorage.getItem("micro_last_spin_date")

    if (storedTasks) setCompletedTasks(JSON.parse(storedTasks))

    // Reset spin if it's a new day
    const today = new Date().toDateString()
    if (lastSpinDate !== today) {
      setSpinUsed(false)
      localStorage.setItem("micro_daily_spin_used", "false")
      localStorage.setItem("micro_last_spin_date", today)

      // Reset daily tasks
      setCompletedTasks({})
      localStorage.setItem("micro_completed_tasks", JSON.stringify({}))
    } else if (storedSpinUsed) {
      setSpinUsed(storedSpinUsed === "true")
    }
  }, []) // Empty dependency array to run only on mount

  const completeTask = (taskId: string) => {
    const newCompletedTasks = { ...completedTasks, [taskId]: true }
    setCompletedTasks(newCompletedTasks)
    localStorage.setItem("micro_completed_tasks", JSON.stringify(newCompletedTasks))

    // Add reward (0.1 token per task)
    const storedBalance = localStorage.getItem("micro_balance")
    const currentBalance = storedBalance ? Number.parseFloat(storedBalance) : 0
    const reward = 0.1 // 0.1 MICRO token per task
    const newBalance = currentBalance + reward
    localStorage.setItem("micro_balance", newBalance.toString())

    toast({
      title: "Task Completed!",
      description: `You earned ${reward} MICRO tokens.`,
      className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
    })
  }

  const handleSpinComplete = () => {
    setSpinUsed(true)
    localStorage.setItem("micro_daily_spin_used", "true")
  }

  const socialLinks = [
    { id: "discord", label: "Join Discord", url: "https://discord.gg/vzny8TFR" },
    { id: "twitter", label: "Follow on Twitter", url: "https://x.com/DPaheliyan" },
    { id: "telegram", label: "Join Telegram", url: "https://t.me/microgenesisog" },
  ]

  return (
    <div className="space-y-4">
      <DailyCheckin />

      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">Daily Spin</CardTitle>
        </CardHeader>
        <CardContent>
          {spinUsed ? (
            <div className="text-center p-4">
              <p className="text-blue-300">You've already used your daily spin.</p>
              <p className="text-sm text-blue-400 mt-2">Come back tomorrow for another chance!</p>
            </div>
          ) : (
            <SpinGame onComplete={handleSpinComplete} />
          )}

          <Button
            className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300"
            onClick={() =>
              window.open(
                "https://app.tonkeeper.com/transfer/UQCvyjiCs59fcgMnDUkcyKJklm7IobTHgmfHjSyOPkF_BPNJ?amount=1000000000",
                "_blank",
              )
            }
          >
            Buy 10 Spins (1 TON)
          </Button>
        </CardContent>
      </Card>

      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">Social Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div key={link.id} className="flex items-center justify-between p-2 rounded-lg bg-blue-900/50">
                <span className="text-blue-100">{link.label}</span>
                <div className="flex items-center gap-2">
                  {completedTasks[link.id] ? (
                    <span className="text-green-400 flex items-center">
                      <Check className="w-4 h-4 mr-1" /> Done
                    </span>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-blue-500 text-blue-300 hover:bg-blue-800 hover:text-white"
                      onClick={() => {
                        window.open(link.url, "_blank")
                        completeTask(link.id)
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" /> Visit
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
