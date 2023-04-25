import React, { PureComponent } from "react";
import classnames from "classnames";
import {
  Keyboard as KeyboardIcon,
  DeleteKey as DeleteKeyIcon,
} from "@zarm-design/icons";

interface PropsType {
  type?: 'number' | 'price' | 'idcard';
  onKeyClick?: (key?: string) => void;
}

type KeyType = Exclude<PropsType["type"], undefined>;

const KEYS: { [type in KeyType]: readonly string[] } = {
  number: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "clear"],
  price: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "clear", "0", "."],
  idcard: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "X", "0", "clear"],
};

export interface KeyboardProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Keyboard extends PureComponent<KeyboardProps, {}> {
  static defaultProps: KeyboardProps = {
    prefixCls: "za-keyboard",
    type: "number",
  };

  onKeyClick = (key: string) => {
    if (key.length === 0) {
      return;
    }

    const { onKeyClick } = this.props;
    if (typeof onKeyClick === "function") {
      onKeyClick(key);
    }
  };

  getKeys = (): ReadonlyArray<string> => {
    const { type } = this.props;
    return type ? KEYS[type] : KEYS.number;
  };

  renderKey = (text: string, index: number) => {
    const { prefixCls } = this.props;

    const keyCls = classnames(`${prefixCls}__item`, {
      [`${prefixCls}__item--disabled`]: text.length === 0,
    });

    return (
      <div
        className={keyCls}
        key={+index}
        onClick={() => this.onKeyClick(text)}
      >
        {text === "clear" ? <div style={{fontSize: '16px'}}>清零</div> : text}
      </div>
    );
  };

  render() {
    const { prefixCls, className } = this.props;
    const cls = classnames(prefixCls, className);

    return (
      <div className={cls} onClick={(event) => event.stopPropagation()}>
        <div className={`${prefixCls}__keys`}>
          {this.getKeys().map(this.renderKey)}
        </div>
        <div className={`${prefixCls}__handle`}>
          <div
            className={`${prefixCls}__item`}
            onClick={() => this.onKeyClick("delete")}
          >
            <DeleteKeyIcon size="lg" />
          </div>
          <div
            className={`${prefixCls}__item ${prefixCls}__item--ok`}
            onClick={() => this.onKeyClick("ok")}
          >
						确认
          </div>
        </div>
      </div>
    );
  }
}
