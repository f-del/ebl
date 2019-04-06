function post() {
  return new Promise((resolve, reject) => {
    // use firestore API
    setTimeout(t => {
      resolve({ Id: 1 });
    }, 100);
  });
}

export default {
  Post: post
};
