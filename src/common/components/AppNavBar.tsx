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
import GlobeLogo from "../images/globe.svg";
import { primaryColor, black, white } from "../styles/colors";
import { Resource } from "common/components/Resource";
import styled from "styled-components";
import { darken } from "polished";
import { AuthenticationAPI } from "common/api/authentication";

type OwnProps = {
  loggedIn: boolean;
  language: string;
  setLogIn: (loggedIn: boolean) => void;
  setLanguage: (language: string) => void;
};

type State = {
  isOpen: boolean;
};

type Props = OwnProps;

export class AppNavBar extends React.PureComponent<Props, State> {
  authenticationAPI: AuthenticationAPI = new AuthenticationAPI();

  constructor(props: any) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  onClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    this.props.setLanguage(e.currentTarget.value);
  };

  logOut = () => {
    this.authenticationAPI.logout();
    this.props.setLogIn(false);
  };

  render() {
    const { language, loggedIn } = this.props;

    return (
      <StyledNavbar className="navbar navbar-dark" expand="md">
        <div className="container">
          <NavbarBrand href="/">
            <img src={Logo} alt="Spectrum Logo" />
            <span className="logo">SPECTRUM</span>
          </NavbarBrand>
          <NavbarToggler
            onClick={this.toggle}
            style={{ borderColor: "transparent" }}
          />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown nav inNavbar>
                <StyledDropdownToggle
                  nav
                  caret
                  style={{ color: white, fontWeight: "bold" }}
                >
                  <img
                    src={GlobeLogo}
                    alt="Globe Logo"
                    style={{ paddingRight: "10px", paddingBottom: "1px" }}
                  />
                  {language.includes("fr") ? "Français" : "English"}
                </StyledDropdownToggle>
                <DropdownMenu right>
                  <DropdownItem value="en" onClick={this.onClick}>
                    English
                  </DropdownItem>
                  <DropdownItem value="fr" onClick={this.onClick}>
                    Français
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {loggedIn && (
                <NavItem
                  style={{
                    padding: "10px"
                  }}
                >
                  <NavLink href="/admin" style={{ color: white }}>
                    <Resource resourceKey="admin" />
                  </NavLink>
                </NavItem>
              )}
              <StyledNavItem
                style={{
                  padding: "10px"
                }}
              >
                {loggedIn ? (
                  <NavLink
                    href="/"
                    onClick={this.logOut}
                    style={{ color: white }}
                  >
                    <Resource resourceKey="logout" />
                  </NavLink>
                ) : (
                  <NavLink href="/login" style={{ color: white }}>
                    <Resource resourceKey="login" />
                  </NavLink>
                )}
              </StyledNavItem>
            </Nav>
          </Collapse>
        </div>
      </StyledNavbar>
    );
  }
}

const StyledDropdownToggle = styled(DropdownToggle)`
  ::after {
    margin-left: 10px !important;
    vertical-align: 2px !important;
  }
`;

const StyledNavbar = styled(Navbar)`
  padding: 0 !important;
  background-color: ${black} !important;

  @media only screen and (max-width: 768px) {
    height: 60px;
  }

  @media only screen and (max-width: 600px) {
    padding-left: 20px !important;
  }

  .navbar-collapse{
    z-index: 1 !important;
    background-color: ${black} !important;

    li {
      padding: 10px;
    }
  }
`;

const StyledNavItem = styled(NavItem)`
  background-color: ${primaryColor};

  :hover {
    cursor: pointer;
    background-color: ${darken(0.08, primaryColor)};
  }
`;
