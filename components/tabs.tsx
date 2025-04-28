"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dashboard } from "@/components/dashboard"
import { Wallet } from "@/components/wallet"
import { DailyMissions } from "@/components/daily-missions"
import { Referral } from "@/components/referral"
import { LayoutGrid, WalletIcon, Calendar, Users } from "lucide-react"

interface TabsProps {
  userName: string
}

export function Tabs({ userName }: TabsProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutGrid className="w-5 h-5" /> },
    { id: "wallet", label: "Wallet", icon: <WalletIcon className="w-5 h-5" /> },
    { id: "missions", label: "Daily Missions", icon: <Calendar className="w-5 h-5" /> },
    { id: "referral", label: "Referral", icon: <Users className="w-5 h-5" /> },
  ]

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 bg-gradient-to-r from-blue-900 to-blue-700 shadow-lg">
        <h1 className="text-xl font-bold text-center text-white">Welcome, {userName}!</h1>
      </header>

      <main className="flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "wallet" && <Wallet />}
            {activeTab === "missions" && <DailyMissions />}
            {activeTab === "referral" && <Referral />}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="bg-gradient-to-r from-blue-900 to-blue-700 p-2">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                activeTab === tab.id ? "bg-blue-600 text-white" : "text-blue-200 hover:bg-blue-800"
              }`}
            >
              {tab.icon}
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
