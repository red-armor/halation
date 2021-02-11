export default () => ({
  state: {
    visible: false,
  },
  reducers: {
    show: () => ({ visible: true }),
    setProps: (_, props) => ({ ...props })
  }
})