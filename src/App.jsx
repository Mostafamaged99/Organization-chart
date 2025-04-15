import { Suspense, lazy } from "react";
import "./App.css";

const OrgChart = lazy(() => import("./pages/OrgChart"));

function App() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <OrgChart />
      </Suspense>
    </>
  );
}

export default App;


