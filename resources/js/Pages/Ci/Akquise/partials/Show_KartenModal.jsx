import PrimaryButton from "@/Components/PrimaryButton";
import { MapIcon } from "@heroicons/react/24/outline";
import { Button, Modal, Tabs } from "flowbite-react";
import proj4 from "proj4";
import React from "react";

export default class Show_KartenModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }
  render() {
    const { showModal } = this.state;
    const { lat, lon } = this.props;

    var firstProjection =
      "+proj=longlat +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +no_defs";
    var secondProjection = "+proj=utm +zone=32 +ellps=GRS80 +units=m +no_defs";
    // var longLat = this.toDecimalsDegrees(); //Array with coordinates in decimal degrees

    // var result = proj4(firstProjection, secondProjection, [
    //     longLat[0],
    //     longLat[1],
    // ]);
    var result = proj4(firstProjection, secondProjection, [lon, lat]);
    // console.log(result);

    return (
      <React.Fragment>
        <PrimaryButton
          onClick={this.toggleModal}
          className="w-full justify-center"
          color="gray"
        >
          <MapIcon className="w-5 mr-2" /> Weitere Karten anzeigen
        </PrimaryButton>
        <Modal
          dismissible={true}
          show={showModal}
          onClose={this.toggleModal}
          size="3xl"
        >
          <Modal.Header>Karten</Modal.Header>
          <Modal.Body>
            <Tabs.Group
              aria-label="Tabs with underline"
              style="underline"
              color="dark"
            >
              <Tabs.Item title="Lärmkarte">
                <div>
                  <div className="w-full grid">
                    <iframe
                      width={600}
                      height={400}
                      src={
                        "https://geoportal-hamburg.de/geo-online/?Map/layerIds=19969,95,96&visibility=true,true,true&transparency=0,50,50&Map/center=[" +
                        result[0] +
                        "," +
                        result[1] +
                        "]&Map/zoomLevel=10&uiStyle=simple"
                      }
                    />
                  </div>
                </div>
              </Tabs.Item>
            </Tabs.Group>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}
