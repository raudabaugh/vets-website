import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/exports';
import notes from '../tests/fixtures/notes.json';
import note from '../tests/fixtures/dischargeSummary.json';
import labsAndTests from '../tests/fixtures/labsAndTests.json';
import vitals from '../tests/fixtures/vitals.json';
import conditions from '../tests/fixtures/conditions.json';
import { IS_TESTING } from '../util/constants';
import vaccines from '../tests/fixtures/vaccines.json';
import vaccine from '../tests/fixtures/vaccine.json';

const apiBasePath = `${environment.API_URL}/my_health/v1`;

const headers = {
  'Content-Type': 'application/json',
};

const hitApi = runningUnitTest => {
  return (
    (environment.BUILDTYPE === 'localhost' && IS_TESTING) || runningUnitTest
  );
};

export const createSession = () => {
  return apiRequest(`${apiBasePath}/medical_records/session`, {
    method: 'POST',
    headers,
  });
};

/**
 * Helper function to create a delay
 */
const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Testable implementation.
 * @see {@link apiRequestWithRetry} for more information
 * @param {*} retryInterval how long to wait between requests
 * @param {*} apiRequestFunc the API function to call; can be mocked for tests
 * @returns
 */
export const testableApiRequestWithRetry = (
  retryInterval,
  apiRequestFunc,
) => async (path, options, endTime) => {
  try {
    return await apiRequestFunc(path, options);
  } catch (e) {
    const errorCode = e.errors && e.errors[0] && e.errors[0].code;

    // Check if the error code is 404 and if the retry time limit has not been reached
    if (errorCode === '404' && Date.now() < endTime) {
      await delay(retryInterval);
      return testableApiRequestWithRetry(retryInterval, apiRequestFunc)(
        path,
        options,
        endTime,
      );
    }

    // If error is not 404 or time limit exceeded, throw the error
    throw e;
  }
};

/**
 * Recursive function that will continue polling the provided API endpoint if it sends a 404 response.
 * At this time, we will only get a 404 if the patient record has not yet been created.
 * @param {String} path the API endpoint
 * @param {Object} options headers, method, etc.
 * @param {number} endTime the cutoff time to stop polling the path and simply return the error
 * @returns
 */
const apiRequestWithRetry = async (path, options, endTime) => {
  return testableApiRequestWithRetry(2000, apiRequest)(path, options, endTime);
};

export const getLabsAndTests = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/labs_and_tests`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(labsAndTests);
    }, 1000);
  });
};

export const getLabOrTest = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/labs_and_tests/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const result = labsAndTests.entry.find(lab => lab.id === id);
      resolve(result);
    }, 1000);
  });
};

export const getNotes = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/clinical_notes`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(notes);
    }, 1000);
  });
};

export const getNote = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/clinical_notes/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(note);
    }, 1000);
  });
};

export const getVitalsList = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vitals`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vitals);
    }, 1000);
  });
};

export const getConditions = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/conditions`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(conditions);
    }, 1000);
  });
};

export const getCondition = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/conditions/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      const condition = conditions.find(cond => cond.id === id);
      resolve(condition);
    }, 1000);
  });
};

export const getAllergies = async () => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/allergies`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

export const getAllergy = id => {
  return apiRequestWithRetry(
    `${apiBasePath}/medical_records/allergies/${id}`,
    { headers },
    Date.now() + 90000, // Retry for 90 seconds
  );
};

/**
 * Get a patient's vaccines
 * @returns list of patient's vaccines in FHIR format
 */
export const getVaccineList = runningUnitTest => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vaccines`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccines);
    }, 1000);
  });
};

/**
 * Get details for a single vaccine
 * @param {Long} id
 * @returns vaccine details in FHIR format
 */
export const getVaccine = (id, runningUnitTest) => {
  if (hitApi(runningUnitTest)) {
    return apiRequest(`${apiBasePath}/medical_records/vaccines/${id}`, {
      headers,
    });
  }
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(vaccine);
    }, 1000);
  });
};

/**
 * Get the VHIE sharing status of the current user.
 *
 * @returns JSON object containing consent_status, either OPT-IN or OPT-OUT
 */
export const getSharingStatus = () => {
  return apiRequest(`${apiBasePath}/health_records/sharing/status`, {
    headers,
  });
};

/**
 * Update the VHIE sharing status
 * @param {Boolean} optIn true to opt-in, false to opt-out
 */
export const postSharingUpdateStatus = (optIn = false) => {
  const endpoint = optIn ? 'optin' : 'optout';
  return apiRequest(`${apiBasePath}/health_records/sharing/${endpoint}`, {
    method: 'POST',
    headers,
  });
};
