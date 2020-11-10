import styled from '@emotion/styled';
import { flexColumnGaps, layout } from './theme';

// gap, in pixels, between each immediate child in a section
export const childGap = layout.gap;

export const Section = styled.section(function () {
  return {
    ...flexColumnGaps(childGap),
  };
});