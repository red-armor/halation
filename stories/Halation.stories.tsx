import React from 'react';
import BasicExample from './Basic'

export default {
  title: 'halation'
}
// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Basic = () => <BasicExample />;
