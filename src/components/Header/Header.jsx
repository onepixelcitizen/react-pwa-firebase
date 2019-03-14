import React, { Component } from 'react';
import logo from 'components/Header/header-logo.svg';
import 'components/Header/Header.css';

class Header extends Component {
  render() {
    return (
      <header>
        <img src={logo} className="logo" alt="logo" />
      </header>
    );
  }
}

export default Header;
