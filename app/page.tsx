import BatteryLevelsCard from "@/components/battery/BatteryLevelsCard";
import { DateTime } from "luxon";
import Image from "next/image";

function Home() {
  return (
    <div className="mx-auto max-w-screen-lg space-y-6 p-6">
      <header className="flex items-center gap-4">
        <Image src="/sonnenlogo.png" alt="Sonnen" aria-hidden width={64} height={64} className="rounded-lg" />
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Dashboard Frontend Task</h1>
          <div className="flex flex-col md:gap-2 text-xs md:text-sm text-gray-600 md:flex-row md:items-center">
            <span>Made by Amr Elnaggar</span>
            <span className="hidden md:inline-block">•</span>
            <span>{DateTime.fromISO("2025-03-10").toLocaleString(DateTime.DATE_FULL).toString()}</span>
          </div>
        </div>
      </header>
      <section>
        <BatteryLevelsCard />
      </section>
      <footer className="text-sm text-gray-500">Sonnen {DateTime.now().year}</footer>
    </div>
  );
}

export default Home;
