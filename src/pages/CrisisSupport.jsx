import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Copy, Check, ChevronDown, ChevronUp, ArrowLeft, ShieldAlert } from 'lucide-react';

/* ── Helpline data (verified September 2026) ── */
const PRIMARY = [
  { name: 'Tele MANAS',           phone: '14416',         hours: '24/7', note: 'Government of India', toll: true },
  { name: 'Vandrevala Foundation', phone: '9999 666 555',  hours: '24/7', note: 'English, Hindi and regional languages' },
  { name: 'AASRA',                phone: '9820 466 726',  hours: '24/7', note: 'Mumbai based, nationwide reach' },
  { name: 'Jeevan Aastha',        phone: '1800 233 3330', hours: '24/7', note: 'Toll free helpline', toll: true },
  { name: 'iCall (TISS)',         phone: '9152 987 821',  hours: 'Mon–Sat 8am–10pm', note: 'Tata Institute of Social Sciences' },
];

const REGIONAL = [
  { name: 'SNEHA Chennai',          phone: '044 2464 0050', hours: '24/7',              note: 'Also: 8976 994 777' },
  { name: 'Sumaitri Delhi',         phone: '011 2338 9090', hours: 'Mon–Fri 2pm–10pm', note: 'Delhi' },
  { name: 'Connecting Trust',       phone: '9922 001 122',  hours: '12pm–8pm daily', note: 'Pune, Maharashtra' },
  { name: 'Roshni Foundation',      phone: '040 6620 2000', hours: '11am–9pm Mon–Sat', note: 'Hyderabad' },
  { name: 'Parivarthan',            phone: '7676 602 602',  hours: '4pm–10pm Mon–Sat', note: 'Bangalore' },
  { name: 'Maithri',                phone: '0484 254 0530', hours: '10am–6pm daily', note: 'Kochi, Kerala' },
  { name: 'COOJ Mental Health',     phone: '0832 225 2525', hours: '1pm–7pm Mon–Sat', note: 'Goa' },
  { name: 'NIBS Kolkata',           phone: '033 2286 5603', hours: 'Mon–Sat 10am–6pm', note: 'Kolkata' },
  { name: 'Fortis Stress Helpline', phone: '8376 804 102',  hours: '8am–10pm daily', note: 'Fortis Healthcare' },
  { name: 'Mann Talks',             phone: '8686 139 139',  hours: '9am–10pm daily', note: 'Youth focused' },
  { name: 'Samaritans Mumbai',      phone: '8422 984 528',  hours: '5pm–8pm daily', note: 'English and Hindi' },
  { name: 'Swaasthi',               phone: '0484 290 9090', hours: 'Mon–Fri 10am–6pm', note: 'For healthcare workers' },
];

const INTERNATIONAL = [
  { name: 'Suicide & Crisis Lifeline', phone: '988',            country: 'US',     hours: '24/7' },
  { name: 'Crisis Text Line',          phone: 'Text HOME to 741741', country: 'US', hours: '24/7' },
  { name: 'Samaritans',                phone: '116 123',        country: 'UK',     hours: '24/7' },
  { name: 'Lifeline',                  phone: '13 11 14',       country: 'AU',     hours: '24/7' },
  { name: 'Befrienders Worldwide',     phone: 'befrienders.org',country: 'Global', hours: 'Directory' },
];

