import { cardStatus } from "../redux/modules/cards";

export const mapping = card => {
  if (card === undefined) throw new Error("Argument card is mandatory");
  card =
    typeof card.data === "function" ? { Id: card.id, ...card.data() } : card;

  let status =
    card.Status !== undefined
      ? {
          Status:
            card.Status === "INPROGRESS"
              ? cardStatus.INPROGRESS
              : cardStatus.TODO
        }
      : {};
  return {
    ...card,
    ...status
  };
};

function post(db) {
  return card => {
    if (card === undefined) throw new Error("Argument card is mandatory");
    return new Promise((resolve, reject) => {
      if (card.Trype !== undefined)
        reject("Argument card is not expected type");
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

function filterType(db, arg) {
  if (arg !== undefined) return db.where("Type", "==", arg);
  else return db;
}

function get(db) {
  return type => {
    return new Promise((resolve, reject) => {
      filterType(db.collection("cards"), type)
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
