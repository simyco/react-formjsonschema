import "./App.css";
import FormWalletCoin from "./Form";

function App() {
  const combinations = [
    { combo: "CAR-BTC Wallet" },
    { combo: "CAR-ETH Wallet" },
    { combo: "CAR-DOGE Wallet" },
    { combo: "AKS-BTC Wallet" },
    { combo: "ATM-BTC Wallet" },
    { combo: "KNC-BUSD Wallet" },
  ];
  return (
    <div className="m-10">
      <FormWalletCoin combinations={combinations} />
    </div>
  );
}

export default App;
