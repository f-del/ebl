/***
 *    ██████╗ ███████╗██████╗ ██╗   ██╗ ██████╗███████╗██████╗ ███████╗
 *    ██╔══██╗██╔════╝██╔══██╗██║   ██║██╔════╝██╔════╝██╔══██╗██╔════╝
 *    ██████╔╝█████╗  ██║  ██║██║   ██║██║     █████╗  ██████╔╝███████╗
 *    ██╔══██╗██╔══╝  ██║  ██║██║   ██║██║     ██╔══╝  ██╔══██╗╚════██║
 *    ██║  ██║███████╗██████╔╝╚██████╔╝╚██████╗███████╗██║  ██║███████║
 *    ╚═╝  ╚═╝╚══════╝╚═════╝  ╚═════╝  ╚═════╝╚══════╝╚═╝  ╚═╝╚══════╝
 *
 */

const initialState = {
  list: {
    e6wTJIBsAw5puwwrNEsR: {
      Name: "Feature Team",
      Details: "Meta persona, representing all collaborators working with Paul",
      Needs: [
        "To understand WHAT the Product Owner wants to be able to design collaborativly the HOW",
        "To manage easly the list of things to do to finish the most quickly the User Story"
      ],
      Picture: ""
    },
    uOCF2GLFiJl6fvxdlq4b: {
      Details: "Product Owner for a new product, work in a startup",
      Name: "Paul Deligny",
      Needs: [
        "To have a clear understanding about the product vision & objectives",
        "To write real User Stories, ie have a Customer Driven thinking",
        "To share at the right time and with the rigth level of information the User Stories with his team",
        "To have a clear vision on the job he'll have to do AND the job already or currently done"
      ],
      Picture: ""
    }
  }
};

export default function(state = initialState, action) {
  return state;
}

/***
 *    ███████╗███████╗██╗     ███████╗ ██████╗████████╗ ██████╗ ██████╗ ███████╗
 *    ██╔════╝██╔════╝██║     ██╔════╝██╔════╝╚══██╔══╝██╔═══██╗██╔══██╗██╔════╝
 *    ███████╗█████╗  ██║     █████╗  ██║        ██║   ██║   ██║██████╔╝███████╗
 *    ╚════██║██╔══╝  ██║     ██╔══╝  ██║        ██║   ██║   ██║██╔══██╗╚════██║
 *    ███████║███████╗███████╗███████╗╚██████╗   ██║   ╚██████╔╝██║  ██║███████║
 *    ╚══════╝╚══════╝╚══════╝╚══════╝ ╚═════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
 *
 */
export function getAllPersonas(state) {
  return mapToArrayPersona(getPersonasList(state)) || [];
}

function getPersonasList(state) {
  return getPersonas(validateState(state)).list || {};
}

/* Functionnal helper */
function validateState(state) {
  if (state === undefined) throw new Error("State arg is mandatory");
  return state;
}
function getPersonas(state) {
  return state.personas || {};
}

function mapToArrayPersona(list) {
  return Array.from(Object.keys(list), key => ({
    ...getPersonaId(key),
    ...list[key]
  }));
}
function getPersonaId(key) {
  return {
    Id: key
  };
}
