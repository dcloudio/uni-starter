describe('list', () => {
  let page, containsVite, isApp;
  containsVite = process.env.UNI_CLI_PATH.includes('uniapp-cli-vite')
  isApp = process.env.UNI_PLATFORM.includes('app')
  if (containsVite && isApp) {
		// vue3-nvue不支持测试，跳过
    it('vue3', async () => {
      expect(1).toBe(1)
    })
    return
  }
  beforeAll(async () => {
    page = await program.switchTab('/pages/list/list')
    await page.waitFor('view')
    await page.setData({'isTest': true})
  })
  it('检测标题', async () => {
    expect.assertions(1);
    const waitTime = process.env.UNI_PLATFORM === "mp-weixin"? 8000 : 3000;
    await page.waitFor(waitTime);
    const getTitle = await page.data('dataList')
    expect(getTitle.title).toBe('阿里小程序IDE官方内嵌uni-app，为开发者提供多端开发服务')
  })
})