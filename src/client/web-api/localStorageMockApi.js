const localStorageInitialState = {
  places: {},
};
const mockInitialState = JSON.parse('{"places":{"37.535593732053904_-122.36074447631836":{"id":"37.535593732053904_-122.36074447631836","lat":37.535593732053904,"lng":-122.36074447631836},"37.583765767186236_-122.3818588256836":{"id":"37.583765767186236_-122.3818588256836","lat":37.583765767186236,"lng":-122.3818588256836,"label":"","saved":true},"37.56145265126773_-122.41962432861328":{"id":"37.56145265126773_-122.41962432861328","lat":37.56145265126773,"lng":-122.41962432861328},"37.53736331242_-122.35241889953613":{"id":"37.53736331242_-122.35241889953613","lat":37.53736331242,"lng":-122.35241889953613,"saved":true,"label":"Above Belmont"},"37.54444121394982_-122.32941627502441":{"id":"37.54444121394982_-122.32941627502441","lat":37.54444121394982,"lng":-122.32941627502441,"saved":true,"label":"San Mateo South East South East South East South East South East"},"37.5437606756924_-122.33748435974121":{"id":"37.5437606756924_-122.33748435974121","lat":37.5437606756924,"lng":-122.33748435974121,"saved":true,"label":"San Mateo South"},"37.56036403558653_-122.3371410369873":{"id":"37.56036403558653_-122.3371410369873","lat":37.56036403558653,"lng":-122.3371410369873,"saved":true,"label":"San Mateo Place"},"37.3524704_-122.11344209999999":{"id":"37.3524704_-122.11344209999999","lat":37.3524704,"lng":-122.11344209999999,"saved":true},"37.37902425863802_-122.0789623260498":{"id":"37.37902425863802_-122.0789623260498","lat":37.37902425863802,"lng":-122.0789623260498,"saved":false},"37.37043003275146_-122.08737373352051":{"id":"37.37043003275146_-122.08737373352051","lat":37.37043003275146,"lng":-122.08737373352051,"saved":false},"37.46341355543677_-122.25208282470703":{"id":"37.46341355543677_-122.25208282470703","lat":37.46341355543677,"lng":-122.25208282470703,"saved":false},"37.49501799256211_-122.31182098388672":{"id":"37.49501799256211_-122.31182098388672","lat":37.49501799256211,"lng":-122.31182098388672,"saved":false},"38.070798163726785_-122.65342712402344":{"id":"38.070798163726785_-122.65342712402344","lat":38.070798163726785,"lng":-122.65342712402344,"saved":false},"38.23170796744926_-122.58476257324219":{"id":"38.23170796744926_-122.58476257324219","lat":38.23170796744926,"lng":-122.58476257324219,"saved":false},"38.27700093565902_-122.36640930175781":{"id":"38.27700093565902_-122.36640930175781","lat":38.27700093565902,"lng":-122.36640930175781,"saved":false},"38.26945406815749_-122.82371520996094":{"id":"38.26945406815749_-122.82371520996094","lat":38.26945406815749,"lng":-122.82371520996094,"saved":false},"37.53123766302234_-122.34598159790039":{"id":"37.53123766302234_-122.34598159790039","lat":37.53123766302234,"lng":-122.34598159790039,"saved":false},"37.54103846053993_-122.34151840209961":{"id":"37.54103846053993_-122.34151840209961","lat":37.54103846053993,"lng":-122.34151840209961,"saved":false},"37.57533110687502_-122.36383438110352":{"id":"37.57533110687502_-122.36383438110352","lat":37.57533110687502,"lng":-122.36383438110352,"saved":true,"label":""},"37.589751075453606_-122.40520477294922":{"id":"37.589751075453606_-122.40520477294922","lat":37.589751075453606,"lng":-122.40520477294922,"saved":false},"37.613415533879476_-122.40760803222656":{"id":"37.613415533879476_-122.40760803222656","lat":37.613415533879476,"lng":-122.40760803222656,"saved":false},"37.5238862196042_-122.42477416992188":{"id":"37.5238862196042_-122.42477416992188","lat":37.5238862196042,"lng":-122.42477416992188,"saved":false},"37.537499432247266_-122.40280151367188":{"id":"37.537499432247266_-122.40280151367188","lat":37.537499432247266,"lng":-122.40280151367188,"saved":false},"37.55219891098551_-122.442626953125":{"id":"37.55219891098551_-122.442626953125","lat":37.55219891098551,"lng":-122.442626953125,"saved":false},"37.51952946682393_-122.30598449707031":{"id":"37.51952946682393_-122.30598449707031","lat":37.51952946682393,"lng":-122.30598449707031,"saved":false},"37.524975368048196_-122.2943115234375":{"id":"37.524975368048196_-122.2943115234375","lat":37.524975368048196,"lng":-122.2943115234375,"saved":false},"37.539405083738934_-122.30358123779297":{"id":"37.539405083738934_-122.30358123779297","lat":37.539405083738934,"lng":-122.30358123779297,"saved":false},"37.5236708_-122.34033799999997":{"id":"37.5236708_-122.34033799999997","lat":37.5236708,"lng":-122.34033799999997,"saved":true,"label":"Polhemus Road, San Mateo, CA, United States"},"37.52334163941944_-122.40554809570312":{"id":"37.52334163941944_-122.40554809570312","lat":37.52334163941944,"lng":-122.40554809570312,"saved":false},"37.507547084964116_-122.3876953125":{"id":"37.507547084964116_-122.3876953125","lat":37.507547084964116,"lng":-122.3876953125,"saved":false},"37.54893261064111_-122.39456176757812":{"id":"37.54893261064111_-122.39456176757812","lat":37.54893261064111,"lng":-122.39456176757812,"saved":false},"37.552743280459694_-122.35130310058594":{"id":"37.552743280459694_-122.35130310058594","lat":37.552743280459694,"lng":-122.35130310058594,"saved":false},"37.4642193_-122.22923530000003":{"id":"37.4642193_-122.22923530000003","lat":37.4642193,"lng":-122.22923530000003,"saved":false},"34.179348_-118.56682899999998":{"id":"34.179348_-118.56682899999998","lat":34.179348,"lng":-118.56682899999998,"saved":true,"label":"Candy Cane Lane, Los Angeles, CA, United States"},"37.4698651_-122.24691840000003":{"id":"37.4698651_-122.24691840000003","lat":37.4698651,"lng":-122.24691840000003,"saved":false},"37.2570352_-121.96394250000003":{"id":"37.2570352_-121.96394250000003","lat":37.2570352,"lng":-121.96394250000003,"saved":true,"label":"121 Albright Way, Los Gatos, CA, United States"}}}');

