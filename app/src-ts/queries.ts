import gql from 'graphql-tag';


export const getBscStatsQuery = gql`
  query getBscStats($address: String) {
    pairs(
      where: {id: $address }
    ) {
      id
      volumeUSD
      reserveUSD
    }
  }
`;