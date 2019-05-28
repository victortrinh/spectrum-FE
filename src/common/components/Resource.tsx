import React from "react";
import { en } from "../resources/en";
import { fr } from "../resources/fr";

type OwnProps = {
  resourceKey: string;
};

type State = {
  language: string;
};

type Props = OwnProps;

export class Resource extends React.PureComponent<Props, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      language: "en"
    };
  }

  render() {
    const { resourceKey } = this.props;
    const { language } = this.state;

    return <span>{language === "en" ? en[resourceKey] : fr[resourceKey]}</span>;
  }
}
