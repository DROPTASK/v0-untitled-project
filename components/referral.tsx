"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

export function Referral() {
  return (
    <div className="flex items-center justify-center h-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="border-blue-500 bg-gradient-to-b from-blue-900 to-blue-950 shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-blue-100">Referral Program</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-blue-200 mb-4">Coming Soon</h3>
              <p className="text-blue-300">
                Our referral program is under development. Invite friends and earn rewards together!
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
