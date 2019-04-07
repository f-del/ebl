import { cardStatus } from "../redux/modules/cards";

const mapping = card => {
  card = card._firestore !== undefined ? card.data() : card;
  return {
    ...card,
    Status:
      card.Status === "INPROGRESS" ? cardStatus.INPROGRESS : cardStatus.TODO
  };
};

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

function get(db) {
  return type => {
    return new Promise((resolve, reject) => {
      db.collection("cards")
        .where("Type", "==", type)
        .get()
        .then(function(querySnapshot) {
          let cards = [];

          querySnapshot.forEach(function(doc) {
            let env = mapping(doc);

            cards.push(env);
          });

          resolve(cards);
        });
    });
  };
}

export default db => {
  return { Post: post(db), Get: get(db) };
};
