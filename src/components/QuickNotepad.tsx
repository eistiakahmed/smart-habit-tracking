'use client';

import { useState, useEffect } from 'react';
import { FileText, Check } from 'lucide-react';

export default function QuickNotepad() {
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem('habit_tracker_quick_note');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem('habit_tracker_quick_note', val);
    setSaved(true);
  };

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden bg-slate-950/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
            <FileText className="w-4 h-4 text-sky-400" />
          </div>
          <h3 className="font-bold text-white text-sm tracking-tight font-sans">Quick Notepad</h3>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none font-sans">
          {saved ? (
            <span className="text-emerald-400 flex items-center gap-0.5">
              <Check className="w-3 h-3" /> Saved
            </span>
          ) : (
            <span>Autosaves</span>
          )}
        </div>
      </div>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Jot down notes, daily plans, or habit thoughts..."
        className="w-full h-32 bg-slate-950/50 border border-slate-900 focus:border-sky-500/40 rounded-xl p-3 outline-none transition-all text-slate-200 placeholder-slate-600 text-xs font-medium resize-none leading-relaxed font-sans"
      />
    </div>
  );
}
