import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { dashboardService } from './dashboardService';
import DashboardCards from './DashboardCards';
import ConsumptionChart from './ConsumptionChart';
import LiveGridTelemetryCard from './LiveGridTelemetryCard';
import { Header } from '../../components/layout';
import { Button, Card, RoleIdentityBanner } from '../../components/common';
import { ROUTES } from '../../constants';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [summaryData, trendsData] = await Promise.all([
          dashboardService.getSummary(),
          dashboardService.getTrends(7),
        ]);
        if (isMounted) {
          setSummary(summaryData);
          setTrends(trendsData);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Header
        title="Energy Monitoring Overview"
        subtitle={`Welcome back, ${user?.username}. Overview across ${summary?.active_facilities || 0} managed facilities.`}
        actions={
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(ROUTES.READINGS)}
            >
              + Add Reading
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.FACILITIES)}
            >
              Manage Facilities
            </Button>
          </div>
        }
      />

      <RoleIdentityBanner />

      <DashboardCards summary={summary} loading={loading} />

      <LiveGridTelemetryCard summary={summary} />

      <ConsumptionChart trends={trends} loading={loading} />

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
        <Card
          title="Facility Hierarchy"
          subtitle="Locations, departments, and building profiles"
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate(ROUTES.FACILITIES)}>
              View &rarr;
            </Button>
          }
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Monitor energy utilization and sustainability KPIs mapped across commercial, industrial, and campus sites.
          </p>
        </Card>

        <Card
          title="Renewable Generation"
          subtitle="Solar, wind, and clean power telemetry"
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate(ROUTES.RENEWABLES)}>
              View &rarr;
            </Button>
          }
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Track clean energy offset against grid demand and optimize on-site renewable storage and return.
          </p>
        </Card>

        <Card
          title="Thresholds & Automated Alerts"
          subtitle="Consumption spike & demand protection"
          action={
            <Button size="sm" variant="ghost" onClick={() => navigate(ROUTES.ALERTS)}>
              View &rarr;
            </Button>
          }
        >
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Define automated rules to catch load abnormalities and notify facility engineers immediately.
          </p>
        </Card>
      </div>
    </div>
  );
}
