
const qs = (elem) => {
  return document.querySelector(elem);
}

const sendToIndexedDB = () => {
  const formData = new FormData(qs('#form'));
  let name = formData.get('name');
  let email = formData.get('email');
  let comment = formData.get('comment');
  if ()
}

qs('#submitBtn').addEventListener('click', (e) => {
  sendToIndexedDB();
  e.preventDefault();
});