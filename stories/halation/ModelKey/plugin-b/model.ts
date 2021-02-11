export default () => ({
  state: {
    visible: false,
    b: true,
    count: 0,
  },
  reducers: {
    show: () => ({ visible: true }),
    setProps: (_, props) => ({ ...props })
  }
})