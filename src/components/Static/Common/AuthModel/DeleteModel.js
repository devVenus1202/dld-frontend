import React, { Component } from "react";
import { Modal } from "react-bootstrap";
class DeleteModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
        deleteTrueStatus: false
    };
  }

  handleHide = () => {
    this.props.displayDeleteModelFun();
  };

  catchHandlerFun (value) {
      if(value === "yes") {
        const { currentDeleteId } = this.props;
        this.props.performDeleteFun(currentDeleteId);      
      }
      else {
        this.props.displayDeleteModelFun();
      }
      
  }


  render() {
  
    return (
      <Modal
        show={this.props ? this.props.displayDeleteModel : false}
        onHide={this.handleHide}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title">
            Confirmation
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="confirmation-box">
                Are you sure you want to delete this comment?<br/>
                This action can not be undo.
            </div>
            <div className="confirmation-action">
                <button className="btn-effect one" onClick={this.catchHandlerFun.bind(this,'yes')}>Yes</button>
                <button className="btn-effect one btn-cancel" onClick={this.catchHandlerFun.bind(this,'no')}>No</button>
            </div>
        </Modal.Body>
      </Modal>
    );
  }
}

export default DeleteModel;
