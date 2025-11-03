import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, Calendar, Clock } from 'lucide-react';

/*
  ScheduleConfiguratorAdvanced.tsx
  ----------------------------------
  - Duração média sempre visível com odômetro animado
  - Agenda expansível com dias e time slots
  - Preview completo com cores por tipo de serviço
  - Micro-animações para interações
  - Responsivo para mobile e tablets
*/

type Slot = { time: string; available: boolean; };
type Day = { name: string; slots: Slot[]; };

const units = ['min', 'h', 'd', 'sem'];
const unitMultipliers = [1, 60, 60*24, 60*24*7];
const serviceColors: Record<string, string> = {
  mecanica: 'bg-red-500',
  limpeza: 'bg-green-500',
  tecnologia: 'bg-blue-500',
  construcao: 'bg-orange-500',
  manutencao: 'bg-indigo-500',
  saude: 'bg-pink-500'
};

export default function ScheduleConfiguratorAdvanced({ serviceType = 'tecnologia' }: { serviceType?: string }) {
  const [useSchedule, setUseSchedule] = useState(false);
  const [duration, setDuration] = useState(60);
  const [unitIndex, setUnitIndex] = useState(1);

  // Mock days and slots
  const days = useMemo(() => ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'].map(d => ({
    name: d,
    slots: Array.from({length: 6}).map((_, i) => ({ time: `${9+i*2}:00`, available: Math.random() > 0.2 }))
  })), []);

  const [availability, setAvailability] = useState<Record<string, Slot[]>>(() => {
    const initial: Record<string, Slot[]> = {};
    days.forEach(d => initial[d.name] = d.slots);
    return initial;
  });

  const increment = () => {
    const newValue = duration + unitMultipliers[unitIndex];
    if (newValue >= unitMultipliers[unitIndex+1] && unitIndex < units.length-1) {
      setDuration(newValue / unitMultipliers[unitIndex+1]);
      setUnitIndex(unitIndex+1);
    } else {
      setDuration(newValue);
    }
  };

  const decrement = () => {
    if(duration <= unitMultipliers[unitIndex] && unitIndex > 0){
      setUnitIndex(unitIndex-1);
      setDuration(Math.max(1, duration * unitMultipliers[unitIndex] / unitMultipliers[unitIndex-1]));
    } else {
      setDuration(Math.max(1, duration - unitMultipliers[unitIndex]));
    }
  };

  const toggleSlot = (dayName: string, time: string) => {
    setAvailability(prev => ({
      ...prev,
      [dayName]: prev[dayName].map(s => s.time === time ? { ...s, available: !s.available } : s)
    }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-10 bg-[--bg] text-[--text]">
      <div className="w-full max-w-4xl space-y-6">

        {/* Duração média */}
        <motion.div className={`p-6 rounded-3xl bg-[--bg-light]/20 backdrop-blur-xl border border-[--bg-light]/30 shadow-lg`}>
          <div className="flex items-center justify-center gap-4 mb-4">
            <Clock className="size-6 text-blue-400" />
            <span className="text-lg font-medium">Duração média do serviço</span>
          </div>
          <div className="flex items-center justify-center gap-6">
            <button onClick={decrement} className="px-4 py-2 rounded-lg bg-[--bg-light]/30 hover:bg-[--bg-light]/50 transition"><Minus className="size-5" /></button>
            <motion.div animate={{ scale: [1,1.1,1] }} className="text-3xl font-bold">{duration}</motion.div>
            <span className="text-xl font-medium">{units[unitIndex]}</span>
            <button onClick={increment} className="px-4 py-2 rounded-lg bg-[--bg-light]/30 hover:bg-[--bg-light]/50 transition"><Plus className="size-5" /></button>
          </div>
        </motion.div>

        {/* Habilitar agenda */}
        <motion.div layout className={`p-4 rounded-2xl cursor-pointer transition ${useSchedule ? 'bg-blue-600 text-white' : 'bg-[--bg-light]/10 text-[--text-muted]'}`} onClick={() => setUseSchedule(!useSchedule)}>
          <div className="flex items-center justify-between">
            <span>Utilizar agenda para este serviço?</span>
            <span>{useSchedule ? 'Sim' : 'Não'}</span>
          </div>
        </motion.div>

        {/* Agenda detalhada */}
        {useSchedule && (
          <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} transition={{duration:0.3}} className="space-y-6">
            {days.map(day => (
              <div key={day.name} className="rounded-2xl bg-[--bg-light]/10 border border-[--bg-light]/20 p-4 backdrop-blur-md">
                <div className="text-sm font-medium mb-2 flex items-center gap-2"><Calendar className="size-5 text-blue-400" />{day.name}</div>
                <div className="flex flex-wrap gap-2">
                  {availability[day.name].map(slot => (
                    <button key={slot.time} onClick={() => toggleSlot(day.name, slot.time)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${slot.available ? serviceColors[serviceType]+' text-white' : 'bg-[--bg-light]/30 text-[--text-muted]'} hover:scale-105`}>
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Preview completo */}
            <motion.div className="p-4 rounded-2xl bg-[--bg-light]/10 border border-[--bg-light]/20 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 mb-2"><Calendar className="size-5 text-blue-400" /><span className="text-sm font-medium">Preview da agenda</span></div>
              <div className="text-sm text-[--text-muted] space-y-1">
                {Object.entries(availability).map(([day, slots]) => {
                  const selectedSlots = slots.filter(s => s.available).map(s => s.time);
                  return selectedSlots.length > 0 ? <div key={day}><strong>{day}:</strong> {selectedSlots.join(', ')}</div> : null;
                })}
              </div>
            </motion.div>

          </motion.div>
        )}

      </div>
    </div>
  );
}