export default function CrisisSupport() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(null);
  const [showRegional, setShowRegional] = useState(false);
  const [showIntl, setShowIntl] = useState(false);

  const copy = (phone, key) => {
    navigator.clipboard?.writeText(phone.replace(/\s/g, '')).catch(() => {});
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const HelplineRow = ({ item, idx, section }) => {
    const key = `${section}-${idx}`;
    const clean = item.phone.replace(/\s/g, '');
    const isText = item.phone.toLowerCase().includes('text') || item.phone.includes('.org');
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 transition-colors hover:border-primary/30">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {item.name[0]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[14px] font-semibold text-foreground">{item.name}</span>
            {item.toll && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">Toll Free</span>}
            {item.country && <span className="text-[11px] text-muted-foreground">{item.country}</span>}
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">{item.hours}{item.note ? ` · ${item.note}` : ''}</div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden text-[14px] font-bold text-primary sm:inline">{item.phone}</span>
          <button
            onClick={() => copy(item.phone, key)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Copy number"
          >
            {copied === key ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          {!isText && (
            <a
              href={`tel:${clean}`}
              className="flex h-8 items-center gap-1 rounded-lg bg-primary px-3 text-[12px] font-bold text-primary-foreground no-underline"
            >
              <Phone className="h-3 w-3" /> Call
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-24" style={{ fontFamily: "'Plus Jakarta Sans',Inter,system-ui,sans-serif" }}>
      <div className="mx-auto max-w-2xl px-4 pt-5 sm:px-6">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-2 text-[13px] font-semibold text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2.5">
            <ShieldAlert className="h-7 w-7 text-red-500" />
            <h1 className="text-[26px] font-bold tracking-tight text-foreground sm:text-[30px]" style={{ fontFamily: "'Playfair Display',Georgia,serif" }}>
              Crisis Support
            </h1>
          </div>
          <p className="text-[15px] leading-relaxed text-muted-foreground">
            If you or someone you know is in distress, reach out. Help is always available.
          </p>
        </div>

        {/* Emergency banner */}
        <div className="mb-5 rounded-2xl border-2 border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
          <h2 className="mb-2 text-[16px] font-bold text-red-800 dark:text-red-400">In Immediate Danger?</h2>
          <p className="mb-4 text-[14px] leading-relaxed text-red-700 dark:text-red-300">
            Call emergency services now or go to the nearest hospital.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <a href="tel:112" className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-[14px] font-bold text-white no-underline shadow-md">
              <Phone className="h-4 w-4" /> Emergency: 112
            </a>
            <a href="tel:100" className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[14px] font-bold text-background no-underline shadow-md">
              <Phone className="h-4 w-4" /> Police: 100
            </a>
          </div>
        </div>

        {/* Primary 24/7 helplines */}
        <section className="mb-5">
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-[17px] font-semibold text-foreground">National Helplines</h2>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">24/7</span>
          </div>
          <div className="flex flex-col gap-2.5">
            {PRIMARY.map((r, i) => <HelplineRow key={i} item={r} idx={i} section="pri" />)}
          </div>
        </section>

        {/* Regional — collapsible */}
        <section className="mb-5">
          <button
            type="button"
            onClick={() => setShowRegional(!showRegional)}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <span className="text-[15px] font-semibold text-foreground">Regional Helplines</span>
            <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
              {REGIONAL.length} numbers {showRegional ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </button>
          {showRegional && (
            <div className="flex flex-col gap-2.5">
              {REGIONAL.map((r, i) => <HelplineRow key={i} item={r} idx={i} section="reg" />)}
            </div>
          )}
        </section>

        {/* International — collapsible */}
        <section className="mb-5">
          <button
            type="button"
            onClick={() => setShowIntl(!showIntl)}
            className="mb-3 flex w-full items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-left transition-colors hover:bg-secondary"
          >
            <span className="text-[15px] font-semibold text-foreground">International Lines</span>
            <span className="flex items-center gap-1 text-[13px] text-muted-foreground">
              {INTERNATIONAL.length} numbers {showIntl ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </button>
          {showIntl && (
            <div className="flex flex-col gap-2.5">
              {INTERNATIONAL.map((r, i) => <HelplineRow key={i} item={r} idx={i} section="intl" />)}
            </div>
          )}
        </section>

        {/* Not sure what to say */}
        <section className="mb-5 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-3 text-[16px] font-semibold text-foreground">Not sure what to say?</h2>
          <p className="mb-3 text-[13px] text-muted-foreground">You can start with any of these. The person on the line will guide you.</p>
          <div className="flex flex-col gap-2">
            {[
              "I'm struggling and need someone to talk to.",
              "I'm having thoughts of hurting myself.",
              "I'm worried about someone I know.",
              "I just need someone to listen right now.",
            ].map((s, i) => (
              <div key={i} className="rounded-xl border-l-[3px] border-primary bg-secondary/50 px-4 py-3 text-[14px] italic text-foreground">
                "{s}"
              </div>
            ))}
          </div>
        </section>

        {/* Footer note */}
        <div className="rounded-2xl bg-secondary/40 p-5 text-center">
          <p className="text-[14px] leading-relaxed text-muted-foreground">
            Whatever you are going through, there are people who care and want to help.
            Reaching out is an act of courage. 💜
          </p>
          <p className="mt-3 text-[12px] text-muted-foreground/70">
            SameFeel is a peer wellness community and is not a crisis service. All numbers verified as of September 2026.
          </p>
        </div>

      </div>
    </div>
  );
}
