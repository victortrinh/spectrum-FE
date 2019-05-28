import React from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import Logo from "../images/logo.svg";
import { Resource } from "common/components/Resource";

type State = {
  isOpen: boolean;
  language: string;
};

export class AppNavBar extends React.PureComponent<{}, State> {
  constructor(props: any) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      language: "en"
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    const { language } = this.state;

    return (
      <Navbar className="navbar navbar-dark bg-dark" expand="md">
        <div className="container">
          <NavbarBrand href="/">
            <img src={Logo} alt="Spectrum Logo" />
            <span className="logo">SPECTRUM</span>
          </NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  {language === "en" ? "EN" : "FR"}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>EN</DropdownItem>
                  <DropdownItem>FR</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink href="/login">
                  <Resource resourceKey="login" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/register">
                  <Resource resourceKey="registerButton" />
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </div>
      </Navbar>
    );
  }
}
