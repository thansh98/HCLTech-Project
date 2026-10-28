import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="success">About GreenGrid</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Empowering the World's Clean Energy Transition
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          GreenGrid is a mission-driven energy intelligence platform built to bridge the gap between physical facility operations, IoT telemetry, and corporate sustainability targets.
        </p>
      </div>

      {/* Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-6 bg-brand-surface border-brand-border space-y-3 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Precision Visibility</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Eliminate utility bill guesswork. We capture high-fidelity readings directly from smart meters and submeters to give operators a true, unfiltered picture of energy dynamics.
          </p>
        </Card>

        <Card className="p-6 bg-brand-surface border-brand-border space-y-3 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Actionable Decarbonization</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Data alone doesn't reduce emissions. GreenGrid translates raw kilowatt-hours into concrete peak-shaving recommendations, renewable mix alerts, and verifiable carbon abatement.
          </p>
        </Card>

        <Card className="p-6 bg-brand-surface border-brand-border space-y-3 transition-colors duration-200">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Open &amp; Auditable</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            No proprietary lock-in. Built with modern, transparent software standards and standard APIs, enabling effortless integration with existing BMS, ERP, and ESG reporting pipelines.
          </p>
        </Card>
      </div>

      {/* Technical Architecture Section */}
      <div className="rounded-3xl bg-brand-surface border border-brand-border p-6 sm:p-10 lg:p-12 space-y-8 transition-colors duration-200">
        <div>
          <Badge variant="info" className="mb-2">Technical Foundation</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Modern Full-Stack Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2 max-w-2xl">
            Designed from day one for resilient horizontal scaling, minimal latency, and zero data corruption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle space-y-2.5">
            <h4 className="text-base font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              React 19 High-Performance Frontend
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Powered by modern React 19 client components, instant client-side route navigation, dynamic Chart.js canvas rendering, and Tailwind CSS design tokens engineered for dark-mode clarity.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle space-y-2.5">
            <h4 className="text-base font-bold text-sky-600 dark:text-sky-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Django 6 + DRF Domain Backend
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict domain separation across 10 independent modules. Clean service-layer business rules, selector-driven query optimization, and stateless JWT token authentication with auto-refresh queueing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle space-y-2.5">
            <h4 className="text-base font-bold text-teal-600 dark:text-teal-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              IoT Gateway &amp; Telemetry Ingestion
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standardized ingestion layer accepting readings via REST and MQTT. Automated validation, unit conversions, and threshold evaluation with sub-second response times.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle space-y-2.5">
            <h4 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tamper-Proof Audit &amp; Role-Based Governance
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every facility creation, meter calibration, and threshold modification is logged to an immutable audit ledger, satisfying corporate governance and SOC2 requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Sustainability & ESG Commitment */}
      <div className="text-center max-w-3xl mx-auto space-y-6 pt-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Committed to 100% Verifiable Sustainability
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          GreenGrid is built in alignment with leading international sustainability frameworks, including the Greenhouse Gas Protocol (GHG), Science Based Targets initiative (SBTi), and ISO 50001 Energy Management Standards.
        </p>
        <div className="pt-2">
          <Link to={ROUTES.CONTACT}>
            <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-8 py-3">
              Get in Touch with our Engineering Team
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
