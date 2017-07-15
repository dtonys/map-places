import { Component } from 'react';
import Layout from 'components/Layout';
import MapManager from 'helpers/MapManager';
import clientEntry from 'helpers/clientEntry';
import {
  tryGetCurrentPosition,
} from 'helpers/browserUtils';

@clientEntry
class HomePage extends Component {

  constructor(props) {
    super(props);
    this.currentPositionLatLng = null;
  }

  componentDidMount() {
    MapManager.insertMapToDom(document.querySelector('#mapRegion'));
    tryGetCurrentPosition(({ lat, lng }) => {
      this.currentPositionLatLng = { lat, lng };
      MapManager.googleMap.setCenter({ lat, lng });
      MapManager.attachMarkerToMap({ lat, lng });
    });
  }

  render() {
    return (
      <div>
        <Layout htmlTitle={'Home'}>
          <div id="mapRegion" className="mapRegion">
          </div>
        </Layout>
        <style jsx>{`
          #mapRegion {
            height: 100%;
            background: grey;
          }
        `}</style>
      </div>
    );
  }
}

export default HomePage;
