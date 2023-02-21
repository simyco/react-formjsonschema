import { RJSFSchema } from "@rjsf/utils";

export const uiSchema = {
  combinations: {
    items: {
      "ui:field": "layout",
      classNames: "flex",
      string1: {
        classNames: "form-field-half",
        onChange: {
          "$data/string1": {
            "ui:widget": "updater",
            "ui:options": {
              update: (val: any, formData: any) => {
                console.log(val, formData);
                return [
                  {
                    ...formData[0],
                    string1: val,
                  },
                  {
                    ...formData[1],
                    string2: val,
                  },
                ];
              },
            },
          },
        },
      },
    },
  },
  "ui:submitButtonOptions": {
    submitText: "Save",
    norender: false,
    props: {
      disabled: false,
      className: "btn btn-info",
    },
  },
};

// interface FormDataSchema {
//   foo?: string;
//   bar?: number;
// }
// type MySchema = JSONSchemaType<FormData>;

export const schema: RJSFSchema = {
  title: "Schema wallet-coin",
  description: "Simple example schema.",
  type: "object",
  properties: {
    coin: {
      enum: ["BTC", "ADC", "CAR"],
    },
    wallet: {
      enum: ["BTC Wallet", "ADC Wallet", "CAR Wallet", "USDT", "PIPPO"],
    },
  },
  allOf: [
    {
      if: {
        properties: {
          coin: {
            const: "CAR",
          },
        },
      },
      then: {
        properties: {
          wallet: {
            enum: ["USDT", "PIPPO"],
          },
        },
        required: ["wallet"],
      },
    },
    {
      if: {
        properties: {
          coin: {
            const: "ADC",
          },
        },
      },
      then: {
        properties: {
          wallet: {
            enum: ["BTC Wallet", "ADC Wallet", "CAR Wallet"],
          },
        },
        required: ["wallet"],
      },
    },
  ],
};
export const schema2: RJSFSchema = {
  title: "Schema wallet-coin",
  description: "Simple example schema.",
  type: "object",
  properties: {
    coin: { enum: ["CAR", "AKS"] },
    wallet: { enum: ["BTC Wallet", "ETH Wallet", "DOGE Wallet"] },
  },
  allOf: [
    {
      if: { properties: { coin: { const: "CAR" } } },
      then: {
        properties: {
          wallet: { enum: ["BTC Wallet", "ETH Wallet", "DOGE Wallet"] },
        },
        required: ["wallet"],
      },
    },
    {
      if: { properties: { coin: { const: "AKS" } } },
      then: {
        properties: { wallet: { enum: ["BTC Wallet"] } },
        required: ["wallet"],
      },
    },
    {
      if: { properties: { wallet: { const: "BTC Wallet" } } },
      then: {
        properties: { coin: { enum: ["CAR", "AKS"] } },
        required: ["coin"],
      },
    },
    {
      if: { properties: { wallet: { const: "ETH Wallet" } } },
      then: { properties: { coin: { enum: ["CAR"] } }, required: ["coin"] },
    },
    {
      if: { properties: { wallet: { const: "DOGE Wallet" } } },
      then: { properties: { coin: { enum: ["CAR"] } }, required: ["coin"] },
    },
  ],
};
