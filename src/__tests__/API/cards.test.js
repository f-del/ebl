import { entity_test, entity_test_created } from "../datas";
import { mapping, mappingTo } from "../../API/cards";

import MockFirebase from "mock-cloud-firestore";
import apiCards from "../../API/cards";
import { cardStatus, cardType } from "../../redux/modules/cards";

const fixtureData = {
  __collection__: {
    cards: {
      __doc__: {
        id1: {
          ...entity_test,
          Status: "TODO",
          CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0).toJSON()
        },
        id2: {
          ...entity_test,
          Status: "INPROGRESS",
          CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0).toJSON()
        },
        id3: {
          ...entity_test,
          Type: "STORY",
          Status: "DONE",
          CreatedAt: new Date(2000, 1, 1, 12, 0, 0, 0).toJSON()
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
      Type: "TASK",
      CreatedAt: expect.any(String)
    });
  });

  test("card with date & array of UserStories & Hypothesis Ref", () => {
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();
    const date = new Date();
    const card = mappingTo(
      {
        Title: "test",
        Status: cardStatus.TODO,
        CreatedAt: date,
        Type: cardType.Hypothesis,
        UserStories: [{ Id: "IdLinked" }],
        Hypothesis: { Id: "fdlijsflkdjsklj" }
      },
      db
    );

    expect(card).toStrictEqual({
      Title: "test",
      Type: cardType.Hypothesis,
      Status: "TODO",
      CreatedAt: date.toJSON(),
      UserStories: [{ Id: db.collection("Cards").doc("IdLinked") }],
      Hypothesis: { Id: db.collection("Cards").doc("fdlijsflkdjsklj") }
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

  test("card with status and date", () => {
    const date = new Date();
    const fnData = jest.fn(() => {
      return {
        Title: "test",
        Type: "TASK",
        Status: "TODO",
        CreatedAt: date.toJSON()
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
      Type: "TASK",
      Status: cardStatus.TODO,
      CreatedAt: date
    });
  });

  test("card with Persona and UserStories", () => {
    const date = new Date();
    const firebase = new MockFirebase(fixtureData);
    const db = firebase.firestore();

    const fnData = jest.fn(() => {
      let ret = {
        Title: "test",
        Type: "TASK",
        Status: "TODO",
        CreatedAt: date.toJSON(),
        UserStories: [
          {
            Id: db.collection("Cards").doc("lkdsjfl34dfg")
          }
        ],
        Persona: {
          Id: db.collection("Persona").doc("e6wTJIBsAw5puwwrNEsR"),
          Needs: 3
        },
        Hypothesis: {
          Id: db.collection("Cards").doc("fdlijsflkdjsklj")
        }
      };
      Object.defineProperty(ret.Persona.Id, "id", {
        get: jest.fn(() => "e6wTJIBsAw5puwwrNEsR"),
        set: jest.fn()
      });
      Object.defineProperty(ret.Hypothesis.Id, "id", {
        get: jest.fn(() => "fdlijsflkdjsklj"),
        set: jest.fn()
      });
      ret.UserStories.forEach(e =>
        Object.defineProperty(e.Id, "id", {
          get: jest.fn(() => "lkdsjfl34dfg"),
          set: jest.fn()
        })
      );
      return ret;
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
      Status: cardStatus.TODO,
      CreatedAt: date,
      Persona: {
        Id: "e6wTJIBsAw5puwwrNEsR",
        NeedsIndex: 3
      },
      UserStories: [
        {
          Id: "lkdsjfl34dfg"
        }
      ],
      Hypothesis: { Id: "fdlijsflkdjsklj" }
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

  test("Return id of created card with ref to persona", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();

    const api = apiCards(db);

    await expect(
      api.Post({
        ...entity_test,
        Type: cardType.Hypothesis,
        Persona: {
          Id: "ldksjflkdsj",
          NeedsIndex: 3
        }
      })
    ).resolves.toStrictEqual(expect_post_create());
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

  test("Return true on updated card with array of stories Id", async () => {
    expect.assertions(1);
    const firebase = new MockFirebase(fixtureData);

    const db = firebase.firestore();

    const api = apiCards(db);

    await expect(
      api.Post({
        ...entity_test,
        Type: cardType.Hypothesis,
        UserStories: [{ Id: "IdLinked" }]
      })
    ).resolves.toStrictEqual(expect_post_create());
  });
});