/*
{
  places: {
    <id>: {
      ...placeDetail,
    }
  }
}

*/
export function initializeLocalStorage() {
  if ( !localStorage.getItem('data') ) {
    localStorage.setItem('data', JSON.stringify(mockInitialState));
  }
}

// getItem
// setItem
// removeItem
// clear

// Get places list
export async function loadPlacesApi( webApiRequest ) {
  const placesData = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    setTimeout(() => resolve(data.places), 500);
  });
  return placesData;
}

// CRUD Places
export async function createPlaceApi( webApiRequest, payload) {
  const placesData = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    data.places[payload.id] = payload;
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(payload), 500);
  });
  return placesData;
}

export async function updatePlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    data.places[id] = {
      ...data.places[id],
      ...payload,
    };
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(data.places[id]), 500);
  });
  return result;
}

export async function getPlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    setTimeout(() => resolve(data.places[id]), 500);
  });
  return result;
}

export async function deletePlaceApi( webApiRequest, payload ) {
  const { id } = payload;
  const result = await new Promise((resolve /* , reject */) => {
    const data = JSON.parse( localStorage.getItem('data') );
    delete data.places[id];
    localStorage.setItem('data', JSON.stringify(data));
    setTimeout(() => resolve(true), 500);
  });
  return result;
}

