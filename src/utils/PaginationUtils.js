exports.getPageRequest = req => {
  if (!req.query) {
    return {
      skip: 0,
      limit: Number.MAX_SAFE_INTEGER,
      currentPage: 1
    };
  }
  const reqPage = req.query.page;
  const reqLimit = req.query.limit;
  let limit = reqLimit ? +reqLimit : Number.MAX_SAFE_INTEGER;
  let skip = reqPage ? +reqPage * limit : 0;
  const currentPage = reqPage ? +reqPage + 1 : 1;
  if ((reqPage && +reqPage < 0) || (reqLimit && +reqLimit <= 0)) {
    skip = 0;
    limit = Number.MAX_SAFE_INTEGER;
  }
  return {
    skip,
    limit,
    currentPage
  };
};

exports.getPaginationResult = (data, totalRecords, pageRequest) => {
  const { limit, currentPage } = pageRequest;
  return {
    currentPage,
    totalPage: Math.floor(totalRecords / limit),
    totalItems: totalRecords,
    items: data
  };
};
