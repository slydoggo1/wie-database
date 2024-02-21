import { EngineerCardDTO } from '../dto/engineer.dto';
import admin from 'firebase-admin';
import { TopicsDTO } from '../dto/search.dto';
import Config from '../configs/globalConfig';

const algoliasearch = require('algoliasearch');
const client = algoliasearch(Config.ALGOLIA_APP_ID, Config.ALGOLIA_ADMIN_API);
const index = client.initIndex(Config.ALGOLIA_ENGINEER_INDEX);

/**
 * Helper function to generate filter string for algolia search
 * @param specialisation
 * @param interest
 * @returns a filtered string
 */
export function generateFilterString(specialisation: string[], interest: string[]): string {
  let filterString: string = '';

  // get length of specialisation and interest
  const specialisationLength = specialisation.length;
  const interestLength = interest.length;

  // for each specialisation, add to filter string
  for (let i = 0; i < specialisationLength; i++) {
    //if specialisation[i] has spaces put it in quotes
    if (/\s/.test(specialisation[i])) {
      filterString += `topics:"${specialisation[i]}"`;
    } else {
      filterString += `topics:${specialisation[i]}`;
    }
    if (i < specialisationLength - 1) {
      filterString += ' OR ';
    }
  }

  // if both specialisation and interest are not empty, add OR for the inbetween connection
  if (specialisationLength > 0 && interestLength > 0) {
    filterString += ' AND ';
  }

  // for each interest, add to filter string
  for (let i = 0; i < interestLength; i++) {
    //if interest[i] has spaces put it in quotes
    if (/\s/.test(interest[i])) {
      filterString += `events:"${interest[i]}"`;
    } else filterString += `events:${interest[i]}`;
    if (i < interestLength - 1) {
      filterString += ' OR ';
    }
  }

  return filterString;
}

/**
 * search function for algolia
 * @param generalSearch
 * @param specialisations
 * @param interests
 * @param pageNumberInt
 * @param limitInt
 * @returns { status: number; message: string; totalPages?: number; engineers?: EngineerCardDTO[]} 200 if successful
 * @throws 500 if page number and limit are not defined
 * @throws 500 if an unknown error occurs
 */
export async function search(
  generalSearch: string,
  specialisations: string[],
  interests: string[],
  pageNumberInt: number,
  limitInt: number,
): Promise<{
  status: number;
  message: string;
  totalPages?: number;
  engineers?: EngineerCardDTO[];
}> {
  try {
    let engineers: EngineerCardDTO[] = [];
    let totalPages: number = 0;

    if (isNaN(pageNumberInt) || isNaN(limitInt)) {
      return { status: 500, message: 'Page number and limit are not defined' };
    }

    // if both specialisation and interest are empty
    if (specialisations.length === 0 && interests.length === 0) {
      await index
        .search(generalSearch, {
          page: pageNumberInt,
          hitsPerPage: limitInt,
        })
        .then(({ hits, nbPages }: any) => {
          hits.forEach((hit: any) => {
            const engineerDto: EngineerCardDTO = {
              uid: hit.objectID,
              name: hit.name,
              location: hit.location,
              specialisation: hit.topics,
              position: hit.position,
              organisation: hit.organisation,
              imageURL: hit.imageURL,
            };
            engineers.push(engineerDto);
            totalPages = nbPages;
          });
        });

      return { status: 200, message: 'Successful search', totalPages: totalPages, engineers: engineers };
    } else {
      // if either specialisation or interest is not empty
      const filterString = generateFilterString(specialisations, interests);

      await index
        .search(generalSearch, {
          filters: filterString,
          page: pageNumberInt,
          hitsPerPage: limitInt,
        })
        .then(({ hits, nbPages }: any) => {
          hits.forEach((hit: any) => {
            const engineerDto: EngineerCardDTO = {
              uid: hit.objectID,
              name: hit.name,
              location: hit.location,
              specialisation: hit.topics,
              position: hit.position,
              organisation: hit.organisation,
              imageURL: hit.imageURL,
            };
            engineers.push(engineerDto);
            totalPages = nbPages;
          });
        });
    }

    return { status: 200, message: 'Successful search', totalPages: totalPages, engineers: engineers };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

/**
 * get all topics available in the database
 * @returns { status: number; message: string; topics?: TopicsDTO[]} 200 if successful
 * @throws 404 if no topics found in the database collection
 * @throws 500 if an unknown error occurs
 */
export async function getAllTopics(): Promise<{ status: number; message: string; topics?: TopicsDTO[] }> {
  try {
    let topics: TopicsDTO[] = [];

    // get all documents from firebase topics collection
    const topicsSnapshot = await admin.firestore().collection('topics').get();
    if (topicsSnapshot.empty) {
      return { status: 404, message: 'No topics found in the database collection' };
    }

    // loop through each document and add to topics array
    topicsSnapshot.forEach((doc) => {
      const topicDto: TopicsDTO = {
        topicDBName: doc.id,
        topicDisplayName: doc.data().topicName,
      };
      topics.push(topicDto);
    });

    return { status: 200, message: 'Successful get all topics', topics: topics };
  } catch (err) {
    if (err instanceof Error) {
      return { status: 500, message: err.message };
    } else {
      return { status: 500, message: 'An unknown error occurred' };
    }
  }
}

module.exports = {
  search,
  getAllTopics,
};
