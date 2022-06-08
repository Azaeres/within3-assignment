export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Place = {
  __typename?: 'Place';
  latitude?: Maybe<Scalars['String']>;
  longitude?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  stateAbbreviation?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  fetchZipCode?: Maybe<ZipCode>;
};


export type QueryFetchZipCodeArgs = {
  countryCode?: InputMaybe<Scalars['String']>;
  zipCode?: InputMaybe<Scalars['String']>;
};

export type ZipCode = {
  __typename?: 'ZipCode';
  country?: Maybe<Scalars['String']>;
  countryAbbreviation?: Maybe<Scalars['String']>;
  places?: Maybe<Array<Maybe<Place>>>;
  postCode?: Maybe<Scalars['String']>;
};

export type ZipCodeQueryVariables = Exact<{
  zipCode?: InputMaybe<Scalars['String']>;
  countryCode?: InputMaybe<Scalars['String']>;
}>;


export type ZipCodeQuery = { __typename?: 'Query', fetchZipCode?: { __typename?: 'ZipCode', postCode?: string | null, country?: string | null, countryAbbreviation?: string | null, places?: Array<{ __typename?: 'Place', name?: string | null, state?: string | null, stateAbbreviation?: string | null, longitude?: string | null, latitude?: string | null } | null> | null } | null };
