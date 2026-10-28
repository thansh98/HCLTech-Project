import React, { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    facilityType: 'commercial',
    primaryGoal: 'cost_reduction',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  const faqs = [
    {
      q: 'Which smart meter communication protocols does GreenGrid support?',
      a: 'GreenGrid supports industry-standard protocols including Modbus TCP/RTU, BACnet/IP, MQTT, and direct JSON-based REST APIs. In addition, CSV batch imports and edge gateway bridges are natively supported.',
    },
    {
      q: 'Can GreenGrid integrate with our existing Building Management System (BMS)?',
      a: 'Yes. GreenGrid exposes clean RESTful endpoints and webhook notifications that can easily synchronize telemetry bidirectionally with Siemens, Schneider, Honeywell, or Johnson Controls BMS deployments.',
    },
    {
      q: 'How does GreenGrid calculate GHG Scope 2 emissions?',
      a: 'The platform applies regional grid emissions factors in real-time to your net grid import, subtracting verified on-site solar, wind, and storage discharge.',
    },
    {
      q: 'What role-based security policies are enforced?',
      a: 'GreenGrid provides three built-in roles: Administrator (full configuration, user management, audit review), Facility Manager (facility & meter onboarding, alert thresholds, billing), and Viewer (read-only dashboards & reports).',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="info">Get in Touch</Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          Connect with GreenGrid Engineers
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Whether you are modernizing a single industrial warehouse or an entire university campus, our energy systems architects are here to assist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Inquiry Form (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-brand-surface border-brand-border transition-colors duration-200">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Request Platform Access or Inquiry</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
              Complete the form below and an energy solutions engineer will respond within 24 hours.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inquiry Received Successfully</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                  Thank you for reaching out, <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formData.name}</span>. Our engineering team has logged your dispatch ticket and will contact you at <span className="font-semibold text-slate-900 dark:text-white">{formData.email}</span> shortly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 border-brand-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Send Another Inquiry
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    placeholder="Jane Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <Input
                    label="Work Email *"
                    type="email"
                    required
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Organization / Company"
                    placeholder="Acme Global Infrastructure"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                  <Select
                    label="Facility Category"
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    options={[
                      { value: 'commercial', label: 'Commercial Office Tower' },
                      { value: 'industrial', label: 'Manufacturing & Industrial' },
                      { value: 'campus', label: 'University / Hospital Campus' },
                      { value: 'datacenter', label: 'Data Center & Edge' },
                    ]}
                  />
                </div>

                <Select
                  label="Primary Initiative"
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  options={[
                    { value: 'cost_reduction', label: 'Utility Cost & Peak Demand Reduction' },
                    { value: 'renewables', label: 'Solar & Clean Energy Integration' },
                    { value: 'esg_audit', label: 'ESG Reporting & GHG Compliance' },
                    { value: 'meter_monitoring', label: 'Multi-Site Smart Meter Monitoring' },
                  ]}
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    How can our engineering team help? *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your current meter hardware, target facilities, or specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="w-full justify-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold py-3 text-base shadow-lg shadow-emerald-500/25 mt-2"
                >
                  Submit Inquiry
                </Button>
              </form>
            )}
          </Card>
        </div>

        {/* Right Column: Support Channels & Offices (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-brand-surface border-brand-border space-y-4 transition-colors duration-200">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Direct Support Channels
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle">
                <div className="text-slate-500 dark:text-slate-400 text-xs">Technical Support &amp; Telemetry Ops</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5">telemetry-support@greengrid.internal</div>
                <div className="text-emerald-600 dark:text-emerald-400 text-[11px] mt-1 font-medium">&bull; 24/7 Monitoring Center</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle">
                <div className="text-slate-500 dark:text-slate-400 text-xs">Enterprise Sales &amp; Licensing</div>
                <div className="font-semibold text-slate-900 dark:text-white mt-0.5">solutions@greengrid.internal</div>
                <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-1">Dedicated Account Management</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-brand-surface border-brand-border space-y-4 transition-colors duration-200">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center">
              <svg className="w-5 h-5 mr-2 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Global Operations Center
            </h3>
            <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-1 leading-relaxed">
              <p className="font-semibold text-slate-900 dark:text-white">GreenGrid Systems Inc.</p>
              <p className="text-slate-500 dark:text-slate-400">100 CleanTech Way, Suite 400</p>
              <p className="text-slate-500 dark:text-slate-400">Silicon Grid Hub, CA 94105</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="rounded-3xl bg-brand-surface border border-brand-border p-6 sm:p-10 lg:p-12 space-y-6 transition-colors duration-200">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <Badge variant="warning" className="mb-2">FAQ</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={faq.q}
                className="rounded-xl bg-slate-50 dark:bg-[#0a1128] border border-brand-borderSubtle overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? -1 : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-slate-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <svg
                    className={`w-5 h-5 shrink-0 ml-4 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-brand-borderSubtle pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
