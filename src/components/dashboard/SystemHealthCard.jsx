import { Globe, ShoppingCart, Zap } from 'lucide-react';

const SystemHealthCard = ({ stats = { totalOrders: 0, totalRevenue: 0, activeShops: new Set() } }) => {

  return (
    <div className="card" style={{ height: 'fit-content' }}>
      <h3 style={{ marginBottom: '24px', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Zap size={20} color="var(--accent)" />
        System Health
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="glass-plate" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <Globe size={18} color="#a5b4fc" />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Active Presence</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: '700' }}>
            {stats.activeShops.size}{' '}
            <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-muted)' }}>Shops Online</span>
          </p>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6ee7b7' }}>
            <Zap size={14} />
            <span>Operational & Listening</span>
          </div>
        </div>

        <div className="glass-plate" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <ShoppingCart size={18} color="#6ee7b7" />
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Daily Activity</span>
          </div>
          <p style={{ fontSize: '20px', fontWeight: '700' }}>
            {stats.totalOrders}{' '}
            <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--text-muted)' }}>Orders Today</span>
          </p>
          <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: '600', color: '#6ee7b7' }}>₹{stats.totalRevenue.toLocaleString()}</p>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Total Revenue</p>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthCard;
