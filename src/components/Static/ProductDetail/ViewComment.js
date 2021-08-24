import React, {PureComponent} from "react";
import _ from "lodash";

class ViewComment extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fullView: false
    };
  }

  showFull() {
    const {fullView} = this.state;
    this.setState({fullView: !fullView})
  }

  render() {
    const {comment, commentShowLessSize} = this.props;
    const {fullView} = this.state;
    const hasFullView = comment.userComment.length > commentShowLessSize;
    return (
        <p>
          {fullView ? _.unescape(comment.userComment) : `${_.unescape(comment.userComment)}`.substr(0, commentShowLessSize)}
          {hasFullView ? fullView ? '' : '...' : ''}
          {hasFullView ? (<span className="show-comment-more-less" onClick={this.showFull.bind(this)}>{fullView ? 'View less' : 'View more'}</span>) : ''}
        </p>
    );
  }
}

export default ViewComment;
