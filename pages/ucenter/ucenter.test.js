jest.setTimeout(30000);
describe('ucenter', () => {
	let page, hasLogin, isApp;
	if (process.env.uniTestPlatformInfo == 'ios_simulator 13.7') {
		it('ios13.7', async () => {
			expect(1).toBe(1)
		})
		return
	}
	beforeAll(async () => {
		page = await program.switchTab('/pages/ucenter/ucenter')
		await page.waitFor('view')
		hasLogin = await page.callMethod('hasLoginTest')
		console.log('hasLogin: ',hasLogin);
		isApp = process.env.UNI_PLATFORM.startsWith("app")
	})
	it('验证登录状态', async () => {
		const notLoggedText = await page.$('.uer-name')
		const userNameText = await notLoggedText.text()
		if (!hasLogin) {
			expect(userNameText).toBe('未登录')
			return
		}
		expect(userNameText).not.toBe('未登录')
	})
	it('验证宫格列表', async () => {
		const gridList = await page.data('gridList')
		expect(gridList.length).toBe(4)
		const gridItems = await page.$$('.grid .item')
		expect(gridItems.length).toBe(4)
	})
	it('验证功能列表', async () => {
		const ucenterList = await page.data('ucenterList')
		if (isApp) {
			expect(ucenterList.length).toBe(3)
		} else {
			expect(ucenterList.length).toBe(2)
		}
	})
	it('验证签到功能', async () => {
		if (!hasLogin) return
		if (isApp) {
			await page.callMethod('signInByAd')
			await page.waitFor(1000)
		} else {
			await page.callMethod('signIn')
		}
	})
	it('验证积分功能', async () => {
		if (!hasLogin) return
		const scoreRes = await page.callMethod('getScore')
		if (scoreRes.score) {
			expect(scoreRes.score).not.toBeUndefined()
			expect(scoreRes.balance).toBeGreaterThanOrEqual(scoreRes.score)
		}
	})
});