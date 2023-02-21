import Form from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
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
}: CoinFromCombinationType) => {
  if (selectedWallet) {
    return [
      ...new Set(
        combinations
          .filter((d) => d.combo.split("-")[1] === selectedWallet)
          .map((c) => {
            return c.combo.split("-")[0];
          })
      ),
    ];
  }
  return [
    ...new Set(
      combinations.map((c) => {
        return c.combo.split("-")[0];
      })
    ),
  ];
};
const getWalletFromCombination = ({
  combinations,
  selectedCoin,
}: CoinFromCombinationType) => {
  if (selectedCoin) {
    return [
      ...new Set(
        combinations
          .filter((d) => d.combo.split("-")[0] === selectedCoin)
          .map((c) => {
            return c.combo.split("-")[1];
          })
      ),
    ];
  }
  return [
    ...new Set(
      combinations.map((c) => {
        return c.combo.split("-")[1];
      })
    ),
  ];
};

type Props = {
  combinations: { combo: string }[];
};

const FormWalletCoin = ({ combinations }: Props) => {
  const [schema, setSchema] = useState<RJSFSchema>({});

  useEffect(() => {
    const coins = getCoinFromCombination({ combinations: combinations });
    const wallets = getWalletFromCombination({ combinations: combinations });
    const schema: RJSFSchema = {
      title: "Schema wallet-coin",
      description: "Simple example schema.",
      type: "object",
      properties: {
        coin: {
          enum: coins,
        },
        wallet: {
          enum: wallets,
        },
      },
      allOf: [],
    };

    const combinationCoins = coins.map((coin) => {
      return {
        if: {
          properties: {
            coin: {
              const: coin,
            },
          },
        },
        then: {
          properties: {
            wallet: {
              enum: getWalletFromCombination({
                selectedCoin: coin,
                combinations: combinations,
              }),
            },
          },
          required: ["wallet"],
        },
      };
    });

    const combinationWallets = wallets.map((wallet) => {
      return {
        if: {
          properties: {
            wallet: {
              const: wallet,
            },
          },
        },
        then: {
          properties: {
            coin: {
              enum: getCoinFromCombination({
                selectedWallet: wallet,
                combinations: combinations,
              }),
            },
          },
          required: ["coin"],
        },
      };
    });
    schema.allOf = [...combinationCoins, ...combinationWallets];
    console.log("schema", JSON.stringify(schema));
    setSchema(schema);
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
