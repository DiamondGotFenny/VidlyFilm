import _ from "lodash";

export function paginate(items, pageNum, pageSize) {
  const startIndex = (pageNum - 1) * pageSize;
  return _(items)
    .slice(startIndex)
    .take(pageSize)
    .value();
}
