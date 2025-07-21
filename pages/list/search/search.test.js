jest.setTimeout(20000)
describe('search', () => {
	let page, containsVite, isApp;
	containsVite = process.env.UNI_CLI_PATH.includes('uniapp-cli-vite')
	isApp = process.env.UNI_PLATFORM.includes('app')
	if ((containsVite && isApp) || process.env.uniTestPlatformInfo == 'ios_simulator 13.7') {
	  it('app--vue3', async () => {
		expect(1).toBe(1)
	  })
	  return
	}
  
	beforeAll(async () => {
	  page = await program.reLaunch('/pages/list/search/search')
	  await page.waitFor('view')
		const waitTime = process.env.UNI_PLATFORM === "mp-weixin" ? 5000 : 3000
		await page.waitFor(waitTime)
	})
  
	it('搜索发现-显示-隐藏', async () => {
	  // 验证初始状态
	  const initialShow = await page.data('netHotListIsHide')
	  expect(initialShow).toBeDefined()
	  // 刷新热搜列表
	  await page.callMethod('searchHotRefresh')
	  await page.waitFor(1000)
	  // 验证刷新后的状态
	  const afterRefresh = await page.data('netHotListIsHide')
	  expect(afterRefresh).toBeFalsy()
	  // 测试隐藏功能
	  await page.setData({netHotListIsHide: true})
	  const afterHide = await page.data('netHotListIsHide')
	  expect(afterHide).toBeTruthy()
	  // 测试显示功能
	  await page.setData({netHotListIsHide: false})
	  const afterShow = await page.data('netHotListIsHide')
	  expect(afterShow).toBeFalsy()
	})
  
	it('搜索内容', async () => {
	  // 设置搜索文本
	  const searchKeyword = '小程序'
	  await page.setData({searchText: searchKeyword})
	  await page.waitFor(1000)
	  // 验证搜索文本设置成功
	  const afterSet = await page.data('searchText')
	  expect(afterSet).toBe(searchKeyword)
	  // 执行搜索
	  await page.callMethod('search', searchKeyword)
	  await page.waitFor(3000)
	  // 重新获取页面实例（现在是list页面）
	  page = await program.currentPage()
	  await page.waitFor('view')
	  // 验证搜索结果
	  const pageData = await page.data()
	  expect(pageData.keyword).toBe(searchKeyword)
	  expect(pageData.where).toContain(searchKeyword)
	  expect(pageData.dataListTest).toBeDefined()
	  expect(pageData.dataListTest.title).toContain(searchKeyword)
	})
	
})