'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

// ==================== ICONS ====================
const Icons = {
  Shield: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Home: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Bot: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>,
  FileText: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  BarChart: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>,
  AlertTriangle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  CheckCircle: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  X: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Download: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Users: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  Settings: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  LogOut: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  Plus: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Monitor: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
  Folder: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>,
  Target: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  Zap: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
};

// ==================== LOGIN PAGE ====================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('test@demo.com');
  const [password, setPassword] = useState('Test1234!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let data;
      if (isRegister) {
        data = await api.register({ email, password, full_name: fullName });
      } else {
        data = await api.login(email, password);
      }
      api.setToken(data.token);
      api.setUser(data.user);
      onLogin(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pastel-cream via-pastel-slate to-pastel-blue/30 p-4">
      <div className="animate-fade-in w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-400 text-white mb-4">
            <Icons.Shield />
          </div>
          <h1 className="text-2xl font-bold text-brand-700">NIST AI RMF</h1>
          <p className="text-brand-400 text-sm mt-1">Policy Builder</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-brand-100/50 p-8">
          <h2 className="text-lg font-semibold text-brand-700 mb-6">{isRegister ? 'Create Account' : 'Sign In'}</h2>
          
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-pastel-red/30 text-red-700 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Doe" required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3">
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm text-brand-400 hover:text-brand-600">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-pastel-gray">
            <p className="text-xs text-gray-400 text-center">Demo credentials: test@demo.com / Test1234!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== SIDEBAR ====================
function Sidebar({ currentPage, setCurrentPage, user, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
    { id: 'systems', label: 'AI Systems', icon: Icons.Bot },
    { id: 'policies', label: 'Policies', icon: Icons.FileText },
    { id: 'gaps', label: 'Gap Analysis', icon: Icons.Target },
    { id: 'alerts', label: 'Reg. Alerts', icon: Icons.AlertTriangle },
    { id: 'documents', label: 'Evidence Vault', icon: Icons.Folder },
    { id: 'tasks', label: 'Tasks', icon: Icons.CheckCircle },
    { id: 'monitoring', label: 'Monitoring', icon: Icons.Monitor },
    { id: 'advisor', label: 'AI Advisor', icon: Icons.Zap },
    { id: 'organization', label: 'Organization', icon: Icons.Settings },
  ];

  return (
    <aside className="w-64 bg-white border-r border-pastel-gray/50 flex flex-col min-h-screen">
      <div className="p-5 border-b border-pastel-gray/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-400 text-white flex items-center justify-center">
            <Icons.Shield />
          </div>
          <div>
            <div className="font-bold text-sm text-brand-700">NIST AI RMF</div>
            <div className="text-xs text-gray-400">Policy Builder</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              currentPage === item.id
                ? 'bg-brand-50 text-brand-500 font-medium'
                : 'text-gray-500 hover:bg-pastel-slate hover:text-brand-500'
            }`}
          >
            <item.icon />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-pastel-gray/50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-pastel-purple flex items-center justify-center text-sm font-semibold text-purple-700">
            {user?.full_name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{user?.full_name}</div>
            <div className="text-xs text-gray-400 truncate">{user?.role}</div>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-pastel-red/20 hover:text-red-600 transition-all">
          <Icons.LogOut /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ==================== DASHBOARD ====================
function DashboardPage({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard().then(r => { setData(r.dashboard); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const d = data || {};
  const stats = [
    { label: 'AI Systems', value: d.systemCount || 0, color: 'bg-pastel-blue', icon: Icons.Bot },
    { label: 'Policies', value: d.policyCount || 0, color: 'bg-pastel-green', icon: Icons.FileText },
    { label: 'Alerts', value: d.alertSummary?.total || 0, color: 'bg-pastel-yellow', icon: Icons.AlertTriangle },
    { label: 'Tasks', value: Object.values(d.taskSummary || {}).reduce((a, b) => a + b, 0), color: 'bg-pastel-purple', icon: Icons.CheckCircle },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">AI Governance Overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-pastel-gray/30 card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{s.label}</p>
                <p className="text-3xl font-bold text-brand-700 mt-1">{s.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-brand-600`}>
                <s.icon />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gap Analysis Summary */}
        <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
          <h3 className="font-semibold text-brand-700 mb-4">Gap Analysis</h3>
          {d.gapSummary ? (
            <div className="space-y-3">
              <GapBar label="Covered" count={d.gapSummary.covered || 0} total={Object.values(d.gapSummary).reduce((a,b)=>a+b,0)} color="bg-pastel-green" />
              <GapBar label="Needs Work" count={d.gapSummary.needs_improvement || 0} total={Object.values(d.gapSummary).reduce((a,b)=>a+b,0)} color="bg-pastel-yellow" />
              <GapBar label="Missing" count={d.gapSummary.missing || 0} total={Object.values(d.gapSummary).reduce((a,b)=>a+b,0)} color="bg-pastel-red" />
            </div>
          ) : <p className="text-sm text-gray-400">No gap analysis data yet</p>}
        </div>

        {/* Maturity */}
        <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
          <h3 className="font-semibold text-brand-700 mb-4">Maturity Scores</h3>
          {d.maturitySummary && Object.keys(d.maturitySummary).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(d.maturitySummary).map(([cat, score]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-20 uppercase">{cat}</span>
                  <div className="flex-1 h-6 bg-pastel-slate rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-300 to-brand-400 transition-all" style={{ width: `${(score / 5) * 100}%` }} />
                  </div>
                  <span className="text-sm font-semibold text-brand-600 w-10">{score}/5</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">Complete a gap analysis to see maturity scores</p>}
        </div>

        {/* Risk Heatmap */}
        <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
          <h3 className="font-semibold text-brand-700 mb-4">Risk Heatmap</h3>
          {d.riskHeatmap && d.riskHeatmap.length > 0 ? (
            <div className="space-y-2">
              {d.riskHeatmap.map((sys, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-pastel-slate/50">
                  <span className={`badge badge-${sys.risk_level}`}>{sys.risk_level}</span>
                  <span className="text-sm font-medium">{sys.name}</span>
                  <span className="text-xs text-gray-400 ml-auto">{sys.status}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-gray-400">No AI systems registered</p>}
        </div>

        {/* Alert Summary */}
        <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
          <h3 className="font-semibold text-brand-700 mb-4">Regulatory Alerts</h3>
          {d.alertSummary && d.alertSummary.total > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-400" />
                <span className="text-sm">High Severity: {d.alertSummary.high || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-400" />
                <span className="text-sm">Medium Severity: {d.alertSummary.medium || 0}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-green-400" />
                <span className="text-sm">Low Severity: {d.alertSummary.low || 0}</span>
              </div>
              <button onClick={() => onNavigate('alerts')} className="btn btn-outline w-full mt-2 text-sm">View All Alerts</button>
            </div>
          ) : <p className="text-sm text-gray-400">No regulatory alerts</p>}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
        <h3 className="font-semibold text-brand-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button onClick={() => onNavigate('systems')} className="btn btn-secondary gap-2"><Icons.Plus /> New AI System</button>
          <button onClick={() => onNavigate('gaps')} className="btn btn-secondary gap-2"><Icons.Target /> Run Gap Analysis</button>
          <button onClick={() => onNavigate('documents')} className="btn btn-secondary gap-2"><Icons.Upload /> Upload Evidence</button>
        </div>
      </div>
    </div>
  );
}

function GapBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24">{label}</span>
      <div className="flex-1 h-5 bg-pastel-slate rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-8">{count}</span>
    </div>
  );
}

// ==================== AI SYSTEMS PAGE ====================
function SystemsPage({ onSelectSystem }) {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    api.getSystems().then(r => { setSystems(r.systems); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  if (showWizard) return <SystemWizard onDone={() => { setShowWizard(false); load(); }} onCancel={() => setShowWizard(false)} />;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">AI Systems</h1>
          <p className="text-gray-500 text-sm mt-1">Register and manage your AI systems</p>
        </div>
        <button onClick={() => setShowWizard(true)} className="btn btn-primary gap-2"><Icons.Plus /> New System</button>
      </div>

      {loading ? <LoadingSpinner /> : systems.length === 0 ? (
        <EmptyState icon={Icons.Bot} title="No AI Systems Yet" desc="Register your first AI system to get started with governance." action={() => setShowWizard(true)} actionLabel="Register AI System" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {systems.map(sys => (
            <div key={sys.id} onClick={() => onSelectSystem(sys)} className="bg-white rounded-xl p-5 border border-pastel-gray/30 card-hover cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pastel-blue flex items-center justify-center text-brand-600"><Icons.Bot /></div>
                  <div>
                    <h3 className="font-semibold text-brand-700">{sys.name}</h3>
                    <p className="text-xs text-gray-400">{sys.deployment_type || 'Standard'}</p>
                  </div>
                </div>
                <span className={`badge badge-${sys.risk_level}`}>{sys.risk_level}</span>
              </div>
              <p className="text-sm text-gray-500 line-clamp-2 mb-3">{sys.use_case || 'No description'}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>HITL: {sys.human_in_loop ? '✅' : '❌'}</span>
                <span>Status: {sys.status}</span>
                <span className="ml-auto flex items-center gap-1 text-brand-400"><Icons.ChevronRight /> View</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== SYSTEM WIZARD ====================
function SystemWizard({ onDone, onCancel }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', use_case: '', input_data_types: [], output_decisions: '',
    risk_level: 'medium', human_in_loop: true, deployment_type: 'cloud', description: ''
  });
  const [saving, setSaving] = useState(false);

  const steps = ['Basic Info', 'Data & Outputs', 'Risk & Controls', 'Review'];
  const dataTypes = ['text', 'images', 'audio', 'video', 'medical_records', 'financial_data', 'personal_data', 'vital_signs', 'patient_history', 'behavioral_data', 'sensor_data', 'geolocation'];

  const toggleDataType = (dt) => {
    setForm(prev => ({
      ...prev,
      input_data_types: prev.input_data_types.includes(dt)
        ? prev.input_data_types.filter(d => d !== dt)
        : [...prev.input_data_types, dt]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.createSystem(form);
      onDone();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-700">Register AI System</h1>
        <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`wizard-step ${i < step ? 'completed' : i === step ? 'active' : 'pending'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === step ? 'text-brand-500 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < steps.length - 1 && <div className="w-8 h-px bg-pastel-gray" />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">AI System Name *</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Patient Triage AI" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Use Case</label>
              <textarea rows={3} value={form.use_case} onChange={e => setForm({...form, use_case: e.target.value})} placeholder="Describe what this AI system does..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
              <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Additional details..." />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Input Data Types (select all that apply)</label>
              <div className="flex flex-wrap gap-2">
                {dataTypes.map(dt => (
                  <button key={dt} onClick={() => toggleDataType(dt)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                      form.input_data_types.includes(dt) ? 'bg-brand-400 text-white border-brand-400' : 'bg-white border-pastel-gray text-gray-600 hover:border-brand-300'
                    }`}>{dt.replace(/_/g, ' ')}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Output Decisions</label>
              <textarea rows={2} value={form.output_decisions} onChange={e => setForm({...form, output_decisions: e.target.value})} placeholder="What decisions does this AI make?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Deployment Type</label>
              <select value={form.deployment_type} onChange={e => setForm({...form, deployment_type: e.target.value})}>
                <option value="cloud">Cloud</option>
                <option value="on-premise">On-Premise</option>
                <option value="edge">Edge</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Risk Level</label>
              <div className="grid grid-cols-4 gap-2">
                {['low','medium','high','critical'].map(rl => (
                  <button key={rl} onClick={() => setForm({...form, risk_level: rl})}
                    className={`p-3 rounded-xl text-center text-sm font-medium border-2 transition-all ${
                      form.risk_level === rl ? 'border-brand-400 bg-brand-50' : 'border-pastel-gray bg-white'
                    }`}>
                    <div className={`badge badge-${rl} mb-1 mx-auto`}>{rl}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Human-in-the-Loop</label>
              <div className="flex gap-3">
                <button onClick={() => setForm({...form, human_in_loop: true})} className={`flex-1 p-3 rounded-xl text-center text-sm border-2 ${form.human_in_loop ? 'border-pastel-green bg-green-50' : 'border-pastel-gray'}`}>
                  ✅ Yes - Human reviews AI decisions
                </button>
                <button onClick={() => setForm({...form, human_in_loop: false})} className={`flex-1 p-3 rounded-xl text-center text-sm border-2 ${!form.human_in_loop ? 'border-pastel-red bg-red-50' : 'border-pastel-gray'}`}>
                  ❌ No - Fully autonomous
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-brand-700 mb-3">Review Your AI System</h3>
            <ReviewRow label="Name" value={form.name} />
            <ReviewRow label="Use Case" value={form.use_case} />
            <ReviewRow label="Input Data" value={form.input_data_types.join(', ')} />
            <ReviewRow label="Output" value={form.output_decisions} />
            <ReviewRow label="Risk Level" value={form.risk_level} />
            <ReviewRow label="Human-in-Loop" value={form.human_in_loop ? 'Yes' : 'No'} />
            <ReviewRow label="Deployment" value={form.deployment_type} />
          </div>
        )}

        <div className="flex justify-between mt-6 pt-4 border-t border-pastel-gray/50">
          <button onClick={() => step > 0 ? setStep(step - 1) : onCancel()} className="btn btn-secondary">
            {step === 0 ? 'Cancel' : 'Back'}
          </button>
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)} disabled={step === 0 && !form.name} className="btn btn-primary">
              Next
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="btn btn-success">
              {saving ? 'Saving...' : '✓ Register System'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex gap-4 py-2 border-b border-pastel-gray/30">
      <span className="text-sm font-medium text-gray-500 w-32">{label}</span>
      <span className="text-sm text-gray-800">{value || '—'}</span>
    </div>
  );
}

// ==================== POLICIES PAGE ====================
function PoliciesPage({ selectedSystem }) {
  const [systems, setSystems] = useState([]);
  const [currentSystem, setCurrentSystem] = useState(selectedSystem);
  const [policies, setPolicies] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('policies');

  useEffect(() => { api.getSystems().then(r => setSystems(r.systems)).catch(() => {}); }, []);

  useEffect(() => {
    if (currentSystem?.id) {
      api.getPolicies(currentSystem.id).then(r => setPolicies(r.policies)).catch(() => {});
    }
  }, [currentSystem]);

  const handleGenerate = async () => {
    if (!currentSystem) return;
    setGenerating(true);
    try {
      const data = await api.generatePolicies(currentSystem.id);
      setGeneratedData(data);
      setPolicies([]); // Force reload
      const r = await api.getPolicies(currentSystem.id);
      setPolicies(r.policies);
    } catch (err) {
      alert(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!currentSystem) return;
    setDownloading(true);
    try {
      const blob = await api.downloadPDF(currentSystem.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NIST-AI-RMF-Report-${currentSystem.name.replace(/\s+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('PDF generation failed: ' + err.message);
    } finally {
      setDownloading(false);
    }
  };

  const categories = ['govern', 'map', 'measure', 'manage'];
  const tabLabels = { policies: 'Policies', checklist: 'Checklist', raci: 'RACI Matrix', monitoring: 'Monitoring', risk: 'Risk Estimate' };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Policy Generator</h1>
          <p className="text-gray-500 text-sm mt-1">Generate NIST AI RMF aligned policies</p>
        </div>
        <div className="flex gap-2">
          {policies.length > 0 && (
            <button onClick={handleDownloadPDF} disabled={downloading} className="btn btn-success gap-2">
              <Icons.Download /> {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          )}
        </div>
      </div>

      {/* System selector */}
      <div className="bg-white rounded-xl p-5 border border-pastel-gray/30">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select AI System</label>
        <div className="flex gap-3">
          <select className="flex-1" value={currentSystem?.id || ''} onChange={e => {
            const sys = systems.find(s => s.id === e.target.value);
            setCurrentSystem(sys);
            setPolicies([]);
            setGeneratedData(null);
          }}>
            <option value="">Choose a system...</option>
            {systems.map(s => <option key={s.id} value={s.id}>{s.name} ({s.risk_level})</option>)}
          </select>
          <button onClick={handleGenerate} disabled={!currentSystem || generating} className="btn btn-primary gap-2">
            <Icons.Zap /> {generating ? 'Generating...' : 'Generate Policies'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      {(policies.length > 0 || generatedData) && (
        <>
          <div className="flex gap-1 bg-pastel-slate rounded-xl p-1">
            {Object.entries(tabLabels).map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500 hover:text-brand-500'}`}>
                {label}
              </button>
            ))}
          </div>

          {/* Policies tab */}
          {activeTab === 'policies' && (
            <div className="space-y-4">
              {categories.map(cat => {
                const catPolicies = policies.filter(p => p.category === cat);
                if (catPolicies.length === 0) return null;
                return (
                  <div key={cat} className="bg-white rounded-xl border border-pastel-gray/30 overflow-hidden">
                    <div className="px-5 py-3 bg-brand-50 border-b border-pastel-gray/30">
                      <h3 className="font-semibold text-brand-700 uppercase">{cat}</h3>
                    </div>
                    <div className="divide-y divide-pastel-gray/30">
                      {catPolicies.map(p => (
                        <details key={p.id} className="group">
                          <summary className="px-5 py-3 cursor-pointer flex items-center justify-between hover:bg-pastel-slate/50">
                            <span className="text-sm font-medium text-gray-700">{p.title}</span>
                            <Icons.ChevronRight />
                          </summary>
                          <div className="px-5 py-4 bg-pastel-slate/30 text-sm text-gray-600 whitespace-pre-line">
                            {p.content}
                          </div>
                        </details>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Checklist tab */}
          {activeTab === 'checklist' && generatedData?.checklist && (
            <div className="bg-white rounded-xl border border-pastel-gray/30 p-5">
              <div className="space-y-2">
                {generatedData.checklist.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-pastel-slate/30">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span className={`badge badge-${item.priority === 'critical' ? 'critical' : item.priority}`}>{item.priority}</span>
                    <span className="text-sm flex-1">{item.item}</span>
                    <span className="text-xs text-gray-400 uppercase">{item.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RACI tab */}
          {activeTab === 'raci' && generatedData?.raciMatrix && (
            <div className="bg-white rounded-xl border border-pastel-gray/30 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-brand-50">
                    <th className="px-4 py-3 text-left font-semibold text-brand-700">Activity</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-700">Responsible</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-700">Accountable</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-700">Consulted</th>
                    <th className="px-4 py-3 text-left font-semibold text-brand-700">Informed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-pastel-gray/30">
                  {generatedData.raciMatrix.map((r, i) => (
                    <tr key={i} className="hover:bg-pastel-slate/30">
                      <td className="px-4 py-3 font-medium">{r.activity}</td>
                      <td className="px-4 py-3 text-green-700">{r.responsible}</td>
                      <td className="px-4 py-3 text-blue-700">{r.accountable}</td>
                      <td className="px-4 py-3 text-purple-700">{r.consulted}</td>
                      <td className="px-4 py-3 text-gray-500">{r.informed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Monitoring tab */}
          {activeTab === 'monitoring' && generatedData?.monitoringPlan && (
            <div className="bg-white rounded-xl border border-pastel-gray/30 overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-brand-50">
                  <th className="px-4 py-3 text-left font-semibold text-brand-700">Metric</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-700">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-700">Frequency</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-700">Threshold</th>
                  <th className="px-4 py-3 text-left font-semibold text-brand-700">Owner</th>
                </tr></thead>
                <tbody className="divide-y divide-pastel-gray/30">
                  {generatedData.monitoringPlan.map((m, i) => (
                    <tr key={i} className="hover:bg-pastel-slate/30">
                      <td className="px-4 py-3 font-medium">{m.metric_name}</td>
                      <td className="px-4 py-3"><span className="badge bg-pastel-blue text-blue-800">{m.metric_type}</span></td>
                      <td className="px-4 py-3">{m.frequency}</td>
                      <td className="px-4 py-3 text-xs">{m.threshold}</td>
                      <td className="px-4 py-3">{m.responsible_party}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Risk tab */}
          {activeTab === 'risk' && generatedData?.riskEstimate && (
            <div className="bg-white rounded-xl border border-pastel-gray/30 p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-pastel-red/20">
                  <p className="text-xs text-gray-500 mb-1">Non-Compliance Cost</p>
                  <p className="text-lg font-bold text-red-700">{generatedData.riskEstimate.estimated_non_compliance_cost}</p>
                </div>
                <div className="p-4 rounded-xl bg-pastel-yellow/30">
                  <p className="text-xs text-gray-500 mb-1">Risk Exposure</p>
                  <p className="text-lg font-bold text-yellow-700">{generatedData.riskEstimate.operational_risk_exposure}</p>
                </div>
                <div className="p-4 rounded-xl bg-pastel-green/30">
                  <p className="text-xs text-gray-500 mb-1">Recommended Investment</p>
                  <p className="text-lg font-bold text-green-700">{generatedData.riskEstimate.recommended_investment}</p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Contributing Factors</h4>
                {generatedData.riskEstimate.factors.map((f, i) => (
                  <p key={i} className="text-sm text-gray-500 py-1">• {f}</p>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ==================== GAP ANALYSIS PAGE ====================
function GapAnalysisPage() {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [gaps, setGaps] = useState([]);
  const [maturity, setMaturity] = useState(null);
  const [saving, setSaving] = useState(false);

  const defaultQuestions = [
    { category: 'govern', question: 'Does the organization have a documented AI governance policy?' },
    { category: 'govern', question: 'Is there an AI ethics board or committee?' },
    { category: 'govern', question: 'Are roles and responsibilities for AI oversight defined?' },
    { category: 'govern', question: 'Is AI ethics training provided to relevant staff?' },
    { category: 'map', question: 'Are all AI systems inventoried and categorized by risk?' },
    { category: 'map', question: 'Are stakeholders identified for each AI system?' },
    { category: 'map', question: 'Is there a process for mapping AI impacts on individuals?' },
    { category: 'map', question: 'Are data flows and dependencies documented?' },
    { category: 'measure', question: 'Are performance metrics defined for AI systems?' },
    { category: 'measure', question: 'Is bias testing conducted regularly?' },
    { category: 'measure', question: 'Are AI system outputs validated by domain experts?' },
    { category: 'measure', question: 'Is continuous monitoring in place for deployed AI?' },
    { category: 'manage', question: 'Is there an incident response plan for AI failures?' },
    { category: 'manage', question: 'Are there processes for decommissioning AI systems?' },
    { category: 'manage', question: 'Is continuous monitoring in place for deployed AI systems?' },
    { category: 'manage', question: 'Are risk treatment plans documented and tracked?' },
  ];

  useEffect(() => { api.getSystems().then(r => setSystems(r.systems)).catch(() => {}); }, []);

  useEffect(() => {
    if (selectedSystem) {
      api.getGapAnalysis(selectedSystem.id).then(r => {
        if (r.gaps.length > 0) {
          setGaps(r.gaps.map(g => ({ ...g, answer: g.answer || null })));
        } else {
          setGaps(defaultQuestions.map(q => ({ ...q, answer: null, notes: '' })));
        }
      }).catch(() => {
        setGaps(defaultQuestions.map(q => ({ ...q, answer: null, notes: '' })));
      });
      api.getMaturity(selectedSystem.id).then(r => setMaturity(r.maturity)).catch(() => {});
    }
  }, [selectedSystem]);

  const handleSave = async () => {
    if (!selectedSystem) return;
    setSaving(true);
    try {
      const result = await api.submitGapAnalysis(selectedSystem.id, gaps.filter(g => g.answer));
      setMaturity(result.maturityScores);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Control Gap Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">Assess your AI governance controls</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-pastel-gray/30">
        <label className="block text-sm font-medium text-gray-600 mb-2">Select AI System</label>
        <select value={selectedSystem?.id || ''} onChange={e => setSelectedSystem(systems.find(s => s.id === e.target.value))}>
          <option value="">Choose a system...</option>
          {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {selectedSystem && gaps.length > 0 && (
        <>
          {/* Maturity display */}
          {maturity && Object.keys(maturity).length > 0 && (
            <div className="bg-white rounded-xl p-5 border border-pastel-gray/30">
              <h3 className="font-semibold text-brand-700 mb-3">Maturity Score: {maturity.overall}/5</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['govern','map','measure','manage'].map(cat => (
                  <div key={cat} className="text-center p-3 rounded-xl bg-pastel-slate/50">
                    <div className="text-2xl font-bold text-brand-600">{maturity[cat] || '—'}</div>
                    <div className="text-xs text-gray-500 uppercase mt-1">{cat}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Questions */}
          <div className="space-y-3">
            {['govern','map','measure','manage'].map(cat => (
              <div key={cat} className="bg-white rounded-xl border border-pastel-gray/30 overflow-hidden">
                <div className="px-5 py-3 bg-brand-50 border-b border-pastel-gray/30">
                  <h3 className="font-semibold text-brand-700 uppercase">{cat}</h3>
                </div>
                <div className="divide-y divide-pastel-gray/30">
                  {gaps.filter(g => g.category === cat).map((gap, i) => {
                    const gapIndex = gaps.findIndex(g2 => g2.question === gap.question);
                    return (
                      <div key={i} className="px-5 py-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">{gap.question}</p>
                        <div className="flex gap-2">
                          {['covered','needs_improvement','missing'].map(ans => (
                            <button key={ans} onClick={() => {
                              const updated = [...gaps];
                              updated[gapIndex] = { ...updated[gapIndex], answer: ans };
                              setGaps(updated);
                            }} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                              gap.answer === ans
                                ? ans === 'covered' ? 'bg-pastel-green text-green-800 border-green-300'
                                  : ans === 'needs_improvement' ? 'bg-pastel-yellow text-yellow-800 border-yellow-300'
                                  : 'bg-pastel-red text-red-800 border-red-300'
                                : 'bg-white border-pastel-gray text-gray-500 hover:border-brand-300'
                            }`}>
                              {ans === 'covered' ? '✅ Covered' : ans === 'needs_improvement' ? '⚠️ Needs Work' : '❌ Missing'}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              {saving ? 'Saving...' : 'Save Gap Analysis'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== ALERTS PAGE ====================
function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAlerts().then(r => { setAlerts(r.alerts); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Regulatory Alerts</h1>
        <p className="text-gray-500 text-sm mt-1">Stay compliant with evolving AI regulations</p>
      </div>

      {alerts.length === 0 ? (
        <EmptyState icon={Icons.AlertTriangle} title="No Alerts" desc="You're up to date with regulatory requirements." />
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <div key={alert.id} className={`bg-white rounded-xl p-5 border-l-4 border border-pastel-gray/30 ${
              alert.severity === 'high' ? 'border-l-red-400' : alert.severity === 'medium' ? 'border-l-yellow-400' : 'border-l-green-400'
            } ${alert.is_read ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge badge-${alert.severity}`}>{alert.severity}</span>
                    <span className="text-xs text-gray-400">{alert.regulation}</span>
                    <span className="text-xs text-gray-400">• {alert.geography}</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{alert.title}</h3>
                  <p className="text-sm text-gray-500">{alert.description}</p>
                </div>
                {!alert.is_read && (
                  <button onClick={() => {
                    api.markAlertRead(alert.id);
                    setAlerts(alerts.map(a => a.id === alert.id ? { ...a, is_read: true } : a));
                  }} className="text-xs text-brand-400 hover:text-brand-600 ml-4">Mark read</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== DOCUMENTS PAGE ====================
function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    api.getDocuments().then(r => { setDocuments(r.documents); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', JSON.stringify(['evidence']));
      await api.uploadFile('/api/documents/upload', formData);
      const r = await api.getDocuments();
      setDocuments(r.documents);
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Evidence & Documentation Vault</h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage compliance evidence</p>
        </div>
        <label className="btn btn-primary gap-2 cursor-pointer">
          <Icons.Upload /> {uploading ? 'Uploading...' : 'Upload File'}
          <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {documents.length === 0 ? (
        <EmptyState icon={Icons.Folder} title="No Documents" desc="Upload model cards, data sheets, and evaluation reports." />
      ) : (
        <div className="bg-white rounded-xl border border-pastel-gray/30 overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-brand-50">
              <th className="px-4 py-3 text-left font-semibold text-brand-700">File</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-700">Type</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-700">Size</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-700">Tags</th>
              <th className="px-4 py-3 text-left font-semibold text-brand-700">Uploaded</th>
            </tr></thead>
            <tbody className="divide-y divide-pastel-gray/30">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-pastel-slate/30">
                  <td className="px-4 py-3 font-medium">{doc.original_name}</td>
                  <td className="px-4 py-3"><span className="badge bg-pastel-blue text-blue-800">{doc.file_type?.split('/')[1] || 'file'}</span></td>
                  <td className="px-4 py-3 text-gray-500">{(doc.file_size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-3">{(doc.tags || []).map((t, i) => <span key={i} className="badge bg-pastel-purple text-purple-800 mr-1">{t}</span>)}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==================== TASKS PAGE ====================
function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    api.getTasks().then(r => { setTasks(r.tasks); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    try {
      await api.createTask(newTask);
      const r = await api.getTasks();
      setTasks(r.tasks);
      setShowForm(false);
      setNewTask({ title: '', description: '', priority: 'medium' });
    } catch (err) { alert(err.message); }
  };

  const handleStatusChange = async (id, status) => {
    await api.updateTask(id, { status });
    const r = await api.getTasks();
    setTasks(r.tasks);
  };

  if (loading) return <LoadingSpinner />;

  const statuses = ['pending', 'in_progress', 'review', 'completed'];
  const statusColors = { pending: 'bg-gray-100', in_progress: 'bg-pastel-blue/30', review: 'bg-pastel-yellow/30', completed: 'bg-pastel-green/30' };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">Tasks & Collaboration</h1>
          <p className="text-gray-500 text-sm mt-1">Track compliance tasks and assignments</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary gap-2"><Icons.Plus /> New Task</button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl p-5 border border-pastel-gray/30 space-y-3">
          <input type="text" placeholder="Task title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
          <textarea placeholder="Description" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} rows={2} />
          <div className="flex gap-3">
            <select value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
            </select>
            <button onClick={handleCreate} className="btn btn-success">Create Task</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statuses.map(status => (
          <div key={status} className={`rounded-xl p-4 ${statusColors[status]}`}>
            <h3 className="font-semibold text-sm text-gray-700 mb-3 uppercase">{status.replace('_', ' ')}</h3>
            <div className="space-y-2">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white rounded-lg p-3 shadow-sm border border-pastel-gray/20">
                  <p className="text-sm font-medium mb-1">{task.title}</p>
                  <div className="flex items-center justify-between">
                    <span className={`badge badge-${task.priority}`}>{task.priority}</span>
                    <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)} className="text-xs border-0 bg-transparent text-brand-400 p-0">
                      {statuses.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MONITORING PAGE ====================
function MonitoringPage() {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [plans, setPlans] = useState([]);

  useEffect(() => { api.getSystems().then(r => setSystems(r.systems)).catch(() => {}); }, []);

  useEffect(() => {
    if (selectedSystem) {
      api.getMonitoring(selectedSystem.id).then(r => setPlans(r.plans)).catch(() => {});
    }
  }, [selectedSystem]);

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Continuous Monitoring</h1>
        <p className="text-gray-500 text-sm mt-1">Track model performance and risk metrics</p>
      </div>

      <div className="bg-white rounded-xl p-5 border border-pastel-gray/30">
        <select value={selectedSystem?.id || ''} onChange={e => setSelectedSystem(systems.find(s => s.id === e.target.value))}>
          <option value="">Select AI System...</option>
          {systems.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {plans.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map(plan => (
            <div key={plan.id} className="bg-white rounded-xl p-5 border border-pastel-gray/30 card-hover">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-pastel-blue flex items-center justify-center">
                  <Icons.Monitor />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-brand-700">{plan.metric_name}</h3>
                  <span className="badge bg-pastel-purple text-purple-800">{plan.metric_type}</span>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-500"><span className="font-medium text-gray-600">Frequency:</span> {plan.frequency}</p>
                <p className="text-gray-500"><span className="font-medium text-gray-600">Threshold:</span> {plan.threshold}</p>
                <p className="text-gray-500"><span className="font-medium text-gray-600">Owner:</span> {plan.responsible_party}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedSystem && plans.length === 0 && (
        <EmptyState icon={Icons.Monitor} title="No Monitoring Plans" desc="Generate policies first to create a monitoring plan." />
      )}
    </div>
  );
}

// ==================== ORGANIZATION PAGE ====================
function OrganizationPage() {
  const [org, setOrg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', industry: 'Healthcare', size: '100-500', geography: 'United States', regulatory_exposure: [] });
  const [saving, setSaving] = useState(false);

  const industries = ['Healthcare', 'Finance', 'Business', 'Wellness', 'Education', 'Government'];
  const sizes = ['1-50', '50-100', '100-500', '500-1000', '1000+'];
  const regulations = ['HIPAA', 'EU AI Act', 'NYC Local Law 144', 'CCPA/CPRA', 'GDPR', 'FCRA', 'ECOA', 'FERPA', 'COPPA', 'FTC Act', 'Colorado AI Act'];

  useEffect(() => {
    api.getMyOrg().then(r => {
      if (r.organization) {
        setOrg(r.organization);
        setForm({
          name: r.organization.name,
          industry: r.organization.industry || 'Healthcare',
          size: r.organization.size || '100-500',
          geography: r.organization.geography || 'United States',
          regulatory_exposure: r.organization.regulatory_exposure || []
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (org) {
        const r = await api.updateOrg(org.id, form);
        setOrg(r.organization);
      } else {
        const r = await api.createOrg(form);
        setOrg(r.organization);
      }
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const toggleReg = (reg) => {
    setForm(prev => ({
      ...prev,
      regulatory_exposure: prev.regulatory_exposure.includes(reg)
        ? prev.regulatory_exposure.filter(r => r !== reg)
        : [...prev.regulatory_exposure, reg]
    }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-700">Organization Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your organization details</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-pastel-gray/30 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Organization Name</label>
          <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Acme Corp" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
            <select value={form.industry} onChange={e => setForm({...form, industry: e.target.value})}>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Size (employees)</label>
            <select value={form.size} onChange={e => setForm({...form, size: e.target.value})}>
              {sizes.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Geography</label>
            <input type="text" value={form.geography} onChange={e => setForm({...form, geography: e.target.value})} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">Regulatory Exposure</label>
          <div className="flex flex-wrap gap-2">
            {regulations.map(reg => (
              <button key={reg} onClick={() => toggleReg(reg)}
                className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${
                  form.regulatory_exposure.includes(reg) ? 'bg-brand-400 text-white border-brand-400' : 'bg-white border-pastel-gray text-gray-600 hover:border-brand-300'
                }`}>{reg}</button>
            ))}
          </div>
        </div>
        <div className="pt-3 border-t border-pastel-gray/50">
          <button onClick={handleSave} disabled={saving || !form.name} className="btn btn-primary">
            {saving ? 'Saving...' : org ? 'Update Organization' : 'Create Organization'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== SHARED COMPONENTS ====================
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-pastel-blue border-t-brand-400 rounded-full animate-spin" />
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc, action, actionLabel }) {
  return (
    <div className="text-center py-16 bg-white rounded-xl border border-pastel-gray/30">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pastel-slate text-gray-400 mb-4"><Icon /></div>
      <h3 className="font-semibold text-gray-700">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-md mx-auto">{desc}</p>
      {action && <button onClick={action} className="btn btn-primary mt-4">{actionLabel}</button>}
    </div>
  );
}

// ==================== AI ADVISOR PAGE ====================
function AdvisorPage() {
  const [systems, setSystems] = useState([]);
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    api.getAdvisorStatus().then(r => { setAvailable(r.available); setCheckingStatus(false); }).catch(() => setCheckingStatus(false));
    api.getSystems().then(r => setSystems(r.systems)).catch(() => {});
  }, []);

  const quickPrompts = [
    'What are the top 3 risks for my AI system?',
    'How should I implement human-in-the-loop controls?',
    'What does the EU AI Act require for high-risk systems?',
    'Suggest a roadmap to improve our maturity score',
    'Review our gap analysis and suggest remediations',
  ];

  const handleSend = async (text) => {
    const msg = text || input;
    if (!msg.trim()) return;

    const userMsg = { role: 'user', content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await api.askAdvisor(msg, selectedSystem?.id);
      const aiMsg = { role: 'assistant', content: result.response, timestamp: new Date(), usage: result.usage };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { role: 'error', content: err.message, timestamp: new Date() };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemediation = async () => {
    if (!selectedSystem) return;
    setLoading(true);
    const userMsg = { role: 'user', content: `Generate remediation plan for ${selectedSystem.name}`, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const result = await api.getRemediation(selectedSystem.id);
      const aiMsg = { role: 'assistant', content: result.response, timestamp: new Date(), usage: result.usage };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errMsg = { role: 'error', content: err.message, timestamp: new Date() };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) return <LoadingSpinner />;

  if (!available) {
    return (
      <div className="animate-fade-in space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">AI Policy Advisor</h1>
          <p className="text-gray-500 text-sm mt-1">Powered by Claude</p>
        </div>
        <div className="bg-white rounded-xl p-8 border border-pastel-gray/30 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pastel-yellow/30 text-yellow-600 mb-4"><Icons.Zap /></div>
          <h3 className="font-semibold text-gray-700 text-lg">AI Advisor Not Configured</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Add your <code className="px-1.5 py-0.5 bg-pastel-slate rounded text-xs font-mono">ANTHROPIC_API_KEY</code> environment variable to enable the AI Policy Advisor.
          </p>
          <p className="text-xs text-gray-400 mt-3">Get a key at <span className="text-brand-400">console.anthropic.com</span></p>
          <div className="mt-6 p-4 rounded-xl bg-pastel-slate/50 text-left max-w-sm mx-auto">
            <p className="text-xs font-mono text-gray-500">ANTHROPIC_API_KEY=sk-ant-api03-...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-700">AI Policy Advisor</h1>
          <p className="text-gray-500 text-sm mt-1">Ask questions about NIST AI RMF, regulations, and governance</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-green-600 font-medium">Claude Online</span>
        </div>
      </div>

      {/* System context selector */}
      <div className="bg-white rounded-xl p-4 border border-pastel-gray/30 flex items-center gap-3">
        <span className="text-sm text-gray-500">Context:</span>
        <select className="flex-1 text-sm" value={selectedSystem?.id || ''} onChange={e => setSelectedSystem(systems.find(s => s.id === e.target.value) || null)}>
          <option value="">General (no specific system)</option>
          {systems.map(s => <option key={s.id} value={s.id}>{s.name} ({s.risk_level})</option>)}
        </select>
        {selectedSystem && (
          <button onClick={handleRemediation} disabled={loading} className="btn btn-secondary text-xs px-3 py-1.5">
            Get Remediation Plan
          </button>
        )}
      </div>

      {/* Quick prompts */}
      {messages.length === 0 && (
        <div className="bg-white rounded-xl p-6 border border-pastel-gray/30">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Quick Questions</h3>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, i) => (
              <button key={i} onClick={() => handleSend(prompt)} className="px-3 py-2 rounded-lg text-sm bg-pastel-slate hover:bg-brand-50 hover:text-brand-600 text-gray-600 transition-all text-left">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="space-y-4 min-h-[300px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-xl p-4 ${
              msg.role === 'user' ? 'bg-brand-400 text-white' :
              msg.role === 'error' ? 'bg-pastel-red/30 text-red-700 border border-red-200' :
              'bg-white border border-pastel-gray/30'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-pastel-gray/30">
                  <Icons.Zap />
                  <span className="text-xs font-medium text-brand-500">Claude AI Advisor</span>
                  {msg.usage && <span className="text-xs text-gray-400 ml-auto">{msg.usage.input_tokens + msg.usage.output_tokens} tokens</span>}
                </div>
              )}
              <div className={`text-sm whitespace-pre-wrap ${msg.role === 'assistant' ? 'text-gray-700 leading-relaxed advisor-content' : ''}`}>
                {msg.content}
              </div>
              <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-pastel-gray/30 rounded-xl p-4 flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-brand-300 border-t-brand-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-500">Claude is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="sticky bottom-0 bg-pastel-cream pt-2">
        <div className="bg-white rounded-xl border border-pastel-gray/30 p-3 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask about NIST AI RMF, regulations, governance..."
            className="flex-1 border-0 bg-transparent focus:ring-0 text-sm"
            disabled={loading}
          />
          <button onClick={() => handleSend()} disabled={loading || !input.trim()} className="btn btn-primary px-4 py-2 text-sm">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN APP ====================
export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSystem, setSelectedSystem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = api.getToken();
    const savedUser = api.getUser();
    if (token && savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    api.clearToken();
    setUser(null);
    setCurrentPage('dashboard');
  };

  const handleSelectSystem = (sys) => {
    setSelectedSystem(sys);
    setCurrentPage('policies');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-pastel-cream"><LoadingSpinner /></div>;
  if (!user) return <LoginPage onLogin={handleLogin} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} />;
      case 'systems': return <SystemsPage onSelectSystem={handleSelectSystem} />;
      case 'policies': return <PoliciesPage selectedSystem={selectedSystem} />;
      case 'gaps': return <GapAnalysisPage />;
      case 'alerts': return <AlertsPage />;
      case 'documents': return <DocumentsPage />;
      case 'tasks': return <TasksPage />;
      case 'monitoring': return <MonitoringPage />;
      case 'advisor': return <AdvisorPage />;
      case 'organization': return <OrganizationPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-pastel-cream">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} onLogout={handleLogout} />
      <main className="flex-1 p-6 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}
