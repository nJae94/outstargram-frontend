import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import FatText from "../../Components/FatText";

const Wrapper = styled.div`
  height: 50vh;
  text-align: center;
`;

const SearchPresenter = ({ searchTerm, loading, data }) => (

  <Wrapper>
    {searchTerm === undefined && <FatText text={"다시 검색해주세요..."} />}

    {searchTerm !== undefined && <FatText text={"검색"} />}
  </Wrapper>
);

SearchPresenter.propTypes = {
  searchTerm: PropTypes.string,
  loading: PropTypes.bool
};

export default SearchPresenter;