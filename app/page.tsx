"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WelcomeModal } from "@/components/welcome-modal"
import { Tabs } from "@/components/tabs"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [userName, setUserName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user has visited before
    const storedName = localStorage.getItem("micro_user_name")
    if (storedName) {
      setUserName(storedName)
      setIsFirstVisit(false)
    }

    // Initialize data if not exists
    if (!localStorage.getItem("micro_balance")) {
      localStorage.setItem("micro_balance", "0")
    }
    if (!localStorage.getItem("micro_usdt_balance")) {
      localStorage.setItem("micro_usdt_balance", "0")
    }
    if (!localStorage.getItem("micro_node_active")) {
      localStorage.setItem("micro_node_active", "false")
    }
    if (!localStorage.getItem("micro_node_end_time")) {
      localStorage.setItem("micro_node_end_time", "0")
    }
    if (!localStorage.getItem("micro_daily_spin_used")) {
      localStorage.setItem("micro_daily_spin_used", "false")
    }
    if (!localStorage.getItem("micro_last_spin_date")) {
      localStorage.setItem("micro_last_spin_date", new Date().toDateString())
    }
    if (!localStorage.getItem("micro_checkin_streak")) {
      localStorage.setItem("micro_checkin_streak", "0")
    }
    if (!localStorage.getItem("micro_last_checkin_date")) {
      localStorage.setItem("micro_last_checkin_date", "")
    }
    if (!localStorage.getItem("micro_daily_earnings")) {
      localStorage.setItem("micro_daily_earnings", JSON.stringify([0, 0, 0, 0, 0, 0, 0]))
    }
    if (!localStorage.getItem("micro_node_stats")) {
      localStorage.setItem(
        "micro_node_stats",
        JSON.stringify({
          totalMined: 0,
          hoursActive: 0,
          activations: 0,
        }),
      )
    }
  }, [])

  const handleNameSubmit = (name: string) => {
    localStorage.setItem("micro_user_name", name)
    setUserName(name)
    setIsFirstVisit(false)
    toast({
      title: `Welcome, ${name}!`,
      description: "Your MICRO farming journey begins now.",
      className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
    })
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-black text-white">
      {isFirstVisit ? <WelcomeModal onSubmit={handleNameSubmit} /> : <Tabs userName={userName} />}
    </main>
  )
}
