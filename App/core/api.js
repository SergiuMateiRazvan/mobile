
export const apiUrl = 'http://192.168.0.103:3000';
export const wsUrl = 'ws://192.168.0.103:3000';
const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const buildHeaders = () => {
  const headers = {...defaultHeaders};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const defaultIssue = { issue: [{ error: 'Unexpected error' }]};

export const getTasks = () =>
  withErrorHandling(
    fetch(`${apiUrl}/tasks`, {
      method: 'GET',
      headers: buildHeaders(),
    })
  );

export const putTask = task =>
  withErrorHandling(
    fetch(`${apiUrl}/tasks/task`, {
      method: 'POST',
      mode: 'cors',
      headers: buildHeaders(),
      body: JSON.stringify(task),
    })
  );

export const login = (username, password) =>
  withErrorHandling(
    fetch(`${apiUrl}/login`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({username, password}),
    })
  );

let token='';

export const setToken = value => {
  token = value;
};
export const getToken = () => token;


const withErrorHandling = fetchPromise =>
  fetchPromise
    .then(response => Promise.all([response.ok, response.json()]))
    .then(([responseOk, responseJson]) => {
      if (responseOk) {
        return responseJson;
      }
      const message = (responseJson || defaultIssue).issue
        .map(it => it.error)
        .join('\n');
      throw new Error(message);
    });
