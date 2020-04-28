
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

// Add data to indexedDB
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

// update indexedDB
const updateIndexedDB = (data) => {
  let dbObjectStore = db.transaction(['comment'], 'readwrite').objectStore('comment');
  let request = dbObjectStore.get(Number(data.keyPath));
  request.onerror = () => {
    console.log('db get not successful');
  }

  request.onsuccess = (e) => {
    let tempData = e.target.result;
    tempData.comment = data.comment;
    let tempRequest = dbObjectStore.put(tempData, Number(data.keyPath));

    tempRequest.onerror = (e) => {
      console.log('db Update not successful:', e.target);
    }

    tempRequest.onsuccess = () => {
      console.log('db Updated');

      qs('.key').value = "";
      qs('.update-name').value = "";
      qs('.update-email').value = "";
      qs('.com-update').value = "";
    }
  }
}

// Add form
const processFormData = () => {
  const formData = new FormData(qs('#form'));
  let name = cleanMyText(formData.get('name'));
  let email = cleanMyText(formData.get('email'));
  let comment = cleanMyText(formData.get('comment'));
  if (!name || !email || !comment) { return; }

  let inputData = { name, email, comment };
  sendToIndexedDB(inputData);
}

// Process Update form
const processUpdateFormData = () => {
  const formData = new FormData(qs('#form-update'));
  let keyPath = cleanMyText(formData.get('keypath'));
  let name = cleanMyText(formData.get('name'));
  let email = cleanMyText(formData.get('email'));
  let comment = cleanMyText(formData.get('comment'));

  if (!keyPath || !name || !email || !comment) { return; }
  let inputData = { keyPath, name, email, comment };
  updateIndexedDB(inputData);
}

// uiInteraction
(() => {
  qs('#submitBtn').addEventListener('click', (e) => {
    e.preventDefault();
    processFormData();
  });

  qs('#updateBtn').addEventListener('click', (e) => {
    e.preventDefault();
    processUpdateFormData();
  });

  qs('#updateBtn').addEventListener('click', (e) => {
    e.preventDefault();
    processUpdateFormData();
  });

})();
