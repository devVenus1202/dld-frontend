import React, { Component } from "react";
import * as Style from "./Loader.css";
class AuthModel extends Component {
  render() {
    return (
      <div className={Style["main-loader"]}>
        <div className={Style["loader"]}>
          <svg className={Style["circular-loader"]} viewBox="25 25 50 50">
            <circle
              className={Style["loader-path"]}
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#fd9326"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    );
  }
}

export class Loader extends Component {
  render() {
    return (
      <div className={Style["main-loader"]}>
        <div className={Style["loader"]}>
          <svg className={Style["circular-loader"]} viewBox="25 25 50 50">
            <circle
              className={Style["loader-path"]}
              cx="50"
              cy="50"
              r="20"
              fill="none"
              stroke="#fd9326"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      </div>
    );
  }
}

export class InfiniteLoader extends Component {
  render() {
    return (
      <div className={Style["infinitemain-loader-warp"]}>
      <div className={Style["infinitemain-loader"]}>
        <svg className={Style["circular-loader"]} viewBox="25 25 50 50">
          <circle
            className={Style["loader-path"]}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            stroke="#fd9326"
            strokeWidth="2.5"
          />
        </svg>
      </div>
      </div>
    );
  }
}

export class InfiniteLoaders extends Component {
    render() {
        return (
                <div className={Style["lite-loader"]}>
                    <svg className={Style["lite-circular-loader"]} viewBox="25 25 50 50">
                        <circle
                            className={Style["loader-path"]}
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                            stroke="#fd9326"
                            strokeWidth="2.5"
                        />
                    </svg>
                </div>
        );
    }
}

export default AuthModel;
