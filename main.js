
const qs = (elem) => {
  return document.querySelector(elem);
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

const sendToIndexedDB = () => {
  const formData = new FormData(qs('#form'));
  let name = cleanMyText(formData.get('name'));
  let email = cleanMyText(formData.get('email'));
  let comment = cleanMyText(formData.get('comment'));
  if (!name && !email && !comment) { return; }

  let inputData = {
    name,
    email,
    comment
  };
  console.log(inputData);


  qs('[name="name"]').value = "";
  qs('[name="email"]').value = "";
  qs('[name="comment"]').value = "";
}

qs('#submitBtn').addEventListener('click', (e) => {
  sendToIndexedDB();
  e.preventDefault();
});