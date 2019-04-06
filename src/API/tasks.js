function post(db) {
  return card => {
    return new Promise((resolve, reject) => {
      db.collection("cards")
        .add(card)
        .then(ref => {
          console.log("Document successfully written!");
          resolve({ id: ref.id });
        })
        .catch(error => {
          console.error("Error writing document: ", error);
          //dispatch(errorSave())
          reject(error);
        });
    });
  };
}

export default db => {
  return { Post: post(db) };
};
