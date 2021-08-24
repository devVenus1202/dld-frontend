import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import { commentReportRequest } from '../../actions';

class Index extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            reason: '',
            reasonError: '',
            showErrors: false,
        };
    }

    handleSubmit = () => {
        const { submitReport, commentId, currentUser, close } = this.props;
        const { reason } = this.state;

        const trimmedReason = _.trim(reason);
        if (!trimmedReason) {
            return this.setState({
                reasonError: 'Cannot be blank',
                showErrors: true,
            });
        } else if (trimmedReason.length > 1000) {
            return this.setState({
                reasonError: 'Max characters for reason is 1000',
                showErrors: true,
            });
        }

        submitReport({
            reason,
            commentId,
            userId: currentUser && currentUser.id,
            onSuccess: close,
        });
    };

    handleReasonChange = (event) => {
        const { target } = event;

        this.setState({
            reason: target.value,
        });
    };

    render() {
        const {
            commentText,
            close,
            loading, // todo show loading if needed
        } = this.props;
        const {
            reason,
            reasonError,
            showErrors,
        } = this.state;

        return (
            <div className="full-screen-popup">
                <div className="popup-paper">
                    <div className="popup-title">
                        <div className="popup-logo" />
                        <div onClick={close} className="btn-effect one popup-close-btn">
                            <span/>
                        </div>
                    </div>
                    <div className="clearfix form-report">
                        <h3 className="report-title">You report the comment</h3>
                        <p className="report-comment">{commentText}</p>
                        <div className="report-reason">
                            <label htmlFor="reason">Reason</label>
                            <input type="text" name="reason" className="form-control" value={reason} onChange={this.handleReasonChange}/>
                        </div>
                        {
                            showErrors && reasonError && (<span className="report-error">{reasonError}</span>)
                        }
                        <div className="report-button">
                            <button type="button"  className="btn-effect one" onClick={this.handleSubmit}>Send Report</button>
                        </div>
                        </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        loading: state.webinarListReducer.commentReportLoading,
        currentUser: state.profileInfoReducer.profileInfo,
    }),
    dispatch => ({
        submitReport: payload => dispatch(commentReportRequest(payload)),
    }),
)(Index);
