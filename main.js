
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
(async () => {
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
    getAllData();
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

// Get all indexedDB data if any
const getAllData = () => {
  let objectStore = db.transaction(['comment'], 'readonly').objectStore('comment');
  let keyRequest = objectStore.getAllKeys();

  keyRequest.onsuccess = (e) => {
    let keys = e.target.result;

    let request = objectStore.getAll();
    request.onerror = () => {
      console.log('Error occured');
    }
    request.onsuccess = (e) => {
      let data = e.target.result;
      console.log(data);
      data.forEach(x => {
        let key = keys.shift();
        qs('.commentDom').innerHTML += `
        <div class="each-comment">
          <h3 class="name">${x.name} <span id="key">Key: ${key}</span></h3>
          <p class="email">${x.email}</p>
          <p class="comment">${x.comment}</p>
        </div> `;
      });
    }
  }
}

// Add data to indexedDB
const sendToIndexedDB = (data) => {
  let dbTrans = db.transaction(['comment'], 'readwrite');
  let request = dbTrans.objectStore('comment').add(data);
  request.onsuccess = (e) => {
    console.log('Just added: ', data);

    qs('[name="name"]').value = "";
    qs('[name="email"]').value = "";
    qs('[name="comment"]').value = "";
    location.reload();
  }

  dbTrans.onerror = (e) => {
    console.log('Error:', e.target.result);
  }
}

// update indexedDB
const updateIndexedDB = (data) => {
  let dbObjectStore = db.transaction(['comment'], 'readwrite').objectStore('comment');
  let request = dbObjectStore.put(data, Number(data.keyPath));
  request.onerror = () => {
    console.log('db get not successful');
  }
  request.onsuccess = (e) => {
    console.log('db Updated');
    qs('.key').value = "";
    qs('.update-name').value = "";
    qs('.update-email').value = "";
    qs('.com-update').value = "";
    location.reload();
  }
}

// Delete indexedDB
const deleteIndexedDB = (keyPath) => {
  let objectStore = db.transaction(['comment'], 'readwrite').objectStore('comment');
  let request = objectStore.delete(Number(keyPath));

  request.onerror = (e) => {
    console.log('Error:', e.target.error);
  }
  request.onsuccess = () => {
    console.log(`Deleted db data with key: ${keyPath}`);
    qs('.delete-input').value = "";
    location.reload();
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

// Process delete form
const processDeleteFormData = () => {
  const formData = new FormData(qs('#form-delete'));
  let keyPath = cleanMyText(formData.get('keypath'));
  if (!keyPath) { return; }
  deleteIndexedDB(keyPath);
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

  qs('#deleteBtn').addEventListener('click', (e) => {
    e.preventDefault();
    processDeleteFormData();
  });

})();
