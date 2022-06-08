import React, { SyntheticEvent, useState } from "react";
import { useQuery } from "@apollo/client";
import { ZipCodeQuery, ZipCodeQueryVariables } from "types";
import { loader } from "graphql.macro";
import ZipCodeDetails from "./ZipCodeDetails";

const ZIP_CODE = loader("../zipCode.graphql");
const DEFAULT_COUNTRY_CODE = "us";
const MAX_NUM_HISTORY_ITEMS = 5;

export const updateHistory = (history: ZipCodeQuery[], newData: ZipCodeQuery): ZipCodeQuery[] => {
  const stack = [...history];
  stack.push(newData);
  const numItemsToRemove = stack.length - 1 - MAX_NUM_HISTORY_ITEMS;
  if (stack.length - 1 > MAX_NUM_HISTORY_ITEMS) stack.splice(0, numItemsToRemove);
  return stack;
};

export default function ZipCodeForm() {
  const [zipInput, setZipInput] = useState("");
  const [countryInput, setCountryInput] = useState(DEFAULT_COUNTRY_CODE);
  const [submitData, setSubmitData] = useState({
    dirty: false,
    zipCode: zipInput,
    countryCode: countryInput,
  });
  const [history, setHistory] = useState<ZipCodeQuery[]>([]);

  const { loading, error } = useQuery<
    ZipCodeQuery,
    ZipCodeQueryVariables
  >(ZIP_CODE, {
    skip: !submitData.dirty,
    variables: {
      zipCode: submitData.zipCode,
      countryCode: submitData.countryCode,
    },
    onCompleted: (data: ZipCodeQuery) => {
      const newHistory = updateHistory(history, data)
      setHistory(newHistory);
      setSubmitData({
        dirty: false,
        zipCode: zipInput,
        countryCode: countryInput,
      });
    },
  });

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();
    setSubmitData({
      dirty: true,
      zipCode: zipInput,
      countryCode: countryInput,
    });
  };

  const handleZipInputChange = (event: SyntheticEvent) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setZipInput(inputValue);
  };

  const handleCountryInputChange = (event: SyntheticEvent) => {
    const inputValue = (event.target as HTMLInputElement).value;
    setCountryInput(inputValue);
  };

  const handleClearHistory = () => {
    const lastItem = history[history.length - 1];
    const newHistory = history.length ? [lastItem] : [];
    setHistory(newHistory);
  };

  return (
    <div className="zipcode-form">
      <form onSubmit={handleSubmit}>
        <div className="zipcode-form-line">
          Zip Code:{" "}
          <input
            id="zip"
            name="zip"
            type="text"
            value={zipInput}
            onChange={handleZipInputChange}
            required
          />
        </div>
        <div className="zipcode-form-line">
          Country Code:{" "}
          <input
            id="country"
            name="country"
            type="text"
            minLength={2}
            value={countryInput}
            onChange={handleCountryInputChange}
            required
          />
        </div>
        <input type="submit" value="Look Up" />
      </form>
      <ZipCodeDetails
        loading={loading}
        error={error}
        history={history}
      />
      <button className="clear-history-button" onClick={handleClearHistory} disabled={history.length <= 1}>Clear History</button>
    </div>
  );
}
