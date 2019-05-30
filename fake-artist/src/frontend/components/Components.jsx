import styled from "styled-components";

export const getFontColorForBackground = backgroundColor => {
  // background color is rgb
  // convert to decimal values
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // calculate perceptive luminance
  // https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color#
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
  if (luminance > 0.5) {
    // high luminance = bright background -> black font
    return "#000000";
  } else {
    // low luminance = dark background -> white font
    return "#ffffff";
  }
};

export const ResultListItem = styled.li`
    display: block;
    background-color: ${props => props.playerColor};
    color: ${props => props.fontColor};
  `;

export const PlayerListItem = styled.li`
    display: block;
    background-color: ${props => props.playerColor};
    color: ${props => props.fontColor};
  `;

export const PlayerName = styled.strong`
    color: ${props => props.playerColor}
  `;

// the img needs a white background because it is transparent
export const CanvasImg = styled.img`
    background-color: white;
  `;
