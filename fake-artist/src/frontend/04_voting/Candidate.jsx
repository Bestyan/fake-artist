import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Candidate = props => {
  return (
    <VoteButton onClick={props.vote} color={props.candidate.color}>Vote for {props.candidate.name}</VoteButton>
  );
};

const VoteButton = styled.button`
  background-color: ${props => props.color};
`;

Candidate.propTypes = {
  candidate: PropTypes.object.isRequired,
  vote: PropTypes.func.isRequired
}

export default Candidate;