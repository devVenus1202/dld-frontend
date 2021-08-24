import React, {Component} from 'react';
import classNames from 'classnames';
import {
    NavLink,
    withRouter,
} from 'react-router-dom';
import {MenuItem, Dropdown} from "react-bootstrap";
import Constant from '../../../config/Constant';

const menuItems = [{
    route: '/dashboard',
    iconUrl: '/assets/img/icons/dashboard_black.svg',
    title: 'Dashboard',
}, {
    route: '/orders',
    iconUrl: '/assets/img/icons/order_black.svg',
    title: 'My Orders',
}, {
    route: '/my-webinars',
    iconUrl: '/assets/img/icons/ReviewChat_black.svg',
    title: 'My Webinars',
}, {
    route: '/my-gift-cards',
    iconUrl: '/assets/img/icons/giftbox_black.svg',
    title: 'My Gift Cards',
}, {
    route: '/address',
    iconUrl: '/assets/img/icons/address_black.svg',
    title: 'My Address',
}, {
    route: '/profile',
    iconUrl: '/assets/img/icons/user_black.svg',
    title: 'My Profile',
}, {
    route: '/change-password',
    iconUrl: '/assets/img/icons/ico-password.svg',
    title: 'Change Password',
},
//     {
//     route: '/profile-settings',
//     iconUrl: '/assets/img/icons/ico-settings.svg',
//     title: 'Newsletter Settings',
// }
];

class LeftSidebar extends Component {
    renderMenuItems = () => {
        return menuItems.map(item => {
           return (
               <li key={item.title}>
                   <NavLink
                       activeClassName="active"
                       to={item.route}
                   >
                        <span className="icon">
                            <img src={`${Constant.frontUrl}${item.iconUrl}`} width="50px" alt={item.title} />
                        </span>
                       {item.title}
                   </NavLink>
               </li>
           );
        });
    };

    render() {
        return (
            <div>
                <ul className="dashboard-left-nav">{this.renderMenuItems()}</ul>
            </div>
        )
    }
}

class _LeftSidebarMobileView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayProfileSideBar: false
        };
    }

    toggleProfileMenu = () => {
        this.setState({displayProfileSideBar: !this.state.displayProfileSideBar});
    };

    render() {
        const {
            location,
        } = this.props;
        const activeItem = menuItems.find(i => i.route === location.pathname) || {};

        return (
            <div className="mobile-view">
                <div className="cursor-point mob-dashboard-icon" onClick={this.toggleProfileMenu}>
                    <img src={`${Constant.frontUrl}${activeItem.iconUrl}`} alt={activeItem.title} width="20px" />
                    <span>{activeItem.title}</span>
                    <img
                        alt="view"
                        src={Constant.frontUrl + "/assets/img/icons/arrow-down.svg"}
                        width="14px"
                        className={
                            classNames(
                                {'dropdown-arrow-active': this.state.displayProfileSideBar > 0},
                            )
                        }
                    />
                </div>
                <Dropdown
                    pullRight
                    defaultOpen
                    id={"user-profile-dropdown"}
                    open={this.state.displayProfileSideBar}
                    onToggle={this.toggleProfileMenu}
                >
                    <Dropdown.Menu>
                        <MenuItem eventKey="1">2</MenuItem>
                        <LeftSidebar/>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

        )
    }
}

export const LeftSidebarMobileView = withRouter(_LeftSidebarMobileView);

export default LeftSidebar;
