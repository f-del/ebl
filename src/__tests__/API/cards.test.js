import { entity_test } from "../datas";
import { mapping } from "../../API/cards";

import MockFirebase from "mock-cloud-firestore";
import apiCards from "../../API/cards";

const fixtureData = {
  __collection__: {
    cards: {
      __doc__: {
        id1: {
          ...entity_test
        },
        id2: {
          ...entity_test
        },
        id3: {
          ...entity_test,
          Type: "STORY"
        }
      }
    }
  }
};

describe("Card mapping from Firestore", () => {
  it("no arg", () => {
    const wrapper = () => {
      mapping();
    };

    expect(wrapper).toThrowError("Argument card is mandatory");
  });

  it("empty card literal", () => {
    const card = mapping({});

    expect(card).toEqual({});
  });

  it("card as firestore type", () => {
    const fnData = jest.fn(() => {
      return {
        ...entity_test,
        Status: "TODO"
      };
    });

    const mockFirestore = {
      data: fnData
    };
    const card = mapping(mockFirestore);

    expect(fnData.mock.calls.length).toBe(1);
    expect(card).toEqual(entity_test);
  });

  it("card without status", () => {
    const fnData = jest.fn(() => {
      return {
        Title: "test",
        Type: "test"
      };
    });

    const mockFirestore = {
      _firestore: {},
      data: fnData
    };
    const card = mapping(mockFirestore);

    expect(fnData.mock.calls.length).toBe(1);
    expect(card).toEqual({
      Title: "test",
      Type: "test"
    });
  });
});

describe("GET method", () => {
  it("Return array of all cards", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Get()).resolves.toEqual([
      { Id: "id1", ...entity_test },
      { Id: "id2", ...entity_test },
      { Id: "id3", ...entity_test, Type: "STORY" }
    ]);
  });
  it("Return array of card filtred by arg", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Get("TASK")).resolves.toEqual([
      { Id: "id1", ...entity_test },
      { Id: "id2", ...entity_test }
    ]);
  });
});

describe("POST method", () => {
  it("Error on empty card arg", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    const result = () => {
      api.Post();
    };
    expect(result).toThrowError("Argument card is mandatory");
  });

  it("Error on not asserted card literal", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post({ Id: 2, Title: "test", Trype: "TASK" })
    ).rejects.toBe("Argument card is not expected type");
  });

  it("Return id of created card", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Post(entity_test)).resolves.toEqual({
      id: expect.any(String)
    });
  });
});
