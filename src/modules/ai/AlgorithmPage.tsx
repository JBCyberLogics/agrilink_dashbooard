import { useState } from 'react';
import type { FormEvent } from 'react';
import { Activity, AlertCircle, ArrowRight, FileSearch, SlidersHorizontal } from 'lucide-react';
import type { PageDefinition } from '../../config/navigation';
import { BackendNotice } from '../../components/feedback/BackendNotice';
import { PageTitle } from '../../components/layout/PageTitle';
import { SectionHeading, StatusPill } from '../../components/ui/StatusPill';
import { calculateMatchScore, calculateNetProfit, type MatchFactors, type ProfitInputs } from '../../lib/algorithms';

function MetricResult({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`result-metric${emphasis ? ' result-metric--emphasis' : ''}`}><span>{label}</span><strong>{value}</strong></div>;
}

function parseNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function numberLabel(value: number | null): string {
  if (value === null) return 'Unavailable';
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}

export default function AlgorithmPage({ page }: { page: PageDefinition }) {
  const [tab, setTab] = useState<'profit' | 'matching'>('profit');
  const [profitValues, setProfitValues] = useState<Record<keyof ProfitInputs, string>>({
    expectedSellingPrice: '', sellableQuantity: '', productionCost: '', harvestCost: '',
    packagingCost: '', transportAndSellingCost: '', otherCost: '', targetProfit: '',
  });
  const [matchValues, setMatchValues] = useState<Record<keyof MatchFactors, string>>({ priceFit: '', qualityFit: '', distanceFit: '', availabilityFit: '' });
  const [profitResult, setProfitResult] = useState<ReturnType<typeof calculateNetProfit> | null>(null);
  const [matchResult, setMatchResult] = useState<ReturnType<typeof calculateMatchScore> | null>(null);

  function updateProfit(key: keyof ProfitInputs, value: string) { setProfitValues((current) => ({ ...current, [key]: value })); setProfitResult(null); }
  function updateMatch(key: keyof MatchFactors, value: string) { setMatchValues((current) => ({ ...current, [key]: value })); setMatchResult(null); }
  function submitProfit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfitResult(calculateNetProfit({
      expectedSellingPrice: parseNumber(profitValues.expectedSellingPrice),
      sellableQuantity: parseNumber(profitValues.sellableQuantity),
      productionCost: parseNumber(profitValues.productionCost),
      harvestCost: parseNumber(profitValues.harvestCost),
      packagingCost: parseNumber(profitValues.packagingCost),
      transportAndSellingCost: parseNumber(profitValues.transportAndSellingCost),
      otherCost: parseNumber(profitValues.otherCost),
      targetProfit: parseNumber(profitValues.targetProfit),
    }));
  }
  function submitMatch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMatchResult(calculateMatchScore({
      priceFit: parseNumber(matchValues.priceFit), qualityFit: parseNumber(matchValues.qualityFit),
      distanceFit: parseNumber(matchValues.distanceFit), availabilityFit: parseNumber(matchValues.availabilityFit),
    }));
  }

  return (
    <div className="page-stack">
      <PageTitle page={page} />
      <BackendNotice compact />
      <section className="algorithm-note"><span className="algorithm-note__icon"><SlidersHorizontal size={17} aria-hidden="true" /></span><p><strong>Local calculation tools</strong> Use only values you enter below. Calculations run in this browser and are not saved or sent to the marketplace.</p><StatusPill>Not published</StatusPill></section>
      <div className="algorithm-tabs" role="tablist" aria-label="Algorithm tools">
        <button role="tab" aria-selected={tab === 'profit'} className={tab === 'profit' ? 'is-active' : ''} onClick={() => setTab('profit')}>Net profit estimate</button>
        <button role="tab" aria-selected={tab === 'matching'} className={tab === 'matching' ? 'is-active' : ''} onClick={() => setTab('matching')}>Matching score</button>
      </div>
      {tab === 'profit' ? (
        <div className="algorithm-layout">
          <form className="panel algorithm-form" onSubmit={submitProfit}>
            <SectionHeading eyebrow="DETERMINISTIC CALCULATOR" title="Net profit estimate" detail="Enter every cost. Explicitly enter 0 when a cost does not apply." />
            <p className="form-unit-note">All values must use the same currency and quantity unit. The result is an estimate based on your inputs.</p>
            <div className="form-grid">
              <NumericField label="Expected selling price per unit" value={profitValues.expectedSellingPrice} onChange={(value) => updateProfit('expectedSellingPrice', value)} />
              <NumericField label="Sellable quantity" value={profitValues.sellableQuantity} onChange={(value) => updateProfit('sellableQuantity', value)} />
              <NumericField label="Production costs" value={profitValues.productionCost} onChange={(value) => updateProfit('productionCost', value)} />
              <NumericField label="Harvest & post-harvest costs" value={profitValues.harvestCost} onChange={(value) => updateProfit('harvestCost', value)} />
              <NumericField label="Packaging costs" value={profitValues.packagingCost} onChange={(value) => updateProfit('packagingCost', value)} />
              <NumericField label="Transport & selling costs" value={profitValues.transportAndSellingCost} onChange={(value) => updateProfit('transportAndSellingCost', value)} />
              <NumericField label="Other costs" value={profitValues.otherCost} onChange={(value) => updateProfit('otherCost', value)} />
              <NumericField label="Target profit (optional)" value={profitValues.targetProfit} onChange={(value) => updateProfit('targetProfit', value)} />
            </div>
            <div className="form-actions"><button className="button button--primary" type="submit">Calculate estimate <ArrowRight size={16} aria-hidden="true" /></button><span>Nothing is stored by this tool.</span></div>
          </form>
          <section className="panel result-panel" aria-live="polite">
            <div className="result-panel__head"><span className="eyebrow">YOUR ESTIMATE</span><span className="result-panel__icon"><Activity size={17} aria-hidden="true" /></span></div>
            {!profitResult && <div className="result-placeholder"><span className="result-placeholder__icon"><FileSearch size={19} aria-hidden="true" /></span><strong>Results appear here</strong><p>Complete the fields and run the calculation. Missing inputs are never treated as zero.</p></div>}
            {profitResult && !profitResult.valid && <div className="validation-panel" role="alert"><strong>Check the inputs</strong><ul>{profitResult.errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
            {profitResult?.valid && <div className="result-metrics"><MetricResult label="Gross revenue" value={numberLabel(profitResult.grossRevenue)} /><MetricResult label="Total costs" value={numberLabel(profitResult.totalCosts)} /><MetricResult label="Net profit" value={numberLabel(profitResult.netProfit)} emphasis /><MetricResult label="Profit margin" value={profitResult.profitMargin === null ? 'Unavailable' : `${numberLabel(profitResult.profitMargin)}%`} /><MetricResult label="Break-even unit price" value={numberLabel(profitResult.breakEvenUnitPrice)} />{profitResult.targetProfitUnitPrice !== null && <MetricResult label="Unit price for target profit" value={numberLabel(profitResult.targetProfitUnitPrice)} />}</div>}
            <p className="result-footnote">Estimate only. This is not a verified financial outcome.</p>
          </section>
        </div>
      ) : (
        <div className="algorithm-layout">
          <form className="panel algorithm-form" onSubmit={submitMatch}>
            <SectionHeading eyebrow="PROPOSED INITIAL WEIGHTS" title="Single-candidate match score" detail="Provide four normalized fit values from 0 to 1 for one candidate." />
            <div className="weight-list"><span>Price fit <strong>35%</strong></span><span>Quality fit <strong>25%</strong></span><span>Distance fit <strong>20%</strong></span><span>Availability fit <strong>20%</strong></span></div>
            <div className="form-grid"><NumericField label="Price fit (0–1)" value={matchValues.priceFit} onChange={(value) => updateMatch('priceFit', value)} min="0" max="1" step="0.01" /><NumericField label="Quality fit (0–1)" value={matchValues.qualityFit} onChange={(value) => updateMatch('qualityFit', value)} min="0" max="1" step="0.01" /><NumericField label="Distance fit (0–1)" value={matchValues.distanceFit} onChange={(value) => updateMatch('distanceFit', value)} min="0" max="1" step="0.01" /><NumericField label="Availability fit (0–1)" value={matchValues.availabilityFit} onChange={(value) => updateMatch('availabilityFit', value)} min="0" max="1" step="0.01" /></div>
            <div className="form-actions"><button className="button button--primary" type="submit">Calculate score <ArrowRight size={16} aria-hidden="true" /></button><span>Proposed weights; not validated on live data.</span></div>
          </form>
          <section className="panel result-panel" aria-live="polite">
            <div className="result-panel__head"><span className="eyebrow">CANDIDATE SCORE</span><span className="result-panel__icon"><SlidersHorizontal size={17} aria-hidden="true" /></span></div>
            {!matchResult && <div className="result-placeholder"><span className="result-placeholder__icon"><FileSearch size={19} aria-hidden="true" /></span><strong>Score appears here</strong><p>Enter all four normalized factors. This tool does not retrieve or rank marketplace candidates.</p></div>}
            {matchResult && !matchResult.valid && <div className="validation-panel" role="alert"><strong>Check the inputs</strong><ul>{matchResult.errors.map((error) => <li key={error}>{error}</li>)}</ul></div>}
            {matchResult?.valid && <><div className="score-display"><strong>{numberLabel(matchResult.score * 100)}<small>%</small></strong><span>Weighted fit score</span></div><div className="contribution-list"><Contribution label="Price fit" value={matchResult.contributions.priceFit} /><Contribution label="Quality fit" value={matchResult.contributions.qualityFit} /><Contribution label="Distance fit" value={matchResult.contributions.distanceFit} /><Contribution label="Availability fit" value={matchResult.contributions.availabilityFit} /></div></>}
            <p className="result-footnote">Initial weights are product proposals. Validate them before publishing an algorithm.</p>
          </section>
        </div>
      )}
      <section className="panel algorithm-disclaimer"><AlertCircle size={16} aria-hidden="true" /><p>Live matching, ranking, versioning, and publishing are blocked until the backend defines algorithm configuration, validation, authorization, and audit contracts.</p></section>
    </div>
  );
}

function NumericField({ label, value, onChange, min = '0', max, step = 'any' }: { label: string; value: string; onChange: (value: string) => void; min?: string; max?: string; step?: string }) {
  const id = label.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
  return <label className="field" htmlFor={id}><span>{label}</span><input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Enter value" /></label>;
}

function Contribution({ label, value }: { label: string; value: number }) {
  return <div className="contribution-row"><span>{label}</span><div className="contribution-row__track"><i style={{ width: `${Math.max(0, Math.min(value * 100 / 0.35, 100))}%` }} /></div><strong>{numberLabel(value * 100)}%</strong></div>;
}

