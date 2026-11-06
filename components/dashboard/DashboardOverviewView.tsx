'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Eye, Users, MousePointerClick, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockViewsData = [
  { date: 'Mon', views: 120, clicks: 45 },
  { date: 'Tue', views: 180, clicks: 72 },
  { date: 'Wed', views: 240, clicks: 98 },
  { date: 'Thu', views: 310, clicks: 140 },
  { date: 'Fri', views: 420, clicks: 195 },
  { date: 'Sat', views: 560, clicks: 230 },
  { date: 'Sun', views: 680, clicks: 310 },
];

export function DashboardOverviewView() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-xs text-muted">
          Real-time metrics, privacy-first analytics, and profile performance.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-border bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-mono uppercase">Total Views</span>
            <Eye className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono">2,510</div>
          <div className="text-[11px] text-success mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +18.4% from last week
          </div>
        </Card>

        <Card className="p-4 border-border bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-mono uppercase">Unique Visitors</span>
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono">1,840</div>
          <div className="text-[11px] text-success mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +12.1% from last week
          </div>
        </Card>

        <Card className="p-4 border-border bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-mono uppercase">Link Clicks</span>
            <MousePointerClick className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono">890</div>
          <div className="text-[11px] text-success mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +24.8% from last week
          </div>
        </Card>

        <Card className="p-4 border-border bg-surface">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-mono uppercase">Click-Through</span>
            <TrendingUp className="h-4 w-4 text-accent" />
          </div>
          <div className="text-2xl font-bold font-mono">35.4%</div>
          <div className="text-[11px] text-muted mt-1">High conversion rate</div>
        </Card>
      </div>

      {/* Views over time chart */}
      <Card className="border-border bg-surface p-4">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-base font-semibold">Profile Views & Clicks</CardTitle>
        </CardHeader>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockViewsData}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A5A5FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A5A5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#5C5E66" fontSize={11} tickLine={false} />
              <YAxis stroke="#5C5E66" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#101114',
                  borderColor: 'rgba(255,255,255,0.08)',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#A5A5FF"
                fillOpacity={1}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#6DE09D"
                fillOpacity={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
