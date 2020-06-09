import React from 'react';
import { Link } from "react-router-dom";
import * as Style from "./MenuStyles.css";
import Footer from '../Footer/Footer';
import {getProductsLink, getWebinarsLink} from "../../helpers/links";
const classNames = require("classnames");
const MainMenu = (props) => {
    return (
        <div className={Style["full-size-menu"]}>
            <div className={Style["splash-image-wrap"]}>
                <div
                    className={classNames(
                        Style["splash-image-block"],
                        Style["firearm"],
                        Style["width50"]
                    )}
                    style={{ backgroundImage: 'url("/assets/img/img-webinars.jpg")' }}
                >
                    <Link to={getWebinarsLink()} onClick={props.close}>
                        <div className={Style["splash-image-tile"]}>
                            <p className={Style["splash-image-text"]}>Webinars</p>
                        </div>
                    </Link>
                </div>
                <div
                    className={classNames(
                        Style["splash-image-block"],
                        Style["width50"]
                    )}
                    style={{ backgroundImage: 'url("/assets/img/firearms-new.jpg")' }}
                >
                    <Link to={getProductsLink()} onClick={props.close}>
                        <div className={Style["splash-image-tile"]}>
                            <p className={Style["splash-image-text"]}>Products</p>
                        </div>
                    </Link>
                </div>
            </div>
            <Footer settings={props.settings} closeOnRedirect={props.close} />
        </div>
    );
};

export default MainMenu;
