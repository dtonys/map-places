export function loadUser(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        name: 'tony',
      },
    });
  }, 1000);
}

export function loadPageData(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        foo: 'bar',
      },
    });
  }, 2000);
}

// Places
export function getPlacesList(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        apiName: 'getPlacesList',
      },
    });
  }, 500);
}

export function createPlace(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        apiName: 'createPlace',
      },
    });
  }, 500);
}

export function patchPlace(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        apiName: 'patchPlace',
        id: req.params.id,
      },
    });
  }, 500);


}

export function getPlace(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        apiName: 'getPlace',
        id: req.params.id,
      },
    });
  }, 500);


}

export function deletePlace(req, res) {
  setTimeout(() => {
    res.json({
      success: true,
      data: {
        apiName: 'deletePlace',
        id: req.params.id,
      },
    });
  }, 500);
}
