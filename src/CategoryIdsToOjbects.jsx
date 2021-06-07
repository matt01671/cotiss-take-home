const idToName = require('./UNSPCTrans.json');

export function categoryIdsToObjects(ids) {
  const categoryObjects = ids.map((id) => {
    const categoryObject = {
      code: id,
      text: idToName[id],
    };
    return categoryObject;
  });
  return categoryObjects;
}
