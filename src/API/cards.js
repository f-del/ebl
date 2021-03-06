import { cardStatus } from "../redux/modules/cards";

/**
 * Mapping from Firestore model to JS model
 */
export const mapping = card => {
  if (card === undefined) throw new Error("Argument card is mandatory");
  card =
    typeof card.data === "function"
      ? { Id: "" + card.id, ...card.data() }
      : card;

  let status =
    card.Status !== undefined
      ? {
          Status: cardStatus.mapTo(card.Status)
        }
      : {};
  if (card.CreatedAt !== undefined) card.CreatedAt = new Date(card.CreatedAt);

  if (card.Persona !== undefined) {
    card.Persona = {
      Id:
        typeof card.Persona.Id === "object"
          ? card.Persona.Id.id
          : card.Persona.Id,
      NeedsIndex: card.Persona.Needs
    };
  }
  if (card.Hypothesis !== undefined) {
    card.Hypothesis = {
      Id:
        typeof card.Hypothesis.Id === "object"
          ? card.Hypothesis.Id.id
          : card.Hypothesis.Id
    };
  }
  if (card.UserStories !== undefined) {
    card.UserStories = card.UserStories.map(us => ({
      Id: typeof us.Id === "object" ? us.Id.id : us.Id
    }));
  }
  if (card.Tasks !== undefined) {
    card.Tasks = card.Tasks.map(us => ({
      Id: typeof us.Id === "object" ? us.Id.id : us.Id
    }));
  }

  return {
    ...card,
    ...status
  };
};

/**
 * Mapping from JS model to Firestore model
 */
export const mappingTo = (card, db) => {
  if (card === undefined) throw new Error("Argument card is mandatory");
  if (card.Criterias !== undefined) return card;
  const mappedCard = {};
  if (card.Title !== undefined) mappedCard["Title"] = card.Title;
  if (card.Type !== undefined) mappedCard["Type"] = card.Type;

  if (card.Status !== undefined)
    mappedCard["Status"] = cardStatus.mapFrom(card.Status);

  if (card.CreatedAt !== undefined)
    mappedCard["CreatedAt"] = card.CreatedAt.toJSON();

  if (card.Persona !== undefined) {
    mappedCard["Persona"] = {
      Id: db.collection("Persona").doc(card.Persona.Id),
      Needs: card.Persona.NeedsIndex
    };
  }
  if (card.Hypothesis !== undefined) {
    mappedCard["Hypothesis"] = {
      Id: db.collection("Cards").doc(card.Hypothesis.Id)
    };
  }

  if (card.UserStories !== undefined) {
    mappedCard["UserStories"] = card.UserStories.reduce((acc, us) => {
      acc.push({ Id: db.collection("Cards").doc(us.Id) });
      return acc;
    }, []);
  }
  if (card.Tasks !== undefined) {
    mappedCard["Tasks"] = card.Tasks.reduce((acc, us) => {
      acc.push({ Id: db.collection("Cards").doc(us.Id) });
      return acc;
    }, []);
  }
  return mappedCard;
};

function post(db) {
  return (card, fields) => {
    if (card === undefined) throw new Error("Argument card is mandatory");
    const isUpdate = card.Id !== undefined;
    const _post = collection => {
      if (isUpdate)
        return collection.doc(card.Id).update(mappingTo(fields, db));
      else return collection.add(mappingTo(card, db));
    };
    return new Promise((resolve, reject) => {
      if (
        card.Status === undefined ||
        card.Title === undefined ||
        card.Status === undefined ||
        card.Type === undefined
      )
        reject("Argument card is not expected type");

      _post(db.collection("cards"))
        .then(ref => {
          console.log(
            "Document successfully " +
              (isUpdate ? "updated" : "written " + ref.id) +
              "!"
          );
          resolve(isUpdate ? { update: true } : { Id: ref.id });
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
        })
        .catch(error => {
          console.error("Error in getting document: ", error);
          //dispatch(errorSave())
          reject(error);
        });
    });
  };
}

export default db => {
  return { Post: post(db), Get: get(db) };
};
