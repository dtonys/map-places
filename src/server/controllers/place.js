import Place from 'models/place';


const debug = require('debug')('mp-place-controller');

export async function create( req, res, next ) {
  debug('create');
  const payload = req.body;
  try {
    const place = await Place.create(payload);
    res.json(place);
  }
  catch (error) {
    next(error);
  }
}

export async function update( req, res, next ) {
  debug('update');
  const payload = req.body;
  const id = req.params.id;

  try {
    const updatedPlace = await Place.findByIdAndUpdate(id, payload);
    res.json(updatedPlace);
    return;
  }
  catch (error) {
    next(error);
  }
}

export async function get( req, res, next ) {
  debug('get');
  const id = req.params.id;
  try {
    const place = await Place.findById(id);
    res.json(place);
  }
  catch (error) {
    next(error);
  }
}

export async function list( req, res, next ) {
  debug('list');
  try {
    const places = await Place.find();
    res.json(places);
  }
  catch (error) {
    next(error);
  }
}

export async function remove( req, res, next ) {
  debug('delete');
  const id = req.params.id;
  try {
    await Place.findOneAndRemove({ _id: id });
    res.json({
      success: true,
    });
  }
  catch (error) {
    next(error);
  }
}
