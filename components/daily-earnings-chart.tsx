"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface DailyEarningsChartProps {
  data: number[]
}

export function DailyEarningsChart({ data }: DailyEarningsChartProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date().getDay()

  // Find the maximum value for scaling
  const maxValue = Math.max(...data, 0.1) // Minimum 0.1 to avoid division by zero

  return (
    <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center text-blue-100">Daily Earnings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-end h-32">
            {data.map((value, index) => {
              const barHeight = (value / maxValue) * 100
              return (
                <div key={index} className="flex flex-col items-center w-full">
                  <div className="text-xs text-blue-300 mb-1">{formatNumber(value)}</div>
                  <div
                    className={`w-4/5 rounded-t-md ${index === today ? "bg-green-500" : "bg-blue-600"}`}
                    style={{ height: `${Math.max(barHeight, 5)}%` }}
                  />
                </div>
              )
            })}
          </div>
          <div className="flex justify-between">
            {days.map((day, index) => (
              <div key={day} className={`text-xs ${index === today ? "text-green-400 font-bold" : "text-blue-300"}`}>
                {day}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
