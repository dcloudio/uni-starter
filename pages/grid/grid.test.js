jest.setTimeout(20000)
describe('grid', () => {
	let page, hasLogin;
	beforeAll(async () => {
		page = await program.switchTab('/pages/grid/grid')
		await page.waitFor('view')
    if(process.env.UNI_PLATFORM === "mp-weixin"){
      await page.waitFor(5000)
    }else{
      await page.waitFor(2000)
    }
	})
	it('检测宫格', async () => {
		hasLogin = await page.data('hasLogin')
		let gridList = await page.data('gridList')
		console.log("gridList", gridList.length,hasLogin)
		expect(gridList.length).toBe(9)
	})
	it('点击宫格', async () => {
		const perPage = await page.$$('.grid-item-box')
		for (var i = 0; i < perPage.length; i++) {
			await perPage[i].tap()
			await page.waitFor(300)
		}
	})
});