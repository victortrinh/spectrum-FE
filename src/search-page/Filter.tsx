import React from "react";
import styled from "styled-components";
import AppContext from "AppContext";
import { Resource } from "common/components/Resource";
import { FilterSelection } from "search-page/common/components/FilterSelection";
import { CheckboxSelection } from "./common/components/CheckboxSelection";
import { StyledInput } from "common/components/Form.styles";
import { StyledButton } from "common/components/Button.styles";
import { YearsSelector } from "./common/components/YearsSelector";

export class Filter extends React.PureComponent {
  onChangeCheckboxGenre = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO
  };

  onChangeCheckboxPrimitive = (e: React.SyntheticEvent<HTMLInputElement>) => {
    // TODO
  };

  render() {
    return (
      <StyledFilter>
        <div className="mainHeader">
          <Resource resourceKey="filters" />
        </div>
        <FilterSelection
          headerResourceKey="numberOfSongs"
          showFilterAtStart={true}
          borderTop={true}
        >
          <div className="input-group">
            <StyledNumberOfSongsInput className="form-control" />
            <StyledNumberOfSongsButton
              className="input-group-addon"
              variant="secondary"
            >
              <Resource resourceKey="apply" />
            </StyledNumberOfSongsButton>
          </div>
        </FilterSelection>
        <AppContext.Consumer>
          {context => (
            <FilterSelection
              headerResourceKey="genres"
              showFilterAtStart={false}
              borderTop={true}
            >
              <CheckboxSelection
                checkboxes={context.genres.filter(genre => genre.is_selected)}
                onChange={this.onChangeCheckboxGenre}
              />
            </FilterSelection>
          )}
        </AppContext.Consumer>
        <AppContext.Consumer>
          {context => (
            <FilterSelection
              headerResourceKey="primitives"
              showFilterAtStart={false}
              borderTop={true}
            >
              <CheckboxSelection
                checkboxes={context.primitives.filter(
                  primitive => primitive.is_selected
                )}
                onChange={this.onChangeCheckboxPrimitive}
              />
            </FilterSelection>
          )}
        </AppContext.Consumer>
        <FilterSelection
          headerResourceKey="years"
          showFilterAtStart={false}
          borderTop={true}
          borderBottom={true}
        >
          <YearsSelector defaultValue="1900" />
          <span className="betweenInputs">
            <Resource resourceKey="to" />
          </span>
          <YearsSelector defaultValue="2019" />
        </FilterSelection>
      </StyledFilter>
    );
  }
}

const StyledFilter = styled.div`
  .mainHeader {
    font-size: 22px;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .betweenInputs {
    padding: 0 10px;
  }

  select {
    width: 80px;
  }
`;

const StyledNumberOfSongsInput = styled(StyledInput)`
  margin-right: 5px !important;
  border-radius: 3px !important;
  height: 32px !important;
`;

const StyledNumberOfSongsButton = styled(StyledButton)`
  height: 32px !important;
  padding: 0 10px;
`;
