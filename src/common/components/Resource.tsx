import React from "react";
import AppContext from "../../AppContext";
import { en } from "../resources/en";
import { fr } from "../resources/fr";

type OwnProps = {
  resourceKey: string;
};

type Props = OwnProps;

export class Resource extends React.PureComponent<Props> {
  render() {
    const { resourceKey } = this.props;

    return (
      <AppContext.Consumer>
        {context => {
          const resource = context.language.includes("fr")
            ? fr[resourceKey]
            : en[resourceKey];

          return resource === undefined
            ? "## MISSING RESOURCE: " + resourceKey
            : resource;
        }}
      </AppContext.Consumer>
    );
  }
}
