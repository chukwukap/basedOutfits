"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp, Heart, DollarSign, Calendar } from "lucide-react"

export function ClosetStats() {
  const stats = [
    {
      icon: Heart,
      label: "Total Looks",
      value: "12",
      change: "+3 this week",
      color: "text-pink-600",
    },
    {
      icon: DollarSign,
      label: "Total Spent",
      value: "$18.50",
      change: "Average $1.54",
      color: "text-green-600",
    },
    {
      icon: TrendingUp,
      label: "Most Popular",
      value: "Summer",
      change: "4 looks",
      color: "text-blue-600",
    },
    {
      icon: Calendar,
      label: "This Month",
      value: "5",
      change: "New additions",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="p-4 pt-0">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground font-medium">{stat.label}</span>
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
