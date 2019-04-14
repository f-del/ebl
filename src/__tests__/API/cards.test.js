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
          ...entity_test,
          Status: "TODO"
        },
        id2: {
          ...entity_test,
          Status: "INPROGRESS"
        },
        id3: {
          ...entity_test,
          Type: "STORY",
          Status: "DONE"
        }
      }
    }
  }
};

export const expect_post_create = val => ({
  Id: val || expect.any(String)
});

export const expect_post_update = () => ({
  update: true
});

describe("Card mapping to Firestore", () => {
  test("no arg", () => {
    const wrapper = () => {
      mappingTo();
    };

    expect(wrapper).toThrowError("Argument card is mandatory");
  });

  test("empty card literal", () => {
    const card = mappingTo({});

    expect(card).toStrictEqual({});
  });

  test("Card with all properties, expect no more Symbol", () => {
    const card = mappingTo(entity_test_created);
    expect(card).toStrictEqual({
      Status: "TODO",
      Title: "test",
      Type: "TASK"
    });
  });
});

describe("Card mapping from Firestore", () => {
  test("no arg", () => {
    const wrapper = () => {
      mapping();
    };

    expect(wrapper).toThrowError("Argument card is mandatory");
  });

  test("empty card literal", () => {
    const card = mapping({});

    expect(card).toStrictEqual({});
  });

  test("card as firestore type", () => {
    const fnData = jest.fn(() => {
      return {
        ...entity_test,
        Status: "TODO"
      };
    });

    const mockFirestore = {
      id: 1,
      data: fnData
    };
    const card = mapping(mockFirestore);

    expect(fnData.mock.calls.length).toBe(1);
    expect(card).toStrictEqual(entity_test_created);
  });

  test("card without status", () => {
    const fnData = jest.fn(() => {
      return {
        Title: "test",
        Type: "test"
      };
    });

    const mockFirestore = {
      id: 1,
      data: fnData
    };
    const card = mapping(mockFirestore);

    expect(fnData.mock.calls.length).toBe(1);
    expect(card).toStrictEqual({
      Id: "1",
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
    expect(card).toStrictEqual({
      Id: "1",
      Title: "test",
      Type: "TASK",
      Status: cardStatus.TODO
    });
  });
});

describe("GET method", () => {
  test("Return array of all cards", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Get()).resolves.toStrictEqual([
      { Id: "id1", ...entity_test },
      { Id: "id2", ...entity_test, Status: cardStatus.INPROGRESS },
      { Id: "id3", ...entity_test, Type: "STORY", Status: cardStatus.DONE }
    ]);
  });
  test("Return array of card filtred by arg", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Get("TASK")).resolves.toStrictEqual([
      { Id: "id1", ...entity_test },
      { Id: "id2", ...entity_test, Status: cardStatus.INPROGRESS }
    ]);
  });
});

describe("POST method", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("Error on empty card arg", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    const result = () => {
      api.Post();
    };
    expect(result).toThrowError("Argument card is mandatory");
  });

  test("Error on not asserted card (Status as Symbol OR invalid property)", async () => {
    expect.assertions(3);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post({ Id: 2, Type: "TASK", Status: cardStatus.TODO })
    ).rejects.toBe("Argument card is not expected type");

    await expect(
      api.Post({ Id: 2, Title: "TASK", Status: cardStatus.TODO })
    ).rejects.toBe("Argument card is not expected type");

    await expect(
      api.Post({ Id: 2, Type: "TASK", Stadtus: cardStatus.TODO })
    ).rejects.toBe("Argument card is not expected type");
  });

  test("Return id of created card", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(api.Post(entity_test)).resolves.toStrictEqual(
      expect_post_create()
    );
  });

  test("Return true on updated card", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post({ ...entity_test_created, Id: "id1" }, { Value: false })
    ).resolves.toStrictEqual({
      update: true
    });
  });

  test("Return true on updated card with symbol property", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const api = apiCards(db);

    await expect(
      api.Post(
        { ...entity_test_created, Id: "id1" },
        { Value: cardStatus.TODO }
      )
    ).resolves.toStrictEqual(expect_post_update());
  });
});
