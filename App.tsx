
import React, { useState, useMemo, useEffect } from 'react';
import { 
  FileText, 
  Upload, 
  BrainCircuit, 
  ListOrdered, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  Trash2, 
  FileCode, 
  FileSearch, 
  Sparkles, 
  Quote, 
  XCircle, 
  Briefcase, 
  Users, 
  Target, 
  ChevronLeft, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  History, 
  Info, 
  X, 
  ExternalLink, 
  Search, 
  Eye, 
  Calendar, 
  Building2, 
  Trophy, 
  BarChart3, 
  Zap, 
  ShieldCheck, 
  LayoutDashboard, 
  UserCheck, 
  SearchCode, 
  Settings, 
  MoreVertical, 
  ArrowUpRight, 
  ChevronDown, 
  Lock, 
  LogIn, 
  User, 
  LogOut, 
  CreditCard, 
  ShieldAlert, 
  UserPlus, 
  MinusCircle, 
  PlusCircle, 
  Maximize2, 
  AlertCircle, 
  FileUp, 
  Files,
  Square,
  CheckSquare,
  Send,
  UserCheck2,
  Download,
  Check,
  ThumbsUp,
  ArrowRight,
  RefreshCw,
  PartyPopper
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { ResumeData, RankingResult, ProcessingState, StructuredMetadata, ATSCheckItem } from './types';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.mjs`;

const SUPPORTED_FORMATS = ['pdf', 'docx', 'txt'];
const MIN_CONTENT_LENGTH = 150;

const ScoreArc = ({ score }: { score: number }) => {
  const percentage = score / 100;
  const radius = 45;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);

  return (
    <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
      <svg className="w-40 h-40 absolute top-0" viewBox="0 0 100 100">
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#gradient)" strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute top-[35px] text-center">
        <span className="text-2xl font-black text-slate-800">{score}/100</span>
      </div>
    </div>
  );
};

const AdminCard = ({ onSignOut }: { onSignOut: () => void }) => (
  <div className="p-6 mt-auto">
    <div className="bg-slate-900 rounded-[2rem] p-6 relative overflow-hidden group shadow-2xl border border-white/10">
      <div className="absolute top-[-20%] right-[-20%] w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity" />
      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg border border-indigo-400/30">AD</div>
        <div className="min-w-0">
          <p className="text-xs font-black text-white leading-tight truncate">System Admin</p>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Access Active</p>
          </div>
        </div>
      </div>
      <div className="space-y-3 relative z-10">
        <button onClick={() => alert("Initializing User Management...")} className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-indigo-500/20">
          <Users className="w-3.5 h-3.5" /> Manage Users
        </button>
        <button onClick={onSignOut} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all border border-white/5">
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>
    </div>
  </div>
);

const ResumeModal = ({ isOpen, onClose, resume, metadata }: { isOpen: boolean; onClose: () => void; resume: ResumeData | null; metadata: StructuredMetadata | undefined; }) => {
  if (!isOpen || !resume) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-slate-100 animate-in slide-in-from-bottom-8 duration-500">
        <header className="h-20 shrink-0 border-b border-slate-100 flex items-center justify-between px-10 bg-slate-50/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg"><FileText className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{resume.name}</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{resume.fileName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-rose-500 transition-all"><X className="w-6 h-6" /></button>
        </header>
        <div className="flex-grow flex overflow-hidden">
          <aside className="w-1/3 border-r border-slate-100 overflow-y-auto p-10 bg-slate-50/20 custom-scrollbar">
            <div className="space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> Professional Contact</h3>
                <div className="space-y-4">
                  {metadata?.email && <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><Mail className="w-4 h-4 text-slate-400" /><span className="text-xs font-bold text-slate-700">{metadata.email}</span></div>}
                  {metadata?.phone && <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><Phone className="w-4 h-4 text-slate-400" /><span className="text-xs font-bold text-slate-700">{metadata.phone}</span></div>}
                  {metadata?.location && <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"><MapPin className="w-4 h-4 text-slate-400" /><span className="text-xs font-bold text-slate-700">{metadata.location}</span></div>}
                </div>
              </section>
              {metadata?.experience && metadata.experience.length > 0 && (
                <section>
                  <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Career History</h3>
                  <div className="space-y-6">
                    {metadata.experience.map((exp, i) => (
                      <div key={i} className="relative pl-6 border-l border-slate-200">
                        <div className="absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full bg-indigo-500" />
                        <p className="text-xs font-black text-slate-900 uppercase">{exp.title}</p>
                        <p className="text-[10px] font-bold text-indigo-500">{exp.company}</p>
                        <p className="text-[9px] font-black text-slate-400 uppercase">{exp.duration}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
          <main className="flex-grow overflow-y-auto p-12 bg-white custom-scrollbar">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8"><SearchCode className="w-3.5 h-3.5 inline mr-2" /> Resume Raw Content</h3>
            <pre className="whitespace-pre-wrap font-mono text-sm text-slate-600 bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 leading-relaxed shadow-inner">{resume.content}</pre>
          </main>
        </div>
      </div>
    </div>
  );
};

const analyzeIndividualResume = async (jobDescription: string, resume: ResumeData, companyName: string, jobTitle: string): Promise<RankingResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-3-flash-preview"; 
  const prompt = `Analyze this resume for the position: ${jobTitle} at ${companyName}.\nJob Description: ${jobDescription}\nResume Content: ${resume.content}\n\nTask: Extract candidate ID info (name/email) and perform semantic match analysis.\n\nReturn JSON: {\n  "name": "Full Name",\n  "email": "Email Address",\n  "resumeId": "${resume.id}",\n  "score": 0-100,\n  "detailedScores": { "toneStyle": { "score": 0-100, "label": "string" }, "content": { "score": 0-100, "label": "string" }, "structure": { "score": 0-100, "label": "string" }, "skills": { "score": 0-100, "label": "string" } },\n  "atsScore": 0-100,\n  "atsChecklist": [{ "type": "success|improvement", "text": "string" }],\n  "matchedSkills": ["string"],\n  "missingSkills": ["string"],\n  "justification": "Detailed string",\n  "recommendation": "Strong Match|Potential Match|Not Recommended",\n  "metadata": {\n    "email": "string",\n    "phone": "string",\n    "location": "string",\n    "education": [{ "degree": "string", "institution": "string", "year": "string" }],\n    "experience": [{ "title": "string", "company": "string", "duration": "string", "summary": "string" }],\n    "topSkills": ["string"]\n  }\n}`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { temperature: 0.1, responseMimeType: "application/json", thinkingConfig: { thinkingBudget: 0 } }
  });
  return JSON.parse(response.text || '{}');
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [currentView, setCurrentView] = useState<'form' | 'results'>('form');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [results, setResults] = useState<RankingResult[]>([]);
  const [selectedResumeForView, setSelectedResumeForView] = useState<{resume: ResumeData, result: RankingResult} | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [processing, setProcessing] = useState<ProcessingState & { currentCount: number; totalCount: number; parsingId?: string }>({ isAnalyzing: false, error: null, progress: 0, currentCount: 0, totalCount: 0 });

  useEffect(() => {
    if (notification) { const t = setTimeout(() => setNotification(null), 4000); return () => clearTimeout(t); }
  }, [notification]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files; if (!files) return;
    setProcessing(p => ({ ...p, error: null }));
    const newResumes: ResumeData[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split('.').pop()?.toLowerCase();
        if (!ext || !SUPPORTED_FORMATS.includes(ext)) { setProcessing(p => ({ ...p, error: `Invalid format: ${file.name}` })); continue; }
        setProcessing(p => ({ ...p, isAnalyzing: true, parsingId: `Extracting ${file.name}...` }));
        let content = '';
        if (ext === 'pdf') {
          const ab = await file.arrayBuffer(); const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
          for (let i = 1; i <= pdf.numPages; i++) { const page = await pdf.getPage(i); const tc = await page.getTextContent(); content += tc.items.map((it: any) => it.str).join(' ') + '\n'; }
        } else if (ext === 'docx') { content = (await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value; }
        else { content = await file.text(); }
        if (content.trim().length < MIN_CONTENT_LENGTH) { setProcessing(p => ({ ...p, error: `File too short: ${file.name}` })); continue; }
        newResumes.push({ id: crypto.randomUUID(), name: file.name.split('.')[0], fileName: file.name, content });
      }
      setResumes(p => [...p, ...newResumes]);
    } catch (err: any) { setProcessing(p => ({ ...p, error: `Upload error: ${err.message}` })); }
    finally { setProcessing(p => ({ ...p, isAnalyzing: false, parsingId: undefined })); }
  };

  const runAnalysis = async () => {
    if (resumes.length === 0 || !jobDescription.trim()) { setProcessing(p => ({ ...p, error: "Please fill all fields and upload resumes." })); return; }
    setProcessing({ isAnalyzing: true, error: null, progress: 0, currentCount: 0, totalCount: resumes.length });
    const batchSize = 3; const allResults: RankingResult[] = [];
    try {
      for (let i = 0; i < resumes.length; i += batchSize) {
        const batch = resumes.slice(i, i + batchSize);
        setProcessing(p => ({ ...p, progress: Math.round((i / resumes.length) * 100), currentCount: Math.min(i + batchSize, resumes.length), parsingId: `Processing Batch ${Math.floor(i / batchSize) + 1}...` }));
        const batchRes = await Promise.all(batch.map(r => analyzeIndividualResume(jobDescription, r, companyName, jobTitle)));
        allResults.push(...batchRes);
      }
      setResults(allResults.sort((a, b) => b.score - a.score));
      setCurrentView('results'); setProcessing(p => ({ ...p, isAnalyzing: false, progress: 100 }));
    } catch (err: any) { setProcessing(p => ({ ...p, isAnalyzing: false, error: "Analysis failed. Batch parallel error." })); }
  };

  const handleBulkAction = (a: string) => {
    setNotification({ message: `${selectedCandidateIds.length} candidates ${a === 'pool' ? 'pooled' : a === 'reject' ? 'rejected' : 'exported'}!`, type: a === 'reject' ? 'info' : 'success' });
    setSelectedCandidateIds([]);
  };

  // Fix: Implemented toggleCandidateSelection function
  const toggleCandidateSelection = (id: string) => {
    setSelectedCandidateIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Fix: Implemented toggleSelectAll function
  const toggleSelectAll = () => {
    if (results.length === 0) return;
    if (selectedCandidateIds.length === results.length) {
      setSelectedCandidateIds([]);
    } else {
      setSelectedCandidateIds(results.map(r => r.resumeId));
    }
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-indigo-200/40 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] bg-pink-100/50 rounded-full blur-[120px] animate-pulse delay-700" />
      <div className="w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-2xl p-12 relative z-10 border border-white flex flex-col items-center">
        <div className="flex flex-col items-center mb-10">
          <div className="bg-indigo-600 p-5 rounded-[2rem] shadow-2xl mb-8"><BrainCircuit className="w-10 h-10 text-white" /></div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">ResuMind</h1>
          <p className="text-xs font-black text-slate-400 mt-3 uppercase tracking-widest">Neural Talent Ranking</p>
        </div>
        <div className="w-full flex bg-slate-100 p-1.5 rounded-[2rem] mb-10">
          <button onClick={() => setAuthMode('login')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}>System Login</button>
          <button onClick={() => setAuthMode('signup')} className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${authMode === 'signup' ? 'bg-white text-indigo-600 shadow-lg' : 'text-slate-400'}`}>Agent Signup</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setIsAuthenticated(true); }} className="w-full space-y-5">
          {authMode === 'signup' && (
            <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Full Name</label>
              <div className="relative"><User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" required placeholder="John Doe" className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold focus:ring-4 ring-indigo-500/10 outline-none" />
              </div></div>
          )}
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Email Address</label>
            <div className="relative"><Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input type="email" required placeholder="recruiter@company.com" className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold focus:ring-4 ring-indigo-500/10 outline-none" />
            </div></div>
          <div><label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-2">Access Key</label>
            <div className="relative"><Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input type="password" required placeholder="••••••••" className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-5 text-sm font-bold focus:ring-4 ring-indigo-500/10 outline-none" />
            </div></div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
            {authMode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />} {authMode === 'login' ? 'Initialize Workspace' : 'Create Agent Account'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f1f5f9] text-slate-800 font-sans overflow-hidden">
      {notification && (
        <div className="fixed top-8 right-8 z-[300] bg-indigo-600 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-8">
          <PartyPopper className="w-6 h-6" /> <span className="text-xs font-black uppercase">{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50"><X className="w-4 h-4" /></button>
        </div>
      )}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-8 flex items-center gap-3"><div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg"><BrainCircuit className="w-6 h-6 text-white" /></div><h1 className="text-xl font-black text-slate-900 uppercase">ResuMind</h1></div>
        <nav className="flex-grow px-4 space-y-2 mt-4">
          <button onClick={() => setCurrentView('form')} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${currentView === 'form' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}><LayoutDashboard className="w-5 h-5" /><span className="text-sm font-bold">Evaluator</span></button>
          <button onClick={() => results.length > 0 && setCurrentView('results')} disabled={results.length === 0} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all ${currentView === 'results' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'} disabled:opacity-30`}><ListOrdered className="w-5 h-5" /><span className="text-sm font-bold">Results</span></button>
        </nav>
        <AdminCard onSignOut={() => setIsAuthenticated(false)} />
      </aside>
      <div className="flex-grow flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto relative">
        {currentView === 'form' ? (
          <div className="p-12 max-w-4xl mx-auto w-full flex flex-col items-center">
            <h2 className="text-[3.5rem] font-medium text-slate-400 text-center leading-tight mb-4">Parallel Neural <br /> Evaluation</h2>
            <p className="text-lg text-slate-400 mb-16 font-medium">Analyze candidate batches in seconds</p>
            <div className="w-full space-y-10 max-w-2xl bg-white p-12 rounded-[3.5rem] shadow-sm border border-slate-100">
              <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Company</label><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="e.g. OpenAI" className="w-full bg-[#f1f5f9] rounded-2xl py-5 px-6 outline-none" /></div>
              <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Job Title</label><input type="text" value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. AI Scientist" className="w-full bg-[#f1f5f9] rounded-2xl py-5 px-6 outline-none" /></div>
              <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Job Description</label><textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} placeholder="Paste core requirements..." className="w-full bg-[#f1f5f9] rounded-2xl py-5 px-6 h-40 outline-none" /></div>
              <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Upload Resumes</label>
                <div className="relative"><input type="file" multiple onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" /><div className="w-full bg-[#f1f5f9] border-2 border-dashed border-slate-200 rounded-3xl py-10 flex flex-col items-center gap-4 hover:border-indigo-200 transition-all"><FileUp className="w-8 h-8 text-indigo-500" /><span className="text-slate-400">PDF, DOCX, TXT</span></div></div>
                {resumes.length > 0 && <div className="grid gap-2 max-h-40 overflow-y-auto mt-4">{resumes.map(r => (<div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100"><span className="text-xs font-bold text-slate-700 truncate">{r.fileName}</span><button onClick={() => setResumes(p => p.filter(it => it.id !== r.id))}><Trash2 className="w-3.5 h-3.5 text-rose-500" /></button></div>))}</div>}
              </div>
              <button onClick={runAnalysis} disabled={processing.isAnalyzing} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center justify-center gap-3">
                {processing.isAnalyzing ? <><Loader2 className="w-5 h-5 animate-spin" /> Batch Evaluation {processing.currentCount}/{processing.totalCount}</> : <><Zap className="w-5 h-5" /> Begin Batch Analysis</>}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-10 space-y-12 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between bg-white rounded-3xl p-6 shadow-sm border sticky top-4 z-50">
              <div className="flex items-center gap-8"><button onClick={() => setCurrentView('form')} className="text-[10px] font-black text-slate-400 uppercase"><ChevronLeft className="w-3 h-3 inline mr-1" /> Back</button>
                <button onClick={toggleSelectAll} className="text-[10px] font-black uppercase text-indigo-600 flex items-center gap-2">{selectedCandidateIds.length === results.length ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />} {selectedCandidateIds.length === results.length ? 'Deselect All' : 'Select All Reports'}</button>
              </div>
              <div className="flex gap-4"><button onClick={() => setResults([])} className="text-[10px] font-black text-rose-500 uppercase"><Trash2 className="w-4 h-4 inline mr-1" /> Clear</button><span className="text-[10px] font-black text-slate-500 uppercase">{results.length} Scored</span></div>
            </div>
            {results.map((c) => (
              <div key={c.resumeId} className={`bg-white rounded-[3.5rem] p-12 shadow-sm border relative overflow-hidden group transition-all ${selectedCandidateIds.includes(c.resumeId) ? 'border-indigo-400 ring-4 ring-indigo-50 bg-indigo-50/5' : 'border-slate-100'}`}>
                <button onClick={() => toggleCandidateSelection(c.resumeId)} className={`absolute top-10 left-10 p-2.5 rounded-2xl transition-all ${selectedCandidateIds.includes(c.resumeId) ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-300'}`}>{selectedCandidateIds.includes(c.resumeId) ? <CheckSquare className="w-7 h-7" /> : <Square className="w-7 h-7" />}</button>
                <div className="flex items-center justify-between mb-12 pl-20">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Candidate Report</h3>
                    <div className="flex items-center gap-6 mt-4">
                      <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center"><User className="w-4 h-4 text-indigo-600" /></div><p className="text-sm font-black text-slate-800">{c.name}</p></div>
                      {c.email && <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center"><Mail className="w-4 h-4 text-slate-400" /></div><p className="text-xs font-bold text-slate-500">{c.email}</p></div>}
                    </div>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-xl"><MoreVertical className="text-slate-400 w-5 h-5" /></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="flex flex-col items-center"><ScoreArc score={c.score} /><div className="w-full space-y-4 mt-12">{Object.entries(c.detailedScores).map(([k, s]: [string, any]) => (<div key={k} className="flex justify-between p-4 bg-slate-50 rounded-2xl"><span className="text-xs font-black text-slate-700 uppercase">{k.replace(/([A-Z])/g, ' $1')}</span><span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${s.label === 'Strong' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s.label} ({s.score})</span></div>))}</div></div>
                  <div className="space-y-8">
                    <div className="bg-[#f0fdf4] rounded-[3rem] p-10 border border-emerald-50"><h4 className="text-xl font-black text-slate-900 uppercase mb-6 flex items-center gap-4"><Target className="w-6 h-6 text-emerald-600" /> ATS Optimization: {c.atsScore}/100</h4>
                      <div className="grid gap-3">{c.atsChecklist.map((it, i) => (<div key={i} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-emerald-50">{it.type === 'success' ? <ThumbsUp className="w-4 h-4 text-emerald-500" /> : <Zap className="w-4 h-4 text-amber-500" />}<p className="text-[11px] font-black text-slate-700 uppercase">{it.text}</p></div>))}</div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-3xl"><h5 className="text-[10px] font-black text-slate-400 uppercase mb-4">Neural Justification</h5><p className="text-xs font-medium text-slate-600 leading-relaxed">{c.justification}</p></div>
                    <button onClick={() => { setSelectedResumeForView({ resume: resumes.find(r => r.id === c.resumeId)!, result: c }); setIsModalOpen(true); }} className="w-full flex items-center justify-between p-5 bg-white border border-indigo-100 rounded-2xl text-[10px] font-black text-indigo-600 uppercase"><span><Maximize2 className="w-4 h-4 inline mr-2" /> View Detailed Neural Parsing</span><ArrowUpRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedCandidateIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[150] bg-slate-900 text-white rounded-[2.5rem] p-4 flex items-center gap-4 shadow-2xl border border-white/10">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black">{selectedCandidateIds.length}</div>
          <div className="flex gap-2">
            <button onClick={() => handleBulkAction('pool')} className="px-5 py-3.5 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase"><UserCheck2 className="w-4 h-4 inline mr-2" /> Pool</button>
            <button onClick={() => handleBulkAction('reject')} className="px-5 py-3.5 bg-white/5 hover:bg-rose-500/20 rounded-2xl text-[10px] font-black uppercase text-rose-400"><XCircle className="w-4 h-4 inline mr-2" /> Reject</button>
            <button onClick={() => setSelectedCandidateIds([])} className="p-3 text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
          </div>
        </div>
      )}
      <ResumeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} resume={selectedResumeForView?.resume ?? null} metadata={selectedResumeForView?.result?.metadata} />
    </div>
  );
};

export default App;
