import { Button } from "@/components/ui/button"
import { ModeToggle } from "./components/theme"

function App() {

  return (
    <>
      
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
      <ModeToggle />
      <Button variant="secondary">Click me</Button>
    </>
  )
}

export default App
