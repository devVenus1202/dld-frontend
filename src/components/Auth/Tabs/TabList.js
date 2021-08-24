import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tab from './Tab';

export default class TabList extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
        super(props);

        this.state = {
            activeTab: this.props.children[0].props.label,
        };
    }

    onClickTabItem = (tab) => {
        this.setState({ activeTab: tab });
    }

    render() {
        const { onClickTabItem, props: {children},state: {activeTab} } = this;
        const {guestOption} = this.props;

        return (
            <div>
                <nav>
                    <div className={
                            classNames('form-tabs-buttons', { guestStyles: guestOption })}>
                        {children.map((child) => {
                            const { label } = child.props;

                            return (
                                <Tab
                                    activeTab={activeTab}
                                    key={label}
                                    label={label}
                                    onClick={onClickTabItem}
                                />
                            );
                        })}
                    </div>
                </nav>
                <div className="form-tabs-content">
                    {children.map((child) => {
                        if (child.props.label !== activeTab) return undefined;
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}