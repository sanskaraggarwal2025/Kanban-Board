import Sidebar from "./components/Sidebar";
import Board from "./components/Board";
function App() {

  return (
      <>
      <div className="h-full">
        <div className="md:flex h-full">
        <Sidebar />
        <Board />

        </div>
      </div>
        </>
  )
}

export default App
