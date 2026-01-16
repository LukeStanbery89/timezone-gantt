import TimezoneGantt from '@/components/TimezoneGantt'

function App() {
  return (
    <div className="min-h-screen">
      <header className="text-center mb-5 py-2.5">
        <h1 className="text-[1.8em] m-0 text-gray-800 font-semibold">Timezone Gantt Chart</h1>
      </header>
      <main>
        <TimezoneGantt />
      </main>
    </div>
  )
}

export default App