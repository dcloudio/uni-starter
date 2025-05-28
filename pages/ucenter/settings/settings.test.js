jest.setTimeout(30000);
const platformInfo = process.env.uniTestPlatformInfo.toLocaleLowerCase()
const isHarmony = platformInfo.startsWith('harmony')
const ios = platformInfo.startsWith('ios')
describe('settings', () => {
	let page, hasLogin,listItems;
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
	})
	it('根据登录状态动态测试', async () => {
		const bottomBtn = await page.$('.bottom-back-text')
		if (!hasLogin) {
			// 未登录时验证按钮文本为"登录"
			expect(await bottomBtn.text()).toBe('登录')
			return;
		}
		// 验证已登录时按钮文本为"退出登录"
		expect(await bottomBtn.text()).toBe('退出登录')
		listItems = await page.$$('.uni-list-item')
		// 已登录时
		const isApp = process.env.UNI_PLATFORM.startsWith("app")
		if (!isApp) {
			// H5平台验证
			expect(listItems.length).toBe(1)
			const itemText = await listItems[0].text()
			expect(itemText).toBe('账号资料')
			return
		}
		// 验证APP端列表项内容
		expect(listItems.length).toBeGreaterThan(0)
		const texts = []
		for (let i = 0; i < listItems.length; i++) {
		  // 去除首尾空格和换行符
		  texts.push((await listItems[i].text()).trim()) 
		}
		console.log('texts: ',texts);
		expect(texts).toContain('账号资料');
		if (!isHarmony) {
			expect(texts).toContain('清理缓存');
			expect(texts).toContain('推送功能');
			unlockText = ios ? '人脸解锁' : '指纹解锁'
		}
		expect(texts).toContain(unlockText);
		await page.callMethod('clearTmp')
		const pushRes = await page.data('pushIsOn')
		if (pushRes == "wait" && !isHarmony) {
			await page.callMethod('pushServer.off')
		}
		await page.callMethod('changeLoginState')
	});
});