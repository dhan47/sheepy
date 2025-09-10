import { BibleVerseLearning } from "./components/BibleVerseLearning";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto h-screen">
        <BibleVerseLearning />
      </div>
      <Toaster />
    </div>
  );
}