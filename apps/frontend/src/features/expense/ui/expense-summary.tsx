'use client';

import { useEffect } from 'react';
import { getExpenseStats } from '../api';
import { useExpenseStore } from '../model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays, TrendingUp, Wallet } from 'lucide-react';
import { getCategoryIcon, formatAmount, CURRENCY_SYMBOL } from '@/shared/lib';

export function ExpenseSummary() {
  const stats = useExpenseStore((s) => s.stats);
  const setStats = useExpenseStore((s) => s.setStats);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getExpenseStats();
        setStats(data);
      } catch {
        // stats are non-critical; summary will show dashes
      }
    }
    fetchStats();
  }, [setStats]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            This Month
          </CardTitle>
          <CalendarDays className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats ? `${formatAmount(stats.monthTotal)} ${CURRENCY_SYMBOL}` : '—'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today
          </CardTitle>
          <Wallet className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {stats ? `${formatAmount(stats.todayTotal)} ${CURRENCY_SYMBOL}` : '—'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Top Category
          </CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {stats?.topCategory ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">
                {getCategoryIcon(stats.topCategory.icon, stats.topCategory.name)}
              </span>
              <div>
                <p className="text-sm font-bold">{stats.topCategory.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatAmount(stats.topCategory.total)} {CURRENCY_SYMBOL}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
