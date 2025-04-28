"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { MicroCoin } from "@/components/micro-coin"
import { formatNumber } from "@/lib/utils"
import { Send, Download } from "lucide-react"

export function Wallet() {
  const [microBalance, setMicroBalance] = useState(0)
  const [usdtBalance, setUsdtBalance] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    // Load data from localStorage
    const storedMicroBalance = localStorage.getItem("micro_balance")
    const storedUsdtBalance = localStorage.getItem("micro_usdt_balance")

    if (storedMicroBalance) setMicroBalance(Number.parseFloat(storedMicroBalance))
    if (storedUsdtBalance) setUsdtBalance(Number.parseFloat(storedUsdtBalance))
  }, [])

  const showComingSoon = () => {
    toast({
      title: "Coming Soon",
      description: "This feature will be available in the next update.",
      className: "bg-gradient-to-r from-blue-900 to-blue-700 text-white border-blue-500",
    })
  }

  // Calculate USD value
  const usdValue = microBalance * 7 // $7 per token

  return (
    <div className="space-y-4">
      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">MICRO Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4">
            <MicroCoin size={50} />
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{formatNumber(microBalance)}</p>
              <p className="text-lg text-green-400">${formatNumber(usdValue)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-center text-blue-100">USDT Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/images-fi1i46bTAwxCeVWYsrJUEcvye9ablY.png')`,
                  width: 48,
                  height: 48,
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{formatNumber(usdtBalance)}</p>
              <p className="text-lg text-green-400">${formatNumber(usdtBalance)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 flex items-center gap-2"
          onClick={showComingSoon}
        >
          <Send className="w-4 h-4" />
          Send
        </Button>
        <Button
          className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 flex items-center gap-2"
          onClick={showComingSoon}
        >
          <Download className="w-4 h-4" />
          Receive
        </Button>
      </div>
    </div>
  )
}
