import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, Store, UserCheck, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/** Split rows into last 7 days vs the 7 days before that (requires created_at). */
function splitLastTwoWeeks(rows, dateKey = 'created_at') {
  const now = Date.now();
  const currentStart = now - SEVEN_DAYS_MS;
  const previousStart = now - 2 * SEVEN_DAYS_MS;

  const current = [];
  const previous = [];
  for (const row of rows) {
    const t = new Date(row[dateKey]).getTime();
    if (Number.isNaN(t)) continue;
    if (t >= currentStart) current.push(row);
    else if (t >= previousStart) previous.push(row);
  }
  return { current, previous };
}

/**
 * Percent change current vs previous period.
 * Returns { kind: 'pct', value }, { kind: 'from_zero', current }, or { kind: 'flat' } when both zero.
 */
function comparePeriods(currentVal, previousVal) {
  if (previousVal === 0) {
    if (currentVal === 0) return { kind: 'flat' };
    return { kind: 'from_zero', current: currentVal };
  }
  const pct = ((currentVal - previousVal) / previousVal) * 100;
  return { kind: 'pct', value: pct };
}

function DeltaBadge({ comparison, fromZeroLabel = 'New' }) {
  if (!comparison || comparison.kind === 'flat') {
    return (
      <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Minus size={14} />
        vs prior 7d
      </span>
    );
  }

  if (comparison.kind === 'from_zero') {
    return (
      <span style={{ fontSize: '12px', color: 'var(--palette-emerald-400)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <TrendingUp size={14} />
        {fromZeroLabel}
      </span>
    );
  }

  const { value } = comparison;
  const up = value > 0;
  const down = value < 0;
  const color = down ? 'var(--palette-rose-400)' : up ? 'var(--palette-emerald-400)' : 'var(--text-muted)';
  const Icon = down ? TrendingDown : up ? TrendingUp : Minus;
  const text = `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

  return (
    <span style={{ fontSize: '12px', color, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }} title="Compared to the previous 7 days">
      <Icon size={14} />
      {text}
    </span>
  );
}

const Analytics = () => {
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    shopsTotal: 0,
    shopsActive: 0,
    vendors: 0,
    revenueCompare: null,
    ordersCompare: null,
    shopsEngagedCompare: null,
    vendorsNewCompare: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const since14d = new Date(Date.now() - 2 * SEVEN_DAYS_MS).toISOString();

      const [ordersRes, shopsRes, vendorHead, vendorsRecentRes] = await Promise.all([
        supabase.from('orders').select('total_amount, created_at, shop_id'),
        supabase.from('shops').select('id, is_active'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'vendor'),
        supabase.from('profiles').select('created_at').eq('role', 'vendor').gte('created_at', since14d),
      ]);

      const orderRows = ordersRes.data || [];
      const revenueAll = orderRows.reduce((a, o) => a + (Number(o.total_amount) || 0), 0);
      const ordersAll = orderRows.length;

      const recentOrders = orderRows.filter((o) => {
        const t = new Date(o.created_at).getTime();
        return !Number.isNaN(t) && t >= Date.now() - 2 * SEVEN_DAYS_MS;
      });
      const { current: ordersCurr, previous: ordersPrev } = splitLastTwoWeeks(recentOrders);

      const revenueCurr = ordersCurr.reduce((a, o) => a + (Number(o.total_amount) || 0), 0);
      const revenuePrev = ordersPrev.reduce((a, o) => a + (Number(o.total_amount) || 0), 0);

      const shopsWithOrders = (rows) => {
        const ids = new Set();
        for (const o of rows) {
          if (o.shop_id) ids.add(o.shop_id);
        }
        return ids.size;
      };

      const engagedCurr = shopsWithOrders(ordersCurr);
      const engagedPrev = shopsWithOrders(ordersPrev);

      const shopList = shopsRes.data || [];
      const shopsTotal = shopList.length;
      const shopsActive = shopList.filter((s) => s.is_active).length;

      const vendorRecent = vendorsRecentRes.data || [];
      const { current: vendCurr, previous: vendPrev } = splitLastTwoWeeks(vendorRecent);
      const newVendorsCurr = vendCurr.length;
      const newVendorsPrev = vendPrev.length;

      setStats({
        revenue: revenueAll,
        orders: ordersAll,
        shopsTotal,
        shopsActive,
        vendors: vendorHead.count ?? 0,
        revenueCompare: comparePeriods(revenueCurr, revenuePrev),
        ordersCompare: comparePeriods(ordersCurr.length, ordersPrev.length),
        shopsEngagedCompare: comparePeriods(engagedCurr, engagedPrev),
        vendorsNewCompare: comparePeriods(newVendorsCurr, newVendorsPrev),
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '60px', display: 'flex', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#a5b4fc" />
      </div>
    );
  }

  const activePct = stats.shopsTotal > 0 ? Math.round((stats.shopsActive / stats.shopsTotal) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: '24px', color: 'var(--primary)' }}>Business Analytics</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Aggregate insights across campus operations. Trend badges compare the <strong>last 7 days</strong> to the{' '}
          <strong>prior 7 days</strong>.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }} className="analytics-metric-grid">
        <div className="card interactive-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'color-mix(in srgb, var(--chart-1) 18%, transparent)',
                color: 'var(--chart-1)',
              }}
            >
              <DollarSign size={20} />
            </div>
            <DeltaBadge comparison={stats.revenueCompare} />
          </div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Revenue</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>₹{stats.revenue.toLocaleString()}</p>
        </div>

        <div className="card interactive-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'color-mix(in srgb, var(--chart-4) 18%, transparent)',
                color: 'var(--chart-4)',
              }}
            >
              <ShoppingBag size={20} />
            </div>
            <DeltaBadge comparison={stats.ordersCompare} />
          </div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Total Orders</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{stats.orders}</p>
        </div>

        <div className="card interactive-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'color-mix(in srgb, var(--chart-5) 18%, transparent)',
                color: 'var(--chart-5)',
              }}
            >
              <Store size={20} />
            </div>
            <DeltaBadge comparison={stats.shopsEngagedCompare} fromZeroLabel="New outlets" />
          </div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            Shops ({stats.shopsActive} live · {activePct}% of {stats.shopsTotal})
          </h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{stats.shopsTotal}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Trend: distinct outlets with orders, 7d vs 7d</p>
        </div>

        <div className="card interactive-lift">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div
              style={{
                padding: '8px',
                borderRadius: '10px',
                background: 'color-mix(in srgb, var(--chart-6) 18%, transparent)',
                color: 'var(--chart-6)',
              }}
            >
              <UserCheck size={20} />
            </div>
            <DeltaBadge comparison={stats.vendorsNewCompare} fromZeroLabel="New signups" />
          </div>
          <h3 style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>Onboarded Vendors (total)</h3>
          <p style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>{stats.vendors}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Trend: new vendor profiles, 7d vs 7d</p>
        </div>
      </div>

      <div
        className="card"
        style={{
          height: '300px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          border: '2px dashed rgba(255,255,255,0.2)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(99,102,241,0.06))',
        }}
      >
        Advanced Recharts analytics module loading... (Collecting session trend data)
      </div>
    </div>
  );
};

export default Analytics;
