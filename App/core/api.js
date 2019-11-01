export const apiUrl = 'http://172.30.117.156:3000/tasks';

export function getTasks() {
  return fetch(`${apiUrl}`);
}

export function putTask(task) {
  return fetch(`${apiUrl}/task`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(task),
  });
}
