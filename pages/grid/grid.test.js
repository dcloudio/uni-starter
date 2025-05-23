jest.setTimeout(20000)
describe('grid', () => {
	let page;
	beforeAll(async () => {
		page = await program.switchTab('/pages/grid/grid')
		await page.waitFor('view')
		// 根据平台设置合理的等待时间
		const waitTime = process.env.UNI_PLATFORM === "mp-weixin" ? 5000 : 2000
		await page.waitFor(waitTime)
	})

	it('显示banner图片', async () => {
		// 等待图片加载完成
		await page.waitFor(5000)
		const images = await page.$$('.banner-image')
		// 验证banner图片数量
		expect(images.length).toBe(2)
		// 验证第一张图片的src
		const src = await images[0].property('src')
		expect(src).toBe('https://web-assets.dcloud.net.cn/unidoc/zh/shuijiao.jpg')
	})

	it('根据登录状态显示正确的宫格数量', async () => {
		const hasLogin = await page.data('hasLogin')
		const grids = await page.$$('.text')
		// 验证宫格数量
		if (hasLogin) {
			expect(grids.length).toBe(9)
			expect(await grids[3].text()).toBe('游客不可见')
		} else {
			expect(grids.length).toBe(3)
		}
		// 验证第一个宫格文本
		expect(await grids[0].text()).toBe('所有人可见')
	})

	it('宫格点击事件', async () => {
		const gridItems = await page.$$('.grid-item-box')
		expect(gridItems.length).toBeGreaterThan(0)
		for (const item of gridItems) {
			// 执行点击
			await item.tap()
			// 等待点击响应
			await page.waitFor(500)
		}
	})
})