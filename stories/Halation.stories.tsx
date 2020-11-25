import React from 'react';
import BasicExample from './Basic'
import SlotExample from './Slot'
import RawDataExample from './RawData'

export default {
  title: 'halation'
}
// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Basic = () => <BasicExample />;
export const Slot = () => <SlotExample />
export const RawData = () => <RawDataExample />

