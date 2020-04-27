
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
    console.log('db opened');
  }

  indexedDB.onupgradeneeded = (e) => {
    let db = e.target.result;
    let commentStore = db.createObjectStore('comment', { autoIncrement: true });
    console.log('db store created');

    commentStore.createIndex('name', 'name', { unique: false });
    console.log('name Index created');

    commentStore.createIndex('email', 'email', { unique: true });
    console.log('email Index created');
  }
})();

const sendToIndexedDB = (data) => {
  let dbTrans = db.transaction(['comment'], 'readwrite');
  let request = dbTrans.objectStore('comment').add(data);
  request.onsuccess = (e) => {
    console.log('Just added: ', data);
  }

  dbTrans.onerror = (e) => {
    console.log('Error:', e.target.result);
  }

  qs('[name="name"]').value = "";
  qs('[name="email"]').value = "";
  qs('[name="comment"]').value = "";
}

const processFormData = () => {
  const formData = new FormData(qs('#form'));
  let name = cleanMyText(formData.get('name'));
  let email = cleanMyText(formData.get('email'));
  let comment = cleanMyText(formData.get('comment'));
  if (!name && !email && !comment) { return; }

  let inputData = { name, email, comment };
  sendToIndexedDB(inputData);
}

qs('#submitBtn').addEventListener('click', (e) => {
  e.preventDefault();
  processFormData();
});