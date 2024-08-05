import { useState } from "react";
import "./App.css";
import { Button } from "@mui/material";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <p>Hello {count})</p>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setCount((c) => c + 1)}
      >
        Click here!
      </Button>
    </>
  );
}

export default App;
