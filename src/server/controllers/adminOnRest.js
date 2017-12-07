import mongoose from 'mongoose';
import lodashIsEmpty from 'lodash/isEmpty';

import User, {
// USER_ROLE_ADMIN,
} from 'models/user';
import Place from 'models/place';
import Session from 'models/session';
// import {
//   createAuthMiddleware,
// } from 'helpers/session';


const collectionToModelMap = {
  users: User,
  places: Place,
  sessions: Session,
};
const sortValueMap = {
  ASC: 1,
  DESC: -1,
};
// GET_LIST
// GET_MANY
// GET_MANY_REFERENCE
export async function getList( req, res ) {
  const Model = collectionToModelMap[req.params.resource];
  const sort = null;
  const range = null;
  const filter = null;
  // NOTE: eval is used to parse arrays and objects in such a format
  // Ex: sort=['title','ASC']&filter={title:'bar'}
  eval(`sort = ${req.query.sort}`); // eslint-disable-line no-eval
  eval(`range = ${req.query.range}`); // eslint-disable-line no-eval
  eval(`filter = ${req.query.filter}`); // eslint-disable-line no-eval


  const queryObject = {};
  if ( filter && !lodashIsEmpty(filter) ) {
    // filter={ids:[123,456,789]}
    if ( filter.ids && filter.ids.length ) {
      queryObject['_id'] = { $in: filter.ids };
    }
    // filter={title:'bar'}
    // filter={author_id:435}
    else {
      const filterKey = Object.keys(filter)[0];
      const filterValue = filter[filterKey];
      const filterValueRegex = new RegExp(filterValue, 'i');
      queryObject[filterKey] = { $regex: filterValueRegex };
    }
  }
  if ( queryObject['id'] ) {
    queryObject['_id'] = queryObject['id'];
    delete queryObject['id'];
  }
  const queryPromise = Model.find(queryObject);
  // sort=['title','ASC']
  if ( sort ) {
    let sortKey = sort[0];
    const sortValue = sort[1];
    if ( sortKey === 'id' ) {
      sortKey = '_id';
    }
    queryPromise.sort({ [sortKey]: sortValueMap[sortValue] });
  }
  // range=[0, 24]
  let startNum = 0;
  let endNum = 10;
  if ( range ) {
    [ startNum, endNum ] = range;
    const perPage = endNum - startNum;
    queryPromise.skip(startNum);
    queryPromise.limit(perPage);
  }
  const [ resources, total ] = await Promise.all([
    queryPromise,
    Model.find(queryObject).count(),
  ]);

  // Content-Range: posts 0-24/319 <range>/<total>
  res.set('Content-Range', `${startNum}-${endNum}/${total}`);
  const _resources =  resources.map((resource) => {
    return {
      ...resource.toObject(),
      id: resource.id.toString(),
    };
  });
  res.json(_resources);
}

// GET_ONE /<resource>/<id
export async function getOne( req, res ) {
  const { webApiRequest } = res.locals;
  const id = req.params.id;
  // Proxy to get user detail api
  const user = await webApiRequest('GET', `/api/${req.params.resource}/${id}` );
  const aorResponse = {
    ...user.data,
    id: user.data._id,
  };
  res.json(aorResponse);
}

// CREATE /<resource>
export async function create( req, res ) {
  const { webApiRequest } = res.locals;
  // Proxy to Create user api
  const createdUser = await webApiRequest('POST', `/api/${req.params.resource}`, {
    body: req.body,
  });
  const aorResponse = {
    ...createdUser.data,
    id: createdUser.data._id,
  };
  res.json(aorResponse);
}

// UPDATE /<resource>/<id>
export async function update( req, res ) {
  // Proxy to Update user api
  const { webApiRequest } = res.locals;
  const id = req.params.id;
  const updatedUser = await webApiRequest('PUT', `/api/${req.params.resource}/${id}`, {
    body: req.body,
  });
  const aorResponse = updatedUser.data;
  res.json(aorResponse);
}

// DELETE /<resource>/<id>
export async function _delete( req, res, next ) {
  // Proxy to delete user api
  const { webApiRequest } = res.locals;
  const id = req.params.id;

  try {
    const deletedUser = await webApiRequest('DELETE', `/api/${req.params.resource}/${id}`);
    const aorResponse = {
      ...deletedUser.data,
      id: deletedUser.data._id,
    };
    res.json(aorResponse);
  }
  catch (error) {
    next(error);
  }
}

export function addRoutes( router ) {
  const allCollections = Object.keys(mongoose.connection.collections).join('|');

  // Authenticate, check logged in statatus
  // TODO add admin role based authentication
  // const adminOnly = createAuthMiddleware({
  //   requiredRoles: [ USER_ROLE_ADMIN ],
  // });

  // router.use('/aor-api', adminOnly );
  // GET_LIST /<resource>?sort=['title','ASC']&range=[0, 24]&filter={title:'bar'}
  // GET_MANY /<resource>?filter={ids:[123,456,789]}
  // GET_MANY_REFERENCE /<resource>?filter={author_id:345}
  router.get(`/aor-api/:resource(${allCollections})`, getList );
  // GET_ONE /<resource>/<id>
  router.get(`/aor-api/:resource(${allCollections})/:id`, getOne );
  // CREATE /<resource>/<id>
  router.post(`/aor-api/:resource(${allCollections})`, create );
  // UPDATE /<resource>/<id>
  router.put(`/aor-api/:resource(${allCollections})/:id`, update );
  // DELETE /<resource>/<id>
  router.delete(`/aor-api/:resource(${allCollections})/:id`, _delete );
}
