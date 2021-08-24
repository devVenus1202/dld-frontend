import React, { PureComponent } from "react";

class AddComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      comment: this.props.editComment ? this.props.commentData: ""
    };
  }

  clickClose (divId,boxName) {
    this.props.closeCommentBox(divId, boxName);
  }
  render() {
    const {className,onAdd,parentId, divId, addCommentButtonLoading, maxCommentLength} = this.props;
    return (
      <div className={"user-comment-box " + className}>
        <div className="comment-box-group">
          <textarea
            className={`form-control new-comment-textarea`}
            rows="2"
            id="unique_comment"
            placeholder="Write a comment..."
            value = {this.state.comment}
            maxLength={maxCommentLength}
            onChange = { e => {
              this.setState({
                comment: e.target.value
              });
            }
            }
          />
          {
            addCommentButtonLoading ?
                <button
                  className = "btn-effect one comment-btn"
                  onClick = {
                      e => {
                        e.preventDefault();
                        onAdd(this.state.comment, parentId, divId);
                      }
                    } >
                  Processing...
              </button>
            :
            <button
              className = "btn-effect one comment-btn"
              onClick = {
                  e => {
                    e.preventDefault();
                    onAdd(this.state.comment, parentId, divId);
                    this.setState({comment: ""});
                  }
                } >
                Submit
              </button>
          }

          {this.props.displayCross ?
            <span className="fa fa-times edit-comment-close" onClick={this.clickClose.bind(this,divId,this.props.boxName)}></span>
          : null}

        </div>
        <div className="comment-common-error">
          <div className="remove-link cursor-point commentError" id={divId}></div>
          {<div className="footer-character-msg">{`${this.state.comment}`.length} of {maxCommentLength} characters</div> }
        </div>

      </div>
    );
  }
}

export default AddComment;
