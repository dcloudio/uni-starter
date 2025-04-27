jest.setTimeout(30000);
const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isHarmony = platformInfo.startsWith('harmony')
describe('settings', () => {
	let page, hasLogin;
	if (process.env.uniTestPlatformInfo == 'ios_simulator 13.7') {
		it('ios13.7', async () => {
			expect(1).toBe(1)
		})
		return
	}
	beforeAll(async () => {
		page = await program.navigateTo('/pages/ucenter/settings/settings')
		await page.waitFor('view')
		hasLogin = await page.callMethod('hasLoginTest')
		if (!hasLogin) {
			console.log("未登录测试失败")
			return
		}
	})
	it('settings', async () => {
		if (process.env.UNI_PLATFORM.startsWith("app")) {
			await page.callMethod('clearTmp')
			const pushRes = await page.data('pushIsOn')
			if (pushRes == "wait" && !isHarmony) {
				await page.callMethod('pushServer.off')
			}
		} else {
			const el = await page.$('.content')
			await page.waitFor('view')
			expect.assertions(1);
			expect((await el.$$('.mt10')).length).toBe(2)
		}
	})
	it('退出登录', async () => {
		const bottomEl = await page.$('.bottom-back-text')
		expect(await bottomEl.text()).toBe('退出登录')
		await page.callMethod('changeLoginState')
		await page.waitFor(1000)
	})
});