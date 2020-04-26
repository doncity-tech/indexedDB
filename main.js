
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
let db;
(() => {
  if (!window.indexedDB) {
    console.log("Your browser doesn't support IndexedDB.");
    return;
  }
  // We start by opening our database
  let indexedDB = window.indexedDB.open('db-example', 1);
  indexedDB.error = () => {
    console.log('Error:', e.target.result);
  }

  indexedDB.onsuccess = (e) => {
    db = e.target.result;
  }

  indexedDB.onupgradeneeded = (e) => {
    let db = e.target.result;
    let dbObject = db.createObjectStore('comment', { keyPath: 'token' });

  }


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