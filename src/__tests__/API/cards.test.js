import { entity_test, entity_test_created } from "../datas";
import { mapping, mappingTo } from "../../API/cards";

import MockFirebase from "mock-cloud-firestore";
import apiCards from "../../API/cards";
import { cardStatus } from "../../redux/modules/cards";

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

describe("Card mapping to Firestore", () => {
  test("no arg", () => {
    const wrapper = () => {
      mappingTo();
    };

    expect(wrapper).toThrowError("Argument card is mandatory");
  });

  test("empty card literal", () => {
    const card = mappingTo({});

    expect(card).toEqual({});
  });

  test("Card with all properties, expect no more Symbol", () => {
    const card = mappingTo(entity_test_created);
    expect(card).toEqual({
      Status: "TODO",
      Title: "test",
      Type: "TASK"
    });
  });
});

describe("Card mapping from Firestore", () => {
  test.skip("no arg", () => {
    const wrapper = () => {
      mapping();
    };

    expect(wrapper).toThrowError("Argument card is mandatory");
  });

  test.skip("empty card literal", () => {
    const card = mapping({});

    expect(card).toEqual({});
  });

  test.skip("card as firestore type", () => {
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

  test.skip("card without status", () => {
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

  test("card with status", () => {
    const fnData = jest.fn(() => {
      return { Title: "test", Type: "TASK", Status: "TODO" };
    });

    const mockFirestore = {
      id: 1,
      data: fnData
    };
    const card = mapping(mockFirestore);

    expect(fnData.mock.calls.length).toBe(1);
    expect(card).toEqual({
      Id: "1",
      Title: "test",
      Type: "TASK",
      Status: cardStatus.TODO
    });
  });
});

describe("GET method", () => {
  test.skip("Return array of all cards", async () => {
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
  test.skip("Return array of card filtred by arg", async () => {
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
  test.skip("Error on empty card arg", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    const result = () => {
      api.Post();
    };
    expect(result).toThrowError("Argument card is mandatory");
  });

  test.skip("Error on not asserted card (Status as Symbol OR invalid property)", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post({ Id: 2, Title: "test", Trype: "TASK", Status: cardStatus.TODO })
    ).rejects.toBe("Argument card is not expected type");
  });

  test.skip("Return id of created card", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Post(entity_test)).resolves.toEqual({
      id: expect.any(String)
    });
  });

  test.skip("Return true on updated card", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post(entity_test_created, { Value: false })
    ).resolves.toEqual({
      update: true
    });
  });
});
