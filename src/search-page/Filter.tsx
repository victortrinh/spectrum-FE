import React from "react";
import styled from "styled-components";
import AppContext from "AppContext";
import { Resource } from "common/components/Resource";
import { FilterSelection } from "search-page/common/components/FilterSelection";
import { CheckboxSelection } from "./common/components/CheckboxSelection";
import { StyledInput } from "common/components/Form.styles";
import { StyledButton } from "common/components/Button.styles";

type Props = {
  onChange: any;
  onClick: any;
};

export class Filter extends React.PureComponent<Props> {
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
            <StyledNumberOfSongsInput
              onChange={this.props.onChange}
              className="form-control"
            />
            <StyledNumberOfSongsButton
              onClick={this.props.onClick}
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
              id="genresFilter"
              headerResourceKey="genres"
              showFilterAtStart={true}
              borderTop={true}
            >
              <CheckboxSelection
                checkboxes={
                  context.genres
                    ? context.genres
                        .filter(genre => genre.is_selected)
                        .map(x => ({
                          is_selected: !context.unselectedGenreIdList.includes(
                            x.id
                          ),
                          name: x.name,
                          id: x.id
                        }))
                    : []
                }
                onClick={(e: React.SyntheticEvent<HTMLInputElement>) => {
                  context.updateUnselectedGenreIdList(
                    Number(e.currentTarget.dataset.id),
                    e.currentTarget.checked
                  );
                }}
                checkAll={context.userCheckAllGenres}
                uncheckAll={context.userUncheckAllGenres}
                showAllAtStart={true}
              />
            </FilterSelection>
          )}
        </AppContext.Consumer>
        <AppContext.Consumer>
          {context => (
            <FilterSelection
              id="primitives"
              headerResourceKey="primitives"
              showFilterAtStart={true}
              borderTop={true}
              borderBottom={true}
            >
              <CheckboxSelection
                checkboxes={
                  context.primitives
                    ? context.primitives
                        .filter(primitive => primitive.is_selected)
                        .map(x => ({
                          is_selected: !context.unselectedPrimitiveIdList.includes(
                            x.id
                          ),
                          name: x.name,
                          id: x.id
                        }))
                    : []
                }
                onClick={(e: React.SyntheticEvent<HTMLInputElement>) => {
                  context.updateUnselectedPrimitiveIdList(
                    Number(e.currentTarget.dataset.id),
                    e.currentTarget.checked
                  );
                }}
                checkAll={context.userCheckAllPrimitives}
                uncheckAll={context.userUncheckAllPrimitives}
                showAllAtStart={true}
              />
            </FilterSelection>
          )}
        </AppContext.Consumer>
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
