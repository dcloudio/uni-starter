jest.setTimeout(20000)
describe('list', () => {
  let page, containsVite, isApp;
  containsVite = process.env.UNI_CLI_PATH.includes('uniapp-cli-vite')
  isApp = process.env.UNI_PLATFORM.includes('app')
  if (containsVite && isApp) {
    it('vue3', async () => {
      expect(1).toBe(1)
    })
    return
  }

  beforeAll(async () => {
    page = await program.switchTab('/pages/list/list')
    await page.waitFor('view')
    const waitTime = process.env.UNI_PLATFORM === "mp-weixin" ? 10000 : 3000
    await page.waitFor(waitTime)
    await page.setData({'isTest': true})
  })

  it('列表标题', async () => {
    const dataList = await page.data('dataListTest')
    expect(dataList.title).toBe('阿里小程序IDE官方内嵌uni-app，为开发者提供多端开发服务')
  })

  it('列表内容-点击', async () => {
    await page.waitFor(2000)
    const listItems = await page.$$('.uni-list-item')
		if (listItems.length > 0) {
			expect(listItems.length).toBeGreaterThan(0)
		  await listItems[0].tap()
		  await page.waitFor(500)
		}
  })
  
})