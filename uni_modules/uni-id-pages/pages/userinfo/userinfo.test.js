// uni-app自动化测试教程: https://uniapp.dcloud.io/collocation/auto/hbuilderx-extension/index
const PAGE_PATH = '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
jest.setTimeout(30000);

describe('用户信息页面测试', () => {
	let page;
	let userInfo;
	let token;
	
	// 在所有测试开始前执行
	beforeAll(async () => {
		page = await program.navigateTo(PAGE_PATH)
		await page.waitFor("view")
		await page.waitFor(1000)
		
		// 检查登录状态
		token = await program.callUniMethod('getStorageSync', 'uni_id_token')
		if (!token) {
			console.log('用户未登录，请先登录')
			it('未登录', async () => {
				expect(1).toBe(1)
			})
			return
		}
		// 更新用户信息
		userInfo = await page.callMethod('updateUserInfoForTest')
		await page.waitFor(1000)
		// 断言userInfo的各个字段
		expect(userInfo).toBeTruthy()
		expect(userInfo._id).toBeTruthy()
		expect(userInfo.username).toBe('dcloud')
		expect(userInfo.nickname).toBeTruthy()
		expect(userInfo.realNameAuth).toEqual({ errCode: 0, realName: '', identity: '' })
		const showLoginManage = await page.data('showLoginManage')
		expect(showLoginManage).toBe(false)
		await page.setData({'showLoginManage':true})
	});

	it('基本信息', async () => {
		const listItems = await page.$$('.item')
		expect(listItems.length).toBeGreaterThan(0)
	});

	it('修改昵称', async () => {
		const nickname = "测试用户" + Math.round(Math.random() * 1000)
		await page.waitFor(300)
		await page.callMethod("setNickname", nickname)
		await page.waitFor(1000) // 等待更新完成
		// 验证昵称是否更新成功
		const updatedUserInfo = await page.callMethod('updateUserInfoForTest')
		console.log('updatedUserInfo:', updatedUserInfo)
		expect(updatedUserInfo.nickname).toBe(nickname)
	});
	
	it('显示退出登录按钮', async () => {
		await page.waitFor(1000)
		expect(await page.data('showLoginManage')).toBe(true)
		const logoutButton = await page.$$('button')
		const buttonText = await logoutButton[1].text()
		expect(buttonText).toBe('退出登录')
	});
});