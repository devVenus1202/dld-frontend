import React, { Component } from "react";
import { Modal } from "react-bootstrap";
class FacebookModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        
    };
  }

  handleHide = () => {

  }
  render() {
  
    return (
      <Modal
        show={false}
        onHide={this.handleHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="">
                Facbook
            </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default FacebookModel;
