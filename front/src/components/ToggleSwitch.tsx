import React from 'react';
import './ToggleSwitch.css';

export class Switch extends React.Component<any>{

  render(){
    return (
    <div>
      <input
        className="react-switch-checkbox"
        id={this.props.id}
        type="checkbox"
        onChange={this.props.onChange}
        defaultChecked={this.props.defaultChecked}
        value={this.props.value}
      />
      <label
        style={{ background: this.props.defaultChecked && '#304e6e' }}
        className="react-switch-label"
        htmlFor={this.props.id}
      >
        <span className={`react-switch-button`} />
      </label>
    </div>
  );
};
}

export default Switch;
