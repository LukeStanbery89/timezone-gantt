import TimezoneGantt from '@/components/TimezoneGantt'

function App() {
  return (
    <div className="app">
      <header>
        <h1>Timezone Gantt Chart</h1>
        <p>Visualize time across multiple timezones</p>
      </header>
      <main>
        <TimezoneGantt />
      </main>
    </div>
  )
}

export default App