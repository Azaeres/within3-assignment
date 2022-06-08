import React from "react";
import { ZipCode, ZipCodeQuery } from "types";

type ZipCodeDetailsProps = {
  data?: ZipCodeQuery;
  loading: boolean;
  error?: Error;
  history: ZipCodeQuery[];
};

export default function ZipCodeDetails({
  loading,
  error,
  history,
}: ZipCodeDetailsProps) {
  if (history.length) {
    return (
      <div className="zipcode-details">
        <div>
          <div className="history-list">
            {error && <div>Error :(</div>}
            {[...history].reverse().map((itemData, index) => {
              const zipCodeData = itemData.fetchZipCode;
              const key = `${zipCodeData?.postCode}-${zipCodeData?.countryAbbreviation}-${index}`;
              if (index === 0 && loading) {
                return <div key={key}>Loading...</div>;
              }

              return (
                <div className="history-item-container" key={key}>
                  <HistoryItem zipCodeData={itemData.fetchZipCode} />
                </div>
              );
            })}
          </div>
          <br />
          <br />
        </div>
      </div>
    );
  }

  return null;
}

type HistoryItemProps = {
  zipCodeData?: ZipCode | null;
};

function HistoryItem({ zipCodeData }: HistoryItemProps) {
  return (
    <div className="history-item">
      <div>Zip Code: {zipCodeData?.postCode}</div>
      <div>Country: {zipCodeData?.country}</div>
      <div>
        {zipCodeData?.places?.map((place) => {
          return (
            <div
              key={`${place?.name}-${place?.stateAbbreviation}-${place?.latitude}-${place?.longitude}`}
            >
              <div>
                {place?.name}, {place?.state}
              </div>
              <div>
                Location: {place?.latitude}, {place?.longitude}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
