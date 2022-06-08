import { updateHistory } from "./components/ZipCodeForm";

const mockHistoryItem = {
  fetchZipCode: {
    __typename: "ZipCode",
    postCode: "90210",
    country: "United States",
    countryAbbreviation: "US",
    places: [
      {
        __typename: "Place",
        name: "Beverly Hills",
        state: "California",
        stateAbbreviation: "CA",
        longitude: "-118.4065",
        latitude: "34.0901",
      },
    ],
  },
};

it("updateHistory adds item", () => {
  const newHistory = updateHistory([], mockHistoryItem);
  expect(newHistory.length).toEqual(1);
});

it("updateHistory is capped", () => {
  const newHistory = updateHistory(
    [
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
      mockHistoryItem,
    ],
    mockHistoryItem
  );
  // Max num of history items is 5, 
  // but the first item is the current result,
  // so the total expected is 6.
  expect(newHistory.length).toEqual(6);
});
