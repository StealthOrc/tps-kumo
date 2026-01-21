import { getTPS } from '@/data/tps'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  const tps = getTPS()
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <h1>TPS Kumo</h1>
      <p>TPS Kumo is a tool for monitoring TPS of a Hytale Server.</p>
      <p>10s</p>
      <div className='flex gap-4'>
        {tps.then((tps) => {
          return tps.map((t: { id: number; timestamp: Date; tps: number }) => (
            <span className={ `${t.tps > 5 ? (t.tps > 15 ? 'hover:bg-green-500 bg-green-600' : 'hover:bg-orange-500 bg-orange-600') : 'hover:bg-red-500 bg-red-600'} h-15 w-7 rounded-xl`} key={t.id}/>
          ))
        })}
      </div>
      <p>5min</p>
      <div className='flex gap-4'>
        {tps.then((tps) => {
          return tps.map((t: { id: number; timestamp: Date; tps: number }) => (
            <span className={ `${t.tps > 5 ? (t.tps > 15 ? 'hover:bg-green-500 bg-green-600' : 'hover:bg-orange-500 bg-orange-600') : 'hover:bg-red-500 bg-red-600'} h-15 w-7 rounded-xl`} key={t.id}/>
          ))
        })}
      </div>
      <p>10min</p>
      <div className='flex gap-4'>
        {tps.then((tps) => {
          return tps.map((t: { id: number; timestamp: Date; tps: number }) => (
            <span className={ `${t.tps > 5 ? (t.tps > 15 ? 'hover:bg-green-500 bg-green-600' : 'hover:bg-orange-500 bg-orange-600') : 'hover:bg-red-500 bg-red-600'} h-15 w-7 rounded-xl`} key={t.id}/>
          ))
        })}
      </div>
    </div>
  )
}