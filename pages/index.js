import { Component } from 'react';
import Layout from 'components/Layout';
import MapManager from 'helpers/MapManager';
import clientEntry from 'helpers/clientEntry';

@clientEntry
class HomePage extends Component {
  componentDidMount() {
    MapManager.insertMapToDom(document.querySelector('#mapRegion'));
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
