export default () => ({
  state: {
    visible: false,
    c: true,
    count: 0,
  },
  reducers: {
    show: () => ({ visible: true }),
    setProps: (_, props) => ({ ...props })
  }
})