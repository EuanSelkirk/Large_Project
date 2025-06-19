import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center p-6 font-sans">
      <div className="flex justify-center gap-8 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img
            src={viteLogo}
            alt="Vite logo"
            className="h-24 w-24 hover:drop-shadow-lg transition duration-300"
          />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            alt="React logo"
            className="h-24 w-24 hover:drop-shadow-lg transition duration-300"
          />
        </a>
      </div>
      <h1 className="text-4xl font-bold mb-6">Vite + React</h1>
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-gray-300 shadow-md max-w-md mx-auto mb-6">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Edit{" "}
          <code className="bg-gray-100 px-1 py-0.5 rounded">src/App.tsx</code>{" "}
          and save to test HMR
        </p>
      </div>
      <p className="text-gray-500 text-sm">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
