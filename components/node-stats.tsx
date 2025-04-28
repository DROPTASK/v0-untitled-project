"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber } from "@/lib/utils"

interface NodeStatsProps {
  stats: {
    totalMined: number
    hoursActive: number
    activations: number
  }
}

export function NodeStats({ stats }: NodeStatsProps) {
  return (
    <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-center text-blue-100">Node Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-lg bg-blue-900/50">
            <p className="text-xs text-blue-300">Total Mined</p>
            <p className="text-lg font-bold text-white">{formatNumber(stats.totalMined)}</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-900/50">
            <p className="text-xs text-blue-300">Hours Active</p>
            <p className="text-lg font-bold text-white">{stats.hoursActive}</p>
          </div>
          <div className="p-2 rounded-lg bg-blue-900/50">
            <p className="text-xs text-blue-300">Activations</p>
            <p className="text-lg font-bold text-white">{stats.activations}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
