import personnasReducer, { getAllPersonas } from "../../redux/modules/personas";

const entity_persona_productOwner = () => ({
  Details: "Product Owner for a new product, work in a startup",
  Name: "Paul Deligny",
  Needs: [
    "To have a clear understanding about the product vision & objectives",
    "To write real User Stories, ie have a Customer Driven thinking",
    "To share at the right time and with the rigth level of information the User Stories with his team",
    "To have a clear vision on the job he'll have to do AND the job already or currently done"
  ],
  Picture: ""
});
const entity_persona_featureTeam = () => ({
  Picture: "",
  Name: "Feature Team",
  Details: "Meta persona, representing all collaborators working with Paul",
  Needs: [
    "To understand WHAT the Product Owner wants to be able to design collaborativly the HOW",
    "To manage easly the list of things to do to finish the most quickly the User Story"
  ]
});
const entity_persona_productOwner_Id = () => ({
  Id: "uOCF2GLFiJl6fvxdlq4b"
});

const entity_persona_featureTeam_Id = () => ({
  Id: "e6wTJIBsAw5puwwrNEsR"
});

export const entity_persona_created = {
  ...entity_persona_productOwner_Id(),
  ...entity_persona_productOwner()
};

const personas_state = () => ({
  list: {
    [entity_persona_productOwner_Id().Id]: entity_persona_productOwner(),
    [entity_persona_featureTeam_Id().Id]: entity_persona_featureTeam()
  }
});
const personas_store = () => ({ personas: personas_state() });

describe("Reducer", () => {
  test.skip("Should get Initial Static State", () => {
    expect(personnasReducer(undefined, { type: "fakeaction" })).toStrictEqual(
      personas_state()
    );
  });
});
/***
 *    ███████╗███████╗██╗     ███████╗ ██████╗████████╗ ██████╗ ██████╗ ███████╗
 *    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
 *    ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║   ██║██████╔╝███████╗
 *    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║   ██║██╔══██╗╚════██║
 *    ███████║███████╗███████╗███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║███████║
 *    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
 *
 */

describe("Selectors", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test.skip("Get All personas without param, expect Error", () => {
    const wrapper = () => getAllPersonas();

    expect(wrapper).toThrowError(new Error("State arg is mandatory"));
  });

  test.skip("Get All personas with a empty state, expect []", () => {
    expect(getAllPersonas({})).toStrictEqual([]);
  });

  test.skip("Get All personas, expect [{productOwner, Id},{FT, ID}]", () => {
    expect(getAllPersonas(personas_store())).toStrictEqual([
      entity_persona_created,
      { ...entity_persona_featureTeam_Id(), ...entity_persona_featureTeam() }
    ]);
  });
});
