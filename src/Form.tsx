import Form from "@rjsf/mui";
import { useEffect, useState } from "react";
import { uiSchema } from "./schema";

import validator from "@rjsf/validator-ajv8";

type CoinFromCombinationType = {
  combinations: { combo: string }[];
  selectedWallet?: string;
  selectedCoin?: string;
};

const getCoinFromCombination = ({
  combinations,
  selectedWallet,
}: CoinFromCombinationType): string[] => {
  const filteredCombinations = selectedWallet
    ? combinations.filter((d) => d.combo.split("-")[1] === selectedWallet)
    : combinations;

  const coins = filteredCombinations.map((c) => c.combo.split("-")[0]);

  return [...new Set(coins)];
};

const getWalletFromCombination = ({
  combinations,
  selectedCoin,
}: CoinFromCombinationType): string[] => {
  const filteredCombinations = selectedCoin
    ? combinations.filter((d) => d.combo.split("-")[0] === selectedCoin)
    : combinations;

  const wallets = filteredCombinations.map((c) => c.combo.split("-")[1]);

  return [...new Set(wallets)];
};

const generateSchema = (
  combinations: CoinFromCombinationType["combinations"]
) => {
  const coins = getCoinFromCombination({ combinations });
  const wallets = getWalletFromCombination({ combinations });

  const combinationCoins = coins.map((coin) => ({
    if: {
      properties: {
        coin: { const: coin },
      },
    },
    then: {
      properties: {
        wallet: {
          enum: getWalletFromCombination({ selectedCoin: coin, combinations }),
        },
      },
      required: ["wallet"],
    },
  }));

  const combinationWallets = wallets.map((wallet) => ({
    if: {
      properties: {
        wallet: { const: wallet },
      },
    },
    then: {
      properties: {
        coin: {
          enum: getCoinFromCombination({
            selectedWallet: wallet,
            combinations,
          }),
        },
      },
      required: ["coin"],
    },
  }));

  return {
    title: "Schema wallet-coin",
    description: "Simple example schema.",
    type: "object",
    properties: {
      coin: { enum: coins },
      wallet: { enum: wallets },
    },
    allOf: [...combinationCoins, ...combinationWallets],
  };
};

type Props = {
  combinations: { combo: string }[];
};

const FormWalletCoin = ({ combinations }: Props) => {
  const [schema, setSchema] = useState({});

  useEffect(() => {
    const generatedSchema = generateSchema(combinations);
    setSchema(generatedSchema);
  }, [combinations]);

  return (
    <div>
      <Form
        liveValidate
        schema={schema}
        uiSchema={uiSchema}
        validator={validator}
      />
    </div>
  );
};

export default FormWalletCoin;
