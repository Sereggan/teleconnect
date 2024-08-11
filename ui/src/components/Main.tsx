import Navbar from "./Navbar";
import TariffCard from "./TariffCard";
import { tariffs } from "./dummyData";

function Main() {
  return (
    <>
      <Navbar />
      <p>List of tariffs:</p>
      <div>
        {tariffs.map((t) =>
          t.isActive ? <TariffCard key={t.id} tariff={t} /> : null
        )}
      </div>
    </>
  );
}

export default Main;
