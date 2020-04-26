
const qs = (elem) => {
  return document.querySelector(elem);
}
const qsAll = (elem) => {
  return document.querySelectorAll(elem);
}

const cleanMyText = (text) => {
  let temp = [];
  text.split(' ').forEach((x) => {
    if (x) {
      temp.push(x);
    }
  })
  if (text && temp.join(' ')) {
    return temp.join(' ');
  }
}


// IndexedDB
(() => {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support IndexedDB.");
    return;
  }
  // We the start by opening indexedDB
  let db = window.indexedDB.open('db-example');


})();

const sendToIndexedDB = () => {
  const formData = new FormData(qs('#form'));
  let name = cleanMyText(formData.get('name'));
  let email = cleanMyText(formData.get('email'));
  let comment = cleanMyText(formData.get('comment'));
  if (!name && !email && !comment) { return; }

  let inputData = { name, email, comment };
  console.log(inputData);

  qs('[name="name"]').value = "";
  qs('[name="email"]').value = "";
  qs('[name="comment"]').value = "";
}

qs('#submitBtn').addEventListener('click', (e) => {
  sendToIndexedDB();
  e.preventDefault();
});