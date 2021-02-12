export default () => ({
  state: {
    count: 1,
  },
  reducers: {
    setProps: (state, payload) => ({ ...payload })
  }
})
